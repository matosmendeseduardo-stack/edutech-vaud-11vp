# Changelog — Objectif Gymnase (11e VP Vaud)

Toutes les évolutions notables de la plateforme gratuite d'étude pour la **11e VP (Canton de Vaud)** sont documentées dans ce fichier.

---

## [v1.5.0] — 2026-11-12
### Ajouté (Programme Complet FR + DE, Examen Blanc Certificat, Duels URL & Mode Enseignant)
- **🎓 Mode « Examen Blanc de Certificat Vaud » (`window.CERTIFICAT_MOCK_EXAMS`, `#exam-blanc-workspace`)** :
  - 2 examens complets chronométrés (45 min) : *Texte Argumentatif & Langue* et *Analyse Littéraire & Poétique*.
  - **Partie 1** : Texte structuré + 8 questions PER avec correction immédiate et **note vaudoise officielle `/6.0`** (seuil à `4.0`).
  - **Partie 2** : Rédaction argumentative guidée, compteur de mots, **grille d'auto-évaluation DGEO Vaud** et **évaluation instantanée par le Coach IA (`evaluateArgumentativeEssay`)**.
- **🇩🇪 Programme Complet Allemand 11e VP — PER L2 (4 Chapitres Complets)** :
  - `1. Hauptsatz (V2) & Nebensätze (weil, dass, obwohl, wenn, als)`
  - `2. Perfekt (haben/sein + Partizip II) & Präteritum (Modaux)`
  - `3. Kasus (Nom, Akk, Dativ) & Wechselpräpositionen (Wo? / Wohin?)`
  - `4. Wortschatz & Redewendungen 11e VP`
- **✒️ Banque d'exercices étendue + Dictées Interactives & Générateur Combinatoire** :
  - Nouveaux exercices sur tous les chapitres de Français, incluant **Dictée interactive / Repérage de fautes** (*Projet Voltaire* Vaud) et générateur `PERExerciseGenerator` couvrant les 7 chapitres FR et les 4 chapitres DE.
- **⚔️ Défis Multijoueurs par URL (`#duel=...`) & Synchronisation Firestore complète** :
  - Encodage des 5 mêmes questions PER directement dans le lien `#duel=...` + formulaire **Rejoindre un duel** par lien ou code Firestore, avec suivi des manches en direct et synchronisation de la file privée `/profiles/{uid}/mistakes`.
- **👩‍🏫 Mode Enseignant Vaudois (`#devoir=...`)** :
  - Générateur de liens de devoir de classe dans `⚙️ Paramètres` pour cibler 1 ou plusieurs chapitres (FR + DE) sans serveur payant.
- **🔒 Sécurité Firestore (`firestore.rules`)** :
  - Ajout du champ `avatar` sur `/profiles/{userId}` et `questionIds` immuable sur `/duels/{duelId}`.

---

## [v1.3.0] — 2026-11-11
### Ajouté (Firebase Auth, Cloud Firestore, Règles de Sécurité & Chapitre 7 Orthographe PER)
- **👤 Authentification & Profil Élève 11e VP (`js/firebase-service.js`)** :
  - Nouveau bouton de profil dans la barre supérieure (`👤 Connexion / Profil` ou `⚡ Pseudo (Collège)`).
  - **Option A — Connexion Rapide Élève (Recommandée nLPD Vaud)** : Choix d'un pseudonyme, de l'établissement secondaire vaudois (*Collège de Béthusy*, *Établissement de Nyon-Marens*, *Morges Beausobre*, *Vevey*, *Yverdon*) et d'un avatar sans collecte d'email obligatoire.
  - **Option B — Firebase Authentication (Email/Mot de passe & Google)** : Synchronisation multi-appareils avec bascule transparente en mode *Local-First* hors-ligne.
- **☁️ Synchronisation Cloud Firestore & Sécurité (`firestore.rules`, `firebase.json`)** :
  - Synchronisation automatique des XP, séries de jours, chapitres ciblés, classement entre amis et codes de Duels 1v1 (`profiles/{userId}`, `duels/{duelCode}`).
  - Section dédiée **`☁️ 4. Connexion Cloud Firebase (edutech.emtechnica.ch)`** dans `⚙️ Paramètres`.
- **✒️ Chapitre 7 Officiel Français 11e VP (`orthographe` — PER L1 37)** :
  - *7. Orthographe & Accord du Participe Passé (Être, Avoir, Pronominaux)* avec fiche théorique officielle PER (règle du CDV antéposé avec *avoir*, pièges des verbes pronominaux tels que *se succéder* ou *se laver les mains*), QCM, *Chirurgie orthographique* et générateur procédural infini.

---

## [v1.2.1] — 2026-11-11
### Améliorations Ergonomiques (Coach IA Fixe & Cadre d'Exercice Zéro-Scroll)
- **🤖 Coach IA 11e VP Fixe / Sticky à Côté de la Page Principale** :
  - Placement du **Coach IA 11e VP** dans une colonne dédiée (`grid-template-columns: minmax(0, 1fr) 310px`) avec `position: sticky; top: 68px; height: calc(100vh - 84px)` afin qu'il reste **toujours visible à l'écran** même lorsque l'élève fait défiler la page principale.
- **🎯 Cadre d'Exercice Zéro-Scroll (« Question suivante → » Toujours Visible)** :
  - Optimisation de la hauteur de la vue **`🎯 Entraînement`** (`height: calc(100vh - 84px)`) et barre d'action inférieure ancrée (`.arena-docked-bottom`) garantissant que **`Question suivante →`** est immédiatement accessible sans jamais défiler.
  - Transformation de l'**`📖 Aide-Mémoire PER`** en superposition (popover interne à la carte) pour ne jamais pousser le bouton `Question suivante →` hors de l'écran.

---

## [v1.2.0] — 2026-11-11
### Refonte UX/UI (Architecture Calme, Progressive Disclosure & Zéro Surcharge Cognitive)
- **Navigation Segmentée en 4 Onglets** :
  - `📚 Parcours`, `🎯 Entraînement`, `🏆 Défis & Famille`, `⚙️ Paramètres`.

---

## [v1.1.0] — 2026-11-11
### Ajouté (Inspiré des meilleures plateformes : Khan Academy, Anki, Projet Voltaire)
- **6 Chapitres Officiels Français 11e VP (Alignés DGEO Vaud / PER L1 31-38)** + **📖 Aide-Mémoire PER** + **🔁 Mode Répétition Espacée « Mes erreurs »** + **✨ Générateur Procédural d'Exercices PER**.

---

## [v1.0.0] — 2026-11-11
### Ajouté
- Prototype initial interactif multi-thèmes (*Neo-Academic*, *Vaud Quest Map*, *Focus Studio*), **Coach IA 11e VP gratuit**, **Duel 1v1 entre amis** et **Carte Bilan Famille**.
