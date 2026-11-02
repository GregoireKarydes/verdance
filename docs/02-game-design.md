# VERDANCE — Game design (v1, à valider)

> Jeu d'aventure-action 2D pixel art en vue de dessus, inspiré des Zelda classiques, pour un cours Green IT en Master 2.
> Durée : **≈ 4 h pour la quête principale, ≈ 6 h à 100 %**. Navigateur, hébergé sur GitHub Pages, sans serveur.

---

## 1. Pitch et boucle de jeu

**Le monde de Verdance a brûlé.** L'Omnium, une machine-monde qui devait « tout simplifier », a dévoré les métaux, l'eau et l'énergie jusqu'à la *Surchauffe*. Le ciel est orange, l'herbe est grise, et des créatures nées du gaspillage rôdent : fumées de CO₂, Obésiciels, Greenwasheurs, sites zombies…

Tu es l'Apprenti·e Gardien·ne, réveillé·e au pied de l'**Arbre-Mère**, un arbre mort au centre du village de la Souche. Ta mission : récupérer les **8 Graines-Mères**, une par région, puis affronter l'Omnium.

**Reverdissement progressif** (ta demande, n°8) : à chaque région terminée, la Graine-Mère est replantée.
- La région passe progressivement de cendre et rouille à vert vif : la palette change, l'herbe et les fleurs repoussent, les rivières se remettent à couler, la musique change.
- L'Arbre-Mère gagne un stade (9 stades au total, du tronc calciné à l'arbre en fleurs).
- La **jauge de Verdance** (%) est toujours visible et reflète la progression réelle.

**Boucle de jeu** : explorer → rencontrer des PNJ → accepter des quêtes → combattre des mobs → résoudre l'escape game de la région → obtenir un objet clé qui ouvre de nouveaux chemins → replanter la Graine → la région reverdit.

**Apprendre en jouant, pas en lisant :**
- Les dialogues font au maximum 2-3 lignes par bulle. Le contenu approfondi est consigné dans le **Codex**.
- Les mobs attaquent avec des idées reçues et des chiffres (voir §5).
- Le QCM est l'arme du joueur : réussir une « parade de vérité » étourdit un ennemi.
- Les longs textes du site actuel sont découpés en Archives : stèles, livres, terminaux, peintures murales redessinées.

---

## 2. Carte du monde

```
                         ┌──────────────────────────┐
                         │ 6  DÉSERT DES ORACLES     │  (IA)
                         │    Tours de Silice        │
                         └────────────┬─────────────┘
                                      │ mirages (Lentille)
┌──────────────────┐     ┌────────────┴─────────────┐     ┌──────────────────────┐
│ 3  MINES D'ABYSSE │─────│ 5  CITADELLE DES SERVEURS│─────│ 9  SANCTUAIRE DE LA   │
│ (fabrication,     │tunnel│ (data centers,          │     │    MESURE (EcoIndex,  │
│  métaux, ACV)     │noir  │  hébergement, chaleur)  │     │    KPIs) + boss final │
└────────┬─────────┘     └────────────┬─────────────┘     └──────────┬───────────┘
         │                            │ gouffre (Grappin)            │ 8 Graines
┌────────┴─────────┐     ┌────────────┴─────────────┐     ┌──────────┴───────────┐
│ 2  BASSIN DES     │─────│ 0  VILLAGE DE LA SOUCHE  │─────│ 8  FORGE DES          │
│    9 SCEAUX       │     │    Arbre-Mère (hub)      │porte│    BÂTISSEURS         │
│ (limites, inaction│     │                          │cassée│ (éco-conception)     │
└────────┬─────────┘     └────────────┬─────────────┘     └──────────┬───────────┘
         │ brouillard                 │                              │
┌────────┴─────────┐     ┌────────────┴─────────────┐     ┌──────────┴───────────┐
│ 1  STEPPES DE     │     │ 4  MARAIS DES RÉSEAUX    │─────│ 7  DÉCHARGE DE        │
│    L'HOLOCÈNE     │     │ (électricité, usages,    │gouffre│   FERRAILLE (fin de  │
│ (climat, GES)     │     │  dark data, côte)        │     │   vie, lois)         │
└──────────────────┘     └──────────────────────────┘     └──────────────────────┘
```

- **Taille** : environ 10 régions de 80×60 tuiles avec caméra défilante, plus 10 donjons intérieurs et une quinzaine de grottes ou maisons secrètes.
- **Génération** : le terrain est généré par le code de façon déterministe (même monde pour tous les élèves). Les lieux clés sont placés à la main.
- **Déplacements** : téléporteurs « Racines » entre les régions déjà reverdies, pour éviter les allers-retours fastidieux.

### Progression et ouverture du monde

L'ordre suit la compréhension du problème vers les solutions, avec de la liberté au milieu :

