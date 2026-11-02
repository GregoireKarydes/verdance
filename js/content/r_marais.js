// =============================================================
// Région 4 — Marais des Réseaux (électricité, usages, données)
// =============================================================
import { look } from './r_village.js';

export const NPCS = {
  vigie: { id: 'vigie', name: 'Vigie Diagnostic', look: look('#5a6a3a', '#3a2a1a', { hat: 'helmet', hatColor: '#6a7a4a' }), inv: ['M2-01', 'M2-02', 'M2-05', 'M2-06'],
    talk: [
      { if: '!flag:vigie_1', mark: 'quest', say: ['Halte ! D’ici, je surveille tout le réseau de Verdance. Diagnostic : **surcharge**.', 'Au niveau mondial, le numérique émet **2 à 4 %** des gaz à effet de serre. En France, le Sénat estimait en 2020 que, sans action, il pourrait atteindre **6,7 %** de l’empreinte carbone nationale en **2040**.', 'Il consomme environ **10 % de l’électricité** française. Monte à la tour et actionne mon **compteur** : tu verras.'], act: ['flag:vigie_1', 'step:main_marais:1', 'codex:diagnostic_global'] },
      { if: 'step:main_marais==1', say: ['Le compteur est en haut de la tour, juste derrière moi.'] },
      { if: 'step:main_marais==2', say: ['Va voir la **centrale**, à l’ouest : elle montre où part l’électricité du numérique.'] },
      { if: 'step:main_marais==3', say: ['Le passeur **Baud**, près de la centrale, connaît les réseaux mieux que personne.'] },
      { if: 'step:main_marais==4', mark: 'quest', say: ['Tu as compris la mécanique. Le Relais est verrouillé par un code… que je ne donne qu’aux gens qui agissent.', 'Dis-moi : quel usage numérique vas-tu réduire, toi ?'], act: ['open:q5_usage'] },
      { if: 'step:main_marais>=5&!seed:marais', say: ['Le **Relais** est ouvert, à l’est du marais. Attention aux vampires de veille… ils sont invisibles sans lumière.'] },
      { say: ['Le réseau respire. On peut enfin débrancher ce qui ne sert à rien.'] },
    ] },
  baud: { id: 'baud', name: 'Passeur Baud', look: look('#2a5a6a', '#d8d8d8', { hairStyle: 3, beard: '#d8d8d8', hat: 'cap', hatColor: '#3a3a6a' }), inv: ['M2-28', 'M2-29', 'M2-14', 'M2-16', 'M2-31'],
    talk: [
      { if: 'step:main_marais==3', mark: 'quest', say: ['Les réseaux, c’est mon métier. Une étude de NégaWatt affirmait qu’une connexion **4G** consommait jusqu’à **23 fois plus** d’énergie qu’une connexion ADSL filaire. C’est un vieux chiffre, mais l’idée reste juste : **le filaire est bien plus sobre que le mobile**.', 'Et la 5G ? Par donnée transportée, elle est plus efficace que la 4G… mais elle permet d’en transporter beaucoup plus, et demande de nouvelles antennes et de nouveaux téléphones. C’est l’**effet rebond**.', 'La vidéo, enfin, représente environ **deux tiers** du trafic Internet mondial. Une heure en 4K, c’est environ 7 Go, contre 1 Go en définition standard.'], act: ['step:main_marais:4', 'codex:reseaux_mobiles', 'codex:video_trafic'] },
      { say: ['Branche-toi en filaire ou en Wi-Fi quand tu peux. Et coupe la box quand tu pars en vacances !'] },
    ] },
  ondin: { id: 'ondin', name: 'Ondin le pêcheur de câbles', look: look('#3a7a9a', '#2a1a10', { hat: 'cap', hatColor: '#c8a050', beard: '#2a1a10' }), inv: ['M1-38'],
    talk: [
      { if: '!quest:qs_cables', mark: 'quest', say: ['Tu vois ces câbles qui sortent de l’eau ? Plus de **99 % du trafic Internet intercontinental** passe par des **câbles sous-marins** : environ 1,5 million de kilomètres posés au fond des océans.', 'Le « cloud » n’est pas dans le ciel : il est sous la mer ! Et avec la montée des eaux, leurs stations côtières sont menacées.', 'Il y a une grotte au sud-est où j’entrepose les vieux câbles. Un ravin en barre l’accès… avec un grappin, tu pourrais y entrer.'], act: ['quest:qs_cables', 'codex:cables_sous_marins', 'done:qs_cables'] },
      { say: ['Un câble coupé, et c’est un pays entier qui ralentit. Le numérique est très physique.'] },
    ] },
  archiva: { id: 'archiva', name: 'Mémé Archiva', look: look('#7a5a8a', '#e0e0e0', { hairStyle: 2, robe: '#5a3a6a', glasses: true }), inv: ['M2-15'],
    talk: [
      { if: '!quest:qs_archiva', mark: 'quest', say: ['Je garde TOUT : vieux e-mails, photos en dix exemplaires, fichiers de 2009… Dans le nuage, ça ne prend pas de place, non ?', 'Mon petit-fils dit que ce sont des **données sombres**, stockées pour rien sur des serveurs qui tournent jour et nuit. Tu veux bien m’aider à trier ?'], act: ['quest:qs_archiva', 'puzzle:tri_dark_data'] },
      { if: '!done:qs_archiva', mark: 'quest', say: ['On reprend le tri ?'], act: ['puzzle:tri_dark_data'] },
      { say: ['Ma valise numérique est légère comme une plume. Et je retrouve enfin mes photos !'] },
    ] },
  ecrania: { id: 'ecrania', name: 'Écrania', look: look('#3a3a8a', '#ff6ad0', { hairStyle: 2, glasses: true }), inv: ['M2-46', 'M2-47'],
    talk: [
      { if: '!quest:qs_ecran', mark: 'quest', say: ['En 10 ans, le nombre d’internautes a bondi : environ **9 Français sur 10** sont désormais connectés.', 'Un sondage dit qu’on passe **27 ans et 7 mois** devant les écrans au cours d’une vie ! Tu veux calculer ton propre temps ?'], act: ['quest:qs_ecran', 'mission:ecran'] },
      { if: 'step:qs_ecran==0', mark: 'quest', say: ['Alors, ce temps d’écran ?'], act: ['mission:ecran'] },
      { if: '!done:qs_ecran', act: ['done:qs_ecran', 'codex:temps_ecran'], say: ['Ça fait réfléchir, hein ? Le temps d’écran, c’est aussi de l’énergie et du matériel qui s’use.'] },
      { say: ['Je fais une pause écran par heure. Mes yeux et la planète me remercient.'] },
    ] },
  calculette: { id: 'calculette', name: 'Calculette', look: look('#c8c83a', '#3a3a3a', { hat: 'band', hatColor: '#3a8aff' }), inv: ['M2-11', 'M2-12', 'M2-13'],
    talk: [
      { if: '!quest:qs_empreinte_num', mark: 'quest', say: ['Combien pèse ton numérique à toi ? Fais le test de l’ADEME : équipements, streaming, e-mails, cloud…'], act: ['quest:qs_empreinte_num', 'mission:ademe_num'] },
      { if: 'step:qs_empreinte_num==0', mark: 'quest', say: ['Alors, ce calcul ?'], act: ['mission:ademe_num'] },
      { if: '!done:qs_empreinte_num', say: ['Merci ! Attention aux chiffres « par e-mail » ou « par heure de vidéo » qui circulent : ils varient énormément selon les méthodes. Le message clé reste : **les équipements pèsent plus que les usages**.'], act: ['done:qs_empreinte_num', 'codex:usages'] },
      { say: ['1 + 1 = moins d’appareils.'] },
    ] },
};

