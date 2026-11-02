// =============================================================
// content/common.js — objets, coffres, vidéos, missions terrain,
// questions ouvertes, textes d'introduction et de fin
// Tous les textes sont modifiables (voir README › Modifier le contenu).
// inv : identifiants de l'inventaire de l'ancien site (docs/01-inventaire.md)
// =============================================================

export const ITEMS = {
  bouclier: { name: 'Bouclier de Vérité', icon: 'bouclier', short: 'Maj : parer les idées reçues', desc: 'Maintiens **Maj** (ou L) face à une bulle d’idée pour la **parer** : réponds VRAI ou FAUX pour la renvoyer. Il dissipe aussi le brouillard de désinformation.' },
  sceau: { name: 'Sceau des Limites', icon: 'cristal', short: 'Ouvre les ponts du monde', desc: 'Forgé à partir des 9 limites planétaires. Il rétablit les passages vers les **Mines** (nord du Bassin) et le **Marais** (sud du village).' },
  lanterne: { name: 'Lanterne Solaire', icon: 'lanterne', short: 'Éclaire et révèle les vampires', desc: 'Éclaire les lieux sombres et révèle les **vampires de veille**. Fonctionne au soleil : zéro pile jetée.' },
  grappin: { name: 'Grappin de Fibre', icon: 'grappin', short: 'Franchit les gouffres', desc: 'Un câble de fibre optique tressé : permet de franchir les **gouffres** (vers la Décharge et la Citadelle).' },
  lentille: { name: 'Lentille de Mesure', icon: 'lentille', short: 'Révèle mirages et passages', desc: '« On ne peut améliorer ce que l’on ne mesure pas. » Révèle les **mirages** et les passages secrets.' },
  pinces: { name: 'Pinces du Réparateur', icon: 'pinces', short: 'Répare les mécanismes', desc: 'Réparer plutôt que remplacer. Ouvre les mécanismes cassés et **recycle** les rats-batteries sans explosion.' },
  cristal: { name: 'Cristal de Sobriété', icon: 'cristal', short: 'Dissipe les hallucinations', desc: 'Le bon modèle pour le bon usage. Dissipe les **murs d’hallucinations**.' },
  plan: { name: 'Plan du Bâtisseur', icon: 'plan', short: 'Ouvre les portes des bâtisseurs', desc: 'Les principes de l’éco-conception, gravés. Ouvre la route du **Sanctuaire de la Mesure**.' },
};

