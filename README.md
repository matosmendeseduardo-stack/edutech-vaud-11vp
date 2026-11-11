# 🇨🇭 Objectif Gymnase — 11e VP Vaud (`v1.1.0`)

Plateforme d'étude interactive **100 % gratuite et open-source** dédiée aux élèves de **11e VP (Voie Prégymnasiale)** dans le **Canton de Vaud (Suisse)**, alignée sur le **Plan d'études romand (PER)** et les exigences des **Examens de certificat (DGEO Vaud)**.

---

## ✨ Fonctionnalités Principales (`v1.1.0`)

1. **Programme Officiel Français 11e VP (PER L1 31–38)** :
   - 🧩 **Propositions Subordonnées** : Relatives, complétives conjonctives, interrogatives indirectes et circonstancielles.
   - 📐 **Fonctions Syntaxiques PER** : Terminologie officielle romande (*Complément de phrase CP*, *CDV*, *CIV*, *Attribut du sujet*, *Modificateur du nom*).
   - 💬 **Discours Rapporté & Énonciation** : Transposition du discours direct au discours indirect, concordance des temps, repères spatio-temporels et discours indirect libre.
   - ⏳ **Conjugaison & Valeurs des Temps** : Imparfait d'arrière-plan vs Passé simple de premier plan, valeurs du Présent et du Conditionnel, Subjonctif.
   - 🎭 **Figures de Style & Analyse Littéraire** : Métaphore, comparaison, oxymore, antithèse, anaphore, hyperbole, litote, euphémisme, personnification.
   - ✍️ **Atelier Texte Argumentatif (Spécial Certificat)** : Introduction en 3 étapes (sujet amené, posé, divisé), connecteurs logiques, concession et réfutation.
2. **Inspiré des Meilleures Plateformes d'Apprentissage** :
   - 📖 **Aide-Mémoire PER intégré (*Khan Academy*)** : Fiche de théorie officielle consultable en un clic au-dessus de chaque exercice.
   - 🔁 **Répétition Espacée « Mes erreurs » (*Anki / Projet Voltaire*)** : Les questions ratées rejoignent automatiquement une file d'attente personnalisée jusqu'à leur maîtrise.
   - ✂️ **Chirurgie de la Phrase (*Projet Voltaire*)** : Identification interactive par clic direct sur les segments de la phrase.
   - ⚡ **Sprint Chrono 60s & Quête du Léman (*Duolingo*)** : Progression par XP de *Nyon → Morges → Lausanne → Vevey → Montreux*.
3. **Paramétrage Complet (`⚙️ Paramètres & Focus`)** :
   - **3 Thèmes Visuels au choix** : *Lausanne Neo-Academic*, *Vaud Quest Map* et *Minimalist Focus Studio*.
   - **Sélection des Branches** : *Français 11e VP* + option *Allemand 11e VP (Aperçu)*.
   - **Filtre de Chapitres Ciblés** : L'élève coche uniquement les chapitres de son prochain test.
4. **Générateur Procédural Infini & Coach IA Gratuit** :
   - Génération dynamique de nouveaux exercices vérifiés (`PERExerciseGenerator`) sans frais de serveur.
   - Coach IA intégré pour expliquer les règles PER et diagnostiquer les paragraphes argumentatifs.

---

## 🚀 Déploiement Gratuit sur GitHub Pages

Ce dépôt inclut un workflow GitHub Actions (`.github/workflows/deploy-pages.yml`) qui publie automatiquement le site sur **GitHub Pages** à chaque `git push` sur la branche `main`.

### Lancer en local
Ouvrez simplement `index.html` dans votre navigateur ou lancez :
```bash
python3 -m http.server 8080
```

---

## 📋 Suivi des Versions & Backlog
- Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique des versions.
- Voir [BACKLOG.md](BACKLOG.md) pour la feuille de route et les prochaines fonctionnalités.
