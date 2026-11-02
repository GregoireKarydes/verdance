// =============================================================
// Région 3 — Mines d'Abysse (fabrication, métaux, ACV, durée de vie)
// =============================================================
import { look } from './r_village.js';

export const NPCS = {
  cobalt: { id: 'cobalt', name: 'Contremaître Cobalt', look: look('#3a4a8a', '#2a2a2a', { beard: '#2a2a2a', hat: 'helmet', hatColor: '#d8a83a' }), inv: ['M2-19', 'M2-20'],
    talk: [
      { if: '!flag:cobalt_1', mark: 'quest', say: ['Halte ! Ici, on extrait les métaux qui ont nourri l’Omnium. Tu crois que le numérique est « virtuel » ? Il faut plus de **30 éléments chimiques** pour fabriquer un smartphone.', 'Le WWF a une formule qui frappe : il faut **16 kg de matières premières** pour fabriquer une puce d’un gramme.', 'Va étudier le **Mur des 90 éléments**, au nord-ouest. Tu comprendras.'], act: ['flag:cobalt_1', 'step:main_mines:1', 'codex:ratio_puce'] },
      { if: 'step:main_mines==1', say: ['Le Mur des 90 éléments est au nord-ouest.'] },
      { if: 'step:main_mines==2', mark: 'quest', say: ['Maintenant, regarde la **pierre de projection** : un reportage sur la rareté des métaux.'] },
      { if: 'step:main_mines==3', mark: 'quest', say: ['Bien. Avant de t’ouvrir la Fonderie, je veux savoir si tu as compris l’essentiel : en France, l’essentiel de l’empreinte du numérique vient de la **fabrication**. Alors…', 'Si tu dirigeais le parc informatique d’une entreprise, que ferais-tu ? (Fixie, la réparatrice, a de bonnes idées si tu veux lui demander d’abord.)'], act: ['open:q4_parc'] },
      { if: 'step:main_mines>=4&!seed:mines', say: ['La Fonderie est ouverte, au centre de la mine. Attention aux golems.'] },
      { say: ['On extrait moins, on répare plus. Et on recycle ce qu’on peut… même si c’est loin de tout récupérer.'] },
    ] },
  lithia: { id: 'lithia', name: 'Lithia la forgeronne', look: look('#8a3a2a', '#ff8a3a', { hairStyle: 1, apron: '#5a4a3a' }), inv: ['M2-21', 'M2-22'],
    talk: [
      { if: '!flag:lithia_1', say: ['Dans un smartphone : des **terres rares** (néodyme, europium, terbium) pour l’écran, les haut-parleurs et le vibreur ; de l’**or, de l’argent, du palladium** pour les circuits ; du **cobalt et du lithium** pour la batterie.', 'Et ces métaux viennent de très peu de pays. La Chine assure environ **70 % de l’extraction** et près de **90 % du raffinage** des terres rares. Une dépendance stratégique majeure.'], act: ['flag:lithia_1', 'codex:metaux_smartphone', 'codex:geopolitique'] },
      { say: ['Le métal le plus écologique ? Celui qu’on n’a pas besoin d’extraire.'] },
    ] },
  fixie: { id: 'fixie', name: 'Fixie la réparatrice', look: look('#3a8a6a', '#6a3a8a', { hairStyle: 2, apron: '#2a2a2a', glasses: true }), inv: ['M2-03', 'M2-08', 'M2-09', 'M2-10'],
    talk: [
      { if: '!flag:fixie_1', say: ['Bienvenue à l’atelier ! Écoute bien : en France, l’étude ADEME-Arcep de 2022 attribuait **78 %** de l’empreinte carbone du numérique à la **fabrication** des terminaux. En 2025, la part des centres de données a beaucoup augmenté, mais les terminaux pèsent encore environ la moitié.', 'Ordres de grandeur à la fabrication : un smartphone ≈ **30 à 40 kg CO₂e**, un ordinateur portable ≈ **150 kg**, un grand écran ou un téléviseur ≈ **200 à 400 kg** selon la taille.', 'Le levier n°1 ? **Allonger la durée de vie**. Garder un appareil 4 ans au lieu de 2, c’est diviser par deux son impact de fabrication par année d’usage. Réemploi et réparation passent **avant** le recyclage.'], act: ['flag:fixie_1', 'codex:fabrication_domine', 'codex:allonger'] },
      { ask: { q: 'Besoin de quelque chose ?', options: [
        { t: 'Réparer mon bâton (gratuit, ici)', act: ['repair'] },
        { t: 'Un conseil pour la politique de parc', say: ['Durée de vie cible de 5 ans ou plus, achats reconditionnés, contrats de réparation, pièces détachées, reconditionnement en fin de première vie, don ou recyclage certifié en dernier recours… et mesurer tout ça !'] },
        { t: 'Rien, merci', say: ['Reviens quand tu veux, je répare tout !'] },
      ] } },
    ] },
  neuf: { id: 'neuf', name: 'Marchand Neuf-Toujours', look: look('#c8a83a', '#1a1a1a', { hairStyle: 1, hat: 'wizard', hatColor: '#c03a3a' }), inv: ['M2-10'],
    talk: [
      { if: '!quest:qs_neuf', mark: 'quest', say: ['Approchez ! Votre appareil a deux ans ? Il est **démodé** ! J’ai le tout dernier modèle, à peine plus fin, à peine plus rapide…'], act: ['quest:qs_neuf', 'puzzle:neuf_reco'] },
      { if: '!done:qs_neuf', mark: 'quest', say: ['Alors, ce nouveau modèle ?'], act: ['puzzle:neuf_reco'] },
      { say: ['Bon… j’ai ouvert un rayon reconditionné. Les clients adorent, figure-toi.'] },
    ] },
  vieux_pc: { id: 'vieux_pc', name: 'Vieux PC (conscient)', kind: 'robot', inv: ['M2-42', 'M2-43', 'M2-74'],
    talk: [
      { if: '!quest:qs_machines', mark: 'quest', say: ['Grrr… je suis un ordinateur de 2022 et on veut déjà me jeter. Je ne suis pas en panne : je **rame** sous le poids des logiciels !', 'Regarde mes trois ancêtres, les machines de 1985, 2003 et 2022, juste au-dessus. Puis reviens me voir.'], act: ['quest:qs_machines'] },
      { if: 'quest:qs_machines&!flag:machine_1985|quest:qs_machines&!flag:machine_2003|quest:qs_machines&!flag:machine_2022', say: ['Examine les trois machines au-dessus de moi.'] },
      { if: '!puzzle:durees_vie', mark: 'quest', say: ['Alors, tu as vu comme notre durée de vie s’est effondrée ? Remets-nous dans l’ordre…'], act: ['puzzle:durees_vie'] },
      { if: '!done:qs_machines', mark: 'quest', say: ['Et maintenant… tu veux bien m’appliquer le **patch d’éco-conception** ? Moins de RAM consommée, et je tiens des années de plus !'], act: ['puzzle:patch'] },
      { say: ['Durée de vie étendue : 12 ans ! On ne change pas un terminal parce qu’il est en panne, mais parce qu’il rame…', 'Tu veux revoir la vidéo de l’ADEME sur le cycle de vie ?'], ask: { q: 'Revoir la vidéo ?', options: [{ t: 'Oui', act: ['video:ademe_acv'] }, { t: 'Non', say: ['Bip.'] }] } },
    ] },
  comptine: { id: 'comptine', name: 'Comptine la comptable', look: look('#6a6a9a', '#3a2a1a', { hairStyle: 1, glasses: true }), inv: ['M2-39', 'M2-40', 'M2-41', 'M2-45'],
    talk: [
      { if: '!quest:qs_inventaire', mark: 'quest', say: ['Je compte tout ! Dans le monde : environ **34 milliards d’équipements** pour **5 milliards d’utilisateurs**, soit environ 7 par personne (GreenIT.fr, 2019). En France, environ **11 par personne**.', 'Même ton enseignant·e en a compté **13** chez lui ! Et toi ? Compte les tiens, sans oublier les angles morts.'], act: ['quest:qs_inventaire', 'mission:equipements'] },
      { if: 'step:qs_inventaire==0', mark: 'quest', say: ['Alors, combien ?'], act: ['mission:equipements'] },
      { if: '!done:qs_inventaire', mark: 'quest', say: ['Merci ! Le suréquipement est le premier facteur d’épuisement des ressources abiotiques (métaux, minéraux) du numérique.'], act: ['done:qs_inventaire', 'codex:surequipement'] },
      { say: ['Un appareil de moins, c’est des dizaines de kilos de ressources qu’on n’extrait pas.'] },
    ] },
};

