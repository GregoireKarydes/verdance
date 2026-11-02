// =============================================================
// Région 7 — Décharge de Ferraille (fin de vie, e-déchets, lois)
// =============================================================
import { look } from './r_village.js';

export const NPCS = {
  durabilis: { id: 'durabilis', name: 'Juge Durabilis', look: look('#1a1a2a', '#e0e0e0', { hairStyle: 2, robe: '#2a1a3a', glasses: true }), inv: ['M2-06', 'M2-67'],
    talk: [
      { if: '!flag:durabilis_1', mark: 'quest', say: ['Silence ! Ici se tient le tribunal de la Décharge. Regarde autour de toi : en 2022, le monde a produit **62 millions de tonnes** de déchets électroniques. Seuls **22 %** ont été collectés et recyclés de façon documentée.', 'À ce rythme, on atteindra **82 millions de tonnes** en 2030. Les déchets électroniques augmentent cinq fois plus vite que leur recyclage.', 'Un accusé attend son procès : **Maître Obsolète**, qui défend l’obsolescence. Écoute-le d’abord.'], act: ['flag:durabilis_1', 'step:main_decharge:1', 'codex:ewaste'] },
      { if: 'step:main_decharge==1', say: ['Maître Obsolète est juste là, à ma droite. Écoute ses arguments.'] },
      { if: 'step:main_decharge==2', say: ['Recueille trois témoignages : la réparatrice **Fixie**, le ferrailleur **Ewan** et **Fairphonia**.'] },
      { if: 'step:main_decharge==3', mark: 'quest', say: ['Trois témoignages… le dossier est solide. Le procès peut commencer. Entre dans le tribunal, au nord.'], act: ['flag:proces_ouvert', 'step:main_decharge:4'] },
      { if: 'step:main_decharge==4', say: ['Le tribunal t’attend, au nord.'] },
      { if: 'step:main_decharge==5', mark: 'quest', say: ['Le verdict est tombé. Une dernière question avant de clore l’audience, futur·e professionnel·le du numérique.'], act: ['open:q9_lois'] },
      { say: ['La loi est le seul pare-feu durable contre l’obsolescence. Le marché seul ne s’autorégule jamais vers la sobriété.'] },
    ] },
  obsolete: { id: 'obsolete', name: 'Maître Obsolète', look: look('#3a3a3a', '#1a1a1a', { hairStyle: 1, hat: 'wizard', hatColor: '#1a1a1a' }), inv: ['M2-67'],
    talk: [
      { if: 'step:main_decharge==1', mark: 'quest', say: ['Ah, Gardien·ne. Laissez-moi vous expliquer : un appareil qui dure, c’est un client qui ne revient pas !', 'Batteries collées, vis spéciales, mises à jour qui ralentissent les vieux modèles, pièces introuvables… Ce n’est pas de la malveillance, c’est du **business** !', 'Et puis, sans règles, qui m’en empêchera ? Hu hu hu.'], act: ['step:main_decharge:2'] },
      { if: '!seed:decharge', say: ['Vous ne prouverez rien. Hu hu hu.'] },
      { say: ['… Bon. Je me reconvertis dans la réparation. Il paraît que c’est un métier d’avenir.'] },
    ] },
  fixie2: { id: 'fixie2', name: 'Fixie (Repair Café)', look: look('#3a8a6a', '#6a3a8a', { hairStyle: 2, apron: '#2a2a2a', glasses: true }), inv: ['M2-59'],
    talk: [
      { if: 'step:main_decharge==2&!flag:temoin_fixie', mark: 'quest', say: ['Mon témoignage ? Depuis la **loi AGEC** (2020), les appareils affichaient un **indice de réparabilité** de 1 à 10. Depuis 2025, il devient un **indice de durabilité** pour certains produits, et l’Europe impose une étiquette avec une note de réparabilité sur les smartphones.', 'Et depuis juin 2025, les fabricants de smartphones doivent fournir des **pièces détachées pendant 7 ans** et des mises à jour pendant au moins 5 ans. Ça change tout !'], act: ['flag:temoin_fixie', 'codex:loi_agec', 'script:temoins_check'] },
      { ask: { q: 'Bienvenue au Repair Café !', options: [{ t: 'Réparer mon bâton', act: ['repair'] }, { t: 'Rien, merci', say: ['À bientôt !'] }] } },
    ] },
  ewan: { id: 'ewan', name: 'Ewan le ferrailleur', look: look('#6a4a2a', '#3a2a1a', { beard: '#3a2a1a', hat: 'cap', hatColor: '#c8603a' }), inv: ['M2-06'],
    talk: [
      { if: 'step:main_decharge==2&!flag:temoin_ewan', mark: 'quest', say: ['Mon témoignage ? La plupart de ces appareils fonctionnaient encore, ou auraient pu être réparés. Et les rares métaux qu’ils contiennent sont presque impossibles à récupérer : à peine **1 %** des besoins en terres rares sont couverts par le recyclage.'], act: ['flag:temoin_ewan', 'script:temoins_check'] },
      { if: '!quest:qs_tri', mark: 'quest', say: ['Tu veux m’aider à trier ? Chaque objet a sa filière !'], act: ['quest:qs_tri', 'puzzle:tri_ewaste'] },
      { if: '!done:qs_tri', mark: 'quest', say: ['On reprend le tri ?'], act: ['puzzle:tri_ewaste'] },
      { say: ['Le meilleur déchet, c’est celui qu’on ne produit pas.'] },
    ] },
  fairphonia: { id: 'fairphonia', name: 'Fairphonia', look: look('#4a8a3a', '#2a1a10', { hairStyle: 2, hat: 'band', hatColor: '#4fbf4a' }), inv: ['M2-83'],
    talk: [
      { if: 'step:main_decharge==2&!flag:temoin_fair', mark: 'quest', say: ['Mon témoignage ? Des fabricants prouvent qu’on peut faire autrement : téléphones **modulaires**, réparables avec un simple tournevis, pièces vendues en ligne, mises à jour pendant des années. Ce n’est pas une utopie, c’est un choix de conception.'], act: ['flag:temoin_fair', 'codex:modulaire', 'script:temoins_check'] },
      { if: '!quest:qs_fairphone', mark: 'quest', say: ['Tu veux voir comment on répare un téléphone modulaire ?'], act: ['quest:qs_fairphone', 'puzzle:fairphone_order'] },
      { if: '!done:qs_fairphone', mark: 'quest', say: ['On recommence la réparation ?'], act: ['puzzle:fairphone_order'] },
      { say: ['Un appareil réparable, c’est un appareil qui dure.'] },
    ] },
  barometre: { id: 'barometre', name: 'Barométrine', look: look('#3a6aaa', '#c8a050', { hairStyle: 1, glasses: true }), inv: ['M2-77', 'M2-78'],
    talk: [
      { if: '!quest:qs_barometre', mark: 'quest', say: ['Je publie des **baromètres de durabilité** : quelles marques se réparent bien, lesquelles durent… Tu veux tester tes connaissances ?'], act: ['quest:qs_barometre', 'puzzle:barometre_qcm'] },
      { if: '!done:qs_barometre', mark: 'quest', say: ['On reprend ?'], act: ['puzzle:barometre_qcm'] },
      { say: ['Avant d’acheter : indice de durabilité, disponibilité des pièces, durée des mises à jour. Et pourquoi pas le reconditionné ?'] },
    ] },
  maire: { id: 'maire', name: 'Maire Citadin', look: look('#2a3a6a', '#5a5a5a', { hairStyle: 3, hat: 'crown' }), inv: ['M2-61'],
    talk: [
      { if: '!quest:qs_maire', mark: 'quest', say: ['Ma ville compte plus de **50 000 habitants**. On me dit que la **loi REEN** m’oblige à quelque chose… Tu peux m’aider à y voir clair ?'], act: ['quest:qs_maire', 'puzzle:maire_choice'] },
      { if: '!done:qs_maire', mark: 'quest', say: ['On reprend ?'], act: ['puzzle:maire_choice'] },
      { say: ['Notre stratégie numérique responsable est publiée. Et nos écoles ont des ordinateurs reconditionnés !'] },
    ] },
};

