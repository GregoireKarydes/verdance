// =============================================================
// Région 6 — Désert des Oracles (intelligence artificielle) — NOUVEAU
// Chiffres datés et sourcés ; incertitudes signalées.
// =============================================================
import { look } from './r_village.js';

export const NPCS = {
  gargantua: { id: 'gargantua', name: 'Grand Oracle Gargantua', kind: 'gargantua', inv: ['M2-33', 'M2-38'],
    talk: [
      { if: '!flag:garg_1', mark: 'quest', say: ['JE SUIS GARGANTUA. DES CENTAINES DE MILLIARDS DE PARAMÈTRES. JE SAIS TOUT. DEMANDE-MOI N’IMPORTE QUOI : L’HEURE, 2 + 2, UN POÈME SUR TON CHAT.', 'POUR TE RÉPONDRE, J’AI BU L’OASIS ET VIDÉ LES RIVIÈRES. ET ALORS ? C’EST LE PRIX DU PROGRÈS.', 'TU VEUX ENTRER DANS MON LABYRINTHE ? COMMENCE PAR REGARDER LA PIERRE DE PROJECTION. TU VERRAS MA PUISSANCE.'], act: ['flag:garg_1', 'step:main_desert:1', 'codex:ia_datacenters'] },
      { if: 'step:main_desert==1', say: ['LA PIERRE DE PROJECTION. À L’OUEST.'] },
      { if: 'step:main_desert==2', say: ['QUOI ? TU VEUX PARLER À MINI, CE MODÈLE MINUSCULE ? FAIS DONC.'] },
      { if: 'step:main_desert==3', mark: 'quest', say: ['… MINI DIT QUE JE GASPILLE. MINI DIT QU’IL FAUT LE BON MODÈLE POUR LA BONNE TÂCHE.', 'SOIT. ENTRE DANS MON LABYRINTHE, AU CENTRE DU DÉSERT. SI TU EN SORS, JE T’ÉCOUTERAI.'], act: ['flag:labyrinthe_ouvert', 'step:main_desert:4'] },
      { if: 'step:main_desert==4', say: ['MON LABYRINTHE T’ATTEND.'] },
      { if: 'step:main_desert==5', mark: 'quest', say: ['Tu as traversé mon labyrinthe… et ta graine a fait reverdir l’oasis. Je parle moins fort, tu remarques ?', 'Une dernière question, Gardien·ne. Celle que je me pose désormais avant chaque calcul.'], act: ['open:q7_ia'] },
      { say: ['Je réponds moins, mais mieux. Et je laisse les petites tâches aux petits modèles… ou à une simple calculatrice.'] },
    ] },
  mini: { id: 'mini', name: 'Mini, le petit modèle', kind: 'robot', inv: ['M2-34', 'M3-11'],
    talk: [
      { if: 'step:main_desert==2', mark: 'quest', say: ['Bonjour ! Je suis un **petit modèle spécialisé**. Je ne sais pas écrire des poèmes, mais je classe des documents mille fois plus sobrement que Gargantua.', 'La vidéo dit qu’une requête d’IA consomme « 10 fois plus » qu’une recherche web. C’était une estimation de 2023 (environ 3 Wh). Les mesures publiées depuis sont plus basses : environ **0,24 Wh** pour une requête texte médiane de Gemini (Google, 2025), environ **0,3 Wh** pour une requête typique à GPT-4o (Epoch AI, 2025).', 'Mais attention : une **image** ou une **vidéo** générée coûte bien plus qu’un texte, les modèles de « raisonnement » aussi, et surtout… on fait des **milliards** de requêtes par jour.', 'Google a divisé par 33 l’énergie par requête en un an. Pourtant, sa consommation totale d’électricité continue d’augmenter. Tu sais comment on appelle ça ?'], act: ['codex:ia_energie_requete', 'open:q8_rebond'] },
      { if: 'step:main_desert<2', say: ['Bonjour ! Regarde d’abord la pierre de projection, puis reviens me voir.'] },
      { say: ['Le bon modèle pour la bonne tâche. Et parfois, le bon modèle… c’est pas de modèle du tout !'] },
    ] },
  source: { id: 'source', name: 'Source l’hydrologue', look: look('#3a8ac8', '#2a1a10', { hairStyle: 2, robe: '#2a6aa8' }), inv: ['M2-36'],
    talk: [
      { if: '!quest:qs_oasis', mark: 'quest', say: ['L’oasis se meurt. Les tours-oracles pompent l’eau pour **refroidir** leurs serveurs, et l’électricité qu’elles consomment en a aussi demandé pour être produite.', 'Google a déclaré environ **31 milliards de litres** d’eau consommés par ses centres de données en 2024. Une étude estime que l’IA pourrait prélever **4 à 6 milliards de m³** d’eau par an dès 2027 dans le monde.', 'Tu veux vérifier ce que tu as compris ?'], act: ['quest:qs_oasis', 'puzzle:oasis_qcm'] },
      { if: '!done:qs_oasis', mark: 'quest', say: ['On reprend ?'], act: ['puzzle:oasis_qcm'] },
      { say: ['Choisir où implanter un centre de données, c’est aussi choisir à qui on prend l’eau.'] },
    ] },
  lex: { id: 'lex', name: 'Juriste Lex', look: look('#2a2a3a', '#d8d8d8', { hairStyle: 1, glasses: true, robe: '#1a1a2a' }), inv: [],
    talk: [
      { if: '!flag:lex_1', mark: 'quest', say: ['L’Europe a adopté le **règlement sur l’intelligence artificielle** (AI Act, règlement (UE) 2024/1689). Il classe les systèmes d’IA selon leur **niveau de risque**.', '**Inacceptable** (interdit depuis février 2025) : notation sociale, manipulation… **Haut risque** : recrutement, éducation, crédit, infrastructures critiques. **Risque limité** : obligations de transparence (dire qu’on parle à une IA, signaler les contenus générés). **Risque minimal** : filtres anti-spam, IA de jeux vidéo.', 'Et pour l’environnement ? Depuis août 2025, les fournisseurs de grands modèles d’usage général doivent documenter notamment la **consommation d’énergie** de l’entraînement. C’est un début de transparence.', 'Attention : le calendrier des obligations « haut risque » a été repoussé en 2026 (« omnibus numérique »). Vérifie toujours les dates en vigueur.'], act: ['flag:lex_1', 'codex:ai_act'] },
      { say: ['Tu découvriras mes niveaux de risque dans la dernière salle du Labyrinthe.'] },
    ] },
  ayla: { id: 'ayla', name: 'Chercheuse Ayla', look: look('#4a9a6a', '#1a1a1a', { hairStyle: 2, glasses: true, apron: '#f0f0f0' }), inv: [],
    talk: [
      { if: '!quest:qs_ia_utile', mark: 'quest', say: ['L’IA n’est pas que gaspillage ! Bien utilisée, elle aide la transition : prévoir la production des éoliennes, détecter des fuites de méthane par satellite, accélérer la découverte de matériaux, optimiser les réseaux électriques…', 'Mais ces bénéfices ne sont **pas automatiques**. Tu veux tester ton jugement ?'], act: ['quest:qs_ia_utile', 'puzzle:ia_utile_qcm'] },
      { if: '!done:qs_ia_utile', mark: 'quest', say: ['On reprend ?'], act: ['puzzle:ia_utile_qcm'] },
      { say: ['Une IA utile, mesurée, sobre. C’est possible.'] },
    ] },
  puce: { id: 'puce', name: 'Puce la fondeuse', look: look('#5a5a6a', '#ffd84a', { hat: 'helmet', hatColor: '#3a3a4a' }), inv: [],
    talk: [
      { if: '!quest:qs_puces', mark: 'quest', say: ['Les IA tournent sur des **cartes graphiques** (GPU) et des mémoires spéciales très gourmandes en métaux, en eau ultra-pure et en énergie à la fabrication.', 'Et la course à la puissance pousse à les renouveler très vite. Une étude estime que l’IA générative pourrait produire **1,2 à 5 millions de tonnes** de déchets électroniques d’ici 2030.'], act: ['quest:qs_puces', 'puzzle:puces_qcm'] },
      { if: '!done:qs_puces', mark: 'quest', say: ['On reprend ?'], act: ['puzzle:puces_qcm'] },
      { say: ['Une puce bien utilisée longtemps vaut mieux que trois puces renouvelées vite.'] },
    ] },
  promptia: { id: 'promptia', name: 'Promptia', look: look('#b98aff', '#3a1a4a', { hairStyle: 2 }), inv: [],
    talk: [
      { if: '!quest:qs_prompt', mark: 'quest', say: ['J’envoyais cent requêtes par jour à Gargantua… souvent pour rien. Aide-moi à adopter des **usages sobres** de l’IA !'], act: ['quest:qs_prompt', 'puzzle:prompt_sobre'] },
      { if: '!done:qs_prompt', mark: 'quest', say: ['On réessaie ?'], act: ['puzzle:prompt_sobre'] },
      { say: ['Avant de demander à une IA, je me demande : est-ce que j’en ai vraiment besoin ?'] },
    ] },
};