export const SCRIPTS = {
  tour_guet: [
    { if: 'step:main_marais==1', say: [{ who: 'Compteur de la tour', t: 'Le compteur tourne à toute vitesse : « tonnes de CO₂e émises depuis ton arrivée ». Deux leviers : **Scénario tendanciel** ou **Scénario sobriété**.' }],
      ask: { q: 'Quel levier actionnes-tu ?', options: [
        { t: 'Scénario tendanciel', say: [{ who: 'Compteur', t: 'Le compteur s’emballe. Sans sobriété, les projections montrent une hausse continue de l’empreinte du numérique (en France : environ +45 % d’ici 2030 et presque ×3 d’ici 2050 selon l’ADEME-Arcep).' }], act: ['mural:diagnostic', 'step:main_marais:2'] },
        { t: 'Scénario sobriété', say: [{ who: 'Compteur', t: 'Le compteur ralentit nettement. La sobriété (moins d’équipements, durée de vie allongée, usages raisonnés) permet de stabiliser l’empreinte.' }], act: ['mural:diagnostic', 'step:main_marais:2'] },
      ] } },
    { act: ['mural:diagnostic'] },
  ],
  'secret:cables': [{ say: [{ who: 'Grotte des Câbles', t: 'Des tronçons de câbles sous-marins, épais comme un bras. Au cœur, quelques fibres de verre fines comme un cheveu transportent des térabits par seconde.' }], act: ['codex:cables_sous_marins'] }],
};

