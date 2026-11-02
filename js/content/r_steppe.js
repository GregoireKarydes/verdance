// =============================================================
// Région 1 — Steppes de l'Holocène (climat, GES, budget carbone)
// =============================================================
import { look } from './r_village.js';

export const NPCS = {
  aidan: { id: 'aidan', name: 'Aïdan le Carottier', look: look('#3a6a8a', '#d8d8d8', { hairStyle: 3, beard: '#e0e0e0', hat: 'hood', hatColor: '#2a4a6a' }), inv: ['M1-10', 'M1-11', 'M1-12', 'M1-14', 'M1-17'],
    talk: [
      { if: '!flag:aidan_1', mark: 'quest', say: ['Un visiteur ! Je fore la glace depuis quarante ans. Chaque carotte est une page de l’histoire du climat.', 'Pendant 100 000 ans, le climat était **chaotique** : il pouvait varier de 10 °C en une seule décennie. Des temps terribles pour l’humanité.', 'Puis, il y a environ **10 000 ans**, tout s’est stabilisé : c’est l’**Holocène**, « l’entièrement récent ». À peine ±1 °C en dix millénaires.', 'Va examiner mes **deux fresques**, là-haut. Elles en disent plus long que moi.'], act: ['flag:aidan_1', 'step:main_steppe:1', 'codex:holocene'] },
      { if: 'step:main_steppe==1', say: ['Examine les deux fresques au nord : la courbe des 100 000 ans… et la Grande Accélération.'] },
      { if: 'step:main_steppe==2', mark: 'quest', say: ['Tu as vu la rupture ? Alors écoute celui qui l’a le mieux expliquée : la **pierre de projection** te montrera Johan Rockström, du Potsdam Institute.'] },
      { if: 'step:main_steppe>=3&!puzzle:epreuve_carottes', mark: 'quest', say: ['Bien. Voyons si la glace t’a parlé. Voici l’**Épreuve des Carottes** : huit questions. Une erreur ne te bloquera pas, mais je note tout !'], act: ['puzzle:epreuve_carottes'] },
      { if: 'puzzle:epreuve_carottes&step:main_steppe<4', mark: 'quest', say: ['Une dernière chose. Les machines de Verdance — et ton numérique — dépendent de cette stabilité. Explique-moi pourquoi, avec tes mots.'], act: ['open:q1_holocene'] },
      { if: 'step:main_steppe>=4&!seed:steppe', say: ['Va trouver **Dame Serre**, au temple de verre à l’est. Elle seule peut t’ouvrir le Temple de la Serre.'] },
      { say: ['Nous sommes sortis de l’Holocène en à peine 50 ans… Mais tant qu’il y aura des gardien·ne·s, rien n’est perdu.'] },
    ] },
  dame_serre: { id: 'dame_serre', name: 'Dame Serre', look: look('#c8e8f0', '#4a2a1a', { hairStyle: 2, robe: '#8ac8d8', hat: 'crown' }), inv: ['M1-40', 'M1-41'],
    talk: [
      { if: 'step:main_steppe<4', say: ['Le Temple de la Serre ne s’ouvre qu’aux esprits avertis. Va d’abord voir **Aïdan le Carottier**.'] },
      { if: '!flag:serre_ouvert&!flag:fresque_vue', mark: 'quest', say: ['Aïdan t’envoie ? Alors écoute. L’**effet de serre** est un phénomène naturel et vital : sans lui, la Terre serait à **−18 °C**.', 'Le problème, c’est son **renforcement**. Nos activités ont fait exploser la concentration des gaz qui piègent la chaleur.', 'Chaque gaz a ses propriétés : son **temps de séjour** dans l’atmosphère, sa **concentration** (en ppm ou ppb) et son **pouvoir radiatif**.', 'Avant de t’ouvrir le temple, je veux être sûre que tu vois **le tableau d’ensemble**. Reconstitue la **Grande Fresque** : de nos activités jusqu’à leurs conséquences.'], act: ['flag:fresque_vue', 'puzzle:fresque_verdance'] },
      { if: '!flag:serre_ouvert', mark: 'quest', say: ['La Grande Fresque t’attend. Prends ton temps : chaque carte compte.'], act: ['puzzle:fresque_verdance'] },
      { if: '!seed:steppe', say: ['Le temple est ouvert, à l’est. Trois salles, trois épreuves. La Graine-Mère t’attend au fond.'] },
      { say: ['La serre respire à nouveau. Merci, Gardien·ne.'] },
    ] },
  voyageuse: { id: 'voyageuse', name: 'Voyageuse Empreinte', look: look('#c87a3a', '#2a1a10', { hairStyle: 2, hat: 'band', hatColor: '#ffd84a' }), inv: ['M1-44', 'M1-45', 'M1-49', 'M1-50', 'M1-52'],
    talk: [
      { if: '!quest:qs_empreinte', mark: 'quest', say: ['J’ai parcouru tout Verdance… et j’ai calculé ce que pesait chacun de mes pas. Un·e habitant·e de France émet en moyenne **8,2 tonnes de CO₂e par an** (estimation 2024).', 'Pour respecter l’Accord de Paris, il faudrait viser environ **2 tonnes** en 2050. Le numérique, lui, représente environ **4 %** de l’empreinte française.', 'Et toi, combien pèses-tu ? Fais le calcul et reviens me voir.'], act: ['quest:qs_empreinte', 'codex:deux_tonnes', 'mission:ngc'] },
      { if: 'step:qs_empreinte==0', mark: 'quest', say: ['Alors, ce calcul ?'], act: ['mission:ngc'] },
      { if: 'step:qs_empreinte==1&!done:qs_empreinte', mark: 'quest', say: ['Merci. Et maintenant : quel serait ton premier levier ?'], act: ['open:q2_levier'] },
      { say: ['Chaque tonne compte. Et en tant que futur·e manager IT, tu en pilotes bien plus que la tienne.'] },
    ] },
  f_alim: { id: 'f_alim', name: 'Fermière Céréale', look: look('#8a6a2a', '#c8a050', { hat: 'cap', hatColor: '#d8c070' }), inv: ['M1-32'],
    talk: [{ if: '!flag:pilier_1', mark: 'quest', say: ['Premier pilier de notre empreinte : l’**alimentation et l’agriculture**. Engrais, élevage, transport… c’est un gros morceau.', 'Grâce à la stabilité de l’Holocène, on pouvait semer riz, blé et maïs au bon moment, sur tous les continents.'], act: ['flag:pilier_1', 'quest:qs_piliers', 'script:piliers_check'] }, { say: ['Moins de viande, plus de saison : c’est déjà beaucoup.'] }] },
  f_biens: { id: 'f_biens', name: 'Marchand Bidule', look: look('#6a3a8a', '#1a1a1a', { hat: 'wizard', hatColor: '#4a2a6a' }), inv: ['M1-32'],
    talk: [{ if: '!flag:pilier_2', mark: 'quest', say: ['Deuxième pilier : la **consommation de biens manufacturés**. Vêtements, meubles… et appareils électroniques !', 'Chaque objet a une empreinte cachée : extraction, fabrication, transport.'], act: ['flag:pilier_2', 'quest:qs_piliers', 'script:piliers_check'] }, { say: ['Le meilleur objet ? Celui qu’on n’achète pas. Le deuxième : celui qu’on répare.'] }] },
  f_transport: { id: 'f_transport', name: 'Cocher Roulin', look: look('#3a3a6a', '#6a3a1a', { hat: 'cap', hatColor: '#222' }), inv: ['M1-32'],
    talk: [{ if: '!flag:pilier_3', mark: 'quest', say: ['Troisième pilier : les **transports et la mobilité**. C’est souvent le premier poste d’émissions des particuliers.', 'Et pense aux marchandises : un smartphone parcourt l’équivalent de plusieurs fois le tour de la Terre avant d’arriver dans ta poche.'], act: ['flag:pilier_3', 'quest:qs_piliers', 'script:piliers_check'] }, { say: ['Hue !'] }] },
  f_habitat: { id: 'f_habitat', name: 'Maçonne Tuile', look: look('#a05a3a', '#3a2a1a', { hairStyle: 1, apron: '#8a7a6a' }), inv: ['M1-32'],
    talk: [{ if: '!flag:pilier_4', mark: 'quest', say: ['Quatrième pilier : l’**habitat et l’énergie**. Chauffage, isolation, électricité…', 'Ensemble, ces quatre piliers exercent une pression énorme sur les ressources de la planète.'], act: ['flag:pilier_4', 'quest:qs_piliers', 'script:piliers_check'] }, { say: ['Une maison bien isolée, c’est de l’énergie qu’on n’a pas besoin de produire.'] }] },
  vigie_cote: { id: 'vigie_cote', name: 'Vigie des Côtes', look: look('#2a5a8a', '#e0c080', { hat: 'helmet', hatColor: '#3a6aaa' }), inv: ['M1-37', 'M1-38'],
    talk: [
      { if: '!quest:qs_eaux', mark: 'quest', say: ['La mer monte, Gardien·ne. Et sous l’eau passent les **câbles** qui relient les continents ; sur les côtes dorment des **centres de données**.', 'Va voir de tes yeux à quoi ressemblera la côte en 2050, puis raconte-moi.'], act: ['quest:qs_eaux', 'mission:climate'] },
      { if: 'step:qs_eaux==0', mark: 'quest', say: ['As-tu regardé la carte des eaux montantes ?'], act: ['mission:climate'] },
      { if: 'step:qs_eaux==1&!done:qs_eaux', mark: 'quest', say: ['Tu vois ? Les infrastructures numériques sont vulnérables : refroidissement des centres de données pendant les canicules, câbles et stations côtières menacés, chaînes d’approvisionnement fragiles.', 'Un·e manager IT doit intégrer ces **risques climatiques** dans ses choix d’infrastructure.'], act: ['done:qs_eaux', 'codex:vulnerabilite_it'] },
      { say: ['Je veille. Toi, agis.'] },
    ] },
};

