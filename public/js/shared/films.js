/* ================= the ready-made catalogue =================
   Loaded by both the site and the dashboard. It used to live only in the
   site bundle with the dashboard keeping a hand-copied list beside it, which
   drifted four films behind before anyone noticed. One source now.

   FILMS_BUILTIN ships with the code. Anything the owner adds from the
   dashboard lives in CFG.media.readyFilms and is merged on top by
   readyCatalogue(), so both pages always see the same shelf.

   One song per film, and no song twice — sndN below is the record of which
   is spoken for. Still unused from the songs we hold:
     إليسا — عيشالك
   Most tracks in /media/snd are 60-second Opus excerpts cut from the loudest
   part of a song. Two carry the sound that came with their own footage
   instead: بياض, and أوّل أغنية — thirty-three seconds of a needle on a
   record, which is why that film and its song are the same length. All of them are
   levelled to the same loudness, and none of them is allowed past the
   ceiling — the gain is whichever is smaller, the one that matches or the
   one that keeps the loudest sample under full scale. */

const FILMS_BUILTIN=[
 /* ── weddings ── */
 {id:'marble',cat:'wed',v:'/media/inv/inv-1.mp4',p:'/media/inv/inv-1.jpg',design:2,
  name:{ar:'قصر الرخام',fr:'Palais de Marbre',en:'Marble Palace'},
  blurb:{ar:'سلالم رخامية وأكاليل ورد باهت الوردة، وأعمدة تصعد نحو النور',
   fr:'Un escalier de marbre, des guirlandes de roses poudrées et des colonnes qui montent vers la lumière',
   en:'A marble staircase, garlands of powder-rose blooms and columns rising into the light'},
  dress:{ar:['أنيق رسمي','بدلة داكنة · فستان طويل'],fr:['Tenue de soirée','Costume sombre · robe longue'],en:['Black tie optional','Dark suit · long dress']},
  sw:['#43342A','#AE7E70','#EFDFC2'],
  snd:'/media/snd/marble.webm',sndN:'حسين الجسمي — فستانك الأبيض'},
 {id:'oneday',cat:'wed',v:'/media/inv/inv-2.mp4',p:'/media/inv/inv-2.jpg',design:3,
  name:{ar:'يومًا ما',fr:'One Day',en:'One Day'},
  blurb:{ar:'أبيض وأسود: كعبٌ وشمبانيا وعلبة خواتم على التول… ووعدٌ مكتوب بخفة',
   fr:'Noir et blanc : escarpins, champagne et un écrin sur le tulle… une promesse écrite tout en légèreté',
   en:'Black and white: heels, champagne and a ring box on tulle… a promise written lightly'},
  dress:{ar:['أبيض وأسود','بلا ألوان — أناقة صافية'],fr:['Noir et blanc','Sans couleur — élégance pure'],en:['Black and white','No colour — pure elegance']},
  sw:['#1A1A1D','#8E8A86','#EDEDEF'],
  snd:'/media/snd/oneday.webm',sndN:'Christina Perri — A Thousand Years'},
 {id:'wisteria',cat:'wed',v:'/media/inv/inv-4.mp4',p:'/media/inv/inv-4.jpg',design:4,
  name:{ar:'ظلال الوستارية',fr:'Ombres de Glycine',en:'Wisteria Shade'},
  blurb:{ar:'وستارية تتهدّل على بابٍ عاجي بحلقةٍ ذهبية، والضوء يرقص بين الأوراق',
   fr:"Une glycine retombe sur une porte ivoire cerclée d'or, la lumière danse entre les feuilles",
   en:'Wisteria spilling over an ivory door ringed in gold, light dancing through the leaves'},
  dress:{ar:['أنيق ربيعي','ألوان فاتحة · لمسة ليلكية'],fr:['Chic printanier','Tons clairs · une touche lilas'],en:['Spring formal','Light tones · a touch of lilac']},
  sw:['#3B3326','#8E7AA0','#EADCBC'],
  snd:'/media/snd/wisteria.webm',sndN:'مهى فتوني — أجمل فرحة'},
 {id:'rings',cat:'wed',v:'/media/inv/inv-3.mp4',p:'/media/inv/inv-3.jpg',design:1,
  name:{ar:'خواتم النور',fr:'Anneaux de Lumière',en:'Rings of Light'},
  blurb:{ar:'خاتمان على أرضٍ كالمرآة، ونافذةٌ مقوّسة يعبرها ظلُّ العروس',
   fr:"Deux anneaux sur un sol-miroir et une fenêtre en arche que traverse l'ombre de la mariée",
   en:"Two rings on a mirrored floor, and an arched window the bride's silhouette passes through"},
  dress:{ar:['أنيق كلاسيكي','أزرق داكن · عاجي'],fr:['Classique élégant','Bleu profond · ivoire'],en:['Classic formal','Deep blue · ivory']},
  sw:['#2C3742','#5E88AA','#E6D6BE'],
  snd:'/media/snd/rings.webm',sndN:'Ludovico Einaudi — Nuvole Bianche'},

 /* ── birthdays ── */
 {id:'bdaycake',cat:'bday',icon:'candle',font:'cairo',v:'/media/inv/bday-cake.mp4',p:'/media/inv/bday-cake.jpg',design:7,
  name:{ar:'شمعة العام',fr:'La Bougie',en:'One Candle'},
  blurb:{ar:'شمعةٌ واحدة فوق كعكة، وورودٌ داكنة حولها، والضوء وحده يحتفل',
   fr:'Une seule bougie sur le gâteau, des fleurs sombres autour, et la lumière qui fête toute seule',
   en:'A single candle on the cake, dark blooms around it, and only the light celebrating'},
  dress:{ar:['أحمر وأسود','لمسة جريئة تكفي'],fr:['Rouge et noir','Une touche audacieuse suffit'],en:['Red and black','One bold touch is enough']},
  sw:['#3A2018','#BE3325','#E9DDCB']},
 {id:'bdayballoons',cat:'bday',icon:'candle',font:'cairo',v:'/media/inv/bday-balloons.mp4',p:'/media/inv/bday-balloons.jpg',design:7,
  name:{ar:'بالونات وردية',fr:'Ballons Poudrés',en:'Blush Balloons'},
  blurb:{ar:'بالوناتٌ وردية وهدايا وباقةٌ صغيرة — فرحٌ خفيف بلا ضجيج',
   fr:'Ballons poudrés, cadeaux et un petit bouquet — une joie légère, sans bruit',
   en:'Blush balloons, gifts and a small bouquet — light joy, no noise'},
  dress:{ar:['وردي وناعم','ألوان الباستيل'],fr:['Rose et doux','Teintes pastel'],en:['Blush and soft','Pastel tones']},
  sw:['#4A2E2A','#D48CA0','#EEDDD8']},

 /* ── newborns ── */
 {id:'babybasket',cat:'baby',icon:'crib',font:'cairo',v:'/media/inv/baby-basket.mp4',p:'/media/inv/baby-basket.jpg',design:8,
  name:{ar:'قدمان صغيرتان',fr:'Deux Petits Pieds',en:'Two Small Feet'},
  blurb:{ar:'قدمان صغيرتان في سلّةٍ من القشّ — أهدأ إعلانٍ يمكن أن ترسلوه',
   fr:"Deux petits pieds dans un couffin d'osier — l'annonce la plus douce qui soit",
   en:'Two small feet in a woven basket — the gentlest announcement there is'},
  sw:['#4A4036','#D1815E','#EEDCCB']},
 {id:'babycake',cat:'baby',icon:'crib',font:'cairo',v:'/media/inv/baby-cake.mp4',p:'/media/inv/baby-cake.jpg',design:8,
  name:{ar:'أهلًا يا صغير',fr:'Oh Baby',en:'Oh Baby'},
  blurb:{ar:'كعكةٌ بيضاء على لحافٍ ناعم، وكلمتان مكتوبتان بالكريمة',
   fr:'Un gâteau blanc sur une couverture douce, et deux mots écrits à la crème',
   en:'A white cake on a soft quilt, and two words piped in cream'},
  sw:['#3F3E3D','#8E8578','#E2E0D8']},

 /* ── graduation ── */
 {id:'grad',cat:'grad',icon:'cap',font:'cairo',v:'/media/inv/grad.mp4',p:'/media/inv/grad.jpg',design:6,
  name:{ar:'قبّعة وورد',fr:'Toque et Roses',en:'Cap and Roses'},
  blurb:{ar:'قبّعة التخرّج وباقةٌ من الورد الوردي تحت سماءٍ صافية',
   fr:'La toque et un bouquet de roses sous un ciel clair',
   en:'The cap and an armful of pink roses under a clear sky'},
  dress:{ar:['أنيق نهاري','ألوان فاتحة'],fr:['Chic de jour','Tons clairs'],en:['Daytime smart','Light tones']},
  sw:['#1C2030','#C86A8A','#D8DEEE'],
  snd:'/media/snd/grad.webm',sndN:'بيانو التخرّج'},

 /* ── henna night ── */
 {id:'henna',cat:'henna',icon:'henna',font:'amiri',v:'/media/inv/henna.mp4',p:'/media/inv/henna.jpg',design:10,
  name:{ar:'ليلة الحنّة',fr:'Nuit du Henné',en:'Henna Night'},
  blurb:{ar:'ورد قرمزي في جرارٍ من فخّار، وضوءٌ دافئ على الجدار — ليلة الحنّة كما هي',
   fr:'Des fleurs carmin dans des jarres de terre cuite et une lumière chaude sur le mur — la nuit du henné',
   en:'Carmine blooms in clay jars and warm light on the wall — the henna night as it is'},
  dress:{ar:['قفطان أو جبّة','أحمر وذهبي — كما تقتضي الليلة'],
   fr:['Caftan ou jebba','Rouge et or, comme le veut la nuit'],
   en:['Caftan or jebba','Red and gold, as the night asks']},
  sw:['#3A211C','#8E221C','#EBDCC6'],
  snd:'/media/snd/henna.webm',sndN:'جيبوا الحنّة'},


 /* ── four more weddings ── */
 {id:'zellij',cat:'wed',v:'/media/inv/zellij.mp4',p:'/media/inv/zellij.jpg',design:2,
  name:{ar:'الزليج',fr:'Zellige',en:'The Mosaic Floor'},
  blurb:{ar:'من فوق الدرج: عروسان على أرضٍ من فسيفساء، ودرابزين حديد يحيط بهما',
   fr:"Vu du haut de l'escalier : deux mariés sur une mosaïque, une rampe de fer forgé autour d'eux",
   en:'Seen from the top of the stairs: two of them on a mosaic floor, wrought iron all around'},
  dress:{ar:['أنيق كلاسيكي','بدلة داكنة · فستان طويل'],
   fr:['Élégance classique','Costume sombre · robe longue'],
   en:['Classic elegance','Dark suit · long dress']},
  sw:['#251E1C','#837C79','#CBC7C4'],
  snd:'/media/snd/zellij.webm',sndN:'عمرو دياب — الليلة'},

 {id:'ray',cat:'wed',v:'/media/inv/ray.mp4',p:'/media/inv/ray.jpg',design:4,
  name:{ar:'شعاع',fr:'Rai de lumière',en:'Shaft of Light'},
  blurb:{ar:'أبيض وأسود: طرحة تلتقط النور النازل من نوافذ عالية، ولا شيء غيره',
   fr:'Noir et blanc : un voile qui attrape la lumière tombant de hautes fenêtres, et rien d’autre',
   en:'Black and white: a veil catching the light falling from high windows, and nothing else'},
  dress:{ar:['أبيض وأسود','بلا ألوان — هكذا نحبّها'],
   fr:['Noir et blanc','Sans couleurs — c’est ainsi qu’on l’aime'],
   en:['Black and white','No colour — that is the whole idea']},
  sw:['#1D1A1D','#757275','#DFDDDF'],
  snd:'/media/snd/ray.webm',sndN:'حسين الجسمي — إدخلي عمري'},

 {id:'vow',cat:'wed',v:'/media/inv/vow.mp4',p:'/media/inv/vow.jpg',design:1,
  name:{ar:'يد في يد',fr:'Main dans la main',en:'Hand in Hand'},
  blurb:{ar:'يدان متشابكتان، ساعة وخاتم، وقماشٌ لا يُرى منه إلّا طيّاته',
   fr:'Deux mains nouées, une montre et une bague, et du tissu dont on ne voit que les plis',
   en:'Two hands held, a watch and a ring, and cloth you only see the folds of'},
  dress:{ar:['رسمي هادئ','بدلة رمادية · فستان بسيط'],
   fr:['Formel et sobre','Costume gris · robe simple'],
   en:['Quietly formal','Grey suit · simple dress']},
  sw:['#403E40','#6E6C6E','#B0AEB0'],
  snd:'/media/snd/vow.webm',sndN:'Ed Sheeran — Perfect'},

 {id:'stair',cat:'wed',v:'/media/inv/stair.mp4',p:'/media/inv/stair.jpg',design:3,
  name:{ar:'الدرج الكبير',fr:'Le Grand Escalier',en:'The Grand Staircase'},
  blurb:{ar:'أبيض وأسود: هي تنزل وذيل الفستان يتبعها، وهو ينتظر في الأعلى',
   fr:'Noir et blanc : elle descend, la traîne derrière elle, et lui attend en haut',
   en:'Black and white: she comes down, the train behind her, and he waits at the top'},
  dress:{ar:['أنيق رسمي','بدلة داكنة · فستان طويل'],
   fr:['Tenue de soirée','Costume sombre · robe longue'],
   en:['Black tie optional','Dark suit · long dress']},
  sw:['#3E3C3C','#757273','#BAB7B8'],
  snd:'/media/snd/stair.webm',sndN:'إليسا — عروسة احلامي'},


 {id:'record',cat:'wed',v:'/media/inv/record.mp4',p:'/media/inv/record.jpg',
  name:{ar:'أوّل أغنية',fr:'La Première Chanson',en:'The First Song'},
  blurb:{ar:'يدٌ تُنزل الإبرة على الأسطوانة، والفستان الأبيض ينتظر خلفها',
   fr:'Une main pose l’aiguille sur le disque, la robe blanche attend derrière',
   en:'A hand lowers the needle onto the record, the white dress waiting behind'},
  dress:{ar:['أنيق كلاسيكي','ذهبي دافئ · بنّي عميق'],
   fr:['Classique élégant','Or chaud · brun profond'],
   en:['Classic formal','Warm gold · deep brown']},
  sw:['#160904','#92755F','#F5DFD3'],
  snd:'/media/snd/record.webm',sndN:'صوت الفيلم نفسه'},
 {id:'blanc',cat:'wed',v:'/media/inv/blanc.mp4',p:'/media/inv/blanc.jpg',design:1,
  name:{ar:'بياض',fr:'Blancheur',en:'Whiteness'},
  blurb:{ar:'أبيض وأسود على بياض: يدها موضوعة في يده، ولا شيء آخر في الكادر',
   fr:'Noir et blanc sur blanc : sa main posée dans la sienne, et rien d’autre dans le cadre',
   en:'Black and white on white: her hand laid in his, and nothing else in the frame'},
  dress:{ar:['أبيض وأسود','بلا ألوان — أبسط ما يكون'],
   fr:['Noir et blanc','Sans couleurs — le plus simple possible'],
   en:['Black and white','No colour — as plain as it gets']},
  sw:['#121214','#79797B','#EDECF0'],
  snd:'/media/snd/blanc.webm',sndN:'صوت الفيلم نفسه'},

 /* ── save the date ── */
 /* ── افتتاح الوكالات ──
    Two for a travel agency and two for any opening. These do not use the
    envelope: an agency is announced from behind a curtain, not posted in a
    letter — see envStyle 'curtain'. */
 /* The footage this film used had the word TRAVEL burnt into it at a size
    that landed straight under the agency's Arabic name — flagged twice and
    never fixable in CSS. This clip carries no text at all. */
 {id:'takeoff',cat:'open',layout:'sticky',icon:'compass',font:'kufi',v:'/media/inv/skyline.mp4',p:'/media/inv/skyline.jpg',env:'window',
  name:{ar:'إقلاع',fr:'Décollage',en:'Take Off'},
  blurb:{ar:'مدينة تلمع من فوق، وأبراج تطلع من الضوء — السفر كما يُحكى',
   fr:'Une ville qui brille vue d’en haut et des tours qui montent dans la lumière',
   en:'A city glittering from above and towers rising into the light'},
  dress:{ar:['لباس أنيق','أزرق وذهبي'],fr:['Tenue élégante','Bleu et or'],en:['Smart dress','Blue and gold']},
  sw:['#05070C','#1E7C86','#EDF3F6'],
  snd:'/media/snd/takeoff.webm',sndN:'صوت الفيلم نفسه'},
 {id:'boarding',cat:'open',layout:'sticky',icon:'gate',font:'kufi',v:'/media/inv/boarding.mp4',p:'/media/inv/boarding.jpg',env:'curtain',
  name:{ar:'بوّابة السفر',fr:'La Porte',en:'The Gate'},
  blurb:{ar:'مطار عند الغروب، وطائرة تنتظر عند البوّابة',
   fr:'Un aéroport au crépuscule et un avion qui attend à la porte',
   en:'An airport at dusk, and an aircraft waiting at the gate'},
  dress:{ar:['لباس عمل أنيق','رمادي وكحلي'],fr:['Business chic','Gris et marine'],en:['Business smart','Grey and navy']},
  sw:['#0A0B0E','#4A3E2D','#EFF3F8'],
  snd:'/media/snd/boarding.webm',sndN:'صوت الفيلم نفسه'},
 {id:'grandopen',cat:'open',icon:'bow',font:'kufi',v:'/media/inv/grandopen.mp4',p:'/media/inv/grandopen.jpg',env:'curtain',
  name:{ar:'قريبًا نفتح',fr:'Bientôt',en:'Opening Soon'},
  blurb:{ar:'حرير يتحرّك ببطء، وسطران يقولان إنّ شيئًا جميلًا قادم',
   fr:'De la soie qui bouge lentement, et deux lignes qui annoncent quelque chose de beau',
   en:'Silk moving slowly, and two lines saying something lovely is coming'},
  dress:{ar:['أنيق وهادئ','بيج وعاجي'],fr:['Chic et calme','Beige et ivoire'],en:['Quietly smart','Beige and ivory']},
  sw:['#141110','#8A7461','#F1EDE9'],
  snd:'/media/snd/grandopen.webm',sndN:'موسيقى افتتاح ١'},
 {id:'newdoors',cat:'open',icon:'gate',font:'kufi',v:'/media/inv/newdoors.mp4',p:'/media/inv/newdoors.jpg',env:'curtain',
  name:{ar:'أبواب جديدة',fr:'Portes Ouvertes',en:'New Doors'},
  blurb:{ar:'مقرّ جديد تحت سماء المساء، وماء هادئ وزيتونة',
   fr:'Un nouveau siège sous le ciel du soir, une eau calme et un olivier',
   en:'New premises under an evening sky, still water and an olive tree'},
  dress:{ar:['لباس عمل','ألوان هادئة'],fr:['Tenue de travail','Tons sobres'],en:['Business dress','Quiet tones']},
  sw:['#080A0D','#1E7C86','#F4F1EE'],
  snd:'/media/snd/newdoors.webm',sndN:'موسيقى افتتاح ٢'},
 {id:'soon',cat:'save',icon:'date',font:'kufi',v:'/media/inv/soon.mp4',p:'/media/inv/soon.jpg',design:3,
  name:{ar:'قريبًا',fr:'Bientôt',en:'Coming Soon'},
  blurb:{ar:'حريرٌ عاجي وظلٌّ يتحرك، وسطرٌ واحد: شيءٌ جميل قادم',
   fr:"Soie ivoire, une ombre qui bouge, et une seule ligne : quelque chose de beau arrive",
   en:'Ivory silk, a moving shadow, and one line: something lovely is coming'},
  sw:['#4A3E34','#A58E7C','#E8DDCE']}
];
/* order matters — the chips read in this order */
const RD_CATS=['all','wed','henna','bday','baby','grad','save','open'];