export const QUESTS = [
  { id: 'main_marais', title: 'Surcharge du réseau', region: 'marais', main: true, steps: [
    { t: 'Parle à la Vigie, au pied de la tour', at: 'vigie' }, { t: 'Actionne le compteur de la tour de guet', at: 'tour_guet' }, { t: 'Examine la centrale électrique', at: 'centrale' },
    { t: 'Écoute le passeur Baud', at: 'baud' }, { t: 'Retourne voir la Vigie', at: 'vigie' }, { t: 'Traverse le Relais', at: 'temple_relais' }, 'Replante la Graine-Mère'] },
  { id: 'qs_archiva', title: 'La valise de Mémé', region: 'marais', giver: 'archiva', steps: [{ t: 'Aide Mémé Archiva à trier ses données', at: 'archiva' }], reward: { heart: true } },
  { id: 'qs_empreinte_num', title: 'Mon empreinte numérique', region: 'marais', giver: 'calculette', steps: [{ t: 'Calcule ton empreinte numérique (mission terrain)', at: 'calculette' }, { t: 'Retourne voir Calculette', at: 'calculette' }], reward: { graines: 15 } },
  { id: 'qs_ecran', title: '27 ans d’écran', region: 'marais', giver: 'ecrania', steps: [{ t: 'Mesure ton temps d’écran (mission terrain)', at: 'ecrania' }, { t: 'Retourne voir Écrania', at: 'ecrania' }], reward: { graines: 10 } },
  { id: 'qs_pays', title: 'Le pays Internet', region: 'marais', giver: 'proj_numerique', steps: [{ t: 'Regarde la vidéo de synthèse et réponds au quiz', at: 'proj_numerique' }], reward: { graines: 15 } },
  { id: 'qs_cables', title: 'Les câbles sous la mer', region: 'marais', giver: 'ondin', steps: ['Écoute Ondin'], reward: { graines: 5 } },
];

