// =============================================================
// Région 8 — Forge des Bâtisseurs (éco-conception)
// =============================================================
import { look } from './r_village.js';

export const NPCS = {
  sobre: { id: 'sobre', name: 'Maître Sobre', look: look('#8a6a3a', '#e8e8e8', { hairStyle: 3, beard: '#f0f0f0', apron: '#5a3a1a', hat: 'band', hatColor: '#3a8a3a' }), inv: ['M3-02', 'M3-12', 'M2-79'],
    talk: [
      { if: '!flag:sobre_1', mark: 'quest', say: ['Bienvenue à la Forge, Gardien·ne. Ici, on ne bâtit pas plus : on bâtit **mieux**.', 'L’**éco-conception**, c’est intégrer l’environnement **dès la conception** d’un service numérique. Pas seulement pour consommer moins d’énergie : pour solliciter moins de **matériel**, tout au long du cycle de vie.', 'Trois piliers : la **sobriété** (éliminer le superflu), la **performance** (optimiser le code et les contenus), l’**accessibilité** (un service inclusif et durable).', 'Commence par la pierre de projection, puis suis la feuille de route : **spécifications**, **design**, **développement**, **hébergement**. Quatre ateliers t’attendent.'], act: ['flag:sobre_1', 'flag:visite_forge', 'step:main_forge:1', 'codex:trois_piliers', 'codex:roadmap'] },
      { if: 'step:main_forge<6', say: ['Suis la feuille de route : spécifications (ouest), design (sud-ouest), développement (sud-est), hébergement (le panneau, au centre).'] },
      { if: 'step:main_forge==6', mark: 'quest', say: ['Les quatre ateliers sont validés. Une dernière épreuve de réflexion : la **grille 3U**.'], act: ['open:q10_3u'] },
      { if: 'step:main_forge==7', say: ['Le Golem Obésiciel est apparu au sud de la Forge ! Frappe-le pour lui retirer ses couches de gras.'], act: ['boss:golem'] },
      { if: 'step:main_forge==8', mark: 'quest', say: ['De 3 800 Ko à moins de 100 Ko ! C’est le poids d’une page qui s’affiche partout, même sur un vieux téléphone en 3G.', 'Tu es prêt·e. L’**Atelier du Bâtisseur** est ouvert, au nord-est. Le Plan du Bâtisseur t’y attend.'], act: ['flag:atelier_ouvert', 'step:main_forge:9'] },
      { if: '!seed:forge', say: ['L’Atelier du Bâtisseur est au nord-est.'] },
      { say: ['« La meilleure énergie est celle qu’on ne consomme pas. » N’oublie jamais.'] },
    ] },
  reference: { id: 'reference', name: 'Bibliothécaire Référence', look: look('#5a3a8a', '#3a2a1a', { hairStyle: 2, glasses: true, robe: '#4a2a6a' }), inv: ['M3-05'],
    talk: [
      { if: '!quest:qs_biblio', mark: 'quest', say: ['Inutile de réinventer la roue ! Vingt ans de travaux ont produit des **référentiels** reconnus. Lis les quatre grands livres derrière moi.'], act: ['quest:qs_biblio'] },
      { if: '!done:qs_biblio', say: ['Il te reste des livres à lire.'] },
      { say: ['Crédibilité scientifique, applicabilité, conformité réglementaire, communauté active : voilà pourquoi s’appuyer sur ces référentiels.'] },
    ] },
  epure: { id: 'epure', name: 'Épure la designeuse', look: look('#e0e0e0', '#1a1a1a', { hairStyle: 1, glasses: true }), inv: ['M3-18', 'M3-19'],
    talk: [
      { if: '!flag:epure_1', say: ['Le design **fige** la consommation future. Une interface surchargée gaspille pendant des années. Une interface sobre, centrée sur le besoin, élimine le superflu avant même la première ligne de code.', 'Le piédestal derrière moi est l’**atelier Design**.'], act: ['flag:epure_1', 'codex:green_ux'] },
      { say: ['Chaque élément visuel = une requête HTTP, du DOM, des pixels, des octets.'] },
    ] },
  rusta: { id: 'rusta', name: 'Rusta la codeuse', look: look('#c8603a', '#3a1a0a', { hairStyle: 2, hat: 'band', hatColor: '#2a2a2a' }), inv: ['M3-20', 'M3-21'],
    talk: [
      { if: '!flag:rusta_1', say: ['Développer éco-responsable, c’est simplement **bien développer** : chaque ligne doit justifier son CPU et sa RAM. Et l’effet est **multiplié par le nombre de visiteurs**.', 'Mon piédestal, c’est l’**atelier Développement**.'], act: ['flag:rusta_1'] },
      { say: ['« Appliquer ces règles, c’est simplement bien développer. L’écoconception est le nouveau standard de la qualité logicielle. »'] },
    ] },
  valeur: { id: 'valeur', name: 'Conseillère Valeur', look: look('#2a4a6a', '#c8a050', { hairStyle: 2, glasses: true }), inv: ['M3-03', 'M3-04'],
    talk: [
      { if: '!quest:qs_valeur', mark: 'quest', say: ['Un comité de direction te demandera : **pourquoi** éco-concevoir ? Ça rapporte quoi ? Je connais cinq leviers de valeur. Tu veux les découvrir ?'], act: ['quest:qs_valeur', 'puzzle:valeur_match'] },
      { if: '!done:qs_valeur', mark: 'quest', say: ['On reprend ?'], act: ['puzzle:valeur_match'] },
      { say: ['Écologie et économie vont souvent de pair : moins de code, moins de serveurs, moins de coûts.'] },
    ] },
  truffe: { id: 'truffe', name: 'Truffe (K-DOG)', kind: 'dog', inv: ['M3-11'],
    talk: [
      { if: '!quest:qs_truffe', mark: 'quest', say: ['Wouf ! *(Truffe renifle ta main avec attention, puis s’assoit, très fier.)*', { who: 'Panneau près de Truffe', t: 'Truffe est un malinois du projet **KDOG** (Institut Curie) : des chiens entraînés à détecter l’odeur de cellules cancéreuses du sein sur des lingettes. Pas de serveur, pas d’électricité.' }, { who: 'Panneau près de Truffe', t: 'Dans l’étude pilote, les chiens ont identifié tous les échantillons positifs lors d’un premier essai, puis environ 90 % dans un second : des résultats prometteurs mais sur de **petits effectifs**. C’est le **niveau 4** de l’éco-conception : parfois, la meilleure solution n’est pas numérique.' }], act: ['quest:qs_truffe', 'codex:kdog', 'done:qs_truffe'] },
      { say: ['Wouf !'] },
    ] },
  apollon: { id: 'apollon', name: 'Apollon l’astronaute', look: look('#e8e8e8', '#3a2a1a', { hat: 'helmet', hatColor: '#f0f0f0' }), inv: ['M2-49', 'M2-50', 'M2-51', 'M2-52'],
    talk: [
      { if: '!quest:qs_apollo', mark: 'quest', say: ['En 1969, on a posé des humains sur la Lune avec un ordinateur de bord doté d’environ **64 Ko** de mémoire. Aujourd’hui, 64 Ko ne suffisent pas à afficher le logo d’un site web !', 'Tu veux comprendre l’**obésité logicielle** ?'], act: ['quest:qs_apollo', 'puzzle:apollo_qcm'] },
      { if: '!done:qs_apollo', mark: 'quest', say: ['On reprend ?'], act: ['puzzle:apollo_qcm'] },
      { say: ['Le code source d’Apollo 11 est en ligne : [github.com/chrislgarry/Apollo-11](https://github.com/chrislgarry/Apollo-11).'] },
    ] },
  cmsia: { id: 'cmsia', name: 'Cémésia', look: look('#3a6a9a', '#8a3a1a', { hairStyle: 1, glasses: true }), inv: ['M3-23'],
    talk: [
      { if: '!quest:qs_cms', mark: 'quest', say: ['WordPress fait tourner une énorme part du web… mais c’est parfois « une tronçonneuse pour couper une brindille ». Tu veux connaître les alternatives sobres ?'], act: ['quest:qs_cms', 'puzzle:cms_qcm'] },
      { if: '!done:qs_cms', mark: 'quest', say: ['On reprend ?'], act: ['puzzle:cms_qcm'] },
      { say: ['Un site statique bien fait, c’est rapide, sûr et sobre.'] },
    ] },
  niveaux: { id: 'niveaux', name: 'Échelonne', look: look('#6a8a3a', '#2a1a10', { hairStyle: 0, hat: 'cap', hatColor: '#3a6a3a' }), inv: ['M3-07', 'M3-08', 'M3-09', 'M3-10'],
    talk: [
      { if: '!quest:qs_niveaux', mark: 'quest', say: ['Éco-concevoir n’est pas binaire. C’est une **échelle d’ambition** à 4 niveaux : optimisation technique, architecture, innovation fonctionnelle, rupture low-tech. Plus on monte, plus l’effort est grand… et l’impact réduit. Tu veux classer quelques cas célèbres ?'], act: ['quest:qs_niveaux', 'puzzle:niveaux_match'] },
      { if: '!done:qs_niveaux', mark: 'quest', say: ['On reprend ?'], act: ['puzzle:niveaux_match'] },
      { say: ['Niveau 1 : quick wins. Niveau 4 : rupture. Choisis ton ambition !'] },
    ] },
};