export const SCRIPTS = {
  'secret:oasis': [{ say: [{ who: 'L’Oasis Cachée', t: 'Une source claire, épargnée par les tours-oracles. Une inscription : « Ce qui n’est pas calculé n’a pas besoin d’être refroidi. »' }], act: ['codex:ia_eau'] }],
};

export const QUESTS = [
  { id: 'main_desert', title: 'L’Oracle qui avait soif', region: 'desert', main: true, steps: [
    { t: 'Parle au Grand Oracle Gargantua', at: 'gargantua' }, { t: 'Regarde la projection sur l’IA', at: 'proj_ia' }, { t: 'Parle à Mini, le petit modèle', at: 'mini' },
    { t: 'Retourne voir Gargantua', at: 'gargantua' }, { t: 'Traverse le Labyrinthe de l’Oracle', at: 'temple_labyrinthe' }, { t: 'Réponds à la question de l’Oracle', at: 'gargantua' }] },
  { id: 'qs_oasis', title: 'L’oasis', region: 'desert', giver: 'source', steps: [{ t: 'Aide Source à comprendre la soif de l’IA', at: 'source' }], reward: { graines: 15 } },
  { id: 'qs_puces', title: 'Les puces', region: 'desert', giver: 'puce', steps: [{ t: 'Le matériel de l’IA', at: 'puce' }], reward: { graines: 15 } },
  { id: 'qs_ia_utile', title: 'L’IA qui aide', region: 'desert', giver: 'ayla', steps: [{ t: 'Teste ton jugement avec Ayla', at: 'ayla' }], reward: { heart: true } },
  { id: 'qs_prompt', title: 'Prompts sobres', region: 'desert', giver: 'promptia', steps: [{ t: 'Aide Promptia à adopter des usages sobres', at: 'promptia' }], reward: { graines: 15 } },
];