export const SCRIPTS = {
  temoins_check: [{ if: 'flag:temoin_fixie&flag:temoin_ewan&flag:temoin_fair&step:main_decharge==2', act: ['step:main_decharge:3', 'toast:Trois témoignages recueillis. Retourne voir la **Juge Durabilis**.'] }, { act: [] }],
  'secret:epave': [{ say: [{ who: 'L’Épave de 1985', t: 'Un ordinateur de 1985, boîtier vissé, cartes enfichables, manuel technique complet scotché sur le côté. On l’allume… il démarre.' }], act: ['codex:ordinateur_1985'] }],
};

export const QUESTS = [
  { id: 'main_decharge', title: 'Le Procès de l’Obsolescence', region: 'decharge', main: true, steps: [
    { t: 'Parle à la Juge Durabilis', at: 'durabilis' }, { t: 'Écoute Maître Obsolète', at: 'obsolete' }, 'Recueille 3 témoignages : Fixie, Ewan et Fairphonia', { t: 'Retourne voir la Juge', at: 'durabilis' },
    { t: 'Le Procès de l’Obsolescence', at: 'temple_proces' }, { t: 'Réponds à la Juge', at: 'durabilis' }] },
  { id: 'qs_tri', title: '62 millions de tonnes', region: 'decharge', giver: 'ewan', steps: [{ t: 'Aide Ewan à trier les déchets', at: 'ewan' }], reward: { graines: 15 } },
  { id: 'qs_fairphone', title: 'Le téléphone modulaire', region: 'decharge', giver: 'fairphonia', steps: [{ t: 'Répare un téléphone modulaire', at: 'fairphonia' }], reward: { heart: true } },
  { id: 'qs_barometre', title: 'Le baromètre', region: 'decharge', giver: 'barometre', steps: [{ t: 'Le quiz de Barométrine', at: 'barometre' }], reward: { graines: 10 } },
  { id: 'qs_maire', title: 'Le maire de 50 000 habitants', region: 'decharge', giver: 'maire', steps: [{ t: 'Conseille le maire', at: 'maire' }], reward: { graines: 15 } },
];