export const PUZZLES = {
  relais_reseau: { type: 'budget', title: 'Salle 1 — Relier l’école du village', region: 'marais', icon: '📡', inv: ['M2-28', 'M2-29'], unit: 'unités d’énergie',
    intro: 'L’école du village doit être reliée au réseau. Elle a besoin d’une **connexion**, de **visioconférences** et d’une **messagerie**. Budget énergétique : **8 unités** au maximum.',
    cards: [
      { t: 'Fibre optique jusqu’à l’école', desc: 'Filaire, très sobre par donnée transportée', cost: 2 },
      { t: 'Antenne 4G pour l’école', desc: 'Pratique, mais gourmande', cost: 6 },
      { t: 'Visio de classe en HD', desc: 'Largement suffisant', cost: 3 },
      { t: 'Visio de classe en 4K', desc: 'Superbe… et inutile', cost: 8 },
      { t: 'Messagerie de l’école', cost: 1 },
      { t: 'Caméras 4K filmant en continu', desc: 'Stockage dans le cloud', cost: 9 },
      { t: 'Écrans publicitaires connectés', cost: 7 },
      { t: 'Box et Wi-Fi coupés la nuit', desc: 'Économie', cost: -1, costLabel: '−1 unité' },
    ],
    rule: s => {
      const has = i => s.includes(i); const total = s.reduce((a, i) => a + [2, 6, 3, 8, 1, 9, 7, -1][i], 0);
      const conn = has(0) || has(1), visio = has(2) || has(3), mail = has(4);
      const disp = `Énergie : **${total} / 8** · Connexion ${conn ? '✔' : '✗'} · Visio ${visio ? '✔' : '✗'} · Messagerie ${mail ? '✔' : '✗'}`;
      if (!conn || !visio || !mail) return { ok: false, display: disp, msg: 'Il manque un besoin essentiel de l’école.' };
      if (total > 8) return { ok: false, display: disp, msg: 'Budget dépassé ! Quels choix sont superflus… ou trop gourmands ?' };
      if (has(5) || has(6)) return { ok: false, display: disp, msg: 'Ces équipements ne répondent à aucun besoin de l’école.' };
      return { ok: true, display: disp };
    },
    hints: ['Le filaire est bien plus sobre que le mobile.', 'La 4K n’apporte rien pour une visio de classe.'],
    explain: '**Fibre + visio HD + messagerie** : tous les besoins sont couverts avec un minimum d’énergie. Le filaire consomme bien moins par donnée que le mobile (l’ancien cours citait « 4G = 23× l’ADSL », un ordre de grandeur ancien). Couper la box la nuit : un petit geste en plus.' },
  relais_streaming: { type: 'sliders', title: 'Salle 2 — La soirée cinéma', region: 'marais', icon: '🎬', inv: ['M2-14', 'M2-31', 'M2-13'],
    intro: 'Le village veut regarder **au moins 2 h** de film ce soir, mais le Relais ne peut transporter que **6 Go**. Règle les flux. (Ordres de grandeur Netflix : SD ≈ 1 Go/h, HD ≈ 3 Go/h, 4K ≈ 7 Go/h.)',
    sliders: [{ label: 'Durée du film (h)', min: 0, max: 4, step: 0.5, init: 2 }, { label: 'Qualité (1 = SD, 2 = HD, 3 = 4K)', min: 1, max: 3, step: 1, init: 3 }, { label: 'Vidéos en lecture automatique en fond (h)', min: 0, max: 3, step: 0.5, init: 2 }],
    calc: ([h, q, bg]) => { const r = [0, 1, 3, 7][q]; const go = (h + bg) * r; const ok = h >= 2 && go <= 6 && bg === 0; return { ok, display: `Données : **${go.toFixed(1)} Go** / 6 Go · film ${h} h en ${['', 'SD', 'HD', '4K'][q]}${bg ? ` · ⚠ ${bg} h de lecture automatique` : ''}`, msg: bg ? 'La lecture automatique gaspille du réseau pour rien.' : h < 2 ? 'Le film doit durer au moins 2 h.' : 'Trop de données pour le Relais.' }; },
    hints: ['Commence par couper la lecture automatique.', 'Sur un petit écran, la HD suffit largement.'],
    explain: 'Supprimer la lecture automatique et adapter la qualité à l’écran divise les données par 2 à 7. La vidéo représente environ **deux tiers du trafic** Internet mondial (Sandvine).' },
  relais_quiz: { type: 'qcm', title: 'Salle 3 — Le standard du Relais', region: 'marais', icon: '☎', inv: ['M2-05', 'M2-02', 'X-01', 'M2-26', 'M2-27'],
    questions: [
      { q: 'Quelle part de la consommation d’électricité française le numérique représente-t-il (ADEME-Arcep, données 2020) ?', options: ['Environ 10 %', 'Environ 1 %', 'Environ 40 %'], a: 0, explain: 'Environ 10 % (≈ 50 TWh). L’ancien cours citait 12 % en 2015 (55,5 TWh sur 476 TWh).' },
      { q: 'Selon le Sénat (2020), sans action, le numérique pourrait peser en 2040…', options: ['6,7 % de l’empreinte carbone de la France', '6,7 % des émissions mondiales', '67 % de l’empreinte française'], a: 0, explain: 'Attention : ce chiffre concerne la **France** (l’ancien cours le présentait à tort comme mondial).' },
      { q: 'Quelle connexion est la plus sobre pour une même quantité de données ?', options: ['La fibre (filaire)', 'La 4G', 'La 5G en zone peu dense'], a: 0, explain: 'Le filaire reste nettement plus efficace que le mobile.' },
      { q: 'Quelle part du trafic intercontinental passe par des câbles sous-marins ?', options: ['Plus de 99 %', 'Environ 50 %', 'Moins de 10 % (le reste passe par satellite)'], a: 0, explain: 'Les satellites ne transportent qu’une infime partie du trafic.' },
    ] },
  tri_dark_data: { type: 'match', title: 'La valise de Mémé Archiva', region: 'marais', main: false, icon: '🗂', inv: ['M2-15'],
    intro: 'Aide Mémé à trier : que faut-il **garder**, **supprimer** ou **archiver hors ligne** (sur un disque débranché) ?',
    cats: ['Garder en ligne', 'Supprimer', 'Archiver hors ligne'],
    items: [
      { t: 'Les 12 copies identiques de la même photo', cat: 1 },
      { t: 'Les photos des 80 ans de Pépé (originales)', cat: 2 },
      { t: 'Les newsletters non lues de 2015', cat: 1 },
      { t: 'Le contrat de la maison', cat: 0 },
      { t: 'Une vidéo de 4 Go déjà publiée ailleurs', cat: 1 },
      { t: 'Les factures des 10 dernières années', cat: 2 },
    ],
    onWin: ['done:qs_archiva', 'codex:dark_data'],
    explain: 'Plus de la moitié des données stockées par les organisations seraient des **données sombres**, jamais réutilisées (étude Veritas). Les supprimer allège serveurs, sauvegardes et réseaux.' },
  pays_internet: { type: 'qcm', title: 'Le pays Internet', region: 'marais', main: false, icon: '🌐', inv: ['M2-55', 'M2-56', 'M2-57'],
    onWin: ['done:qs_pays', 'codex:infrastructure_invisible'],
    questions: [
      { q: 'On dit souvent : « Si Internet était un pays… »', options: ['Il ferait partie des plus gros consommateurs d’électricité du monde', 'Il serait le plus petit pays du monde', 'Il ne consommerait rien'], a: 0, explain: 'Les classements varient (de la 3e à la 7e place selon les sources et les années) : retiens l’ordre de grandeur, pas le rang exact.' },
      { q: 'Quelle part de l’empreinte d’un équipement vient généralement de sa fabrication ?', options: ['70 à 80 %', '10 à 20 %', 'Moins de 5 %'], a: 0, explain: 'Extraction des terres rares, raffinage, assemblage…' },
      { q: 'Derrière chaque clic, il y a…', options: ['Des câbles sous-marins, des centres de données climatisés 24 h/24 et des antennes', 'Uniquement mon téléphone', 'Un nuage de vapeur d’eau'], a: 0, explain: 'L’infrastructure invisible.' },
    ] },
};

