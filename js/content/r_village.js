// =============================================================
// Région 0 — Village de la Souche (prologue, hub)
// =============================================================
export const look = (top, hair = '#5a3a22', o = {}) => ({ skin: '#f1c9a0', hair, hairStyle: 0, top, bottom: '#5a4a3a', ...o });

export const NPCS = {
  sylve: { id: 'sylve', name: 'Sylve', look: look('#2f7d4a', '#e8e0c8', { hairStyle: 2, robe: '#2a6a3e', hat: 'leaf', skin: '#e8c4a0' }), inv: ['M1-04', 'M1-05'],
    talk: [
      { if: '!flag:baton', mark: 'quest', say: ['Te voilà enfin debout, {nom}. L’Arbre-Mère t’a choisi·e… ses dernières forces t’ont réveillé·e.', 'Regarde autour de toi : la **Surchauffe** a tout brûlé. Les fumées de CO₂ rôdent jusqu’au village.', 'Prends ce **Bâton de Sève**. Il dissipe ce que le gaspillage a fait naître.'],
        act: ['fanfare:baton|Bâton de Sève|**Espace** (ou J) pour frapper · **Ctrl** pour une roulade · **E** pour parler et examiner.', 'flag:baton', 'flag:tuto_combat', 'step:main_village:1', 'spawn:co2,3', 'toast:Dissipe **3 fumerolles de CO₂** autour du village.'] },
      { if: 'flag:tuto_combat&!flag:tuto_kills_ok', say: ['Dissipe trois fumerolles de CO₂. Frappe avec **Espace**, esquive avec **Ctrl**.', 'S’il n’y en a plus en vue, je vais en attirer une ou deux…'], act: ['spawn:co2,2'] },
      { if: 'flag:tuto_kills_ok&!flag:briefing', mark: 'quest', say: ['Bien joué ! Tu vois : rien n’est irréversible tant qu’on agit.', 'Va maintenant écouter **l’Archiviste Holo**, le vieux robot solaire près de l’Arbre. Il garde la mémoire de ce qui s’est passé.'], act: ['step:main_village:3'] },
      { if: 'flag:briefing&!flag:tuto_fini', mark: 'quest', say: ['Tu sais maintenant ce qui nous attend. Huit Graines-Mères dorment dans huit régions.', 'Commence par les **Steppes de l’Holocène**, à l’ouest : on y lit l’histoire du climat dans la glace.', 'J’ai dégagé le tronc calciné qui bloquait le chemin. Va, {nom} !'],
        act: ['flag:tuto_fini', 'step:main_village:5', 'graines:10', 'toast:Astuce : **Échap** ouvre le menu (inventaire, journal, carte, codex, bilan). Le jeu se sauvegarde tout seul.'] },
      { if: 'seeds>=8', say: ['Huit graines… L’Arbre-Mère n’a jamais été aussi beau. L’Omnium t’attend au **Sanctuaire de la Mesure**, au nord-est.'] },
      { if: 'seeds>=4', say: ['Regarde l’Arbre-Mère, {nom} : il bourgeonne ! Chaque graine replantée lui redonne vie.', 'Il te reste {seeds} graine(s) sur 8. Pense aux **Racines** pour voyager vite entre les régions.'] },
      { say: ['Chaque région cache une Graine-Mère au cœur de son temple. L’Arbre-Mère grandit à chaque graine replantée.', 'Si tu ne sais plus quoi faire : appuie sur **H** (Pousse t’expliquera), ou suis la flèche jaune.'] },
    ] },

  holo: { id: 'holo', name: 'Archiviste Holo', kind: 'robot', inv: ['M1-01', 'M1-02', 'M1-03', 'M1-06', 'M1-07'],
    talk: [
      { if: 'step:main_village>=3&!flag:briefing', mark: 'quest', say: [
        'BIP. Archiviste Holo, alimenté à 100 % par le soleil. Mémoire intacte. Je te transmets le **briefing**.',
        'Le paradoxe : le numérique devait **dématérialiser** le monde. En réalité, il repose sur des milliards d’objets, de câbles et de centres de données très **matériels**.',
        'Trois chiffres clés. Un : le numérique pèse **entre 2 et 4 %** des émissions mondiales de gaz à effet de serre selon les études — du même ordre que l’aviation civile.',
        'Deux : en France, la **fabrication** des équipements représente l’essentiel de l’empreinte du numérique — environ 78 % dans l’étude ADEME-Arcep de 2022, la moitié environ en 2025, car les centres de données (et l’IA) progressent vite.',
        'Trois : la consommation d’énergie du numérique a longtemps crû d’environ **+9 % par an** (Shift Project, 2018). Avec l’IA, la demande des centres de données pourrait **doubler d’ici 2030** (AIE, 2025).',
        'Ton parcours suit quatre chapitres : **comprendre** (climat, limites), **mesurer** (matériel, réseaux, centres de données, IA), **éco-concevoir**, puis **piloter**.',
        'Objectif final : être capable de présenter un **plan d’action chiffré** à un comité de direction. Pour Verdance… et pour ta future organisation.'],
        act: ['flag:briefing', 'codex:paradoxe_numerique', 'codex:part_numerique_ges', 'codex:parcours', 'step:main_village:4', 'title:Initié·e'] },
      { if: 'flag:briefing', ask: { q: 'BIP. Que veux-tu consulter dans mes archives ?', options: [
        { t: 'Rappelle-moi le paradoxe du numérique', say: ['Plus le numérique semble « invisible » (cloud, sans-fil), plus son infrastructure physique est lourde. Chaque octet passe par des machines qui consomment énergie, métaux et eau.'] },
        { t: 'Les rangs de Gardien·ne', say: ['Initié·e → Analyste → Stratège → Expert·e → Gardien·ne. Tu montes en grade en replantant les Graines-Mères.'] },
        { t: 'Comment est calculé mon bilan ?', say: ['Ton bilan PDF (menu › Mon bilan) regroupe ta progression, tes réponses et une note indicative sur 16. Ton enseignant·e note les questions de réflexion sur 4.', 'Le bilan reste enregistré dans ce navigateur. Tu peux le régénérer à tout moment.'] },
        { t: 'Rien, merci', say: ['BIP. Bonne route.'] },
      ] } },
      { say: ['BIP… Batterie à 12 %. Il fait si sombre depuis la Surchauffe… Parle d’abord à Sylve.'] },
    ] },

  baya: { id: 'baya', name: 'Tavernière Baya', look: look('#aa3a3a', '#2a1a10', { hairStyle: 2, apron: '#f0e0c0' }), inv: ['M3-24'],
    talk: [
      { if: 'flag:visite_forge&!puzzle:quiz_baya', mark: 'quest', say: ['Tu reviens de la Forge des Bâtisseurs ? Alors tu es prêt·e pour mon **quiz des 115 bonnes pratiques** !', 'Dix questions. Un repas offert à qui les réussit toutes.'], act: ['quest:qs_baya', 'puzzle:quiz_baya'] },
      { ask: { q: 'Bienvenue à la Taverne de la Souche ! Qu’est-ce qui te ferait plaisir ?', options: [
        { t: 'Un fruit (5 graines)', act: ['pay:5', 'fruit:1'] },
        { t: 'Un kit de réparation (15 graines)', act: ['pay:15', 'kit:1'] },
        { t: 'Un conseil', say: ['Répare ton bâton plutôt que d’en racheter un ! Et ne néglige pas les quêtes secondaires : elles cachent des **fragments de feuille**.', 'Quand tu auras visité la Forge des Bâtisseurs, reviens me voir pour mon grand quiz.'] },
        { t: 'Rien, merci', say: ['À bientôt, Gardien·ne !'] },
      ] } },
    ] },

  joss: { id: 'joss', name: 'Joss le collectionneur', look: look('#3a5aaa', '#8a5a2a', { hat: 'cap', hatColor: '#c08a3a' }), inv: ['X-02', 'M2-39'],
    talk: [
      { if: '!flag:fleau_1', mark: 'quest', say: ['Avant la Surchauffe, j’avais **trois ordinateurs, deux téléphones, une tablette, deux écrans, une console**… et une brodeuse connectée !', 'Tout le monde faisait pareil. Le premier fléau, c’est le **suréquipement** : toujours plus d’objets, renouvelés toujours plus vite.'], act: ['flag:fleau_1', 'quest:qs_fleaux', 'script:fleaux_check'] },
      { say: ['Aujourd’hui je garde un seul ordinateur, réparé trois fois. Il tourne très bien !'] },
    ] },
  mina: { id: 'mina', name: 'Mina la streameuse', look: look('#aa3a8a', '#1a1a2a', { hairStyle: 2, glasses: true }), inv: ['X-02'],
    talk: [
      { if: '!flag:fleau_2', mark: 'quest', say: ['Je regardais des vidéos en 4K toute la journée, même en fond sonore… Des téraoctets de photos jamais revues dormaient dans le cloud.', 'Le deuxième fléau : la **surconsommation de données**. Chaque octet transporté et stocké sollicite des réseaux et des serveurs.'], act: ['flag:fleau_2', 'quest:qs_fleaux', 'script:fleaux_check'] },
      { say: ['Maintenant, je baisse la définition quand l’image ne compte pas. Et je fais le ménage dans mes fichiers.'] },
    ] },
  ferdi: { id: 'ferdi', name: 'Ferdi le webmestre', look: look('#5a5a5a', '#3a3a3a', { hairStyle: 3, beard: '#3a3a3a' }), inv: ['X-02'],
    talk: [
      { if: '!flag:fleau_3', mark: 'quest', say: ['Mon site de réservation pesait **3 Mo** pour afficher un simple formulaire. Les vieux téléphones n’arrivaient plus à le charger.', 'Le troisième fléau : l’**omniprésence d’un web obèse**. Des pages toujours plus lourdes qui poussent à changer d’appareil.'], act: ['flag:fleau_3', 'quest:qs_fleaux', 'script:fleaux_check'] },
      { say: ['On m’a parlé d’une Forge, au nord-est, où l’on apprend à bâtir léger…'] },
    ] },
};

