# 🇨🇭 Objectif Gymnase — 11e VP Vaud (`v1.5.0`)

Plateforme d'étude interactive **100 % gratuite et open-source** dédiée aux élèves de **11e VP (Voie Prégymnasiale)** dans le **Canton de Vaud (Suisse)**, alignée sur le **Plan d'études romand (PER)** et les exigences des **Examens de certificat (DGEO Vaud)**.

- 🌐 **Application en ligne** : https://edutech-vaud-11vp.web.app *(domaine personnalisé prévu : `edutech.emtechnica.ch`)*
- 🔥 **Infrastructure** : Firebase Hosting, Firebase Auth (Pseudonyme nLPD / Email / Google) & Cloud Firestore (`eur3`)

---

## ✨ Fonctionnalités Principales (`v1.5.0`)

1. **Programme Officiel Français 11e VP (7 Chapitres PER L1 31–38)** :
   - 🧩 **Propositions Subordonnées** : Relatives, complétives conjonctives, interrogatives indirectes et circonstancielles.
   - 📐 **Fonctions Syntaxiques PER** : Terminologie officielle romande (*Complément de phrase CP*, *CDV*, *CIV*, *Attribut du sujet*, *Modificateur du nom*).
   - 💬 **Discours Rapporté & Énonciation** : Transposition direct/indirect, concordance des temps, repères spatio-temporels et discours indirect libre.
   - ⏳ **Conjugaison & Valeurs des Temps** : Imparfait d'arrière-plan vs Passé simple de premier plan, valeurs du Présent et du Conditionnel, Subjonctif, Plus-que-parfait.
   - 🎭 **Figures de Style & Analyse Littéraire** : Métaphore, comparaison, oxymore, antithèse, anaphore, hyperbole, litote, euphémisme, personnification.
   - ✍️ **Atelier Texte Argumentatif (Spécial Certificat)** : Introduction en 3 étapes (sujet amené, posé, divisé), connecteurs logiques, concession et réfutation.
   - ✒️ **Orthographe & Participe Passé (PER L1 37)** : Auxiliaires *être*, *avoir* (CDV antéposé, pronom *en*), verbes pronominaux & **Dictées interactives / Repérage de fautes**.
2. **Programme Complet Allemand 11e VP (4 Chapitres PER L2)** :
   - 🇩🇪 *Hauptsatz (V2) & Nebensätze (weil, dass, obwohl, wenn, als)*
   - ⏱️ *Perfekt (haben/sein + Partizip II) & Präteritum (Modaux)*
   - 🧭 *Kasus (Nominativ, Akkusativ, Dativ) & Wechselpräpositionen*
   - 🗣️ *Wortschatz & Redewendungen 11e VP*
3. **Simulation « Examen Blanc de Certificat Vaud »** :
   - 2 épreuves complètes chronométrées (45 min) avec **Partie 1** (Compréhension & Langue — note suisse `/6.0`) et **Partie 2** (Rédaction argumentative, grille DGEO et évaluation par le **Coach IA**).
4. **Duels Multijoueurs (`#duel=...`), Mode Enseignant (`#devoir=...`) & Répétition Espacée** :
   - Encodage des 5 mêmes questions par URL `#duel=...` ou code Cloud Firestore, file automatique **« 🔁 Erreurs »**, **Coach IA fixe/sticky** et **Mode Enseignant** pour partager un devoir de classe ciblé.
5. **Paramétrage & Conformité nLPD** :
   - 3 thèmes visuels (*Neo-Academic*, *Vaud Quest Map*, *Minimalist Focus Studio*), fonctionnement *Local-First* hors-ligne ou synchronisation Cloud Firebase.

---

## 🚀 Déploiement (Firebase Hosting & GitHub)

### Lancer en local
```bash
python3 -m http.server 8080
```

### Déployer sur Firebase
```bash
firebase deploy --only firestore,hosting --project edutech-vaud-11vp
```

---

## 📋 Suivi des Versions & Backlog
- Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique des versions.
- Voir [BACKLOG.md](BACKLOG.md) pour la feuille de route et les prochaines fonctionnalités.