export const SCRIPTS = {
  piliers_check: [{ if: 'flag:pilier_1&flag:pilier_2&flag:pilier_3&flag:pilier_4&!done:qs_piliers', act: ['codex:quatre_piliers', 'done:qs_piliers'] }, { act: [] }],
  fresques_check: [{ if: 'flag:vu_holocene&flag:vu_acceleration&step:main_steppe==1', act: ['step:main_steppe:2', 'toast:Les deux fresques sont examinées. La **pierre de projection** s’allume !'] }, { act: [] }],
  'secret:records': [{ say: [{ who: 'Grotte des Records', t: 'Des relevés gravés dans la glace… Les records de chaleur s’enchaînent.' }], act: ['codex:records_chaleur', 'codex:corridor'] }],
};

export const QUESTS = [
  { id: 'main_steppe', title: 'La mémoire de la glace', region: 'steppe', main: true, steps: [
    { t: 'Parle à Aïdan le Carottier', at: 'aidan' }, { t: 'Examine les deux fresques climatiques', at: 'fresque_holocene' }, { t: 'Regarde la pierre de projection (J. Rockström)', at: 'proj_rockstrom' },
    { t: 'Passe l’Épreuve des Carottes auprès d’Aïdan', at: 'aidan' }, { t: 'Reconstitue la Grande Fresque avec Dame Serre', at: 'dame_serre' }, { t: 'Traverse le Temple de la Serre', at: 'temple_serre' }, 'Replante la Graine-Mère'] },
  { id: 'qs_empreinte', title: 'L’empreinte du voyageur', region: 'steppe', giver: 'voyageuse', steps: [{ t: 'Calcule ton empreinte carbone (mission terrain)', at: 'voyageuse' }, { t: 'Partage ton premier levier avec la Voyageuse', at: 'voyageuse' }], reward: { graines: 15 } },
  { id: 'qs_eaux', title: 'Les eaux montantes', region: 'steppe', giver: 'vigie_cote', steps: [{ t: 'Observe la carte de montée des eaux (mission terrain)', at: 'vigie_cote' }, { t: 'Raconte à la Vigie ce que tu as vu', at: 'vigie_cote' }], reward: { graines: 10 } },
  { id: 'qs_piliers', title: 'Les quatre piliers', region: 'steppe', giver: 'f_alim', steps: ['Écoute les quatre artisans des Steppes (alimentation, biens, transports, habitat)'], reward: { heart: true } },
];