const livre = (id, title, text) => [{ say: [{ who: title, t: text }], act: ['flag:livre_' + id, 'script:biblio_check'] }];
export const SCRIPTS = {
  'livre:greenit': livre('greenit', 'Collectif Numérique Responsable (GreenIT.fr)', 'Depuis 20 ans, études, méthodes et outils. Le référentiel des **115 bonnes pratiques d’écoconception web** est la référence historique du secteur. [collectif.greenit.fr](https://collectif.greenit.fr/)'),
  'livre:designers': livre('designers', 'Designers Éthiques', 'Association dédiée à l’**éthique et à la sobriété du design numérique** : guide d’écoconception, ressources UX/UI, manifeste. [designersethiques.org](https://designersethiques.org/fr)'),
  'livre:afnor': livre('afnor', 'AFNOR SPEC 2201', 'Spécification française (2022) sur la démarche d’**écoconception des services numériques**, étape par étape, sur tout le cycle de vie. [afnor.org](https://www.afnor.org/)'),
  'livre:rgesn': livre('rgesn', 'RGESN (Arcep, Arcom, ADEME)', '**Référentiel général d’écoconception de services numériques** : 78 critères (version 2024), chacun avec une fiche pratique. Prévu par la loi REEN, publié en mai 2024 par l’Arcep et l’Arcom. Il sert à construire une démarche et à publier une déclaration d’écoconception. [Lire le RGESN](https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/)'),
  biblio_check: [{ if: 'flag:livre_greenit&flag:livre_designers&flag:livre_afnor&flag:livre_rgesn&!done:qs_biblio', act: ['codex:referentiels', 'quest:qs_biblio', 'done:qs_biblio'] }, { act: [] }],
  'atelier:spec': [
    { if: 'step:main_forge<2', say: [{ who: 'Atelier Spécifications', t: 'Maître Sobre veut d’abord que tu regardes la pierre de projection.' }] },
    { if: '!puzzle:spec_3u', say: [{ who: 'Atelier Spécifications', t: '« Plus on intervient tôt (besoin, conception, maquettage), plus l’effet de levier est fort. » Corriger un problème structurel en production coûte bien plus cher.' }], act: ['codex:specifications', 'puzzle:spec_3u'] },
    { say: [{ who: 'Atelier Spécifications', t: '✔ Atelier validé. « Éco-concevoir, c’est d’abord apprendre à dire NON au superflu. »' }] },
  ],
  'atelier:design': [
    { if: 'step:main_forge<3', say: [{ who: 'Atelier Design', t: 'La feuille de route commence par les spécifications (atelier à l’ouest).' }] },
    { if: '!puzzle:design_rules', act: ['puzzle:design_lab', 'puzzle:design_rules'] },
    { say: [{ who: 'Atelier Design', t: '✔ Atelier validé.' }] },
  ],
  'atelier:dev': [
    { if: 'step:main_forge<4', say: [{ who: 'Atelier Développement', t: 'Termine d’abord l’atelier Design.' }] },
    { if: '!puzzle:dev_quiz', act: ['codex:langages', 'puzzle:dev_quiz'] },
    { say: [{ who: 'Atelier Développement', t: '✔ Atelier validé.' }] },
  ],
  'atelier:host': [
    { if: 'step:main_forge<5', say: [{ who: 'Panneau Hébergement', t: 'Termine d’abord l’atelier Développement.' }] },
    { if: '!puzzle:host_quiz', say: [{ who: 'Panneau Hébergement', t: 'Dernière étape de la feuille de route : déployer sur des serveurs durables. Tu as tout appris à la Citadelle des Serveurs… vérifions.' }], act: ['puzzle:host_quiz'] },
    { say: [{ who: 'Panneau Hébergement', t: '✔ Atelier validé.' }] },
  ],
  'secret:apollo': [{ say: [{ who: 'La Salle Apollo', t: 'Des listings de code imprimés, empilés jusqu’au plafond : le code du guidage d’Apollo 11. Une note : « Avec ça, on faisait décoller des fusées. »' }], act: ['codex:apollo'] }],
};