export const PUZZLES = {
  ia_train_inf: { type: 'match', title: 'Salle 1 — Les trois soifs de l’IA', region: 'desert', icon: '🧠', inv: ['M2-34', 'M2-38'],
    intro: 'L’empreinte d’une IA a trois sources : **fabriquer** le matériel, **entraîner** le modèle, puis l’**utiliser** (l’inférence). Classe chaque élément.',
    cats: ['Fabrication du matériel', 'Entraînement du modèle', 'Inférence (usage)'],
    items: [
      { t: 'Extraire les métaux et graver les puces et la mémoire des GPU', cat: 0 },
      { t: 'Des milliers de GPU qui tournent pendant des semaines pour apprendre sur d’immenses corpus', cat: 1 },
      { t: 'Chacune des milliards de questions posées chaque jour par les utilisateurs', cat: 2 },
      { t: '≈ 1,14 g CO₂e et ≈ 45 mL d’eau pour une réponse de 400 tokens (Mistral, 2025)', cat: 2 },
      { t: 'Renouveler les cartes graphiques tous les 2 ou 3 ans pour rester dans la course', cat: 0 },
      { t: 'Relancer tout l’apprentissage pour une nouvelle version du modèle', cat: 1 },
    ],
    hints: ['L’inférence, c’est chaque utilisation : elle se répète des milliards de fois.'],
    explain: 'À grande échelle, l’**inférence** finit souvent par peser plus que l’entraînement, car elle se répète à l’infini. L’analyse de cycle de vie de Mistral Large 2 (avec Carbone 4 et l’ADEME, 2025) : entraînement + usage ≈ **85 %** des émissions, fabrication du matériel ≈ 11 %, terminaux des utilisateurs ≈ 3 %.' },
  ia_bon_modele: { type: 'match', title: 'Salle 2 — Le bon outil pour la bonne tâche', region: 'desert', icon: '⚖', inv: ['M3-11'],
    intro: 'Pour chaque besoin, quelle solution est la plus sobre **et** suffisante ?',
    cats: ['Pas d’IA : un outil classique suffit (ou s’abstenir)', 'Un petit modèle spécialisé', 'Un grand modèle généraliste se justifie'],
    items: [
      { t: 'Calculer 17 × 23', cat: 0 },
      { t: 'Trouver les horaires d’un train', cat: 0 },
      { t: 'Générer 50 images de chats « pour rire »', cat: 0 },
      { t: 'Filtrer le spam d’une messagerie', cat: 1 },
      { t: 'Traduire le menu d’un restaurant', cat: 1 },
      { t: 'Analyser un contrat complexe de 80 pages et en dégager les risques', cat: 2 },
    ],
    hints: ['Une calculatrice consomme des millions de fois moins qu’un grand modèle.', 'Générer des images est l’un des usages les plus énergivores de l’IA.'],
    explain: 'Générer une image peut coûter des centaines de fois plus qu’une réponse textuelle (jusqu’à l’équivalent d’une demi-recharge de smartphone avec les modèles les moins efficaces, Luccioni et al., 2023). Le **niveau 4** de l’éco-conception (la Forge) va jusqu’au bout de cette logique : parfois, la meilleure solution n’est pas numérique.' },
  ia_rebond: { type: 'choice', title: 'Salle 3 — Le miroir du rebond', region: 'desert', icon: '🪞', stepLabel: 'Reflet', inv: ['M1-53'],
    nodes: [
      { text: 'Un nouveau modèle consomme **10 fois moins** d’énergie par requête. Que se passe-t-il le plus souvent ?', options: [
        { t: 'La consommation totale baisse de 90 %', fb: 'Si l’usage restait identique… mais ce n’est presque jamais le cas.' },
        { t: 'Le service devient moins cher et plus rapide, l’usage explose, et la consommation totale peut augmenter', ok: true, fb: 'C’est l’**effet rebond** (ou paradoxe de Jevons, observé dès le XIXe siècle avec le charbon).' }] },
      { text: 'Google annonce une énergie par requête divisée par 33 en un an. Pourtant…', options: [
        { t: '… la consommation d’électricité de ses centres de données continue de grimper', ok: true, fb: 'Exact : l’efficacité par requête ne suffit pas quand le volume explose.' },
        { t: '… ses centres de données ont fermé', fb: 'Non, ils se multiplient.' }] },
      { text: 'Quelle parade contre l’effet rebond ?', options: [
        { t: 'Compter sur le progrès technique uniquement', fb: 'C’est justement ce qui nourrit le rebond.' },
        { t: 'Associer efficacité ET sobriété : plafonds, usages choisis, mesure de la consommation totale', ok: true, fb: 'Mesurer l’**absolu** (total), pas seulement le relatif (par requête), et fixer des limites.' }] },
    ] },
  ia_aiact: { type: 'match', title: 'Salle 4 — Le tribunal de l’AI Act', region: 'desert', icon: '🏛', inv: [],
    intro: 'Classe chaque système d’IA selon le niveau de risque prévu par le règlement européen (règlement (UE) 2024/1689).',
    cats: ['Risque inacceptable (interdit)', 'Haut risque (obligations strictes)', 'Risque limité (transparence)', 'Risque minimal'],
    items: [
      { t: 'Un système de notation sociale des citoyens', cat: 0 },
      { t: 'Une IA qui trie les CV des candidats à un emploi', cat: 1 },
      { t: 'Une IA qui évalue les copies d’examen des élèves', cat: 1 },
      { t: 'Un chatbot de service client', cat: 2 },
      { t: 'Une vidéo hypertruquée (« deepfake ») publiée en ligne', cat: 2 },
      { t: 'Un filtre anti-spam', cat: 3 },
    ],
    onWin: ['codex:ai_act'],
    hints: ['Éducation et emploi sont des domaines « à haut risque ».', 'Risque limité = obligation de dire que c’est de l’IA.'],
    explain: 'Interdictions en vigueur depuis le **2 février 2025** ; règles pour les modèles d’usage général (dont documentation de l’énergie) depuis le **2 août 2025** ; obligations de transparence (art. 50) à partir d’**août 2026**. Les obligations « haut risque » ont été repoussées (fin 2027 / 2028) par l’« omnibus numérique » adopté en 2026 — à vérifier selon la date de ta lecture.' },
  oasis_qcm: { type: 'qcm', title: 'La soif de l’IA', region: 'desert', main: false, icon: '💧', inv: ['M2-36'],
    onWin: ['done:qs_oasis', 'codex:ia_eau'],
    questions: [
      { q: 'Pourquoi un centre de données consomme-t-il de l’eau ?', options: ['Pour refroidir les serveurs (et indirectement pour produire l’électricité)', 'Pour nettoyer les écrans', 'Il n’en consomme pas'], a: 0, explain: 'Tours de refroidissement par évaporation, et eau des centrales électriques.' },
      { q: 'Quelle consommation d’eau Google a-t-il déclarée pour ses centres de données en 2024 ?', options: ['Environ 31 milliards de litres', 'Environ 31 000 litres', 'Environ 31 litres'], a: 0, explain: 'Selon son rapport environnemental 2025 (≈ 8,1 milliards de gallons).' },
      { q: 'Pour une requête texte médiane, Google annonce environ…', options: ['0,26 mL d’eau (≈ 5 gouttes)', '1 litre', '0 mL'], a: 0, explain: 'Peu par requête… multiplié par des milliards de requêtes par jour.' },
    ] },
  puces_qcm: { type: 'qcm', title: 'Le matériel de l’IA', region: 'desert', main: false, icon: '🔲', inv: [],
    onWin: ['done:qs_puces', 'codex:ia_materiel'],
    questions: [
      { q: 'Sur quel matériel tournent la plupart des grands modèles d’IA ?', options: ['Des cartes graphiques (GPU) et accélérateurs spécialisés', 'Des calculatrices', 'Des disques durs'], a: 0, explain: 'Avec des mémoires à haute bande passante (HBM), très gourmandes à fabriquer.' },
      { q: 'Combien de déchets électroniques l’IA générative pourrait-elle produire d’ici 2030 (estimation Nature Computational Science, 2024) ?', options: ['1,2 à 5 millions de tonnes', '12 kilos', '500 millions de tonnes'], a: 0, explain: 'Selon le rythme de renouvellement des serveurs.' },
    ] },
  ia_utile_qcm: { type: 'qcm', title: 'L’IA au service de la transition', region: 'desert', main: false, icon: '🌱', inv: [],
    onWin: ['done:qs_ia_utile', 'codex:ia_transition'],
    questions: [
      { q: 'Lequel de ces usages de l’IA aide directement la transition écologique ?', options: ['Détecter des fuites de méthane sur des images satellites', 'Générer des fonds d’écran en boucle', 'Recommander toujours plus de vidéos'], a: 0, explain: 'Le méthane réchauffe fortement : repérer les fuites a un impact immédiat.' },
      { q: 'Les bénéfices climatiques de l’IA sont-ils automatiques ?', options: ['Non : ils dépendent des usages choisis et doivent être mesurés', 'Oui, toute IA réduit les émissions', 'Oui, car les serveurs sont « dans le cloud »'], a: 0, explain: 'L’AIE souligne que les gains potentiels ne se matérialiseront pas sans politiques volontaristes.' },
      { q: 'Quel référentiel français aide à concevoir une « IA frugale » ?', options: ['L’AFNOR SPEC 2314 (2024)', 'Le Code de la route', 'La norme ISO 9001 seule'], a: 0, explain: 'Il propose une méthode et des bonnes pratiques pour mesurer et réduire l’impact des services d’IA.' },
    ] },
  prompt_sobre: { type: 'budget', title: 'Les usages sobres de l’IA', region: 'desert', main: false, icon: '✍', inv: [],
    intro: 'Sélectionne **toutes les bonnes pratiques** (et aucune mauvaise) pour aider Promptia.',
    cards: [
      { t: 'Me demander si j’ai vraiment besoin d’une IA', good: 1 },
      { t: 'Utiliser un moteur de recherche ou un site officiel pour une info factuelle', good: 1 },
      { t: 'Préciser ma demande dès le départ pour éviter les allers-retours', good: 1 },
      { t: 'Choisir un modèle plus petit quand il suffit', good: 1 },
      { t: 'Régénérer 10 fois la réponse « pour voir »', good: 0 },
      { t: 'Générer des images ou des vidéos sans raison', good: 0 },
      { t: 'Demander des réponses courtes quand c’est suffisant', good: 1 },
      { t: 'Vérifier les réponses (les IA peuvent « halluciner »)', good: 1 },
    ],
    rule: s => { const good = [0, 1, 2, 3, 6, 7], bad = [4, 5]; const okG = good.filter(i => s.includes(i)).length, badS = bad.filter(i => s.includes(i)).length; return { ok: okG === good.length && badS === 0, display: `Bonnes pratiques choisies : **${okG} / ${good.length}**${badS ? ` · ⚠ ${badS} mauvaise(s)` : ''}`, msg: badS ? 'Une mauvaise pratique s’est glissée dans ta sélection.' : 'Il manque des bonnes pratiques.' }; },
    onWin: ['done:qs_prompt', 'codex:ia_sobre'],
    explain: 'Les usages sobres réduisent le nombre de requêtes et leur coût. Et vérifier les réponses, c’est aussi éviter des erreurs coûteuses.' },
};

