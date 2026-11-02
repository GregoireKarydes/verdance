# 🌿 Verdance — un jeu d’aventure pour apprendre le Green IT

**Verdance** est un jeu d’aventure-action 2D en pixel art, en vue de dessus, inspiré des grands jeux d’aventure des années 90. Il remplace le site de cours « Formation GreenIT – Master 2 » et sert à la fois de **support de cours** et d’**évaluation**.

Le monde de Verdance a été brûlé par l’Omnium, une machine-monde gloutonne. L’élève explore 10 régions, de la compréhension du problème jusqu’aux solutions : climat, limites planétaires, fabrication du matériel, réseaux, centres de données, IA, fin de vie et lois, éco-conception, mesure. Il parle aux habitants, combat des créatures qui l’attaquent avec des idées reçues, résout des escape games et replante 8 Graines-Mères. Le monde **reverdit** au fur et à mesure.

- **Durée** : environ 4 h pour la quête principale, 5 à 6 h pour un élève sérieux, environ 7 h 30 de contenu au total.
- **Contenu** : 10 régions, 62 personnages, 10 quêtes principales et 34 quêtes secondaires. Le jeu propose 9 donjons d’escape game et 57 énigmes, dont 80 questions de QCM. S’y ajoutent 12 questions ouvertes, 6 missions terrain, 101 fragments de Codex sourcés, 71 « bulles » de combat (vrai/faux) et 33 défis d’élite.
- **Technique** : HTML, CSS et JavaScript natifs, **sans dépendance, sans build, sans serveur**. Le pixel art et la musique sont **générés par le code** : aucune image, aucun son, aucune police téléchargée.
- **Bilan** : l’élève génère un **PDF** protégé contre la modification et signé, conservé dans son navigateur. Il vous l’envoie. Vous importez tous les PDF dans `correction.html` pour noter et exporter la classe en CSV.

---

## 1. Déployer sur GitHub Pages (5 minutes)

1. Créez un **nouveau dépôt** sur GitHub, par exemple `verdance`. Il peut être public.
2. Copiez **tout le contenu** de ce dossier à la racine du dépôt : `index.html`, `correction.html`, `css/`, `js/`, `docs/`, `README.md`.
   - Par l’interface web : *Add file › Upload files*, glissez les fichiers et dossiers, puis *Commit*.
   - Ou en ligne de commande : `git init`, `git add .`, `git commit -m "Verdance"`, `git remote add origin …`, `git push -u origin main`.
3. Dans le dépôt : **Settings › Pages › Build and deployment** → *Source* : **Deploy from a branch**, *Branch* : **main** et **/ (root)** → *Save*.
4. Après 1 à 2 minutes, le jeu est en ligne sur `https://<votre-compte>.github.io/verdance/`.
   - L’outil de correction se trouve sur `https://<votre-compte>.github.io/verdance/correction.html`.

> **Avant de déployer**, modifiez les codes secrets dans `js/content/config.js` (voir section 2).
>
> **Test en local** : les modules JavaScript ne fonctionnent pas en ouvrant `index.html` directement depuis le disque. Lancez un petit serveur dans le dossier, par exemple `python3 -m http.server`, puis ouvrez `http://localhost:8000`.

---

## 2. Configuration (`js/content/config.js`)

| Réglage | Rôle | À faire |
|---|---|---|
| `courseName`, `schoolName` | Titres affichés dans le jeu et sur le bilan | Personnalisez-les |
| `teacherCode` | Code du **mode enseignant** et de `correction.html` | **Changez-le** |
| `pdfOwnerPassword` | Mot de passe « propriétaire » du PDF : empêche sa modification dans les lecteurs PDF | **Changez-le** |
| `pdfUserPassword` | Mot de passe d’**ouverture** du PDF (optionnel) | Laissez `''` pour que l’élève puisse relire son bilan |
| `integritySecret` | Secret qui signe le bilan (code d’intégrité) | **Changez-le**, puis ne le modifiez plus de l’année : les anciens bilans ne seraient plus vérifiables |
| `grading` | Barème (voir section 5) | Ajustez si besoin |
| `openMinWords` | Nombre de mots conseillé pour les questions ouvertes | 25 par défaut |
| `videoMinSeconds` | Temps minimal avant de pouvoir valider une vidéo obligatoire | 45 s par défaut |

⚠ **Honnêteté technique** : sur un site statique, le code source est public. Un élève très motivé peut donc lire les mots de passe et le secret dans le code. Les protections (PDF verrouillé et code d’intégrité) arrêtent les retouches ordinaires, pas une fraude déterminée. C’est suffisant pour un usage en classe, et `correction.html` signale tout bilan dont les données ont été modifiées.

---

## 3. Utilisation en classe