export const QUESTS = [
  { id: 'main_forge', title: 'Bâtir léger', region: 'forge', main: true, steps: [
    { t: 'Parle à Maître Sobre', at: 'sobre' }, { t: 'Regarde la projection sur l’éco-conception', at: 'proj_eco' }, { t: 'Atelier 1 : Spécifications', at: 'atelier_spec' },
    { t: 'Atelier 2 : Design', at: 'atelier_design' }, { t: 'Atelier 3 : Développement', at: 'atelier_dev' }, { t: 'Atelier 4 : Hébergement', at: 'atelier_host' },
    { t: 'Retourne voir Maître Sobre', at: 'sobre' }, { t: 'Dégraisse le Golem Obésiciel (au sud de la Forge)', at: 'arene_golem' }, { t: 'Retourne voir Maître Sobre', at: 'sobre' }, { t: 'L’Atelier du Bâtisseur', at: 'temple_atelier' }, 'Replante la Graine-Mère'] },
  { id: 'qs_biblio', title: 'La bibliothèque', region: 'forge', giver: 'reference', steps: [{ t: 'Lis les quatre référentiels', at: 'livre_greenit' }], reward: { graines: 15 } },
  { id: 'qs_valeur', title: 'Pourquoi éco-concevoir ?', region: 'forge', giver: 'valeur', steps: [{ t: 'Les cinq leviers de valeur', at: 'valeur' }], reward: { graines: 15 } },
  { id: 'qs_truffe', title: 'Le chien qui sentait mieux que l’IA', region: 'forge', giver: 'truffe', steps: [{ t: 'Trouve Truffe', at: 'truffe' }], reward: { graines: 10 } },
  { id: 'qs_apollo', title: 'Apollo 64 Ko', region: 'forge', giver: 'apollon', steps: [{ t: 'L’obésité logicielle', at: 'apollon' }], reward: { heart: true } },
  { id: 'qs_cms', title: 'Le CMS sobre', region: 'forge', giver: 'cmsia', steps: [{ t: 'Les alternatives sobres', at: 'cmsia' }], reward: { graines: 10 } },
  { id: 'qs_niveaux', title: 'Les 4 niveaux', region: 'forge', giver: 'niveaux', steps: [{ t: 'Classe les cas célèbres', at: 'niveaux' }], reward: { graines: 15 } },
  { id: 'qs_arcade', title: 'Eco-Slash', region: 'forge', giver: 'arcade', steps: [{ t: 'Atteins 20 points à la borne d’arcade', at: 'arcade' }], reward: { graines: 20 } },
];

