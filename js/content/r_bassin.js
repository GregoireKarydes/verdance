// =============================================================
// Région 2 — Bassin des 9 Sceaux (limites planétaires, inaction)
// =============================================================
import { look } from './r_village.js';
import { BOUNDARIES } from './common.js';

export const NPCS = {
  neva: { id: 'neva', name: 'Observatrice Néva', look: look('#4a3a8a', '#1a1a3a', { hairStyle: 2, glasses: true, robe: '#3a2a6a' }), inv: ['M1-27', 'M1-55'],
    talk: [
      { if: '!flag:neva_1', mark: 'quest', say: ['Bienvenue au Bassin des 9 Sceaux. Ce lac était plein, autrefois.', 'Les neuf obélisques représentent les **9 limites planétaires** définies par Johan Rockström et son équipe : les seuils à ne pas franchir pour que la Terre reste un espace sûr pour l’humanité.', 'Regarde d’abord la **pierre de projection**, au nord-est. Ensuite, examine chaque obélisque.'], act: ['flag:neva_1', 'step:main_bassin:1'] },
      { if: 'step:main_bassin==1', say: ['La pierre de projection est au nord-est du Bassin.'] },
      { if: 'step:main_bassin==2', say: ['Examine les neuf obélisques autour du lac asséché. Combien sont fissurés ?'] },
      { if: 'step:main_bassin==3', mark: 'quest', say: ['Sept limites sur neuf franchies… Pour ouvrir l’Observatoire, il me faut l’accord du bourg, à l’ouest. Mais ses trois chefs passent leur temps à se renvoyer la faute.', 'Réconcilie-les au **piédestal du Tribunal**.'] },
      { if: 'step:main_bassin>=4&!flag:observatoire_ouvert', mark: 'quest', say: ['Tu as brisé le triangle ! Le bourg accepte enfin de coopérer. L’**Observatoire** est ouvert, au sud-est. Le Sceau des Limites t’y attend.'], act: ['flag:observatoire_ouvert', 'step:main_bassin:5'] },
      { if: '!seed:bassin', say: ['L’Observatoire est au sud-est. Bonne chance.'] },
      { say: ['L’ozone se rétablit, le lac se remplit… L’action collective, ça marche.'] },
    ] },
  pol: { id: 'pol', name: 'Bourgmestre Pol', look: look('#2a2a4a', '#5a5a5a', { hairStyle: 3, beard: '#5a5a5a', hat: 'crown' }), inv: ['M1-64', 'M1-62'],
    talk: [
      { if: '!flag:tribunal_ok', say: ['« L’État a des leviers limités. On a les élus qu’on mérite. Les ressources et l’innovation sont dans le secteur privé. »', 'Que les marchands et les citoyens commencent, moi je suivrai !'], ask: { q: 'Pol te tend un parchemin animé.', options: [{ t: 'Regarder la vidéo de Christophe Cassou', act: ['video:triangle'] }, { t: 'Plus tard', say: ['Comme vous voudrez.'] }] } },
      { say: ['Grâce à toi, j’ai fait voter un plan : réparation obligatoire, achats publics reconditionnés. Et les autres suivent !'] },
    ] },
  marga: { id: 'marga', name: 'Négociante Marga', look: look('#aa6a2a', '#3a1a0a', { hairStyle: 2, apron: '#f0d0a0' }), inv: ['M1-64'],
    talk: [
      { if: '!flag:tribunal_ok', say: ['« Si mes clients ne changent pas leurs habitudes, je ne peux pas changer mon offre. Je mourrais face à la concurrence. »', 'Et sans règles du Bourgmestre, pourquoi serais-je la seule à faire des efforts ?'] },
      { say: ['Je vends des appareils reconditionnés maintenant. Et ça marche !'] },
    ] },
  indi: { id: 'indi', name: 'Indi le citoyen', look: look('#5a8a3a', '#8a5a2a', { hat: 'cap', hatColor: '#3a6a3a' }), inv: ['M1-64'],
    talk: [
      { if: '!flag:tribunal_ok', say: ['« Je n’ai aucun pouvoir face aux multinationales. On est trop peu d’écolos face aux grandes puissances. »', 'Alors à quoi bon ?'] },
      { say: ['J’ai compris : je ne suis pas seul. Et mes choix comptent… surtout quand on s’y met ensemble.'] },
    ] },
  pecheur: { id: 'pecheur', name: 'Pêcheur Galet', look: look('#3a6a8a', '#8a8a8a', { hairStyle: 3, beard: '#9a9a9a', hat: 'cap', hatColor: '#c8a050' }), inv: ['M1-59'],
    talk: [
      { if: '!quest:qs_zones_mortes', mark: 'quest', say: ['Plus un poisson dans le delta… Trop d’engrais azotés ruissellent jusqu’à la mer. Les algues prolifèrent, puis pourrissent en consommant tout l’oxygène.', 'On appelle ça des **zones mortes**. Tu veux comprendre ?'], act: ['quest:qs_zones_mortes', 'puzzle:zones_qcm'] },
      { if: '!done:qs_zones_mortes', mark: 'quest', say: ['Alors, tu veux réessayer ?'], act: ['puzzle:zones_qcm'] },
      { say: ['Quand les flux d’azote baissent, la vie revient. Lentement.'] },
    ] },
  ozonie: { id: 'ozonie', name: 'Ozonie la vieille', look: look('#6a8aaa', '#f0f0f0', { hairStyle: 2, robe: '#4a6a8a' }), inv: ['M1-60'],
    talk: [
      { if: '!quest:qs_ozone', mark: 'quest', say: ['Quand j’étais jeune, le ciel avait un **trou** : la couche d’ozone, qui nous protège des UV, disparaissait à cause des gaz CFC des frigos et des aérosols.', 'En **1987**, presque tous les pays ont signé le **Protocole de Montréal** pour interdire ces gaz. Et aujourd’hui, l’ozone se reconstitue !', 'C’est la preuve que **l’action collective fonctionne**. Tiens : j’ai coupé les ronces devant mon vieil abri, au sud-ouest. Va le visiter.'], act: ['quest:qs_ozone', 'flag:ozone_vu', 'codex:montreal', 'done:qs_ozone'] },
      { say: ['Montréal, 1987. N’oublie jamais : quand on veut, on peut.'] },
    ] },
};

