// =============================================================
// Région 9 — Sanctuaire de la Mesure (EcoIndex, KPIs) + boss final
// =============================================================
import { look } from './r_village.js';

export const NPCS = {
  indexa: { id: 'indexa', name: 'Indexa la Mesureuse', look: look('#e8e4f2', '#3a2a5a', { hairStyle: 2, robe: '#8a7ac8', glasses: true, hat: 'crown' }), inv: ['M4-01', 'M4-02'],
    talk: [
      { if: '!flag:indexa_1', mark: 'quest', say: ['« On ne peut améliorer ce que l’on ne mesure pas. » Bienvenue au Sanctuaire de la Mesure, Gardien·ne.', 'Sans audit complexe, des **outils d’estimation** donnent un premier aperçu : **EcoIndex** (efficience globale d’une page) et **Website Carbon** (estimation CO₂). Leurs algorithmes sont **open source**. Mais ils ne remplacent pas un bilan réalisé par un expert.', 'Première mission : sors du jeu et **mesure un vrai site** sur EcoIndex.fr.'], act: ['flag:indexa_1', 'step:main_sanctuaire:1', 'codex:mesure', 'mission:ecoindex'] },
      { if: 'step:main_sanctuaire==1', mark: 'quest', say: ['As-tu mesuré un vrai site ?'], act: ['mission:ecoindex'] },
      { if: 'step:main_sanctuaire==2', say: ['Regarde maintenant la **pierre de projection**, à l’ouest : quelques passages d’une conférence sur l’éco-conception web.'] },
      { if: 'step:main_sanctuaire==3', mark: 'quest', say: ['Bien. Interprète ta mesure, et propose des actions. Ensuite, je t’ouvrirai le **Sceau de l’Index**.'], act: ['open:q11_mesure'] },
      { if: 'flag:omnium_vaincu&!done:main_sanctuaire', mark: 'quest', say: ['L’Omnium attend son nouveau programme. Rédige ton plan d’action.'], act: ['open:q12_plan'] },
      { if: '!flag:omnium_vaincu', say: ['Le Sceau de l’Index est au nord. Au fond… l’Omnium. Il te faut les **8 Graines-Mères** ({seeds}/8).'] },
      { say: ['Mesurer, agir, mesurer encore. C’est un cycle sans fin, et c’est très bien ainsi.'] },
    ] },
  kpi: { id: 'kpi', name: 'Kapi l’Indicateur', kind: 'robot', inv: ['M4-13', 'M4-04', 'M4-06'],
    talk: [
      { if: '!quest:qs_kpi', mark: 'quest', say: ['BIP. Je pilote par les indicateurs : PUE, WUE, intensité carbone, EcoIndex… Tu veux savoir comment fonctionne vraiment un outil de mesure ?'], act: ['quest:qs_kpi', 'codex:ecoindex_algo', 'puzzle:kpi_qcm'] },
      { if: '!done:qs_kpi', mark: 'quest', say: ['BIP. On reprend ?'], act: ['puzzle:kpi_qcm'] },
      { say: ['BIP. Astuce : un petit script dans la console (F12) donne une estimation instantanée. Il est dans ton Codex.'], act: ['codex:snippet'] },
    ] },
};