/** Coffres : act = actions. */
export const CHESTS = {
  // Coffres « à revisiter » : ils s'ouvrent avec un objet trouvé plus tard dans l'aventure
  revisit_village: { if: 'item:grappin', lockMsg: 'Un coffre ancien, scellé… Il faudrait le **Grappin de Fibre** pour l’ouvrir. Reviens plus tard !', act: ['heart', 'graines:15'] },
  revisit_steppe: { if: 'item:lanterne', lockMsg: 'Un coffre ancien, scellé… Il faudrait le **Lanterne Solaire** pour l’ouvrir. Reviens plus tard !', act: ['heart', 'graines:15'] },
  revisit_bassin: { if: 'item:pinces', lockMsg: 'Un coffre ancien, scellé… Il faudrait le **Pinces du Réparateur** pour l’ouvrir. Reviens plus tard !', act: ['heart', 'graines:15'] },
  revisit_mines: { if: 'item:grappin', lockMsg: 'Un coffre ancien, scellé… Il faudrait le **Grappin de Fibre** pour l’ouvrir. Reviens plus tard !', act: ['heart', 'graines:15'] },
  revisit_marais: { if: 'item:lentille', lockMsg: 'Un coffre ancien, scellé… Il faudrait le **Lentille de Mesure** pour l’ouvrir. Reviens plus tard !', act: ['heart', 'graines:15'] },
  revisit_citadelle: { if: 'item:pinces', lockMsg: 'Un coffre ancien, scellé… Il faudrait le **Pinces du Réparateur** pour l’ouvrir. Reviens plus tard !', act: ['heart', 'graines:15'] },
  revisit_desert: { if: 'item:plan', lockMsg: 'Un coffre ancien, scellé… Il faudrait le **Plan du Bâtisseur** pour l’ouvrir. Reviens plus tard !', act: ['heart', 'graines:15'] },
  revisit_decharge: { if: 'item:cristal', lockMsg: 'Un coffre ancien, scellé… Il faudrait le **Cristal de Sobriété** pour l’ouvrir. Reviens plus tard !', act: ['heart', 'graines:15'] },
  revisit_forge: { if: 'item:cristal', lockMsg: 'Un coffre ancien, scellé… Il faudrait le **Cristal de Sobriété** pour l’ouvrir. Reviens plus tard !', act: ['heart', 'graines:15'] },
  bouclier: { act: ['give:bouclier', 'codex:bouclier_verite'] },
  sceau: { act: ['give:sceau', 'codex:neuf_limites'] },
  lanterne: { act: ['give:lanterne', 'codex:veille'] },
  grappin: { act: ['give:grappin', 'codex:cables_sous_marins'] },
  lentille: { act: ['give:lentille', 'codex:pue'] },
  pinces: { act: ['give:pinces', 'codex:droit_reparation'] },
  cristal: { act: ['give:cristal', 'codex:ia_sobre'] },
  plan: { act: ['give:plan', 'codex:quatre_niveaux'] },
  coffre_village: { act: ['graines:20', 'kit:1', 'toast:Un vieux coffre : 20 graines et un kit de réparation.'] },
  coffre_steppe: { act: ['fruit:2', 'graines:10', 'codex:carottes_glace'] },
  heart_village: { act: ['heart', 'codex:archives_site'] },
  heart_ozone: { act: ['heart', 'codex:montreal'] },
  heart_cables: { act: ['heart', 'codex:cables_sous_marins'] },
  heart_oasis: { act: ['heart', 'codex:ia_eau'] },
  heart_epave: { act: ['heart', 'codex:ordinateur_1985'] },
  heart_sanctuaire: { act: ['heart', 'codex:bibliotheque_verte'] },
  graines_records: { act: ['graines:25', 'codex:records_chaleur'] },
  graines_mine: { act: ['graines:25', 'codex:mine_urbaine'] },
  graines_serveur: { act: ['graines:25', 'codex:dark_data'] },
  graines_apollo: { act: ['graines:25', 'codex:apollo'] },
};