export const PUZZLES = {
  fresque_verdance: { type: 'fresque', title: 'La Grande Fresque : des causes aux conséquences', region: 'steppe', icon: '🖼', inv: ['M1-39', 'M1-42', 'M1-47'],
    intro: 'Dame Serre déroule une immense fresque déchirée. Pour ouvrir le temple, il faut **comprendre l’enchaînement** : de nos activités jusqu’à leurs conséquences. **Glisse chaque carte** dans la bonne colonne (ou clique une carte, puis une colonne).',
    columns: [
      { t: '① Activités humaines', d: 'Ce que nous faisons' },
      { t: '② Émissions', d: 'Ce que nous rejetons' },
      { t: '③ Mécanismes', d: 'Ce qui se passe dans le système Terre' },
      { t: '④ Effets physiques', d: 'Ce que l’on mesure' },
      { t: '⑤ Conséquences', d: 'Pour le vivant et pour nous' },
    ],
    cards: [
      { t: 'Fabriquer nos équipements numériques', i: '📱', c: 0, x: 'Extraction de métaux, usines alimentées en grande partie aux énergies fossiles : c’est l’essentiel de l’empreinte du numérique.' },
      { t: 'Brûler charbon, pétrole et gaz', i: '🏭', c: 0, x: 'Électricité, chauffage, transports : la combustion des fossiles est la première source de CO₂.' },
      { t: 'Déforestation et agriculture intensive', i: '🌾', c: 0, x: 'Forêts brûlées ou rasées, engrais azotés, élevage.' },
      { t: 'Dioxyde de carbone (CO₂)', i: '☁', c: 1, x: 'Le principal gaz à effet de serre d’origine humaine ; il reste des siècles dans l’atmosphère.' },
      { t: 'Méthane (CH₄)', i: '🐄', c: 1, x: 'Élevage, rizières, fuites de gaz : ≈ 28 fois plus réchauffant que le CO₂ sur 100 ans.' },
      { t: 'Protoxyde d’azote (N₂O)', i: '🧪', c: 1, x: 'Surtout les engrais azotés : ≈ 273 fois plus réchauffant que le CO₂ sur 100 ans.' },
      { t: 'Effet de serre renforcé', i: '🌡', c: 2, x: 'Plus de gaz = plus de chaleur retenue près de la surface.' },
      { t: 'L’océan absorbe ≈ 90 % de la chaleur en trop', i: '🌊', c: 2, x: 'Il amortit le réchauffement de l’air… mais se réchauffe et se dilate.' },
      { t: 'L’océan absorbe ≈ ¼ de notre CO₂', i: '🫧', c: 2, x: 'Le CO₂ dissous rend l’eau plus acide.' },
      { t: 'Réchauffement global (≈ +1,1 °C en 2011-2020)', i: '🔥', c: 3, x: 'Par rapport à 1850-1900 (GIEC, AR6). 2024 a été l’année la plus chaude jamais mesurée.' },
      { t: 'Fonte des glaces, montée des mers (≈ +20 cm depuis 1900)', i: '🧊', c: 3, x: 'Glaciers et calottes fondent, l’eau chaude se dilate (GIEC).' },
      { t: 'Acidification des océans', i: '🐚', c: 3, x: 'Une limite planétaire désormais dépassée (bilan 2025).' },
      { t: 'Canicules, sécheresses et incendies', i: '🏜', c: 4, x: 'Plus fréquents et plus intenses à chaque dixième de degré.' },
      { t: 'Coraux, coquillages et biodiversité menacés', i: '🪸', c: 4, x: 'L’acidité et la chaleur fragilisent les écosystèmes marins.' },
      { t: 'Récoltes en baisse, pénuries d’eau, populations déplacées', i: '🧳', c: 4, x: 'Les plus vulnérables sont les plus touchés… souvent ceux qui émettent le moins.' },
    ],
    chain: {
      title: 'Ta chaîne à toi : d’un smartphone neuf… à ses conséquences',
      label: 'Glisse les maillons dans l’ordre, du **premier** au **dernier**.',
      items: ['J’achète un smartphone neuf', 'Extraction de métaux et fabrication, souvent à l’électricité fossile', 'Émissions de CO₂ (la fabrication pèse l’essentiel de l’empreinte d’un smartphone)', 'L’effet de serre se renforce', 'La planète se réchauffe', 'Canicules, sécheresses, montée des eaux'],
    },
    awareness: [
      '🌡 **2024** a été l’année la plus chaude jamais mesurée : environ **+1,55 °C** au-dessus de l’ère préindustrielle (OMM).',
      '📈 **Chaque dixième de degré compte** : à +2 °C, les canicules extrêmes, les sécheresses et les pertes de récoltes sont nettement plus fréquentes qu’à +1,5 °C (GIEC).',
      '💻 Le numérique pèse environ **4,4 %** de l’empreinte carbone de la France, et l’essentiel vient de la **fabrication** de nos appareils (ADEME-Arcep).',
      '🔗 **Bonne nouvelle : c’est une chaîne.** Chaque maillon est un levier. Garder son téléphone plus longtemps agit dès le **premier maillon**.',
    ],
    reflect: 'Quel lien de la fresque t’a le plus surpris·e, et qu’est-ce que ça change pour toi ?',
    hints: ['Demande-toi : est-ce quelque chose que **l’on fait**, que **l’on rejette**, un **mécanisme**, une **mesure** ou une **conséquence** ?', 'Les trois gaz vont ensemble (②) ; l’océan qui absorbe chaleur et CO₂, ce sont des mécanismes (③).'],
    onWin: ['codex:fresque', 'flag:serre_ouvert', 'step:main_steppe:5', 'codex:effet_serre', 'say:Tu as vu l’ensemble. Voilà ce que la fresque enseigne : tout est lié… et chaque maillon est un levier. Voici la clé du temple, il est à l’est.'],
    explain: 'La fresque relie nos **activités** aux **conséquences** en passant par les émissions, les mécanismes et les effets mesurés. C’est une **chaîne de causes** : agir sur un maillon (réduire, allonger, sobriété) réduit tout ce qui suit.' },
  epreuve_carottes: { type: 'qcm', title: 'L’Épreuve des Carottes', region: 'steppe', icon: '🧊', inv: ['M1-23', 'M1-24', 'M1-25', 'M1-26', 'M1-27', 'M1-28', 'M1-29', 'M1-30', 'M1-31'],
    intro: 'Aide-mémoire d’Aïdan : *Holocène = 10 000 ans de stabilité · l’océan absorbe ~90 % de la chaleur excédentaire · point de bascule = seuil irréversible · Carbon Law = ÷2 tous les 10 ans.*',
    hints: ['Relis l’aide-mémoire ci-dessus : il contient la moitié des réponses.', 'Les autres sont dans les « intels » de la vidéo de Rockström (Codex, touche C).'],
    onWin: ['codex:points_bascule', 'codex:ocean_chaleur'],
    questions: [
      { q: 'Quelle a été la variation de température durant l’Holocène ?', options: ['± 1 °C', '± 5 °C', '± 10 °C'], a: 0, explain: 'Une stabilité exceptionnelle qui a permis l’agriculture, puis les civilisations.' },
      { q: 'Vers quand commence la « Grande Accélération » ?', options: ['Vers 1950', '1789', '2015'], a: 0, explain: 'Après 1950, population, énergie, CO₂, engrais… tout s’envole de façon exponentielle.' },
      { q: 'Quelle part de la chaleur excédentaire l’océan a-t-il absorbée ?', options: ['Environ 90 %', 'Environ 50 %', 'Environ 30 %'], a: 0, explain: 'Sans l’océan, le réchauffement de l’air serait bien pire — mais il en paie le prix (canicules marines, acidification).' },
      { q: 'La « Carbon Law » impose de diviser les émissions par deux tous les…', options: ['10 ans', '2 ans', '50 ans'], a: 0, explain: 'Une « loi de Moore climatique » : −50 % par décennie.' },
      { q: 'Combien de limites planétaires l’équipe de Johan Rockström a-t-elle identifiées ?', options: ['9', '7', '12'], a: 0, explain: 'Neuf limites ; tu les découvriras dans le Bassin des 9 Sceaux.' },
      { q: 'Franchir un point de bascule (« tipping point »), cela signifie…', options: ['Le système s’emballe de lui-même, de façon difficilement réversible', 'La planète se refroidit brutalement', 'L’impact humain s’arrête'], a: 0, explain: 'Boucles de rétroaction : fonte des glaces → moins de réflexion du soleil → plus de chaleur…' },
      { q: 'Quelle forêt est en partie devenue une source de carbone plutôt qu’un puits ?', options: ['Certaines parties de l’Amazonie', 'La Forêt-Noire', 'La taïga sibérienne'], a: 0, explain: 'Déforestation et sécheresses : le sud-est de l’Amazonie émet désormais plus qu’il n’absorbe.' },
      { q: 'Le « corridor » de température des 3 derniers millions d’années n’a jamais dépassé environ…', options: ['+2 °C', '+5 °C', '+1,5 °C'], a: 0, explain: 'Selon Rockström, la Terre n’a pas connu plus de +2 °C depuis environ 3 millions d’années.' },
    ] },
  serre_trous: { type: 'fill', title: 'Salle 1 — Le rapport de la Serre', region: 'steppe', icon: '📜', inv: ['M1-48'],
    intro: 'Un rapport déchiré. Replace les mots manquants (clique un mot, puis un trou).',
    text: '« L’effet de serre est un phénomène {0} qui permet à la Terre de garder une température vivable. Sans lui, il ferait {1} en moyenne. Mais nos activités rejettent trop de gaz, qui piègent davantage de {2}. Pour comparer les gaz, on utilise le {3}. En France, l’empreinte moyenne est d’environ {4} de CO₂e par personne et par an. La Carbon Law exige de diviser nos émissions par deux tous les {5}. »',
    bank: ['naturel', '−18 °C', 'chaleur', 'PRG', '8 tonnes', '10 ans', 'artificiel', '+18 °C', '50 ans', 'lumière'],
    answers: ['naturel', '−18 °C', 'chaleur', 'PRG', '8 tonnes', '10 ans'],
    hints: ['Le PRG, c’est le Pouvoir de Réchauffement Global.', 'L’empreinte moyenne en France était de 9 t en 2021 et d’environ 8,2 t en 2024.'],
    explain: 'Le CO₂ sert de référence (PRG = 1). Tous les autres gaz sont exprimés en **CO₂ équivalent**.' },
  serre_vannes: { type: 'sliders', title: 'Salle 2 — Les vannes de la Serre', region: 'steppe', icon: '⚗', inv: ['M1-42', 'M1-43'],
    intro: 'Le thermomètre de la serre attend un dosage exact : **25 t CO₂e** (± 0,5), en utilisant **les trois gaz**. PRG à 100 ans : CO₂ = 1 · CH₄ ≈ 28 · N₂O ≈ 273.',
    sliders: [{ label: 'CO₂ (tonnes)', min: 0, max: 20, step: 0.5, init: 10 }, { label: 'CH₄ méthane (tonnes)', min: 0, max: 1, step: 0.05, init: 0 }, { label: 'N₂O protoxyde d’azote (tonnes)', min: 0, max: 0.1, step: 0.005, init: 0 }],
    calc: ([co2, ch4, n2o]) => { const t = co2 + ch4 * 28 + n2o * 273; const ok = Math.abs(t - 25) <= 0.5 && co2 > 0 && ch4 > 0 && n2o > 0; return { ok, display: `Total : **${t.toFixed(2)} t CO₂e** (CO₂ ${co2.toFixed(1)} + CH₄ ${(ch4 * 28).toFixed(1)} + N₂O ${(n2o * 273).toFixed(1)})`, msg: (co2 && ch4 && n2o) ? 'Le thermomètre n’est pas à 25 t CO₂e.' : 'Il faut utiliser les trois gaz.' }; },
    hints: ['Observe comme quelques kilos de N₂O pèsent lourd !', 'Exemple de piste : 0,25 t de CH₄ = 7 t CO₂e.'],
    explain: 'Quelques centaines de kilos de méthane ou quelques dizaines de kilos de N₂O équivalent à des tonnes de CO₂ : c’est tout le sens du **PRG**. (Valeurs AR6 du GIEC : CH₄ fossile 29,8, CH₄ non fossile 27 ; N₂O 273. L’ancien cours utilisait les valeurs AR5 : 28 et 265.)' },
  serre_temperature: { type: 'qcm', title: 'Salle 3 — Le thermostat du monde', region: 'steppe', icon: '🌡', inv: ['M1-44', 'M1-45', 'M1-49', 'M1-50', 'M1-41'], onWin: ['codex:prg', 'codex:deux_tonnes'],
    questions: [
      { q: 'Sur quel horizon le PRG est-il habituellement calculé ?', options: ['100 ans', '10 ans', '1 000 ans'], a: 0, explain: 'Par convention (GIEC), le PRG est calculé à 100 ans. Sur 20 ans, le méthane pèse plus de 80 fois le CO₂ !' },
      { q: 'Quelle est l’empreinte carbone moyenne d’un·e Français·e (estimation 2024) ?', options: ['Environ 8 t CO₂e/an', 'Environ 2 t CO₂e/an', 'Environ 20 t CO₂e/an'], a: 0, explain: 'Environ 8,2 t en 2024 selon le SDES (9 t en 2021 dans l’ancien cours). Environ la moitié est liée aux importations.' },
      { q: 'Pour atteindre ~2 t en 2050 depuis ~8 t, il faut réduire d’environ…', options: ['75 %', '25 %', '50 %'], a: 0, explain: '(8 − 2) / 8 = 75 %. Une transformation profonde de nos modes de vie et de production.' },
      { q: 'Quel gaz domine l’empreinte carbone française ?', options: ['Le CO₂ (≈ 74 %)', 'Le méthane (≈ 74 %)', 'Le N₂O (≈ 74 %)'], a: 0, explain: 'CO₂ ≈ 74 %, méthane ≈ 18 %, N₂O ≈ 5 % (SDES, 2024).' },
    ] },
};