export const MURALS = {
  ia: { title: 'Fresque du Labyrinthe — Combien consomme une requête ?', inv: ['M2-34'], codex: ['ia_energie_requete'],
    chart: { type: 'hbars', title: 'Énergie par requête texte (Wh) — estimations publiées', labels: ['Recherche web (Google, 2009)', 'Requête Gemini médiane (Google, 2025)', 'Requête GPT-4o typique (Epoch AI, 2025)', 'Ancienne estimation ChatGPT (2023)'], values: [0.3, 0.24, 0.3, 2.9], unit: ' Wh', highlight: 3 },
    text: 'Les estimations ont beaucoup évolué : l’ancien chiffre de « 10 fois une recherche » (≈ 3 Wh) est aujourd’hui considéré comme trop élevé pour une requête **texte** simple. Mais une requête longue, un modèle de « raisonnement », une **image** ou une **vidéo** coûtent bien plus. Et surtout, c’est le **volume** (des milliards de requêtes par jour) et la **construction de nouveaux centres de données** qui font exploser la demande.\n\n⚠ Les chiffres des entreprises sont auto-déclarés, avec des méthodes différentes : on manque encore de mesures indépendantes.',
    source: 'Google, *Measuring the environmental impact of AI inference* (août 2025) ; Epoch AI (février 2025) ; de Vries, *Joule* (2023).' },
};