/** Vidéos (chargées uniquement au clic, via youtube-nocookie). */
export const VIDEOS = {
  rockstrom: { yt: 'V9ETiSaxyfk', title: 'Beyond the Anthropocene', source: 'World Economic Forum — Johan Rockström', duration: '21 min', required: true, inv: ['M1-18', 'M1-19', 'M1-20', 'M1-21', 'M1-22'],
    intel: ['« D’un petit monde sur une grande planète à un **grand monde sur une petite planète** » [00:47]', 'Holocène : **±1 °C en 10 000 ans**, ce qui a permis l’agriculture [06:13]', '**Grande Accélération** vers 1950-1955 : tout s’emballe [08:00]', '**Points de bascule** : la Terre pourrait passer de « partenaire » à « ennemie » [13:00]', '**Carbon Law** : diviser les émissions par 2 chaque décennie [19:07]'],
    codex: ['grande_acceleration', 'carbon_law'], onDone: ['step:main_steppe:3'] },
  limites: { yt: 'qo91ZSyVQ7o', title: 'Les limites planétaires', source: 'TF1 Info', duration: '7 min', required: true, inv: ['M1-54', 'M1-56', 'M1-57', 'M1-58', 'M1-59', 'M1-60'],
    intel: ['Déforestation : l’équivalent de **10 terrains de football par minute** [01:23]', 'Plus de **400 « zones mortes »** dues à l’azote (chiffre de la vidéo ; > 500 recensées depuis) [02:42]', 'Acidité de l’océan : **+30 %** depuis le XIXe siècle [03:14]', 'Populations d’animaux sauvages suivies : **−73 % en moyenne** en 50 ans (WWF 2024) [04:32]', 'Vidéo : 6 limites sur 9 dépassées — **7 sur 9 depuis le bilan 2025** [06:14]', 'L’ozone se rétablit grâce au **Protocole de Montréal** [06:37]'],
    codex: ['biodiversite'], onDone: ['step:main_bassin:2'] },
  triangle: { yt: '-2w7dG7TG9c', title: 'Le triangle de l’inaction', source: 'Christophe Cassou (CNRS)', duration: '5 min', required: false, inv: ['M1-62'],
    intel: ['Individu, entreprise, politique : chacun **renvoie la responsabilité** aux deux autres.', 'Briser le triangle : agir **dans sa sphère** et entraîner les autres.'], codex: ['triangle_inaction'] },
  arte: { yt: '3NR3RDedd5w', title: 'Comprendre la rareté des métaux', source: 'ARTE', duration: '5 min', required: true, inv: ['M2-25'],
    intel: ['« Rare » n’a pas de définition universelle : concentration, difficulté d’extraction, faible production [01:10]', 'Les **17 terres rares** sont difficiles à séparer et très polluantes à purifier [02:18]', 'Demande en explosion : production de cobalt **+55 % en 5 ans** (chiffre de la vidéo) [03:05]', 'L’extraction est concentrée dans une poignée de pays : l’UE parle de **métaux critiques** [03:46]'],
    codex: ['metaux_critiques'], onDone: ['step:main_mines:3'] },
  ademe_acv: { yt: 'SJq7i_3UODM', title: 'Le cycle de vie d’un produit', source: 'ADEME', duration: '3 min', required: false, inv: ['M2-70'],
    intel: ['Extraction → fabrication → transport → usage → fin de vie : on évalue **tout** le cycle.', 'L’ACV est **multicritère** : climat, ressources, eau, pollutions…'], codex: ['acv'] },
  ia: { yt: 'DP69uxjwuTQ', title: 'La consommation d’électricité explose dans la course à l’IA', source: 'Radio-Canada Info', duration: '4 min', required: true, inv: ['M2-33', 'M2-35', 'M2-37', 'M2-38'],
    intel: ['Une seule grande installation dédiée à l’IA consomme autant que **100 000 foyers** [01:26]', 'Google : **~31 milliards de litres** d’eau en 2024 pour ses centres de données [01:41]', 'La vidéo cite « une requête IA = 10× une recherche » : estimation **datée**, voir le Codex [02:44]', 'Demande des centres de données IA en forte hausse ; les géants signent des contrats **nucléaires** [03:30]', 'Une requête mobilise une chaîne invisible : minerais, eau, électricité, infrastructures 24 h/24 [00:22]'],
    codex: ['ia_energie_requete', 'ia_datacenters'], onDone: ['step:main_desert:2'] },
  numerique: { yt: 'SjKsHSx4rCE', title: 'L’impact du numérique sur l’environnement', source: 'Vidéo de synthèse', duration: '4 min', required: false, inv: ['M2-54', 'M2-56'],
    intel: ['Le « cloud » repose sur des infrastructures très matérielles : câbles, centres de données, antennes.', '**70 à 80 %** de l’empreinte d’un équipement vient de sa fabrication.'], codex: ['infrastructure_invisible'], retry: true, onDone: ['flag:vu_video_numerique', 'quest:qs_pays', 'puzzle:pays_internet'] },
  eco: { yt: 'RDGhLwSrOsU', title: 'Qu’est-ce que l’éco-conception ?', source: 'Vidéo pédagogique', duration: '4 min', required: true, inv: ['M3-01'],
    intel: ['Éco-concevoir, c’est intégrer l’environnement **dès la conception**.', 'Objectif : réduire la sollicitation des **ressources matérielles** sur tout le cycle de vie, pas seulement l’énergie.'], codex: ['ecoconception'], onDone: ['step:main_forge:2'] },
  concept: { yt: 'uVZXdiKBLdU', title: 'Éco-conception : comment limiter l’impact de mon site web ?', source: 'Agence Concept Image (replay)', duration: '1 h — passages ciblés', start: 554, required: true, inv: ['M4-07', 'M4-08', 'M4-09', 'M4-10', 'M4-11'],
    intel: ['[09:14] Le poids médian d’une page web a **doublé en 10 ans**.', '[19:50] « 1 s de latence = 1,6 Md$/an pour Amazon » : anecdote ancienne, mais la **performance compte**.', '[33:18] Une grande part des fonctionnalités demandées est **rarement utilisée** (voir la grille 3U).', '[40:32] **Mobile first** : le petit écran force à prioriser.', '[54:15] La compensation carbone est souvent du **greenwashing** : réduire à la source d’abord.'],
    codex: ['compensation', 'performance_web'], onDone: ['step:main_sanctuaire:3'] },
};