export const SCRIPTS = {
  'secret:archives': [{ say: [{ who: 'Grenier oublié', t: 'Des cartons poussiéreux étiquetés « Ancien site du cours ». Dedans, des chiffres barrés et des notes : « à vérifier », « source ? », « corrigé ».' }], act: ['codex:archives_site'] }],
  intro_reveil: [{ say: [{ who: 'sylve', t: '{nom}… {nom} ! Réveille-toi ! Viens me voir, près de l’Arbre-Mère.' }], act: ['quest:main_village'] }],
  fleaux_check: [
    { if: 'flag:fleau_1&flag:fleau_2&flag:fleau_3&!done:qs_fleaux', act: ['codex:trois_fleaux', 'done:qs_fleaux'] },
    { if: '!done:qs_fleaux', act: [] },
  ],
  arbre_mere: [
    { if: 'flag:omnium_vaincu', say: [{ who: 'L’Arbre-Mère', t: 'Ses branches chantent. Verdance respire. Merci, Gardien·ne.' }] },
    { if: 'seeds>=1', say: [{ who: 'L’Arbre-Mère', t: 'L’écorce est tiède. {seeds} graine(s) sur 8 ont été replantées. De nouvelles feuilles percent…' }], act: ['heal'] },
    { say: [{ who: 'L’Arbre-Mère', t: 'L’écorce est froide et calcinée. Pourtant, tout au fond, quelque chose bat encore.' }] },
  ],
  stele_souche: [{ say: [{ who: 'Stèle de la Souche', t: '« La ligne de code la plus écologique est celle que l’on n’écrit pas. La sobriété numérique n’est pas une contrainte : c’est un levier d’innovation et d’excellence technique. »' }], act: ['codex:sobriete'] }],
  panneau_village: [{ say: [{ who: 'Panneau', t: '← Ouest : Steppes de l’Holocène · ↓ Sud : Marais des Réseaux · ↑ Nord : Citadelle des Serveurs · → Est : Décharge de Ferraille' }, { who: 'Panneau', t: 'Gravé dessous : « Ce jeu pèse moins qu’une seule photo de smartphone. »' }], act: ['codex:jeu_ecoconcu'] }],
};

