# Backlog Produit & Roadmap — Objectif Gymnase (11e VP Vaud)

Version actuelle : **`v1.6.0`**  
Objectif : Offrir une plateforme **100 % gratuite, sans publicité et alignée sur le PER (Plan d'études romand / DGEO Vaud)** pour aider tous les élèves de 11e VP à réussir leurs examens de certificat.

---

## 🟢 Terminé (Done — v1.0.0 → v1.6.0)
- [x] **Démarrage 100 % vierge (`0 XP • 0%`) & Constructeur de Parcours (`v1.6.0`)** : Suppression de toutes les données factices, progression dynamique par chapitre (`moduleProgress`) et carte « Mon Parcours à Construire ».
- [x] **Console d'Administration (`🛡️ Admin`) & Invitations (`#invite=...`) (`v1.6.0`)** : Revue des utilisateurs Cloud Firestore, purge des comptes de test, réinitialisation à `0 XP` et génération d'invitations personnalisées avec parcours pré-ciblé.
- [x] Architecture statique gratuite sans frais d'hébergement + Firebase Hosting (`edutech-vaud-11vp.web.app`, prêt pour `edutech.emtechnica.ch`).
- [x] Paramétrage complet de l'application : 3 thèmes visuels (*Neo-Academic*, *Vaud Quest Map*, *Focus Studio*), Coach IA fixe/sticky, cadre d'exercice zéro-scroll, activation des branches et filtre des chapitres.
- [x] **Français 11e VP complet (7 chapitres PER L1 31–38)** : Subordonnées, Fonctions PER (*CP, CDV, CIV, Attribut, Modificateur*), Discours rapporté, Valeurs des temps, Figures de style, Atelier Argumentatif & **Orthographe / Participe passé + Dictées interactives**.
- [x] **Générateur procédural & combinatoire (`PERExerciseGenerator`)** couvrant l'ensemble des 7 chapitres FR et 4 chapitres DE.
- [x] **Mode « Examen Blanc de Certificat Vaud »** : 2 épreuves chronométrées (45 min) avec texte + 8 questions + note suisse `/6.0` + rédaction argumentative + grille DGEO + évaluation Coach IA.
- [x] **Programme complet Allemand 11e VP (PER L2)** : 4 chapitres (*Nebensätze V2*, *Perfekt/Präteritum*, *Kasus & Wechselpräpositionen*, *Wortschatz*).
- [x] **Authentification Élève & Cloud Firestore** : Pseudo nLPD Vaud / Email / Google, classement Vaud, synchronisation cloud des profils, file « Mes erreurs » (`/mistakes`) et règles durcies `firestore.rules`.
- [x] **Défis Multijoueurs par URL (`#duel=...`)** & **Mode Enseignant (`#devoir=...`)** : liens de défi 5 questions et devoirs de classe sans serveur payant.

---

## 🔵 Évolutions Futures Possibles (Post-v1.5.0)
- [ ] **Domaine personnalisé** : Raccordement DNS de `edutech.emtechnica.ch` sur Firebase Hosting.
- [ ] **Branches optionnelles supplémentaires** : Synthèse vocale (compréhension orale allemand PER L2) et modules Mathématiques 11e VP.
- [ ] **Export PDF** des copies d'Examen Blanc et bilans familiaux.