/** Missions terrain (activités hors du jeu, valeurs saisies). */
export const MISSIONS = {
  ngc: { title: 'L’empreinte du voyageur', link: 'https://nosgestesclimat.fr/', linkLabel: 'Nos Gestes Climat (ADEME)', inv: ['M1-49', 'M1-51'],
    intro: 'Calcule ton empreinte carbone personnelle avec le simulateur officiel de l’ADEME (≈ 10 min, anonyme). Puis reviens noter le résultat.\n\nRepères : moyenne française ≈ **8,2 t CO₂e/an** (estimation 2024, SDES) ; objectif compatible avec l’Accord de Paris ≈ **2 t** en 2050.',
    fields: [{ q: 'Ton empreinte totale', unit: 't CO₂e / an', ph: 'ex. 7.4' }, { q: 'Ton premier poste d’émissions (transport, alimentation, logement, consommation…)', type: 'text' }],
    feedback: v => { const t = parseFloat(String(v[0]).replace(',', '.')); if (isNaN(t)) return null; const r = t - 2; return t > 2 ? `Pour atteindre **2 t**, il faudrait réduire de **${r.toFixed(1)} t**, soit **${Math.round(r / t * 100)} %** de ton empreinte actuelle. Le premier poste que tu as noté est souvent le meilleur levier.` : 'Tu es déjà sous les **2 t** : bravo ! Continue et partage tes pratiques.'; },
    onDone: ['step:qs_empreinte:1'] },
  climate: { title: 'Les eaux montantes', link: 'https://coastal.climatecentral.org/map/6/6.2374/45.6479/?theme=sea_level_rise&map_type=coastal_dem_comparison&basemap=roadmap&contiguous=true&elevation_model=best_available&forecast_year=2050&pathway=rcp45&percentile=p50&refresh=true&return_level=return_level_1&rl_model=coast_rp&slr_model=kopp_2014', linkLabel: 'Carte Climate Central (2050)', inv: ['M1-37'],
    intro: 'Ouvre la carte de montée des eaux à l’horizon **2050** (scénario intermédiaire). Repère une zone côtière que tu connais, ou des infrastructures numériques (ports d’atterrissement de câbles sous-marins, villes côtières avec centres de données).',
    fields: [{ q: 'Quelle zone as-tu observée ?', type: 'text' }, { q: 'Qu’est-ce qui t’a frappé·e ? Quel risque pour le numérique ?', type: 'text' }],
    onDone: ['step:qs_eaux:1'] },
  ademe_num: { title: 'Mon empreinte numérique', link: 'https://agirpourlatransition.ademe.fr/particuliers/evaluer-son-impact/calculer-empreinte-carbone/calculez-empreinte-carbone-usages-numeriques', linkLabel: 'Calculateur ADEME (usages numériques)', inv: ['M2-11', 'M2-12'],
    intro: 'Évalue l’empreinte de tes **équipements et usages numériques** avec le calculateur de l’ADEME (5-7 min).\n\nRepère : l’empreinte numérique moyenne d’un·e Français·e est de l’ordre de **250 à 400 kg CO₂e/an** selon le périmètre (ADEME-Arcep).',
    fields: [{ q: 'Ton empreinte numérique annuelle', unit: 'kg CO₂e / an', ph: 'ex. 320' }, { q: 'Ce qui pèse le plus (équipements ? usages ?)', type: 'text' }],
    feedback: v => { const k = parseFloat(String(v[0]).replace(',', '.')); if (isNaN(k)) return null; return `${k} kg CO₂e/an, c’est environ **${(k / 8200 * 100).toFixed(1)} %** d’une empreinte moyenne de 8,2 t. Rappel : la **fabrication** des équipements domine — les garder plus longtemps est le levier n°1.`; },
    onDone: ['step:qs_empreinte_num:1'] },
  equipements: { title: 'L’inventaire', inv: ['M2-41', 'M2-45'],
    intro: 'Compte **tous** tes équipements numériques. Pense aux « angles morts » : box Internet, décodeur, routeur ; montre, balance, ampoules connectées ; électroménager « smart » ; consoles et manettes ; appareils photo, enceintes Bluetooth ; vieux écrans et tablettes oubliés au fond d’un tiroir.\n\nRepères : **~7** équipements par utilisateur dans le monde, **~11** en France (GreenIT.fr / études ADEME-Arcep, chiffres d’avant 2023).',
    fields: [{ q: 'Nombre total d’équipements', unit: 'appareils', ph: 'ex. 12' }, { q: 'Lequel pourrais-tu donner, revendre ou ne pas remplacer ?', type: 'text', optional: true }],
    feedback: v => { const n = parseInt(v[0]); if (isNaN(n)) return null; return n < 7 ? '✓ Sous la moyenne mondiale : excellent !' : n < 11 ? '⚠ Au-dessus de la moyenne mondiale mais sous la moyenne française.' : '⚠ Au-dessus de la moyenne française. Pense au **réemploi** et au **don** des appareils inutilisés.'; },
    onDone: ['step:qs_inventaire:1'] },
  ecran: { title: '27 ans d’écran', inv: ['M2-47'],
    intro: 'Selon un sondage commercial (NordVPN, 2021), un·e Français·e passerait **27 ans et 7 mois** devant un écran au cours de sa vie (≈ 8 h 30 par jour en cumulant smartphone, ordinateur et TV). Vérifie ton propre temps d’écran dans les réglages de ton téléphone (« Temps d’écran » / « Bien-être numérique »).',
    fields: [{ q: 'Ton âge', unit: 'ans', ph: 'ex. 23' }, { q: 'Ton temps d’écran quotidien sur smartphone (moyenne de la semaine)', unit: 'heures', ph: 'ex. 3.5' }],
    feedback: v => { const a = parseFloat(v[0]), h = parseFloat(String(v[1]).replace(',', '.')); if (isNaN(a) || isNaN(h)) return null; const y = (h / 24) * Math.max(0, a - 10); return `Au rythme actuel, depuis tes 10 ans, cela représente environ **${y.toFixed(1)} années** passées sur ton seul smartphone. Ce temps a aussi un coût énergétique : réseaux, serveurs et renouvellement des appareils.`; },
    onDone: ['step:qs_ecran:1'] },
  ecoindex: { title: 'Mesurer un vrai site', link: 'https://www.ecoindex.fr/', linkLabel: 'EcoIndex.fr', inv: ['M4-02', 'M4-03'],
    intro: 'Sors du jeu et teste **un vrai site web** sur EcoIndex.fr (le site de ton école, d’un média, d’une marque…). Note son score et sa note (A à G). Rappel : A > 80, B 70-80, C 55-70, D 40-55, E 25-40, F 10-25, G < 10.',
    fields: [{ q: 'Adresse du site testé', type: 'text' }, { q: 'Score EcoIndex obtenu', unit: '/ 100', ph: 'ex. 46' }, { q: 'Nombre de requêtes, poids, taille du DOM (si affichés)', type: 'text', optional: true }],
    feedback: v => { const s = parseFloat(v[1]); if (isNaN(s)) return null; const g = s > 80 ? 'A' : s > 70 ? 'B' : s > 55 ? 'C' : s > 40 ? 'D' : s > 25 ? 'E' : s > 10 ? 'F' : 'G'; return `Note **${g}**. ${'AB'.includes(g) ? 'Très bon élève !' : 'CD'.includes(g) ? 'Moyen : des optimisations sont possibles.' : 'Impact élevé : beaucoup de marge de progrès.'} Garde ce résultat pour la stèle d’Indexa.`; },
    onDone: ['step:main_sanctuaire:2'] },
};