export const QUESTS = [
  { id: 'main_village', title: 'Le Réveil', region: 'village', main: true, steps: [
    { t: 'Parle à Sylve, près de l’Arbre-Mère', at: 'sylve' }, 'Dissipe 3 fumerolles de CO₂ autour du village', { t: 'Retourne voir Sylve', at: 'sylve' },
    { t: 'Écoute le briefing de l’Archiviste Holo', at: 'holo' }, { t: 'Retourne voir Sylve', at: 'sylve' }, 'Rejoins les Steppes de l’Holocène, à l’ouest'] },
  { id: 'qs_fleaux', title: 'Les trois fléaux', region: 'village', giver: 'joss', steps: ['Écoute Joss, Mina et Ferdi : quels sont les trois fléaux du numérique ?'], reward: { graines: 15 } },
  { id: 'qs_baya', title: 'Le grand quiz de la taverne', region: 'village', giver: 'baya', steps: [{ t: 'Réussis le quiz de Baya', at: 'baya' }], reward: { heart: true } },
];

export const PUZZLES = {
  quiz_baya: { type: 'qcm', title: 'Le quiz des 115 bonnes pratiques', region: 'village', main: false, inv: ['M3-24'], icon: '🍺',
    intro: 'Dix questions tirées du référentiel des **115 bonnes pratiques** d’éco-conception web (Collectif Numérique Responsable).',
    onWin: ['done:qs_baya', 'graines:20', 'say:Parfait ! Tu mérites le titre de Maître·sse GreenIT. Et voici ton repas : un fragment de feuille !'],
    questions: [
      { q: 'Quelle est la meilleure approche pour afficher une longue liste de résultats ?', options: ['La pagination (20 éléments à la fois)', 'Le défilement infini', 'Tout charger d’un coup', 'Des iframes'], a: 0, explain: 'Bonne pratique n°13 : la pagination évite les DOM géants et limite la mémoire consommée.' },
      { q: 'Comment utiliser les bibliothèques JavaScript ?', options: ['Tout importer pour être tranquille', 'N’utiliser que les portions indispensables (tree-shaking)', 'Plusieurs bibliothèques pour la même fonction', 'Ne jamais en utiliser'], a: 1, explain: 'Bonne pratique n°15 : le tree-shaking élimine le code inutilisé.' },
      { q: 'Que faire des données calculées souvent utilisées ?', options: ['Les recalculer à chaque fois', 'Les mettre en cache', 'Les stocker dans des cookies', 'Les redemander au serveur'], a: 1, explain: 'Bonne pratique n°16 : le cache évite les calculs redondants.' },
      { q: 'Quel type de pages privilégier quand c’est possible ?', options: ['Dynamiques avec calcul serveur', 'Statiques générées à l’avance', 'Applications monopage complexes', 'Pages qui se rechargent seules'], a: 1, explain: 'Bonne pratique n°18 : une page statique ne demande aucun calcul serveur à chaque visite.' },
      { q: 'Quelle pratique est à proscrire avec SQL ?', options: ['Les requêtes préparées', 'Les requêtes dans une boucle', 'Les index', 'LIMIT'], a: 1, explain: 'Bonne pratique n°64 : une requête par itération (le fameux « N+1 ») est catastrophique.' },
      { q: 'Que faire des fichiers CSS, JS, HTML et SVG en production ?', options: ['Les garder commentés', 'Les minifier', 'Les héberger sur plusieurs domaines', 'Les dupliquer'], a: 1, explain: 'Bonne pratique n°77 : la minification réduit fortement leur poids.' },
      { q: 'Comment limiter l’impact des appels d’API ?', options: ['Un appel par donnée', 'Limiter et regrouper les appels', 'Un appel par seconde pour rafraîchir', 'Doubler les appels par sécurité'], a: 1, explain: 'Bonne pratique n°21 : chaque appel HTTP a un coût.' },
      { q: 'Quand se connecter à la base de données ?', options: ['À chaque page, par précaution', 'Uniquement si c’est nécessaire', 'Connexion permanente', 'Plusieurs connexions simultanées'], a: 1, explain: 'Bonne pratique n°24.' },
      { q: 'Quel format d’image privilégier ?', options: ['PNG partout', 'WebP ou AVIF', 'BMP', 'GIF animés'], a: 1, explain: 'WebP et AVIF sont 30 à 50 % plus légers que le JPEG à qualité égale.' },
      { q: 'Quelle stratégie pour les fonctionnalités d’un site ?', options: ['Tout ajouter par défaut', 'Sobriété fonctionnelle : garder l’essentiel', 'Copier les concurrents', 'Multiplier les widgets externes'], a: 1, explain: 'Chaque fonctionnalité a un coût : la sobriété fonctionnelle est la base.' },
    ] },
};