// Courbe schématique du climat (100 000 ans) : oscillations puis plateau holocène
const climate = []; for (let i = 0; i <= 100; i++) { const age = -100 + i; const holo = age > -11; const v = holo ? -35 + Math.sin(i) * 0.3 : -41 + Math.sin(i * 1.7) * 2.2 + Math.sin(i * 0.53) * 2.5 + ((i * 37) % 7) / 3; climate.push([age, v]); }
const accel = []; for (let y = 1750; y <= 2020; y += 10) accel.push([y, y < 1950 ? 1 + (y - 1750) / 120 : 2.7 + Math.pow((y - 1950) / 70, 2) * 9]);

export const MURALS = {
  holocene: { title: 'Fresque I — 100 000 ans de climat', inv: ['M1-15', 'M1-16'], codex: ['carottes_glace'], onView: ['flag:vu_holocene', 'script:fresques_check'],
    chart: { type: 'line', title: 'Température reconstituée (schéma, carottes de glace)', points: climate, ymin: -46, ymax: -32, band: [-11, 0], bandLabel: 'Holocène', xticks: [-100, -80, -60, -40, -20, 0], xfmt: t => (t ? t + ' ka' : 'auj.'), yticks: [-44, -36], yfmt: t => (t === -44 ? 'froid' : 'chaud'), markers: [{ x: -70, label: 'Climat chaotique' }, { x: -10, label: 'Début de l’agriculture', dy: 30 }], xlabel: 'Milliers d’années avant aujourd’hui', note: 'Courbe redessinée d’après les enregistrements δ¹⁸O du Groenland' },
    text: 'Pendant 100 000 ans, le climat fait des **montagnes russes** : jusqu’à 10 °C de variation en une décennie. Puis, il y a ~10 000 ans, il se stabilise : c’est l’**Holocène**. Les premières migrations, l’arrivée des humains en Australie, puis l’agriculture et les civilisations se calent sur cette stabilité.',
    source: 'Redessiné d’après les données des carottes de glace (Groenland, δ¹⁸O) présentées par J. Rockström ; anciennes images du cours (ResearchGate).' },
  acceleration: { title: 'Fresque II — La Grande Accélération', inv: ['M1-13', 'M1-20'], codex: ['anthropocene'], onView: ['flag:vu_acceleration', 'script:fresques_check'],
    chart: { type: 'line', title: 'Activité humaine (indice : population, énergie, CO₂, engrais…)', points: accel, ymin: 0, ymax: 12, xticks: [1750, 1850, 1950, 2020], yticks: [0, 12], markers: [{ x: 1950, label: 'Grande Accélération' }], color: '#c0392b', note: 'Schéma redessiné (Steffen et al.)' },
    text: 'À partir de **1950**, toutes les courbes s’envolent : population, PIB, énergie, engrais, CO₂, températures. En à peine 50 ans, l’humanité a fait sortir la Terre de l’état stable de l’Holocène. On parle d’**Anthropocène** : l’ère où l’activité humaine est la principale force qui transforme la planète.',
    source: 'Steffen et al., *The trajectory of the Anthropocene: The Great Acceleration* (2015), redessiné.' },
  effet_serre: { title: 'Fresque du temple — De quoi est faite notre empreinte ?', inv: ['M1-47'], codex: ['prg'],
    chart: { type: 'donut', title: 'Empreinte carbone de la France par gaz (2024)', labels: ['CO₂', 'Méthane (CH₄)', 'Protoxyde d’azote (N₂O)', 'Gaz fluorés'], values: [74, 18, 5, 3], unit: ' %', center: '≈ 563 Mt' },
    text: 'L’empreinte carbone de la France (≈ 563 Mt CO₂e en 2024, soit ~8,2 t par personne) compte aussi les émissions **importées** (environ la moitié). Le CO₂ domine, mais le méthane et le N₂O pèsent lourd malgré de faibles quantités, à cause de leur PRG.',
    source: 'SDES (ministère de la Transition écologique), *L’empreinte carbone de la France de 1990 à 2024* (estimation provisoire).' },
};