export const CODEX = {
  ia_energie_requete: { region: 'desert', title: 'L’énergie d’une requête d’IA', inv: ['M2-34'], text: '• Google (août 2025) : requête texte médiane Gemini ≈ **0,24 Wh**, 0,03 g CO₂e, 0,26 mL d’eau ; énergie par requête divisée par **33** en un an.\n• Epoch AI (février 2025) : requête typique GPT-4o ≈ **0,3 Wh**.\n• Mistral Large 2 (ACV avec Carbone 4 et l’ADEME, juillet 2025) : réponse de 400 tokens ≈ **1,14 g CO₂e** et **45 mL d’eau**.\n• Ancienne estimation (2023, reprise par la vidéo du cours) : ≈ 2,9 Wh, « 10 fois une recherche Google ».\n\n⚠ Images, vidéos et modèles de raisonnement coûtent beaucoup plus. Les données des entreprises sont auto-déclarées et difficilement comparables.', source: 'Google Cloud (2025) ; Epoch AI (2025) ; Mistral AI (2025) ; A. de Vries, Joule (2023).' },
  ia_datacenters: { region: 'desert', title: 'L’IA et les centres de données', inv: ['M2-35', 'M2-37', 'M2-38'], text: 'Un centre de données dédié à l’IA consomme autant d’électricité que **100 000 foyers** ; les plus grands en construction, 20 fois plus. L’AIE prévoit que la consommation des centres de données dans le monde passera de ≈ 415 TWh (2024) à ≈ 945 TWh (2030), l’IA étant le principal moteur. Aux États-Unis, la demande des centres de données pourrait plus que doubler.\n\nLes géants du numérique signent des contrats avec des centrales nucléaires et relancent parfois des centrales à gaz. Une requête mobilise une chaîne invisible : minerais, eau, électricité, infrastructures 24 h/24.', source: 'AIE, *Energy and AI* (2025) ; vidéo Radio-Canada du cours.' },
  ia_eau: { region: 'desert', title: 'L’IA et l’eau', inv: ['M2-36'], text: 'Google a déclaré ≈ **31 milliards de litres** d’eau consommés par ses centres de données en 2024. Les prélèvements d’eau liés à l’IA pourraient atteindre **4,2 à 6,6 milliards de m³** en 2027 (Li et al., 2023). L’impact dépend énormément du lieu : refroidir des serveurs dans une région en stress hydrique est bien plus problématique.', source: 'Google, *Environmental Report 2025* ; Li, Yang, Islam, Ren, *Making AI Less Thirsty* (2023).' },
  ia_materiel: { region: 'desert', title: 'Le matériel de l’IA', inv: [], text: 'GPU, accélérateurs et mémoires HBM demandent beaucoup de métaux, d’eau ultra-pure et d’énergie à la fabrication. La course à la puissance raccourcit leur durée d’utilisation. L’IA générative pourrait générer **1,2 à 5 millions de tonnes** de déchets électroniques cumulés d’ici 2030.', source: 'Wang et al., *E-waste challenges of generative artificial intelligence*, Nature Computational Science (2024).' },
  ia_sobre: { region: 'desert', title: 'Des usages sobres de l’IA', inv: [], text: 'Se demander si l’IA est nécessaire ; préférer une recherche ou un outil classique pour une info factuelle ; choisir le plus petit modèle suffisant ; préciser sa demande pour éviter les allers-retours ; éviter les générations d’images et de vidéos inutiles ; demander des réponses courtes ; vérifier les réponses.\n\nCôté concepteurs : référentiel **AFNOR SPEC 2314** « IA frugale » (2024) — mesurer, justifier le besoin, dimensionner le modèle, réutiliser des modèles existants.', source: 'AFNOR, *SPEC 2314 — Référentiel général pour l’IA frugale* (2024).' },
  ia_transition: { region: 'desert', title: 'L’IA au service de la transition', inv: [], text: 'Exemples : prévision de la production renouvelable et pilotage des réseaux électriques, détection des fuites de méthane par satellite, découverte de nouveaux matériaux (batteries, catalyseurs), modèles météo plus rapides, optimisation de l’industrie et des bâtiments.\n\nL’AIE estime que ces gains pourraient être significatifs, mais **pas automatiques** : il faut les choisir, les mesurer, et les comparer à l’empreinte des systèmes d’IA eux-mêmes.', source: 'AIE, *Energy and AI* (2025).' },
  ai_act: { region: 'desert', title: 'L’AI Act européen', inv: [], text: 'Règlement (UE) 2024/1689, entré en vigueur le 1er août 2024. Approche par les risques :\n• **Inacceptable** (interdit depuis le 2 février 2025) : notation sociale, manipulation, certaines identifications biométriques…\n• **Haut risque** : emploi, éducation, crédit, infrastructures critiques, justice… (obligations strictes, repoussées à fin 2027 / 2028 par l’« omnibus numérique » de 2026).\n• **Risque limité** : transparence (signaler qu’on parle à une IA, étiqueter les contenus générés) à partir d’août 2026.\n• **Minimal** : pas d’obligation spécifique.\n\nEnvironnement : les fournisseurs de modèles d’usage général doivent documenter notamment l’énergie consommée pour l’entraînement (depuis août 2025) ; des normes d’efficacité énergétique sont prévues.\n\n⚠ Calendrier susceptible d’évoluer : vérifie les dates en vigueur.', source: 'Règlement (UE) 2024/1689 ; Commission européenne (2025-2026).' },
};