export const CODEX = {
  paradoxe_numerique: { region: 'village', title: 'Le paradoxe du numérique', inv: ['M1-04', 'M2-04'], text: 'Le numérique est présenté comme un levier de la transition écologique (télétravail, optimisation logistique, réseaux électriques intelligents). Mais il génère lui-même une **empreinte croissante** : énergie, métaux, eau, déchets.\n\nLa « dématérialisation » est un mythe : chaque requête traverse des infrastructures physiques — terminaux, réseaux, centres de données — qu’il a fallu fabriquer.', source: 'Synthèse du cours ; ADEME-Arcep, *Évaluation de l’impact environnemental du numérique en France* (2022, mise à jour 2025).' },
  part_numerique_ges: { region: 'village', title: 'Quelle part des émissions mondiales ?', inv: ['M1-01', 'M2-01', 'M2-55'], text: 'Les estimations varient selon le périmètre : **2 à 4 %** des émissions mondiales de GES. The Shift Project avançait 3,5-4 % (2019) ; une revue scientifique donne **2,1 à 3,9 %** (Freitag et al., *Patterns*, 2021).\n\nComparaison souvent citée : l’aviation civile représente ~2,5 % du CO₂ mondial (davantage en effet de réchauffement total). D’où la formule « le numérique émet autant voire plus que l’aviation civile ».\n\n**Ancien chiffre du cours** : « 4 %, plus que l’aviation civile » — c’est le haut de la fourchette.', source: 'The Shift Project, *Lean ICT* (2019) ; Freitag et al., *The real climate and transformative impact of ICT*, Patterns (2021).' },
  parcours: { region: 'village', title: 'Les quatre chapitres du parcours', inv: ['M1-06', 'M1-07'], text: '1. **Contexte** : limites planétaires, ACV, points de bascule.\n2. **Mesure** : émissions par segment (terminaux, réseaux, centres de données), cycle de vie du matériel, scopes 1-2-3.\n3. **Éco-conception** : les 115 bonnes pratiques, sobriété, low-tech.\n4. **Pilotage** : EcoIndex, GreenIT-Analysis, indicateurs (PUE, WUE, intensité carbone).\n\nRangs : Initié·e → Analyste → Stratège → Expert·e → Gardien·ne.', source: 'Programme du cours (ancien site, page d’accueil).' },
  sobriete: { region: 'village', title: 'La sobriété numérique', inv: ['M1-08', 'M1-05'], text: '« La ligne de code la plus écologique est celle que l’on n’écrit pas. »\n\nLa sobriété consiste à **questionner le besoin** avant d’optimiser : moins d’équipements, gardés plus longtemps, moins de fonctionnalités superflues, moins de données inutiles. Pour un·e manager IT : devenir **architecte de la sobriété numérique**.', source: 'Ancien site du cours (briefing).' },
  trois_fleaux: { region: 'village', title: 'Les trois fléaux', inv: ['X-02'], text: '1. Le **suréquipement** : toujours plus d’objets connectés.\n2. La **surconsommation** de données (vidéo haute définition, stockage illimité).\n3. L’**omniprésence d’un web obèse** : des sites et logiciels de plus en plus lourds qui rendent les appareils obsolètes.', source: 'Ancien site du cours (page « Awareness »).' },
  jeu_ecoconcu: { region: 'village', title: 'Ce jeu est éco-conçu', inv: ['M1-09'], text: 'Verdance n’utilise **aucune image, police ni musique téléchargée** : tout est généré par le code. Les vidéos ne se chargent qu’à la demande. Objectif : un poids total de l’ordre de quelques centaines de kilo-octets, et une bonne note EcoIndex.\n\nL’ancien site du cours affichait déjà l’objectif : « Eco-index A, consommation −70 %, poids < 150 Ko ».', source: 'Ce jeu (vérifiable avec EcoIndex.fr).' },
};