/** Questions ouvertes (notées par l'enseignant). Modifiables librement. */
export const QUESTIONS = {
  q1_holocene: { title: 'Q1 · Holocène et numérique', inv: ['M1-13'], q: 'Pourquoi la stabilité climatique de l’Holocène concerne-t-elle directement les infrastructures numériques ? Donne au moins deux exemples concrets.', context: 'Aïdan te tend une carotte de glace : « Explique-moi avec tes mots… »', onDone: ['step:main_steppe:4'] },
  q2_levier: { title: 'Q2 · Mon premier levier', inv: ['M1-49'], q: 'D’après ton bilan carbone personnel, quel est ton premier levier de réduction ? Pourquoi celui-ci, et qu’est-ce qui t’empêche (ou t’aide) à le mettre en œuvre ?', onDone: ['done:qs_empreinte'] },
  q3_triangle: { title: 'Q3 · Briser le triangle', inv: ['M1-65'], q: 'En tant que futur·e manager IT, comment briserais-tu le triangle de l’inaction dans ton organisation ? Donne un exemple concret d’action.', onDone: ['step:main_bassin:4'] },
  q4_parc: { title: 'Q4 · Politique de renouvellement', inv: ['M2-10'], q: 'Propose une politique de renouvellement du parc informatique pour une entreprise de 500 postes (durée de vie cible, reconditionné, réparation, fin de vie…). Justifie avec des chiffres vus dans le jeu.', onDone: ['flag:fonderie_ouverte', 'step:main_mines:4'] },
  q5_usage: { title: 'Q5 · Un usage à réduire', inv: ['M2-13'], q: 'Quel usage numérique personnel vas-tu réduire, comment, et comment mesureras-tu le résultat ?', onDone: ['flag:relais_ouvert', 'step:main_marais:5'] },
  q6_hebergeur: { title: 'Q6 · Choisir un hébergeur', inv: ['M2-80', 'M3-26'], q: 'Quels sont tes trois critères pour choisir un hébergeur responsable, et pourquoi ? Que penses-tu des hébergeurs qui « compensent » à 300 % ?', onDone: ['flag:machines_ouvert', 'step:main_citadelle:3'] },
  q7_ia: { title: 'Q7 · Quand l’IA est-elle justifiée ?', inv: ['M3-11'], q: 'Décris un cas où l’IA générative est justifiée (bénéfice > coût) et un cas où elle ne l’est pas. Quels critères utilises-tu pour décider ?', onDone: ['done:main_desert'] },
  q8_rebond: { title: 'Q8 · L’effet rebond', inv: ['M1-53'], q: 'Donne un exemple d’effet rebond dans le numérique (ou l’IA) et une parade possible.', onDone: ['step:main_desert:3'] },
  q9_lois: { title: 'Q9 · La loi et mon métier', inv: ['M2-67'], q: 'Quelle obligation légale (française ou européenne) aura le plus d’impact sur ton futur métier ? Explique comment tu l’anticiperais.', onDone: ['done:main_decharge'] },
  q10_3u: { title: 'Q10 · La grille 3U', inv: ['M3-15'], q: 'Choisis une fonctionnalité d’une application que tu utilises et applique-lui la grille 3U (Utile, Utilisable, Utilisée). La garderais-tu ? Comment la simplifierais-tu ?', onDone: ['step:main_forge:7', 'boss:golem'] },
  q11_mesure: { title: 'Q11 · Interpréter une mesure', inv: ['M4-02', 'M4-03'], q: 'Donne l’EcoIndex du site que tu as testé, ton interprétation (DOM, requêtes, poids) et trois actions correctives concrètes.', onDone: ['flag:index_ouvert', 'step:main_sanctuaire:4'] },
  q12_plan: { title: 'Q12 · Mon plan d’action Green IT', inv: ['M1-05', 'M4-12'], q: 'Rédige ton plan d’action Green IT pour un comité de direction (5 à 10 lignes) : constats chiffrés, 3 à 5 actions prioritaires (matériel, logiciel, IA, hébergement, mesure), indicateurs de suivi.', context: 'Pour reprogrammer l’Omnium, il faut lui donner un vrai plan. C’est l’objectif final de la formation : « présenter un plan d’action complet, chiffré et argumenté à un comité de direction ».', onDone: ['done:main_sanctuaire', 'ending'] },
};

