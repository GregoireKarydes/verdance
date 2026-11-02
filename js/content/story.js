// =============================================================
// story.js — fil narratif, objectifs d'apprentissage et guidage
// Modifiable sans toucher au moteur.
//  • CHAPTERS : carte d'ouverture de chaque région (histoire, ce qu'on va
//    apprendre, mission) et bilan « Ce que tu as appris » à la replantation.
//  • TARGETS : cibles de la flèche jaune pour les étapes de quête qui n'en
//    avaient pas (plusieurs personnages, mobs, autre région…).
//  • COMPANION : Pousse, le petit esprit-graine qui guide le joueur.
// =============================================================

export const COMPANION = { name: 'Pousse', role: 'esprit-graine de l’Arbre-Mère' };

export const CHAPTERS = {
  village: {
    n: 0, title: 'Le Réveil',
    story: 'L’**Omnium**, une machine-monde qui devait « tout simplifier », a dévoré les métaux, l’eau et l’énergie de Verdance jusqu’à la **Surchauffe**. Le ciel est devenu orange et l’Arbre-Mère s’est éteint. Tu te réveilles à son pied. Moi, c’est **Pousse** : je suis la dernière graine qui lui reste, et je vais t’accompagner.',
    learn: ['Pourquoi le numérique n’a rien d’« immatériel »', 'Les trois fléaux : suréquipement, surconsommation de données, web obèse', 'Comment jouer : quêtes, combats d’idées reçues, Codex'],
    mission: 'Parle à **Sylve**, la gardienne, près de l’Arbre-Mère.',
  },
  steppe: {
    n: 1, title: 'La mémoire de la glace',
    story: 'Ici, la glace garde la mémoire du climat. **Aïdan le Carottier** y lit comment l’humanité a prospéré pendant 10 000 ans de calme… et comment nous sommes en train d’en sortir. La Graine-Mère dort au cœur du **Temple de la Serre**.',
    learn: ['L’Holocène : 10 000 ans d’un climat exceptionnellement stable', 'Les gaz à effet de serre et leur pouvoir de réchauffement (PRG)', 'Ton empreinte carbone et l’objectif de 2 t CO₂e par personne'],
    mission: 'Trouve **Aïdan**, puis traverse le **Temple de la Serre**.',
    recap: ['Depuis ~10 000 ans, le climat stable de l’**Holocène** a permis l’agriculture et les villes : nous sommes en train d’en sortir.', 'Tous les gaz ne se valent pas : sur 100 ans, 1 t de **méthane** ≈ 28 t de CO₂ et 1 t de **N₂O** ≈ 273 t.', 'Objectif compatible avec l’Accord de Paris : environ **2 t CO₂e par personne et par an** en 2050, contre environ 8 t aujourd’hui en France.'],
    next: 'Le brouillard s’est dissipé au nord : direction le **Bassin des 9 Sceaux**.',
  },
  bassin: {
    n: 2, title: 'Les neuf sceaux',
    story: 'Autour du lac asséché, neuf obélisques veillent sur les **limites de la planète**. Sept sont fissurés. Au bourg, le maire, la négociante et le citoyen se renvoient la faute… et rien ne bouge.',
    learn: ['Les 9 limites planétaires et leur état en 2025', 'Le triangle de l’inaction : politique, entreprise, citoyen', 'Pourquoi l’action collective peut réussir (l’exemple de l’ozone)'],
    mission: 'Parle à l’**Observatrice Néva**, puis examine les obélisques.',
    recap: ['**7 limites planétaires sur 9** sont dépassées (bilan 2025), dont le climat, l’eau douce et l’acidification des océans.', 'Le **triangle de l’inaction** : chacun attend que l’autre bouge. On le brise en agissant à son propre niveau.', 'La couche d’**ozone** se reconstitue grâce au protocole de Montréal (1987) : un accord mondial peut réparer une limite.'],
    next: 'Deux chemins s’ouvrent : les **Mines d’Abysse** (au nord du Bassin) et le **Marais des Réseaux** (au sud du village). L’ordre est libre.',
  },
  mines: {
    n: 3, title: 'Le prix du métal',
    story: 'Dans les Mines d’Abysse, on arrache à la roche les métaux de nos appareils. Le **Marchand Neuf-Toujours** voudrait que tu rachètes tout, tout le temps. Le **Contremaître Cobalt**, lui, connaît le vrai prix d’un smartphone.',
    learn: ['De quoi est fait un smartphone (des dizaines de métaux)', 'L’analyse de cycle de vie (ACV), de l’extraction à la fin de vie', 'Pourquoi la fabrication pèse plus lourd que l’usage'],
    mission: 'Parle au **Contremaître Cobalt**, puis traverse **la Fonderie**.',
    recap: ['Un smartphone contient des **dizaines de métaux**, dont certains rares, critiques ou extraits dans des conditions difficiles.', 'En France, la **fabrication** des équipements représente près de **80 %** de l’empreinte carbone du numérique (ADEME-Arcep).', 'Le geste le plus efficace : **allonger la durée de vie** (réparer, choisir le reconditionné, garder plus longtemps).'],
    next: 'La Lanterne Solaire éclaire les tunnels sombres. Si ce n’est pas fait, va au **Marais des Réseaux**.',
  },
  marais: {
    n: 4, title: 'Les fils du marais',
    story: 'Câbles, pylônes et antennes s’enchevêtrent dans le marais. Chaque vidéo, chaque message voyage par ici… et tout cela consomme de l’électricité. La **Vigie** surveille tout depuis sa tour.',
    learn: ['Le poids du numérique dans les émissions et l’électricité', 'Réseaux et usages : fibre, 4G, 5G, qualité des vidéos', 'Les données sombres (dark data) et la sobriété des usages'],
    mission: 'Monte voir la **Vigie**, au pied de sa tour.',
    recap: ['Le numérique pèse environ **4,4 %** de l’empreinte carbone de la France (ADEME-Arcep).', 'Le **type de réseau** et la **qualité vidéo** changent fortement l’énergie consommée : la sobriété commence par le bon choix.', 'Les données gardées « au cas où » (**dark data**) consomment pour rien : trier et supprimer, c’est utile.'],
    next: 'Le Grappin franchit les gouffres : la **Décharge de Ferraille** (à l’est du village) t’est ouverte. Avec la Lanterne en plus, la **Citadelle des Serveurs** (au nord du village) aussi.',
  },
  citadelle: {
    n: 5, title: 'La forteresse brûlante',
    story: 'La Citadelle bourdonne de serveurs brûlants. L’air tremble de chaleur. L’**ingénieure Calorine** rêve de chauffer le village avec cette chaleur perdue, mais le Gardien Racko ne laisse passer personne.',
    learn: ['Combien consomment les centres de données', 'Le PUE et le WUE : mesurer l’efficacité', 'Choisir un hébergeur responsable'],
    mission: 'Parle à l’**ingénieure Calorine**.',
    recap: ['Les centres de données ont consommé environ **415 TWh** en 2024, soit ≈ **1,5 %** de l’électricité mondiale (AIE).', '**PUE** = énergie totale ÷ énergie informatique : 1,2 c’est très bien, la moyenne mondiale tourne autour de 1,5.', 'Un hébergeur responsable : électricité bas carbone, bon PUE, chaleur récupérée, et de la **transparence**.'],
    next: 'La Lentille de Mesure révèle les mirages : le **Désert des Oracles** t’attend au nord.',
  },
  desert: {
    n: 6, title: 'L’Oracle qui avait soif',
    story: 'Dans le désert, les tours-oracles aspirent l’eau de la dernière oasis pour répondre à tout… même aux additions. Le **Grand Oracle Gargantua** est immense, vaniteux et assoiffé. Le petit **Mini** pense qu’on peut faire autrement.',
    learn: ['Entraînement ou inférence : où part l’énergie de l’IA', 'Le bon modèle pour la bonne tâche, et l’effet rebond', 'L’AI Act européen et ses niveaux de risque'],
    mission: 'Va parler au **Grand Oracle Gargantua**.',
    recap: ['À grande échelle, c’est l’**usage** (l’inférence) qui finit par dominer l’empreinte d’une IA, pas seulement l’entraînement.', 'Un **petit modèle spécialisé** suffit souvent : inutile d’appeler un géant pour une addition. Attention à l’**effet rebond**.', 'L’**AI Act** classe les IA par niveau de risque : la notation sociale est interdite, le tri de CV est « à haut risque ».'],
    next: 'Le Cristal de Sobriété dissipe les murs d’hallucination. Continue vers les régions qu’il te reste.',
  },
  decharge: {
    n: 7, title: 'Le procès de l’Obsolescence',
    story: 'Des montagnes d’appareils… dont beaucoup fonctionnaient encore. Dans une carcasse de serveur, la **Juge Durabilis** prépare le procès de l’Obsolescence. Il lui manque des témoins.',
    learn: ['Le volume mondial des déchets électroniques', 'Les lois : AGEC, REEN, droit à la réparation', 'Réparer, réemployer, recycler (dans cet ordre)'],
    mission: 'Présente-toi à la **Juge Durabilis**.',
    recap: ['Le monde a produit **62 millions de tonnes** de déchets électroniques en 2022.', 'La **loi AGEC** (2020) a créé l’indice de réparabilité ; l’**obsolescence programmée** est un délit en France.', 'La **loi REEN** (2021) impose notamment la sobriété numérique à l’école et l’écoconception chez les ingénieurs.'],
    next: 'Les Pinces du Réparateur ouvrent la porte cassée de la **Forge des Bâtisseurs**, au nord de la Décharge.',
  },
  forge: {
    n: 8, title: 'L’atelier des sobres',
    story: 'Dans la Forge, des artisans construisent des services **utiles et légers**. Mais le **Golem Obésiciel**, gavé de publicités et de vidéos automatiques, a pris l’atelier en otage. **Maître Sobre** t’attend.',
    learn: ['L’écoconception : la grille 3U (Utile, Utilisé, Utilisable)', 'Alléger une page : images, scripts, polices, vidéos', 'Les référentiels et bonnes pratiques (dont le RGESN)'],
    mission: 'Parle à **Maître Sobre**.',
    recap: ['Une fonctionnalité doit être **Utile, Utilisée et Utilisable** (grille 3U) ; sinon, on la supprime.', 'Le poids d’une page vient surtout des **images, vidéos et scripts** : chaque Ko compte, pour chaque visite.', 'Des **référentiels** existent pour s’y retrouver, comme le RGESN publié en 2024 par l’Arcep et l’Arcom.'],
    next: 'Quand tu auras les 8 graines, le **Sanctuaire de la Mesure** s’ouvrira, au nord de la Forge.',
  },
  sanctuaire: {
    n: 9, title: 'Mesurer pour agir',
    story: 'Au Sanctuaire, **Indexa la Mesureuse** répète une règle simple : on n’améliore bien que ce qu’on mesure. Derrière le Sceau de l’Index, l’**Omnium** attend.',
    learn: ['Mesurer un vrai site avec l’EcoIndex', 'Les indicateurs clés : PUE, WUE, intensité carbone', 'Construire ton plan d’action Green IT'],
    mission: 'Parle à **Indexa la Mesureuse**.',
  },
};