export const STATEMENTS = [
  { id: 'v_dematerialisation', r: '*', v: false, t: 'Le numérique est immatériel : il ne pollue pas.', x: 'Il repose sur des milliards d’équipements, de câbles et de centres de données très matériels.', inv: ['M2-04'] },
  { id: 'v_cloud', r: '*', v: false, t: 'Le cloud, c’est juste un nuage : ça ne consomme rien.', x: 'Le « cloud », ce sont des centres de données qui tournent 24 h/24 : ~415 TWh d’électricité en 2024 dans le monde (AIE).', inv: ['M3-25'] },
  { id: 'v_part_ges', r: '*', v: true, t: 'Le numérique représente entre 2 et 4 % des émissions mondiales de GES.', x: 'Ordre de grandeur comparable à l’aviation civile.', inv: ['M1-01'] },
  { id: 'v_fabrication', r: '*', v: true, t: 'Pour un smartphone, la fabrication pèse bien plus que l’usage.', x: 'Environ 80 % de son empreinte carbone vient de sa fabrication.', inv: ['M2-71'] },
];

export const COMBAT = [
  { id: 'c_paradoxe', r: 'village', q: 'Quelle phase domine l’empreinte du numérique en France (étude ADEME-Arcep 2022) ?', options: ['La fabrication des équipements', 'L’envoi d’e-mails', 'La climatisation des bureaux', 'Le transport des colis'], a: 0, explain: 'Environ 78 % en 2022 (les centres de données progressent depuis).' },
];

export const ON_ENTER = {};