/* Occasions. Custom films may introduce their own, so the chip row is built
   from whatever the catalogue actually contains rather than this list alone. */
const RD_CATLABEL={wed:'wed',henna:'henna',bday:'bday',baby:'baby',grad:'grad',save:'save'};

/* A film the owner built in the dashboard, shaped like a built-in one. */
function readyCustom(){
 try{
  const list=(typeof CFG!=='undefined'&&CFG&&CFG.media&&CFG.media.readyFilms)||[];
  return list.filter(f=>f&&f.id&&f.v).map(f=>({
   id:f.id,cat:f.cat||'wed',v:f.v,p:f.p||f.v.replace(/\.(mp4|webm|mov)$/i,'.jpg'),
   design:f.design||1,_custom:true,
   name:{ar:f.nameAr||f.id,fr:f.nameFr||f.nameAr||f.id,en:f.nameEn||f.nameAr||f.id},
   blurb:{ar:f.blurbAr||'',fr:f.blurbFr||f.blurbAr||'',en:f.blurbEn||f.blurbAr||''},
   dress:null,
   sw:[f.sw0||'#3E3020',f.sw1||'#AE7E70',f.sw2||'#EFDFC2'],
   snd:f.snd||'',sndN:f.sndN||''}));
 }catch(e){return [];}}


