/* ═══ فرحة — استوديو الأغنية ═══
   Fitting a song to a film by typing two numbers into boxes asks someone to
   do in their head the one thing only ears can do. This puts the film and the
   song in front of each other: the film plays, the song's shape is drawn, and
   the piece of it you have chosen is dragged with a finger.

   The rule that makes it work is that any change starts both over. Move the
   start, let go, and the film begins again on that note — so you judge the
   pairing the same way a guest will meet it, from the top, every time.

   Time runs left to right here even though the dashboard is right to left.
   Every waveform anyone has ever seen runs that way, and a mirrored one is
   read wrong before it is read at all. */

let STU = null;
const STU_CACHE = {};          /* decoded peaks per url — decoding is slow */

function sndStudioSrc (id) {
  const o = (CFG.films || {})[id] || {};
  let f = null;
  try { f = readyCatalogue().find((x) => x.id === id) || null; } catch (e) {}
  return {
    url: o.snd || (f && f.snd) || '',
    vid: (f && f.v) || '',
    poster: (f && f.p) || '',
    name: (o.nm && o.nm.trim()) || (f && f.name && f.name.ar) || id,
    song: (o.sndN || (f && f.sndN) || '').trim()
  };
}

/* ---------- the drawing ---------- */

/* One pair of extremes per column of pixels. Anything finer is invisible and
   anything coarser stops looking like the song. */
function stuPeaks (buf, cols) {
  const ch = buf.getChannelData(0);
  const per = Math.floor(ch.length / cols) || 1;
  const out = new Float32Array(cols * 2);
  for (let c = 0; c < cols; c++) {
    let lo = 0, hi = 0;
    const s = c * per, e = Math.min(ch.length, s + per);
    for (let i = s; i < e; i++) { const v = ch[i]; if (v < lo) lo = v; if (v > hi) hi = v; }
    out[c * 2] = lo; out[c * 2 + 1] = hi;
  }
  return out;
}

function stuDraw () {
  if (!STU || !STU.cv) return;
  const cv = STU.cv, dpr = window.devicePixelRatio || 1;
  const w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;
  if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); STU.peaks = null; }
  const g = cv.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);
  if (!STU.buf) return;
  if (!STU.peaks || STU.peaksFor !== w) { STU.peaks = stuPeaks(STU.buf, Math.round(w)); STU.peaksFor = w; }

  const dur = STU.buf.duration, mid = h / 2;
  const x = (t) => (t / dur) * w;
  const a = x(STU.st), b = x(STU.en);

  /* everything outside the chosen piece is dimmed rather than hidden — you
     still need to see what is on either side to know where to move to */
  for (let c = 0; c < STU.peaks.length / 2; c++) {
    const lo = STU.peaks[c * 2], hi = STU.peaks[c * 2 + 1];
    const inside = c >= a && c <= b;
    g.fillStyle = inside ? '#B98A2F' : 'rgba(160,140,105,.30)';
    const y1 = mid - hi * mid * 0.92, y2 = mid - lo * mid * 0.92;
    g.fillRect(c, y1, 1, Math.max(1, y2 - y1));
  }

  /* the chosen piece */
  g.fillStyle = 'rgba(185,138,47,.10)';
  g.fillRect(a, 0, b - a, h);
  g.strokeStyle = '#8A6210'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(a, 0); g.lineTo(a, h); g.moveTo(b, 0); g.lineTo(b, h); g.stroke();

  /* handles you can actually hit with a thumb */
  g.fillStyle = '#8A6210';
  [a, b].forEach((p) => { g.fillRect(p - 5, mid - 18, 10, 36); });
  g.fillStyle = '#FBF7EF';
  [a, b].forEach((p) => { g.fillRect(p - 1.5, mid - 9, 1, 18); g.fillRect(p + 0.5, mid - 9, 1, 18); });

  /* where the song is right now */
  if (STU.playing) {
    const p = x(stuPos());
    g.strokeStyle = '#C0392B'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(p, 0); g.lineTo(p, h); g.stroke();
  }
}