/**
 * Cibles de la flèche pour les étapes sans repère.
 * Clé « quête:étape ». Valeur : id de repère, 'mob:<type>', 'region:<id>',
 * ou une liste ; dans une liste, chaque entrée est un id (fait quand on lui a
 * parlé) ou [id, 'drapeau qui marque l’entrée comme faite'].
 * Les étapes « Replante la Graine-Mère » visent automatiquement l’autel.
 */
export const TARGETS = {
  'main_village:1': 'mob:co2',
  'main_village:5': 'region:steppe',
  'qs_fleaux:0': ['joss', 'mina', 'ferdi'],
  'qs_piliers:0': ['f_alim', 'f_biens', 'f_transport', 'f_habitat'],
  'main_bassin:2': [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => ['obelisk_' + i, 'obelisk_vu_' + i]),
  'qs_ozone:0': 'ozonie',
  'qs_cables:0': 'ondin',
  'main_decharge:2': [['fixie2', 'temoin_fixie'], ['ewan', 'temoin_ewan'], ['fairphonia', 'temoin_fair']],
};

/** Conseils « Comment faire ? » selon les mots de l'étape (premier motif trouvé). */
export const HOWTO = [
  [/replante|graine-m[èe]re/i, 'Va jusqu’à l’**autel** de la région (suis la flèche jaune), puis appuie sur **E** devant lui.'],
  [/fumerolle|dissipe|bats|vaincs|dégraisse|golem|omnium/i, 'Approche-toi et frappe avec **Espace**. Avec le bouclier (**Maj**), tu peux parer les attaques-citations : réponds **VRAI** ou **FAUX**. Si tu es en difficulté, recule et mange un fruit (**I**).'],
  [/traverse|explore|réconcilie|tribunal|temple|fonderie|relais|labyrinthe|atelier|salle des machines|sceau|procès/i, 'Entre dans le bâtiment (flèche jaune, puis **E** devant la porte). Dans chaque salle, approche-toi du **piédestal** pour lancer l’énigme. Bloqué·e ? Le bouton **Indice** et le **Codex** (**C**) t’aident.'],
  [/épreuve|quiz|réussis/i, 'Parle au personnage indiqué : il te pose des questions (QCM). Une erreur n’est pas grave : lis l’explication, elle t’apprend la bonne réponse, et tu peux réessayer.'],
  [/rédige|plan d’action/i, 'Parle au personnage : une **question ouverte** s’affiche. Réponds avec tes mots, en quelques phrases argumentées. C’est ton enseignant·e qui la lira.'],
  [/\bexamine|\bregarde|\blis\b|\bobserve|étudie|\bactionne|stèle|fresque|pierre|obélisque|projection/i, 'Approche-toi de l’objet indiqué par la flèche et appuie sur **E**. Prends le temps de lire : c’est là qu’est le cours.'],
  [/mission terrain|calcule|mesure/i, 'Cette étape te fait utiliser un **vrai outil en ligne**. Ouvre-le depuis la fenêtre de mission, note ton résultat, puis reviens le saisir.'],
  [/rejoins|direction|va /i, 'Suis la **flèche jaune** sur le bord de l’écran : elle pointe vers ta destination. La carte (**M**) montre où tu es.'],
  [/écoute|parle|retourne|demande|présente|recueille|réponds|convaincs|partage|raconte|interprète/i, 'Rejoins le personnage indiqué par la flèche et appuie sur **E** pour lui parler. Lis bien ses bulles : elles contiennent les réponses des énigmes.'],
  [/arcade|points/i, 'Va à la **borne d’arcade** (flèche jaune), appuie sur **E**, puis tranche les éléments inutiles et épargne les utiles.'],
  [/./, 'Va voir le personnage ou l’objet indiqué par la **flèche jaune** et appuie sur **E** : il te proposera une activité (quiz, tri, choix…). Lis bien ses explications, elles servent pour la suite.'],
];
