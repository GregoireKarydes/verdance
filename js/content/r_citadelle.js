// =============================================================
// Région 5 — Citadelle des Serveurs (data centers, hébergement, chaleur)
// =============================================================
import { look } from './r_village.js';

export const NPCS = {
  calorine: { id: 'calorine', name: 'Ingénieure Calorine', look: look('#c8603a', '#2a1a10', { hairStyle: 2, glasses: true, apron: '#8a3a2a' }), inv: ['M3-25', 'M2-83'],
    talk: [
      { if: '!flag:calorine_1', mark: 'quest', say: ['Bienvenue dans la Citadelle, là où vit le « cloud ». Ici, chaque requête devient **chaleur**.', 'Les centres de données du monde ont consommé environ **415 TWh** d’électricité en 2024, soit environ **1,5 %** de l’électricité mondiale. L’Agence internationale de l’énergie prévoit plus du double, environ **945 TWh**, en 2030, surtout à cause de l’IA.', 'Notre indicateur clé, c’est le **PUE** : l’énergie totale du centre divisée par l’énergie des serveurs. 1,0 serait parfait (impossible) ; 1,2 c’est très bien ; au-delà de 2, c’est du gaspillage de refroidissement.', 'Et cette chaleur, on peut la **récupérer** : certaines entreprises installent des serveurs-radiateurs qui chauffent des logements gratuitement. Va lire la **stèle de Bordage**, puis parle au gardien Racko.'], act: ['flag:calorine_1', 'step:main_citadelle:1', 'codex:datacenters', 'codex:pue', 'codex:chaleur_fatale'] },
      { if: '!seed:citadelle', say: ['La chaleur fatale, c’est de l’énergie déjà payée. La jeter, c’est absurde.'] },
      { say: ['Les maisons du village sont chauffées par nos serveurs. Ça, c’est de l’écologie industrielle !'] },
    ] },
  racko: { id: 'racko', name: 'Gardien Racko', look: look('#3a404d', '#1a1a1a', { hat: 'helmet', hatColor: '#4a5a6a' }), inv: ['M2-80'],
    talk: [
      { if: 'step:main_citadelle<2', say: ['Accès restreint. Parle d’abord à l’ingénieure Calorine, puis lis la stèle.'] },
      { if: 'step:main_citadelle==2', mark: 'quest', say: ['Tu veux entrer dans la Salle des Machines ? Prouve-moi que tu sais choisir un hébergeur.'], act: ['open:q6_hebergeur'] },
      { if: '!seed:citadelle', say: ['La Salle des Machines est au nord-est. Les élémentaires de chaleur deviennent fous quand le PUE grimpe.'] },
      { say: ['Accès autorisé, Gardien·ne. Toujours.'] },
    ] },
  webarchiviste: { id: 'webarchiviste', name: 'Webarchiviste Lazare', look: look('#5a5a7a', '#8a8a8a', { hairStyle: 3, beard: '#9a9a9a', glasses: true }), inv: ['M2-82'],
    talk: [
      { if: '!quest:qs_zombies', mark: 'quest', say: ['Des **sites zombies** errent dans la Citadelle ! Des sites abandonnés mais toujours hébergés, qui consomment pour rien. On estime qu’ils représentent une part importante des sites en ligne.', 'Aide-moi à les **décommissionner** proprement.'], act: ['quest:qs_zombies', 'puzzle:zombies_decom'] },
      { if: '!done:qs_zombies', mark: 'quest', say: ['On s’y remet ?'], act: ['puzzle:zombies_decom'] },
      { say: ['Un serveur éteint, c’est environ 500 kWh économisés par an. Pas mal pour un clic.'] },
    ] },
  courtiere: { id: 'courtiere', name: 'Courtière Nuage', look: look('#3a8aaa', '#e0c080', { hairStyle: 2, hat: 'band', hatColor: '#fff' }), inv: ['M3-26', 'M2-83'],
    talk: [
      { if: '!quest:qs_comparatif', mark: 'quest', say: ['Je compare les hébergeurs. Tous se disent « verts »… Mais entre une énergie renouvelable réelle et des certificats achetés, il y a un monde. Tu sais les distinguer ?'], act: ['quest:qs_comparatif', 'puzzle:comparatif'] },
      { if: '!done:qs_comparatif', mark: 'quest', say: ['On reprend le comparatif ?'], act: ['puzzle:comparatif'] },
      { say: ['Méfie-toi des « 300 % vert » : c’est de la compensation, pas de l’électricité verte branchée sur les serveurs.'] },
    ] },
  calculo: { id: 'calculo', name: 'Calculo', kind: 'robot', inv: ['M3-27', 'M2-81'],
    talk: [
      { if: '!quest:qs_calcul', mark: 'quest', say: ['BZZT. Je calcule l’empreinte des sites web. Veux-tu alléger celui de la mairie ? 50 000 visiteurs par mois…'], act: ['quest:qs_calcul', 'puzzle:calcul_site'] },
      { if: '!done:qs_calcul', mark: 'quest', say: ['BZZT. Nouveau calcul ?'], act: ['puzzle:calcul_site'] },
      { say: ['BZZT. Pour des mesures réelles : Website Carbon, Green Web Foundation, Cloud Carbon Footprint.'] },
    ] },
};