export const CODEX = {
  fresque: { region: 'steppe', title: 'La Grande Fresque des causes', inv: ['M1-39', 'M1-47'], text: 'Une chaîne de causes et de conséquences :\n① **Activités** (fabriquer nos appareils, brûler des fossiles, déforester) → ② **émissions** (CO₂, CH₄, N₂O) → ③ **mécanismes** (effet de serre renforcé ; l’océan absorbe ≈ 90 % de la chaleur et ≈ ¼ du CO₂) → ④ **effets mesurés** (≈ +1,1 °C en 2011-2020, ≈ +20 cm de mers depuis 1900, acidification) → ⑤ **conséquences** (canicules, sécheresses, biodiversité, récoltes, déplacements).\n\nChaque maillon est un **levier** : agir en amont réduit tout ce qui suit.', source: 'GIEC AR6 (2021-2023) ; OMM (2025) ; ADEME-Arcep (2022-2025).' },
  holocene: { region: 'steppe', title: 'L’Holocène, berceau des civilisations', inv: ['M1-10', 'M1-11', 'M1-12', 'M1-14'], text: 'Durant 100 000 ans, le climat était instable (jusqu’à 10 °C de variation en une décennie). Depuis ~10 000 ans, l’**Holocène** offre une stabilité exceptionnelle : ±1 °C.\n\nCette stabilité a permis : une **agriculture prévisible** (riz, blé, maïs semés au bon moment), des **ressources en eau stables** (niveau des océans, cycles hydrologiques), une **biodiversité abondante**.\n\nServices « gratuits » de la biosphère : atmosphère respirable, calottes glaciaires qui régulent le niveau des mers, pollinisation, cycles de l’eau. Sans eux, ni économie moderne ni infrastructure numérique.', source: 'J. Rockström, Potsdam Institute for Climate Impact Research ; ancien cours.' },
  anthropocene: { region: 'steppe', title: 'L’Anthropocène', inv: ['M1-13'], text: 'Nous sommes sortis de l’état stable de l’Holocène en ~50 ans, sous l’effet des gaz à effet de serre. Beaucoup de scientifiques parlent d’**Anthropocène**, l’ère où l’humanité est la principale force géologique.\n\n**Nuance (2024)** : l’Union internationale des sciences géologiques a rejeté la proposition d’en faire officiellement une époque géologique. Le terme reste très utilisé pour décrire la rupture.\n\nPour un·e manager IT : l’infrastructure numérique dépend entièrement de la stabilité héritée de l’Holocène ; sa disparition crée des **risques systémiques**.', source: 'Ancien cours ; décision de l’IUGS (mars 2024).' },
  grande_acceleration: { region: 'steppe', title: 'La Grande Accélération', inv: ['M1-20', 'M1-24'], text: 'Vers 1950-1955, toutes les courbes d’activité humaine (population, énergie, eau, engrais, transports, télécommunications) et d’impact (CO₂, température, biodiversité) deviennent **exponentielles**.', source: 'Steffen et al. (2015) ; conférence de J. Rockström (WEF).' },
  carbon_law: { region: 'steppe', title: 'La Carbon Law', inv: ['M1-21', 'M1-26'], text: 'Pour rester sous +1,5/2 °C : **diviser les émissions mondiales par deux chaque décennie** (une « loi de Moore » climatique), jusqu’à la neutralité vers 2050.', source: 'Rockström et al., *A roadmap for rapid decarbonization*, Science (2017).' },
  points_bascule: { region: 'steppe', title: 'Les points de bascule', inv: ['M1-22', 'M1-28', 'M1-29'], text: 'Un **point de bascule** est un seuil au-delà duquel un système s’emballe de lui-même par des boucles de rétroaction, de façon difficilement réversible : calottes glaciaires, pergélisol, forêt amazonienne (déjà en partie source de carbone), courants océaniques…\n\nRisque : faire passer la Terre de « partenaire » à « ennemie ».', source: 'J. Rockström (WEF) ; Global Tipping Points Report (2023).' },
  ocean_chaleur: { region: 'steppe', title: 'L’océan, éponge à chaleur', inv: ['M1-25'], text: 'L’océan a absorbé environ **90 %** de l’excès de chaleur dû aux gaz à effet de serre, et environ un quart du CO₂ émis — d’où son **acidification**.', source: 'GIEC, AR6 (2021).' },
  effet_serre: { region: 'steppe', title: 'L’effet de serre', inv: ['M1-39', 'M1-40'], text: 'Phénomène **naturel et indispensable** : certains gaz retiennent une partie de l’énergie solaire réémise par la Terre. Sans eux, la température moyenne serait d’environ **−18 °C**.\n\nLe problème : l’augmentation rapide de leur concentration (industrie, transports, agriculture intensive, déforestation) **renforce** l’effet de serre. C’est la cause principale du réchauffement observé.', source: 'ADEME ; GIEC AR6 GT1 (2021).' },
  prg: { region: 'steppe', title: 'Le PRG et le CO₂ équivalent', inv: ['M1-41', 'M1-42', 'M1-43'], text: 'Chaque gaz a un **temps de séjour**, une **concentration** (ppm, ppb) et un **pouvoir radiatif**. Pour les comparer, le GIEC a défini le **Pouvoir de Réchauffement Global** (PRG, ou GWP) à 100 ans, avec CO₂ = 1. Les bilans s’expriment en **CO₂e**.\n\nValeurs (GIEC AR6) : méthane ≈ 27 à 30 · protoxyde d’azote ≈ 273 · certains gaz fluorés > 10 000.\n*L’ancien cours citait les valeurs AR5 : CH₄ = 28, N₂O = 265.*', source: 'GIEC AR6 GT1, chapitre 7 (2021) ; Base Empreinte de l’ADEME.' },
  deux_tonnes: { region: 'steppe', title: 'Objectif 2 tonnes', inv: ['M1-44', 'M1-45', 'M1-46', 'M1-49', 'M1-50', 'M1-52'], text: 'Accord de Paris (COP21, 2015) : limiter le réchauffement bien en dessous de +2 °C, si possible +1,5 °C, et atteindre la **neutralité carbone vers 2050**. Cela correspond à environ **2 t CO₂e par personne et par an**.\n\nEmpreinte moyenne en France : **8,2 t** (estimation 2024, SDES), contre 9,0 t en 2021 dans l’ancien cours, et 12,1 t en 1990. Soit encore environ 4 fois l’objectif.\n\nLe numérique pèse **4,4 %** de l’empreinte carbone française (ADEME-Arcep, données 2022 publiées en 2025 ; 2,5 % dans l’étude précédente, avec un périmètre plus étroit).', source: 'SDES (2025) ; ADEME-Arcep (2025) ; Base Empreinte / Nos Gestes Climat (ADEME).' },
  quatre_piliers: { region: 'steppe', title: 'Les quatre piliers de notre empreinte', inv: ['M1-32', 'M1-33'], text: '**Alimentation et agriculture**, **consommation de biens**, **transports**, **habitat et énergie**. Ensemble, ils concentrent l’essentiel de nos émissions (en France, transports, logement et alimentation ≈ 68 % de l’empreinte, SDES 2024) et une pression critique sur les ressources.\n\n*L’ancien cours citait un « indice d’épuisement des ressources de 85 % » : chiffre non sourcé, retiré.*', source: 'SDES (2025) ; ancien cours.' },
  records_chaleur: { region: 'steppe', title: 'Les records de chaleur', inv: ['M1-34', 'M1-35', 'M1-36'], text: '**2024** est l’année la plus chaude jamais mesurée : **+1,60 °C** au-dessus de l’ère préindustrielle, la première année civile au-delà de +1,5 °C. **2025** est la 3e plus chaude (+1,47 °C). La période **2023-2025** est la première de trois ans au-dessus de +1,5 °C en moyenne.\n\n*L’ancien cours citait 2023 comme record (avec des pointes journalières à +2 °C en novembre 2023 et un record de température de surface des océans d’avril à décembre 2023), et une probabilité « > 80 % » de dépasser durablement +1,5 °C d’ici 2027-2028.* Prévision de l’OMM (2025) : environ **70 % de chances** que la moyenne 2025-2029 dépasse +1,5 °C. Un dépassement « durable » au sens de l’Accord de Paris se mesure sur 20 ans.', source: 'Copernicus, *Global Climate Highlights 2025* (janv. 2026) ; OMM, *Global Annual to Decadal Climate Update* (2025).' },
  corridor: { region: 'steppe', title: 'Le corridor de température', inv: ['M1-30'], text: 'Selon J. Rockström, la température moyenne de la Terre n’a pas dépassé environ **+2 °C** (par rapport au préindustriel) depuis environ 3 millions d’années. Nous nous approchons de la sortie de ce « corridor ».', source: 'J. Rockström, *Beyond the Anthropocene* (WEF).' },
  carottes_glace: { region: 'steppe', title: 'Lire le climat dans la glace', inv: ['M1-15', 'M1-16', 'M1-17'], text: 'Les **carottes de glace** (Groenland, Antarctique) emprisonnent de l’air et des isotopes (δ¹⁸O) qui permettent de reconstituer températures et concentrations de CO₂ sur des centaines de milliers d’années.', source: 'Ancien cours (documents 1 et 2).' },
  vulnerabilite_it: { region: 'steppe', title: 'Le numérique face au climat', inv: ['M1-38'], text: 'Les infrastructures numériques sont vulnérables : **refroidissement** des centres de données pendant les canicules, **câbles sous-marins** et stations d’atterrissement côtières exposés à la montée des eaux, **chaînes d’approvisionnement** en composants dépendantes de ressources rares.\n\nEnjeu managérial : intégrer les risques climatiques aux stratégies d’infrastructure et anticiper les contraintes réglementaires.', source: 'Ancien cours ; Climate Central.' },
  bouclier_verite: { region: 'steppe', title: 'Le Bouclier de Vérité', inv: [], text: 'Maintiens **Maj** face à une bulle d’idée lancée par un ennemi : tu dois dire si l’affirmation est **VRAIE ou FAUSSE**. Bonne réponse : la bulle est renvoyée et l’ennemi étourdi. Mauvaise réponse : tu prends un coup… mais tu apprends pourquoi.', source: '—' },
};