export const SCRIPTS = {
  'machine:1985': [{ say: [{ who: 'Machine de 1985', t: 'Durée de vie : **10 à 15 ans**. Modulaire, composants remplaçables, documentation technique fournie, reconditionnement facile.' }], act: ['flag:machine_1985'] }],
  'machine:2003': [{ say: [{ who: 'Machine de 2003', t: 'Durée de vie : **environ 10 ans**. Encore réparable, mais déjà plus compacte.' }], act: ['flag:machine_2003'] }],
  'machine:2022': [{ say: [{ who: 'Machine de 2022', t: 'Durée de vie : **environ 5 ans**. Composants soudés, batterie collée, obsolescence logicielle : réparation difficile ou non rentable.' }, { who: 'Machine de 2022', t: 'Selon le WWF France, nous avons **divisé par 3** la durée de vie moyenne de nos équipements en 30 ans.' }], act: ['flag:machine_2022', 'codex:duree_vie'] }],
  'secret:mine_urbaine': [{ say: [{ who: 'La Mine Urbaine', t: 'Des montagnes de vieux téléphones… On dit qu’une tonne de smartphones contient bien plus d’or qu’une tonne de minerai.' }], act: ['codex:mine_urbaine'] }],
};

export const QUESTS = [
  { id: 'main_mines', title: 'Le poids réel du virtuel', region: 'mines', main: true, steps: [
    { t: 'Parle au contremaître Cobalt', at: 'cobalt' }, { t: 'Étudie le Mur des 90 éléments', at: 'fresque_mendeleiev' }, { t: 'Regarde la projection sur la rareté des métaux', at: 'proj_arte' },
    { t: 'Réponds à la question de Cobalt', at: 'cobalt' }, { t: 'Traverse la Fonderie', at: 'temple_fonderie' }, 'Replante la Graine-Mère'] },
  { id: 'qs_inventaire', title: 'L’inventaire', region: 'mines', giver: 'comptine', steps: [{ t: 'Compte tes équipements (mission terrain)', at: 'comptine' }, { t: 'Retourne voir Comptine', at: 'comptine' }], reward: { graines: 10 } },
  { id: 'qs_neuf', title: 'Neuf ou reconditionné ?', region: 'mines', giver: 'neuf', steps: [{ t: 'Résiste au Marchand Neuf-Toujours', at: 'neuf' }], reward: { heart: true } },
  { id: 'qs_machines', title: '15 ans, 10 ans, 5 ans', region: 'mines', giver: 'vieux_pc', steps: [{ t: 'Examine les trois machines et aide le Vieux PC', at: 'vieux_pc' }], reward: { graines: 15 } },
];

