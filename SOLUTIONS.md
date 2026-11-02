# Verdance — Guide des solutions

> **Pour qui ?** Pour l’enseignant·e, et pour les élèves **vraiment bloqués**. Essaie d’abord l’indice 💡 dans l’énigme, le **Codex** (touche C) et l’aide de Pousse (touche **H**).
> Utiliser ce guide ne bloque rien, mais une énigme réussie après plusieurs essais ou avec des indices rapporte moins de points qu’une réussite au premier essai.
>
> Ce fichier est **généré automatiquement** à partir du contenu du jeu : `node tools/gen-solutions.mjs`. Ne le modifie pas à la main.

## Sommaire

- [Village de la Souche](#village)
- [Steppes de l’Holocène](#steppe)
- [Bassin des 9 Sceaux](#bassin)
- [Mines d’Abysse](#mines)
- [Marais des Réseaux](#marais)
- [Citadelle des Serveurs](#citadelle)
- [Désert des Oracles](#desert)
- [Décharge de Ferraille](#decharge)
- [Forge des Bâtisseurs](#forge)
- [Sanctuaire de la Mesure](#sanctuaire)
- [Temples : clé, porte verrouillée et Gardien](#temples)
- [Combats : idées reçues (VRAI / FAUX)](#combats)
- [Défis d’élite](#elite)
- [Questions ouvertes et missions terrain](#ouvertes)
- [Passages, objets clés, grottes et coffres à revisiter](#passages)
- [Fin du jeu : mon engagement](#engagement)

## Parcours conseillé

Village → Steppes (ouest) → Bassin (nord des Steppes) → Mines (nord du Bassin) et Marais (sud du village), dans l’ordre que tu veux → Citadelle (nord du village) → Décharge (est du village) → Désert (nord de la Citadelle) → Forge (nord de la Décharge) → Sanctuaire (8 graines).

<a id="village"></a>
## Chapitre 0 — Village de la Souche

### ⭐ Quête principale : Le Réveil

1. Parle à Sylve, près de l’Arbre-Mère
2. Dissipe 3 fumerolles de CO₂ autour du village
3. Retourne voir Sylve
4. Écoute le briefing de l’Archiviste Holo
5. Retourne voir Sylve
6. Rejoins les Steppes de l’Holocène, à l’ouest

### 📜 Quête secondaire : Les trois fléaux

1. Écoute Joss, Mina et Ferdi : quels sont les trois fléaux du numérique ?

### 📜 Quête secondaire : Le grand quiz de la taverne

1. Réussis le quiz de Baya

### 🧩 Énigmes et quiz

#### 🍺 Le quiz des 115 bonnes pratiques
_Où : auprès de Tavernière Baya_

1. Quelle est la meilleure approche pour afficher une longue liste de résultats ?  
   → **La pagination (20 éléments à la fois)** — Bonne pratique n°13 : la pagination évite les DOM géants et limite la mémoire consommée.
2. Comment utiliser les bibliothèques JavaScript ?  
   → **N’utiliser que les portions indispensables (tree-shaking)** — Bonne pratique n°15 : le tree-shaking élimine le code inutilisé.
3. Que faire des données calculées souvent utilisées ?  
   → **Les mettre en cache** — Bonne pratique n°16 : le cache évite les calculs redondants.
4. Quel type de pages privilégier quand c’est possible ?  
   → **Statiques générées à l’avance** — Bonne pratique n°18 : une page statique ne demande aucun calcul serveur à chaque visite.
5. Quelle pratique est à proscrire avec SQL ?  
   → **Les requêtes dans une boucle** — Bonne pratique n°64 : une requête par itération (le fameux « N+1 ») est catastrophique.
6. Que faire des fichiers CSS, JS, HTML et SVG en production ?  
   → **Les minifier** — Bonne pratique n°77 : la minification réduit fortement leur poids.
7. Comment limiter l’impact des appels d’API ?  
   → **Limiter et regrouper les appels** — Bonne pratique n°21 : chaque appel HTTP a un coût.
8. Quand se connecter à la base de données ?  
   → **Uniquement si c’est nécessaire** — Bonne pratique n°24.
9. Quel format d’image privilégier ?  
   → **WebP ou AVIF** — WebP et AVIF sont 30 à 50 % plus légers que le JPEG à qualité égale.
10. Quelle stratégie pour les fonctionnalités d’un site ?  
   → **Sobriété fonctionnelle : garder l’essentiel** — Chaque fonctionnalité a un coût : la sobriété fonctionnelle est la base.

<a id="steppe"></a>
## Chapitre 1 — Steppes de l’Holocène

### ⭐ Quête principale : La mémoire de la glace

1. Parle à Aïdan le Carottier
2. Examine les deux fresques climatiques
3. Regarde la pierre de projection (J. Rockström)
4. Passe l’Épreuve des Carottes auprès d’Aïdan
5. Reconstitue la Grande Fresque avec Dame Serre
6. Traverse le Temple de la Serre
7. Replante la Graine-Mère

### 📜 Quête secondaire : L’empreinte du voyageur

1. Calcule ton empreinte carbone (mission terrain)
2. Partage ton premier levier avec la Voyageuse

### 📜 Quête secondaire : Les eaux montantes

1. Observe la carte de montée des eaux (mission terrain)
2. Raconte à la Vigie ce que tu as vu

### 📜 Quête secondaire : Les quatre piliers

1. Écoute les quatre artisans des Steppes (alimentation, biens, transports, habitat)

### 🧩 Énigmes et quiz

#### 🖼 La Grande Fresque : des causes aux conséquences
_Où : auprès de Dame Serre_

**Étape 1 — les colonnes :**
- **① Activités humaines** : Fabriquer nos équipements numériques ; Brûler charbon, pétrole et gaz ; Déforestation et agriculture intensive
- **② Émissions** : Dioxyde de carbone (CO₂) ; Méthane (CH₄) ; Protoxyde d’azote (N₂O)
- **③ Mécanismes** : Effet de serre renforcé ; L’océan absorbe ≈ 90 % de la chaleur en trop ; L’océan absorbe ≈ ¼ de notre CO₂
- **④ Effets physiques** : Réchauffement global (≈ +1,1 °C en 2011-2020) ; Fonte des glaces, montée des mers (≈ +20 cm depuis 1900) ; Acidification des océans
- **⑤ Conséquences** : Canicules, sécheresses et incendies ; Coraux, coquillages et biodiversité menacés ; Récoltes en baisse, pénuries d’eau, populations déplacées

**Étape 2 — la chaîne, dans l’ordre :**
1. J’achète un smartphone neuf
2. Extraction de métaux et fabrication, souvent à l’électricité fossile
3. Émissions de CO₂ (la fabrication pèse l’essentiel de l’empreinte d’un smartphone)
4. L’effet de serre se renforce
5. La planète se réchauffe
6. Canicules, sécheresses, montée des eaux

**Étape 3 —** lire les messages et (facultatif) écrire sa réflexion.

> 💡 **À retenir :** La fresque relie nos **activités** aux **conséquences** en passant par les émissions, les mécanismes et les effets mesurés. C’est une **chaîne de causes** : agir sur un maillon (réduire, allonger, sobriété) réduit tout ce qui suit.

#### 🧊 L’Épreuve des Carottes
_Où : auprès de Aïdan le Carottier_

1. Quelle a été la variation de température durant l’Holocène ?  
   → **± 1 °C** — Une stabilité exceptionnelle qui a permis l’agriculture, puis les civilisations.
2. Vers quand commence la « Grande Accélération » ?  
   → **Vers 1950** — Après 1950, population, énergie, CO₂, engrais… tout s’envole de façon exponentielle.
3. Quelle part de la chaleur excédentaire l’océan a-t-il absorbée ?  
   → **Environ 90 %** — Sans l’océan, le réchauffement de l’air serait bien pire — mais il en paie le prix (canicules marines, acidification).
4. La « Carbon Law » impose de diviser les émissions par deux tous les…  
   → **10 ans** — Une « loi de Moore climatique » : −50 % par décennie.
5. Combien de limites planétaires l’équipe de Johan Rockström a-t-elle identifiées ?  
   → **9** — Neuf limites ; tu les découvriras dans le Bassin des 9 Sceaux.
6. Franchir un point de bascule (« tipping point »), cela signifie…  
   → **Le système s’emballe de lui-même, de façon difficilement réversible** — Boucles de rétroaction : fonte des glaces → moins de réflexion du soleil → plus de chaleur…
7. Quelle forêt est en partie devenue une source de carbone plutôt qu’un puits ?  
   → **Certaines parties de l’Amazonie** — Déforestation et sécheresses : le sud-est de l’Amazonie émet désormais plus qu’il n’absorbe.
8. Le « corridor » de température des 3 derniers millions d’années n’a jamais dépassé environ…  
   → **+2 °C** — Selon Rockström, la Terre n’a pas connu plus de +2 °C depuis environ 3 millions d’années.

#### 📜 Salle 1 — Le rapport de la Serre
_Où : Temple de la Serre, salle d’entrée (piédestal)_

- Trou 1 : **naturel**
- Trou 2 : **−18 °C**
- Trou 3 : **chaleur**
- Trou 4 : **PRG**
- Trou 5 : **8 tonnes**
- Trou 6 : **10 ans**

> Texte complet : « L’effet de serre est un phénomène **naturel** qui permet à la Terre de garder une température vivable. Sans lui, il ferait **−18 °C** en moyenne. Mais nos activités rejettent trop de gaz, qui piègent davantage de **chaleur**. Pour comparer les gaz, on utilise le **PRG**. En France, l’empreinte moyenne est d’environ **8 tonnes** de CO₂e par personne et par an. La Carbon Law exige de diviser nos émissions par deux tous les **10 ans**. »

> 💡 **À retenir :** Le CO₂ sert de référence (PRG = 1). Tous les autres gaz sont exprimés en **CO₂ équivalent**.

#### ⚗ Salle 2 — Les vannes de la Serre
_Où : Temple de la Serre, grand hall (piédestal)_

Une solution possible :
- CO₂ (tonnes) : **10**
- CH₄ méthane (tonnes) : **0,1**
- N₂O protoxyde d’azote (tonnes) : **0,045**

> 💡 **À retenir :** Quelques centaines de kilos de méthane ou quelques dizaines de kilos de N₂O équivalent à des tonnes de CO₂ : c’est tout le sens du **PRG**. (Valeurs AR6 du GIEC : CH₄ fossile 29,8, CH₄ non fossile 27 ; N₂O 273. L’ancien cours utilisait les valeurs AR5 : 28 et 265.)

#### 🌡 Salle 3 — Le thermostat du monde
_Où : Temple de la Serre, salle des archives (piédestal)_

1. Sur quel horizon le PRG est-il habituellement calculé ?  
   → **100 ans** — Par convention (GIEC), le PRG est calculé à 100 ans. Sur 20 ans, le méthane pèse plus de 80 fois le CO₂ !
2. Quelle est l’empreinte carbone moyenne d’un·e Français·e (estimation 2024) ?  
   → **Environ 8 t CO₂e/an** — Environ 8,2 t en 2024 selon le SDES (9 t en 2021 dans l’ancien cours). Environ la moitié est liée aux importations.
3. Pour atteindre ~2 t en 2050 depuis ~8 t, il faut réduire d’environ…  
   → **75 %** — (8 − 2) / 8 = 75 %. Une transformation profonde de nos modes de vie et de production.
4. Quel gaz domine l’empreinte carbone française ?  
   → **Le CO₂ (≈ 74 %)** — CO₂ ≈ 74 %, méthane ≈ 18 %, N₂O ≈ 5 % (SDES, 2024).

<a id="bassin"></a>
## Chapitre 2 — Bassin des 9 Sceaux

### ⭐ Quête principale : Les neuf sceaux

1. Parle à l’Observatrice Néva
2. Regarde la projection sur les limites planétaires
3. Examine les 9 obélisques autour du lac
4. Réconcilie le bourg au Tribunal du Triangle
5. Retourne voir Néva
6. Explore l’Observatoire des Limites
7. Replante la Graine-Mère

### 📜 Quête secondaire : Les zones mortes

1. Aide le pêcheur à comprendre l’eutrophisation

### 📜 Quête secondaire : Le trou dans le ciel

1. Écoute Ozonie

### 🧩 Énigmes et quiz

#### ⚖ Le Tribunal du Triangle
_Où : script « tribunal »_

1. Voix n°1 — « L’État a des leviers limités. On a les élus qu’on mérite. Les ressources et l’innovation sont dans le secteur privé. »  
   → **C’est le Politique**
2. Voix n°2 — « Je n’ai aucun pouvoir face aux multinationales. On est trop peu d’écolos face aux grandes puissances. »  
   → **C’est l’Individu**
3. Voix n°3 — « Si mes clients ne changent pas leurs habitudes, je ne peux pas changer mon offre. Je mourrais face à la concurrence. »  
   → **C’est l’Entreprise**
4. Le bourg entier — Tout le monde te regarde. Que proposes-tu pour briser le triangle ?  
   → **Que chacun agisse dans sa sphère et entraîne les autres : s’informer, être cohérent, agir au travail, montrer l’exemple**

#### 🔐 Salle 1 — Le terminal de décryptage
_Où : Observatoire des Limites, salle d’entrée (piédestal)_

- 1. Élément des engrais qui provoque l’eutrophisation et les « zones mortes » → **azote**
- 2. Nombre de limites planétaires dépassées selon le bilan 2025 → **7**
- 3. Pourcentage approximatif du couvert forestier mondial déjà disparu → **40 %** (accepté de 35 à 45)
- 4. Phénomène de l’océan dû à l’absorption d’un quart du CO₂ humain → **acidification**
- 5. Nombre de « zones mortes » citées dans la vidéo → **400**

> 💡 **À retenir :** Les « zones mortes » se comptent aujourd’hui par **centaines** (plus de 500 sites côtiers à faible oxygène recensés en 2018).

#### 🔒 Salle 2 — La serrure des neuf cadrans
_Où : Observatoire des Limites, grand hall (piédestal)_

- Changement climatique : **Dépassée**
- Intégrité de la biosphère : **Dépassée**
- Usage des sols : **Dépassée**
- Eau douce : **Dépassée**
- Flux d’azote et de phosphore : **Dépassée**
- Nouvelles entités : **Dépassée**
- Acidification des océans : **Dépassée**
- Couche d’ozone : **Sûre**
- Aérosols atmosphériques : **Sûre**

> 💡 **À retenir :** **7 limites dépassées** : climat, biosphère, sols, eau douce, azote/phosphore, nouvelles entités, acidification. **2 dans la zone sûre** : ozone et aérosols.

#### 🐟 Les zones mortes
_Où : auprès de Pêcheur Galet_

1. Quel processus crée les « zones mortes » ?  
   → **L’eutrophisation : trop de nutriments, prolifération puis décomposition des algues qui consomment l’oxygène** — L’excès d’azote et de phosphore (engrais, effluents) asphyxie les eaux.
2. À quelle limite planétaire est-ce lié ?  
   → **Les flux biogéochimiques (azote, phosphore)** — Une des limites les plus dépassées.
3. Combien de zones mortes côtières recense-t-on aujourd’hui ?  
   → **Plusieurs centaines (plus de 500)** — Plus de 400 dans les années 2000, plus de 500 recensées en 2018 (Breitburg et al., Science).

<a id="mines"></a>
## Chapitre 3 — Mines d’Abysse

### ⭐ Quête principale : Le poids réel du virtuel

1. Parle au contremaître Cobalt
2. Étudie le Mur des 90 éléments
3. Regarde la projection sur la rareté des métaux
4. Réponds à la question de Cobalt
5. Traverse la Fonderie
6. Replante la Graine-Mère

### 📜 Quête secondaire : L’inventaire

1. Compte tes équipements (mission terrain)
2. Retourne voir Comptine

### 📜 Quête secondaire : Neuf ou reconditionné ?

1. Résiste au Marchand Neuf-Toujours

### 📜 Quête secondaire : 15 ans, 10 ans, 5 ans

1. Examine les trois machines et aide le Vieux PC

### 🧩 Énigmes et quiz

#### 🛒 Le Marchand Neuf-Toujours
_Où : auprès de Marchand Neuf-Toujours_

1. Marchand — « Ton téléphone a 2 ans, il est fini ! » Ton téléphone fonctionne bien, mais la batterie tient moins longtemps. Que fais-tu ?  
   → **Je fais remplacer la batterie**
2. Marchand — « Bon, et si un jour il faut vraiment le remplacer ? »  
   → **Un appareil reconditionné**
3. Marchand — « Et ton ancien appareil, tu en fais quoi ? »  
   → **Je le donne, le revends, ou le dépose dans une filière de collecte**

#### ⏳ L’effondrement de la durée de vie
_Où : auprès de Vieux PC (conscient)_

Classe les machines de la **plus longue** à la **plus courte** durée de vie moyenne :
1. Machine de 1985 — 10 à 15 ans
2. Machine de 2003 — environ 10 ans
3. Machine de 2022 — environ 5 ans

> 💡 **À retenir :** Durée de vie divisée par **3** en 30 ans (WWF France). Ce n’est pas un accident technique, mais une évolution systémique de la conception : composants soudés, batteries collées, logiciels de plus en plus lourds.

#### 💾 Le patch d’éco-conception
_Où : auprès de Vieux PC (conscient)_

1. Pourquoi change-t-on le plus souvent d’ordinateur ?  
   → **Parce qu’il « rame » sous le poids de logiciels trop lourds** — L’obsolescence est souvent **logicielle**.
2. Quel est le levier n°1 d’un·e développeur·se pour réduire l’impact de la fabrication ?  
   → **Optimiser le code pour qu’il tourne sur du matériel ancien** — Moins de RAM et de CPU nécessaires = renouvellement des terminaux retardé.

#### 📱 Salle 1 — Assembler un smartphone
_Où : La Fonderie, salle d’entrée (piédestal)_

- **Terres rares (néodyme, terbium, europium…)** : Aimants des haut-parleurs et du vibreur ; Luminophores de l’écran (couleurs)
- **Métaux précieux (or, argent, palladium)** : Connexions des circuits imprimés
- **Métaux de batterie (cobalt, lithium)** : Batterie
- **Indium (oxyde d’indium-étain)** : Couche tactile transparente de l’écran

> 💡 **À retenir :** Plus de 30 éléments différents (jusqu’à 50-70 selon les modèles) dans un seul appareil !

#### ⌨ Salle 2 — Le terminal des ressources
_Où : La Fonderie, grand hall (piédestal)_

- Combien de **kilogrammes** de matières premières faut-il pour une puce de 1 gramme (WWF) ? → **16 kg**
- Combien de **millions** de smartphones sont jetés ou remplacés chaque mois dans l’UE (EuChemS, 2019) ? → **10 millions**
- Quel métal, indispensable aux écrans tactiles, devient très dépendant du recyclage ? → **indium**

> 💡 **À retenir :** L’indium est un sous-produit de l’extraction du zinc ; son recyclage reste faible. *(L’ancien cours le disait « 100 % dépendant du recyclage » : formulation exagérée.)*

#### ♻ Salle 3 — Le convoyeur du cycle de vie
_Où : La Fonderie, salle des archives (piédestal)_

Remets les 5 étapes du cycle de vie dans l’ordre, **du berceau à la tombe** :
1. ⛏ Extraction des matières premières
2. 🏭 Fabrication et assemblage
3. ✈ Transport et logistique
4. 🔌 Utilisation
5. ♻ Fin de vie

> 💡 **À retenir :** C’est l’**Analyse du Cycle de Vie** (ACV, normes ISO 14040/14044). Elle est **multicritère** : climat, ressources, eau, pollutions…

#### 📊 Salle 4 — Les jauges de la Fonderie
_Où : La Fonderie, salle des cristaux (piédestal)_

1. Pour un smartphone, quelle part de l’empreinte carbone vient de la fabrication ?  
   → **Environ 80 %** — L’usage pèse peu (recharge), la fabrication énormément.
2. Pour un serveur en centre de données, qu’est-ce qui domine en général ?  
   → **L’usage (électricité consommée 24 h/24)** — Un serveur tourne en continu : l’usage domine (environ 75 % dans l’ancien cours), surtout avec une électricité carbonée.
3. Selon Frédéric Bordage (GreenIT.fr), transporter une donnée demande…  
   → **Environ deux fois plus d’énergie que la stocker un an** — D’où l’intérêt de limiter les transferts inutiles.

<a id="marais"></a>
## Chapitre 4 — Marais des Réseaux

### ⭐ Quête principale : Surcharge du réseau

1. Parle à la Vigie, au pied de la tour
2. Actionne le compteur de la tour de guet
3. Examine la centrale électrique
4. Écoute le passeur Baud
5. Retourne voir la Vigie
6. Traverse le Relais
7. Replante la Graine-Mère

### 📜 Quête secondaire : La valise de Mémé

1. Aide Mémé Archiva à trier ses données

### 📜 Quête secondaire : Mon empreinte numérique

1. Calcule ton empreinte numérique (mission terrain)
2. Retourne voir Calculette

### 📜 Quête secondaire : 27 ans d’écran

1. Mesure ton temps d’écran (mission terrain)
2. Retourne voir Écrania

### 📜 Quête secondaire : Le pays Internet

1. Regarde la vidéo de synthèse et réponds au quiz

### 📜 Quête secondaire : Les câbles sous la mer

1. Écoute Ondin

### 🧩 Énigmes et quiz

#### 📡 Salle 1 — Relier l’école du village
_Où : Le Relais, salle d’entrée (piédestal)_

Sélectionne exactement :
- Fibre optique jusqu’à l’école
- Visio de classe en HD
- Messagerie de l’école

> 💡 **À retenir :** **Fibre + visio HD + messagerie** : tous les besoins sont couverts avec un minimum d’énergie. Le filaire consomme bien moins par donnée que le mobile (l’ancien cours citait « 4G = 23× l’ADSL », un ordre de grandeur ancien). Couper la box la nuit : un petit geste en plus.

#### 🎬 Salle 2 — La soirée cinéma
_Où : Le Relais, grand hall (piédestal)_

Une solution possible :
- Durée du film (h) : **2**
- Qualité (1 = SD, 2 = HD, 3 = 4K) : **2**
- Vidéos en lecture automatique en fond (h) : **0**

> 💡 **À retenir :** Supprimer la lecture automatique et adapter la qualité à l’écran divise les données par 2 à 7. La vidéo représente environ **deux tiers du trafic** Internet mondial (Sandvine).

#### ☎ Salle 3 — Le standard du Relais
_Où : Le Relais, salle des archives (piédestal)_

1. Quelle part de la consommation d’électricité française le numérique représente-t-il (ADEME-Arcep, données 2020) ?  
   → **Environ 10 %** — Environ 10 % (≈ 50 TWh). L’ancien cours citait 12 % en 2015 (55,5 TWh sur 476 TWh).
2. Selon le Sénat (2020), sans action, le numérique pourrait peser en 2040…  
   → **6,7 % de l’empreinte carbone de la France** — Attention : ce chiffre concerne la **France** (l’ancien cours le présentait à tort comme mondial).
3. Quelle connexion est la plus sobre pour une même quantité de données ?  
   → **La fibre (filaire)** — Le filaire reste nettement plus efficace que le mobile.
4. Quelle part du trafic intercontinental passe par des câbles sous-marins ?  
   → **Plus de 99 %** — Les satellites ne transportent qu’une infime partie du trafic.

#### 🗂 La valise de Mémé Archiva
_Où : auprès de Mémé Archiva_

- **Garder en ligne** : Le contrat de la maison
- **Supprimer** : Les 12 copies identiques de la même photo ; Les newsletters non lues de 2015 ; Une vidéo de 4 Go déjà publiée ailleurs
- **Archiver hors ligne** : Les photos des 80 ans de Pépé (originales) ; Les factures des 10 dernières années

> 💡 **À retenir :** Plus de la moitié des données stockées par les organisations seraient des **données sombres**, jamais réutilisées (étude Veritas). Les supprimer allège serveurs, sauvegardes et réseaux.

#### 🌐 Le pays Internet
_Où : après la vidéo « L’impact du numérique sur l’environnement » (pierre de projection)_

1. On dit souvent : « Si Internet était un pays… »  
   → **Il ferait partie des plus gros consommateurs d’électricité du monde** — Les classements varient (de la 3e à la 7e place selon les sources et les années) : retiens l’ordre de grandeur, pas le rang exact.
2. Quelle part de l’empreinte d’un équipement vient généralement de sa fabrication ?  
   → **70 à 80 %** — Extraction des terres rares, raffinage, assemblage…
3. Derrière chaque clic, il y a…  
   → **Des câbles sous-marins, des centres de données climatisés 24 h/24 et des antennes** — L’infrastructure invisible.

<a id="citadelle"></a>
## Chapitre 5 — Citadelle des Serveurs

### ⭐ Quête principale : Là où vit le cloud

1. Parle à l’ingénieure Calorine
2. Lis la stèle de Bordage
3. Convaincs le gardien Racko
4. Traverse la Salle des Machines
5. Replante la Graine-Mère

### 📜 Quête secondaire : Les zombies 404

1. Aide Lazare à décommissionner les sites zombies

### 📜 Quête secondaire : Le comparatif

1. Compare les hébergeurs avec la Courtière

### 📜 Quête secondaire : Le calculateur

1. Allège le site de la mairie avec Calculo

### 🧩 Énigmes et quiz

#### 🌡 Salle 1 — Le tableau de bord du PUE
_Où : Salle des Machines, salle d’entrée (piédestal)_

Une solution possible :
- Température de consigne en entrée de serveurs (°C) : **27**
- Free cooling (air extérieur) — % du temps : **40**
- Confinement des allées chaudes/froides (0 = non, 1 = oui) : **0**

> 💡 **À retenir :** **PUE = énergie totale / énergie informatique**. Les meilleurs centres atteignent 1,1 à 1,2 ; la moyenne mondiale tourne autour de 1,5-1,6 (Uptime Institute). Mais un bon PUE ne dit rien de l’**utilité** des calculs, ni du **carbone** de l’électricité, ni de l’**eau** consommée (indicateur WUE).

#### 🏢 Salle 2 — Vrai ou faux hébergement vert ?
_Où : Salle des Machines, grand hall (piédestal)_

- **Réduit réellement l’impact** : Électricité bas carbone fournie localement, heure par heure ; Récupération de la chaleur pour un réseau de chaleur urbain ; PUE mesuré et publié, avec WUE (eau) et facteur carbone
- **Affichage trompeur ou insuffisant** : « 300 % vert » grâce à des crédits carbone achetés ; Serveurs renouvelés tous les 2 ans pour être « plus efficaces » ; « Neutre en carbone » sans réduction mesurée des émissions

> 💡 **À retenir :** Critères d’un hébergement responsable : PUE et WUE faibles et publiés, électricité réellement bas carbone, récupération de chaleur, refroidissement naturel, matériel utilisé longtemps, localisation proche des utilisateurs, transparence (certifications ISO 50001, Code de conduite européen des centres de données).

#### 🔥 Salle 3 — La chaleur fatale
_Où : Salle des Machines, salle des archives (piédestal)_

1. Qu’est-ce que la « chaleur fatale » d’un centre de données ?  
   → **La chaleur produite par les serveurs, perdue si on ne la récupère pas** — Elle peut chauffer des logements, piscines ou serres.
2. Quel indicateur mesure la consommation d’eau d’un centre de données ?  
   → **Le WUE (Water Usage Effectiveness)** — WUE = litres d’eau par kWh informatique. Le CUE mesure le carbone.
3. Combien d’électricité les centres de données du monde ont-ils consommé en 2024 (AIE) ?  
   → **Environ 415 TWh** — Environ 1,5 % de l’électricité mondiale, et plus du double attendu en 2030.
4. En France, la fiscalité réduite sur l’électricité des centres de données (TICFE/accise) est conditionnée à…  
   → **Des engagements de gestion de l’énergie et de valorisation de la chaleur** — Le tarif réduit est assorti d’exigences (système de management de l’énergie, adhésion à un programme de bonnes pratiques, valorisation de la chaleur fatale ou objectifs de performance).

#### 🧟 Décommissionner un site zombie
_Où : auprès de Webarchiviste Lazare_

Remets les étapes de la fermeture propre d’un site dans l’ordre :
1. Informer les utilisateurs avec un message clair
2. Archiver ce qui doit l’être (version statique minimaliste)
3. Rediriger les adresses (redirections 301)
4. Éteindre les serveurs et supprimer les bases de données

> 💡 **À retenir :** Fermer proprement, c’est un acte responsable : un serveur inutile éteint, c’est environ **500 kWh** économisés par an (≈ 50 kg CO₂e avec un mix électrique moyen, bien moins en France).

#### 📋 Le comparatif des hébergeurs
_Où : auprès de Courtière Nuage_

- **Énergie réellement renouvelable** : Infomaniak (Suisse) : électricité hydraulique, PUE annoncé ≈ 1,09
- **Compensation / certificats** : GreenGeeks (États-Unis) : « 300 % vert » via des crédits d’énergie ; PlanetHoster (Canada) : compensation carbone à 140 %
- **Efficacité du refroidissement** : OVHcloud (France) : refroidissement à eau (watercooling), PUE annoncé ≈ 1,2
- **Hébergement standard** : Hébergeur inconnu : PUE > 2, électricité issue de charbon et de gaz

> 💡 **À retenir :** Un centre alimenté au charbon peut émettre plusieurs dizaines de fois plus de CO₂ qu’un centre alimenté par une électricité bas carbone pour la même puissance (l’ancien cours disait ×40). Pour vérifier : l’outil de la **Green Web Foundation**.

#### 🧮 Le calculateur de Calculo
_Où : auprès de Calculo_

Une solution possible :
- Pages vues par visite : **3**
- Poids moyen d’une page (Mo) : **0,3**

> 💡 **À retenir :** L’ancien cours disait qu’un site visité 1 million de fois par mois pouvait économiser 1,2 t CO₂e/an en s’allégeant de 1 Mo. Ces calculs dépendent fortement du modèle : **80 % de l’impact d’usage** vient souvent des terminaux des utilisateurs, et un site lourd pousse à changer d’appareil.

<a id="desert"></a>
## Chapitre 6 — Désert des Oracles

### ⭐ Quête principale : L’Oracle qui avait soif

1. Parle au Grand Oracle Gargantua
2. Regarde la projection sur l’IA
3. Parle à Mini, le petit modèle
4. Retourne voir Gargantua
5. Traverse le Labyrinthe de l’Oracle
6. Réponds à la question de l’Oracle

### 📜 Quête secondaire : L’oasis

1. Aide Source à comprendre la soif de l’IA

### 📜 Quête secondaire : Les puces

1. Le matériel de l’IA

### 📜 Quête secondaire : L’IA qui aide

1. Teste ton jugement avec Ayla

### 📜 Quête secondaire : Prompts sobres

1. Aide Promptia à adopter des usages sobres

### 🧩 Énigmes et quiz

#### 🧠 Salle 1 — Les trois soifs de l’IA
_Où : Labyrinthe de l’Oracle, salle d’entrée (piédestal)_

- **Fabrication du matériel** : Extraire les métaux et graver les puces et la mémoire des GPU ; Renouveler les cartes graphiques tous les 2 ou 3 ans pour rester dans la course
- **Entraînement du modèle** : Des milliers de GPU qui tournent pendant des semaines pour apprendre sur d’immenses corpus ; Relancer tout l’apprentissage pour une nouvelle version du modèle
- **Inférence (usage)** : Chacune des milliards de questions posées chaque jour par les utilisateurs ; ≈ 1,14 g CO₂e et ≈ 45 mL d’eau pour une réponse de 400 tokens (Mistral, 2025)

> 💡 **À retenir :** À grande échelle, l’**inférence** finit souvent par peser plus que l’entraînement, car elle se répète à l’infini. L’analyse de cycle de vie de Mistral Large 2 (avec Carbone 4 et l’ADEME, 2025) : entraînement + usage ≈ **85 %** des émissions, fabrication du matériel ≈ 11 %, terminaux des utilisateurs ≈ 3 %.

#### ⚖ Salle 2 — Le bon outil pour la bonne tâche
_Où : Labyrinthe de l’Oracle, grand hall (piédestal)_

- **Pas d’IA : un outil classique suffit (ou s’abstenir)** : Calculer 17 × 23 ; Trouver les horaires d’un train ; Générer 50 images de chats « pour rire »
- **Un petit modèle spécialisé** : Filtrer le spam d’une messagerie ; Traduire le menu d’un restaurant
- **Un grand modèle généraliste se justifie** : Analyser un contrat complexe de 80 pages et en dégager les risques

> 💡 **À retenir :** Générer une image peut coûter des centaines de fois plus qu’une réponse textuelle (jusqu’à l’équivalent d’une demi-recharge de smartphone avec les modèles les moins efficaces, Luccioni et al., 2023). Le **niveau 4** de l’éco-conception (la Forge) va jusqu’au bout de cette logique : parfois, la meilleure solution n’est pas numérique.

#### 🪞 Salle 3 — Le miroir du rebond
_Où : Labyrinthe de l’Oracle, salle des archives (piédestal)_

1. Un nouveau modèle consomme **10 fois moins** d’énergie par requête. Que se passe-t-il le plus souvent ?  
   → **Le service devient moins cher et plus rapide, l’usage explose, et la consommation totale peut augmenter**
2. Google annonce une énergie par requête divisée par 33 en un an. Pourtant…  
   → **… la consommation d’électricité de ses centres de données continue de grimper**
3. Quelle parade contre l’effet rebond ?  
   → **Associer efficacité ET sobriété : plafonds, usages choisis, mesure de la consommation totale**

#### 🏛 Salle 4 — Le tribunal de l’AI Act
_Où : Labyrinthe de l’Oracle, salle des cristaux (piédestal)_

- **Risque inacceptable (interdit)** : Un système de notation sociale des citoyens
- **Haut risque (obligations strictes)** : Une IA qui trie les CV des candidats à un emploi ; Une IA qui évalue les copies d’examen des élèves
- **Risque limité (transparence)** : Un chatbot de service client ; Une vidéo hypertruquée (« deepfake ») publiée en ligne
- **Risque minimal** : Un filtre anti-spam

> 💡 **À retenir :** Interdictions en vigueur depuis le **2 février 2025** ; règles pour les modèles d’usage général (dont documentation de l’énergie) depuis le **2 août 2025** ; obligations de transparence (art. 50) à partir d’**août 2026**. Les obligations « haut risque » ont été repoussées (fin 2027 / 2028) par l’« omnibus numérique » adopté en 2026 — à vérifier selon la date de ta lecture.

#### 💧 La soif de l’IA
_Où : auprès de Source l’hydrologue_

1. Pourquoi un centre de données consomme-t-il de l’eau ?  
   → **Pour refroidir les serveurs (et indirectement pour produire l’électricité)** — Tours de refroidissement par évaporation, et eau des centrales électriques.
2. Quelle consommation d’eau Google a-t-il déclarée pour ses centres de données en 2024 ?  
   → **Environ 31 milliards de litres** — Selon son rapport environnemental 2025 (≈ 8,1 milliards de gallons).
3. Pour une requête texte médiane, Google annonce environ…  
   → **0,26 mL d’eau (≈ 5 gouttes)** — Peu par requête… multiplié par des milliards de requêtes par jour.

#### 🔲 Le matériel de l’IA
_Où : auprès de Puce la fondeuse_

1. Sur quel matériel tournent la plupart des grands modèles d’IA ?  
   → **Des cartes graphiques (GPU) et accélérateurs spécialisés** — Avec des mémoires à haute bande passante (HBM), très gourmandes à fabriquer.
2. Combien de déchets électroniques l’IA générative pourrait-elle produire d’ici 2030 (estimation Nature Computational Science, 2024) ?  
   → **1,2 à 5 millions de tonnes** — Selon le rythme de renouvellement des serveurs.

#### 🌱 L’IA au service de la transition
_Où : auprès de Chercheuse Ayla_

1. Lequel de ces usages de l’IA aide directement la transition écologique ?  
   → **Détecter des fuites de méthane sur des images satellites** — Le méthane réchauffe fortement : repérer les fuites a un impact immédiat.
2. Les bénéfices climatiques de l’IA sont-ils automatiques ?  
   → **Non : ils dépendent des usages choisis et doivent être mesurés** — L’AIE souligne que les gains potentiels ne se matérialiseront pas sans politiques volontaristes.
3. Quel référentiel français aide à concevoir une « IA frugale » ?  
   → **L’AFNOR SPEC 2314 (2024)** — Il propose une méthode et des bonnes pratiques pour mesurer et réduire l’impact des services d’IA.

#### ✍ Les usages sobres de l’IA
_Où : auprès de Promptia_

Sélectionne exactement :
- Me demander si j’ai vraiment besoin d’une IA
- Utiliser un moteur de recherche ou un site officiel pour une info factuelle
- Préciser ma demande dès le départ pour éviter les allers-retours
- Choisir un modèle plus petit quand il suffit
- Demander des réponses courtes quand c’est suffisant
- Vérifier les réponses (les IA peuvent « halluciner »)

> 💡 **À retenir :** Les usages sobres réduisent le nombre de requêtes et leur coût. Et vérifier les réponses, c’est aussi éviter des erreurs coûteuses.

<a id="decharge"></a>
## Chapitre 7 — Décharge de Ferraille

### ⭐ Quête principale : Le Procès de l’Obsolescence

1. Parle à la Juge Durabilis
2. Écoute Maître Obsolète
3. Recueille 3 témoignages : Fixie, Ewan et Fairphonia
4. Retourne voir la Juge
5. Le Procès de l’Obsolescence
6. Réponds à la Juge

### 📜 Quête secondaire : 62 millions de tonnes

1. Aide Ewan à trier les déchets

### 📜 Quête secondaire : Le téléphone modulaire

1. Répare un téléphone modulaire

### 📜 Quête secondaire : Le baromètre

1. Le quiz de Barométrine

### 📜 Quête secondaire : Le maire de 50 000 habitants

1. Conseille le maire

### 🧩 Énigmes et quiz

#### 📁 Salle 1 — Les pièces à conviction
_Où : Le Procès de l’Obsolescence, salle d’entrée (piédestal)_

- **Loi AGEC (2020)** : Une note de réparabilité (puis de durabilité) affichée en magasin ; La facture de l’opérateur indique l’équivalent CO₂ des données consommées
- **Délit d’obsolescence programmée (2015)** : Une mise à jour qui ralentit volontairement d’anciens modèles pour pousser à racheter
- **Loi REEN (2021)** : Les écoles d’ingénieurs doivent former à l’écoconception des services numériques
- **Directive européenne USB-C** : Un chargeur commun pour téléphones, tablettes et (depuis 2026) ordinateurs portables
- **Règlement européen écoconception des smartphones** : Pièces détachées disponibles 7 ans et batteries tenant 800 cycles

> 💡 **À retenir :** Ensemble, ces textes forment un arsenal contre l’obsolescence et le gaspillage. Sans régulation, le marché privilégie le renouvellement rapide.

#### ⚖ Salle 2 — Le code de Verdance
_Où : Le Procès de l’Obsolescence, grand hall (piédestal)_

1. Quelles sanctions prévoit le délit d’obsolescence programmée en France ?  
   → **Jusqu’à 2 ans de prison et 300 000 € d’amende (ou 5 % du chiffre d’affaires)** — Créé par la loi de transition énergétique de 2015, renforcé par la loi AGEC.
2. La directive européenne sur le « droit à la réparation » (2024/1799)…  
   → **A été adoptée en 2024 et doit être transposée par les États d’ici juillet 2026** — Elle facilite la réparation (obligation de réparer certains produits, plateforme européenne, garantie prolongée après réparation). *L’ancien cours la disait « en discussion » avec une durée de vie de 10 ans : c’était inexact.*
3. La loi « Climat et Résilience » (2021) est…  
   → **Une loi française, qui prévoit notamment un affichage environnemental de certains produits** — *L’ancien cours la présentait à tort comme un standard européen imposant l’affichage de l’ACV complète.*
4. Depuis la loi AGEC, les acheteurs publics doivent acquérir…  
   → **Une part de matériel informatique reconditionné ou issu du réemploi (au moins 20 %)** — L’État et les collectivités montrent l’exemple.

#### 🔨 Salle 3 — Le verdict
_Où : Le Procès de l’Obsolescence, salle des archives (piédestal)_

1. Maître Obsolète — « Ralentir de vieux téléphones par une mise à jour, c’est pour protéger leurs batteries ! Personne n’a jamais été condamné pour ça ! »  
   → **Faux : en 2020, la DGCCRF a infligé 25 millions d’euros d’amende à Apple pour ne pas avoir informé ses clients de ce ralentissement**
2. Maître Obsolète — « De toute façon, une batterie collée, c’est plus fin et plus joli. Le client le veut ! »  
   → **Le règlement européen impose désormais des batteries remplaçables et durables sur les smartphones**
3. Juge Durabilis — Quelle peine requiers-tu contre l’obsolescence ?  
   → **Appliquer la loi, mais aussi rendre la réparation facile et moins chère que le remplacement : pièces, information, indices, fonds réparation**

#### ♻ Le tri d’Ewan
_Où : auprès de Ewan le ferrailleur_

- **Réemploi ou don** : Un ordinateur qui fonctionne mais ne sert plus ; Une tablette qui marche, oubliée dans un tiroir
- **Réparation** : Un téléphone à l’écran fissuré
- **Collecte DEEE (recyclage)** : Une vieille imprimante hors d’usage ; Un câble électrique dénudé
- **Collecte piles et batteries** : Une batterie lithium gonflée

> 💡 **À retenir :** Réemploi et réparation d’abord ! Les batteries ne vont jamais à la poubelle : elles peuvent provoquer des incendies dans les centres de tri.

#### 🔧 Réparer un téléphone modulaire
_Où : auprès de Fairphonia_

Remets les étapes de la réparation dans l’ordre :
1. Diagnostiquer la panne
2. Commander le module de rechange
3. Dévisser le dos de l’appareil
4. Remplacer le module défectueux
5. Tester l’appareil
6. Déposer l’ancien module en point de collecte

> 💡 **À retenir :** Un appareil conçu pour être réparé (vis standard, modules, pièces disponibles, documentation) peut durer bien plus longtemps.

#### 📈 Le baromètre de durabilité
_Où : auprès de Barométrine_

1. Que mesure un baromètre de durabilité comme celui des distributeurs (SAV) ?  
   → **La fiabilité des produits et leur facilité de réparation, par marque** — Ces classements évoluent chaque année : consulte la version la plus récente.
2. Garder son ordinateur un an de plus, c’est…  
   → **Éviter une partie de l’impact de fabrication d’un nouvel appareil** — L’ancien cours estimait ~156 kg CO₂e évités par développeur et par an (ordre de grandeur).

#### 🏛 La loi REEN et les collectivités
_Où : auprès de Maire Citadin_

1. Maire — Que m’impose la loi REEN (2021) en tant que ville de plus de 50 000 habitants ?  
   → **Définir une stratégie numérique responsable (depuis 2025)**
2. Maire — Par quoi commencer, concrètement ?  
   → **Acheter du reconditionné, allonger la durée de vie du parc, écoconcevoir les sites de la ville (référentiel RGESN)**

<a id="forge"></a>
## Chapitre 8 — Forge des Bâtisseurs

### ⭐ Quête principale : Bâtir léger

1. Parle à Maître Sobre
2. Regarde la projection sur l’éco-conception
3. Atelier 1 : Spécifications
4. Atelier 2 : Design
5. Atelier 3 : Développement
6. Atelier 4 : Hébergement
7. Retourne voir Maître Sobre
8. Dégraisse le Golem Obésiciel (au sud de la Forge)
9. Retourne voir Maître Sobre
10. L’Atelier du Bâtisseur
11. Replante la Graine-Mère

### 📜 Quête secondaire : La bibliothèque

1. Lis les quatre référentiels

### 📜 Quête secondaire : Pourquoi éco-concevoir ?

1. Les cinq leviers de valeur

### 📜 Quête secondaire : Le chien qui sentait mieux que l’IA

1. Trouve Truffe

### 📜 Quête secondaire : Apollo 64 Ko

1. L’obésité logicielle

### 📜 Quête secondaire : Le CMS sobre

1. Les alternatives sobres

### 📜 Quête secondaire : Les 4 niveaux

1. Classe les cas célèbres

### 📜 Quête secondaire : Eco-Slash

1. Atteins 20 points à la borne d’arcade

### 🧩 Énigmes et quiz

#### 📝 Atelier 1 — La grille 3U
_Où : script « atelier:spec »_

- **Garder** : Rechercher un trajet ; Payer son billet ; Navigation entièrement au clavier (accessibilité) ; Billet consultable hors ligne
- **Supprimer (ou ne pas développer)** : Carrousel de 8 promotions en page d’accueil ; Vidéo d’ambiance en lecture automatique ; Chatbot d’IA générative pour donner l’heure ; Widget météo animé

> 💡 **À retenir :** Selon une étude souvent citée (Standish Group, 2002), environ **45 %** des fonctionnalités développées ne sont jamais utilisées et ~25 % rarement. Chaque fonctionnalité refusée en amont = code non écrit = serveurs non provisionnés = énergie non consommée.

#### 🖼 Atelier 2a — Le labo de compression
_Où : script « atelier:design »_

Une solution possible :
- Largeur envoyée (px) : **800**
- Qualité de compression (%) : **70**
- Format (1 = JPEG, 2 = WebP, 3 = AVIF) : **2**

> 💡 **À retenir :** Les images représentent souvent la plus grosse part du poids d’une page. Redimensionner, compresser et utiliser un format moderne permet de passer de 1 400 Ko à quelques dizaines de Ko.

#### 🎨 Atelier 2b — Les règles de la Green UX
_Où : script « atelier:design »_

1. Pourquoi concevoir « mobile first » ?  
   → **Le petit écran force à prioriser l’essentiel ; « display:none » n’empêche pas le téléchargement** — Règle n°04 : amélioration progressive plutôt que dégradation gracieuse.
2. Les carrousels…  
   → **Sont très peu cliqués au-delà de la première image, mais chargent plusieurs images lourdes** — Règle n°10 : moins de 1 % des clics au-delà de la première image selon une étude souvent citée.
3. Polices système plutôt que polices téléchargées : pourquoi ?  
   → **Elles ne pèsent rien (au lieu de 100 à 300 Ko par famille)** — Règle n°32. Ce jeu n’utilise que des polices système !
4. Le mode sombre économise de l’énergie…  
   → **Surtout sur les écrans OLED, où un pixel noir est éteint** — Jusqu’à ~40 % d’énergie d’écran en moins sur OLED à forte luminosité (Google, 2018). Pas d’effet sur les écrans LCD.
5. Wikipédia, l’un des sites les plus visités au monde, pèse environ…  
   → **Quelques centaines de Ko par page** — La preuve qu’un design sobre et centré sur le contenu n’empêche pas le succès.

#### 💻 Atelier 3 — Le code comme filtre énergétique
_Où : script « atelier:dev »_

1. Dans l’étude SLE 2017 (27 langages), quel langage était le plus économe en énergie ?  
   → **C** — C = 1,00 ; Rust 1,03 ; C++ 1,34 ; JavaScript 4,45 ; Python ≈ 76 ; Perl ≈ 80 (énergie relative).
2. Python consommait environ combien de fois plus d’énergie que C dans cette étude ?  
   → **≈ 75 fois** — Mais les contraintes métier imposent souvent d’autres langages : l’essentiel est d’écrire du code efficace, quel que soit le langage.
3. Quelle pratique est à proscrire ?  
   → **Faire des requêtes SQL dans une boucle** — Règle n°64.
4. Quel type de framework limite le JavaScript envoyé au navigateur ?  
   → **Les frameworks légers ou orientés statique (Astro, Svelte…)** — Ordres de grandeur de l’ancien cours : ~50 Ko contre ~200 Ko.
5. L’impact d’un code optimisé est…  
   → **Multiplié par le nombre de visiteurs** — Serveurs ET terminaux de tous les utilisateurs.

#### ☁ Atelier 4 — Déployer durable
_Où : script « atelier:host »_

1. Quel outil permet de vérifier si un site est hébergé sur des serveurs alimentés par une énergie verte ?  
   → **Le Green Web Check de la Green Web Foundation** — L’ancien cours simulait ce test au hasard : utilise le vrai outil !
2. À quoi sert un CDN ?  
   → **Rapprocher les contenus des utilisateurs pour réduire la latence et les transferts longs** — Règle n°69.
3. Quand un site n’est plus utile, il faut…  
   → **Le décommissionner proprement** — Pas de site zombie !

#### 💎 Les cinq leviers de valeur
_Où : auprès de Conseillère Valeur_

- **Réduction des coûts** : Moins de code = moins de serveurs, de bande passante et de maintenance (souvent 20 à 40 % d’économies sur des coûts IT récurrents, selon l’ancien cours)
- **Conformité réglementaire** : Anticiper AGEC, REEN, la CSRD et la taxonomie européenne
- **Image et différenciation** : Une majorité de consommateurs disent privilégier les marques engagées ; les jeunes diplômés aussi
- **Éthique des données** : Collecte minimale de données (privacy by design), RGPD facilité, surface d’attaque réduite
- **Impact environnemental mesurable** : Moins d’émissions (scope 3), de minerais, d’eau et de déchets électroniques

> 💡 **À retenir :** Pour un comité de direction, l’éco-conception est aussi un levier **économique**, **juridique**, **marketing** et **de confiance**.

#### 🪜 Les 4 niveaux de maturité
_Où : auprès de Échelonne_

- **Niveau 1 — Optimisation technique** : Minifier le CSS/JS, compresser les images, mettre en cache
- **Niveau 2 — Architecture et technologie** : IBM Suisse réécrit un algorithme : traitement de 33 h → 20 min, énergie ÷ 100 ; Decathlon optimise une requête SQL (12 s → 5 s) et renonce à construire un data center
- **Niveau 3 — Innovation fonctionnelle** : mPedigree : vérifier un médicament par SMS gratuit, sans smartphone ni Internet
- **Niveau 4 — Rupture (low-tech)** : KDOG : des chiens détectent le cancer du sein à l’odeur, sans serveur

> 💡 **À retenir :** Niveau 1 : gains rapides (10 à 30 % sur l’usage). Niveau 2 : investir dans l’intelligence algorithmique plutôt que dans le matériel. Niveau 3 : questionner le besoin. Niveau 4 : parfois, ne pas utiliser de numérique du tout.

#### 🚀 L’obésité logicielle
_Où : auprès de Apollon l’astronaute_

1. Windows 10 + Office 2019 demandent environ combien de fois plus de RAM que Windows 98 + Office 97, pour des usages comparables (GreenIT.fr) ?  
   → **≈ 171 fois** — De 32 Mo à 5,5 Go.
2. La page de réservation d’une grande compagnie ferroviaire pesait 3 Ko en 1999. Aujourd’hui ?  
   → **Plusieurs Mo (≈ 3,8 Mo dans l’exemple du cours)** — ×1 267 pour la même fonction : réserver un billet.
3. Quelle est la conséquence principale de l’« obésiciel » ?  
   → **On change d’appareil parce qu’il rame, pas parce qu’il est cassé** — Obsolescence matérielle forcée, plus d’électricité, exclusion numérique des vieux appareils.
4. Combien pèse une page web médiane aujourd’hui (HTTP Archive) ?  
   → **Environ 2 à 2,5 Mo** — Le poids médian a environ doublé en 10 ans.

#### 🧰 Le CMS sobre
_Où : auprès de Cémésia_

1. WordPress équipe environ…  
   → **Plus de 40 % de tous les sites web (et ~60 % des sites utilisant un CMS)** — W3Techs ; l’ancien cours citait 64,1 % du marché des CMS.
2. Quelle alternative sobre l’ancien cours citait-il ?  
   → **Translucide, un CMS français écoconçu et open source** — Basé sur des standards HTML/CSS/PHP, ~50 Ko contre ~500 Ko (ordres de grandeur du cours). Les générateurs de sites statiques sont une autre option.

#### 🧱 Salle 1 — Le filtre des Bâtisseurs
_Où : L’Atelier du Bâtisseur, salle d’entrée (piédestal)_

Sélectionne exactement :
- Horaires et contacts des services
- Démarches en ligne accessibles
- Agenda des événements
- Version imprimable des démarches
- Moteur de recherche interne

> 💡 **À retenir :** La grille 3U s’applique au **contexte** : la même fonctionnalité peut être utile ici et superflue ailleurs (ex. un moteur de recherche sur un site de 5 pages).

#### ⚖ Salle 2 — La page de 100 Ko
_Où : L’Atelier du Bâtisseur, grand hall (piédestal)_

Sélectionne exactement :
- HTML/CSS minimal et sémantique
- Photo d’accroche AVIF redimensionnée
- Plan d’accès en image statique + adresse en texte
- Formulaire de contact simple

> 💡 **À retenir :** Une page complète et utile sous 100 Ko : c’est le poids d’une page des années 2000… avec l’ergonomie d’aujourd’hui.

#### 🏗 Salle 3 — L’épreuve du Bâtisseur
_Où : L’Atelier du Bâtisseur, salle des archives (piédestal)_

1. Quel niveau de maturité consiste à questionner le besoin lui-même ?  
   → **Niveau 3 — Innovation fonctionnelle** — « Faut-il vraiment livrer à domicile, ou un point relais suffit-il ? »
2. Un site éco-conçu peut consommer jusqu’à…  
   → **Environ 70 % d’énergie en moins qu’un site standard aux mêmes fonctionnalités** — Ordre de grandeur cité par l’ancien cours.
3. Les 3 piliers de l’éco-conception de services numériques sont…  
   → **Sobriété, performance, accessibilité** — Un service inclusif dure plus longtemps et sert plus de monde.

<a id="sanctuaire"></a>
## Chapitre 9 — Sanctuaire de la Mesure

### ⭐ Quête principale : Mesurer pour piloter

1. Parle à Indexa la Mesureuse
2. Mesure un vrai site sur EcoIndex.fr (mission terrain)
3. Regarde la projection (conférence sur l’éco-conception web)
4. Interprète ta mesure avec Indexa
5. Traverse le Sceau de l’Index
6. Affronte l’Omnium (8 Graines-Mères requises)
7. Rédige ton plan d’action Green IT

### 📜 Quête secondaire : Les indicateurs

1. Le quiz de Kapi

### 🧩 Énigmes et quiz

#### 🧮 Salle 1 — Calculer un EcoIndex à la main
_Où : Le Sceau de l’Index, salle 1 (piédestal)_

- Quantile DOM (Q_DOM) → **5**
- Quantile requêtes (Q_requêtes) → **8**
- Quantile poids (Q_poids) → **4**
- Score EcoIndex (une décimale) → **70,8** (accepté de 70,4 à 71,2)
- Note (lettre) → **B**

> 💡 **À retenir :** Score ≈ **70,8** → note **B**. Quand la valeur tombe entre deux rangs, on interpole (ex. 17 requêtes, entre 15 et 25 → quantile ≈ 2,2). *L’ancien cours affichait la formule sans le facteur 5 : c’était une erreur.*

#### 📏 Salle 2 — Le panthéon des indicateurs
_Où : Le Sceau de l’Index, salle 2 (piédestal)_

- **PUE** : Énergie totale d’un centre de données / énergie des équipements informatiques
- **WUE** : Litres d’eau consommés par kWh informatique
- **Intensité carbone (CUE)** : Grammes de CO₂e par kWh (dépend du mix électrique)
- **EcoIndex** : Note de A à G d’une page web, à partir du DOM, des requêtes et du poids
- **Website Carbon** : Estimation des émissions de CO₂ par visite d’une page

> 💡 **À retenir :** Un tableau de bord Green IT combine des indicateurs d’infrastructure (PUE, WUE, CUE), de services (EcoIndex, poids, requêtes) et de parc (durée de vie, taux de reconditionné).

#### 🔬 Comment marche un outil de mesure ?
_Où : auprès de Kapi l’Indicateur_

1. Quand tu testes une URL sur EcoIndex, le serveur…  
   → **Ouvre un navigateur Chromium « headless », sans cache ni cookies, et analyse la page** — Résolution 1920×1080, attente de 3 s, défilement complet (chargement différé), nouvelle attente, puis extraction du DOM, du poids et des requêtes.
2. Avec quels outils automatise-t-on ce genre de navigateur ?  
   → **Puppeteer ou Selenium** — Des bibliothèques de pilotage de navigateurs.
3. Pourquoi des quantiles ?  
   → **Pour situer la page par rapport à un grand échantillon de pages réelles (HTTP Archive)** — Un score relatif : être meilleur que la majorité des pages du web.

<a id="temples"></a>
## Temples (style « Zelda ») : marche à suivre

Les 8 temples à Graine-Mère partagent la même ossature (une grille de 3 × 3 salles, en miroir un temple sur deux), mais chacun a sa **salle signature** :

```
[ARCHIVES]      [GARDIEN]       [CRISTAUX]
    |  (VRAI/FAUX)    ║ (grande clé)     | (énigme des archives)
[RÉPONSES] -🗝- [GRAND HALL] -(énigme 2)- [BLOC]
                   | (énigme 1)
               [ENTRÉE]
```

1. **Entrée** : énigme du piédestal → la porte nord s’ouvre.
2. **Grand hall** : énigme du piédestal → la porte est s’ouvre.
3. **Salle signature** (à côté du hall, mécanique propre à chaque temple, voir le tableau ci-dessous) : réussis-la, un coffre apparaît : **petite clé**.
4. Retourne au hall : la **porte à serrure** (de l’autre côté) s’ouvre avec la petite clé.
5. **Salle des réponses** : lis la stèle (E). Si l’affirmation est vraie, pousse le bloc sur **VRAI**, sinon sur **FAUX**. En cas d’erreur, le bloc revient et une nouvelle affirmation apparaît : les réponses sont dans le tableau des idées reçues ci-dessous.
6. **Archives** (nord) : énigme du piédestal (s’il y en a une). Elle ouvre **à distance** la porte nord de la salle du bloc.
7. **Salle des cristaux** : frappe les 4 cristaux **dans l’ordre** de la séquence (voir le tableau). S’il y a un piédestal, résous aussi son énigme. Un coffre apparaît : **grande clé**.
8. Au hall, la **grande porte** (nord) s’ouvre avec la grande clé : **le Gardien**. Frappe-le ; à mi-vie il se protège : pare ses bulles (Maj) en répondant juste, puis frappe son **point faible**.
9. Ouvre le coffre du Gardien, puis prends la Graine-Mère sur l’autel.

| Temple | Salle signature |
|---|---|
| Temple de la Serre | La balance des gaz : pousse **CO₂ sur ×1**, **CH₄ sur ×28**, **N₂O sur ×273**. Astuce : monte d’abord le N₂O d’un cran et décale-le, puis place les autres. |
| Observatoire des Limites | Les dalles des limites : marche sur chaque dalle pour la mettre en **rouge (dépassée)** : Climat, Biosphère, Sols, Eau douce, Azote/phosphore, Nouvelles entités, Océans acides ; et en **vert (sûre)** : Ozone, Aérosols. |
| La Fonderie | Le filon : frappe les 3 rochers du tunnel (Néodyme, Indium, Cobalt) pour atteindre le coffre. |
| Le Relais | Le grand tri : **rouge = supprimer** Photos en double, Vieux mails pub, Vidéos 4K oubliées, copie_de_copie.zip ; **vert = garder** Mémoire de stage, Factures, Photos de famille, CV à jour. Puis frappe le levier. |
| Salle des Machines | La salle qui chauffe : éteins **Site zombie, Test oublié, Copies ×5, Zombie 2015** ; laisse **Messagerie** et **Site de l’école** allumés (≤ 27 °C). |
| Labyrinthe de l’Oracle | Le couloir des mirages : les murs qui **scintillent** sont faux. Traverse-les pour atteindre le coffre. |
| Le Procès de l’Obsolescence | L’atelier de réparation : brise les pots pour trouver **Écran, Batterie, Port USB-C**, puis appuie sur E devant l’établi. |
| L’Atelier du Bâtisseur | La page obèse : détruis **Pub, Vidéo auto, Carrousel, Trackers, 5 polices** ; garde **Texte, Bouton contact, Image compressée** (≤ 200 Ko). |

| Temple | Séquence des cristaux (dans l’ordre) |
|---|---|
| Temple de la Serre (Steppes de l’Holocène) | De l’activité humaine au réchauffement : **Activité humaine → Émission de GES → Effet de serre renforcé → Réchauffement** |
| Observatoire des Limites (Bassin des 9 Sceaux) | Comment naît une « zone morte » : **Engrais azotés → Ruissellement → Algues en excès → Zone sans oxygène** |
| La Fonderie (Mines d’Abysse) | Le cycle de vie d’un appareil (ACV) : **Extraction → Fabrication → Usage → Fin de vie** |
| Le Relais (Marais des Réseaux) | Le voyage d’une vidéo jusqu’à toi : **Centre de données → Réseau (câbles) → Box ou antenne → Ton écran** |
| Salle des Machines (Citadelle des Serveurs) | Fermer proprement un site zombie : **Informer → Archiver → Rediriger (301) → Éteindre** |
| Labyrinthe de l’Oracle (Désert des Oracles) | La vie d’un modèle d’IA : **Collecte des données → Entraînement → Déploiement → Inférence (usage)** |
| Le Procès de l’Obsolescence (Décharge de Ferraille) | Que faire d’un appareil ? (du meilleur au dernier recours) : **Le garder → Le réparer → Le réemployer → Le recycler** |
| L’Atelier du Bâtisseur (Forge des Bâtisseurs) | La feuille de route de l’éco-conception : **Spécifications → Design → Développement → Hébergement** |

<a id="combats"></a>
## Combats : idées reçues (parade VRAI / FAUX)

Lève le bouclier (**Maj**) face à une bulle, puis réponds. `*` = toutes les régions.

| Région | Affirmation | Réponse | Pourquoi |
|---|---|---|---|
| * | Le numérique est immatériel : il ne pollue pas. | **FAUX** | Il repose sur des milliards d’équipements, de câbles et de centres de données très matériels. |
| * | Le cloud, c’est juste un nuage : ça ne consomme rien. | **FAUX** | Le « cloud », ce sont des centres de données qui tournent 24 h/24 : ~415 TWh d’électricité en 2024 dans le monde (AIE). |
| * | Le numérique représente entre 2 et 4 % des émissions mondiales de GES. | **VRAI** | Ordre de grandeur comparable à l’aviation civile. |
| * | Pour un smartphone, la fabrication pèse bien plus que l’usage. | **VRAI** | Environ 80 % de son empreinte carbone vient de sa fabrication. |
| Steppes de l’Holocène | Le climat a toujours changé, il n’y a rien d’anormal. | **FAUX** | Depuis 10 000 ans, il n’a varié que de ±1 °C. Le rythme actuel est inédit et d’origine humaine. |
| Steppes de l’Holocène | Le CO₂ est le seul gaz à effet de serre qui compte. | **FAUX** | Méthane (PRG ~28) et N₂O (~273) pèsent lourd, ainsi que les gaz fluorés. |
| Steppes de l’Holocène | L’effet de serre est une invention humaine à supprimer. | **FAUX** | Il est naturel et vital : sans lui, −18 °C. C’est son renforcement qui pose problème. |
| Steppes de l’Holocène | Sans effet de serre naturel, la Terre serait à environ −18 °C. | **VRAI** | Exact : l’effet de serre naturel rend la vie possible. |
| Steppes de l’Holocène | 2024 a été l’année la plus chaude jamais mesurée. | **VRAI** | +1,60 °C par rapport au préindustriel (Copernicus). |
| * | L’océan a absorbé environ 90 % de la chaleur excédentaire. | **VRAI** | Exact (GIEC AR6). |
| Steppes de l’Holocène | +2 °C de moyenne, c’est à peine une différence entre deux journées. | **FAUX** | Une moyenne mondiale : en 10 000 ans, elle n’a varié que de ±1 °C. +2 °C bouleverse saisons, récoltes, niveaux des mers. |
| Steppes de l’Holocène | Environ la moitié de l’empreinte carbone française vient des importations. | **VRAI** | Exact : ~284 Mt sur ~563 Mt en 2024 (SDES). |
| * | Il suffit de planter des arbres pour compenser nos émissions. | **FAUX** | La compensation est lente, incertaine et limitée. Il faut d’abord réduire à la source. |
| Bassin des 9 Sceaux | Les limites planétaires ne concernent que le climat. | **FAUX** | Il y en a neuf : biodiversité, sols, eau, azote, océans, nouvelles entités… |
| Bassin des 9 Sceaux | C’est aux autres d’agir en premier. | **FAUX** | C’est le triangle de l’inaction : chacun attend les autres, donc personne n’agit. |
| Bassin des 9 Sceaux | 73 % des animaux sauvages ont disparu depuis 1970. | **FAUX** | Nuance : c’est une baisse MOYENNE de 73 % de la taille des populations suivies (WWF 2024), pas 73 % des animaux. |
| Bassin des 9 Sceaux | Sept limites planétaires sur neuf sont dépassées (bilan 2025). | **VRAI** | Exact : l’acidification des océans est la 7e. |
| * | La couche d’ozone se reconstitue grâce au Protocole de Montréal. | **VRAI** | Exact : l’action collective fonctionne. |
| Bassin des 9 Sceaux | Environ 40 % du couvert forestier mondial a disparu. | **VRAI** | Exact, il en reste environ 60 % (limite : 75 %). |
| Bassin des 9 Sceaux | L’océan est environ 30 % plus acide qu’au XIXe siècle. | **VRAI** | Exact, en raison du CO₂ absorbé. |
| Mines d’Abysse | Les terres rares sont rares parce qu’il y en a très peu sur Terre. | **FAUX** | Elles ne sont pas forcément rares en quantité, mais difficiles à séparer et polluantes à purifier. |
| * | Le recyclage récupère presque tous les métaux de nos appareils. | **FAUX** | Seuls ~22 % des e-déchets sont recyclés de façon documentée, et ~1 % de la demande en terres rares est couverte par le recyclage. |
| Mines d’Abysse | Un smartphone, c’est surtout du plastique et du verre. | **FAUX** | Il contient plus de 30 éléments chimiques, dont des métaux rares et précieux. |
| Mines d’Abysse | L’essentiel de l’impact d’un ordinateur portable vient de sa consommation électrique. | **FAUX** | En France, c’est sa fabrication (environ 75 % de son empreinte carbone). |
| Mines d’Abysse | Il faut environ 16 kg de matières premières pour fabriquer une puce de 1 g. | **VRAI** | Exact, selon le WWF. |
| Mines d’Abysse | Environ 10 millions de smartphones sont jetés ou remplacés chaque mois dans l’UE. | **VRAI** | Exact (EuChemS, 2019). |
| * | Garder son appareil 4 ans au lieu de 2 divise par deux son impact de fabrication annuel. | **VRAI** | Exact : l’impact est réparti sur deux fois plus d’années. |
| Mines d’Abysse | La Chine raffine la grande majorité des terres rares mondiales. | **VRAI** | Exact : près de 90 % du raffinage. |
| Marais des Réseaux | Supprimer mes e-mails est LE geste écologique numérique le plus efficace. | **FAUX** | C’est utile mais marginal : garder ses équipements plus longtemps pèse bien plus lourd. |
| Marais des Réseaux | La 5G va forcément réduire la consommation des réseaux. | **FAUX** | Plus efficace par bit, mais elle stimule les usages et le renouvellement des appareils : effet rebond. |
| Marais des Réseaux | Internet passe surtout par les satellites. | **FAUX** | Plus de 99 % du trafic intercontinental passe par des câbles sous-marins. |
| * | La vidéo représente environ deux tiers du trafic Internet mondial. | **VRAI** | Exact (Sandvine). |
| Marais des Réseaux | Le numérique consomme environ 10 % de l’électricité en France. | **VRAI** | Exact (ADEME-Arcep). |
| Marais des Réseaux | Une connexion filaire est plus sobre qu’une connexion mobile. | **VRAI** | Exact, pour une même quantité de données. |
| Marais des Réseaux | Plus de la moitié des données stockées par les entreprises ne sont jamais réutilisées. | **VRAI** | Ce sont les « données sombres ». |
| Marais des Réseaux | Le numérique pèsera 6,7 % des émissions mondiales en 2040. | **FAUX** | Ce chiffre du Sénat concerne l’empreinte carbone de la France, pas le monde. |
| Citadelle des Serveurs | Un hébergeur « neutre en carbone » n’émet rien. | **FAUX** | Il compense (crédits, plantations) : ses émissions réelles existent toujours. |
| Citadelle des Serveurs | Un PUE de 1,0, c’est facile à atteindre. | **FAUX** | C’est la limite théorique : il faudrait zéro énergie pour le refroidissement et les annexes. |
| Citadelle des Serveurs | Un site abandonné ne consomme plus rien. | **FAUX** | S’il reste hébergé, ses serveurs tournent toujours. |
| * | Les centres de données ont consommé environ 415 TWh en 2024. | **VRAI** | Exact, selon l’AIE (≈ 1,5 % de l’électricité mondiale). |
| Citadelle des Serveurs | Le PUE, c’est l’énergie totale divisée par l’énergie des serveurs. | **VRAI** | Exact. |
| Citadelle des Serveurs | La chaleur des serveurs peut chauffer des logements. | **VRAI** | Exact : c’est la récupération de chaleur fatale. |
| Citadelle des Serveurs | La consommation des centres de données pourrait plus que doubler d’ici 2030. | **VRAI** | Exact, selon l’AIE (≈ 945 TWh). |
| Désert des Oracles | Demander quelque chose à une IA, c’est gratuit pour la planète. | **FAUX** | Chaque requête consomme électricité et eau, et mobilise du matériel fabriqué à grand coût. |
| Désert des Oracles | Si chaque requête consomme moins, la consommation totale baisse forcément. | **FAUX** | L’effet rebond : l’usage explose. Google a divisé l’énergie par requête par 33, sa consommation totale augmente. |
| Désert des Oracles | Générer une image coûte à peu près autant qu’une réponse texte. | **FAUX** | Une image coûte beaucoup plus (jusqu’à des centaines de fois plus). |
| Désert des Oracles | Une IA qui répond avec assurance a forcément raison. | **FAUX** | Les IA peuvent « halluciner » : vérifie toujours. |
| Désert des Oracles | Seul l’entraînement d’une IA a un impact ; l’utiliser ne coûte rien. | **FAUX** | L’inférence se répète des milliards de fois et finit souvent par dominer. |
| Désert des Oracles | Un grand centre de données d’IA consomme autant que 100 000 foyers. | **VRAI** | Exact, selon l’AIE. |
| Désert des Oracles | Google a consommé environ 31 milliards de litres d’eau pour ses centres de données en 2024. | **VRAI** | Exact, selon son rapport environnemental. |
| Désert des Oracles | L’AI Act interdit la notation sociale des citoyens. | **VRAI** | Exact, depuis février 2025. |
| Désert des Oracles | Google annonce environ 0,24 Wh pour une requête texte médiane à Gemini. | **VRAI** | Exact (août 2025) — chiffre auto-déclaré. |
| Décharge de Ferraille | La majorité des déchets électroniques est recyclée. | **FAUX** | Seulement ~22 % en 2022 de façon documentée. |
| Décharge de Ferraille | L’obsolescence programmée est parfaitement légale en France. | **FAUX** | C’est un délit depuis 2015 : 2 ans de prison et 300 000 € d’amende. |
| Décharge de Ferraille | Réparer coûte toujours plus cher que racheter. | **FAUX** | Souvent faux (batterie, écran) ; et la loi pousse à rendre la réparation plus accessible. |
| Décharge de Ferraille | Le monde a produit 62 millions de tonnes de déchets électroniques en 2022. | **VRAI** | Exact (Global E-waste Monitor 2024). |
| Décharge de Ferraille | L’USB-C est le chargeur commun obligatoire dans l’Union européenne. | **VRAI** | Exact : depuis fin 2024 pour les téléphones, 2026 pour les ordinateurs portables. |
| Décharge de Ferraille | Depuis 2025, les pièces détachées des smartphones doivent être disponibles 7 ans dans l’UE. | **VRAI** | Exact (règlement 2023/1670). |
| Décharge de Ferraille | Apple a payé 25 M€ d’amende en France en 2020 pour le ralentissement d’iPhones. | **VRAI** | Exact (DGCCRF, pratique commerciale trompeuse). |
| Forge des Bâtisseurs | Un site éco-conçu est forcément moche. | **FAUX** | Sobriété ≠ laideur : Wikipédia, des sites de presse sobres… La simplicité sert aussi l’ergonomie. |
| Forge des Bâtisseurs | L’éco-conception, ça se fait à la fin, en optimisant. | **FAUX** | Plus on intervient tôt (besoin, conception), plus l’effet de levier est fort. |
| Forge des Bâtisseurs | Les carrousels sont très cliqués. | **FAUX** | Moins de 1 % des clics au-delà de la première image selon une étude souvent citée. |
| Forge des Bâtisseurs | Le mode sombre économise de l’énergie sur tous les écrans. | **FAUX** | Surtout sur les OLED ; pas sur les écrans LCD rétroéclairés. |
| Forge des Bâtisseurs | Dans l’étude SLE 2017, C était le langage le plus économe en énergie. | **VRAI** | Exact, suivi de Rust et C++. |
| Forge des Bâtisseurs | Les polices système ne demandent aucun téléchargement. | **VRAI** | Exact (règle n°32). |
| Forge des Bâtisseurs | La pagination évite de construire des DOM gigantesques. | **VRAI** | Exact (règle n°13). |
| Forge des Bâtisseurs | Faire une requête SQL par élément dans une boucle, c’est plus propre. | **FAUX** | C’est le problème « N+1 » : à proscrire (règle n°64). |
| Sanctuaire de la Mesure | Un EcoIndex A suffit à prouver qu’un service est écologique. | **FAUX** | C’est un indicateur partiel : il ne mesure ni l’utilité, ni le serveur, ni le matériel des utilisateurs. |
| * | Compenser, c’est aussi bien que réduire. | **FAUX** | La compensation est incertaine : il faut d’abord réduire à la source. |
| Sanctuaire de la Mesure | Le poids médian des pages web a environ doublé en 10 ans. | **VRAI** | Exact (HTTP Archive). |
| Sanctuaire de la Mesure | Dans l’EcoIndex, la complexité du DOM a le plus gros coefficient. | **VRAI** | Exact : coefficient 3, contre 2 pour les requêtes et 1 pour le poids. |

<a id="elite"></a>
## Défis d’élite (monstres dorés)

| Région | Question | Bonne réponse |
|---|---|---|
| Village de la Souche | Quelle phase domine l’empreinte du numérique en France (étude ADEME-Arcep 2022) ? | **La fabrication des équipements** |
| Steppes de l’Holocène | Que désigne l’Holocène ? | **10 000 ans de climat stable** |
| Steppes de l’Holocène | Le PRG du méthane à 100 ans vaut environ… | **28** |
| Steppes de l’Holocène | Quel budget carbone individuel vise-t-on pour 2050 ? | **≈ 2 t CO₂e/an** |
| Steppes de l’Holocène | La Carbon Law demande de… | **Diviser les émissions par 2 chaque décennie** |
| Bassin des 9 Sceaux | Combien de limites planétaires sont dépassées (bilan 2025) ? | **7** |
| Bassin des 9 Sceaux | Quel accord a permis de réparer la couche d’ozone ? | **Le Protocole de Montréal (1987)** |
| Bassin des 9 Sceaux | Qui a conceptualisé le « triangle de l’inaction » ? | **Christophe Cassou** |
| Bassin des 9 Sceaux | Les « zones mortes » sont causées principalement par… | **Un excès d’azote et de phosphore** |
| Mines d’Abysse | Combien d’éléments chimiques entrent au minimum dans un smartphone ? | **Plus de 30** |
| Mines d’Abysse | Quel est le meilleur levier pour réduire l’impact d’un smartphone ? | **Le garder plus longtemps** |
| Mines d’Abysse | Quelle est la première étape d’une ACV ? | **L’extraction des matières premières** |
| Mines d’Abysse | Par combien la durée de vie moyenne des équipements a-t-elle été divisée en 30 ans ? | **3** |
| Marais des Réseaux | Part du numérique dans la consommation d’électricité française ? | **≈ 10 %** |
| Marais des Réseaux | Une heure de vidéo en 4K, c’est environ… | **7 Go** |
| Marais des Réseaux | Par où passe l’essentiel du trafic intercontinental ? | **Des câbles sous-marins** |
| Marais des Réseaux | Comment appelle-t-on les données stockées mais jamais réutilisées ? | **Les données sombres (dark data)** |
| Citadelle des Serveurs | Quel PUE est excellent ? | **1,15** |
| Citadelle des Serveurs | Que mesure le WUE ? | **La consommation d’eau** |
| Citadelle des Serveurs | Un hébergeur « 300 % vert » via des crédits… | **Compense, mais ne réduit pas ses émissions à la source** |
| Désert des Oracles | Comment s’appelle l’augmentation de l’usage causée par un gain d’efficacité ? | **L’effet rebond** |
| Désert des Oracles | Comment appelle-t-on l’utilisation d’un modèle d’IA déjà entraîné ? | **L’inférence** |
| Désert des Oracles | Dans l’AI Act, un logiciel de tri de CV est classé… | **À haut risque** |
| Désert des Oracles | Pour calculer 17 × 23, le plus sobre est… | **Une calculatrice** |
| Décharge de Ferraille | Part des e-déchets collectés et recyclés de façon documentée (2022) ? | **≈ 22 %** |
| Décharge de Ferraille | Quelle loi impose l’écoconception dans les formations d’ingénieurs ? | **La loi REEN (2021)** |
| Décharge de Ferraille | Quel indice la loi AGEC a-t-elle créé ? | **L’indice de réparabilité** |
| Forge des Bâtisseurs | Que signifient les 3U ? | **Utile, Utilisée, Utilisable** |
| Forge des Bâtisseurs | Quel format d’image est le plus léger à qualité égale ? | **AVIF** |
| Forge des Bâtisseurs | Le niveau 4 de l’éco-conception, c’est… | **La rupture low-tech (parfois sans numérique)** |
| Forge des Bâtisseurs | Le tree-shaking sert à… | **Supprimer le code inutilisé des bibliothèques** |
| Sanctuaire de la Mesure | Quelles sont les 3 métriques de l’EcoIndex ? | **DOM, requêtes, poids** |
| Sanctuaire de la Mesure | Quel score EcoIndex donne la note A ? | **Plus de 80** |

<a id="ouvertes"></a>
## Questions ouvertes et missions terrain

Il n’y a **pas de réponse unique** : c’est ton raisonnement qui est évalué par l’enseignant·e. Pour bien répondre : au moins 25 mots, **un argument + un exemple concret + un chiffre vu dans le jeu** (Codex).

- **Q1 · Holocène et numérique** — Pourquoi la stabilité climatique de l’Holocène concerne-t-elle directement les infrastructures numériques ? Donne au moins deux exemples concrets.
- **Q2 · Mon premier levier** — D’après ton bilan carbone personnel, quel est ton premier levier de réduction ? Pourquoi celui-ci, et qu’est-ce qui t’empêche (ou t’aide) à le mettre en œuvre ?
- **Q3 · Briser le triangle** — En tant que futur·e manager IT, comment briserais-tu le triangle de l’inaction dans ton organisation ? Donne un exemple concret d’action.
- **Q4 · Politique de renouvellement** — Propose une politique de renouvellement du parc informatique pour une entreprise de 500 postes (durée de vie cible, reconditionné, réparation, fin de vie…). Justifie avec des chiffres vus dans le jeu.
- **Q5 · Un usage à réduire** — Quel usage numérique personnel vas-tu réduire, comment, et comment mesureras-tu le résultat ?
- **Q6 · Choisir un hébergeur** — Quels sont tes trois critères pour choisir un hébergeur responsable, et pourquoi ? Que penses-tu des hébergeurs qui « compensent » à 300 % ?
- **Q7 · Quand l’IA est-elle justifiée ?** — Décris un cas où l’IA générative est justifiée (bénéfice > coût) et un cas où elle ne l’est pas. Quels critères utilises-tu pour décider ?
- **Q8 · L’effet rebond** — Donne un exemple d’effet rebond dans le numérique (ou l’IA) et une parade possible.
- **Q9 · La loi et mon métier** — Quelle obligation légale (française ou européenne) aura le plus d’impact sur ton futur métier ? Explique comment tu l’anticiperais.
- **Q10 · La grille 3U** — Choisis une fonctionnalité d’une application que tu utilises et applique-lui la grille 3U (Utile, Utilisable, Utilisée). La garderais-tu ? Comment la simplifierais-tu ?
- **Q11 · Interpréter une mesure** — Donne l’EcoIndex du site que tu as testé, ton interprétation (DOM, requêtes, poids) et trois actions correctives concrètes.
- **Q12 · Mon plan d’action Green IT** — Rédige ton plan d’action Green IT pour un comité de direction (5 à 10 lignes) : constats chiffrés, 3 à 5 actions prioritaires (matériel, logiciel, IA, hébergement, mesure), indicateurs de suivi.

**Missions terrain** (avec un vrai outil en ligne, résultat personnel) :

- **L’empreinte du voyageur** — [Nos Gestes Climat (ADEME)](https://nosgestesclimat.fr/) : Ton empreinte totale ; Ton premier poste d’émissions (transport, alimentation, logement, consommation…)
- **Les eaux montantes** — [Carte Climate Central (2050)](https://coastal.climatecentral.org/map/6/6.2374/45.6479/?theme=sea_level_rise&map_type=coastal_dem_comparison&basemap=roadmap&contiguous=true&elevation_model=best_available&forecast_year=2050&pathway=rcp45&percentile=p50&refresh=true&return_level=return_level_1&rl_model=coast_rp&slr_model=kopp_2014) : Quelle zone as-tu observée ? ; Qu’est-ce qui t’a frappé·e ? Quel risque pour le numérique ?
- **Mon empreinte numérique** — [Calculateur ADEME (usages numériques)](https://agirpourlatransition.ademe.fr/particuliers/evaluer-son-impact/calculer-empreinte-carbone/calculez-empreinte-carbone-usages-numeriques) : Ton empreinte numérique annuelle ; Ce qui pèse le plus (équipements ? usages ?)
- **L’inventaire** : Nombre total d’équipements ; Lequel pourrais-tu donner, revendre ou ne pas remplacer ?
- **27 ans d’écran** : Ton âge ; Ton temps d’écran quotidien sur smartphone (moyenne de la semaine)
- **Mesurer un vrai site** — [EcoIndex.fr](https://www.ecoindex.fr/) : Adresse du site testé ; Score EcoIndex obtenu ; Nombre de requêtes, poids, taille du DOM (si affichés)

<a id="passages"></a>
## Passages, objets clés et grottes secrètes

| Passage | Il faut |
|---|---|
| Village de la Souche ↔ Steppes de l’Holocène | Un tronc calciné bloque le passage. (`flag:tuto_fini`) |
| Steppes de l’Holocène ↔ Bassin des 9 Sceaux | Un brouillard de désinformation… Il faudrait un bouclier contre les idées reçues. (`item:bouclier`) |
| Bassin des 9 Sceaux ↔ Mines d’Abysse | Le pont est effondré. Le Sceau des Limites pourrait le restaurer. (`item:sceau`) |
| Village de la Souche ↔ Marais des Réseaux | Une barrière runique. Elle réagit au Sceau des Limites. (`item:sceau`) |
| Village de la Souche ↔ Citadelle des Serveurs | Un gouffre obscur. Il faut de la lumière ET un moyen de le franchir. (`item:grappin&item:lanterne`) |
| Village de la Souche ↔ Décharge de Ferraille | Un gouffre. Un grappin permettrait de passer. (`item:grappin`) |
| Citadelle des Serveurs ↔ Désert des Oracles | Un mirage brouille le chemin. Une lentille de mesure révélerait le vrai passage. (`item:lentille`) |
| Décharge de Ferraille ↔ Forge des Bâtisseurs | Une porte au mécanisme cassé. Il faudrait des pinces pour la réparer. (`item:pinces`) |
| Désert des Oracles ↔ Sanctuaire de la Mesure | Un mur d’hallucinations. Seule la sobriété peut le dissiper. (`item:cristal`) |
| Forge des Bâtisseurs ↔ Sanctuaire de la Mesure | Une porte de bâtisseurs. Il faut le Plan du Bâtisseur. (`item:plan`) |

| Grotte | Région | Il faut |
|---|---|---|
| Grenier oublié | Village de la Souche | Il fait trop noir pour entrer. Une lanterne aiderait. (`item:lanterne`) |
| Grotte des Records | Steppes de l’Holocène | La grotte est plongée dans le noir. Reviens avec une lanterne. (`item:lanterne`) |
| Abri du Ciel Réparé | Bassin des 9 Sceaux | L’entrée est envahie de ronces. Ozonie sait peut-être comment passer. (`flag:ozone_vu`) |
| La Mine Urbaine | Mines d’Abysse | Trop sombre… La Fonderie cache peut-être une lanterne. (`item:lanterne`) |
| Grotte des Câbles | Marais des Réseaux | Un ravin sépare l’entrée. Un grappin serait utile. (`item:grappin`) |
| Le Serveur Oublié | Citadelle des Serveurs | Ce mur semble… faux ? Une lentille révélerait le passage. (`item:lentille`) |
| L’Oasis Cachée | Désert des Oracles | Un mirage bloque l’entrée. (`item:cristal`) |
| L’Épave de 1985 | Décharge de Ferraille | Une grille rouillée. Il faudrait des pinces. (`item:pinces`) |
| La Salle Apollo | Forge des Bâtisseurs | Un panneau vissé. Des pinces feraient l’affaire. (`item:pinces`) |
| La Bibliothèque Verte | Sanctuaire de la Mesure | Une porte gravée de plans. Il faut le Plan du Bâtisseur. (`item:plan`) |

| Coffre à revisiter | Région | Il faut |
|---|---|---|
| coffre2_village (x 56, y 6) | Village de la Souche | `item:grappin` |
| coffre2_steppe (x 57, y 42) | Steppes de l’Holocène | `item:lanterne` |
| coffre2_bassin (x 54, y 44) | Bassin des 9 Sceaux | `item:pinces` |
| coffre2_mines (x 6, y 8) | Mines d’Abysse | `item:grappin` |
| coffre2_marais (x 56, y 8) | Marais des Réseaux | `item:lentille` |
| coffre2_citadelle (x 56, y 42) | Citadelle des Serveurs | `item:pinces` |
| coffre2_desert (x 56, y 42) | Désert des Oracles | `item:plan` |
| coffre2_decharge (x 56, y 6) | Décharge de Ferraille | `item:cristal` |
| coffre2_forge (x 56, y 8) | Forge des Bâtisseurs | `item:cristal` |

<a id="engagement"></a>
## Fin du jeu : mon engagement

Après le plan d’action final, l’élève choisit **une à trois actions** et les formule avec ses mots (au moins 8 mots), avec une échéance. Il n’y a pas de « bonne » réponse : l’engagement figure dans le bilan PDF.