export const PUZZLES = {
  spec_3u: { type: 'match', title: 'Atelier 1 — La grille 3U', region: 'forge', icon: '📝', inv: ['M3-13', 'M3-14', 'M3-15'],
    intro: 'Tu conçois le site de réservation de train du village. Passe chaque fonctionnalité au filtre **3U** : est-elle **Utile** (valeur réelle), **Utilisée** (vraiment), **Utilisable** (accessible) ? Garde-la ou supprime-la.',
    cats: ['Garder', 'Supprimer (ou ne pas développer)'],
    items: [
      { t: 'Rechercher un trajet', cat: 0 }, { t: 'Payer son billet', cat: 0 }, { t: 'Navigation entièrement au clavier (accessibilité)', cat: 0 },
      { t: 'Billet consultable hors ligne', cat: 0 }, { t: 'Carrousel de 8 promotions en page d’accueil', cat: 1 },
      { t: 'Vidéo d’ambiance en lecture automatique', cat: 1 }, { t: 'Chatbot d’IA générative pour donner l’heure', cat: 1 }, { t: 'Widget météo animé', cat: 1 },
    ],
    onWin: ['step:main_forge:3', 'codex:specifications'],
    hints: ['Une fonctionnalité doit servir le besoin métier validé : ici, réserver un train.'],
    explain: 'Selon une étude souvent citée (Standish Group, 2002), environ **45 %** des fonctionnalités développées ne sont jamais utilisées et ~25 % rarement. Chaque fonctionnalité refusée en amont = code non écrit = serveurs non provisionnés = énergie non consommée.' },
  design_lab: { type: 'sliders', title: 'Atelier 2a — Le labo de compression', region: 'forge', icon: '🖼', inv: ['M3-16', 'M3-17'],
    intro: 'Une photo d’accroche de **1 400 Ko**. Elle s’affiche sur **800 px** de large. Fais-la passer sous **150 Ko** sans la rendre moche (qualité ≥ 60) ni floue (largeur ≥ 800 px).',
    sliders: [{ label: 'Largeur envoyée (px)', min: 400, max: 2400, step: 100, init: 2400 }, { label: 'Qualité de compression (%)', min: 30, max: 100, step: 5, init: 100 }, { label: 'Format (1 = JPEG, 2 = WebP, 3 = AVIF)', min: 1, max: 3, step: 1, init: 1 }],
    calc: ([w, q, f]) => { const ko = Math.round(1400 * Math.pow(w / 2400, 2) * Math.pow(q / 100, 1.5) * [1, 0.7, 0.5][f - 1] * 2.25); const ok = ko <= 150 && q >= 60 && w >= 800; return { ok, display: `Poids : **${ko} Ko** (largeur ${w} px, qualité ${q} %, ${['JPEG', 'WebP', 'AVIF'][f - 1]})`, msg: w < 800 ? 'Image trop petite : elle sera floue.' : q < 60 ? 'Qualité trop basse : artefacts visibles.' : 'Encore trop lourde.' }; },
    hints: ['Envoie l’image à sa taille d’affichage (règle n°47).', 'WebP et AVIF compressent 30 à 50 % mieux que le JPEG (règle n°48).'],
    explain: 'Les images représentent souvent la plus grosse part du poids d’une page. Redimensionner, compresser et utiliser un format moderne permet de passer de 1 400 Ko à quelques dizaines de Ko.' },
  design_rules: { type: 'qcm', title: 'Atelier 2b — Les règles de la Green UX', region: 'forge', icon: '🎨', inv: ['M3-17', 'M3-18', 'M3-19'],
    onWin: ['step:main_forge:4', 'codex:green_ux', 'codex:images'],
    questions: [
      { q: 'Pourquoi concevoir « mobile first » ?', options: ['Le petit écran force à prioriser l’essentiel ; « display:none » n’empêche pas le téléchargement', 'Parce que les ordinateurs vont disparaître', 'Pour ajouter plus d’animations'], a: 0, explain: 'Règle n°04 : amélioration progressive plutôt que dégradation gracieuse.' },
      { q: 'Les carrousels…', options: ['Sont très peu cliqués au-delà de la première image, mais chargent plusieurs images lourdes', 'Sont indispensables', 'Ne pèsent rien'], a: 0, explain: 'Règle n°10 : moins de 1 % des clics au-delà de la première image selon une étude souvent citée.' },
      { q: 'Polices système plutôt que polices téléchargées : pourquoi ?', options: ['Elles ne pèsent rien (au lieu de 100 à 300 Ko par famille)', 'Elles sont plus jolies', 'Elles sont obligatoires'], a: 0, explain: 'Règle n°32. Ce jeu n’utilise que des polices système !' },
      { q: 'Le mode sombre économise de l’énergie…', options: ['Surtout sur les écrans OLED, où un pixel noir est éteint', 'Sur tous les écrans de la même façon', 'Jamais'], a: 0, explain: 'Jusqu’à ~40 % d’énergie d’écran en moins sur OLED à forte luminosité (Google, 2018). Pas d’effet sur les écrans LCD.' },
      { q: 'Wikipédia, l’un des sites les plus visités au monde, pèse environ…', options: ['Quelques centaines de Ko par page', 'Plusieurs dizaines de Mo par page', '5 Ko par page'], a: 0, explain: 'La preuve qu’un design sobre et centré sur le contenu n’empêche pas le succès.' },
    ] },
  dev_quiz: { type: 'qcm', title: 'Atelier 3 — Le code comme filtre énergétique', region: 'forge', icon: '💻', inv: ['M3-20', 'M3-21', 'M3-22', 'M3-23'],
    onWin: ['step:main_forge:5', 'codex:regles_dev', 'codex:frameworks'],
    questions: [
      { q: 'Dans l’étude SLE 2017 (27 langages), quel langage était le plus économe en énergie ?', options: ['C', 'Python', 'JavaScript', 'Perl'], a: 0, explain: 'C = 1,00 ; Rust 1,03 ; C++ 1,34 ; JavaScript 4,45 ; Python ≈ 76 ; Perl ≈ 80 (énergie relative).' },
      { q: 'Python consommait environ combien de fois plus d’énergie que C dans cette étude ?', options: ['≈ 75 fois', '≈ 2 fois', 'Autant'], a: 0, explain: 'Mais les contraintes métier imposent souvent d’autres langages : l’essentiel est d’écrire du code efficace, quel que soit le langage.' },
      { q: 'Quelle pratique est à proscrire ?', options: ['Faire des requêtes SQL dans une boucle', 'Mettre en cache les résultats fréquents', 'Paginer les résultats'], a: 0, explain: 'Règle n°64.' },
      { q: 'Quel type de framework limite le JavaScript envoyé au navigateur ?', options: ['Les frameworks légers ou orientés statique (Astro, Svelte…)', 'Les gros frameworks applicatifs chargés en entier', 'Aucun'], a: 0, explain: 'Ordres de grandeur de l’ancien cours : ~50 Ko contre ~200 Ko.' },
      { q: 'L’impact d’un code optimisé est…', options: ['Multiplié par le nombre de visiteurs', 'Négligeable', 'Seulement côté serveur'], a: 0, explain: 'Serveurs ET terminaux de tous les utilisateurs.' },
    ] },
  host_quiz: { type: 'qcm', title: 'Atelier 4 — Déployer durable', region: 'forge', icon: '☁', inv: ['M3-25', 'M3-26'],
    onWin: ['step:main_forge:6'],
    questions: [
      { q: 'Quel outil permet de vérifier si un site est hébergé sur des serveurs alimentés par une énergie verte ?', options: ['Le Green Web Check de la Green Web Foundation', 'Un antivirus', 'Le PUE du navigateur'], a: 0, explain: 'L’ancien cours simulait ce test au hasard : utilise le vrai outil !' },
      { q: 'À quoi sert un CDN ?', options: ['Rapprocher les contenus des utilisateurs pour réduire la latence et les transferts longs', 'Stocker les mots de passe', 'Compresser les vidéos en 4K'], a: 0, explain: 'Règle n°69.' },
      { q: 'Quand un site n’est plus utile, il faut…', options: ['Le décommissionner proprement', 'Le laisser en ligne au cas où', 'Le dupliquer'], a: 0, explain: 'Pas de site zombie !' },
    ] },
  valeur_match: { type: 'match', title: 'Les cinq leviers de valeur', region: 'forge', main: false, icon: '💎', inv: ['M3-03', 'M3-04'],
    intro: 'Associe chaque argument au levier de valeur correspondant.',
    cats: ['Réduction des coûts', 'Conformité réglementaire', 'Image et différenciation', 'Éthique des données', 'Impact environnemental mesurable'],
    items: [
      { t: 'Moins de code = moins de serveurs, de bande passante et de maintenance (souvent 20 à 40 % d’économies sur des coûts IT récurrents, selon l’ancien cours)', cat: 0 },
      { t: 'Anticiper AGEC, REEN, la CSRD et la taxonomie européenne', cat: 1 },
      { t: 'Une majorité de consommateurs disent privilégier les marques engagées ; les jeunes diplômés aussi', cat: 2 },
      { t: 'Collecte minimale de données (privacy by design), RGPD facilité, surface d’attaque réduite', cat: 3 },
      { t: 'Moins d’émissions (scope 3), de minerais, d’eau et de déchets électroniques', cat: 4 },
    ],
    onWin: ['done:qs_valeur', 'codex:interets'],
    explain: 'Pour un comité de direction, l’éco-conception est aussi un levier **économique**, **juridique**, **marketing** et **de confiance**.' },
  niveaux_match: { type: 'match', title: 'Les 4 niveaux de maturité', region: 'forge', main: false, icon: '🪜', inv: ['M3-07', 'M3-08', 'M3-09', 'M3-10', 'M3-11'],
    cats: ['Niveau 1 — Optimisation technique', 'Niveau 2 — Architecture et technologie', 'Niveau 3 — Innovation fonctionnelle', 'Niveau 4 — Rupture (low-tech)'],
    items: [
      { t: 'Minifier le CSS/JS, compresser les images, mettre en cache', cat: 0 },
      { t: 'IBM Suisse réécrit un algorithme : traitement de 33 h → 20 min, énergie ÷ 100', cat: 1 },
      { t: 'Decathlon optimise une requête SQL (12 s → 5 s) et renonce à construire un data center', cat: 1 },
      { t: 'mPedigree : vérifier un médicament par SMS gratuit, sans smartphone ni Internet', cat: 2 },
      { t: 'KDOG : des chiens détectent le cancer du sein à l’odeur, sans serveur', cat: 3 },
    ],
    onWin: ['done:qs_niveaux', 'codex:quatre_niveaux', 'codex:kdog'],
    explain: 'Niveau 1 : gains rapides (10 à 30 % sur l’usage). Niveau 2 : investir dans l’intelligence algorithmique plutôt que dans le matériel. Niveau 3 : questionner le besoin. Niveau 4 : parfois, ne pas utiliser de numérique du tout.' },
  apollo_qcm: { type: 'qcm', title: 'L’obésité logicielle', region: 'forge', main: false, icon: '🚀', inv: ['M2-48', 'M2-49', 'M2-50', 'M2-51', 'M2-52', 'M2-53'],
    onWin: ['done:qs_apollo', 'codex:obesiciel', 'codex:apollo'],
    questions: [
      { q: 'Windows 10 + Office 2019 demandent environ combien de fois plus de RAM que Windows 98 + Office 97, pour des usages comparables (GreenIT.fr) ?', options: ['≈ 171 fois', '≈ 2 fois', 'Autant'], a: 0, explain: 'De 32 Mo à 5,5 Go.' },
      { q: 'La page de réservation d’une grande compagnie ferroviaire pesait 3 Ko en 1999. Aujourd’hui ?', options: ['Plusieurs Mo (≈ 3,8 Mo dans l’exemple du cours)', '3 Ko', '1 Ko'], a: 0, explain: '×1 267 pour la même fonction : réserver un billet.' },
      { q: 'Quelle est la conséquence principale de l’« obésiciel » ?', options: ['On change d’appareil parce qu’il rame, pas parce qu’il est cassé', 'Les écrans s’usent', 'Rien'], a: 0, explain: 'Obsolescence matérielle forcée, plus d’électricité, exclusion numérique des vieux appareils.' },
      { q: 'Combien pèse une page web médiane aujourd’hui (HTTP Archive) ?', options: ['Environ 2 à 2,5 Mo', 'Environ 25 Ko', 'Environ 250 Mo'], a: 0, explain: 'Le poids médian a environ doublé en 10 ans.' },
    ] },
  cms_qcm: { type: 'qcm', title: 'Le CMS sobre', region: 'forge', main: false, icon: '🧰', inv: ['M3-23'],
    onWin: ['done:qs_cms', 'codex:frameworks'],
    questions: [
      { q: 'WordPress équipe environ…', options: ['Plus de 40 % de tous les sites web (et ~60 % des sites utilisant un CMS)', '1 % des sites', 'Aucun site'], a: 0, explain: 'W3Techs ; l’ancien cours citait 64,1 % du marché des CMS.' },
      { q: 'Quelle alternative sobre l’ancien cours citait-il ?', options: ['Translucide, un CMS français écoconçu et open source', 'Un CMS en 4K', 'Un tableur'], a: 0, explain: 'Basé sur des standards HTML/CSS/PHP, ~50 Ko contre ~500 Ko (ordres de grandeur du cours). Les générateurs de sites statiques sont une autre option.' },
    ] },
  atelier_3u: { type: 'budget', title: 'Salle 1 — Le filtre des Bâtisseurs', region: 'forge', icon: '🧱', inv: ['M3-15', 'M3-14'],
    intro: 'Le site de la mairie doit être refait. Sélectionne **uniquement** les fonctionnalités qui passent le filtre 3U (Utile, Utilisée, Utilisable) et répondent aux besoins des habitants.',
    cards: [
      { t: 'Horaires et contacts des services', desc: 'Consulté par 80 % des visiteurs' },
      { t: 'Démarches en ligne accessibles', desc: 'Obligation légale, très utilisée' },
      { t: 'Agenda des événements', desc: 'Consulté chaque semaine' },
      { t: 'Animation 3D du logo', desc: '0 clic mesuré' },
      { t: 'Fil Twitter intégré', desc: 'Scripts tiers, traqueurs' },
      { t: 'Version imprimable des démarches', desc: 'Demandée par les seniors' },
      { t: 'Moteur de recherche interne', desc: 'Le site compte 3 000 pages' },
      { t: 'Musique d’ambiance', desc: 'Lecture automatique' },
    ],
    rule: s => { const good = [0, 1, 2, 5, 6], bad = [3, 4, 7]; const g = good.filter(i => s.includes(i)).length, b = bad.filter(i => s.includes(i)).length; return { ok: g === good.length && b === 0, display: `Fonctionnalités utiles retenues : **${g} / ${good.length}**${b ? ` · ⚠ ${b} superflue(s)` : ''}`, msg: b ? 'Une fonctionnalité superflue est restée.' : 'Il manque une fonctionnalité utile.' }; },
    hints: ['Sur un petit site, un moteur de recherche est superflu… mais avec 3 000 pages ?'],
    explain: 'La grille 3U s’applique au **contexte** : la même fonctionnalité peut être utile ici et superflue ailleurs (ex. un moteur de recherche sur un site de 5 pages).' },
  atelier_budget: { type: 'budget', title: 'Salle 2 — La page de 100 Ko', region: 'forge', icon: '⚖', inv: ['M2-58', 'M3-17', 'M3-21'], unit: 'Ko',
    intro: 'Construis la page d’accueil de la mairie en **moins de 100 Ko**. Il faut : du **contenu**, une **image d’accroche**, un **plan d’accès** et un **formulaire de contact**.',
    cards: [
      { t: 'HTML/CSS minimal et sémantique', cost: 18, init: 1 }, { t: 'Photo d’accroche JPEG d’origine', cost: 1400 }, { t: 'Photo d’accroche AVIF redimensionnée', cost: 38 },
      { t: 'Carte interactive (bibliothèque JS)', cost: 900 }, { t: 'Plan d’accès en image statique + adresse en texte', cost: 25 },
      { t: 'Formulaire de contact simple', cost: 6 }, { t: 'Police téléchargée', cost: 120 }, { t: 'Framework JavaScript complet', cost: 220 }, { t: 'Script de mesure d’audience respectueux (léger)', cost: 3 },
    ],
    rule: s => { const c = [18, 1400, 38, 900, 25, 6, 120, 220, 3]; const tot = s.reduce((a, i) => a + c[i], 0); const need = { contenu: s.includes(0), image: s.includes(1) || s.includes(2), plan: s.includes(3) || s.includes(4), form: s.includes(5) };
      const disp = `Poids : **${tot} Ko** / 100 Ko · Contenu ${need.contenu ? '✔' : '✗'} · Image ${need.image ? '✔' : '✗'} · Plan ${need.plan ? '✔' : '✗'} · Formulaire ${need.form ? '✔' : '✗'}`;
      if (!Object.values(need).every(Boolean)) return { ok: false, display: disp, msg: 'Il manque un élément indispensable.' };
      return tot <= 100 ? { ok: true, display: disp } : { ok: false, display: disp, msg: 'Trop lourd !' }; },
    explain: 'Une page complète et utile sous 100 Ko : c’est le poids d’une page des années 2000… avec l’ergonomie d’aujourd’hui.' },
  atelier_quiz: { type: 'qcm', title: 'Salle 3 — L’épreuve du Bâtisseur', region: 'forge', icon: '🏗', inv: ['M3-07', 'M3-02', 'M2-79'],
    questions: [
      { q: 'Quel niveau de maturité consiste à questionner le besoin lui-même ?', options: ['Niveau 3 — Innovation fonctionnelle', 'Niveau 1 — Optimisation technique', 'Niveau 2 — Architecture'], a: 0, explain: '« Faut-il vraiment livrer à domicile, ou un point relais suffit-il ? »' },
      { q: 'Un site éco-conçu peut consommer jusqu’à…', options: ['Environ 70 % d’énergie en moins qu’un site standard aux mêmes fonctionnalités', '1 % de moins', '200 % de plus'], a: 0, explain: 'Ordre de grandeur cité par l’ancien cours.' },
      { q: 'Les 3 piliers de l’éco-conception de services numériques sont…', options: ['Sobriété, performance, accessibilité', 'Vitesse, couleur, publicité', 'Cloud, IA, 5G'], a: 0, explain: 'Un service inclusif dure plus longtemps et sert plus de monde.' },
    ] },
};

