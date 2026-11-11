# Backlog Produit & Roadmap — Objectif Gymnase (11e VP Vaud)

Version actuelle : **`v1.1.0`**  
Objectif : Offrir une plateforme **100 % gratuite, sans publicité et alignée sur le PER (Plan d'études romand / DGEO Vaud)** pour aider tous les élèves de 11e VP à réussir leurs examens de certificat.

---

## 🟢 Terminé (Done — v1.0.0 & v1.1.0)
- [x] Architecture modulaire sans frais d'hébergement (compatible GitHub Pages).
- [x] Paramétrage complet de l'application : choix des 3 thèmes visuels, activation des branches (Français + Allemand en option) et filtrage des chapitres ciblés.
- [x] 6 chapitres fondamentaux de Français 11e VP avec terminologie officielle vaudoise (*CP, CDV, CIV, Modificateur, Attribut*).
- [x] **Aide-Mémoire PER** intégré à chaque chapitre (inspiré de *Khan Academy*).
- [x] **File de répétition espacée « Mes erreurs »** automatique (inspirée d'*Anki* et *Projet Voltaire*).
- [x] **Générateur procédural d'exercices (`PERExerciseGenerator`)** pour multiplier la banque de questions sans coût serveur.
- [x] **Coach IA 11e VP gratuit** avec analyseur de paragraphes argumentatifs et explications grammaticales.
- [x] Système de points (XP), série de jours (*Streaks*), Duel 1v1 entre amis et Bilan partageable avec la famille.

---

## 🟡 Prochaines Priorités (Court Terme — v1.2.0 & v1.3.0)
### 1. Banque d'exercices & Orthographe (v1.2.0)
- [ ] **Module 7 (Français) : Accord du participe passé & Orthographe grammaticale (PER L1 37)** :
  - Accord avec *être*, *avoir* (CDV placé avant le verbe) et verbes pronominaux.
  - Mode « Dictée interactive / Repérage de fautes » inspiré du *Projet Voltaire*.
- [ ] Étendre le générateur procédural à **+200 variantes combinatoires** sur les subordonnées et la concordance des temps.

### 2. Simulation « Examen Blanc de Certificat Vaud » (v1.3.0)
- [ ] Mode examen chronométré combinant :
  1. Un texte littéraire ou argumentatif complet avec questions de compréhension et d'analyse stylistique.
  2. Une grille d'auto-évaluation officielle pour la rédaction argumentative (Introduction, Thèse, Arguments, Connecteurs, Conclusion).

---

## 🔵 Moyen Terme (v1.4.0 & v1.5.0)
### 3. Développement Complet de l'Allemand 11e VP (PER L2 — v1.4.0)
- [ ] **Chapitre 1** : *Hauptsatz (V2) & Nebensätze (weil, dass, obwohl, wenn, als)*.
- [ ] **Chapitre 2** : *Perfekt (haben vs. sein + Partizip II)* & *Präteritum (Modalverben)*.
- [ ] **Chapitre 3** : *Kasus (Nominativ, Akkusativ, Dativ) & Präpositionen*.
- [ ] **Chapitre 4** : *Wortschatz 11e VP* (Flashcards interactives avec répétition espacée).

### 4. Défis Multijoueurs par URL & Mode Enseignant (v1.5.0)
- [ ] Encodage du défi directement dans le hash de l'URL (`#duel=...`) pour qu'un ami clique sur le lien WhatsApp et joue exactement les 5 mêmes questions sans serveur payant.
- [ ] Mode « Devoir / Révision de classe » : un enseignant vaudois peut cocher 2 chapitres et générer un lien personnalisé pour sa classe de 11e VP.
