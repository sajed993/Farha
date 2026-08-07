/* ================= the ready-made catalogue =================
   Loaded by both the site and the dashboard. It used to live only in the
   site bundle with the dashboard keeping a hand-copied list beside it, which
   drifted four films behind before anyone noticed. One source now.

   FILMS_BUILTIN ships with the code. Anything the owner adds from the
   dashboard lives in CFG.media.readyFilms and is merged on top by
   readyCatalogue(), so both pages always see the same shelf. */

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
 {id:'bdaycake',cat:'bday',v:'/media/inv/bday-cake.mp4',p:'/media/inv/bday-cake.jpg',design:7,
  name:{ar:'شمعة العام',fr:'La Bougie',en:'One Candle'},
  blurb:{ar:'شمعةٌ واحدة فوق كعكة، وورودٌ داكنة حولها، والضوء وحده يحتفل',
   fr:'Une seule bougie sur le gâteau, des fleurs sombres autour, et la lumière qui fête toute seule',
   en:'A single candle on the cake, dark blooms around it, and only the light celebrating'},
  dress:{ar:['أحمر وأسود','لمسة جريئة تكفي'],fr:['Rouge et noir','Une touche audacieuse suffit'],en:['Red and black','One bold touch is enough']},
  sw:['#3A2018','#BE3325','#E9DDCB']},
 {id:'bdayballoons',cat:'bday',v:'/media/inv/bday-balloons.mp4',p:'/media/inv/bday-balloons.jpg',design:7,
  name:{ar:'بالونات وردية',fr:'Ballons Poudrés',en:'Blush Balloons'},
  blurb:{ar:'بالوناتٌ وردية وهدايا وباقةٌ صغيرة — فرحٌ خفيف بلا ضجيج',
   fr:'Ballons poudrés, cadeaux et un petit bouquet — une joie légère, sans bruit',
   en:'Blush balloons, gifts and a small bouquet — light joy, no noise'},
  dress:{ar:['وردي وناعم','ألوان الباستيل'],fr:['Rose et doux','Teintes pastel'],en:['Blush and soft','Pastel tones']},
  sw:['#4A2E2A','#D48CA0','#EEDDD8']},

 /* ── newborns ── */
 {id:'babybasket',cat:'baby',v:'/media/inv/baby-basket.mp4',p:'/media/inv/baby-basket.jpg',design:8,
  name:{ar:'قدمان صغيرتان',fr:'Deux Petits Pieds',en:'Two Small Feet'},
  blurb:{ar:'قدمان صغيرتان في سلّةٍ من القشّ — أهدأ إعلانٍ يمكن أن ترسلوه',
   fr:"Deux petits pieds dans un couffin d'osier — l'annonce la plus douce qui soit",
   en:'Two small feet in a woven basket — the gentlest announcement there is'},
  sw:['#4A4036','#D1815E','#EEDCCB']},
 {id:'babycake',cat:'baby',v:'/media/inv/baby-cake.mp4',p:'/media/inv/baby-cake.jpg',design:8,
  name:{ar:'أهلًا يا صغير',fr:'Oh Baby',en:'Oh Baby'},
  blurb:{ar:'كعكةٌ بيضاء على لحافٍ ناعم، وكلمتان مكتوبتان بالكريمة',
   fr:'Un gâteau blanc sur une couverture douce, et deux mots écrits à la crème',
   en:'A white cake on a soft quilt, and two words piped in cream'},
  sw:['#3F3E3D','#8E8578','#E2E0D8']},

 /* ── graduation ── */
 {id:'grad',cat:'grad',v:'/media/inv/grad.mp4',p:'/media/inv/grad.jpg',design:6,
  name:{ar:'قبّعة وورد',fr:'Toque et Roses',en:'Cap and Roses'},
  blurb:{ar:'قبّعة التخرّج وباقةٌ من الورد الوردي تحت سماءٍ صافية',
   fr:'La toque et un bouquet de roses sous un ciel clair',
   en:'The cap and an armful of pink roses under a clear sky'},
  dress:{ar:['أنيق نهاري','ألوان فاتحة'],fr:['Chic de jour','Tons clairs'],en:['Daytime smart','Light tones']},
  sw:['#1C2030','#C86A8A','#D8DEEE']},

 /* ── henna night ── */
 {id:'henna',cat:'henna',v:'/media/inv/henna.mp4',p:'/media/inv/henna.jpg',design:10,
  name:{ar:'ليلة الحنّة',fr:'Nuit du Henné',en:'Henna Night'},
  blurb:{ar:'ورد قرمزي في جرارٍ من فخّار، وضوءٌ دافئ على الجدار — ليلة الحنّة كما هي',
   fr:'Des fleurs carmin dans des jarres de terre cuite et une lumière chaude sur le mur — la nuit du henné',
   en:'Carmine blooms in clay jars and warm light on the wall — the henna night as it is'},
  dress:{ar:['قفطان أو جبّة','أحمر وذهبي — كما تقتضي الليلة'],
   fr:['Caftan ou jebba','Rouge et or, comme le veut la nuit'],
   en:['Caftan or jebba','Red and gold, as the night asks']},
  sw:['#3A211C','#8E221C','#EBDCC6'],
  snd:'/media/snd/henna.webm',sndN:'جيبوا الحنّة'},

 /* ── save the date ── */
 {id:'soon',cat:'save',v:'/media/inv/soon.mp4',p:'/media/inv/soon.jpg',design:3,
  name:{ar:'قريبًا',fr:'Bientôt',en:'Coming Soon'},
  blurb:{ar:'حريرٌ عاجي وظلٌّ يتحرك، وسطرٌ واحد: شيءٌ جميل قادم',
   fr:"Soie ivoire, une ombre qui bouge, et une seule ligne : quelque chose de beau arrive",
   en:'Ivory silk, a moving shadow, and one line: something lovely is coming'},
  sw:['#4A3E34','#A58E7C','#E8DDCE']}
];
/* order matters — the chips read in this order */
const RD_CATS=['all','wed','henna','bday','baby','grad','save'];

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

/* The whole shelf: what ships, plus what was added, in that order. */
function readyCatalogue(){return FILMS_BUILTIN.concat(readyCustom());}