export const PUZZLES = {
  proces_preuves: { type: 'match', title: 'Salle 1 — Les pièces à conviction', region: 'decharge', icon: '📁', inv: ['M2-59', 'M2-60', 'M2-61', 'M2-64', 'M2-65'],
    intro: 'Chaque pièce à conviction relève d’un texte précis. Associe-les.',
    cats: ['Loi AGEC (2020)', 'Délit d’obsolescence programmée (2015)', 'Loi REEN (2021)', 'Directive européenne USB-C', 'Règlement européen écoconception des smartphones'],
    items: [
      { t: 'Une mise à jour qui ralentit volontairement d’anciens modèles pour pousser à racheter', cat: 1 },
      { t: 'Une note de réparabilité (puis de durabilité) affichée en magasin', cat: 0 },
      { t: 'La facture de l’opérateur indique l’équivalent CO₂ des données consommées', cat: 0 },
      { t: 'Les écoles d’ingénieurs doivent former à l’écoconception des services numériques', cat: 2 },
      { t: 'Un chargeur commun pour téléphones, tablettes et (depuis 2026) ordinateurs portables', cat: 3 },
      { t: 'Pièces détachées disponibles 7 ans et batteries tenant 800 cycles', cat: 4 },
    ],
    hints: ['L’obsolescence programmée est un délit depuis la loi de transition énergétique de 2015.', 'Le règlement smartphones s’applique depuis juin 2025.'],
    onWin: ['codex:lois_europe', 'codex:loi_reen'],
    explain: 'Ensemble, ces textes forment un arsenal contre l’obsolescence et le gaspillage. Sans régulation, le marché privilégie le renouvellement rapide.' },
  proces_lois: { type: 'qcm', title: 'Salle 2 — Le code de Verdance', region: 'decharge', icon: '⚖', inv: ['M2-60', 'M2-62', 'M2-63', 'M2-65', 'M2-61'], onWin: ['codex:obsolescence'],
    questions: [
      { q: 'Quelles sanctions prévoit le délit d’obsolescence programmée en France ?', options: ['Jusqu’à 2 ans de prison et 300 000 € d’amende (ou 5 % du chiffre d’affaires)', 'Un simple avertissement', 'Aucune, ce n’est pas un délit'], a: 0, explain: 'Créé par la loi de transition énergétique de 2015, renforcé par la loi AGEC.' },
      { q: 'La directive européenne sur le « droit à la réparation » (2024/1799)…', options: ['A été adoptée en 2024 et doit être transposée par les États d’ici juillet 2026', 'Est encore en discussion', 'Impose une durée de vie de 10 ans à tous les appareils'], a: 0, explain: 'Elle facilite la réparation (obligation de réparer certains produits, plateforme européenne, garantie prolongée après réparation). *L’ancien cours la disait « en discussion » avec une durée de vie de 10 ans : c’était inexact.*' },
      { q: 'La loi « Climat et Résilience » (2021) est…', options: ['Une loi française, qui prévoit notamment un affichage environnemental de certains produits', 'Une directive européenne qui impose l’ACV complète de chaque produit', 'Un traité international'], a: 0, explain: '*L’ancien cours la présentait à tort comme un standard européen imposant l’affichage de l’ACV complète.*' },
      { q: 'Depuis la loi AGEC, les acheteurs publics doivent acquérir…', options: ['Une part de matériel informatique reconditionné ou issu du réemploi (au moins 20 %)', 'Uniquement du matériel neuf', 'Uniquement des ordinateurs fixes'], a: 0, explain: 'L’État et les collectivités montrent l’exemple.' },
    ] },
  proces_verdict: { type: 'choice', title: 'Salle 3 — Le verdict', region: 'decharge', icon: '🔨', stepLabel: 'Délibération', inv: ['M2-66'],
    nodes: [
      { who: 'Maître Obsolète', text: '« Ralentir de vieux téléphones par une mise à jour, c’est pour protéger leurs batteries ! Personne n’a jamais été condamné pour ça ! »', options: [
        { t: 'Faux : en 2020, la DGCCRF a infligé 25 millions d’euros d’amende à Apple pour ne pas avoir informé ses clients de ce ralentissement', ok: true, fb: 'Exact : la qualification retenue était la pratique commerciale trompeuse par omission. En Italie (2018), Apple et Samsung ont aussi été sanctionnés (10 et 5 M€).' },
        { t: 'Il a raison, aucune sanction n’existe', fb: 'Si : des sanctions ont été prononcées en France et en Italie.' }] },
      { who: 'Maître Obsolète', text: '« De toute façon, une batterie collée, c’est plus fin et plus joli. Le client le veut ! »', options: [
        { t: 'Le règlement européen impose désormais des batteries remplaçables et durables sur les smartphones', ok: true, fb: 'Exact : batteries de 800 cycles à 80 % de capacité, pièces détachées pendant 7 ans, depuis juin 2025.' },
        { t: 'Le design passe avant tout', fb: 'Un design qui empêche la réparation raccourcit la vie de l’appareil.' }] },
      { who: 'Juge Durabilis', text: 'Quelle peine requiers-tu contre l’obsolescence ?', options: [
        { t: 'L’interdire purement et simplement, sans rien changer d’autre', fb: 'C’est déjà un délit : la loi seule ne suffit pas sans moyens de contrôle et sans alternatives.' },
        { t: 'Appliquer la loi, mais aussi rendre la réparation facile et moins chère que le remplacement : pièces, information, indices, fonds réparation', ok: true, fb: 'La loi interdit, et l’écosystème de la réparation rend l’alternative possible.' }] },
    ] },
  tri_ewaste: { type: 'match', title: 'Le tri d’Ewan', region: 'decharge', main: false, icon: '♻', inv: ['M2-06'],
    cats: ['Réemploi ou don', 'Réparation', 'Collecte DEEE (recyclage)', 'Collecte piles et batteries'],
    items: [
      { t: 'Un ordinateur qui fonctionne mais ne sert plus', cat: 0 },
      { t: 'Un téléphone à l’écran fissuré', cat: 1 },
      { t: 'Une vieille imprimante hors d’usage', cat: 2 },
      { t: 'Une batterie lithium gonflée', cat: 3 },
      { t: 'Une tablette qui marche, oubliée dans un tiroir', cat: 0 },
      { t: 'Un câble électrique dénudé', cat: 2 },
    ],
    onWin: ['done:qs_tri', 'codex:ewaste'],
    explain: 'Réemploi et réparation d’abord ! Les batteries ne vont jamais à la poubelle : elles peuvent provoquer des incendies dans les centres de tri.' },
  fairphone_order: { type: 'order', title: 'Réparer un téléphone modulaire', region: 'decharge', main: false, icon: '🔧', inv: ['M2-83'],
    label: 'Remets les étapes de la réparation dans l’ordre :',
    items: ['Diagnostiquer la panne', 'Commander le module de rechange', 'Dévisser le dos de l’appareil', 'Remplacer le module défectueux', 'Tester l’appareil', 'Déposer l’ancien module en point de collecte'],
    onWin: ['done:qs_fairphone', 'codex:modulaire'],
    explain: 'Un appareil conçu pour être réparé (vis standard, modules, pièces disponibles, documentation) peut durer bien plus longtemps.' },
  barometre_qcm: { type: 'qcm', title: 'Le baromètre de durabilité', region: 'decharge', main: false, icon: '📈', inv: ['M2-77', 'M2-78'],
    onWin: ['done:qs_barometre', 'codex:barometre'],
    questions: [
      { q: 'Que mesure un baromètre de durabilité comme celui des distributeurs (SAV) ?', options: ['La fiabilité des produits et leur facilité de réparation, par marque', 'Leur prix', 'Leur couleur préférée'], a: 0, explain: 'Ces classements évoluent chaque année : consulte la version la plus récente.' },
      { q: 'Garder son ordinateur un an de plus, c’est…', options: ['Éviter une partie de l’impact de fabrication d’un nouvel appareil', 'Sans effet', 'Pire pour la planète'], a: 0, explain: 'L’ancien cours estimait ~156 kg CO₂e évités par développeur et par an (ordre de grandeur).' },
    ] },
  maire_choice: { type: 'choice', title: 'La loi REEN et les collectivités', region: 'decharge', main: false, icon: '🏛', inv: ['M2-61'],
    onWin: ['done:qs_maire', 'codex:loi_reen'],
    nodes: [
      { who: 'Maire', text: 'Que m’impose la loi REEN (2021) en tant que ville de plus de 50 000 habitants ?', options: [
        { t: 'Définir une stratégie numérique responsable (depuis 2025)', ok: true, fb: 'Exact : une stratégie incluant l’écoconception, la durée de vie des équipements, la sensibilisation…' },
        { t: 'Interdire Internet dans les écoles', fb: 'Non !' },
        { t: 'Rien du tout', fb: 'Si, la loi REEN fixe des obligations aux collectivités.' }] },
      { who: 'Maire', text: 'Par quoi commencer, concrètement ?', options: [
        { t: 'Acheter du reconditionné, allonger la durée de vie du parc, écoconcevoir les sites de la ville (référentiel RGESN)', ok: true, fb: 'C’est le cœur d’une stratégie numérique responsable.' },
        { t: 'Remplacer tous les ordinateurs par des modèles neufs « plus efficaces »', fb: 'Renouveler, c’est l’impact de fabrication maximal.' }] },
    ] },
};

