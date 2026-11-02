# Inventaire exhaustif du site « Formation GreenIT – Master 2 » (greenIT-main)

> Livrable 1 (partie A). La table de correspondance contenu → jeu (partie B) sera ajoutée après validation du game design : chaque ID ci-dessous y recevra une destination précise.
>
> Légende colonne **⚠** : `MAJ` = chiffre daté à actualiser · `?` = donnée douteuse ou incohérente à vérifier · `✗` = erreur probable · vide = OK.
> Les vérifications ⚠ sont faites de mémoire (connaissances jusqu'à mi-2026) ; elles seront toutes recoupées avec des sources datées pendant la construction.

## 0. Structure et parcours actuels

| Module | Enchaînement des pages |
|---|---|
| Accueil | `index` (tableau de bord 4 modules, progression `localStorage.progress` 1→5) |
| M1 Contexte | `briefing` → `history` → `holocene` → `holocene-quizz` → `lifestyle` → `ges` → `serre-game` → `bilan` → `limits` → `limits-game` → `triangle` → index (progress=2) |
| M2 Mesure | `impact` → `gesIt` → `materials` → `materials-video` → `elec` → `elec-video` → `equipments` → `software` → `numeric` → `running-game` → `laws` → `acv` → `acv-game` → `acv-web` → index (progress=3) |
| M3 Éco-conception | `eco` → `interests` → `referentiels` → `eco-game` → `eco-levels` → `eco-rules` → `specifications` → `design` → `developpement` → `eco-two-game` → `hosting` → index (progress=4) |
| M4 Pilotage | `mesure` → `how` → `eco-video` → `conclusion` (progress=5) |
| Orphelines | `it-game` (jamais liée), `template` (brouillon) |

Constats techniques : ~980 Ko de HTML (beaucoup d'animations décoratives), dépendances externes (Google Fonts ×2, MathJax via jsDelivr, 9 iframes YouTube), images tierces (ResearchGate, decrypterlenergie.org, GreenIT/Shift, EuChemS). Le « Green Web Check » de `hosting` est une simulation aléatoire (`Math.random()`), pas un vrai test. Le jeu `eco-game` ne fonctionne qu'à la souris.

---

## 1. Module 1 — Contexte & enjeux planétaires

### index / briefing (accueil)
| ID | Type | Contenu | Source citée | ⚠ |
|---|---|---|---|---|
| M1-01 | Chiffre | Numérique = 4 % des émissions mondiales de GES, « plus que l'aviation civile » | — | MAJ ? (fourchettes 2–4 % selon études) |
| M1-02 | Chiffre | +9 %/an de croissance de la consommation énergétique du numérique | — | MAJ (Shift Project 2018) |
| M1-03 | Chiffre | 78 % de l'impact concentré sur la fabrication du matériel | — | (France, ADEME-Arcep) |
| M1-04 | Notion | Paradoxe du numérique durable : levier de transition ET empreinte croissante (énergie, métaux, eau) | — | |
| M1-05 | Notion | Rôle du manager IT : « architecte de la sobriété numérique » ; enjeu stratégique (piloter, mesurer, arbitrer innovation/responsabilité) | — | |
| M1-06 | Notion | Objectifs pédagogiques des 4 modules (12 objectifs : 9 limites, ACV, points de bascule, scopes 1-2-3, 115 bonnes pratiques, low-tech, éco-index, GreenIT-Analysis, KPIs PUE/WUE/Carbon Intensity) | — | |
| M1-07 | Notion | Rangs : Initié → Analyste → Stratège → Expert | — | |
| M1-08 | Citation | « La ligne de code la plus écologique est celle que l'on ne code pas… » | — | |
| M1-09 | Chiffre | Badge démo : Eco-index A, consommation −70 %, poids < 150 Ko | — | |

### history (Holocène)
| ID | Type | Contenu | Source | ⚠ |
|---|---|---|---|---|
| M1-10 | Chiffre | Holocène : ±1 °C (1 à 2 °C max) sur 10 000 ans | J. Rockström | |
| M1-11 | Notion | Avant : climat instable, jusqu'à 10 °C de variation en une décennie | Rockström | |
| M1-12 | Notion | Étymologie « Holocène » (entièrement récent) ; berceau de la civilisation : agriculture prévisible, eau stable, biodiversité | | |
| M1-13 | Notion | Anthropocène : sortie de l'Holocène en ~50 ans ; dépendance de l'IT à la stabilité climatique | | ? (statut géologique officiel rejeté par l'IUGS en 2024 — à nuancer) |
| M1-14 | Notion | Services écosystémiques (atmosphère, calottes, pollinisation, cycles de l'eau) | | |
| M1-15 | Image | `holocene.PNG` : température 60 000 ans (ResearchGate) | ResearchGate | droits tiers |
| M1-16 | Image | `holocene_history.PNG` : δ18O 100 000 ans + migrations humaines | — | droits tiers |
| M1-17 | Mécanique | Verrou : examiner les 2 documents pour continuer | | |

### holocene (vidéo WEF « Beyond the Anthropocene », J. Rockström, 21:15)
| ID | Type | Contenu | ⚠ |
|---|---|---|---|
| M1-18 | Vidéo | youtube `V9ETiSaxyfk` | |
| M1-19 | Notion | « D'un petit monde sur une grande planète à un grand monde sur une petite planète » [00:47] | |
| M1-20 | Notion | Grande Accélération ~1955 [08:00] | |
| M1-21 | Notion | Carbon Law : diviser les émissions par 2 chaque décennie [19:07] | |
| M1-22 | Notion | Points de bascule / boucles de rétroaction : la Terre de « partenaire » à « ennemie » [13:00] | |

### holocene-quizz (8 QCM, 100 % requis)
| ID | Question → bonne réponse (distracteurs) | ⚠ |
|---|---|---|
| M1-23 | Variation T° Holocène → ±1 °C (±5, ±10) | |
| M1-24 | Début Grande Accélération → ~1950 (1789, 2015) | |
| M1-25 | Chaleur absorbée par l'océan → 90 % (50, 30) | |
| M1-26 | Carbon Law : ÷2 tous les → 10 ans (2, 50) | |
| M1-27 | Nombre de limites planétaires → 9 (7, 12) | |
| M1-28 | Tipping point franchi → le système s'auto-amplifie | |
| M1-29 | Forêt devenue source de carbone → certaines parties de l'Amazonie | |
| M1-30 | Corridor de T° des 3 derniers Ma jamais dépassé → +2 °C | |
| M1-31 | Aide-mémoire : Holocène 10 000 ans, océan 90 %, tipping point, Moore/Carbon Law | |

### lifestyle (modes de vie)
| ID | Type | Contenu | Source | ⚠ |
|---|---|---|---|---|
| M1-32 | Notion | 4 piliers : alimentation, biens, transports, habitat | | |
| M1-33 | Chiffre | « Indice d'épuisement des ressources 85 % » | — | ? (non sourcé) |
| M1-34 | Chiffre | 2023 année la plus chaude ; pointes journalières à +2 °C (nov. 2023) ; > +1,5 °C | Copernicus 2024 | MAJ (2024 est désormais l'année record, 1re année civile > 1,5 °C) |
| M1-35 | Chiffre | Record T° de surface des océans avril-déc. 2023 | Copernicus | MAJ |
| M1-36 | Chiffre | Probabilité > 80 % de franchir durablement +1,5 °C d'ici 2027-28 | — | ? (OMM 2025 : ~70 % pour la moyenne 2025-2029) |
| M1-37 | Activité | Mission : carte Climate Central montée des eaux 2050 (RCP4.5) | Climate Central | lien externe |
| M1-38 | Notion | Conséquences systémiques ; vulnérabilité IT (refroidissement DC, câbles sous-marins, supply chain) | | |

### ges (gaz à effet de serre)
| ID | Type | Contenu | Source | ⚠ |
|---|---|---|---|---|
| M1-39 | Chiffre | −18 °C sans effet de serre naturel | | |
| M1-40 | Notion | Mécanisme effet de serre naturel vs renforcé | | |
| M1-41 | Notion | Propriétés des GES : temps de résidence, concentration (ppm/ppb), pouvoir radiatif | | |
| M1-42 | Notion | PRG/GWP sur 100 ans, CO₂ = 1, CO₂e | GIEC | |
| M1-43 | Chiffre | CH₄ = 28, N₂O = 265, gaz fluorés > 10 000 | GIEC AR5 | MAJ (AR6 : CH₄ fossile ≈ 29,8, N₂O ≈ 273) |
| M1-44 | Chiffre | Empreinte moyenne d'un Français 9,0 tCO₂e (2021) | MTE/SDES | MAJ |
| M1-45 | Chiffre | Objectif 2 t/pers en 2050 (−78 %) | | |
| M1-46 | Ressource | Sources : ADEME Bilan Carbone, MTE 2021, GIEC AR6 GT1, Base Carbone 2024 | | |
| M1-47 | Image | `serre.jpg` schéma effet de serre | — | droits tiers ? |

### serre-game (texte à trous, 6 blocs)
| ID | Contenu | ⚠ |
|---|---|---|
| M1-48 | Effet de serre **naturel** / sans lui **−18 °C** / piège la **chaleur** / comparer avec le **PRG** / France **9 tonnes** / Carbon Law **10 ans** | |

### bilan (objectif 2 tonnes)
| ID | Type | Contenu | Source | ⚠ |
|---|---|---|---|---|
| M1-49 | Notion | Accord de Paris (COP21), +1,5 °C, neutralité 2050, budget 2 t/pers/an | | |
| M1-50 | Chiffre | 9 t = 4,5 × l'objectif | | MAJ |
| M1-51 | Activité | Mission : bilan personnel sur Nos Gestes Climat (ADEME), saisie du résultat, calcul de l'effort | nosgestesclimat.fr | |
| M1-52 | Chiffre | Numérique ≈ 2,5 % de l'empreinte carbone française | ADEME-Arcep | MAJ (actualisation ADEME-Arcep 2025 ≈ 4,4 %, à vérifier) |
| M1-53 | Notion | Effet rebond (mention) | | |

### limits (vidéo TF1 Info, limites planétaires)
| ID | Type | Contenu | ⚠ |
|---|---|---|---|
| M1-54 | Vidéo | youtube `qo91ZSyVQ7o` | |
| M1-55 | Chiffre | 6 limites sur 9 dépassées | MAJ (Planetary Health Check 2025 : 7/9, acidification des océans franchie) |
| M1-56 | Chiffre | 73 % des populations animales « ont disparu » en 50 ans | ✗ formulation : c'est une baisse moyenne de 73 % de la taille des populations suivies (WWF IPV 2024) |
| M1-57 | Chiffre | Déforestation : 10 terrains de foot/minute | |
| M1-58 | Chiffre | Acidité des océans +30 % depuis le XIXe | |
| M1-59 | Chiffre | > 400 zones mortes (azote) | MAJ (> 700 sites hypoxiques recensés) |
| M1-60 | Notion | Succès : couche d'ozone en rétablissement grâce au Protocole de Montréal | |

### limits-game (décryptage, 5 réponses saisies)
| ID | Contenu | ⚠ |
|---|---|---|
| M1-61 | Gaz des engrais → **AZOTE** ; limites dépassées → **6** ; forêts déboisées → **40** % ; absorption 1/4 du CO₂ → **ACIDIFICATION** ; zones mortes → **400** | réponses à aligner sur les MAJ M1-55/59 |

### triangle (triangle de l'inaction, C. Cassou)
| ID | Type | Contenu | ⚠ |
|---|---|---|---|
| M1-62 | Vidéo | youtube `-2w7dG7TG9c` (Christophe Cassou) | |
| M1-63 | Notion | Triangle de l'inaction : individu / entreprise / politique se renvoient la responsabilité | |
| M1-64 | Jeu | Associer 3 citations aux 3 acteurs (Politique, Individu, Entreprise) | |
| M1-65 | Notion | Sortie de l'inaction : s'informer, comportements cohérents, agir pro, diffuser par l'exemple ; le manager IT agit sur les 3 sommets | |

---

## 2. Module 2 — Mesure de l'impact numérique

### impact
| ID | Type | Contenu | Source | ⚠ |
|---|---|---|---|---|
| M2-01 | Chiffre | 3,5 % des émissions mondiales (2020) | | MAJ |
| M2-02 | Chiffre | +60 % d'ici 2040 → 6,7 % « de l'empreinte carbone globale » | (Sénat 2020) | ✗ le 6,7 % concerne la France, pas le monde |
| M2-03 | Jeu | Compteur temps réel tCO₂e : scénario tendanciel vs sobriété | | |
| M2-04 | Notion | Bénéfices (télétravail, logistique, smart grids) vs empreinte sous-estimée ; mythe de la dématérialisation | | |
| M2-05 | Chiffre | Énergie : 10 % de l'électricité française (~50 TWh/an) | | (incohérent avec M2-26 : 12 %) |
| M2-06 | Chiffre | E-déchets : 50 Mt/an monde | | MAJ (Global E-waste Monitor 2024 : 62 Mt en 2022) |
| M2-07 | Image | `it.PNG` : GES Numérique 3,8 % (2020) → 6 % (2025) vs mode 10 %, ciment 7 %, auto 9 %, aérien 2 % ; matière : jean 49 kg, table 76 kg, smartphone 221 kg, laptop 836 kg, écran 2 015 kg ; eau : smartphone 1 500 L, T-shirt 2 500 L, laptop 6 000 L, jean 8 000 L, voiture 75 000 L | GreenIT.fr / The Shift Project | droits tiers ; ? |

### gesIt (audit personnel)
| ID | Type | Contenu | ⚠ |
|---|---|---|---|
| M2-08 | Chiffre | Fabrication : smartphone ~32 kg, laptop ~150 kg, TV 4K ~350 kg, écran 27" ~200 kg CO₂e | ? à recaler sur Base Empreinte ADEME |
| M2-09 | Chiffre | 78 % de l'empreinte numérique FR = fabrication des terminaux | |
| M2-10 | Notion | Allonger la durée de vie de 2 à 4 ans ≈ −50 % ; réemploi/réparation > recyclage | |
| M2-11 | Activité | Mission : calculateur ADEME usages numériques, saisie en kg CO₂e/an | |
| M2-12 | Chiffre | Moyenne FR 300-400 kg/an (~4 %) ; intensifs 600-800 kg | ? (ADEME-Arcep : ~250 kg/hab/an) |
| M2-13 | Chiffre | 1 h streaming HD ~50 g ; email avec PJ ~4 g ; 1 h réseaux sociaux ~10 g ; 1 Go cloud/an ~20 g ; 1 h gaming ~100 g | ? (très débattus ; AIE ~36 g/h pour le streaming) |
| M2-14 | Chiffre | Vidéo 4K = 3× la bande passante SD | ? |
| M2-15 | Notion | Dark data : 50-70 % des données stockées jamais réutilisées | |
| M2-16 | Chiffre | 5G + IoT : +30 % de consommation réseau d'ici 2030 | ? |

### materials (ressources rares)
| ID | Type | Contenu | Source | ⚠ |
|---|---|---|---|---|
| M2-17 | Notion | Tableau périodique EuChemS des 90 éléments naturels (rareté) | EuChemS 2019 | |
| M2-18 | Chiffre | 10 M de smartphones jetés/mois en UE ; ~50 % des éléments menacés en 100 ans | EuChemS 2019 | |
| M2-19 | Chiffre | 30+ éléments par smartphone ; 15+ critiques ; 70 % concentration géographique | | |
| M2-20 | Chiffre | 16 kg de matière première pour une puce de 1 g (ratio 16:1 kg/g) | WWF Guide SI éco-responsable | (la notif « 16 t CO₂/kg de puce » est ✗) |
| M2-21 | Chiffre | Chine : 80 % de la production de terres rares | | MAJ (~70 % extraction, ~90 % raffinage) |
| M2-22 | Notion | Terres rares (Nd, Eu, Tb) écrans/vibreur ; métaux précieux (Au, Ag, Pd) circuits ; Co & Li batteries | | |
| M2-23 | Easter egg | 1 t de smartphones recyclés ≈ or de 17 t de minerai | | ? |
| M2-24 | Images | `mat1.PNG` (tableau EuChemS), `mat2.PNG` (anatomie smartphone) | | droits tiers (EuChemS CC BY-ND ?) |

### materials-video (ARTE, 04:47)
| ID | Contenu | ⚠ |
|---|---|---|
| M2-25 | youtube `3NR3RDedd5w` ; métaux d'un smartphone (Au, Sn, Li, Co, Y, Tb, In, Pd ; 50-75 métaux) ; « rareté » sans définition universelle ; 17 terres rares difficiles à séparer et polluantes ; demande en explosion (cobalt +55 % en 5 ans) ; 90 % de l'extraction dans une poignée de pays ; l'UE parle de « métaux critiques » | |

### elec (électricité)
| ID | Type | Contenu | Source | ⚠ |
|---|---|---|---|---|
| M2-26 | Chiffre | Numérique = 12 % de l'électricité FR (2015) ; 55,5 TWh sur 476 TWh ; réseaux 3,5, DC ~10, terminaux domestiques 22, pro 21 TWh | Gouvernement / decrypterlenergie.org | MAJ |
| M2-27 | Chiffre | +25 % d'ici 2030 vs 2015 ; pourrait atteindre 15 % | NégaWatt | MAJ |
| M2-28 | Chiffre | 4G = 23× l'énergie d'une connexion ADSL ; 5G « ~40× ? » | NégaWatt | ? (5G : non sourcé) |
| M2-29 | Notion | Causes : 4G/5G, streaming, DC, IoT, cloud ; paradoxe : plus c'est invisible, plus c'est lourd ; densification d'antennes, handover | | |
| M2-30 | Chiffre | ~151 GWh/jour, ~250 DC actifs, ~2 Mt CO₂/an (France) | | ? |
| M2-31 | Easter egg | Streaming vidéo = 60 % du trafic internet mondial | | MAJ |
| M2-32 | Image | `elec.PNG` (decrypterlenergie.org) | | droits tiers |

### elec-video (Radio-Canada, 04:11, IA)
| ID | Contenu | ⚠ |
|---|---|---|
| M2-33 | youtube `DP69uxjwuTQ` | |
| M2-34 | Requête IA (ChatGPT) = 10× une recherche Google | MAJ (estimations 2025 : ~0,3 Wh/requête texte, écart bien plus faible ; dépend fortement du modèle et de la tâche) |
| M2-35 | Un DC IA consomme autant qu'une ville de 100 000 ménages | (AIE) |
| M2-36 | Google : 31 milliards de litres d'eau en 2024 | (rapport environnemental Google 2025) |
| M2-37 | Demande des DC IA aux USA ×2 d'ici 2030 ; Meta/Google se tournent vers le nucléaire | |
| M2-38 | Chaîne invisible d'une requête : minerais, eau, électricité, infra 24/7 | |

### equipments (suréquipement)
| ID | Type | Contenu | Source | ⚠ |
|---|---|---|---|---|
| M2-39 | Chiffre | 34 Md d'équipements / 5 Md d'utilisateurs = ~7 par personne | GreenIT | MAJ |
| M2-40 | Chiffre | France : 11 équipements/pers. (651 M pour 58 M d'utilisateurs) | | MAJ |
| M2-41 | Témoignage | Inventaire de l'enseignant : 13 équipements | | |
| M2-42 | Chiffre | Durée de vie divisée par 3 en 30 ans : 1985 15 ans → 2003 ~10 → 2022 5 ans | WWF France | |
| M2-43 | Notion | Ère réparable (modularité, docs) vs jetable (soudé, collé, obsolescence logicielle) | | |
| M2-44 | Chiffre | Smartphone = 70 kg de ressources ; ordinateur = 240 kg de combustibles fossiles ; TV = 2,5 t de matières | | ? (sources anciennes, ~2004) |
| M2-45 | Activité | Compter ses équipements ; comparaison monde/France ; « angles morts » (box, objets connectés, électroménager, consoles, enceintes, écrans oubliés) | | |

### software (obésiciels)
| ID | Type | Contenu | Source | ⚠ |
|---|---|---|---|---|
| M2-46 | Chiffre | +40 % d'internautes en 10 ans ; 83 % des Français connectés | | MAJ |
| M2-47 | Chiffre | 27 ans 7 mois 6 jours devant un écran dans une vie ; 8h30/jour (smartphone 3h15, ordi 2h30, TV 2h45) ; simulateur selon l'âge | NordVPN 2021 | ? (sondage commercial) |
| M2-48 | Notion | Obésiciel/bloatware : on change de terminal parce qu'il « rame » | | |
| M2-49 | Chiffre | Apollo 11 : code de 64 Ko ; 384 400 km ; 3 astronautes ; lien GitHub du code | github.com/chrislgarry/Apollo-11 | ? (≈ 72 Ko de ROM) |
| M2-50 | Chiffre | Win10/Office 2019 = 171× la RAM de Win98/Office97 (32 Mo → 5,5 Go) | GreenIT | |
| M2-51 | Chiffre | Deutsche Bahn : page de réservation 3 Ko (1999) → 3,8 Mo (×1 267) | | |
| M2-52 | Chiffre | Site web moyen 2022 : 2 000 Ko ; appli mobile 50 Mo | | MAJ (HTTP Archive) |
| M2-53 | Notion | Conséquences : obsolescence forcée, électricité, lenteur, exclusion numérique | | |

### numeric (vidéo, synthèse)
| ID | Contenu | ⚠ |
|---|---|---|
| M2-54 | youtube `SjKsHSx4rCE` « L'impact du numérique sur l'environnement » | |
| M2-55 | 4 % des GES ; 10 % de la production électrique mondiale ; « doublement de l'empreinte » en 2025 | ? MAJ (10 % mondial non sourcé ; trajectoire Shift 2019) |
| M2-56 | Infrastructure invisible (câbles sous-marins, DC 24h/24, antennes) ; 70-80 % de l'empreinte à la fabrication | |
| M2-57 | « Si internet était un pays, 3e consommateur d'électricité » | ? (incohérent avec `template` : « 6e pollueur ») |

### running-game (dégraissage)
| ID | Contenu | ⚠ |
|---|---|---|
| M2-58 | Site de 3 800 Ko à faire maigrir sous 100 Ko : pubs/trackers −1 200, vidéo auto −1 000, images −800, JS −500, polices système −250, boutons like −47 ; répliques du coach | |

### laws (réglementation)
| ID | Type | Contenu | ⚠ |
|---|---|---|---|
| M2-59 | Loi | AGEC (2020) : indice de réparabilité, pièces détachées 5 ans min., info CO₂ par les FAI, économie circulaire | MAJ (indice de durabilité depuis 2025 pour TV et lave-linge ; pièces détachées : durées variables) |
| M2-60 | Loi | TEPCV (2015) : obsolescence programmée = délit (2 ans, 300 k€), info durée de vie, mises à jour | MAJ (AGEC a étendu l'amende jusqu'à 5 % du CA) |
| M2-61 | Loi | REEN (2021) : écoconception dans les formations d'ingénieurs, stratégie numérique responsable des communes > 50 000 hab., observatoire | |
| M2-62 | Loi | « Loi Climat et Résilience » présentée comme standard UE avec « affichage ACV obligatoire » | ✗ loi française (2021) ; affichage environnemental, pas ACV complète |
| M2-63 | Loi | TICFE data centers liée à la valorisation de la chaleur fatale | ? |
| M2-64 | Loi | Chargeur universel USB-C (2024) | MAJ (portables : avril 2026) |
| M2-65 | Loi | Droit à la réparation UE « en discussion », durée de vie 10 ans | ✗ directive (UE) 2024/1799 adoptée, transposition 2026 ; pas de « 10 ans » ; + règlement écoconception smartphones (juin 2025) |
| M2-66 | Chiffre | Sanctions : Apple 25 M€ (2020), Samsung 5 M€ (2018), Epson 10 M€ (2017) | ? (Samsung : Italie ; Epson : plainte HOP, pas d'amende de 10 M€ connue) |
| M2-67 | Notion | La régulation comme pare-feu contre l'obsolescence ; « la France pionnière » | |

### acv / acv-game / acv-web
| ID | Type | Contenu | Source | ⚠ |
|---|---|---|---|---|
| M2-68 | Notion | ACV normalisée ISO 14040/14044, « du berceau à la tombe », multicritère | | |
| M2-69 | Notion | 5 étapes : extraction, fabrication, transport (smartphone ≈ 4× le tour de la Terre), usage, fin de vie | | |
| M2-70 | Vidéo | youtube `SJq7i_3UODM` (ADEME, cycle de vie d'un produit) | ADEME | |
| M2-71 | Chiffre | Répartition fab/usage : smartphone 85/15, laptop 75/25, serveur 25/75 | | |
| M2-72 | Chiffre | ADEME 2030 : DC = 1 130 réacteurs nucléaires | | ? ✗ probable |
| M2-73 | Citation | « 2× plus d'énergie pour transporter une donnée que pour la stocker 1 an » | F. Bordage | |
| M2-74 | Jeu | Patch éco-conception : durée de vie 4 → 12 ans (moins de RAM = retarder l'achat) | | |
| M2-75 | Jeu | `acv-game` : remettre les 5 étapes dans l'ordre | | |
| M2-76 | Chiffre | ACV d'un site : laptop = 240 kg combustibles, 22 kg chimiques, 1,5 t d'eau | | ? |
| M2-77 | Chiffre | Baromètre SAV Fnac Darty : Apple/HP bons élèves, Dell/Lenovo mauvais | | MAJ ? |
| M2-78 | Chiffre | Garder son matériel 1 an de plus = 156 kg CO₂ évités/an | | ? |
| M2-79 | Notion | Principes d'éco-conception (sobriété fonctionnelle, perf, design system léger, images) ; jusqu'à −70 % d'énergie | | |
| M2-80 | Notion | Hébergement responsable : PUE, renouvelable, CDN, chaleur ; DC charbon = 40× le CO₂ ; Green Web Foundation | | |
| M2-81 | Chiffre | Usage : 80 % terminaux / 20 % serveurs ; −1 Mo sur 1 M visites/mois = 1,2 t CO₂/an | | ? |
| M2-82 | Notion | Fin de vie : sites zombies (~30 %), décommissionner, informer, rediriger (301), archiver en statique ; serveur éteint ≈ 500 kWh ≈ 50 kg CO₂/an | | ? |
| M2-83 | Exemples | Fairphone (réparabilité 9/10) ; Qarnot (serveurs-radiateurs, chaleur fatale pour des HLM) ; hébergeurs Infomaniak, OVH, PlanetHoster, GreenGeeks | | `quarnot.PNG` droits tiers |

---

## 3. Module 3 — Éco-conception

| ID | Page | Contenu | ⚠ |
|---|---|---|---|
| M3-01 | eco | Définition de l'éco-conception ; vidéo youtube `RDGhLwSrOsU` | |
| M3-02 | eco | 3 piliers : sobriété, performance, accessibilité ; agir en conception réduit transport, CPU, obsolescence ; « la meilleure énergie est celle qu'on ne consomme pas » | |
| M3-03 | interests | Pourquoi éco-concevoir : 5 leviers (coûts −20-40 %, conformité AGEC/REEN/CSRD/taxonomie, image de marque, éthique des données/RGPD/privacy by design, impact mesurable scope 3/SBTi) | |
| M3-04 | interests | 97 % des Français privilégient les marques durables (GfK 2024) ; 70 % des jeunes diplômés ; subventions ADEME/Régions, CIR, investisseurs ESG, marchés publics | ? |
| M3-05 | referentiels | 4 référentiels : Collectif Numérique Responsable/GreenIT (115 BP), Designers Éthiques, AFNOR Spec 2201, RGESN (78 critères, « décret 2024-623 ») + liens | ? (référence du décret à vérifier) |
| M3-06 | eco-game | Eco-Slash : trancher 20 bonnes pratiques (code optimisé, serveur vert, sobriété data, cache, design épuré), éviter les pièges (obsolescence, fonctions inutiles, requêtes lourdes, autoplay) | |
| M3-07 | eco-levels | 4 niveaux de maturité : 1 optimisation technique (éco-conduite ; 10-30 % sur l'usage) ; 2 architecture ; 3 innovation fonctionnelle ; 4 rupture low-tech | |
| M3-08 | eco-levels | Cas IBM Suisse : 9 To/jour, 33 h → 20 min, 70 000 → 700 kWh | |
| M3-09 | eco-levels | Cas Decathlon : requête 12 s → 5 s, 2 M€/an, data center annulé | |
| M3-10 | eco-levels | Cas mPedigree : SMS contre les faux médicaments (30 % contrefaits en Afrique subsaharienne) | ? (chiffre OMS plutôt ~10 % dans les pays à revenu faible ou intermédiaire) |
| M3-11 | eco-levels | Cas K-DOG vs IA de Google : chiens 100 % (Institut Curie) vs IA ~89 % | ? (étude pilote, petits effectifs) |
| M3-12 | eco-rules | Feuille de route : spécifications, UX/UI, développement, hébergement | |
| M3-13 | specifications | Effet de levier temporel ; corriger en prod coûte 100× plus ; citation Bordage | |
| M3-14 | specifications | 3 règles fondamentales ; 45 % des fonctionnalités jamais utilisées, 25 % non essentielles, 30 % utiles (Standish) | ? (étude 2002 contestée ; incohérent avec M4-11 : 80 %) |
| M3-15 | specifications | Protocole des 3U (Utilisable, Utilisée, Utile) ; checklist de 6 questions (Designers Éthiques, RGESN) ; revue 3U avant chaque sprint | |
| M3-16 | design | Images = 44 % du poids d'une page (HTTP Archive 2022) ; compression 1 400 → 72 Ko | MAJ |
| M3-17 | design | Règles n°47 redimensionnement, 48 WebP/AVIF (−30-50 %), 69 CDN, 05/06 parcours, 04 mobile first, 09 animations, 10 carrousels (< 1 % de clics), 32 polices système (100-300 Ko) | numéros à aligner sur l'édition du référentiel |
| M3-18 | design | Yahoo (surcharge) vs Google (sobriété) ; Wikipédia ~250 Ko ; Ecosia ~400 Ko, 170 M+ arbres | MAJ |
| M3-19 | design | Mode sombre OLED jusqu'à −40 % (Google 2018) ; compression serveur des images UGC | |
| M3-20 | developpement | Étude SLE 2017 (27 langages) : C 1,00 ; Rust 1,03 ; C++ 1,34 ; JS 4,45 ; Python 75,88 ; Perl 79,58 | |
| M3-21 | developpement | 8 règles : n°13 pagination, 15 tree-shaking, 16 cache, 18 pages statiques, 21 limiter les appels API, 24 connexion BD si nécessaire, 64 pas de SQL dans une boucle, 77 minifier | |
| M3-22 | developpement | 1 M visites/mois : ~3 t CO₂/an évitées (= 20 000 km en voiture) | ? |
| M3-23 | developpement | Frameworks : Astro/Svelte ~50 Ko vs Angular/Vue 2 ~200 Ko ; WordPress 64,1 % du marché des CMS ; Translucide ~50 Ko ; outils EcoIndex, Website Carbon, HTTP Archive | MAJ |
| M3-24 | eco-two-game | Quiz 10 QCM (pagination, tree-shaking, cache, statique, SQL en boucle, minification, API, BD, WebP/AVIF, sobriété fonctionnelle) avec explications ; rangs Novice/Apprenti/Expert/Maître | |
| M3-25 | hosting | PUE (1,0 idéal, 1,2 optimal, > 2 mauvais) ; DC = 416 TWh/an (> Royaume-Uni) ; 2 % du CO₂ mondial | MAJ (AIE 2025 : ~415 TWh en 2024, ~945 TWh en 2030) ; 2 % ? |
| M3-26 | hosting | Critères d'un hébergement vert ; comparatif Infomaniak (PUE 1,09), OVH (1,2, watercooling, ISO 50001), PlanetHoster (140 %), GreenGeeks (300 %, crédits) ; standard > 2,0, ×40 | |
| M3-27 | hosting | Calculateur visiteurs × pages × 0,5 g ; outils Green Web Foundation, Website Carbon, Cloud Carbon Footprint | |

## 4. Module 4 — Pilotage & mesure

| ID | Page | Contenu | ⚠ |
|---|---|---|---|
| M4-01 | mesure | « On ne peut améliorer ce qu'on ne mesure pas » ; WebSiteCarbon et EcoIndex, open source, estimation ≠ audit expert | |
| M4-02 | mesure | Mission : tester un vrai site sur ecoindex.fr et saisir le score | |
| M4-03 | mesure | 3 métriques (DOM, requêtes, poids) ; grades A > 80, B 70-80, C 55-70, D 40-55, E 25-40, F 10-25, G ; viser A/B | |
| M4-04 | how | Pipeline Chromium headless (sans cache, 1920×1080, 3 s + scroll + 3 s) ; Puppeteer, Selenium | |
| M4-05 | how | Formule affichée : Score = 100 − 1/6 × (3·Q_DOM + 2·Q_HTTP + 1·Q_poids) ; coefficients 3/2/1 | ✗ facteur manquant : la formule officielle est 100 − 5 × (3·Q_DOM + 2·Q_HTTP + Q_poids) / 6 |
| M4-06 | how | Snippet console d'audit + tables de quantiles DOM/requêtes/poids ; simulateur de quantile (17 requêtes → 3,2) ; base HTTP Archive 500 000 URL ; GitHub EcoIndex | |
| M4-07 | eco-video | youtube `uVZXdiKBLdU` (Concept Image, replay Twitch, ~1 h) | |
| M4-08 | eco-video | Poids médian des pages ×2 en 10 ans | |
| M4-09 | eco-video | Amazon : 1 s de latence = 1,6 Md $/an | ? (anecdote ancienne) |
| M4-10 | eco-video | Mobile first ; compensation carbone = souvent du greenwashing, réduire à la source | |
| M4-11 | eco-video | 80 % des fonctionnalités rarement utilisées | (incohérent avec M3-14) |
| M4-12 | conclusion | Devoir du développeur ; référentiels ; mesurer en continu ; équilibre technique/social/économique ; citation finale | |
| M4-13 | KPIs annoncés | PUE, WUE, Carbon Intensity, GreenIT-Analysis (annoncés dans `index`, peu traités) | à développer |

## 5. Pages orphelines

| ID | Page | Contenu | ⚠ |
|---|---|---|---|
| X-01 | it-game | 4 questions saisies : % GES numérique 2040 selon le Sénat → **6** ; kg de matière pour une puce de 1 g → **16** ; M de smartphones jetés/mois UE → **10** ; métal des écrans tactiles « 100 % dépendant du recyclage » → **INDIUM** ; indices (Sénat, WWF, EuChemS) | ? 6 vs 6,7 % ; affirmation sur l'indium à nuancer |
| X-02 | template | Briefing « Awareness » : « si Internet était un pays, 6e pollueur » ; 3 sources de pollution (suréquipement, surconsommation de données, web obèse) ; QCM : rang → 6e ; mention d’une entreprise (retirée du jeu) | mention retirée du jeu |

## 6. Volet IA (absent aujourd'hui, à créer)

Seuls M2-33 à M2-38 et M3-11 effleurent le sujet. Le nouveau volet couvrira : entraînement vs inférence (énergie, eau, carbone), data centers (AIE 2025), matériel (GPU, HBM, métaux, durée de vie), effets rebond, usages sobres (choix du modèle, taille, prompts, batch), IA au service de la transition, AI Act et obligations de transparence énergétique, ainsi que les rapports de transparence des fournisseurs (Google, Mistral/ADEME, etc.). Chaque chiffre sera daté et sourcé ; les estimations incertaines seront signalées comme telles.