export const STATEMENTS = [
  { id: 's_climat_toujours', r: 'steppe', v: false, t: 'Le climat a toujours changé, il n’y a rien d’anormal.', x: 'Depuis 10 000 ans, il n’a varié que de ±1 °C. Le rythme actuel est inédit et d’origine humaine.', inv: ['M1-10'] },
  { id: 's_co2_seul', r: 'steppe', v: false, t: 'Le CO₂ est le seul gaz à effet de serre qui compte.', x: 'Méthane (PRG ~28) et N₂O (~273) pèsent lourd, ainsi que les gaz fluorés.', inv: ['M1-43'] },
  { id: 's_effet_serre_mal', r: 'steppe', v: false, t: 'L’effet de serre est une invention humaine à supprimer.', x: 'Il est naturel et vital : sans lui, −18 °C. C’est son renforcement qui pose problème.', inv: ['M1-39'] },
  { id: 's_18', r: 'steppe', v: true, t: 'Sans effet de serre naturel, la Terre serait à environ −18 °C.', x: 'Exact : l’effet de serre naturel rend la vie possible.', inv: ['M1-39'] },
  { id: 's_2024', r: 'steppe', v: true, t: '2024 a été l’année la plus chaude jamais mesurée.', x: '+1,60 °C par rapport au préindustriel (Copernicus).', inv: ['M1-34'] },
  { id: 's_ocean', r: '*', v: true, t: 'L’océan a absorbé environ 90 % de la chaleur excédentaire.', x: 'Exact (GIEC AR6).', inv: ['M1-25'] },
  { id: 's_2deg', r: 'steppe', v: false, t: '+2 °C de moyenne, c’est à peine une différence entre deux journées.', x: 'Une moyenne mondiale : en 10 000 ans, elle n’a varié que de ±1 °C. +2 °C bouleverse saisons, récoltes, niveaux des mers.', inv: ['M1-30'] },
  { id: 's_import', r: 'steppe', v: true, t: 'Environ la moitié de l’empreinte carbone française vient des importations.', x: 'Exact : ~284 Mt sur ~563 Mt en 2024 (SDES).', inv: ['M1-44'] },
];