export const MURALS = {};

export const CODEX = {
  ecoconception: { region: 'forge', title: 'L’éco-conception', inv: ['M3-01', 'M2-79'], text: 'Intégrer la protection de l’environnement **dès la conception** d’un service numérique. Objectif : réduire la sollicitation des ressources matérielles sur tout le cycle de vie, pas seulement l’énergie.\n\nLa phase de conception conditionne l’essentiel de l’impact de la phase d’usage. Principes : sobriété fonctionnelle, performance dès la conception, design system léger, images optimisées (WebP, chargement différé, compression). Un site éco-conçu peut consommer jusqu’à 70 % d’énergie en moins.', source: 'Ancien cours ; vidéo « Qu’est-ce que l’éco-conception ? ».' },
  trois_piliers: { region: 'forge', title: 'Les trois piliers', inv: ['M3-02'], text: '**Sobriété** : éliminer les fonctionnalités superflues. **Performance** : optimiser le code et les contenus. **Accessibilité** : un service inclusif et durable.\n\nEn agissant en conception, on réduit le poids des données (transport), la charge CPU (usage) et l’obsolescence (matériel). « La meilleure énergie est celle qu’on ne consomme pas. »', source: 'Ancien cours.' },
  roadmap: { region: 'forge', title: 'La feuille de route', inv: ['M3-12'], text: 'Le **pourquoi** (l’urgence), le **quoi** (l’ACV, les niveaux de maturité), puis le **comment** : 1. Spécifications · 2. UX/UI design · 3. Développement (front et back) · 4. Hébergement. Pour chaque phase, des bonnes pratiques tirées des 115 du référentiel GreenIT.', source: 'Ancien cours.' },
  interets: { region: 'forge', title: 'Pourquoi éco-concevoir ?', inv: ['M3-03', 'M3-04'], text: '1. **Réduction des coûts** (moins de serveurs, de bande passante, de maintenance ; l’ancien cours avançait 20 à 40 % d’économies).\n2. **Conformité** anticipée (AGEC, REEN, CSRD, taxonomie européenne).\n3. **Image et différenciation** (l’ancien cours citait « 97 % des Français privilégient les marques durables », GfK 2024 : chiffre déclaratif à manier avec prudence) ; attractivité pour les talents.\n4. **Éthique des données** : collecte minimale, RGPD facilité, moins de surface d’attaque.\n5. **Impact environnemental** mesurable (scope 3, SBTi, reporting CSRD).\n\nFinancements : subventions (ADEME, régions), crédit d’impôt recherche, investisseurs ESG, bonus dans les marchés publics.', source: 'Ancien cours.' },
  referentiels: { region: 'forge', title: 'Les référentiels', inv: ['M3-05'], text: '• **Collectif Numérique Responsable / GreenIT.fr** : 115 bonnes pratiques d’écoconception web.\n• **Designers Éthiques** : éthique et sobriété du design.\n• **AFNOR SPEC 2201** (2022) : démarche d’écoconception des services numériques.\n• **RGESN** (2024, Arcep/Arcom/ADEME) : 78 critères, prévu par la loi REEN ; base de déclarations d’écoconception.\n• Pour l’IA : **AFNOR SPEC 2314** (IA frugale, 2024).\n\n*L’ancien cours mentionnait un « décret n° 2024-623 » : référence non vérifiée, retirée.*', source: 'Arcep (17 mai 2024) ; sites des organismes.' },
  quatre_niveaux: { region: 'forge', title: 'Les 4 niveaux de maturité', inv: ['M3-07', 'M3-08', 'M3-09', 'M3-10'], text: '**1. Optimisation technique** (« éco-conduite ») : minification, images, cache, CDN, moins d’appels API. Gains rapides, 10 à 30 % sur l’usage.\n**2. Architecture et technologie** (« changer de véhicule ») : IBM Suisse, 9 To/jour, 33 h → 20 min et 70 000 → 700 kWh en réécrivant un algorithme ; Decathlon, requête de 12 s → 5 s, 2 M€/an économisés et data center annulé.\n**3. Innovation fonctionnelle** (« point relais plutôt que livraison ») : mPedigree, vérification de médicaments par SMS en Afrique (l’ancien cours parlait de 30 % de médicaments contrefaits ; l’OMS estime plutôt ~10 % de produits falsifiés ou de qualité inférieure dans les pays à revenu faible et intermédiaire).\n**4. Rupture radicale / low-tech** : KDOG.', source: 'Ancien cours ; OMS (2017).' },
  kdog: { region: 'forge', title: 'KDOG vs IA', inv: ['M3-11'], text: 'Projet de l’**Institut Curie** : des chiens malinois entraînés à détecter le cancer du sein à l’odeur (composés organiques volatils sur des lingettes). Étude pilote : 100 % de détection lors d’un premier essai, ~90 % lors d’un second, sur de **petits effectifs**. L’ancien cours comparait à une IA de Google (~89 %) : la comparaison est frappante mais pas scientifique (protocoles différents).\n\nMessage : l’intelligence biologique peut être pertinente ; parfois, la solution optimale n’est pas numérique. Limite : le niveau 4 n’est pas applicable partout.', source: 'Institut Curie, projet KDOG (2017-2019) ; ancien cours.' },
  specifications: { region: 'forge', title: 'Spécifications éco-responsables', inv: ['M3-13', 'M3-14', 'M3-15'], text: '**Effet de levier temporel** : plus on intervient tôt, plus l’impact est fort ; corriger en production coûte bien plus cher.\n**3 règles** : ne pas retenir les fonctionnalités non essentielles ; quantifier précisément le besoin (charge, volumétrie, SLA) ; supprimer les fonctions développées mais non utilisées.\n**Grille 3U** : Utile, Utilisée, Utilisable — en revue de priorisation avant chaque sprint.\n**Checklist** : le numérique est-il nécessaire ? Existe-t-il une alternative low-tech ? Que se passerait-il sans cette fonctionnalité ? Peut-on faire plus simple ? Sera-t-elle utilisée par plus de 50 % des utilisateurs au moins une fois par mois ? Le gain justifie-t-il le coût ?\n\nChiffres souvent cités : 45 % des fonctionnalités jamais utilisées (Standish Group, 2002 — étude ancienne et contestée ; la vidéo du cours parle de 80 % rarement utilisées).', source: 'Designers Éthiques, *Guide d’écoconception* ; RGESN ; ancien cours.' },
  images: { region: 'forge', title: 'Le fardeau des images', inv: ['M3-16', 'M3-17'], text: 'Les images représentent une grande part du poids des pages (44 % en 2022 selon l’ancien cours, HTTP Archive). Une image de 1,4 Mo non optimisée = des dizaines de pages de texte.\nRègles : n°47 envoyer l’image à sa taille d’affichage (srcset/sizes) ; n°48 formats WebP/AVIF (−30 à 50 %) ; n°69 CDN. Compression (ex. 1 400 → 72 Ko avec TinyPNG/ShortPixel).', source: 'HTTP Archive ; 115 bonnes pratiques (numérotation de l’ancien cours).' },
  green_ux: { region: 'forge', title: 'La Green UX', inv: ['M3-18', 'M3-19', 'M3-17'], text: 'Le design fige la consommation future. Chaque élément visuel = requête HTTP + DOM + pixels + octets.\n**Yahoo** (années 2000) : surcharge, pages lourdes. **Google** : une fonction essentielle, DOM léger. **Wikipédia** : quelques centaines de Ko, l’un des sites les plus visités. **Ecosia** : interface sobre et bénéfices reversés à la reforestation.\nRègles : n°05/06 parcours sans allers-retours ; n°04 mobile first ; n°09 animations minimales ; n°10 pas de carrousel ; n°32 polices système. Mode sombre : jusqu’à ~40 % d’énergie d’écran en moins sur OLED. Images envoyées par les utilisateurs : compression automatique côté serveur.', source: 'Ancien cours ; Google (Android Dev Summit, 2018).' },
  langages: { region: 'forge', title: 'L’énergie des langages', inv: ['M3-20'], text: 'Étude « Energy Efficiency across Programming Languages » (SLE 2017, 27 langages, 10 problèmes). Énergie relative : C 1,00 · Rust 1,03 · C++ 1,34 · JavaScript 4,45 · Python 75,88 · Perl 79,58.\nPlus un langage est « bas niveau », plus il est efficient, mais les contraintes métier imposent souvent d’autres choix : un code bien écrit compte autant que le langage.', source: 'Pereira et al., SLE 2017.' },
  regles_dev: { region: 'forge', title: 'Les 8 règles essentielles du développement', inv: ['M3-21', 'M3-22'], text: 'n°13 pagination plutôt que défilement infini · n°15 tree-shaking · n°16 cache · n°18 pages statiques · n°21 limiter les appels API · n°24 connexion à la base seulement si nécessaire · n°64 jamais de SQL dans une boucle · n°77 minifier CSS/JS/HTML/SVG.\nL’ancien cours estimait qu’un site d’1 million de visites/mois économisait ~3 t CO₂e/an avec ces 8 règles (ordre de grandeur non sourcé).\nRéférence : les 115 bonnes pratiques du Collectif Numérique Responsable.', source: 'GreenIT.fr / CNumR.' },
  frameworks: { region: 'forge', title: 'Frameworks et CMS', inv: ['M3-23'], text: 'Le choix du framework conditionne le JavaScript envoyé au client : Astro, Svelte… (~50 Ko) contre de gros frameworks applicatifs (~200 Ko), ordres de grandeur de l’ancien cours.\nWordPress équipe plus de 40 % des sites web (W3Techs) : parfois « une tronçonneuse pour couper une brindille ». Alternative citée : **Translucide**, CMS français écoconçu et open source (~50 Ko contre ~500 Ko). Outils : EcoIndex, Website Carbon, HTTP Archive.', source: 'W3Techs ; ancien cours.' },
  obesiciel: { region: 'forge', title: 'L’obésiciel', inv: ['M2-48', 'M2-50', 'M2-51', 'M2-52', 'M2-53'], text: 'On ne change plus d’appareil parce qu’il est en panne, mais parce qu’il ne supporte plus le poids des logiciels. Windows 10 + Office 2019 demandent ~171 fois plus de RAM que Windows 98 + Office 97 (32 Mo → 5,5 Go). Page de réservation d’une compagnie ferroviaire : 3 Ko (1999) → 3,8 Mo. Page web moyenne : ~2 Mo (2022), application mobile : ~50 Mo.\nConséquences : obsolescence forcée, électricité, lenteur, exclusion numérique.', source: 'GreenIT.fr ; HTTP Archive ; ancien cours.' },
  apollo: { region: 'forge', title: 'Apollo 11', inv: ['M2-49'], text: 'L’ordinateur de guidage d’Apollo (1969) disposait d’environ 72 Ko de mémoire morte et 4 Ko de mémoire vive (l’ancien cours arrondissait à « 64 Ko »). Avec ça : 384 400 km et trois astronautes. Code source : github.com/chrislgarry/Apollo-11.', source: 'NASA ; dépôt GitHub du code source.' },
  eco_slash: { region: 'forge', title: 'Eco-Slash', inv: ['M3-06'], text: 'Bonnes pratiques : code optimisé, serveur vert, sobriété des données, cache, design épuré. Pièges : obsolescence programmée, fonctions inutiles, requêtes lourdes, vidéo en lecture automatique.', source: 'Ancien cours (jeu « Eco-Slash »).' },
  golem: { region: 'forge', title: 'L’opération dégraissage', inv: ['M2-58'], text: 'Un site de 3 800 Ko ramené sous 100 Ko : publicités et traqueurs (−1 200 Ko), vidéo automatique (−1 000), images (−800), JavaScript (−500), polices (−250), boutons « like » (−47).', source: 'Ancien cours (jeu « Running »).' },
};