/** Les 9 limites planétaires (état 2025, Planetary Health Check). */
export const BOUNDARIES = [
  { name: 'Changement climatique', ok: false, text: 'Dépassée. La concentration de CO₂ dépasse **420 ppm** (limite proposée : 350 ppm).' },
  { name: 'Intégrité de la biosphère', ok: false, text: 'Dépassée. Les populations d’animaux sauvages suivies ont décliné de **73 % en moyenne** depuis 1970 (WWF, Indice Planète Vivante 2024) — attention : ce n’est pas « 73 % des animaux ont disparu », mais une baisse moyenne de la taille des populations.' },
  { name: 'Usage des sols', ok: false, text: 'Dépassée. Il reste environ **60 %** du couvert forestier d’origine (limite : 75 %). Environ **40 %** a donc disparu.' },
  { name: 'Eau douce', ok: false, text: 'Dépassée (eau « verte » des sols et eau « bleue » des rivières). Les centres de données y contribuent localement par leur refroidissement.' },
  { name: 'Flux d’azote et de phosphore', ok: false, text: 'Dépassée. Les engrais azotés provoquent l’**eutrophisation** et des « zones mortes » dans les océans.' },
  { name: 'Nouvelles entités', ok: false, text: 'Dépassée. Plastiques, produits chimiques de synthèse… et une partie des **déchets électroniques**.' },
  { name: 'Acidification des océans', ok: false, text: 'Dépassée **depuis le bilan 2025** : l’océan absorbe environ un quart du CO₂ humain et s’acidifie (+30 % d’acidité depuis le XIXe siècle).' },
  { name: 'Couche d’ozone', ok: true, text: 'Dans la zone sûre : elle se **rétablit** grâce au Protocole de Montréal (1987). La preuve que l’action collective fonctionne !' },
  { name: 'Aérosols atmosphériques', ok: true, text: 'Globalement dans la zone sûre, mais avec de fortes pollutions régionales (Asie du Sud notamment).' },
];