/* ═══ النص الافتراضي لكل مناسبة ═══
   A film opened on the shelf, or created in the dashboard, starts with
   placeholder text so the invitation is never empty while it is being filled.
   That text used to be borrowed from the old card designs — each film carried
   a `design:` number whose only remaining job was to point at a name and a
   date. The designs are gone, so the defaults live here, by occasion, which
   is what they were always really keyed on. */
const RD_DEF = {
 wed:{ar:{t:'دعوة زفاف',n:'نور & كريم',d:'14 سبتمبر 2026',p:'قصر الأنوار، تونس',m:'يتشرفان بدعوتكم لمشاركتهما فرحة زفافهما'},
   fr:{t:'Mariage',n:'Nour & Karim',d:'14 · 09 · 2026',p:'Palais El Anouar, Tunis',m:'Nous serions honorés de partager notre bonheur avec vous'},
   en:{t:'Wedding',n:'Nour & Karim',d:'14 · 09 · 2026',p:'El Anouar Palace, Tunis',m:'We would be honored to share our joy with you'}},
 henna:{ar:{t:'ليلة الحنّة',n:'نور',d:'13 سبتمبر 2026',p:'دار العائلة، سيدي بوسعيد',m:'ندعوكم لليلة الحنّة — ليلة فرح وزغاريد'},
   fr:{t:'Soirée du Henné',n:'Nour',d:'13 · 09 · 2026',p:'Maison familiale, Sidi Bou Saïd',m:'Nous vous invitons à la nuit du henné'},
   en:{t:'Henna Night',n:'Nour',d:'13 · 09 · 2026',p:'Family house, Sidi Bou Said',m:'We invite you to our henna night'}},
 bday:{ar:{t:'عيد ميلاد',n:'ياسمين',d:'7 ماي 2026',p:'بيتنا، المرسى',m:'ندعوكم لمشاركتنا فرحة عيد الميلاد'},
   fr:{t:'Anniversaire',n:'Yasmine',d:'07 · 05 · 2026',p:'Chez nous, La Marsa',m:'Nous vous invitons à fêter cet anniversaire avec nous'},
   en:{t:'Birthday',n:'Yasmine',d:'07 · 05 · 2026',p:'Our home, La Marsa',m:'Come and celebrate with us'}},
 baby:{ar:{t:'مولود جديد',n:'آدم',d:'21 مارس 2026',p:'بيتنا، قرطاج',m:'بفرحة كبيرة نبشّركم بقدوم مولودنا'},
   fr:{t:'Naissance',n:'Adam',d:'21 · 03 · 2026',p:'Chez nous, Carthage',m:'C’est avec une immense joie que nous vous annonçons sa naissance'},
   en:{t:'New Baby',n:'Adam',d:'21 · 03 · 2026',p:'Our home, Carthage',m:'With great joy we announce his arrival'}},
 grad:{ar:{t:'حفل تخرّج',n:'سلمى',d:'28 جوان 2026',p:'قاعة الحفلات، تونس',m:'بعد سنوات من التعب، وصلنا — شاركونا الفرحة'},
   fr:{t:'Remise de diplôme',n:'Salma',d:'28 · 06 · 2026',p:'Salle des fêtes, Tunis',m:'Après des années d’efforts — partagez notre joie'},
   en:{t:'Graduation',n:'Salma',d:'28 · 06 · 2026',p:'The great hall, Tunis',m:'After years of work — come and share the joy'}},
 open:{ar:{t:'دعوة افتتاح',n:'وكالة الأفق للأسفار',d:'12 سبتمبر 2026',p:'شارع الحبيب بورقيبة، تونس',m:'يسرّنا دعوتكم لحضور افتتاح مقرّنا الجديد'},
   fr:{t:'Inauguration',n:'Agence Al Ufuq Voyages',d:'12 · 09 · 2026',p:'Avenue Habib Bourguiba, Tunis',m:'Nous avons le plaisir de vous convier à l’inauguration de notre nouvelle agence'},
   en:{t:'Grand Opening',n:'Al Ufuq Travel',d:'12 · 09 · 2026',p:'Avenue Habib Bourguiba, Tunis',m:'We are pleased to invite you to the opening of our new office'}},
 save:{ar:{t:'احفظوا التاريخ',n:'نور & كريم',d:'14 سبتمبر 2026',p:'التفاصيل قريبًا',m:'احفظوا التاريخ — التفاصيل قريبًا'},
   fr:{t:'Réservez la date',n:'Nour & Karim',d:'14 · 09 · 2026',p:'Détails à suivre',m:'Réservez la date — les détails suivront'},
   en:{t:'Save the Date',n:'Nour & Karim',d:'14 · 09 · 2026',p:'Details to follow',m:'Save the date — details to follow'}}
};
/* ═══ كل عرس بأهله ═══
   Every wedding on the shelf used to open on the same couple, the same hall
   and the same five lines of programme, because all ten fell back to
   RD_DEF.wed. Ten films, one wedding — which is the first thing a visitor
   notices after tapping through two of them.

   Each film has its own now, chosen against what is actually in its footage:
   the mosaic floor is married in the medina, the wisteria in a spring garden,
   the record player in a small house in Sidi Bou Said. The dates run across
   two seasons and every one of them is still ahead, so the countdown never
   opens on a wedding that has already happened. Anything written in the
   dashboard still wins over all of it. */
