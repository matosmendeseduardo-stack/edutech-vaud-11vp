# Changelog — Objectif Gymnase (11e VP Vaud)

Toutes les évolutions notables de la plateforme gratuite d'étude pour la **11e VP (Canton de Vaud)** sont documentées dans ce fichier.

---

## [v1.1.0] — 2026-11-11
### Ajouté (Inspiré des meilleures plateformes : Khan Academy, Anki, Projet Voltaire)
- **Centre de Paramètres & Personnalisation (`⚙️ Paramètres & Focus`)** :
  - Sélecteur de thème visuel intégré dans les paramètres (*Lausanne Neo-Academic*, *Vaud Quest Map*, *Minimalist Focus Studio*).
  - Paramétrage des branches actives (**Français 11e VP** actif + **Allemand 11e VP** activable en option/aperçu).
  - Filtre de **Chapitres Ciblés (Focus)** permettant à l'élève de cocher uniquement les sujets de son prochain contrôle continu ou du Certificat.
- **6 Chapitres Officiels Français 11e VP (Alignés DGEO Vaud / PER L1 31-38)** :
  1. *Propositions Subordonnées* (Relatives, Complétives, Interrogatives indirectes, Circonstancielles).
  2. *Fonctions Syntaxiques PER* (Complément de phrase CP, CDV, CIV, Attribut du sujet, Modificateur).
  3. *Discours Rapporté & Énonciation* (Transposition Direct → Indirect, concordance des temps, repères spatio-temporels, discours indirect libre).
  4. *Conjugaison & Valeurs des Temps* (Imparfait d'arrière-plan vs Passé simple, valeurs du Présent et du Conditionnel, Subjonctif).
  5. *Figures de Style & Analyse Littéraire* (Analogie, opposition, amplification, atténuation).
  6. *Atelier Texte Argumentatif (Spécial Certificat)* (Sujet amené/posé/divisé, connecteurs logiques, concession/réfutation).
- **📖 Aide-Mémoire PER intégré (Modèle Khan Academy)** : Fiche théorique officielle consultable en un clic au-dessus de chaque exercice.
- **🔁 Mode Répétition Espacée « Mes erreurs » (Modèle Anki / Projet Voltaire)** : Enregistrement automatique des questions ratées dans une file de révision dédiée jusqu'à maîtrise complète.
- **✨ Générateur Procédural d'Exercices PER (`PERExerciseGenerator`)** : Création dynamique de nouvelles questions vérifiées à la volée.
- **Déploiement Continu GitHub Pages** : Workflow `.github/workflows/deploy-pages.yml` prêt pour héberger gratuitement le site.

---

## [v1.0.0] — 2026-11-11
### Ajouté
- Prototype initial interactif multi-thèmes (*Neo-Academic*, *Vaud Quest Map*, *Focus Studio*).
- Modes d'exercices : QCM PER, *Chirurgie de la phrase* (segments cliquables) et *Sprint Chrono 60s*.
- Système de gamification (XP, Série de jours, Carte du Léman Nyon → Montreux).
- **Coach IA 11e VP gratuit** (moteur pédagogique PER hors-ligne + support clé API Gemini gratuite).
- Partage social : Code de **Duel 1v1 entre amis** et **Carte Bilan Famille** (WhatsApp/iMessage).