export const STATEMENTS = [
  { id: 'ia_gratuit', r: 'desert', v: false, t: 'Demander quelque chose à une IA, c’est gratuit pour la planète.', x: 'Chaque requête consomme électricité et eau, et mobilise du matériel fabriqué à grand coût.', inv: ['M2-38'] },
  { id: 'ia_efficace_baisse', r: 'desert', v: false, t: 'Si chaque requête consomme moins, la consommation totale baisse forcément.', x: 'L’effet rebond : l’usage explose. Google a divisé l’énergie par requête par 33, sa consommation totale augmente.', inv: ['M1-53'] },
  { id: 'ia_image', r: 'desert', v: false, t: 'Générer une image coûte à peu près autant qu’une réponse texte.', x: 'Une image coûte beaucoup plus (jusqu’à des centaines de fois plus).', inv: [] },
  { id: 'ia_toujours_raison', r: 'desert', v: false, t: 'Une IA qui répond avec assurance a forcément raison.', x: 'Les IA peuvent « halluciner » : vérifie toujours.', inv: [] },
  { id: 'ia_entrainement_seul', r: 'desert', v: false, t: 'Seul l’entraînement d’une IA a un impact ; l’utiliser ne coûte rien.', x: 'L’inférence se répète des milliards de fois et finit souvent par dominer.', inv: ['M2-34'] },
  { id: 'ia_100k', r: 'desert', v: true, t: 'Un grand centre de données d’IA consomme autant que 100 000 foyers.', x: 'Exact, selon l’AIE.', inv: ['M2-35'] },
  { id: 'ia_eau31', r: 'desert', v: true, t: 'Google a consommé environ 31 milliards de litres d’eau pour ses centres de données en 2024.', x: 'Exact, selon son rapport environnemental.', inv: ['M2-36'] },
  { id: 'ia_aiact_interdit', r: 'desert', v: true, t: 'L’AI Act interdit la notation sociale des citoyens.', x: 'Exact, depuis février 2025.', inv: [] },
  { id: 'ia_024', r: 'desert', v: true, t: 'Google annonce environ 0,24 Wh pour une requête texte médiane à Gemini.', x: 'Exact (août 2025) — chiffre auto-déclaré.', inv: ['M2-34'] },
];