export const CODEX = {
  ewaste: { region: 'decharge', title: 'Les déchets électroniques', inv: ['M2-06'], text: '**62 millions de tonnes** de déchets d’équipements électriques et électroniques en 2022 dans le monde (+82 % depuis 2010), soit ~7,8 kg par habitant (17,6 kg en Europe). Seuls **22,3 %** ont été collectés et recyclés de façon documentée. Projection : **82 Mt en 2030**. Le recyclage couvre à peine **1 %** de la demande en terres rares.\n\n*L’ancien cours citait 50 Mt/an.*', source: 'ONU / UNITAR / UIT, *Global E-waste Monitor 2024*.' },
  loi_agec: { region: 'decharge', title: 'La loi AGEC (2020)', inv: ['M2-59'], text: 'Loi anti-gaspillage pour une économie circulaire :\n• **Indice de réparabilité** obligatoire (2021) sur plusieurs produits électroniques, transformé en **indice de durabilité** en 2025 pour les téléviseurs et lave-linge. Pour les smartphones et tablettes, l’étiquette européenne (avec une classe de réparabilité) le remplace depuis juin 2025.\n• **Information sur la disponibilité des pièces détachées** (au moins 5 ans pour certains équipements informatiques et smartphones).\n• Les **opérateurs** informent leurs abonnés de la quantité de données consommées et de l’équivalent en émissions de GES.\n• Achats publics : une part de matériel **reconditionné** (au moins 20 % pour les équipements informatiques).\n• Renforcement des sanctions contre l’obsolescence programmée.', source: 'Loi n° 2020-105 du 10 février 2020 ; décrets d’application ; ancien cours.' },
  obsolescence: { region: 'decharge', title: 'Le délit d’obsolescence programmée', inv: ['M2-60', 'M2-66'], text: 'Créé par la loi de transition énergétique (TEPCV, 2015) : **2 ans d’emprisonnement et 300 000 € d’amende** (pouvant aller à 5 % du chiffre d’affaires). Information obligatoire sur la durée de vie et encadrement des mises à jour logicielles.\n\nSanctions célèbres : Apple, **25 M€** (France, DGCCRF, 2020, pour pratique commerciale trompeuse liée au ralentissement des iPhones) ; Apple **10 M€** et Samsung **5 M€** (Italie, 2018).\n*L’ancien cours citait aussi « Epson, 10 M€ (2017) » : il s’agissait d’une plainte de l’association HOP, aucune amende de ce montant n’est connue.*', source: 'Code de la consommation, art. L441-2 ; DGCCRF (2020) ; AGCM (2018).' },
  loi_reen: { region: 'decharge', title: 'La loi REEN (2021)', inv: ['M2-61'], text: 'Loi visant à réduire l’empreinte environnementale du numérique :\n• Formation à la **sobriété numérique** à l’école et à l’**écoconception** dans les formations d’ingénieurs.\n• Création d’un **observatoire** des impacts (Arcep, ADEME).\n• Lutte contre l’obsolescence logicielle, soutien au réemploi.\n• **Communes de plus de 50 000 habitants** : stratégie numérique responsable (depuis 2025).\n• Référentiel d’écoconception des services numériques (**RGESN**, publié en 2024 par l’Arcep et l’Arcom).', source: 'Loi n° 2021-1485 du 15 novembre 2021.' },
  lois_europe: { region: 'decharge', title: 'Les textes européens', inv: ['M2-62', 'M2-64', 'M2-65'], text: '• **Chargeur universel USB-C** (directive 2022/2380) : téléphones, tablettes, etc. depuis le 28 décembre 2024 ; ordinateurs portables depuis le 28 avril 2026.\n• **Droit à la réparation** (directive 2024/1799), adoptée en 2024, transposition d’ici juillet 2026.\n• **Écoconception des smartphones et tablettes** (règlement 2023/1670), depuis le 20 juin 2025 : batteries de 800 cycles, pièces détachées 7 ans, mises à jour au moins 5 ans, étiquette énergie avec classe de réparabilité.\n• En France, la loi **Climat et Résilience** (2021) prévoit un affichage environnemental de certains produits (et non « l’ACV complète au moment de l’achat », comme l’affirmait l’ancien cours).', source: 'Journal officiel de l’UE ; Légifrance.' },
  droit_reparation: { region: 'decharge', title: 'Réparer plutôt que remplacer', inv: ['M2-65', 'M2-67'], text: 'Les Pinces du Réparateur symbolisent le **droit à la réparation** : obligation de réparer certains produits même hors garantie, informations sur les prix, plateforme européenne de la réparation, et garantie prolongée de 12 mois quand on choisit la réparation sous garantie.', source: 'Directive (UE) 2024/1799.' },
  modulaire: { region: 'decharge', title: 'Les appareils modulaires', inv: ['M2-83'], text: 'Exemple cité par l’ancien cours : **Fairphone** (Amsterdam), téléphone modulaire réparable avec un simple tournevis (note de réparabilité de 9/10 à l’époque, 10/10 pour les modèles récents selon iFixit), pièces vendues en ligne, mises à jour pendant de nombreuses années. « Nous bousculons le secteur en changeant la façon de construire, produire et réutiliser nos appareils. »', source: 'Ancien cours ; iFixit.' },
  barometre: { region: 'decharge', title: 'Baromètres de durabilité', inv: ['M2-77', 'M2-78'], text: 'Des distributeurs publient des baromètres de fiabilité et de réparabilité par marque. L’ancien cours citait le « Baromètre SAV Fnac Darty » (2022) : Apple et HP bien classés, certains modèles récents de Dell et Lenovo moins bien. ⚠ Ces classements changent chaque année : consulte l’édition la plus récente.\n\nGarder son matériel un an de plus évite une partie de l’impact de fabrication (l’ancien cours avançait ~156 kg CO₂e par développeur et par an).', source: 'Ancien cours (2022).' },
  ordinateur_1985: { region: 'decharge', title: 'L’ordinateur de 1985', inv: ['M2-43'], text: 'Conçu comme un investissement à long terme : modulaire, composants évolutifs, documentation technique disponible, reconditionnement facile. Durée de vie : 10 à 15 ans.', source: 'Ancien cours.' },
};