const obelisks = {};
BOUNDARIES.forEach((b, i) => {
  obelisks['obelisk:' + i] = [{ say: [{ who: `Obélisque — ${b.name}`, t: (b.ok ? '✔ Intact. ' : '✖ Fissuré. ') + b.text }], act: ['flag:obelisk_vu_' + i, 'script:obel_check'] }];
});

export const SCRIPTS = {
  ...obelisks,
  obel_check: [{ if: 'count:obelisk_vu_>=9&step:main_bassin==2', act: ['step:main_bassin:3', 'codex:neuf_limites', 'toast:Les 9 obélisques sont examinés : **7 limites sur 9 sont dépassées** (bilan 2025).'] }, { act: [] }],
  tribunal: [
    { if: 'step:main_bassin<3', say: [{ who: 'Piédestal du Tribunal', t: 'Un piédestal gravé d’un triangle. Les trois chefs du bourg ne sont pas prêts à t’écouter : examine d’abord les obélisques.' }] },
    { if: 'flag:tribunal_ok&step:main_bassin<4', act: ['open:q3_triangle'] },
    { if: 'flag:tribunal_ok', say: [{ who: 'Piédestal du Tribunal', t: 'Le triangle est brisé. Le bourg coopère.' }] },
    { say: [{ who: 'Piédestal du Tribunal', t: 'Pol, Marga et Indi se rassemblent autour du piédestal. Le Tribunal du Triangle commence.' }], act: ['puzzle:tribunal'] },
  ],
  'secret:ozone': [{ say: [{ who: 'Abri du Ciel Réparé', t: 'Des coupures de journaux de 1987, une boîte de vieux aérosols interdits… et un mot : « Merci à ceux qui ont agi. »' }], act: ['codex:montreal'] }],
};