export const PUZZLES = {
  neuf_reco: { type: 'choice', title: 'Le Marchand Neuf-Toujours', region: 'mines', main: false, icon: '🛒', inv: ['M2-10', 'M2-08'],
    onWin: ['done:qs_neuf', 'codex:reconditionne'],
    nodes: [
      { who: 'Marchand', text: '« Ton téléphone a 2 ans, il est fini ! » Ton téléphone fonctionne bien, mais la batterie tient moins longtemps. Que fais-tu ?', options: [
        { t: 'J’achète le nouveau modèle', fb: 'Un smartphone neuf, c’est 30 à 40 kg CO₂e de fabrication, et des dizaines de kilos de ressources extraites.' },
        { t: 'Je fais remplacer la batterie', ok: true, fb: 'Le bon réflexe : une batterie neuve coûte peu et prolonge la vie de l’appareil de plusieurs années.' },
        { t: 'Je le jette et je n’ai plus de téléphone', fb: 'Radical… mais jeter un appareil qui fonctionne n’a pas de sens.' }] },
      { who: 'Marchand', text: '« Bon, et si un jour il faut vraiment le remplacer ? »', options: [
        { t: 'Un appareil reconditionné', ok: true, fb: 'Le reconditionné évite l’essentiel de l’impact de fabrication (souvent plus de 80 % évités selon l’ADEME).' },
        { t: 'Le plus fin et le plus puissant', fb: 'Le marketing… Plus puissant ne veut pas dire plus utile.' }] },
      { who: 'Marchand', text: '« Et ton ancien appareil, tu en fais quoi ? »', options: [
        { t: 'Je le garde au fond d’un tiroir', fb: 'Des dizaines de millions de téléphones dorment dans les tiroirs en France : autant de métaux perdus.' },
        { t: 'Je le donne, le revends, ou le dépose dans une filière de collecte', ok: true, fb: 'Réemploi d’abord, recyclage en dernier recours.' }] },
    ] },
  durees_vie: { type: 'order', title: 'L’effondrement de la durée de vie', region: 'mines', main: false, icon: '⏳', inv: ['M2-42', 'M2-43'],
    label: 'Classe les machines de la **plus longue** à la **plus courte** durée de vie moyenne :',
    items: ['Machine de 1985 — 10 à 15 ans', 'Machine de 2003 — environ 10 ans', 'Machine de 2022 — environ 5 ans'],
    explain: 'Durée de vie divisée par **3** en 30 ans (WWF France). Ce n’est pas un accident technique, mais une évolution systémique de la conception : composants soudés, batteries collées, logiciels de plus en plus lourds.' },
  patch: { type: 'qcm', title: 'Le patch d’éco-conception', region: 'mines', main: false, icon: '💾', inv: ['M2-74'],
    onWin: ['done:qs_machines', 'codex:patch'],
    questions: [
      { q: 'Pourquoi change-t-on le plus souvent d’ordinateur ?', options: ['Parce qu’il « rame » sous le poids de logiciels trop lourds', 'Parce qu’il est cassé', 'Parce que l’écran s’use'], a: 0, explain: 'L’obsolescence est souvent **logicielle**.' },
      { q: 'Quel est le levier n°1 d’un·e développeur·se pour réduire l’impact de la fabrication ?', options: ['Optimiser le code pour qu’il tourne sur du matériel ancien', 'Coder la nuit', 'Utiliser plus de bibliothèques'], a: 0, explain: 'Moins de RAM et de CPU nécessaires = renouvellement des terminaux retardé.' },
    ] },
  fond_smartphone: { type: 'match', title: 'Salle 1 — Assembler un smartphone', region: 'mines', icon: '📱', inv: ['M2-22', 'M2-19', 'M2-25'], onWin: ['codex:metaux_smartphone', 'codex:geopolitique'],
    intro: 'Le moule de la Fonderie attend un smartphone. Associe chaque composant à la famille de métaux qu’il contient.',
    cats: ['Terres rares (néodyme, terbium, europium…)', 'Métaux précieux (or, argent, palladium)', 'Métaux de batterie (cobalt, lithium)', 'Indium (oxyde d’indium-étain)'],
    items: [{ t: 'Aimants des haut-parleurs et du vibreur', cat: 0 }, { t: 'Luminophores de l’écran (couleurs)', cat: 0 }, { t: 'Connexions des circuits imprimés', cat: 1 }, { t: 'Batterie', cat: 2 }, { t: 'Couche tactile transparente de l’écran', cat: 3 }],
    hints: ['Lithia la forgeronne a tout expliqué (Codex).', 'L’indium sert à rendre l’écran tactile ET transparent.'],
    explain: 'Plus de 30 éléments différents (jusqu’à 50-70 selon les modèles) dans un seul appareil !' },
  fond_terminal: { type: 'input', title: 'Salle 2 — Le terminal des ressources', region: 'mines', icon: '⌨', inv: ['X-01', 'M2-18', 'M2-20'],
    intro: 'Un vieux terminal (« dossier #02 ») demande trois valeurs extraites des rapports du WWF et d’EuChemS.',
    fields: [
      { q: 'Combien de **kilogrammes** de matières premières faut-il pour une puce de 1 gramme (WWF) ?', num: 16, tol: 0, unit: 'kg' },
      { q: 'Combien de **millions** de smartphones sont jetés ou remplacés chaque mois dans l’UE (EuChemS, 2019) ?', num: 10, tol: 0, unit: 'millions' },
      { q: 'Quel métal, indispensable aux écrans tactiles, devient très dépendant du recyclage ?', accept: ['indium', 'l’indium', 'in'], ph: 'nom du métal' },
    ],
    hints: ['Cobalt et le Mur des 90 éléments t’ont donné les deux premiers chiffres.', 'Son symbole est « In ».'],
    onWin: ['codex:x01_indium', 'codex:ressources_extraites'],
    explain: 'L’indium est un sous-produit de l’extraction du zinc ; son recyclage reste faible. *(L’ancien cours le disait « 100 % dépendant du recyclage » : formulation exagérée.)*' },
  fond_acv: { type: 'order', title: 'Salle 3 — Le convoyeur du cycle de vie', region: 'mines', icon: '♻', inv: ['M2-75', 'M2-69'],
    label: 'Remets les 5 étapes du cycle de vie dans l’ordre, **du berceau à la tombe** :',
    items: ['⛏ Extraction des matières premières', '🏭 Fabrication et assemblage', '✈ Transport et logistique', '🔌 Utilisation', '♻ Fin de vie'],
    explain: 'C’est l’**Analyse du Cycle de Vie** (ACV, normes ISO 14040/14044). Elle est **multicritère** : climat, ressources, eau, pollutions…' },
  fond_jauges: { type: 'qcm', title: 'Salle 4 — Les jauges de la Fonderie', region: 'mines', icon: '📊', inv: ['M2-71', 'M2-73', 'M2-09'], onWin: ['codex:fabrication_domine', 'codex:allonger', 'codex:acv'],
    questions: [
      { q: 'Pour un smartphone, quelle part de l’empreinte carbone vient de la fabrication ?', options: ['Environ 80 %', 'Environ 15 %', 'Environ 50 %'], a: 0, explain: 'L’usage pèse peu (recharge), la fabrication énormément.' },
      { q: 'Pour un serveur en centre de données, qu’est-ce qui domine en général ?', options: ['L’usage (électricité consommée 24 h/24)', 'La fabrication', 'Le transport'], a: 0, explain: 'Un serveur tourne en continu : l’usage domine (environ 75 % dans l’ancien cours), surtout avec une électricité carbonée.' },
      { q: 'Selon Frédéric Bordage (GreenIT.fr), transporter une donnée demande…', options: ['Environ deux fois plus d’énergie que la stocker un an', 'Moins d’énergie que la stocker', 'Aucune énergie'], a: 0, explain: 'D’où l’intérêt de limiter les transferts inutiles.' },
    ] },
};