export const MURALS = {
  diagnostic: { title: 'Diagnostic de la tour — Le poids réel du virtuel', inv: ['M2-07', 'M2-03'], codex: ['diagnostic_global', 'ressources_extraites'],
    chart: { type: 'hbars', title: 'Matières mobilisées pour fabriquer (kg, ordres de grandeur)', labels: ['Jean', 'Table', 'Smartphone', 'Ordinateur portable', 'Écran'], values: [49, 76, 221, 836, 2015], unit: ' kg', highlight: 2 },
    text: 'Fabriquer un smartphone mobilise plus de matières qu’un meuble, et un ordinateur portable près d’une tonne. Côté eau, les mêmes sources citent environ 1 500 L pour un smartphone et 6 000 L pour un ordinateur portable.\n\nCes comparaisons (GreenIT.fr / The Shift Project) circulent beaucoup : leurs méthodes diffèrent, retiens les **ordres de grandeur**. L’ancienne fresque comparait aussi les émissions du numérique (3,8 % en 2020, 6 % projetés en 2025) à celles de la mode, du ciment, de l’automobile et de l’aérien : ces projections sont aujourd’hui jugées trop hautes par plusieurs études.',
    source: 'GreenIT.fr ; The Shift Project ; ancienne image du cours.' },
  electricite: { title: 'La centrale — Où part l’électricité du numérique ?', inv: ['M2-26', 'M2-27', 'M2-30', 'M2-32'], codex: ['electricite'], onView: ['if:step:main_marais==2', 'step:main_marais:3'],
    chart: { type: 'donut', title: 'Consommation électrique du numérique en France (2015)', labels: ['Terminaux domestiques', 'Terminaux professionnels', 'Serveurs et centres de données', 'Réseaux'], values: [22, 21, 10, 3.5], unit: ' TWh', center: '≈ 56 TWh' },
    text: 'En 2015, le numérique consommait environ **12 %** de l’électricité française (≈ 55 TWh sur 476 TWh), dont la majeure partie dans les **terminaux** (2015, données du gouvernement reprises par decrypterlenergie.org). Une étude de NégaWatt prévoyait **+25 %** d’ici 2030.\n\nEn 2020, l’ADEME-Arcep l’estimait à environ **10 %**. Mais la croissance des centres de données (et de l’IA) relance la hausse.',
    source: 'decrypterlenergie.org (données 2015) ; NégaWatt ; ADEME-Arcep (2022).' },
};