export const QUESTS = [
  { id: 'main_bassin', title: 'Les neuf sceaux', region: 'bassin', main: true, steps: [
    { t: 'Parle à l’Observatrice Néva', at: 'neva' }, { t: 'Regarde la projection sur les limites planétaires', at: 'proj_limites' }, 'Examine les 9 obélisques autour du lac',
    { t: 'Réconcilie le bourg au Tribunal du Triangle', at: 'ped_tribunal' }, { t: 'Retourne voir Néva', at: 'neva' }, { t: 'Explore l’Observatoire des Limites', at: 'temple_observatoire' }, 'Replante la Graine-Mère'] },
  { id: 'qs_zones_mortes', title: 'Les zones mortes', region: 'bassin', giver: 'pecheur', steps: [{ t: 'Aide le pêcheur à comprendre l’eutrophisation', at: 'pecheur' }], reward: { graines: 15 } },
  { id: 'qs_ozone', title: 'Le trou dans le ciel', region: 'bassin', giver: 'ozonie', steps: ['Écoute Ozonie'], reward: { graines: 5 } },
];

export const PUZZLES = {
  tribunal: { type: 'choice', title: 'Le Tribunal du Triangle', region: 'bassin', icon: '⚖', stepLabel: 'Audience', inv: ['M1-63', 'M1-64', 'M1-65'],
    intro: 'Le **triangle de l’inaction** (Christophe Cassou, climatologue au CNRS) : individus, entreprises et politiques se renvoient la responsabilité, et personne n’agit. Identifie qui parle, puis brise le triangle.',
    onWin: ['flag:tribunal_ok', 'codex:triangle_inaction', 'open:q3_triangle'],
    nodes: [
      { who: 'Voix n°1', text: '« L’État a des leviers limités. On a les élus qu’on mérite. Les ressources et l’innovation sont dans le secteur privé. »', options: [{ t: 'C’est le Politique', ok: true, fb: 'Oui : il renvoie vers les citoyens et les entreprises.' }, { t: 'C’est l’Entreprise', fb: 'Non, l’entreprise ne dirait pas « on a les élus qu’on mérite ».' }, { t: 'C’est l’Individu', fb: 'Relis : qui parle de « l’État » comme d’une chose qu’il gère ?' }] },
      { who: 'Voix n°2', text: '« Je n’ai aucun pouvoir face aux multinationales. On est trop peu d’écolos face aux grandes puissances. »', options: [{ t: 'C’est l’Individu', ok: true, fb: 'Oui : il se sent impuissant et renvoie vers les entreprises et les États.' }, { t: 'C’est le Politique', fb: 'Non.' }, { t: 'C’est l’Entreprise', fb: 'Non.' }] },
      { who: 'Voix n°3', text: '« Si mes clients ne changent pas leurs habitudes, je ne peux pas changer mon offre. Je mourrais face à la concurrence. »', options: [{ t: 'C’est l’Entreprise', ok: true, fb: 'Oui : elle renvoie vers les clients et la régulation.' }, { t: 'C’est l’Individu', fb: 'Non.' }, { t: 'C’est le Politique', fb: 'Non.' }] },
      { who: 'Le bourg entier', text: 'Tout le monde te regarde. Que proposes-tu pour briser le triangle ?', options: [
        { t: 'Attendre que l’un des trois fasse le premier pas', fb: 'C’est exactement le piège du triangle : chacun attend les autres.' },
        { t: 'Que chacun agisse dans sa sphère et entraîne les autres : s’informer, être cohérent, agir au travail, montrer l’exemple', ok: true, fb: 'Oui ! Prendre conscience est le premier pas. Un·e manager IT est à la fois citoyen·ne, décideur·se technique et force de proposition auprès des dirigeants.' },
        { t: 'Désigner un coupable et le punir', fb: 'Chercher un coupable entretient le blocage.' }] },
    ] },
  obs_terminal: { type: 'input', title: 'Salle 1 — Le terminal de décryptage', region: 'bassin', icon: '🔐', inv: ['M1-61', 'M1-55', 'M1-57', 'M1-58', 'M1-59'],
    intro: 'Le terminal de l’Observatoire exige cinq données pour stabiliser l’archive.',
    fields: [
      { q: '1. Élément des engrais qui provoque l’eutrophisation et les « zones mortes »', accept: ['azote', 'l’azote', 'n', 'nitrogen'], ph: 'un mot' },
      { q: '2. Nombre de limites planétaires dépassées selon le bilan 2025', num: 7, tol: 0, ph: 'nombre' },
      { q: '3. Pourcentage approximatif du couvert forestier mondial déjà disparu', num: 40, tol: 5, unit: '%' },
      { q: '4. Phénomène de l’océan dû à l’absorption d’un quart du CO₂ humain', accept: ['acidification', 'l’acidification', 'acidification des oceans'], ph: 'un mot' },
      { q: '5. Nombre de « zones mortes » citées dans la vidéo', num: 400, tol: 0 },
    ],
    hints: ['Les obélisques et les « intels » de la vidéo contiennent toutes les réponses (Codex, touche C).', 'La vidéo date d’avant le bilan 2025 : elle dit 6 limites, le bilan 2025 en compte 7.'],
    onWin: ['codex:deforestation', 'codex:acidification'],
    explain: 'Les « zones mortes » se comptent aujourd’hui par **centaines** (plus de 500 sites côtiers à faible oxygène recensés en 2018).' },
  obs_cadrans: { type: 'lock', title: 'Salle 2 — La serrure des neuf cadrans', region: 'bassin', icon: '🔒', inv: ['M1-55', 'M1-60'],
    intro: 'Chaque molette correspond à une limite planétaire. Règle-les sur leur état actuel (bilan 2025).',
    dials: BOUNDARIES.map(b => ({ label: b.name, values: ['?', 'Dépassée', 'Sûre'], a: b.ok ? 2 : 1 })),
    hints: ['Seules deux limites sont encore dans la zone sûre.', 'L’une d’elles se rétablit grâce au Protocole de Montréal.'],
    explain: '**7 limites dépassées** : climat, biosphère, sols, eau douce, azote/phosphore, nouvelles entités, acidification. **2 dans la zone sûre** : ozone et aérosols.' },
  zones_qcm: { type: 'qcm', title: 'Les zones mortes', region: 'bassin', main: false, icon: '🐟', inv: ['M1-59', 'M1-61'],
    onWin: ['done:qs_zones_mortes', 'codex:zones_mortes'],
    questions: [
      { q: 'Quel processus crée les « zones mortes » ?', options: ['L’eutrophisation : trop de nutriments, prolifération puis décomposition des algues qui consomment l’oxygène', 'Le réchauffement des fonds marins par les câbles', 'La surpêche'], a: 0, explain: 'L’excès d’azote et de phosphore (engrais, effluents) asphyxie les eaux.' },
      { q: 'À quelle limite planétaire est-ce lié ?', options: ['Les flux biogéochimiques (azote, phosphore)', 'La couche d’ozone', 'Les aérosols'], a: 0, explain: 'Une des limites les plus dépassées.' },
      { q: 'Combien de zones mortes côtières recense-t-on aujourd’hui ?', options: ['Plusieurs centaines (plus de 500)', 'Une dizaine', 'Aucune, c’est un mythe'], a: 0, explain: 'Plus de 400 dans les années 2000, plus de 500 recensées en 2018 (Breitburg et al., Science).' },
    ] },
};