const WED_DEMO = {
 marble:{when:'2026-09-14T17:00',
  ar:{n:'نور & كريم',d:'14 سبتمبر 2026',p:'قصر الأنوار، قمرت',
      m:'يتشرّفان بدعوتكم لمشاركتهما فرحة زفافهما'},
  fr:{n:'Nour & Karim',d:'14 · 09 · 2026',p:'Palais El Anouar, Gammarth',
      m:'Nous serions honorés de partager notre bonheur avec vous'},
  en:{n:'Nour & Karim',d:'14 · 09 · 2026',p:'El Anouar Palace, Gammarth',
      m:'We would be honoured to share our joy with you'},
  prog:{ar:[['17:00','استقبال الضيوف','بهو الأعمدة'],['18:00','عقد القران','القاعة الرخامية'],
        ['19:30','الصور على الدرج','الدرج الكبير'],['20:30','العشاء','القاعة الكبرى'],
        ['22:30','السهرة','الشرفة']],
   fr:[['17:00','Accueil des invités','Hall des colonnes'],['18:00','Cérémonie','Salle de marbre'],
       ['19:30','Photos sur l’escalier','Le grand escalier'],['20:30','Dîner','Grande salle'],
       ['22:30','Soirée','La terrasse']],
   en:[['17:00','Guest welcome','The colonnade'],['18:00','Ceremony','The marble hall'],
       ['19:30','Photographs on the stairs','The grand staircase'],['20:30','Dinner','The great hall'],
       ['22:30','Party','The terrace']]}},

 oneday:{when:'2026-10-03T18:00',
  ar:{n:'سارة & مهدي',d:'3 أكتوبر 2026',p:'الفيلا البيضاء، سيدي بوسعيد',
      m:'قرّرنا أن نبدأ من هنا — وأحببنا أن تكونوا معنا'},
  fr:{n:'Sarra & Mehdi',d:'03 · 10 · 2026',p:'La Villa Blanche, Sidi Bou Saïd',
      m:'Nous commençons ici — et nous vous voulons avec nous'},
  en:{n:'Sarra & Mehdi',d:'03 · 10 · 2026',p:'The White Villa, Sidi Bou Said',
      m:'We are starting here — and we want you with us'},
  prog:{ar:[['18:00','الاستقبال','الفناء الأبيض'],['19:00','التوقيع','الصالون'],
        ['20:00','الصور','السطح'],['21:00','العشاء','القاعة'],['23:00','السهرة','المسبح']],
   fr:[['18:00','Accueil','La cour blanche'],['19:00','Signature','Le salon'],
       ['20:00','Photos','Le toit'],['21:00','Dîner','La salle'],['23:00','Soirée','La piscine']],
   en:[['18:00','Welcome','The white courtyard'],['19:00','The signing','The salon'],
       ['20:00','Photographs','The roof'],['21:00','Dinner','The hall'],['23:00','Party','Poolside']]}},

 wisteria:{when:'2027-05-15T16:30',
  ar:{n:'ليلى & أنيس',d:'15 ماي 2027',p:'دار الجلّولي، الحمّامات',
      m:'في أوّل أيام الوستارية — ندعوكم لفرحنا'},
  fr:{n:'Leila & Anis',d:'15 · 05 · 2027',p:'Dar Jelloulli, Hammamet',
      m:'Aux premiers jours des glycines — venez fêter avec nous'},
  en:{n:'Leila & Anis',d:'15 · 05 · 2027',p:'Dar Jelloulli, Hammamet',
      m:'In the first days of the wisteria — come and celebrate with us'},
  prog:{ar:[['16:30','استقبال في الحديقة','تحت الوستارية'],['17:30','عقد القران','الباب العاجي'],
        ['19:00','الشاي والصور','البرغولا'],['20:30','العشاء','حديقة الليمون'],
        ['22:30','السهرة','الفناء']],
   fr:[['16:30','Accueil au jardin','Sous les glycines'],['17:30','Cérémonie','La porte ivoire'],
       ['19:00','Thé & photos','La pergola'],['20:30','Dîner','Jardin des citronniers'],
       ['22:30','Soirée','La cour']],
   en:[['16:30','Welcome in the garden','Under the wisteria'],['17:30','Ceremony','The ivory door'],
       ['19:00','Tea & photographs','The pergola'],['20:30','Dinner','The lemon garden'],
       ['22:30','Party','The courtyard']]}},

 rings:{when:'2027-06-20T17:30',
  ar:{n:'إيناس & زياد',d:'20 جوان 2027',p:'دار البحر، المرسى',
      m:'خاتمان، وبيتٌ يطلّ على البحر — كونوا هناك'},
  fr:{n:'Ines & Ziad',d:'20 · 06 · 2027',p:'Dar El Bahr, La Marsa',
      m:'Deux anneaux et une maison face à la mer — soyez-y'},
  en:{n:'Ines & Ziad',d:'20 · 06 · 2027',p:'Dar El Bahr, La Marsa',
      m:'Two rings and a house facing the sea — be there'},
  prog:{ar:[['17:30','الاستقبال','الشرفة الزرقاء'],['18:30','تبادل الخواتم','القاعة المقوّسة'],
        ['20:00','الصور عند الغروب','رصيف البحر'],['21:00','العشاء','القاعة'],
        ['23:00','السهرة','السطح']],
   fr:[['17:30','Accueil','La terrasse bleue'],['18:30','Échange des anneaux','La salle en arche'],
       ['20:00','Photos au coucher','Le front de mer'],['21:00','Dîner','La salle'],
       ['23:00','Soirée','Le toit']],
   en:[['17:30','Welcome','The blue terrace'],['18:30','Exchange of rings','The arched hall'],
       ['20:00','Photographs at sunset','The seafront'],['21:00','Dinner','The hall'],
       ['23:00','Party','The roof']]}},

 zellij:{when:'2026-09-26T18:00',
  ar:{n:'ريم & حمزة',d:'26 سبتمبر 2026',p:'دار الباشا، المدينة العتيقة، تونس',
      m:'في دارٍ قديمة وأرضٍ من زليج — ندعوكم'},
  fr:{n:'Rym & Hamza',d:'26 · 09 · 2026',p:'Dar El Bacha, Médina de Tunis',
      m:'Dans une vieille demeure, sur un sol de zellige — nous vous invitons'},
  en:{n:'Rym & Hamza',d:'26 · 09 · 2026',p:'Dar El Bacha, Tunis Medina',
      m:'In an old house, on a floor of zellij — we invite you'},
  prog:{ar:[['18:00','استقبال الضيوف','السقيفة'],['19:00','عقد القران','وسط الدار'],
        ['20:00','الصور من فوق الدرج','الدرابزين'],['21:00','العشاء','القاعة المقبّبة'],
        ['23:00','المزود','وسط الدار']],
   fr:[['18:00','Accueil des invités','La skifa'],['19:00','Cérémonie','Le patio'],
       ['20:00','Photos depuis l’escalier','La rampe'],['21:00','Dîner','La salle voûtée'],
       ['23:00','Mezoued','Le patio']],
   en:[['18:00','Guest welcome','The entrance hall'],['19:00','Ceremony','The courtyard'],
       ['20:00','Photographs from the stairs','The iron rail'],['21:00','Dinner','The vaulted room'],
       ['23:00','Mezoued','The courtyard']]}},

 ray:{when:'2026-10-10T16:00',
  ar:{n:'مريم & يوسف',d:'10 أكتوبر 2026',p:'قاعة النور، الكرم',
      m:'ضوءٌ من نافذة عالية، ووعدٌ نقوله أمامكم'},
  fr:{n:'Meriem & Youssef',d:'10 · 10 · 2026',p:'Salle Ennour, Le Kram',
      m:'La lumière d’une haute fenêtre, et une promesse devant vous'},
  en:{n:'Meriem & Youssef',d:'10 · 10 · 2026',p:'Ennour Hall, Le Kram',
      m:'Light from a high window, and a promise said in front of you'},
  prog:{ar:[['16:00','الاستقبال','البهو'],['17:00','عقد القران','القاعة العالية'],
        ['18:30','الصور في الضوء','النوافذ الشمالية'],['20:00','العشاء','القاعة'],
        ['22:00','السهرة','الفناء']],
   fr:[['16:00','Accueil','Le hall'],['17:00','Cérémonie','La haute salle'],
       ['18:30','Photos dans la lumière','Les fenêtres nord'],['20:00','Dîner','La salle'],
       ['22:00','Soirée','La cour']],
   en:[['16:00','Welcome','The hall'],['17:00','Ceremony','The high room'],
       ['18:30','Photographs in the light','The north windows'],['20:00','Dinner','The hall'],
       ['22:00','Party','The courtyard']]}},

 vow:{when:'2027-06-05T17:00',
  ar:{n:'هالة & سيف',d:'5 جوان 2027',p:'دار الضيافة، قرطاج',
      m:'يدٌ في يد، بلا ضجيج — نحبّكم معنا'},
  fr:{n:'Hala & Seif',d:'05 · 06 · 2027',p:'Dar Edhiafa, Carthage',
      m:'Main dans la main, sans bruit — nous vous voulons près de nous'},
  en:{n:'Hala & Seif',d:'05 · 06 · 2027',p:'Dar Edhiafa, Carthage',
      m:'Hand in hand, without noise — we would like you near'},
  prog:{ar:[['17:00','الاستقبال','الحديقة'],['18:00','العهد','تحت الأقواس'],
        ['19:30','الصور','ممرّ الزيتون'],['20:30','العشاء','الرواق'],['22:30','السهرة','الحديقة']],
   fr:[['17:00','Accueil','Le jardin'],['18:00','Les vœux','Sous les arches'],
       ['19:30','Photos','L’allée des oliviers'],['20:30','Dîner','La galerie'],
       ['22:30','Soirée','Le jardin']],
   en:[['17:00','Welcome','The garden'],['18:00','The vows','Under the arches'],
       ['19:30','Photographs','The olive walk'],['20:30','Dinner','The gallery'],
       ['22:30','Party','The garden']]}},

 stair:{when:'2026-10-24T18:30',
  ar:{n:'أسماء & طارق',d:'24 أكتوبر 2026',p:'قصر السرايا، الحمّامات',
      m:'هي تنزل، وهو ينتظر — وأنتم تحت الدرج'},
  fr:{n:'Asma & Tarek',d:'24 · 10 · 2026',p:'Palais Essaraya, Hammamet',
      m:'Elle descend, il attend — et vous êtes en bas'},
  en:{n:'Asma & Tarek',d:'24 · 10 · 2026',p:'Essaraya Palace, Hammamet',
      m:'She comes down, he waits — and you are at the foot of the stairs'},
  prog:{ar:[['18:30','استقبال الضيوف','البهو'],['19:30','النزول','الدرج الكبير'],
        ['20:00','عقد القران','القاعة الكبرى'],['21:00','العشاء','قاعة المرايا'],
        ['23:00','السهرة','الحديقة']],
   fr:[['18:30','Accueil des invités','Le hall'],['19:30','La descente','Le grand escalier'],
       ['20:00','Cérémonie','Grande salle'],['21:00','Dîner','Salle des miroirs'],
       ['23:00','Soirée','Le jardin']],
   en:[['18:30','Guest welcome','The hall'],['19:30','The descent','The grand staircase'],
       ['20:00','Ceremony','The great hall'],['21:00','Dinner','The mirror room'],
       ['23:00','Party','The garden']]}},

 record:{when:'2026-09-12T19:00',
  ar:{n:'دنيا & بلال',d:'12 سبتمبر 2026',p:'دار الوليدة، سيدي بوسعيد',
      m:'عندنا أغنية أولى — تعالوا نسمعها معكم'},
  fr:{n:'Donia & Bilel',d:'12 · 09 · 2026',p:'Dar El Oualida, Sidi Bou Saïd',
      m:'Nous avons une première chanson — venez l’écouter avec nous'},
  en:{n:'Donia & Bilel',d:'12 · 09 · 2026',p:'Dar El Oualida, Sidi Bou Said',
      m:'We have a first song — come and hear it with us'},
  prog:{ar:[['19:00','الاستقبال','الفناء'],['19:45','الأغنية الأولى','الصالون'],
        ['20:30','الصور','السطح الأزرق'],['21:30','العشاء','الرواق'],['23:30','السهرة','الفناء']],
   fr:[['19:00','Accueil','Le patio'],['19:45','La première chanson','Le salon'],
       ['20:30','Photos','La terrasse bleue'],['21:30','Dîner','La galerie'],
       ['23:30','Soirée','Le patio']],
   en:[['19:00','Welcome','The courtyard'],['19:45','The first song','The salon'],
       ['20:30','Photographs','The blue terrace'],['21:30','Dinner','The gallery'],
       ['23:30','Party','The courtyard']]}},

 blanc:{when:'2027-05-30T16:00',
  ar:{n:'آية & أمين',d:'30 ماي 2027',p:'بيت العائلة، نابل',
      m:'بلا زخرفة — يدها في يده، وأنتم شهود'},
  fr:{n:'Aya & Amine',d:'30 · 05 · 2027',p:'Maison de famille, Nabeul',
      m:'Sans ornement — sa main dans la sienne, et vous témoins'},
  en:{n:'Aya & Amine',d:'30 · 05 · 2027',p:'The family house, Nabeul',
      m:'Without ornament — her hand in his, and you as witnesses'},
  prog:{ar:[['16:00','الاستقبال','باب الدار'],['17:00','العقد','الصالة'],
        ['18:00','الصور','الحديقة البيضاء'],['19:30','العشاء','السطح'],['21:30','السهرة','الحديقة']],
   fr:[['16:00','Accueil','La porte'],['17:00','La cérémonie','Le salon'],
       ['18:00','Photos','Le jardin blanc'],['19:30','Dîner','La terrasse'],
       ['21:30','Soirée','Le jardin']],
   en:[['16:00','Welcome','The doorway'],['17:00','The ceremony','The lounge'],
       ['18:00','Photographs','The white garden'],['19:30','Dinner','The terrace'],
       ['21:30','Party','The garden']]}}
};