export const COMBAT = [
  { id: 'c_holo', r: 'steppe', q: 'Que désigne l’Holocène ?', options: ['10 000 ans de climat stable', 'Une ère glaciaire', 'Le XXe siècle', 'Une limite planétaire'], a: 0, explain: '±1 °C pendant 10 millénaires.' },
  { id: 'c_prg_ch4', r: 'steppe', q: 'Le PRG du méthane à 100 ans vaut environ…', options: ['28', '1', '273', '10 000'], a: 0, explain: 'Environ 28 (27 à 30 selon l’AR6).' },
  { id: 'c_2t', r: 'steppe', q: 'Quel budget carbone individuel vise-t-on pour 2050 ?', options: ['≈ 2 t CO₂e/an', '≈ 8 t CO₂e/an', '≈ 0,2 t CO₂e/an', '≈ 20 t CO₂e/an'], a: 0, explain: 'Compatible avec l’Accord de Paris.' },
  { id: 'c_carbonlaw', r: 'steppe', q: 'La Carbon Law demande de…', options: ['Diviser les émissions par 2 chaque décennie', 'Les stabiliser', 'Les réduire de 1 %/an', 'Planter des arbres'], a: 0, explain: '−50 % tous les 10 ans.' },
];

export const ON_ENTER = { steppe: ['if:flag:tuto_fini', 'done:main_village', 'quest:main_steppe'] };
export const ON_SEED = { steppe: ['done:main_steppe', 'toast:Le **Bouclier de Vérité** dissipe le brouillard au nord : direction le **Bassin des 9 Sceaux** !'] };