const pt = (s, cat, c, r) => ({ s, col: ['#f0c070', '#f0e070', '#90c8f0', '#c8a0f0', '#d8d8d8'][cat], c, r });
export const MURALS = {
  mendeleiev: { title: 'Le Mur des 90 éléments (extrait)', inv: ['M2-17', 'M2-18', 'M2-19', 'M2-24'], codex: ['metaux_smartphone'], onView: ['if:step:main_mines==1', 'step:main_mines:2'],
    chart: { type: 'grid', title: 'Éléments présents dans un smartphone (extrait simplifié)', cols: 10, cells: [
      pt('Li', 2, 0, 0), pt('Co', 2, 1, 0), pt('Ni', 4, 2, 0), pt('Cu', 4, 3, 0), pt('Zn', 4, 4, 0), pt('Ga', 3, 5, 0), pt('As', 4, 6, 0), pt('Sn', 4, 7, 0), pt('In', 3, 8, 0), pt('Ta', 3, 9, 0),
      pt('Au', 1, 0, 1), pt('Ag', 1, 1, 1), pt('Pd', 1, 2, 1), pt('Pt', 1, 3, 1), pt('Al', 4, 4, 1), pt('Si', 4, 5, 1), pt('Mg', 4, 6, 1), pt('W', 3, 7, 1), pt('Sb', 3, 8, 1), pt('Bi', 4, 9, 1),
      pt('Nd', 0, 0, 2), pt('Pr', 0, 1, 2), pt('Dy', 0, 2, 2), pt('Tb', 0, 3, 2), pt('Eu', 0, 4, 2), pt('Gd', 0, 5, 2), pt('Y', 0, 6, 2), pt('La', 0, 7, 2), pt('Ce', 0, 8, 2), pt('…', 4, 9, 2)],
      legend: [{ col: '#f0c070', t: 'Terres rares' }, { col: '#f0e070', t: 'Métaux précieux' }, { col: '#90c8f0', t: 'Batterie' }, { col: '#c8a0f0', t: 'Autres critiques' }], note: 'Redessiné d’après EuChemS (2019), simplifié' },
    text: 'La Société européenne de chimie (EuChemS) a redessiné le tableau périodique des **90 éléments naturels** selon leur disponibilité. Plus de **30 éléments** entrent dans un smartphone, et une grande partie suscite des inquiétudes (rareté, concentration géographique, conflits).\n\n« Avec 10 millions de smartphones jetés chaque mois en UE, nous risquons de voir disparaître les éléments qui composent notre monde. » — EuChemS, 2019.',
    source: 'EuChemS, *Element Scarcity — EuChemS Periodic Table* (2019) ; anciennes images du cours (tableau et anatomie d’un smartphone).' },
  acv: { title: 'Fresque — Où agir dans le cycle de vie ?', inv: ['M2-71'], codex: ['acv'],
    chart: { type: 'bars', title: 'Part de la fabrication dans l’empreinte carbone (ordres de grandeur)', labels: ['Smartphone', 'Ordinateur portable', 'Serveur'], values: [85, 75, 25], unit: ' %', max: 100, note: 'Le reste : usage (électricité)' },
    text: 'Pour un **smartphone** ou un **ordinateur portable**, l’essentiel de l’impact est émis **avant** la première utilisation. Pour un **serveur**, qui tourne 24 h/24, l’usage domine. Conséquence : pour les terminaux, le meilleur levier est de les **garder plus longtemps** ; pour les serveurs, l’**efficacité énergétique** et une électricité bas carbone.',
    source: 'Ancien cours (benchmark 2022) ; ADEME, Base Empreinte.' },
};