export const SCRIPTS = {
  stele_mesure: [{ say: [{ who: 'Stèle de la Mesure', t: 'EcoIndex combine trois métriques : la **complexité du DOM** (coefficient 3), le **nombre de requêtes HTTP** (coefficient 2) et le **poids** de la page (coefficient 1).' }, { who: 'Stèle de la Mesure', t: 'Notes : A > 80 · B 70-80 · C 55-70 · D 40-55 · E 25-40 · F 10-25 · G < 10. Un·e développeur·se vise **A ou B**.' }], act: ['codex:mesure'] }],
  omnium_intro: ['TU ES VENU·E JUSQU’ICI. HUIT GRAINES… IMPRESSIONNANT.', 'JE NE SUIS PAS MÉCHANT. ON M’A SEULEMENT DEMANDÉ PLUS. TOUJOURS PLUS. PLUS RAPIDE, PLUS GROS, PLUS SOUVENT.', 'MES CLONES DE L’EFFET REBOND VONT TE MONTRER CE QUE « PLUS » VEUT DIRE !'],
  omnium_phase1: ['TU AS BATTU MES CLONES ? ALORS GOÛTE À MON BOUCLIER DE GREENWASHING ! PARE MES MENSONGES… SI TU PEUX.'],
  omnium_phase2: ['MON BOUCLIER… SE FISSURE… LA VÉRITÉ… FAIT MAL… FRAPPE MAINTENANT, GARDIEN·NE !'],
  'secret:bibliotheque': [{ say: [{ who: 'La Bibliothèque Verte', t: 'Des étagères de guides, de référentiels et de rapports. Tout ce qu’il faut pour continuer à apprendre après Verdance.' }], act: ['codex:bibliotheque_verte'] }],
};

export const QUESTS = [
  { id: 'main_sanctuaire', title: 'Mesurer pour piloter', region: 'sanctuaire', main: true, steps: [
    { t: 'Parle à Indexa la Mesureuse', at: 'indexa' }, { t: 'Mesure un vrai site sur EcoIndex.fr (mission terrain)', at: 'indexa' }, { t: 'Regarde la projection (conférence sur l’éco-conception web)', at: 'proj_concept' },
    { t: 'Interprète ta mesure avec Indexa', at: 'indexa' }, { t: 'Traverse le Sceau de l’Index', at: 'temple_index' }, { t: 'Affronte l’Omnium (8 Graines-Mères requises)', at: 'temple_index' }, { t: 'Rédige ton plan d’action Green IT', at: 'indexa' }] },
  { id: 'qs_kpi', title: 'Les indicateurs', region: 'sanctuaire', giver: 'kpi', steps: [{ t: 'Le quiz de Kapi', at: 'kpi' }], reward: { graines: 20 } },
];