1. Donnez le lien du jeu aux élèves. Chacun joue sur **son navigateur** : une session correspond à un joueur.
2. Au premier lancement, l’élève saisit son **prénom, son nom et son groupe** (texte libre) et choisit une difficulté. La difficulté est indiquée dans le bilan.
3. La **sauvegarde est automatique** dans le navigateur. L’élève peut fermer et reprendre plus tard avec « Continuer », sur le **même navigateur et le même appareil**.
4. À tout moment, et automatiquement à la fin du jeu, l’élève génère son **bilan PDF** : *Menu (Échap) › Mon bilan*, ou *Écran-titre › Mes bilans*. Le PDF se télécharge et reste enregistré dans « Mes bilans », d’où il peut être retéléchargé.
5. L’élève **vous envoie le PDF** par e-mail, ENT ou dépôt de devoir. En secours, un export JSON est disponible.

**Commandes** :

| Action | Clavier | Autres |
|---|---|---|
| Se déplacer | ZQSD, WASD ou flèches | Manette ; joystick virtuel sur écran tactile |
| Attaquer | Espace ou J | |
| Interagir | E ou K | |
| Bouclier (parade de vérité) | Maj ou L | |
| Roulade | Ctrl ou U | |
| Menu | Échap | |
| Inventaire | I | |
| Carte | M | |
| Codex | C | |
| Journal | O | |

**Accessibilité** (*Options*) :
- taille et vitesse du texte ;
- réduction des animations (pas de secousses ni de particules) ;
- contraste renforcé ;
- mode « Exploration » sans dégâts ;
- volumes réglables.

---

## 4. Corriger avec `correction.html`

1. Ouvrez `correction.html` et saisissez le `teacherCode`.
2. **Glissez tous les PDF reçus** dans la zone prévue. Les fichiers JSON de secours sont aussi acceptés.
3. Pour chaque élève, l’outil affiche :
   - **✔ authentique** ou **⚠ modifié**, grâce au code d’intégrité ;
   - le temps de jeu, la verdance, les quêtes et la note automatique sur 16 ;
   - un avertissement si le **mode enseignant** a été utilisé sur sa partie.
4. Cliquez sur **Détail / noter** pour lire les **12 réponses ouvertes** et saisir vos notes. Le total des questions ouvertes est plafonné à 4.
5. Cliquez sur **Exporter la classe en CSV** pour obtenir un fichier qui s’ouvre dans Excel ou LibreOffice, avec le séparateur `;`.

Tout reste dans votre navigateur : aucune donnée n’est envoyée sur Internet. Si un élève envoie plusieurs bilans, seul le plus récent de sa partie est conservé.

---

## 5. Notation (note indicative sur 20)

| Bloc | Points | Calcul |
|---|---|---|
| **QCM et énigmes** | 10 | Réussite **au premier essai**, pondérée : énigmes principales ×3, secondaires ×1, défis de combat ×0,5. Une énigme non-QCM vaut 2 questions : 100 % si réussie du premier coup, 80 % en 2 essais, 60 % au-delà. Les énigmes **principales non tentées comptent 0**. Chaque indice coûte −0,25 pt, avec un maximum de −2. |
| **Progression et exploration** | 4 | Quêtes principales (62,5 %), quêtes secondaires (25 % : 80 % des quêtes secondaires suffisent pour le maximum), exploration et secrets (12,5 %). |
| **Engagement** | 2 | Dialogues **réellement lus** (40 % : une bulle passée trop vite compte comme « survolée »), vidéos obligatoires (30 %), missions terrain (30 %). |
| **Questions ouvertes** | 4 | **Votre note**, saisie dans `correction.html`. |

Le PDF contient aussi le détail de chaque QCM (réponses données et nombre d’essais), des énigmes (réussie ou abandonnée, essais, indices, durée), des quêtes (faite, en cours ou ignorée), le temps par région, les dialogues lus ou survolés, les PNJ jamais abordés, les combats, le taux d’exploration et les réponses aux missions terrain.

Tous les poids sont modifiables dans `config.js › grading`.

---

## 6. Modifier le contenu (sans toucher au moteur)

Tout le contenu pédagogique est dans **`js/content/`**. Ce sont des fichiers de **données** : seuls les textes entre guillemets sont à modifier.

| Fichier | Contenu |
|---|---|
| `config.js` | Réglages enseignant |
| `common.js` | Objets, **vidéos**, **missions terrain**, **questions ouvertes** (`QUESTIONS`), limites planétaires, textes d’intro et de fin |
| `r_village.js` … `r_sanctuaire.js` | Une région par fichier : PNJ et dialogues (`NPCS`), quêtes (`QUESTS`), énigmes et QCM (`PUZZLES`), Codex, fresques, bulles de combat (`STATEMENTS`), défis d’élite (`COMBAT`) |
| `world.js` | Géographie : position des PNJ et lieux, passages entre régions, donjons, grottes |
| `mobs.js` | Bestiaire |