export const SCRIPTS = {
  stele_bordage: [{ say: [{ who: 'Stèle de Bordage', t: '« Il faut deux fois plus d’énergie pour transporter une donnée que pour la stocker pendant un an. »' }, { who: 'Stèle de Bordage', t: '« Plus on intervient tôt (besoin, conception, maquettage), plus l’effet de levier est fort. » — Frédéric Bordage, fondateur de GreenIT.fr.' }], act: ['codex:bordage', 'if:step:main_citadelle==1', 'step:main_citadelle:2'] }],
  'secret:serveur': [{ say: [{ who: 'Le Serveur Oublié', t: 'Un serveur ronronne seul dans le noir, allumé depuis des années. Personne ne se souvient de ce qu’il héberge… Tu l’éteins. Silence.' }], act: ['codex:dark_data', 'codex:sites_zombies'] }],
};

export const QUESTS = [
  { id: 'main_citadelle', title: 'Là où vit le cloud', region: 'citadelle', main: true, steps: [
    { t: 'Parle à l’ingénieure Calorine', at: 'calorine' }, { t: 'Lis la stèle de Bordage', at: 'stele_bordage' }, { t: 'Convaincs le gardien Racko', at: 'racko' }, { t: 'Traverse la Salle des Machines', at: 'temple_machines' }, 'Replante la Graine-Mère'] },
  { id: 'qs_zombies', title: 'Les zombies 404', region: 'citadelle', giver: 'webarchiviste', steps: [{ t: 'Aide Lazare à décommissionner les sites zombies', at: 'webarchiviste' }], reward: { graines: 15 } },
  { id: 'qs_comparatif', title: 'Le comparatif', region: 'citadelle', giver: 'courtiere', steps: [{ t: 'Compare les hébergeurs avec la Courtière', at: 'courtiere' }], reward: { heart: true } },
  { id: 'qs_calcul', title: 'Le calculateur', region: 'citadelle', giver: 'calculo', steps: [{ t: 'Allège le site de la mairie avec Calculo', at: 'calculo' }], reward: { graines: 15 } },
];