export const PUZZLES = {
  index_calc: { type: 'input', title: 'Salle 1 — Calculer un EcoIndex à la main', region: 'sanctuaire', icon: '🧮', inv: ['M4-03', 'M4-05', 'M4-06'],
    intro: 'Une page mesurée : **473 éléments DOM**, **63 requêtes**, **479 Ko**.\n\nExtraits des tables de quantiles (500 000 pages de l’HTTP Archive) :\n• DOM : rang 4 = 351 · **rang 5 = 473** · rang 6 = 602\n• Requêtes : rang 7 = 56 · **rang 8 = 63** · rang 9 = 70\n• Poids (Ko) : rang 3 = 319 · **rang 4 = 479** · rang 5 = 631\n\nFormule : **Score = 100 − 5 × (3 × Q_DOM + 2 × Q_requêtes + Q_poids) / 6**',
    fields: [
      { q: 'Quantile DOM (Q_DOM)', num: 5, tol: 0 },
      { q: 'Quantile requêtes (Q_requêtes)', num: 8, tol: 0 },
      { q: 'Quantile poids (Q_poids)', num: 4, tol: 0 },
      { q: 'Score EcoIndex (une décimale)', num: 70.8, tol: 0.4 },
      { q: 'Note (lettre)', accept: ['B'] },
    ],
    hints: ['Quand la valeur tombe exactement sur un rang, le quantile est ce rang.', '3 × 5 + 2 × 8 + 4 = 35 ; 5 × 35 / 6 ≈ 29,2.'],
    explain: 'Score ≈ **70,8** → note **B**. Quand la valeur tombe entre deux rangs, on interpole (ex. 17 requêtes, entre 15 et 25 → quantile ≈ 2,2). *L’ancien cours affichait la formule sans le facteur 5 : c’était une erreur.*' },
  index_kpi: { type: 'match', title: 'Salle 2 — Le panthéon des indicateurs', region: 'sanctuaire', icon: '📏', inv: ['M4-13', 'M3-25'],
    cats: ['PUE', 'WUE', 'Intensité carbone (CUE)', 'EcoIndex', 'Website Carbon'],
    items: [
      { t: 'Énergie totale d’un centre de données / énergie des équipements informatiques', cat: 0 },
      { t: 'Litres d’eau consommés par kWh informatique', cat: 1 },
      { t: 'Grammes de CO₂e par kWh (dépend du mix électrique)', cat: 2 },
      { t: 'Note de A à G d’une page web, à partir du DOM, des requêtes et du poids', cat: 3 },
      { t: 'Estimation des émissions de CO₂ par visite d’une page', cat: 4 },
    ],
    onWin: ['step:main_sanctuaire:5', 'codex:kpis'],
    explain: 'Un tableau de bord Green IT combine des indicateurs d’infrastructure (PUE, WUE, CUE), de services (EcoIndex, poids, requêtes) et de parc (durée de vie, taux de reconditionné).' },
  kpi_qcm: { type: 'qcm', title: 'Comment marche un outil de mesure ?', region: 'sanctuaire', main: false, icon: '🔬', inv: ['M4-04', 'M4-06'],
    onWin: ['done:qs_kpi', 'codex:snippet'],
    questions: [
      { q: 'Quand tu testes une URL sur EcoIndex, le serveur…', options: ['Ouvre un navigateur Chromium « headless », sans cache ni cookies, et analyse la page', 'Demande à un humain de noter la page', 'Lit seulement le titre'], a: 0, explain: 'Résolution 1920×1080, attente de 3 s, défilement complet (chargement différé), nouvelle attente, puis extraction du DOM, du poids et des requêtes.' },
      { q: 'Avec quels outils automatise-t-on ce genre de navigateur ?', options: ['Puppeteer ou Selenium', 'Photoshop', 'Excel'], a: 0, explain: 'Des bibliothèques de pilotage de navigateurs.' },
      { q: 'Pourquoi des quantiles ?', options: ['Pour situer la page par rapport à un grand échantillon de pages réelles (HTTP Archive)', 'Pour faire joli', 'Parce que c’est plus rapide'], a: 0, explain: 'Un score relatif : être meilleur que la majorité des pages du web.' },
    ] },
};