export const STATEMENTS = [
  { id: 'f_beau', r: 'forge', v: false, t: 'Un site éco-conçu est forcément moche.', x: 'Sobriété ≠ laideur : Wikipédia, des sites de presse sobres… La simplicité sert aussi l’ergonomie.', inv: ['M3-18'] },
  { id: 'f_fin', r: 'forge', v: false, t: 'L’éco-conception, ça se fait à la fin, en optimisant.', x: 'Plus on intervient tôt (besoin, conception), plus l’effet de levier est fort.', inv: ['M3-13'] },
  { id: 'f_carrousel', r: 'forge', v: false, t: 'Les carrousels sont très cliqués.', x: 'Moins de 1 % des clics au-delà de la première image selon une étude souvent citée.', inv: ['M3-17'] },
  { id: 'f_dark', r: 'forge', v: false, t: 'Le mode sombre économise de l’énergie sur tous les écrans.', x: 'Surtout sur les OLED ; pas sur les écrans LCD rétroéclairés.', inv: ['M3-19'] },
  { id: 'f_python', r: 'forge', v: true, t: 'Dans l’étude SLE 2017, C était le langage le plus économe en énergie.', x: 'Exact, suivi de Rust et C++.', inv: ['M3-20'] },
  { id: 'f_polices', r: 'forge', v: true, t: 'Les polices système ne demandent aucun téléchargement.', x: 'Exact (règle n°32).', inv: ['M3-17'] },
  { id: 'f_pagination', r: 'forge', v: true, t: 'La pagination évite de construire des DOM gigantesques.', x: 'Exact (règle n°13).', inv: ['M3-21'] },
  { id: 'f_sql', r: 'forge', v: false, t: 'Faire une requête SQL par élément dans une boucle, c’est plus propre.', x: 'C’est le problème « N+1 » : à proscrire (règle n°64).', inv: ['M3-21'] },
];