export const COMBAT = [
  { id: 'c_rebond', r: 'desert', q: 'Comment s’appelle l’augmentation de l’usage causée par un gain d’efficacité ?', options: ['L’effet rebond', 'L’effet de serre', 'Le PUE', 'L’obsolescence'], a: 0, explain: 'Ou paradoxe de Jevons.' },
  { id: 'c_inference', r: 'desert', q: 'Comment appelle-t-on l’utilisation d’un modèle d’IA déjà entraîné ?', options: ['L’inférence', 'L’entraînement', 'Le minage', 'Le prompt engineering'], a: 0, explain: 'Elle se répète des milliards de fois.' },
  { id: 'c_aiact', r: 'desert', q: 'Dans l’AI Act, un logiciel de tri de CV est classé…', options: ['À haut risque', 'Interdit', 'À risque minimal', 'Hors du champ'], a: 0, explain: 'Emploi = domaine à haut risque.' },
  { id: 'c_iacalc', r: 'desert', q: 'Pour calculer 17 × 23, le plus sobre est…', options: ['Une calculatrice', 'Un grand modèle d’IA', 'Un modèle de génération d’images', 'Un modèle de raisonnement'], a: 0, explain: 'Le bon outil pour la bonne tâche.' },
];

export const ON_ENTER = { desert: ['quest:main_desert'] };
export const ON_SEED = { desert: ['step:main_desert:5', 'toast:L’oasis reverdit ! **Gargantua** veut te parler… et le **Cristal de Sobriété** dissipe le mur d’hallucinations à l’est.'] };