export const MURALS = {
  limites: { title: 'Fresque de l’Observatoire — État des 9 limites (2025)', inv: ['M1-55'], codex: ['neuf_limites'],
    chart: { type: 'grid', title: 'Les 9 limites planétaires — Planetary Health Check 2025', cols: 3, cells: BOUNDARIES.map((b, i) => ({ s: b.name, col: b.ok ? '#8fd6a0' : '#f0a090', c: i % 3, r: Math.floor(i / 3) })), legend: [{ col: '#f0a090', t: 'Dépassée (7)' }, { col: '#8fd6a0', t: 'Zone sûre (2)' }] },
    text: 'En 2009, l’équipe de Rockström définit 9 limites. En 2015, 4 sont dépassées ; en 2023, 6 ; en **2025, 7** avec l’acidification des océans. Seules la couche d’ozone (en rétablissement) et les aérosols restent dans la zone sûre.',
    source: 'Potsdam Institute, *Planetary Health Check 2025* (septembre 2025) ; Richardson et al., Science Advances (2023).' },
};

export const CODEX = {
  neuf_limites: { region: 'bassin', title: 'Les 9 limites planétaires', inv: ['M1-27', 'M1-55'], text: 'Neuf processus qui régulent la stabilité de la Terre : climat, biosphère, usage des sols, eau douce, flux d’azote et de phosphore, nouvelles entités, acidification des océans, ozone stratosphérique, aérosols.\n\n**Bilan 2025 : 7 sur 9 dépassées** (l’ancien cours, d’après la vidéo, disait 6 sur 9 : l’acidification des océans a été ajoutée en 2025).', source: 'Potsdam Institute for Climate Impact Research, *Planetary Health Check 2025*.' },
  biodiversite: { region: 'bassin', title: 'L’effondrement du vivant', inv: ['M1-56'], text: 'L’Indice Planète Vivante du WWF (2024) montre une **baisse moyenne de 73 %** de la taille des populations de vertébrés sauvages suivies depuis 1970 (35 000 populations, 5 495 espèces).\n\n⚠ Erreur fréquente (et dans l’ancien cours) : dire que « 73 % des animaux ont disparu ». C’est une moyenne des déclins de populations, pas une proportion d’animaux disparus.', source: 'WWF, *Rapport Planète Vivante 2024*.' },
  deforestation: { region: 'bassin', title: 'La déforestation', inv: ['M1-57', 'M1-61'], text: 'L’équivalent de **10 terrains de football** de forêt disparaît chaque minute (chiffre de la vidéo TF1). Il reste environ 60 % du couvert forestier d’origine : environ **40 % a disparu**, au-delà de la limite (75 % à préserver).', source: 'Vidéo TF1 Info ; Richardson et al. (2023).' },
  acidification: { region: 'bassin', title: 'L’acidification des océans', inv: ['M1-58'], text: 'L’océan absorbe environ un quart du CO₂ émis par l’humanité, ce qui le rend plus acide : **+30 % d’acidité** depuis le XIXe siècle. Coraux, coquillages et plancton en souffrent. Limite dépassée selon le bilan 2025.', source: 'Planetary Health Check 2025 ; vidéo TF1 Info.' },
  zones_mortes: { region: 'bassin', title: 'Les zones mortes', inv: ['M1-59'], text: 'Les engrais azotés et phosphatés ruissellent jusqu’à la mer ; les algues prolifèrent, puis se décomposent en consommant l’oxygène : c’est l’**eutrophisation**. La vidéo du cours parlait de plus de 400 zones mortes ; on recense désormais **plus de 500 sites côtiers** à faible oxygène.', source: 'Breitburg et al., *Declining oxygen in the global ocean and coastal waters*, Science (2018).' },
  montreal: { region: 'bassin', title: 'Le Protocole de Montréal', inv: ['M1-60'], text: 'Signé en 1987 et ratifié par tous les pays de l’ONU, il a interdit les CFC qui détruisaient la couche d’ozone. Celle-ci se reconstitue et devrait retrouver son état de 1980 vers 2040-2066 selon les régions.\n\nC’est la preuve que **l’action collective internationale fonctionne**.', source: 'PNUE / OMM, *Scientific Assessment of Ozone Depletion* (2022).' },
  triangle_inaction: { region: 'bassin', title: 'Le triangle de l’inaction', inv: ['M1-62', 'M1-63', 'M1-64', 'M1-65'], text: 'Concept du climatologue Christophe Cassou : **individu**, **entreprise** et **politique** se renvoient la responsabilité (« les politiques n’agissent pas », « mes clients ne sont pas prêts », « les électeurs ne veulent pas de contraintes »).\n\nEn sortir : s’informer en continu (rapports du GIEC), adopter des comportements cohérents, agir dans sa sphère professionnelle (critères environnementaux dans les décisions IT, projets d’éco-conception), diffuser par l’exemple.\n\nLe manager IT agit sur les **trois sommets** : citoyen, décideur technique, force de proposition auprès des dirigeants et régulateurs.', source: 'Christophe Cassou (CNRS) ; ancien cours.' },
};