/* ---------- the numbers under it ---------- */
function stuLabel () {
  if (!STU) return;
  const el = document.getElementById('stulab'); if (!el) return;
  const len = STU.en - STU.st;
  const loops = STU.filmDur ? (len / STU.filmDur) : 0;
  el.innerHTML =
    '<b>' + STU.st.toFixed(1) + 'ث</b> ← <b>' + STU.en.toFixed(1) + 'ث</b>' +
    ' <span>(' + len.toFixed(1) + 'ث)</span>' +
    (STU.filmDur
      ? '<span class="stuloop">الفيلم ' + STU.filmDur.toFixed(1) + 'ث · ' +
        (Math.abs(loops - Math.round(loops)) < 0.06
          ? 'يدور ' + Math.round(loops) + ' مرّة بالضبط ✓'
          : 'يدور ' + loops.toFixed(1) + ' مرّة') + '</span>'
      : '');
  const t = document.getElementById('stutime');
  if (t) t.textContent = stuPos().toFixed(1) + 'ث';
}

/* ---------- the thing that makes it usable ---------- */
/* The song is played from the buffer that was already decoded to draw the
   wave, not from an <audio> element. An element has to be seeked, and a seek
   is dropped whenever the file is not ready or the host will not answer a
   byte range — so the first press would quietly play from the beginning
   instead of from the chosen note. A buffer is simply started at an offset:
   exact every time, and instant, which is what makes dragging an edge and
   hearing the result feel like one action. */
function stuPos () {
  if (!STU || !STU.buf) return 0;
  if (!STU.playing) return STU.st;
  return Math.min(STU.en, STU.st + (STU.ctx.currentTime - STU.t0));
}

function stuStopSrc () {
  if (STU && STU.src) { try { STU.src.onended = null; STU.src.stop(); } catch (e) {} STU.src = null; }
}

/* Any change starts the pair over, so the film is always judged against the
   song from its first frame — which is the only moment that has to land. */
function stuRestart () {
  if (!STU) return;
  stuStopSrc();
  try { if (STU.vid) STU.vid.currentTime = 0; } catch (e) {}
  if (STU.playing) {
    const src = STU.ctx.createBufferSource();
    src.buffer = STU.buf;
    src.connect(STU.gain);
    src.start(0, STU.st);
    STU.src = src;
    STU.t0 = STU.ctx.currentTime;
    if (STU.vid) STU.vid.play().catch(() => {});
  }
  stuLabel();
}

function stuPlay (on) {
  if (!STU) return;
  STU.playing = on === undefined ? !STU.playing : !!on;
  const b = document.getElementById('stuplay');
  if (b) b.textContent = STU.playing ? '⏸' : '▶';
  if (STU.ctx.state === 'suspended') STU.ctx.resume();
  if (STU.playing) stuRestart();
  else { stuStopSrc(); try { STU.vid.pause(); } catch (e) {} stuDraw(); }
}

function stuTick () {
  if (!STU) return;
  if (STU.playing) {
    /* the end of the piece sends both back to the top together */
    if (stuPos() >= STU.en - 0.04) stuRestart();
    stuDraw(); stuLabel();
  }
  STU.raf = requestAnimationFrame(stuTick);
}

/* ---------- moving the edges ---------- */
function stuSet (which, t, live) {
  if (!STU) return;
  const dur = STU.buf ? STU.buf.duration : 0;
  const MIN = 1;
  t = Math.max(0, Math.min(dur, Math.round(t * 10) / 10));
  if (which === 'st') STU.st = Math.min(t, STU.en - MIN);
  else STU.en = Math.max(t, STU.st + MIN);
  if (STU.st < 0) STU.st = 0;
  if (STU.en > dur) STU.en = dur;
  stuDraw(); stuLabel();
  /* While a handle is still under the finger nothing restarts — the film
     beginning again sixty times a second would be unwatchable, and the sound
     would be a stutter rather than a note. The pair starts over on release. */
  if (!live) stuRestart();
}