/** Couches de gras du Golem Obésiciel (jeu « Opération Dégraissage »). */
export const GOLEM_LAYERS = [
  { label: 'Publicités et traqueurs', ko: 1200, tip: 'Moins de scripts tiers = moins de requêtes et plus de vie privée.' },
  { label: 'Vidéo en lecture automatique', ko: 1000, tip: 'Ne jamais lancer de vidéo sans action de l’utilisateur.' },
  { label: 'Images non optimisées', ko: 800, tip: 'Compresser, redimensionner, formats WebP/AVIF, chargement différé.' },
  { label: 'JavaScript superflu', ko: 500, tip: 'Tree-shaking, frameworks légers, ou pas de framework du tout.' },
  { label: 'Polices téléchargées', ko: 250, tip: 'Les polices système ne pèsent rien.' },
  { label: 'Boutons « like » sociaux', ko: 47, tip: 'Un simple lien de partage suffit.' },
];

/** Eco-Slash : bonnes pratiques / pièges. */
export const ECO_SLASH = {
  good: ['Code optimisé', 'Serveur vert', 'Sobriété des données', 'Cache efficace', 'Design épuré', 'Pagination', 'Polices système', 'Images WebP', 'Pages statiques', 'Réemploi'],
  bad: ['Obsolescence programmée', 'Fonctions inutiles', 'Requêtes lourdes', 'Vidéo en autoplay', 'Carrousel géant', 'SQL dans une boucle', 'Défilement infini'],
};