export const STATEMENTS = [
  { id: 'b_arbres', r: '*', v: false, t: 'Il suffit de planter des arbres pour compenser nos émissions.', x: 'La compensation est lente, incertaine et limitée. Il faut d’abord réduire à la source.', inv: ['M4-10'] },
  { id: 'b_climat_seul', r: 'bassin', v: false, t: 'Les limites planétaires ne concernent que le climat.', x: 'Il y en a neuf : biodiversité, sols, eau, azote, océans, nouvelles entités…', inv: ['M1-27'] },
  { id: 'b_autres', r: 'bassin', v: false, t: 'C’est aux autres d’agir en premier.', x: 'C’est le triangle de l’inaction : chacun attend les autres, donc personne n’agit.', inv: ['M1-63'] },
  { id: 'b_73', r: 'bassin', v: false, t: '73 % des animaux sauvages ont disparu depuis 1970.', x: 'Nuance : c’est une baisse MOYENNE de 73 % de la taille des populations suivies (WWF 2024), pas 73 % des animaux.', inv: ['M1-56'] },
  { id: 'b_7sur9', r: 'bassin', v: true, t: 'Sept limites planétaires sur neuf sont dépassées (bilan 2025).', x: 'Exact : l’acidification des océans est la 7e.', inv: ['M1-55'] },
  { id: 'b_ozone', r: '*', v: true, t: 'La couche d’ozone se reconstitue grâce au Protocole de Montréal.', x: 'Exact : l’action collective fonctionne.', inv: ['M1-60'] },
  { id: 'b_foret', r: 'bassin', v: true, t: 'Environ 40 % du couvert forestier mondial a disparu.', x: 'Exact, il en reste environ 60 % (limite : 75 %).', inv: ['M1-61'] },
  { id: 'b_acid', r: 'bassin', v: true, t: 'L’océan est environ 30 % plus acide qu’au XIXe siècle.', x: 'Exact, en raison du CO₂ absorbé.', inv: ['M1-58'] },
];