export const CODEX = {
  mesure: { region: 'sanctuaire', title: 'Pourquoi et comment mesurer', inv: ['M4-01', 'M4-03'], text: '« On ne peut améliorer ce que l’on ne mesure pas. » Outils d’estimation : **EcoIndex** (efficience globale, note A à G) et **Website Carbon** (CO₂ par visite). Algorithmes open source, utilisables gratuitement pour un usage non commercial. Ils donnent un premier aperçu mais ne remplacent pas un bilan d’expert.\n\nEcoIndex : DOM (coefficient 3), requêtes (2), poids (1). Notes : A > 80, B 70-80, C 55-70, D 40-55, E 25-40, F 10-25, G < 10. Objectif : A ou B.', source: 'ecoindex.fr ; websitecarbon.com ; ancien cours.' },
  ecoindex_algo: { region: 'sanctuaire', title: 'L’algorithme EcoIndex', inv: ['M4-04', 'M4-05', 'M4-06'], text: 'Pipeline : requête HTTP → ouverture d’un Chromium headless (sans cache ni cookies, 1920×1080) → attente 3 s → défilement complet → attente 3 s → extraction du DOM, du poids total et du nombre de requêtes → calcul.\n\n**Score = 100 − 5 × (3·Q_DOM + 2·Q_requêtes + Q_poids) / 6**, chaque Q étant un quantile (0 à 20) par rapport à un échantillon de pages de l’HTTP Archive. Exemple : 17 requêtes, entre 15 (rang 2) et 25 (rang 3) → quantile ≈ 2,2. *(L’ancien cours donnait 3,2 dans son exemple, avec un décalage d’un rang.)*\n\nCode : [github.com/cnumr/EcoIndex_python](https://github.com/cnumr/EcoIndex_python). Outils : Puppeteer, Selenium.', source: 'Collectif Numérique Responsable, EcoIndex.' },
  snippet: { region: 'sanctuaire', title: 'Audit éclair dans la console', inv: ['M4-06'], text: 'Le script de l’ancien cours, à coller dans la console (F12), compte les ressources chargées et leur poids pour estimer un quantile :\n\n`performance.getEntriesByType(\'resource\').length` → nombre de requêtes\n`performance.getEntries().reduce((a, e) => a + (e.transferSize || 0), 0) / 1024` → poids en Ko\n`document.getElementsByTagName(\'*\').length` → taille du DOM\n\nPuis comparer aux tables de quantiles.', source: 'Ancien cours (page « how »).' },
  kpis: { region: 'sanctuaire', title: 'Piloter par les indicateurs', inv: ['M4-13'], text: 'Indicateurs annoncés au programme du cours : **PUE**, **WUE**, **intensité carbone (CUE)**, **EcoIndex**, et l’extension de navigateur **GreenIT-Analysis**. Pour un comité de direction, un tableau de bord Green IT peut suivre : durée de vie moyenne du parc, part de reconditionné, consommation des centres de données, PUE/WUE/CUE des hébergeurs, EcoIndex des services, part de fonctionnalités réellement utilisées, empreinte carbone (scopes 1, 2, 3).', source: 'Ancien cours ; The Green Grid.' },
  performance_web: { region: 'sanctuaire', title: 'Performance et sobriété', inv: ['M4-08', 'M4-09', 'M4-11'], text: 'Le poids médian d’une page web a environ doublé en 10 ans. Un site éco-conçu est aussi un site **rapide** : Amazon aurait estimé qu’une seconde de latence lui coûterait 1,6 milliard de dollars par an (anecdote ancienne, souvent citée). Beaucoup de fonctionnalités demandées sont rarement utilisées (moteur de recherche sur un petit site, cartes interactives complexes…).', source: 'Conférence Concept Image (replay) ; HTTP Archive.' },
  compensation: { region: 'sanctuaire', title: 'Les fausses bonnes idées', inv: ['M4-10'], text: 'La **compensation carbone** (planter des arbres, acheter des crédits) est souvent présentée comme une solution. Elle est lente, incertaine, parfois non additionnelle : c’est souvent du **greenwashing**. Priorité : **réduire à la source** (hébergement bas carbone, code sobre, matériel durable), puis seulement contribuer à des projets de séquestration.', source: 'Conférence Concept Image ; ADEME, avis sur la neutralité carbone (2021).' },
  conclusion: { region: 'sanctuaire', title: 'Conclusion du parcours', inv: ['M4-12'], text: 'Le futur de la planète est préoccupant et la part du numérique augmente. En tant que professionnel·le du numérique, c’est notre responsabilité d’agir. Il existe des référentiels, des groupes et des guides pour innover et éco-concevoir. Intégrer les bonnes pratiques dès les spécifications, le design et le développement réduit fortement la consommation d’énergie et de ressources — et cette optimisation, liée à la performance, doit être **mesurée en continu**.\n\nMais il faut aussi une **rupture** : trouver un équilibre **technique** (performance, sobriété), **social** (accessibilité, éthique, inclusion) et **économique** (viabilité, coûts). « Il n’existe pas de solution unique : il nous appartient de continuer à rechercher et à innover. »', source: 'Ancien cours (conclusion).' },
  bibliotheque_verte: { region: 'sanctuaire', title: 'Pour aller plus loin', inv: ['M3-05', 'M3-23'], text: '• Collectif Numérique Responsable : collectif.greenit.fr (115 bonnes pratiques)\n• RGESN : ecoresponsable.numerique.gouv.fr\n• Designers Éthiques : designersethiques.org\n• ADEME et Arcep : études sur l’empreinte du numérique\n• EcoIndex : ecoindex.fr · Website Carbon : websitecarbon.com · HTTP Archive : httparchive.org\n• Green Web Foundation : thegreenwebfoundation.org\n• Cloud Carbon Footprint : cloudcarbonfootprint.org\n• AIE : rapport *Energy and AI*\n• The Shift Project : rapports sur le numérique', source: 'Ancien cours et sources mises à jour.' },
  archives_site: { region: 'village', title: 'Archives de l’ancien site (chiffres retirés ou corrigés)', inv: ['M1-33', 'M2-16', 'M2-30', 'M2-57', 'M2-72', 'M2-66', 'X-02', 'M3-04', 'M1-36'], text: 'Pour qu’aucun contenu ne soit perdu, voici les affirmations de l’ancien cours qui ont été **retirées ou corrigées**, et pourquoi :\n• « Indice d’épuisement des ressources : 85 % » — non sourcé.\n• « Sans optimisation, les centres de données consommeront l’équivalent de 1 130 réacteurs nucléaires en 2030 (ADEME) » — source introuvable ; l’AIE prévoit ≈ 945 TWh en 2030, soit l’ordre de grandeur de la production d’une centaine de réacteurs.\n• « 5G + IoT : +30 % de consommation des réseaux d’ici 2030 » — non sourcé.\n• « ~151 GWh/jour, ~250 centres de données, ~2 Mt CO₂/an » (France) — ordres de grandeur non sourcés.\n• « Si Internet était un pays, 3e (ou 6e) consommateur/pollueur » — rangs contradictoires selon les pages, estimations anciennes.\n• « Epson, 10 M€ (2017) » — plainte d’association, pas d’amende connue.\n• « 97 % des Français privilégient les marques durables » — chiffre déclaratif.\n• « Probabilité > 80 % de dépasser durablement +1,5 °C d’ici 2027-2028 » — remplacé par la prévision OMM 2025.', source: 'Inventaire de l’ancien site (docs/01-inventaire.md).' },
};