export const CODEX = {
  diagnostic_global: { region: 'marais', title: 'Diagnostic global du numérique', inv: ['M2-01', 'M2-02', 'M2-05', 'M2-06', 'M2-55'], text: '**Monde** : 2 à 4 % des émissions de GES ; centres de données ≈ 1,5 % de l’électricité mondiale en 2024 (AIE).\n**France** : 4,4 % de l’empreinte carbone (ADEME-Arcep 2025) ; environ 10 % de l’électricité consommée.\n**Projections France** : sans action, environ +45 % d’ici 2030 et presque ×3 d’ici 2050 (ADEME-Arcep, 2023). Le Sénat estimait en 2020 que le numérique pourrait atteindre 6,7 % de l’empreinte carbone française en 2040.\n**E-déchets** : 62 Mt dans le monde en 2022 (l’ancien cours disait 50 Mt).\n\n*Rectifications : le 6,7 % concerne la France, pas le monde ; le « doublement de l’empreinte d’ici 2025 » et le « 10 % de l’électricité mondiale » de l’ancien cours étaient des projections ou des estimations hautes.*', source: 'ADEME-Arcep (2023, 2025) ; Sénat, rapport sur l’empreinte environnementale du numérique (2020) ; AIE, *Energy and AI* (2025) ; Global E-waste Monitor 2024.' },
  electricite: { region: 'marais', title: 'L’électricité du numérique', inv: ['M2-26', 'M2-27', 'M2-29', 'M2-30'], text: 'Causes de la hausse : déploiement massif des réseaux mobiles, explosion du streaming haute définition, multiplication des centres de données, objets connectés, cloud généralisé.\n\n**Paradoxe** : plus la technologie devient « invisible », plus son infrastructure est lourde.\n\n*L’ancien cours affichait ~151 GWh/jour, ~250 centres de données actifs et ~2 Mt CO₂/an pour la France : ordres de grandeur non sourcés, à manier avec prudence.*', source: 'ADEME-Arcep ; ancien cours.' },
  reseaux_mobiles: { region: 'marais', title: 'Filaire, 4G, 5G', inv: ['M2-28', 'M2-16'], text: 'Le **filaire** (fibre) consomme bien moins d’énergie par donnée que le **mobile**. NégaWatt avançait « 4G = 23 fois l’ADSL » : chiffre ancien, mais l’écart reste important. La **5G** est plus efficace par bit, mais elle stimule les usages, demande de nouvelles antennes et un renouvellement des téléphones : c’est l’**effet rebond**. L’ancien cours évoquait aussi +30 % de consommation des réseaux d’ici 2030 avec la 5G et l’IoT (estimation non sourcée).', source: 'NégaWatt ; Haut Conseil pour le Climat, *Maîtriser l’impact carbone de la 5G* (2020).' },
  video_trafic: { region: 'marais', title: 'La vidéo, reine du trafic', inv: ['M2-14', 'M2-31'], text: 'La vidéo représente environ **deux tiers** du trafic Internet mondial (Sandvine ; l’ancien cours disait 60 %). Ordres de grandeur Netflix : SD ≈ 1 Go/h, HD ≈ 3 Go/h, 4K ≈ 7 Go/h. *L’ancien cours disait « 4K = 3× la SD » : c’est plutôt environ 7×.*', source: 'Sandvine, *Global Internet Phenomena* ; Netflix, aide en ligne.' },
  usages: { region: 'marais', title: 'Combien pèsent nos usages ?', inv: ['M2-13', 'M2-12'], text: 'Chiffres souvent cités (ancien cours) : 1 h de streaming HD ≈ 50 g CO₂e ; 1 e-mail avec pièce jointe ≈ 4 g ; 1 h de réseaux sociaux ≈ 10 g ; 1 Go stocké dans le cloud pendant un an ≈ 20 g ; 1 h de jeu en ligne ≈ 100 g.\n\n⚠ Ces valeurs sont **très débattues** : l’AIE estimait en 2020 qu’une heure de streaming émettait environ 36 g en moyenne mondiale, et beaucoup moins en France grâce à une électricité bas carbone. Le terminal (sa fabrication) pèse souvent plus que le réseau.\n\nEmpreinte numérique moyenne d’un·e Français·e : de l’ordre de **250 à 400 kg CO₂e/an** selon le périmètre.', source: 'AIE (2020) ; ADEME-Arcep ; ancien cours.' },
  dark_data: { region: 'marais', title: 'Les données sombres', inv: ['M2-15'], text: 'Données stockées mais jamais réutilisées : vieux e-mails, doublons, fichiers obsolètes. Plus de la moitié des données des organisations seraient « sombres » (étude Veritas ; l’ancien cours disait 50 à 70 %). Elles mobilisent serveurs, sauvegardes et énergie en continu.', source: 'Veritas, *The Databerg Report* (2015-2016) ; ancien cours.' },
  cables_sous_marins: { region: 'marais', title: 'Les câbles sous-marins', inv: ['M1-38', 'M2-56'], text: 'Plus de **99 %** du trafic intercontinental transite par environ 600 câbles sous-marins (≈ 1,5 million de km). Leurs stations d’atterrissement côtières sont exposées à la montée des eaux et aux tempêtes.', source: 'TeleGeography, *Submarine Cable Map* (2025).' },
  infrastructure_invisible: { region: 'marais', title: 'L’infrastructure invisible', inv: ['M2-56', 'M2-57'], text: 'Derrière chaque clic : des milliers de kilomètres de câbles, des centres de données climatisés 24 h/24, des antennes. **70 à 80 %** de l’empreinte d’un équipement vient de sa fabrication.\n\n« Si Internet était un pays, il serait l’un des plus gros consommateurs d’électricité au monde. » Les rangs cités varient (3e dans une page de l’ancien cours, 6e dans une autre) : ce sont des estimations anciennes.', source: 'Ancien cours ; Greenpeace, *Clicking Clean* (2012).' },
  temps_ecran: { region: 'marais', title: 'Le temps d’écran', inv: ['M2-46', 'M2-47'], text: 'Environ 9 Français sur 10 sont internautes (l’ancien cours disait 83 %, et +40 % d’internautes en 10 ans). Un sondage commercial (NordVPN, 2021) estimait à 27 ans, 7 mois et 6 jours le temps passé devant les écrans au cours d’une vie (≈ 8 h 30 par jour : smartphone 3 h 15, ordinateur 2 h 30, TV 2 h 45). À prendre avec prudence : c’est un sondage, pas une étude scientifique.', source: 'Insee / Arcep, *Baromètre du numérique* ; NordVPN (2021).' },
  veille: { region: 'marais', title: 'Les vampires de veille', inv: [], text: 'Box, décodeurs, consoles et chargeurs en veille consomment en permanence. Une box Internet allumée 24 h/24 consomme autant qu’un réfrigérateur efficace sur l’année. Prise à interrupteur, mode éco, extinction la nuit : des gestes simples.', source: 'ADEME, guides pratiques.' },
};