function stuNudge (which, by) { if (STU) stuSet(which, (which === 'st' ? STU.st : STU.en) + by); }

/* Make the piece exactly as long as the film goes round — then the last frame
   and the last note arrive together, every loop, which is the whole point. */
function stuSnap (loops) {
  if (!STU || !STU.filmDur) return;
  const dur = STU.buf.duration;
  let en = STU.st + STU.filmDur * loops;
  if (en > dur) { en = dur; toast('الأغنية أقصر من ذلك'); }
  STU.en = Math.round(en * 10) / 10;
  stuDraw(); stuRestart();
}

function stuWhole () { if (STU) { STU.st = 0; STU.en = STU.buf.duration; stuDraw(); stuRestart(); } }

/* ---------- open and close ---------- */
function stuSave () {
  if (!STU) return;
  const whole = STU.st <= 0.05 && STU.en >= STU.buf.duration - 0.05;
  ctlFilmTrim(STU.id, 'snd0', whole ? 0 : STU.st);
  ctlFilmTrim(STU.id, 'snd1', whole ? 0 : STU.en);
  toast(whole ? 'الأغنية كاملة ✓' : 'حُفظ المقطع ✓');
  sndStudioClose();
  renderContent();
}

function sndStudioClose () {
  if (!STU) return;
  cancelAnimationFrame(STU.raf);
  stuStopSrc();
  try { STU.ctx.close(); } catch (e) {}
  try { STU.vid.pause(); } catch (e) {}
  const el = document.getElementById('stuveil'); if (el) el.remove();
  document.removeEventListener('keydown', STU.keys);
  STU = null;
  if (typeof scrollSync === 'function') scrollSync();
  else document.body.style.overflow = '';
}