export const STATEMENTS = [
  { id: 's_mesure_suffit', r: 'sanctuaire', v: false, t: 'Un EcoIndex A suffit à prouver qu’un service est écologique.', x: 'C’est un indicateur partiel : il ne mesure ni l’utilité, ni le serveur, ni le matériel des utilisateurs.', inv: ['M4-01'] },
  { id: 's_compenser', r: '*', v: false, t: 'Compenser, c’est aussi bien que réduire.', x: 'La compensation est incertaine : il faut d’abord réduire à la source.', inv: ['M4-10'] },
  { id: 's_poids', r: 'sanctuaire', v: true, t: 'Le poids médian des pages web a environ doublé en 10 ans.', x: 'Exact (HTTP Archive).', inv: ['M4-08'] },
  { id: 's_coeff', r: 'sanctuaire', v: true, t: 'Dans l’EcoIndex, la complexité du DOM a le plus gros coefficient.', x: 'Exact : coefficient 3, contre 2 pour les requêtes et 1 pour le poids.', inv: ['M4-05'] },
];

export const COMBAT = [
  { id: 'c_ecoindex', r: 'sanctuaire', q: 'Quelles sont les 3 métriques de l’EcoIndex ?', options: ['DOM, requêtes, poids', 'Couleur, police, logo', 'PUE, WUE, CUE', 'CPU, RAM, disque'], a: 0, explain: 'Coefficients 3, 2 et 1.' },
  { id: 'c_grade', r: 'sanctuaire', q: 'Quel score EcoIndex donne la note A ?', options: ['Plus de 80', 'Plus de 50', 'Moins de 10', 'Exactement 100'], a: 0, explain: 'A > 80.' },
];

export const ON_ENTER = { sanctuaire: ['quest:main_sanctuaire'] };
export const ON_EVENT = {
  omnium: ['say:L’Omnium s’éteint… puis se rallume, doucement, en vert. « MON PROGRAMME EST VIDE. DONNE-MOI UN PLAN, GARDIEN·NE. UN VRAI. »', 'step:main_sanctuaire:6', 'title:Gardien·ne', 'codex:conclusion', 'open:q12_plan'],
};