export const STATEMENTS = [
  { id: 'd_recycle_tout', r: 'decharge', v: false, t: 'La majorité des déchets électroniques est recyclée.', x: 'Seulement ~22 % en 2022 de façon documentée.', inv: ['M2-06'] },
  { id: 'd_legal', r: 'decharge', v: false, t: 'L’obsolescence programmée est parfaitement légale en France.', x: 'C’est un délit depuis 2015 : 2 ans de prison et 300 000 € d’amende.', inv: ['M2-60'] },
  { id: 'd_reparer_cher', r: 'decharge', v: false, t: 'Réparer coûte toujours plus cher que racheter.', x: 'Souvent faux (batterie, écran) ; et la loi pousse à rendre la réparation plus accessible.', inv: ['M2-59'] },
  { id: 'd_62', r: 'decharge', v: true, t: 'Le monde a produit 62 millions de tonnes de déchets électroniques en 2022.', x: 'Exact (Global E-waste Monitor 2024).', inv: ['M2-06'] },
  { id: 'd_usbc', r: 'decharge', v: true, t: 'L’USB-C est le chargeur commun obligatoire dans l’Union européenne.', x: 'Exact : depuis fin 2024 pour les téléphones, 2026 pour les ordinateurs portables.', inv: ['M2-64'] },
  { id: 'd_7ans', r: 'decharge', v: true, t: 'Depuis 2025, les pièces détachées des smartphones doivent être disponibles 7 ans dans l’UE.', x: 'Exact (règlement 2023/1670).', inv: ['M2-65'] },
  { id: 'd_apple', r: 'decharge', v: true, t: 'Apple a payé 25 M€ d’amende en France en 2020 pour le ralentissement d’iPhones.', x: 'Exact (DGCCRF, pratique commerciale trompeuse).', inv: ['M2-66'] },
];