export const PUZZLES = {
  dc_pue: { type: 'sliders', title: 'Salle 1 — Le tableau de bord du PUE', region: 'citadelle', icon: '🌡', inv: ['M3-25', 'M4-13'],
    intro: 'Les serveurs consomment **1 000 kW**. Réduis la consommation du refroidissement et des annexes pour atteindre un **PUE ≤ 1,2**, sans dépasser **27 °C** en entrée de serveurs (recommandations ASHRAE : 18-27 °C).',
    sliders: [{ label: 'Température de consigne en entrée de serveurs (°C)', min: 16, max: 32, step: 1, init: 18 }, { label: 'Free cooling (air extérieur) — % du temps', min: 0, max: 90, step: 10, init: 0 }, { label: 'Confinement des allées chaudes/froides (0 = non, 1 = oui)', min: 0, max: 1, step: 1, init: 0 }],
    calc: ([t, fc, conf]) => {
      const cooling = Math.max(60, 800 - (t - 16) * 45 - fc * 4.5 - conf * 120);
      const pue = (1000 + cooling + 60) / 1000;
      const ok = pue <= 1.2 && t <= 27;
      return { ok, display: `Refroidissement : **${Math.round(cooling)} kW** · PUE = (1 000 + ${Math.round(cooling)} + 60) / 1 000 = **${pue.toFixed(2)}**${t > 27 ? ' · ⚠ trop chaud pour les serveurs' : ''}`, msg: t > 27 ? 'Au-delà de 27 °C, les serveurs surchauffent.' : 'PUE encore trop élevé.' };
    },
    hints: ['Remonter la consigne de quelques degrés économise beaucoup de refroidissement.', 'Le free cooling utilise l’air extérieur quand il fait frais.'],
    explain: '**PUE = énergie totale / énergie informatique**. Les meilleurs centres atteignent 1,1 à 1,2 ; la moyenne mondiale tourne autour de 1,5-1,6 (Uptime Institute). Mais un bon PUE ne dit rien de l’**utilité** des calculs, ni du **carbone** de l’électricité, ni de l’**eau** consommée (indicateur WUE).' },
  dc_hebergeur: { type: 'match', title: 'Salle 2 — Vrai ou faux hébergement vert ?', region: 'citadelle', icon: '🏢', inv: ['M3-26', 'M2-80'],
    intro: 'Classe chaque pratique : **réduit réellement l’impact** ou **affichage trompeur** ?',
    cats: ['Réduit réellement l’impact', 'Affichage trompeur ou insuffisant'],
    items: [
      { t: 'Électricité bas carbone fournie localement, heure par heure', cat: 0 },
      { t: '« 300 % vert » grâce à des crédits carbone achetés', cat: 1 },
      { t: 'Récupération de la chaleur pour un réseau de chaleur urbain', cat: 0 },
      { t: 'Serveurs renouvelés tous les 2 ans pour être « plus efficaces »', cat: 1 },
      { t: 'PUE mesuré et publié, avec WUE (eau) et facteur carbone', cat: 0 },
      { t: '« Neutre en carbone » sans réduction mesurée des émissions', cat: 1 },
    ],
    hints: ['La compensation ne réduit pas les émissions à la source.', 'Renouveler trop vite le matériel fait exploser l’impact de fabrication.'],
    explain: 'Critères d’un hébergement responsable : PUE et WUE faibles et publiés, électricité réellement bas carbone, récupération de chaleur, refroidissement naturel, matériel utilisé longtemps, localisation proche des utilisateurs, transparence (certifications ISO 50001, Code de conduite européen des centres de données).' },
  dc_chaleur: { type: 'qcm', title: 'Salle 3 — La chaleur fatale', region: 'citadelle', icon: '🔥', inv: ['M2-83', 'M2-63', 'M3-25'],
    questions: [
      { q: 'Qu’est-ce que la « chaleur fatale » d’un centre de données ?', options: ['La chaleur produite par les serveurs, perdue si on ne la récupère pas', 'Une panne de climatisation', 'La température maximale des processeurs'], a: 0, explain: 'Elle peut chauffer des logements, piscines ou serres.' },
      { q: 'Quel indicateur mesure la consommation d’eau d’un centre de données ?', options: ['Le WUE (Water Usage Effectiveness)', 'Le PUE', 'L’EcoIndex'], a: 0, explain: 'WUE = litres d’eau par kWh informatique. Le CUE mesure le carbone.' },
      { q: 'Combien d’électricité les centres de données du monde ont-ils consommé en 2024 (AIE) ?', options: ['Environ 415 TWh', 'Environ 4 TWh', 'Environ 41 500 TWh'], a: 0, explain: 'Environ 1,5 % de l’électricité mondiale, et plus du double attendu en 2030.' },
      { q: 'En France, la fiscalité réduite sur l’électricité des centres de données (TICFE/accise) est conditionnée à…', options: ['Des engagements de gestion de l’énergie et de valorisation de la chaleur', 'Rien du tout', 'L’utilisation exclusive du charbon'], a: 0, explain: 'Le tarif réduit est assorti d’exigences (système de management de l’énergie, adhésion à un programme de bonnes pratiques, valorisation de la chaleur fatale ou objectifs de performance).' },
    ] },
  zombies_decom: { type: 'order', title: 'Décommissionner un site zombie', region: 'citadelle', main: false, icon: '🧟', inv: ['M2-82'],
    label: 'Remets les étapes de la fermeture propre d’un site dans l’ordre :',
    items: ['Informer les utilisateurs avec un message clair', 'Archiver ce qui doit l’être (version statique minimaliste)', 'Rediriger les adresses (redirections 301)', 'Éteindre les serveurs et supprimer les bases de données'],
    onWin: ['done:qs_zombies', 'codex:sites_zombies', 'spawn:zombie,2'],
    explain: 'Fermer proprement, c’est un acte responsable : un serveur inutile éteint, c’est environ **500 kWh** économisés par an (≈ 50 kg CO₂e avec un mix électrique moyen, bien moins en France).' },
  comparatif: { type: 'match', title: 'Le comparatif des hébergeurs', region: 'citadelle', main: false, icon: '📋', inv: ['M3-26', 'M2-83'],
    intro: 'Associe chaque fiche à ce qu’elle décrit vraiment. (Les informations sur les entreprises sont celles qu’elles déclarent, citées par l’ancien cours.)',
    cats: ['Énergie réellement renouvelable', 'Compensation / certificats', 'Efficacité du refroidissement', 'Hébergement standard'],
    items: [
      { t: 'Infomaniak (Suisse) : électricité hydraulique, PUE annoncé ≈ 1,09', cat: 0 },
      { t: 'GreenGeeks (États-Unis) : « 300 % vert » via des crédits d’énergie', cat: 1 },
      { t: 'OVHcloud (France) : refroidissement à eau (watercooling), PUE annoncé ≈ 1,2', cat: 2 },
      { t: 'PlanetHoster (Canada) : compensation carbone à 140 %', cat: 1 },
      { t: 'Hébergeur inconnu : PUE > 2, électricité issue de charbon et de gaz', cat: 3 },
    ],
    onWin: ['done:qs_comparatif', 'codex:hebergement_vert'],
    explain: 'Un centre alimenté au charbon peut émettre plusieurs dizaines de fois plus de CO₂ qu’un centre alimenté par une électricité bas carbone pour la même puissance (l’ancien cours disait ×40). Pour vérifier : l’outil de la **Green Web Foundation**.' },
  calcul_site: { type: 'sliders', title: 'Le calculateur de Calculo', region: 'citadelle', main: false, icon: '🧮', inv: ['M3-27', 'M2-81'],
    intro: 'Le site de la mairie reçoit **50 000 visiteurs par mois**. Fais passer son empreinte annuelle **sous 600 kg CO₂e** en gardant un site utile (**au moins 2 pages** par visite). *Modèle simplifié : ≈ 0,2 g + 0,4 g par Mo transféré, pour chaque page vue.*',
    sliders: [{ label: 'Pages vues par visite', min: 1, max: 6, step: 1, init: 4 }, { label: 'Poids moyen d’une page (Mo)', min: 0.2, max: 4, step: 0.1, init: 2.4 }],
    calc: ([p, w]) => { const g = 0.2 + 0.4 * w; const kg = 50000 * 12 * p * g / 1000; const ok = kg <= 600 && p >= 2; return { ok, display: `${p} pages × ${w.toFixed(1)} Mo → **${Math.round(kg)} kg CO₂e/an** (≈ ${Math.round(kg * 6.5).toLocaleString('fr-FR')} km en voiture thermique)`, msg: p < 2 ? 'Un site d’une seule page ne répond pas aux besoins.' : 'Encore trop lourd !' }; },
    onWin: ['done:qs_calcul', 'codex:calcul_site'],
    hints: ['Le poids des pages est le premier levier.', 'Une navigation claire réduit aussi le nombre de pages inutiles.'],
    explain: 'L’ancien cours disait qu’un site visité 1 million de fois par mois pouvait économiser 1,2 t CO₂e/an en s’allégeant de 1 Mo. Ces calculs dépendent fortement du modèle : **80 % de l’impact d’usage** vient souvent des terminaux des utilisateurs, et un site lourd pousse à changer d’appareil.' },
};