export const STATEMENTS = [
  { id: 'r_mail', r: 'marais', v: false, t: 'Supprimer mes e-mails est LE geste écologique numérique le plus efficace.', x: 'C’est utile mais marginal : garder ses équipements plus longtemps pèse bien plus lourd.', inv: ['M2-13'] },
  { id: 'r_5g', r: 'marais', v: false, t: 'La 5G va forcément réduire la consommation des réseaux.', x: 'Plus efficace par bit, mais elle stimule les usages et le renouvellement des appareils : effet rebond.', inv: ['M2-16'] },
  { id: 'r_satellite', r: 'marais', v: false, t: 'Internet passe surtout par les satellites.', x: 'Plus de 99 % du trafic intercontinental passe par des câbles sous-marins.', inv: ['M1-38'] },
  { id: 'r_video', r: '*', v: true, t: 'La vidéo représente environ deux tiers du trafic Internet mondial.', x: 'Exact (Sandvine).', inv: ['M2-31'] },
  { id: 'r_10pc', r: 'marais', v: true, t: 'Le numérique consomme environ 10 % de l’électricité en France.', x: 'Exact (ADEME-Arcep).', inv: ['M2-05'] },
  { id: 'r_filaire', r: 'marais', v: true, t: 'Une connexion filaire est plus sobre qu’une connexion mobile.', x: 'Exact, pour une même quantité de données.', inv: ['M2-28'] },
  { id: 'r_dark', r: 'marais', v: true, t: 'Plus de la moitié des données stockées par les entreprises ne sont jamais réutilisées.', x: 'Ce sont les « données sombres ».', inv: ['M2-15'] },
  { id: 'r_senat', r: 'marais', v: false, t: 'Le numérique pèsera 6,7 % des émissions mondiales en 2040.', x: 'Ce chiffre du Sénat concerne l’empreinte carbone de la France, pas le monde.', inv: ['M2-02'] },
];