export const INTRO = [
  'Il était une fois **Verdance**, un monde de forêts, de rivières et de villages connectés.',
  'Pour tout simplifier, ses habitants bâtirent **l’Omnium** : une machine-monde qui calculait, stockait et diffusait tout, partout, tout le temps.',
  'Mais l’Omnium avait faim. Il dévora les **métaux** des montagnes, l’**eau** des lacs, l’**énergie** des rivières. Toujours plus d’appareils, toujours plus de données, toujours plus lourds…',
  'Puis vint **la Surchauffe**. Le ciel vira à l’orange. L’herbe devint cendre. Des créatures nées du gaspillage se mirent à rôder.',
  'Au pied de l’**Arbre-Mère** calciné, une graine s’éveille. Elle t’a choisi·e. Tu es l’**Apprenti·e Gardien·ne**.\n\nRetrouve les **8 Graines-Mères**, comprends ce qui s’est passé… et redonne vie à Verdance.',
];

export const EPILOGUE = 'L’Omnium s’est tu. Non pas détruit : **reprogrammé**. Il calcule désormais ce qui est utile, sur des machines qui durent, alimentées par une énergie sobre.\n\nDans les huit régions, l’herbe a repoussé. L’Arbre-Mère est en fleurs. Le Golem a fondu, les mirages se sont dissipés, et les idées reçues ne trouvent plus personne pour y croire.\n\n« Le développement durable du numérique est un défi complexe. Il n’existe pas de solution unique : il nous appartient de continuer à chercher, à mesurer et à innover. » Un équilibre **technique** (sobriété, performance), **social** (accessibilité, éthique, inclusion) et **économique** (viabilité, coûts maîtrisés).\n\nMerci, Gardien·ne {nom}.';

export const ABOUT = `**Verdance** est un jeu d’aventure pédagogique sur le Green IT et le numérique responsable.

**Éco-conçu** : aucun framework, aucune police ni image téléchargée, aucun fichier audio. Tout le pixel art et la musique sont **générés par le code**. Les vidéos ne se chargent que si tu cliques dessus. Le jeu fonctionne sans serveur.

**Graphismes et sons** : 100 % originaux, générés procéduralement. Aucun asset tiers, aucun personnage protégé.

**Données personnelles** : ton prénom, ton nom et ta progression restent dans **ce navigateur** (localStorage). Rien n’est envoyé sur Internet : c’est toi qui télécharges ton bilan PDF et l’envoies à ton enseignant·e.

Les chiffres sont sourcés et datés dans le **Codex** (touche C). Certaines données anciennes du cours ont été actualisées ; lorsque l’incertitude est forte, c’est indiqué.`;