export const COMBAT = [
  { id: 'c_limites', r: 'bassin', q: 'Combien de limites planétaires sont dépassées (bilan 2025) ?', options: ['7', '6', '9', '3'], a: 0, explain: 'L’acidification des océans a rejoint la liste en 2025.' },
  { id: 'c_ozone', r: 'bassin', q: 'Quel accord a permis de réparer la couche d’ozone ?', options: ['Le Protocole de Montréal (1987)', 'L’Accord de Paris (2015)', 'Le Protocole de Kyoto (1997)', 'La COP28'], a: 0, explain: 'Il a interdit les CFC.' },
  { id: 'c_triangle', r: 'bassin', q: 'Qui a conceptualisé le « triangle de l’inaction » ?', options: ['Christophe Cassou', 'Johan Rockström', 'Frédéric Bordage', 'Jean Jouzel'], a: 0, explain: 'Climatologue au CNRS.' },
  { id: 'c_eutro', r: 'bassin', q: 'Les « zones mortes » sont causées principalement par…', options: ['Un excès d’azote et de phosphore', 'Les marées noires', 'Le froid', 'Les éoliennes en mer'], a: 0, explain: 'Eutrophisation.' },
];

export const ON_ENTER = { bassin: ['quest:main_bassin'] };
export const ON_SEED = { bassin: ['done:main_bassin', 'toast:Le **Sceau des Limites** rétablit deux passages : les **Mines** (nord du Bassin) et le **Marais** (sud du village).'] };