export const COMBAT = [
  { id: 'c_elec', r: 'marais', q: 'Part du numérique dans la consommation d’électricité française ?', options: ['≈ 10 %', '≈ 1 %', '≈ 50 %', '≈ 25 %'], a: 0, explain: 'ADEME-Arcep.' },
  { id: 'c_4k', r: 'marais', q: 'Une heure de vidéo en 4K, c’est environ…', options: ['7 Go', '7 Mo', '700 Go', '70 Ko'], a: 0, explain: 'Contre ~1 Go en SD.' },
  { id: 'c_cables', r: 'marais', q: 'Par où passe l’essentiel du trafic intercontinental ?', options: ['Des câbles sous-marins', 'Des satellites', 'Des antennes 5G', 'Des ballons stratosphériques'], a: 0, explain: '> 99 %.' },
  { id: 'c_dark', r: 'marais', q: 'Comment appelle-t-on les données stockées mais jamais réutilisées ?', options: ['Les données sombres (dark data)', 'Le big data', 'Les métadonnées', 'Le cache'], a: 0, explain: 'Plus de la moitié des données des organisations.' },
];

export const ON_ENTER = { marais: ['quest:main_marais'] };
export const ON_SEED = { marais: ['done:main_marais', 'toast:Le **Grappin de Fibre** franchit les gouffres : la **Décharge** (est du village) est accessible. Avec la Lanterne, tu pourras aussi rejoindre la **Citadelle**.'] };