export const MURALS = {
  datacenters: { title: 'Fresque — La croissance des centres de données', inv: ['M3-25'], codex: ['datacenters'],
    chart: { type: 'bars', title: 'Électricité des centres de données dans le monde (TWh)', labels: ['2024', '2030 (scénario de base AIE)'], values: [415, 945], unit: ' TWh', colors: ['#2f6ab0', '#c0392b'] },
    text: 'En 2024, environ **415 TWh** (≈ 1,5 % de l’électricité mondiale), dont 45 % aux États-Unis, 25 % en Chine et 15 % en Europe. En 2030 : environ **945 TWh**, un peu moins de 3 % de l’électricité mondiale, portés par les serveurs accélérés pour l’IA (+30 % par an).\n\n*L’ancien cours citait 416 TWh, « plus que le Royaume-Uni », et « 2 % du CO₂ mondial » (estimation à prendre avec prudence).*',
    source: 'Agence internationale de l’énergie, *Energy and AI* (avril 2025).' },
};

export const CODEX = {
  datacenters: { region: 'citadelle', title: 'Les centres de données', inv: ['M3-25'], text: '≈ **415 TWh** d’électricité en 2024 (≈ 1,5 % de l’électricité mondiale), ≈ **945 TWh** attendus en 2030 selon l’AIE. Un grand centre de données dédié à l’IA peut consommer autant que 100 000 foyers ; les plus grands en construction, 20 fois plus.\n\nLes géants du numérique signent des contrats avec des centrales nucléaires et investissent dans les petits réacteurs modulaires.', source: 'AIE, *Energy and AI* (2025).' },
  pue: { region: 'citadelle', title: 'PUE, WUE, CUE', inv: ['M3-25', 'M4-13'], text: '**PUE** (Power Usage Effectiveness) = énergie totale / énergie des équipements informatiques. 1,0 = parfait (impossible) ; < 1,3 = excellent ; > 2 = mauvais. Moyenne mondiale ≈ 1,5-1,6.\n**WUE** = litres d’eau / kWh informatique.\n**CUE** = kg CO₂e / kWh informatique (dépend du mix électrique).\n\nLimite : ces indicateurs mesurent l’efficacité de l’infrastructure, pas l’utilité des calculs.', source: 'The Green Grid ; Uptime Institute, *Global Data Center Survey*.' },
  chaleur_fatale: { region: 'citadelle', title: 'La chaleur fatale', inv: ['M2-83', 'M2-63'], text: 'Toute l’électricité consommée par un serveur finit en chaleur. La récupérer (réseaux de chaleur urbains, piscines, serres, logements) évite de brûler d’autres énergies.\n\nExemple cité par l’ancien cours : **Qarnot**, des serveurs-radiateurs qui chauffent gratuitement des logements sociaux (l’électricité est payée par l’entreprise de calcul).\n\nEn France, le tarif réduit d’accise sur l’électricité (ex-TICFE) des centres de données est conditionné à des exigences énergétiques, dont la valorisation de la chaleur.', source: 'Ancien cours ; Code des impositions sur les biens et services.' },
  hebergement_vert: { region: 'citadelle', title: 'Choisir un hébergeur', inv: ['M3-26', 'M2-80', 'M2-83'], text: 'Critères : PUE optimisé, électricité réellement renouvelable ou bas carbone, récupération de chaleur, refroidissement naturel, certifications (ISO 50001, ISO 14001), localisation proche des utilisateurs (CDN), durée de vie des serveurs, transparence.\n\nFiches citées par l’ancien cours (déclarations des entreprises) : Infomaniak (Suisse, hydraulique, PUE ≈ 1,09), OVHcloud (France, watercooling, PUE ≈ 1,2, ISO 50001), PlanetHoster (Canada, compensation 140 %), GreenGeeks (États-Unis, « 300 % » via des crédits). ⚠ Compensation ≠ réduction. Outil : Green Web Foundation (Green Web Check).', source: 'Ancien cours ; The Green Web Foundation.' },
  sites_zombies: { region: 'citadelle', title: 'Les sites zombies', inv: ['M2-82'], text: 'Sites abandonnés mais toujours en ligne. L’ancien cours avançait « environ 30 % des sites hébergés » (estimation à prendre avec prudence). Fermeture propre : informer les utilisateurs, archiver si nécessaire, rediriger (301), éteindre les serveurs. Un serveur éteint ≈ 500 kWh/an économisés.', source: 'Ancien cours.' },
  calcul_site: { region: 'citadelle', title: 'Estimer l’empreinte d’un site', inv: ['M3-27', 'M2-81'], text: 'Modèles simples : visiteurs × pages vues × facteur par page (l’ancien cours utilisait ≈ 0,5 g CO₂e par page vue). Les outils réels (Website Carbon, EcoIndex, Cloud Carbon Footprint) utilisent des modèles plus fins.\n\nDans la phase d’usage, environ **80 %** de l’impact vient des terminaux des utilisateurs et 20 % des serveurs (ancien cours) : un site lourd pénalise d’abord les visiteurs… et leurs appareils.', source: 'Ancien cours ; Website Carbon Calculator ; EcoIndex.' },
  bordage: { region: 'citadelle', title: 'Frédéric Bordage', inv: ['M2-73', 'M3-13'], text: 'Fondateur de GreenIT.fr et du Collectif Numérique Responsable. Deux citations clés du cours :\n« Il faut deux fois plus d’énergie pour transporter une donnée que pour la stocker pendant un an. »\n« Plus on intervient tôt (besoin, conception, maquettage), plus l’effet de levier est fort en termes de réduction de l’empreinte environnementale. »', source: 'GreenIT.fr.' },
};