export const COMBAT = [
  { id: 'c_3u', r: 'forge', q: 'Que signifient les 3U ?', options: ['Utile, Utilisée, Utilisable', 'Unique, Universel, Urgent', 'Usage, Usure, Usine', 'UX, UI, URL'], a: 0, explain: 'La grille de filtrage fonctionnel.' },
  { id: 'c_avif', r: 'forge', q: 'Quel format d’image est le plus léger à qualité égale ?', options: ['AVIF', 'BMP', 'PNG', 'TIFF'], a: 0, explain: 'AVIF ou WebP.' },
  { id: 'c_niveau4', r: 'forge', q: 'Le niveau 4 de l’éco-conception, c’est…', options: ['La rupture low-tech (parfois sans numérique)', 'La minification', 'Changer de framework', 'Ajouter de l’IA'], a: 0, explain: 'Ex. : KDOG.' },
  { id: 'c_tree', r: 'forge', q: 'Le tree-shaking sert à…', options: ['Supprimer le code inutilisé des bibliothèques', 'Planter des arbres', 'Secouer le DOM', 'Compresser les images'], a: 0, explain: 'Règle n°15.' },
];

export const ON_ENTER = { forge: ['flag:visite_forge', 'quest:main_forge'] };
export const ON_SEED = { forge: ['done:main_forge', 'title:Expert·e', 'toast:Le **Plan du Bâtisseur** ouvre la route du **Sanctuaire de la Mesure**, au nord. L’Omnium t’y attend… avec 8 graines.'] };
export const ON_EVENT = {
  golem: ['step:main_forge:8', 'codex:golem'],
  ecoslash: ['quest:qs_arcade', 'done:qs_arcade', 'codex:eco_slash'],
};