**Exemples courants** :

- **Changer une question ouverte** : dans `common.js › QUESTIONS`, modifiez `title` et `q`. Gardez l’identifiant (par ex. `q5_usage`) et la ligne `onDone`, qui fait avancer la quête.
- **Modifier un QCM** : dans le fichier de la région, cherchez `type: 'qcm'`. Chaque question a :
  - `q`, l’énoncé ;
  - `options`, la liste des réponses ;
  - `a`, l’index de la bonne réponse, **en partant de 0** ;
  - `explain`, l’explication affichée après la réponse.
  
  L’ordre des options est mélangé à l’affichage.
- **Ajouter une idée reçue en combat** : ajoutez une ligne dans `STATEMENTS` avec les champs suivants :
  - `v: false` pour une idée fausse, `v: true` pour un fait ;
  - `t`, l’affirmation ;
  - `x`, l’explication ;
  - `r`, la région, ou `'*'` pour toutes les régions.
- **Changer un chiffre** : cherchez-le dans le Codex (`CODEX`) et dans les dialogues de la région, et mettez à jour la source citée.
- **Mise en forme des textes** : `**gras**`, `*italique*` et `[lien](https://…)` sont acceptés.

Après modification, rechargez la page. En cas d’erreur de syntaxe (virgule ou guillemet oublié), la console du navigateur (F12) indique le fichier et la ligne.

**Mots-clés des scripts**, dans les champs `if` et `act`. Ils ne sont utiles que pour des modifications avancées :
- **conditions** : `flag:x`, `!flag:x`, `item:x`, `quest:x`, `done:x`, `step:x>=2`, `puzzle:x`, `seeds>=4`, combinables avec `&` (et) et `|` (ou) ;
- **actions** : `quest:x`, `step:x:n`, `done:x`, `give:objet`, `codex:id`, `puzzle:id`, `video:id`, `mission:id`, `open:id`, `graines:n`, `heal`, `flag:x`, `toast:texte`.

---

## 7. Mode enseignant

Pour l’activer :
- *Options › Mode enseignant*, puis saisissez le `teacherCode` ;
- ou ajoutez `?prof` à l’adresse (`…/index.html?prof`).

Un onglet **Enseignant** apparaît dans le menu, avec :
- la **téléportation** vers n’importe quelle région ;
- tous les objets clés ;
- l’ouverture de tous les passages ;
- l’invincibilité et la vitesse ;
- la replantation de graines ;
- l’accès direct au boss ;
- un bouton **Résoudre** dans chaque énigme ;
- la **couverture de l’inventaire** : la liste des 190 éléments de l’ancien site et l’endroit où chacun se trouve dans le jeu.

Son usage est signalé dans le bilan.

---

## 8. Documents de conception

- `docs/01-inventaire.md` : l’inventaire exhaustif de l’ancien site (190 éléments), avec les chiffres à mettre à jour ou à vérifier.
- `docs/02-game-design.md` : le game design et la table de correspondance contenu → jeu.
- `docs/03-mise-a-jour-contenu.md` : les chiffres actualisés, leurs sources et les points d’incertitude.

---

## 9. Données personnelles (RGPD)

- Seuls le prénom, le nom et le groupe (texte libre) sont saisis. Pas d’e-mail ni d’identifiant.
- **Aucune donnée ne quitte l’appareil de l’élève** : pas de serveur, pas de cookie, pas de traceur. Le jeu n’appelle aucun service externe, sauf les vidéos YouTube (youtube-nocookie.com), et **seulement si l’élève clique** pour en charger une.
- Les données sont stockées dans le `localStorage` du navigateur. L’élève peut les effacer en lançant une nouvelle partie ou en vidant les données du site.
- Le bilan PDF est transmis par l’élève lui-même. Côté enseignant, `correction.html` traite les fichiers localement.

---

## 10. Crédits et licences

- **Code, pixel art, musique et effets sonores** : originaux, générés procéduralement. Aucun asset tiers, aucun personnage protégé.
- **Polices** : polices système uniquement.
- **Vidéos** (chargées à la demande, hébergées par leurs auteurs sur YouTube) :
  - World Economic Forum (Johan Rockström) ;
  - TF1 Info ;
  - Christophe Cassou ;
  - ARTE ;
  - ADEME ;
  - Radio-Canada Info ;
  - Agence Concept Image ;
  - deux vidéos pédagogiques reprises de l’ancien cours.
- **Graphiques des fresques** : redessinés à partir des données sources citées dans le jeu (Copernicus, SDES, Potsdam Institute, EuChemS, AIE, decrypterlenergie.org, GreenIT.fr / The Shift Project…). Les images d’origine de l’ancien site ne sont pas reprises.
- Les chiffres sont datés et sourcés dans le Codex. Voir `docs/03-mise-a-jour-contenu.md`.