| Région | Condition d'accès | Objet clé obtenu | Ce que l'objet débloque |
|---|---|---|---|
| 0 Village | départ | Bâton de Sève (arme) | — |
| 1 Steppes | tutoriel fini | **Bouclier de Vérité** | parer les attaques-citations, traverser le brouillard de désinformation vers 2 |
| 2 Bassin | Bouclier | **Sceau des Limites** | ponts vers 3 et 4 (ordre libre ensuite) |
| 3 Mines | Sceau | **Lanterne Solaire** | tunnels sombres (3↔5, grottes secrètes) |
| 4 Marais | Sceau | **Grappin de Fibre** | gouffres (4→7, 0→5) |
| 5 Citadelle | Lanterne + Grappin | **Lentille de Mesure** | révèle les mirages (accès à 6) et les passages secrets |
| 7 Décharge | Grappin | **Pinces du Réparateur** | réparer les mécanismes cassés (porte de 8, coffres rouillés) |
| 6 Désert IA | Lentille | **Cristal de Sobriété** | dissipe les murs d'hallucination (accès à 9) |
| 8 Forge | Pinces | **Plan du Bâtisseur** | — |
| 9 Sanctuaire | 8 Graines + Cristal | — | boss final |

---

## 3. Les régions en détail

Pour chaque région : l'ambiance, la quête principale (QP), les quêtes secondaires (QS), l'escape game (EG), les mobs, les secrets et la durée estimée.

### 0 · Village de la Souche — Prologue et hub (15-20 min)

- **Ambiance** : village en ruine autour de l'Arbre-Mère calciné. Ciel orange.
- **PNJ**
  - *Sylve*, gardienne de l'Arbre-Mère : mentor du joueur.
  - *Archiviste Holo*, robot solaire : briefing, Codex, journal.
  - *Tavernière Baya* : quiz récurrents et classement.
