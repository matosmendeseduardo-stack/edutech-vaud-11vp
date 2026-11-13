# Changelog — Objectif Gymnase (11e VP Vaud)

Toutes les évolutions notables de la plateforme gratuite d'étude pour la **11e VP (Canton de Vaud)** sont documentées dans ce fichier.

---

## [v1.6.0] — 2026-11-13
### Ajouté & Repensé (Console Admin, Invitations Utilisateurs & Démarrage Vierge 0%)
- **🌱 Démarrage 100 % Vierge (« Mon Parcours à Construire » — `0 XP • 0%`)** :
  - Suppression de toutes les données factices pré-remplies (`340 XP`, `5 j.`, `18` réponses, `INITIAL_LEADERBOARD` fictif, bouton « Simuler un duel contre Léo » et pourcentages statiques).
  - Ajout de la carte d’embarquement en 3 étapes (`#fresh-start-builder-card`) avec sélecteur rapide de chapitres (`#path-quick-chapters`) et progression dynamique par chapitre (`moduleProgress` `0% → 100%`) persistée en local et dans Cloud Firestore.
- **🛡️ Console d’Administration (`#view-admin`, onglet `🛡️ Admin`)** :
  - Tableau de revue des utilisateurs inscrits dans Cloud Firestore (`/profiles`) avec recherche instantanée, suivi réel (`XP`, série, réponses, précision, chapitres ciblés), remise à zéro (`🧹 0 XP`), suppression individuelle et purge 1-clic des comptes de test (`🗑️ Purger comptes test QA`).
- **✉️ Système d’Invitations (`#invite=...` & collection Firestore `/invitations/{code}`)** :
  - Formulaire d’invitation permettant d’inviter un élève, enseignant ou administrateur avec son école et ses chapitres PER pré-ciblés.
  - Génération de lien 1-clic `#invite=...` qui embarque l’utilisateur invité avec un compteur vierge (`0 XP`, `0%`) prêt à construire son parcours, et met à jour le statut de l’invitation (`⏳ En attente` → `✅ Acceptée`).
- **🔒 Règles Firestore (`firestore.rules`)** :
  - Ajout de `isAdmin()`, prise en charge de `role`, `moduleProgress` et `inviteCode` sur `/profiles/{userId}`, et règles de sécurité complètes pour `/invitations/{inviteId}`.

---

## [v1.5.1] — 2026-11-13
### Corrigé & Durci (Revue QA Navigateur Chrome & Sécurité)
- **☁️ Synchronisation Profil Firestore (`js/firebase-service.js`)** : Valeurs par défaut non vides (`enabledSubjects`, `focusedModules`), normalisation des bornes et `correctCount <= answeredCount` dans `syncProfile()` afin de respecter `firestore.rules` dès la première session.
- **🔐 Connexion Google (`signInWithGoogle`)** : Traduction en français des erreurs `auth/operation-not-allowed`, `auth/popup-blocked` et `auth/popup-closed-by-user`, et synchronisation immédiate du profil après connexion.
- **⚔️ Bouton Duel & Presse-papiers (`js/app.js`)** : Capture synchrone de `e.currentTarget` avant `await createCloudDuel(...)` sur `#copy-duel-btn` (évite un `TypeError` sur `null`) et ajout de `copyTextSafe()` pour éviter tout rejet non géré de `navigator.clipboard.writeText()`.
- **📐 Ergonomie Laptop & Favicon (`css/styles.css`, `index.html`)** : Barre supérieure sur une seule ligne (`>= 921px`), hauteur adaptée pour garder `#next-question-btn` et `.sticky-ai-card` visibles sans défilement à `1366×753` (y compris avec bannière `#duel=` / `#devoir=`), et favicon SVG intégré (suppression du `404` sur `/favicon.ico`).

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