/* the placeholder text a film opens with — its own, when it has its own */
function readyDef(f, lang){
 const cat = (f && f.cat) || 'wed';
 const set = RD_DEF[cat] || RD_DEF.wed;
 const base = set[lang] || set.ar;
 const own = f && WED_DEMO[f.id];
 if(!own) return base;
 const mine = own[lang] || own.ar;
 return Object.assign({}, base, mine, own.when ? {when:own.when} : {});
}
/* the running order that belongs to this wedding, when it has one */
function readyProgDemo(f, lang){
 const own = f && WED_DEMO[f.id];
 if(!own || !own.prog) return null;
 return own.prog[lang] || own.prog.ar;
}

/* The whole shelf: what ships, plus what was added, in that order. */
function readyCatalogue(){return FILMS_BUILTIN.concat(readyCustom());}

/* Whatever the dashboard set for one film — its uploaded song, the stretch
   that song was trimmed to, its envelope and framing — which always wins over
   what shipped with the film.

   This lived in the shelf alone, so the dashboard could not see it, and
   delivery quietly handed over the shipped song at full length instead of the
   one that had been uploaded and cut. It sits beside the catalogue now
   because both pages load this file first, and the two paths must agree. */
function readyCfg(id){return (typeof CFG!=='undefined'&&CFG&&CFG.films&&CFG.films[id])||{};}