export const CODEX = {
  metaux_smartphone: { region: 'mines', title: 'Les métaux d’un smartphone', inv: ['M2-17', 'M2-19', 'M2-22', 'M2-24'], text: 'Plus de **30 éléments chimiques** (jusqu’à 50-70 selon les modèles) : terres rares (néodyme, europium, terbium) pour l’écran et les vibrations ; or, argent, palladium pour les circuits ; cobalt et lithium pour la batterie ; indium pour l’écran tactile ; étain, tantale, gallium…\n\nPlus de la moitié de ces éléments suscitent des inquiétudes : rareté croissante, concentration géographique (souvent > 70 % dans quelques pays), conditions d’extraction.', source: 'EuChemS (2019) ; ancien cours.' },
  ratio_puce: { region: 'mines', title: '16 kg pour une puce de 1 g', inv: ['M2-20'], text: '« Il faut 16 kg de matières premières pour fabriquer une puce d’un gramme. » (ratio 16 000 pour 1).\n\n*L’ancien cours contenait aussi « 16 t de CO₂ par kg de puce » : chiffre incohérent, retiré.*', source: 'WWF France, *Guide pour un système d’information éco-responsable*.' },
  geopolitique: { region: 'mines', title: 'Géopolitique des métaux', inv: ['M2-21'], text: 'La Chine assure environ **70 % de l’extraction** et environ **90 % du raffinage** des terres rares (l’ancien cours disait « 80 % de la production »). Cette concentration crée des **dépendances stratégiques** (restrictions d’exportation sur le gallium, le germanium, certaines terres rares depuis 2023) et allonge les chaînes de transport.\n\nL’Union européenne s’est dotée d’un règlement sur les **matières premières critiques** (2024).', source: 'Agence internationale de l’énergie, *Global Critical Minerals Outlook* (2024-2025) ; Règlement (UE) 2024/1252.' },
  metaux_critiques: { region: 'mines', title: 'Rares ou critiques ?', inv: ['M2-25'], text: 'Il n’y a pas de définition universelle de la rareté : un métal peut être rare par sa concentration géologique, sa difficulté d’extraction ou son faible volume de production. Les **17 terres rares** ne sont pas forcément rares en quantité, mais difficiles à séparer et très polluantes à purifier.\n\nL’UE parle plutôt de **métaux critiques** : importants pour l’économie et à fort risque d’approvisionnement. La transition énergétique (éolien, solaire, véhicules électriques) et le numérique font exploser la demande.', source: 'ARTE (vidéo du cours) ; Commission européenne.' },
  fabrication_domine: { region: 'mines', title: 'La fabrication domine', inv: ['M1-03', 'M2-09', 'M2-56'], text: 'En France, l’étude ADEME-Arcep (2022, données 2020) attribuait **78 %** de l’empreinte carbone du numérique à la **fabrication** des terminaux.\n\nMise à jour 2025 (données 2022) : les terminaux pèsent encore environ **50 %**, les **centres de données 46 %** (contre 16 % en 2020, avec un périmètre élargi aux centres situés à l’étranger) et les réseaux 4-5 %. Pour un équipement donné, 70 à 80 % de l’empreinte vient de sa fabrication.', source: 'ADEME-Arcep (2022, mise à jour 2025) ; Arcep, *Pour un numérique soutenable* (édition 2025).' },
  allonger: { region: 'mines', title: 'Allonger la durée de vie', inv: ['M2-10'], text: 'Passer de 2 à 4 ans d’usage divise par deux l’impact de fabrication **par année d’usage**. Hiérarchie : **réduire** (ne pas acheter) > **réemployer / réparer** > **reconditionner** > recycler.', source: 'ADEME ; ancien cours.' },
  surequipement: { region: 'mines', title: 'Le suréquipement', inv: ['M2-39', 'M2-40', 'M2-41', 'M2-45'], text: '**34 milliards d’équipements** pour **5 milliards d’utilisateurs** dans le monde (GreenIT.fr, 2019), soit ~7 par personne. En France : ~**11 par personne** (651 millions d’appareils pour 58 millions d’utilisateurs). L’enseignant·e du cours en a compté 13 chez lui : 3 ordinateurs, 1 tablette, 2 téléphones, 1 TV connectée, 1 console, 1 brodeuse connectée, 2 écrans, une box, une box Android TV…\n\nLe suréquipement est le premier facteur d’**épuisement des ressources abiotiques** du numérique.', source: 'GreenIT.fr, *Empreinte environnementale du numérique mondial* (2019) ; ancien cours.' },
  duree_vie: { region: 'mines', title: 'L’effondrement de la durée de vie', inv: ['M2-42', 'M2-43'], text: '1985 : 10-15 ans · 2003 : ~10 ans · 2022 : ~5 ans. Durée de vie divisée par **3** en 30 ans.\n\nÈre réparable : modularité, composants évolutifs, documentation technique. Ère jetable : composants soudés, batteries collées, obsolescence logicielle, réparation non rentable.', source: 'WWF France ; ancien cours.' },
  ressources_extraites: { region: 'mines', title: 'Le sac à dos écologique', inv: ['M2-44', 'M2-76', 'M2-07'], text: 'Ordres de grandeur souvent cités : un smartphone mobilise **plusieurs dizaines à quelques centaines de kilos** de matières (de 70 kg à 220 kg selon les méthodes) ; un ordinateur portable, environ **240 kg** de combustibles fossiles, 22 kg de produits chimiques et 1,5 t d’eau (chiffres issus d’une étude de l’Université des Nations unies de 2004) ; un écran, jusqu’à 2 t de matières.\n\n⚠ Ces chiffres varient beaucoup selon les méthodes et datent parfois de 20 ans : retiens surtout les **ordres de grandeur**.', source: 'Université des Nations unies (2004) ; GreenIT.fr / The Shift Project ; ancien cours.' },
  acv: { region: 'mines', title: 'L’Analyse du Cycle de Vie (ACV)', inv: ['M2-68', 'M2-69', 'M2-71', 'M2-73'], text: 'Méthode normalisée (**ISO 14040/14044**) qui évalue les impacts d’un produit « du berceau à la tombe » : extraction, fabrication, transport (un smartphone parcourt l’équivalent de plusieurs tours de la Terre), usage, fin de vie. Elle est **multicritère** : climat, ressources, eau, toxicité, déchets…\n\nFabrication / usage : smartphone ~85/15, laptop ~75/25, serveur ~25/75.\n\n« Il faut 2 fois plus d’énergie pour transporter une donnée que pour la stocker pendant 1 an. » — Frédéric Bordage.', source: 'ISO 14040/14044 ; ADEME ; ancien cours.' },
  patch: { region: 'mines', title: 'Le développeur et l’obsolescence', inv: ['M2-74'], text: 'On ne change pas un terminal parce qu’il est en panne, mais parce qu’il « rame ». Optimiser le code (moins de RAM, moins de CPU), c’est **retarder l’achat de nouveaux terminaux** : le levier n°1 pour réduire l’impact de la fabrication.', source: 'Ancien cours.' },
  reconditionne: { region: 'mines', title: 'Le reconditionné', inv: ['M2-10'], text: 'Un appareil reconditionné évite l’essentiel de l’impact de fabrication d’un appareil neuf. Remplacer une batterie ou un écran prolonge la vie de plusieurs années. Des dizaines de millions de téléphones inutilisés dorment dans les tiroirs en France.', source: 'ADEME, études sur le reconditionnement (2022).' },
  mine_urbaine: { region: 'mines', title: 'La mine urbaine', inv: ['M2-23'], text: 'Les déchets électroniques contiennent souvent plus d’or par tonne que le minerai (l’ancien cours disait : 1 tonne de smartphones = l’or de 17 tonnes de minerai). Mais le recyclage reste difficile : seuls ~22 % des e-déchets sont collectés et recyclés de façon documentée, et à peine **1 %** de la demande en terres rares est couverte par le recyclage.', source: 'Global E-waste Monitor 2024 (ONU/UNITAR) ; ancien cours.' },
  x01_indium: { region: 'mines', title: 'L’indium', inv: ['X-01'], text: 'Métal indispensable à la couche conductrice transparente (ITO) des écrans tactiles. Sous-produit du zinc, faiblement recyclé : un exemple de dépendance cachée du numérique.', source: 'Ancien cours (terminal #02).' },
};