export const STATEMENTS = [
  { id: 'c_neutre', r: 'citadelle', v: false, t: 'Un hébergeur « neutre en carbone » n’émet rien.', x: 'Il compense (crédits, plantations) : ses émissions réelles existent toujours.', inv: ['M3-26'] },
  { id: 'c_pue1', r: 'citadelle', v: false, t: 'Un PUE de 1,0, c’est facile à atteindre.', x: 'C’est la limite théorique : il faudrait zéro énergie pour le refroidissement et les annexes.', inv: ['M3-25'] },
  { id: 'c_zombie', r: 'citadelle', v: false, t: 'Un site abandonné ne consomme plus rien.', x: 'S’il reste hébergé, ses serveurs tournent toujours.', inv: ['M2-82'] },
  { id: 'c_415', r: '*', v: true, t: 'Les centres de données ont consommé environ 415 TWh en 2024.', x: 'Exact, selon l’AIE (≈ 1,5 % de l’électricité mondiale).', inv: ['M3-25'] },
  { id: 'c_puedef', r: 'citadelle', v: true, t: 'Le PUE, c’est l’énergie totale divisée par l’énergie des serveurs.', x: 'Exact.', inv: ['M3-25'] },
  { id: 'c_chaleur', r: 'citadelle', v: true, t: 'La chaleur des serveurs peut chauffer des logements.', x: 'Exact : c’est la récupération de chaleur fatale.', inv: ['M2-83'] },
  { id: 'c_2030', r: 'citadelle', v: true, t: 'La consommation des centres de données pourrait plus que doubler d’ici 2030.', x: 'Exact, selon l’AIE (≈ 945 TWh).', inv: ['M3-25'] },
];

export const COMBAT = [
  { id: 'c_pue_good', r: 'citadelle', q: 'Quel PUE est excellent ?', options: ['1,15', '2,5', '0,8', '5'], a: 0, explain: '< 1,3 est excellent ; < 1 est impossible.' },
  { id: 'c_wue', r: 'citadelle', q: 'Que mesure le WUE ?', options: ['La consommation d’eau', 'Le poids d’une page', 'Le carbone', 'Le bruit'], a: 0, explain: 'Litres par kWh informatique.' },
  { id: 'c_compens', r: 'citadelle', q: 'Un hébergeur « 300 % vert » via des crédits…', options: ['Compense, mais ne réduit pas ses émissions à la source', 'Produit 3 fois plus d’énergie qu’il n’en consomme', 'N’émet aucun CO₂', 'Fonctionne à l’énergie solaire la nuit'], a: 0, explain: 'Compensation ≠ réduction.' },
];

export const ON_ENTER = { citadelle: ['quest:main_citadelle'] };
export const ON_SEED = { citadelle: ['done:main_citadelle', 'toast:La **Lentille de Mesure** révèle le vrai chemin au nord : le **Désert des Oracles** t’attend.'] };