- **QP « Le Réveil »**
  - Tutoriel : déplacement, attaque, dialogue, sauvegarde.
  - Premier combat contre des fumerolles de CO₂.
  - Briefing de Holo sur le paradoxe du numérique (ses 3 chiffres-clés apparaissent sur l'écran du robot).
  - L'élève reçoit son titre : Initié.
- **QS « Les trois fléaux »** : 3 villageois racontent le suréquipement, la surconsommation de données et le web obèse.

### 1 · Steppes de l'Holocène — Climat et GES (35-45 min)

- **Ambiance** : toundra grise, carottes de glace géantes plantées dans le sol, un temple de verre.
- **PNJ**
  - *Aïdan le Carottier* : lit l'histoire du climat dans la glace.
  - *Dame Serre*, gardienne du temple.
  - *Voyageuse Empreinte*.
- **QP**
  - Aïdan montre deux fresques : 100 000 ans de climat et la Grande Accélération (graphiques redessinés).
  - Pierre de projection : vidéo de Rockström (obligatoire), suivie de l'**Épreuve des Carottes**, les 8 QCM du site actuel. Les mauvaises réponses ne bloquent plus.
  - Entrée dans le Temple de la Serre.
- **EG « Temple de la Serre »**
  - Salle 1 : texte à trous du rapport GES (6 blocs).
  - Salle 2 : vannes de gaz. Il faut doser CO₂, CH₄ et N₂O pour atteindre un CO₂e cible, ce qui enseigne le PRG.
  - Salle 3 : sortir à −18 °C ou à « température clé » selon les choix faits.
  - Récompense : Bouclier de Vérité.
- **QS**
  - « L'empreinte du voyageur » : mission terrain Nos Gestes Climat, l'élève saisit son résultat et voit l'effort vers 2 t.
  - « Les eaux montantes » : carte Climate Central, puis l'élève dit ce qu'il a observé près de chez lui.
  - « Les 4 piliers » : 4 fermiers (alimentation, biens, transports, habitat).
- **Mobs**
  - Fumerolles CO₂.
  - Nuées CH₄ : rares, elles frappent ×28 plus fort sur 100 ans. Les points de vie et dégâts sont proportionnels au PRG.
  - Spectres N₂O.
- **Secret** : grotte de glace contenant le record de 2024 et le corridor des 3 millions d'années.

### 2 · Bassin des 9 Sceaux — Limites planétaires et inaction (30-40 min)

- **Ambiance** : un lac asséché entouré de 9 obélisques, dont 7 sont fissurés et rougeoient (chiffre de 2025, au lieu de 6 sur 9 dans le site actuel). Un bourg divisé.
- **PNJ**
  - *Observatrice Néva*.
  - Les trois chefs du bourg, qui se renvoient la faute :
    - *Bourgmestre Pol* (le politique) ;
    - *Négociante Marga* (l'entreprise) ;
    - *Indi le citoyen* (l'individu).
- **QP**
  - Vidéo des limites planétaires (obligatoire).
  - Visiter les 9 obélisques : chacun enseigne une limite et son état.
  - **EG « Observatoire »** :
    - le terminal de décryptage (5 réponses du site actuel, mises à jour) ;
    - une serrure à 9 cadrans « dépassée / sûre ».
  - Puis **EG « Le Tribunal du Triangle »** :
    - associer les 3 citations aux 3 acteurs ;
    - un dialogue à choix pour briser le triangle, dont les conséquences sont visibles : le bourg se réconcilie ou reste bloqué jusqu'à ce que le joueur trouve.
  - Récompense : Sceau des Limites.
- **QS**
  - « Le trou dans le ciel » : la limite de l'ozone, en voie de rétablissement, est la preuve que l'action collective fonctionne.
  - « Les zones mortes » : pêcheur et nutriments azotés.
- **Mobs**
  - Greenwasheurs : ils lancent des idées reçues que le joueur pare avec le bouclier.
  - Défricheurs, qui abattent un arbre toutes les quelques secondes si on ne les arrête pas.

### 3 · Mines d'Abysse — Fabrication du matériel et ACV (40-50 min)

- **Ambiance** : canyons rouges, tapis roulants, galeries, tableau périodique géant gravé dans la roche.
- **PNJ**
  - *Contremaître Cobalt*.
  - *Lithia la forgeronne*.
  - *Fixie la réparatrice*.
  - *Marchand Neuf-Toujours*, qui pousse à racheter.
- **QP**
  - Mur des 90 éléments, d'après EuChemS : on y trouve les 30+ éléments d'un smartphone et ceux qui sont menacés.
  - Vidéo sur la rareté des métaux (ARTE).
  - **EG « La Fonderie »** :
    - assembler un smartphone en allant chercher 8 métaux dans les bons filons (terres rares, métaux précieux, cobalt, lithium, indium…) ;
    - énigme de la balance : 16 kg de minerai pour 1 g de puce ;
    - convoyeur ACV : remettre dans l'ordre les 5 étapes, de l'extraction à la fin de vie ;
    - jauges fabrication / usage pour le smartphone, le laptop et le serveur.
  - Récompense : Lanterne Solaire.
- **QS**
  - « L'inventaire » : mission terrain, l'élève compte ses équipements et doit penser aux angles morts.
  - « Neuf ou reconditionné ? » : choix à conséquences face au marchand. Le reconditionné rapporte plus de graines et une pièce de cœur.
  - « 15 ans, 10 ans, 5 ans » : 3 machines d'époques différentes pour comprendre l'effondrement de la durée de vie.
  - « Le patch » : appliquer un patch d'éco-conception à une vieille machine, qui passe de 4 à 12 ans de durée de vie.
- **Mobs**
  - Golems de minerai.
  - Chariots fous.
  - Obsolescents : ils usent l'équipement du joueur, qui doit le réparer avant qu'il ne lâche.
- **Secret** : la mine d'or urbaine (1 tonne de smartphones recyclés).

### 4 · Marais des Réseaux — Électricité, usages, données (35-45 min)

- **Ambiance** : un marais traversé de câbles, des pylônes, une côte où affleurent les câbles sous-marins, une tour de guet.
- **PNJ**
  - *Passeur Baud*.
  - *Ondin le pêcheur de câbles*.
  - *Mémé Archiva*, qui garde tout.
  - *Vigie Diagnostic*.
- **QP**
  - Tour de guet : diagnostic global (part des GES, projections 2040, consommation électrique). Le compteur de CO₂ en temps réel, avec un scénario tendanciel et un scénario sobriété, est une machine qu'on actionne.
  - Centrale : la répartition de l'électricité française, sous forme de schéma redessiné.
  - **EG « Le Relais »** : router des paquets jusqu'au village avec un budget d'énergie limité. Il faut choisir entre ADSL, 4G et 5G, et entre streaming SD, HD et 4K. Récompense : Grappin de Fibre.
- **QS**
  - « La valise de Mémé » : les données sombres (dark data) ; il faut l'aider à trier et supprimer.
  - « Mon empreinte numérique » : mission terrain avec le calculateur de l'ADEME.
  - « 27 ans d'écran » : l'élève saisit son âge pour estimer le temps passé devant les écrans.
  - « Le pays Internet » : vidéo de synthèse et quiz.
- **Mobs**
  - Vampires de veille, invisibles sans la Lanterne.
  - Spams.
  - Méduses 5G.

### 5 · Citadelle des Serveurs — Data centers et hébergement (35-45 min)

- **Ambiance** : forteresse de racks qui bourdonne, la chaleur déforme l'air, des tours de refroidissement.
- **PNJ**
  - *Ingénieure Calorine* : récupération de la chaleur fatale, inspirée de Qarnot.
  - *Hébergeurs* rivaux, à comparer.
  - *Gardien Racko*.
- **QP**
  - **EG « Salle des machines »** :
    - répartir l'énergie entre l'informatique et le refroidissement pour atteindre un PUE de 1,2 ou moins ;
    - rediriger la chaleur vers le village, où les maisons s'allument ;
    - un vrai diagnostic d'hébergeur vert à partir de critères, et non plus au hasard comme sur le site actuel.
  - Récompense : Lentille de Mesure.
- **QS**
  - « Les zombies 404 » : décommissionner des sites zombies en 4 étapes (couper, informer, rediriger en 301, archiver en statique).
  - « Comparatif » : classer 5 hébergeurs.
  - « Le calculateur » : visiteurs × pages vues.
  - « La citation de Bordage » : transporter une donnée coûte plus que la stocker.
- **Mobs**
  - Sites zombies.
  - Élémentaires de chaleur, qui se renforcent si le PUE est mauvais.

### 6 · Désert des Oracles — Volet IA (45-55 min, entièrement nouveau)

- **Ambiance** : un désert de silice où l'eau a disparu, des tours-oracles géantes qui aspirent l'eau d'une oasis mourante, des mirages.
- **PNJ**
  - *Le Grand Oracle Gargantua* : un modèle immense et vaniteux.
  - *Mini*, un petit modèle spécialisé et efficace.
  - *Source*, l'hydrologue.
  - *Juriste Lex*, pour l'AI Act.
  - *Chercheuse Ayla*, pour l'IA utile à la transition.
- **QP**
  - Vidéo Radio-Canada (obligatoire), suivie de chiffres actualisés.
  - **EG « Labyrinthe de l'Oracle »**, en 4 salles :
    1. Entraînement ou inférence : classer des cartes énergie / eau / carbone et comprendre pourquoi l'inférence domine à grande échelle.
    2. Le bon modèle pour la bonne tâche : calcul, traduction, image, résumé. Utiliser Gargantua pour une addition vide la jauge.
    3. L'effet rebond : chaque gain d'efficacité multiplie les usages ; trouver comment le casser.
    4. Le tribunal de l'AI Act : classer 6 systèmes d'IA par niveau de risque (inacceptable, haut, limité, minimal) et identifier les obligations de transparence.
  - Récompense : Cristal de Sobriété.
- **QS**
  - « L'oasis » : eau consommée par les data centers et refroidissement.
  - « Les puces » : le matériel des GPU, les métaux et la durée de vie.
  - « L'IA qui aide » : prévision des réseaux électriques, matériaux, climat.
  - « Prompt sobre » : réécrire une demande pour qu'elle soit efficace.
  - « La question ouverte de l'Oracle » : quand l'IA générative est-elle justifiée ?
- **Mobs**
  - Hallucinations : affirmations fausses mais pleines d'assurance, à parer.
  - Spammeurs de prompts.
  - Mirages, visibles seulement avec la Lentille.

### 7 · Décharge de Ferraille — Fin de vie, e-déchets, lois (30-40 min)

- **Ambiance** : montagnes de déchets électroniques, une grue, et un tribunal improvisé dans une carcasse de serveur.
- **PNJ**
  - *Juge Durabilis*.
  - *Maître Obsolète*, l'avocat de l'obsolescence (antagoniste).
  - *Repair Café de Fixie*.
  - *Ferrailleur Ewan*.
- **QP**
  - **EG « Le Procès de l'Obsolescence »** :
    - réunir des preuves dans la décharge ;
    - les associer aux bonnes lois : AGEC, obsolescence programmée, REEN, Climat et Résilience, USB-C, droit à la réparation européen, écoconception des smartphones ;
    - les choix faits pendant le procès ont des conséquences sur le verdict, les sanctions réelles étant citées.
  - Récompense : Pinces du Réparateur.
- **QS**
  - « 62 millions de tonnes » : volume mondial des e-déchets, avec un mini-jeu de tri.
  - « Fairphone » : un appareil réparable à reconstruire.
  - « Le baromètre » : durabilité des marques.
  - « Le maire de 50 000 habitants » : la loi REEN.
- **Mobs**
  - Rats-batteries, qui explosent si on les frappe : il faut les recycler avec les Pinces.
  - Imprimantes maudites.

### 8 · Forge des Bâtisseurs — Éco-conception (55-65 min)

- **Ambiance** : un atelier d'artisans sobres. C'est la région la plus « solution » du jeu, la plus vivante une fois reverdie.
- **PNJ**
  - *Maître Sobre* : les 3 piliers et les 4 niveaux de maturité.
  - *Bibliothécaire Référence* : les 4 référentiels.
  - *Épure*, la designeuse.
  - *Rusta*, la codeuse.
  - *Conseillère Valeur* : les 5 leviers business.
  - *Truffe*, le chien K-DOG.
- **QP** : 4 ateliers dans l'ordre de la feuille de route.
  1. **Spécifications** : la grille 3U et la checklist en 6 questions.
  2. **Design** : le labo de compression d'images, Yahoo contre Google, les règles UI.
  3. **Développement** : le classement des langages, les 8 règles, les frameworks et les CMS.
  4. **Hébergement** : renvoie à la Citadelle.
  - **Boss intermédiaire « Golem Obésiciel »** (3 800 Ko) : on le fait maigrir en détruisant ses couches de gras (pubs, vidéo automatique, images, JS, polices, boutons like) jusqu'à 100 Ko.
  - **EG « L'Atelier »** : construire une page qui respecte un budget de poids en choisissant ses fonctionnalités, avec un filtre 3U.
  - Récompense : Plan du Bâtisseur.
- **QS**
  - « La bibliothèque » : les 4 référentiels.
  - « Les 4 niveaux » : IBM, Decathlon, mPedigree, K-DOG.
  - « Eco-Slash » : le mini-jeu d'arcade, jouable au clavier et au tactile.
  - « Le quiz de Baya » : les 10 QCM des bonnes pratiques.
  - « Apollo 64 Ko ».
  - « Le CMS sobre ».
- **Mobs** : Obésiciels (des blobs qui grossissent en absorbant des Ko et se divisent), carrousels maudits, trackers.

### 9 · Sanctuaire de la Mesure et boss final (35-45 min)

- **PNJ** : *Indexa la Mesureuse*, puis l'Omnium.
- **QP**
  - Mission terrain : mesurer un vrai site sur ecoindex.fr.
  - **EG « Le Sceau de l'Index »** :
    - calculer un EcoIndex à la main à partir du nombre d'éléments du DOM, de requêtes et du poids, avec les tables de quantiles et la formule corrigée ;
    - le résultat sert de code de la porte ;
    - KPIs à connaître : PUE, WUE, intensité carbone.
  - Boss final **L'Omnium**, en 3 phases :
    1. Clones de l'effet rebond.
    2. Bouclier de greenwashing, qu'il faut percer avec des vérités.
    3. Reprogrammation : l'élève rédige son plan d'action Green IT, la question ouverte finale, « présenté au comité de direction ».
- **Fin** : Verdance entièrement reverdie, épilogue (texte de conclusion du site actuel), titre de Gardien·ne, génération du bilan PDF.

### Durées estimées

| Région | Quête principale seule | À 100 % |
|---|---|---|
| 0 Village | 15 | 20 |
| 1 Steppes | 30 | 45 |
| 2 Bassin | 25 | 40 |
| 3 Mines | 30 | 50 |
| 4 Marais | 25 | 45 |
| 5 Citadelle | 25 | 45 |
| 6 Désert IA | 35 | 55 |
| 7 Décharge | 20 | 40 |
| 8 Forge | 35 | 65 |
| 9 Sanctuaire + boss | 25 | 45 |
| **Total** | **≈ 4 h 25** | **≈ 7 h 30 de contenu** (un élève sérieux fera environ 5-6 h, en sautant une partie des quêtes secondaires) |

---

## 4. Liste des quêtes

**10 quêtes principales** (une par région) et **34 quêtes secondaires** (listées au §3), dont :
- **6 missions terrain** à faire en dehors du jeu : Nos Gestes Climat, Climate Central, calculateur numérique ADEME, inventaire de ses équipements, temps d'écran, EcoIndex d'un vrai site ;
- **12 questions ouvertes** (§7).

Il y a **10 escape games** au total : Temple de la Serre, Observatoire, Tribunal du Triangle, Fonderie, Relais, Salle des machines, Labyrinthe de l'Oracle, Procès de l'Obsolescence, Atelier, Sceau de l'Index.

---

## 5. Combat et mobs qui enseignent

- **Combat en temps réel** à la Zelda :
  - frappe au bâton, roulade d'esquive, parade au bouclier ;
  - les cœurs sont représentés par des feuilles ;
  - on récupère des feuilles en mangeant des fruits ;
  - la mort renvoie au dernier téléporteur Racine sans perte de progression.
- **Mobs aléatoires** : chaque région a sa propre table d'apparition. Ils réapparaissent quand on change d'écran et sont moins nombreux dans les régions reverdies.
- **Attaques-citations** : chaque attaque projette une bulle de texte tirée du contenu.
  - Une bulle peut être une **idée reçue**, comme « Le cloud est immatériel ! ». La parer au bouclier la renvoie et déclenche un éclair « VRAI / FAUX ». Répondre juste étourdit le mob et fait tomber un fragment du Codex.
  - Une bulle peut aussi être un **fait**, comme « 62 Mt d'e-déchets en 2022 ». Elle fait des dégâts mais s'ajoute au Codex.
- **Élites** (environ 1 sur 15) : un défi QCM chronométré de 10 secondes, pendant lequel le temps se fige.
- Toutes ces réponses sont tracées. Les QCM « de combat » comptent peu dans la note, mais apparaissent dans le bilan.
- **Difficulté au choix** (tracée) :
  - *Exploration* : les mobs ne font pas de dégâts, pour l'accessibilité ;
  - *Normal* ;
  - *Héroïque*.

---

## 6. Objets, collection, secrets

- **Objets clés** : les 6 du tableau du §2.
- **Consommables** :
  - fruits ;
  - Graines, la monnaie ;
  - Kits de réparation : l'équipement s'use, c'est une mécanique de durabilité.
- **Collection** :
  - 8 **pièces de cœur**, données par des quêtes secondaires ;
  - environ 60 **fragments de Codex** (lore et chiffres sourcés) ;
  - 12 **badges** (exemples : « A lu tous les dialogues », « Zéro indice », « Reconditionné »).
- **Secrets** : 15 grottes, maisons ou passages, accessibles avec la Lanterne, la Lentille ou les Pinces.
- **Taux d'exploration** : calculé à partir des tuiles visitées, des secrets trouvés et des fragments collectés.

---

## 7. Questions ouvertes (modifiables dans `content/questions.js`)

1. *Holocène* : pourquoi la stabilité climatique de l'Holocène concerne-t-elle directement les infrastructures numériques ?
2. *Bilan perso* : quel est ton premier levier de réduction, et pourquoi celui-ci ?
3. *Triangle* : comment, en tant que manager IT, briser le triangle de l'inaction dans ton organisation ? Donne un exemple concret.
4. *Matériel* : propose une politique de renouvellement du parc pour une entreprise de 500 postes.
5. *Réseaux* : quel usage numérique personnel vas-tu réduire, et comment le mesurer ?
6. *Hébergement* : quels sont tes 3 critères pour choisir un hébergeur, et pourquoi ?
7. *IA* : décris un cas où l'IA générative est justifiée et un cas où elle ne l'est pas.
8. *Effet rebond* : donne un exemple d'effet rebond numérique et une parade.
9. *Lois* : quelle obligation légale aura le plus d'impact sur ton futur métier ?
10. *3U* : applique la grille 3U à une fonctionnalité d'une application que tu utilises.
11. *Mesure* : donne l'EcoIndex du site que tu as testé, ton interprétation et 3 actions correctives.
12. *Final* : rédige ton plan d'action Green IT pour un comité de direction (5 à 10 lignes).

---

## 8. Suivi et bilan PDF (ta réponse n°3)

**Ce qui est suivi**
- Le temps par région et le temps total, avec les pauses détectées quand l'onglet est inactif.
- Pour chaque quête, principale ou secondaire : faite, ignorée ou en cours.
- Les dialogues : lus, survolés (passés en moins de 1,5 s par bulle) ou ignorés.
- Les QCM : réponse donnée, juste ou fausse, nombre de tentatives.
- Les questions ouvertes : texte intégral et nombre de mots.
- Les escape games : réussis ou abandonnés, durée, indices utilisés.
- Les missions terrain et les valeurs saisies.
- Les vidéos ouvertes.
- Le taux d'exploration et les secrets trouvés.
- Les morts et la difficulté choisie.

**Sauvegarde**
- Automatique dans `localStorage` : à chaque changement d'écran, après chaque dialogue, et toutes les 30 s.
- Un seul emplacement, puisqu'une session correspond à un joueur. « Nouvelle partie » demande confirmation.

**Bilan**
- Bouton « Générer mon bilan » disponible à tout moment depuis le menu pause, et proposé automatiquement à la fin du jeu.
- Le PDF est généré dans le navigateur, sans serveur.
- Chaque bilan généré est conservé dans `localStorage`. L'écran-titre affiche une section **« Mes bilans »** qui permet de re-télécharger n'importe quel bilan précédent en un clic, avec sa date et sa progression.
- En secours, le bilan est aussi téléchargeable en JSON.

**Contenu du PDF**
- Identité saisie librement : prénom, nom, groupe.
- Note indicative sur 20, décomposée.
- Temps par région.
- Détail des QCM, des escape games et des quêtes.
- Réponses aux questions ouvertes, avec une case « note enseignant » vide.
- Code d'intégrité.

**Protection par mot de passe** — point à valider :
- Sur un site statique public, le mot de passe est forcément présent dans le code. Un élève motivé peut donc le trouver, et le chiffrement PDF accessible sans serveur (RC4 ou AES-128) est contournable.
- Je propose donc :
  - un PDF **ouvrable librement mais verrouillé en modification**, avec un mot de passe propriétaire que tu définis ;
  - un **code d'intégrité** qui signe les données ;
  - les données brutes du bilan intégrées au PDF ;
  - un **outil enseignant**, la page `correction.html` protégée par ton code. Tu y glisses tous les PDF reçus et il :
    - vérifie l'intégrité (« ✔ authentique » ou « ⚠ modifié ») ;
    - affiche un tableau de la classe ;
    - te laisse saisir la note des questions ouvertes ;
    - exporte le tout en CSV.
- C'est la vraie protection. Le mot de passe à l'ouverture reste possible en option dans la configuration si tu y tiens.

**Grille de notation** (proposition n°11 validée, sur 20, réglable dans la configuration)

| Bloc | Points | Calcul |
|---|---|---|
| QCM et énigmes | 10 | % de réussite au 1er essai (QCM principaux pondérés ×3, QCM de combat ×0,5) ; −0,25 pt par indice, plafonné |
| Progression et exploration | 4 | quêtes principales (2,5), quêtes secondaires (1), exploration et secrets (0,5) |
| Engagement | 2 | dialogues lus et non survolés, vidéos obligatoires vues, missions terrain renseignées |
| Questions ouvertes | 4 | note de l'enseignant (non calculée automatiquement) |

Le PDF affiche « 16/20 calculés automatiquement + __/4 enseignant ».

---

## 9. UX/UI, accessibilité et technique

- **Écran-titre** : Nouvelle partie / Continuer / Mes bilans / Options. Saisie libre du prénom, du nom et du groupe (ta réponse n°1).
- **Commandes clavier**
  - Déplacement : ZQSD, WASD ou les flèches.
  - Attaque : Espace ou J.
  - Interaction : E ou K.
  - Bouclier : Maj ou L.
  - Roulade : Ctrl.
  - Inventaire : I. Carte : M. Codex : C. Journal : Q. Pause : Échap.
  - Les manettes sont aussi prises en charge.
- **Tactile** : joystick virtuel et boutons A, B et Bouclier, affichés automatiquement.
- **Options**
  - Taille du texte (3 niveaux).
  - Vitesse de défilement du texte.
  - Réduction des animations : pas de secousse d'écran ni de particules, et transitions instantanées.
  - Palette adaptée au daltonisme.
  - Volume.
  - Difficulté.
- **Lisibilité** : l'interface est en pixel art, mais les dialogues utilisent une police système lisible avec un fort contraste.
- **Interface en jeu**
  - Feuilles de vie, jauge de Verdance.
  - Mini-carte avec un brouillard qui se lève en explorant.
  - Marqueurs de quête.
  - Journal de quêtes.
  - Codex consultable à tout moment : c'est la « bibliothèque » où se retrouve tout le contenu pédagogique.
- **Audio** : musique chiptune et effets sonores générés par la Web Audio API, sans fichier audio. La musique change quand une région reverdit.
- **Technique** (ta réponse n°14 : l'expérience prime)
  - Canvas 2D et JavaScript natif en modules, sans build.
  - Sprites et tuiles pixel art 16×16 générés par le code. Toutes les créations sont originales, rien de Nintendo.
  - Contenu séparé du moteur dans `content/*.js` : dialogues, QCM, quêtes, questions, chiffres et sources.
  - Les vidéos ne se chargent qu'au clic, avec youtube-nocookie.
  - Je ne m'impose pas de budget de poids strict, mais il n'y a aucune dépendance lourde : le jeu restera léger par construction.
- **Mode enseignant**
  - Code secret, à saisir dans les options ou via `?prof`.
  - Téléportation vers n'importe quelle région, objets clés débloqués, invincibilité, saut de n'importe quelle énigme.
  - Visualiseur du contenu (chaque ID d'inventaire et son emplacement).
  - Accès à `correction.html`.
- **Aucune référence à une entreprise** (ta réponse n°15). La page `template` est intégrée sans cette mention.

---

## 10. Table de correspondance contenu → jeu (Livrable 1, partie B)

Chaque ID renvoie à `01-inventaire.md`. Une fois le jeu construit, le mode enseignant permettra de vérifier automatiquement que chaque ID est bien présent dans le contenu.

**Légende des formats**
- PNJ = dialogue.
- Codex = fragment consultable.
- EG = escape game.
- QS = quête secondaire.
- Mob = bulle d'attaque ou de parade.
- Fresque = graphique redessiné.
- Projection = vidéo au clic.

| IDs | Lieu dans le jeu | Forme |
|---|---|---|
| M1-01→03 | 0 Village, Holo | écran du robot + Codex « Paradoxe » + mobs (bulles) |
| M1-04→05 | 0 Village, Holo / Sylve | dialogue de briefing |
| M1-06 | Journal de quêtes | objectifs des chapitres |
| M1-07 | Titres du joueur | Initié → Analyste → Stratège → Expert → Gardien·ne |
| M1-08 | 0 Village, stèle d'entrée de la Forge (rappel en 8) | citation |
| M1-09 | Écran « À propos » (poids et EcoIndex réels du jeu) | info |
| M1-10→14 | 1 Steppes, Aïdan + Fresque 1 + Codex | PNJ + fresque |
| M1-13 | idem, avec nuance sur le statut géologique (IUGS 2024) | Codex |
| M1-15, M1-16 | 1 Steppes, Fresques 1 et 2 redessinées | fresque (source citée) |
| M1-17 | 1 Steppes, verrou : examiner les 2 fresques pour ouvrir la pierre de projection | mécanique |
| M1-18→22 | 1 Steppes, pierre de projection + 5 « intels » minutés | projection + Codex |
| M1-23→30 | 1 Steppes, Épreuve des Carottes (QP) | 8 QCM |
| M1-31 | 1 Steppes, parchemin d'aide (indice de l'épreuve) | indice |
| M1-32 | 1 Steppes, QS « Les 4 piliers » | 4 PNJ |
| M1-33 | Retiré du jeu (chiffre non sourcé), conservé dans le Codex « Archives de l'ancien site » | Codex |
| M1-34→36 | 1 Steppes, grotte secrète « Records » (chiffres mis à jour) | Codex + mobs |
| M1-37 | 1 Steppes, QS « Les eaux montantes » | mission terrain |
| M1-38 | 1 Steppes, Ondin (renvoi vers les câbles en 4) | PNJ |
| M1-39→43 | 1 Steppes, Temple de la Serre (salles 1-2) + Dame Serre | EG + Codex |
| M1-44→46 | 1 Steppes, Voyageuse Empreinte + Codex « Sources » | PNJ |
| M1-47 | 1 Steppes, fresque du temple redessinée | fresque |
| M1-48 | Temple de la Serre, salle 1 (texte à trous) | EG |
| M1-49→53 | 1 Steppes, QS « L'empreinte du voyageur » + question ouverte 2 | mission terrain |
| M1-54 | 2 Bassin, projection | projection |
| M1-55→60 | 2 Bassin, 9 obélisques + QS « Zones mortes » / « Trou dans le ciel » | PNJ + Codex |
| M1-61 | 2 Bassin, EG Observatoire (terminal) | EG |
| M1-62→65 | 2 Bassin, Tribunal du Triangle + projection + question ouverte 3 | EG à choix |
| M2-01→07 | 4 Marais, tour de guet (diagnostic, compteur, fresque « GES / matière / eau ») ; les volets matière et eau sont repris en 3 | machine + fresque |
| M2-08→10 | 3 Mines, Fixie + QS « Neuf ou reconditionné » | PNJ + choix |
| M2-11→16 | 4 Marais, QS « Mon empreinte numérique » + Mémé Archiva (dark data) + Baud (5G) | mission terrain + QS |
| M2-17→24 | 3 Mines, mur des 90 éléments + EG Fonderie + secret « mine urbaine » | EG + fresque |
| M2-25 | 3 Mines, projection ARTE + 4 intels | projection |
| M2-26→32 | 4 Marais, centrale + EG Relais | EG + fresque |
| M2-33→38 | 6 Désert IA, projection + chiffres actualisés (Codex) | projection + EG |
| M2-39→45 | 3 Mines, QS « L'inventaire » + « 15/10/5 ans » | mission terrain + QS |
| M2-46→47 | 4 Marais, QS « 27 ans d'écran » | QS |
| M2-48→53 | 8 Forge, atelier Dev + QS « Apollo 64 Ko » | PNJ + QS |
| M2-54→57 | 4 Marais, QS « Le pays Internet » (avec correction de l'incohérence 3e / 6e) | projection + QCM |
| M2-58 | 8 Forge, boss Golem Obésiciel | boss |
| M2-59→67 | 7 Décharge, Procès de l'Obsolescence (versions mises à jour) | EG à choix |
| M2-68→75 | 3 Mines, convoyeur ACV + jauges + QS « Le patch » | EG + QS |
| M2-76→79 | 8 Forge (principes) + 7 Décharge (baromètre, garder son matériel) | PNJ + QS |
| M2-80→83 | 5 Citadelle, Salle des machines + QS « Zombies 404 » + Calorine (chaleur fatale) + 7 Décharge (Fairphone) | EG + QS |
| M3-01→02 | 8 Forge, Maître Sobre + projection | PNJ |
| M3-03→04 | 8 Forge, Conseillère Valeur (5 leviers) | PNJ |
| M3-05 | 8 Forge, QS « La bibliothèque » | QS |
| M3-06 | 8 Forge, borne d'arcade Eco-Slash | mini-jeu |
| M3-07→11 | 8 Forge, QS « Les 4 niveaux » + Truffe (K-DOG), avec un rappel dans le Désert IA | QS |
| M3-12 | 8 Forge, panneau de la feuille de route (ordre des ateliers) | mécanique |
| M3-13→15 | 8 Forge, atelier Spécifications + EG Atelier (filtre 3U) | EG |
| M3-16→19 | 8 Forge, atelier Design (labo de compression, Yahoo contre Google) | mini-jeux |
| M3-20→23 | 8 Forge, atelier Dev (Rusta) | PNJ + QCM |
| M3-24 | 0 Village, Tavernière Baya (quiz des bonnes pratiques) | 10 QCM |
| M3-25→27 | 5 Citadelle, Salle des machines + QS « Comparatif » + « Calculateur » | EG + QS |
| M4-01→03 | 9 Sanctuaire, Indexa + mission terrain EcoIndex | mission terrain |
| M4-04→06 | 9 Sanctuaire, EG Sceau de l'Index (formule corrigée, quantiles) | EG |
| M4-07→11 | 9 Sanctuaire, projection Concept Image (passages minutés) | projection |
| M4-12 | Épilogue | cinématique texte |
| M4-13 | 9 Sanctuaire (PUE, WUE, intensité carbone) + 5 Citadelle | Codex + EG |
| X-01 | 3 Mines, terminal de la Fonderie (questions 2-4) + 4 Marais, tour de guet (question 1, corrigée à 6,7 % France) | EG |
| X-02 | 0 Village, QS « Les trois fléaux » (sans référence d'entreprise) | QS |
| Volet IA (nouveau) | 6 Désert des Oracles entier | QP + 5 QS + EG |

Les chiffres marqués ⚠ dans l'inventaire sont mis à jour à l'endroit indiqué. L'ancienne valeur est conservée dans le Codex lorsque l'évolution elle-même est instructive.