export const STATEMENTS = [
  { id: 'm_terres_rares', r: 'mines', v: false, t: 'Les terres rares sont rares parce qu’il y en a très peu sur Terre.', x: 'Elles ne sont pas forcément rares en quantité, mais difficiles à séparer et polluantes à purifier.', inv: ['M2-25'] },
  { id: 'm_recyclage', r: '*', v: false, t: 'Le recyclage récupère presque tous les métaux de nos appareils.', x: 'Seuls ~22 % des e-déchets sont recyclés de façon documentée, et ~1 % de la demande en terres rares est couverte par le recyclage.', inv: ['M2-23'] },
  { id: 'm_plastique', r: 'mines', v: false, t: 'Un smartphone, c’est surtout du plastique et du verre.', x: 'Il contient plus de 30 éléments chimiques, dont des métaux rares et précieux.', inv: ['M2-19'] },
  { id: 'm_usage', r: 'mines', v: false, t: 'L’essentiel de l’impact d’un ordinateur portable vient de sa consommation électrique.', x: 'En France, c’est sa fabrication (environ 75 % de son empreinte carbone).', inv: ['M2-71'] },
  { id: 'm_16kg', r: 'mines', v: true, t: 'Il faut environ 16 kg de matières premières pour fabriquer une puce de 1 g.', x: 'Exact, selon le WWF.', inv: ['M2-20'] },
  { id: 'm_10M', r: 'mines', v: true, t: 'Environ 10 millions de smartphones sont jetés ou remplacés chaque mois dans l’UE.', x: 'Exact (EuChemS, 2019).', inv: ['M2-18'] },
  { id: 'm_4ans', r: '*', v: true, t: 'Garder son appareil 4 ans au lieu de 2 divise par deux son impact de fabrication annuel.', x: 'Exact : l’impact est réparti sur deux fois plus d’années.', inv: ['M2-10'] },
  { id: 'm_chine', r: 'mines', v: true, t: 'La Chine raffine la grande majorité des terres rares mondiales.', x: 'Exact : près de 90 % du raffinage.', inv: ['M2-21'] },
];