async function sndStudio (id) {
  const s = sndStudioSrc(id);
  if (!s.url) { toast('لا موسيقى لهذا الفيلم بعد — ارفعوا أغنية أوّلًا'); return; }
  if (typeof sndStop === 'function') sndStop();
  if (typeof VIDLIVE !== 'undefined' && VIDLIVE !== null) { VIDLIVE = null; renderContent(); }
  sndStudioClose();

  const o = (CFG.films || {})[id] || {};
  const veil = document.createElement('div');
  veil.id = 'stuveil';
  veil.innerHTML =
   `<div class="stu">
      <div class="stu-h">
        <b>🎬 اضبطوا الأغنية على الفيلم</b>
        <em>${escA(s.name)}${s.song ? ' · ' + escA(s.song) : ''}</em>
        <button class="stu-x" onclick="sndStudioClose()" title="إغلاق">✕</button>
      </div>
      <div class="stu-b">
        <div class="stu-v">
          <video id="stuvid" playsinline muted loop preload="auto"
                 poster="${escA(s.poster)}" src="${escA(s.vid)}"></video>
        </div>
        <div class="stu-c">
          <div class="stu-wrap">
            <canvas id="stucv"></canvas>
            <div class="stu-load" id="stuload">جارٍ قراءة الأغنية…</div>
          </div>
          <div class="stu-t">
            <button class="act gold" id="stuplay" onclick="stuPlay()">▶</button>
            <span class="stu-now" id="stutime">0.0ث</span>
            <div class="stu-lab" id="stulab"></div>
          </div>
          <div class="stu-n">
            <span>البداية</span>
            <button class="act" onclick="stuNudge('st',-1)">−1ث</button>
            <button class="act" onclick="stuNudge('st',-0.1)">−0.1</button>
            <button class="act" onclick="stuNudge('st',0.1)">+0.1</button>
            <button class="act" onclick="stuNudge('st',1)">+1ث</button>
          </div>
          <div class="stu-n">
            <span>النهاية</span>
            <button class="act" onclick="stuNudge('en',-1)">−1ث</button>
            <button class="act" onclick="stuNudge('en',-0.1)">−0.1</button>
            <button class="act" onclick="stuNudge('en',0.1)">+0.1</button>
            <button class="act" onclick="stuNudge('en',1)">+1ث</button>
          </div>
          <div class="stu-n stu-snap">
            <span>اجعلوا المقطع بطول</span>
            <button class="act" onclick="stuSnap(1)">دورة</button>
            <button class="act" onclick="stuSnap(2)">دورتين</button>
            <button class="act" onclick="stuSnap(3)">٣ دورات</button>
            <button class="act" onclick="stuSnap(4)">٤ دورات</button>
          </div>
          <div class="stu-f">
            <button class="act" onclick="stuWhole()">الأغنية كاملة</button>
            <button class="act gold" onclick="stuSave()">حفظ المقطع ✓</button>
          </div>
          <p class="stu-hint">اسحبوا طرفَي المقطع على الموجة. كلّما غيّرتم شيئًا يبدأ
           الفيلم والأغنية من جديد معًا، فتسمعون وترون ما سيصل الضيف تمامًا.</p>
        </div>
      </div>
    </div>`;
  document.body.appendChild(veil);
  document.body.style.overflow = 'hidden';

  const vid = document.getElementById('stuvid');
  const cv = document.getElementById('stucv');
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const gain = ctx.createGain(); gain.gain.value = 0.9; gain.connect(ctx.destination);

  STU = { id, cv, vid, ctx, gain, src: null, t0: 0,
          st: +o.snd0 || 0, en: 0, buf: null, playing: false,
          filmDur: 0, raf: 0, keys: null };

  vid.addEventListener('loadedmetadata', () => { STU && (STU.filmDur = vid.duration || 0); stuLabel(); });

  /* the shape of the song */
  try {
    const key = s.url;
    if (STU_CACHE[key]) STU.buf = STU_CACHE[key];
    else {
      STU.buf = await ctx.decodeAudioData(await fetch(s.url).then((r) => r.arrayBuffer()));
      STU_CACHE[key] = STU.buf;
    }
  } catch (e) { toast('تعذّرت قراءة الأغنية'); sndStudioClose(); return; }
  if (!STU) return;

  const dl = document.getElementById('stuload'); if (dl) dl.remove();
  STU.en = (+o.snd1 || 0) > STU.st + 1 ? +o.snd1 : STU.buf.duration;
  if (STU.st >= STU.buf.duration) STU.st = 0;

  /* dragging the edges */
  let grab = null;
  const at = (ev) => {
    const r = cv.getBoundingClientRect();
    const px = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
    return Math.max(0, Math.min(1, px / r.width)) * STU.buf.duration;
  };
  /* whichever edge is nearer is the one being moved — there is no third thing
     to grab, so a tap anywhere is unambiguous */
  const down = (ev) => {
    const t = at(ev);
    grab = Math.abs(t - STU.st) <= Math.abs(t - STU.en) ? 'st' : 'en';
    stuSet(grab, t, true);
    ev.preventDefault();
  };
  const move = (ev) => { if (grab) { stuSet(grab, at(ev), true); ev.preventDefault(); } };
  const up = () => { if (grab) { grab = null; stuRestart(); } };
  cv.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);

  STU.keys = (ev) => {
    if (!STU) return;
    if (ev.key === 'Escape') { sndStudioClose(); return; }
    if (ev.key === ' ') { ev.preventDefault(); stuPlay(); return; }
    if (ev.key === 'ArrowLeft') { stuNudge(ev.shiftKey ? 'en' : 'st', -0.1); ev.preventDefault(); }
    if (ev.key === 'ArrowRight') { stuNudge(ev.shiftKey ? 'en' : 'st', 0.1); ev.preventDefault(); }
  };
  document.addEventListener('keydown', STU.keys);

  stuDraw(); stuLabel();
  STU.raf = requestAnimationFrame(stuTick);
  stuPlay(true);
}

window.addEventListener('resize', () => { if (STU) { STU.peaks = null; stuDraw(); } });