export const COMBAT = [
  { id: 'c_ewaste', r: 'decharge', q: 'Part des e-déchets collectés et recyclés de façon documentée (2022) ?', options: ['≈ 22 %', '≈ 90 %', '≈ 2 %', '≈ 60 %'], a: 0, explain: 'Global E-waste Monitor 2024.' },
  { id: 'c_reen', r: 'decharge', q: 'Quelle loi impose l’écoconception dans les formations d’ingénieurs ?', options: ['La loi REEN (2021)', 'La loi AGEC (2020)', 'L’AI Act', 'La loi Climat et Résilience'], a: 0, explain: 'Réduction de l’Empreinte Environnementale du Numérique.' },
  { id: 'c_agec', r: 'decharge', q: 'Quel indice la loi AGEC a-t-elle créé ?', options: ['L’indice de réparabilité', 'L’EcoIndex', 'Le PUE', 'L’indice de vitesse'], a: 0, explain: 'Devenu indice de durabilité pour certains produits.' },
];

export const ON_ENTER = { decharge: ['quest:main_decharge'] };
export const ON_SEED = { decharge: ['step:main_decharge:5', 'toast:Avec les **Pinces du Réparateur**, la porte de la **Forge des Bâtisseurs** (au nord) peut être réparée. Mais d’abord : la Juge veut te parler.'] };