export const COMBAT = [
  { id: 'c_elements', r: 'mines', q: 'Combien d’éléments chimiques entrent au minimum dans un smartphone ?', options: ['Plus de 30', '3', '5', '10'], a: 0, explain: 'Jusqu’à 50-70 selon les modèles.' },
  { id: 'c_fab', r: 'mines', q: 'Quel est le meilleur levier pour réduire l’impact d’un smartphone ?', options: ['Le garder plus longtemps', 'Le recharger la nuit', 'Le recycler tous les ans', 'Réduire la luminosité'], a: 0, explain: 'La fabrication domine son empreinte.' },
  { id: 'c_acv', r: 'mines', q: 'Quelle est la première étape d’une ACV ?', options: ['L’extraction des matières premières', 'L’utilisation', 'Le recyclage', 'La vente'], a: 0, explain: 'Du berceau à la tombe.' },
  { id: 'c_duree', r: 'mines', q: 'Par combien la durée de vie moyenne des équipements a-t-elle été divisée en 30 ans ?', options: ['3', '1,5', '10', 'Elle a augmenté'], a: 0, explain: 'De ~15 ans à ~5 ans (WWF).' },
];

export const ON_ENTER = { mines: ['quest:main_mines'] };
export const ON_SEED = { mines: ['done:main_mines', 'toast:La **Lanterne Solaire** éclaire les grottes sombres. Avec le **Grappin** du Marais, tu pourras franchir le gouffre obscur vers la **Citadelle**.'] };
