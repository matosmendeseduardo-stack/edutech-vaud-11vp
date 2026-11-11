/* ==========================================================================
   Coach IA 11e VP — Hybrid Free Pedagogical Engine (Zero-Config + Optional Gemini API)
   Trained on Canton of Vaud PER (Plan d'études romand) Terminology
   ========================================================================== */

window.VaudAICoach = class VaudAICoach {
  constructor() {
    this.apiKey = localStorage.getItem('vaud_11vp_gemini_key') || '';
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    if (this.apiKey) {
      localStorage.setItem('vaud_11vp_gemini_key', this.apiKey);
    } else {
      localStorage.removeItem('vaud_11vp_gemini_key');
    }
  }

  async askCoach(userText, currentQuestion = null) {
    const query = userText.trim();
    if (!query) return 'Pose-moi une question sur le programme de 11e VP (ex: « différence relative / complétive » ou colle ton paragraphe argumentatif) !';

    // If user configured a free Gemini API key, try calling Gemini 2.5 Flash first
    if (this.apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(this.apiKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `Tu es un professeur bienveillant de Français et d'Allemand en 11e VP dans le canton de Vaud (Suisse). Utilise strictement la terminologie officielle du PER (Plan d'études romand : Complément de phrase CP, CDV, CIV, modificateur, subordonnée relative, complétive, circonstancielle). Sois concis (max 4 phrases), encourageant et donne un exemple concret. Question de l'élève : ${query}`
                }]
              }]
            })
          }
        );
        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        }
      } catch (e) {
        // Fallback silently to built-in PER engine
      }
    }

    // Built-in Zero-Cost Vaud PER Pedagogical Engine
    const lower = query.toLowerCase();

    if (lower.includes('erreur') || lower.includes('explique') || lower.includes('pourquoi')) {
      if (currentQuestion) {
        return `💡 **Explication PER (${currentQuestion.id.toUpperCase()})** : ${currentQuestion.perRule} N'oublie pas : au Certificat vaudois, précise toujours la **nature** (ce que c'est) ET la **fonction** (le rôle dans la phrase) !`;
      }
    }

    if (lower.includes('relative') || lower.includes('complétive') || lower.includes('completive') || lower.includes('que')) {
      return `🔍 **Astuce 11e VP (« que »)** :
• Après un **nom** (antécédent) → *Subordonnée relative* (ex: « Le livre **que** je lis »).
• Après un **verbe** → *Subordonnée complétive* (ex: « Je pense **que** tu réussiras »), fonction CDV !`;
    }

    if (lower.includes('cp') || lower.includes('complément de phrase') || lower.includes('cdv') || lower.includes('fonction')) {
      return `📐 **Terminologie PER Vaud** :
• **Complément de phrase (CP)** : déplaçable et supprimable (ex: *Tous les matins*, il révise).
• **Complément de verbe (CDV / CIV)** : essentiel au verbe, non déplaçable (ex: Il prépare *son certificat*).`;
    }

    if (lower.includes('oxymore') || lower.includes('antithèse') || lower.includes('métaphore') || lower.includes('figure')) {
      return `🎭 **Mémo Figures de style** :
• **Métaphore vs Comparaison** : la métaphore n'a PAS d'outil comparatif (*comme, tel*).
• **Oxymore vs Antithèse** : l'oxymore colle 2 mots opposés côte à côte (*« une obscure clarté »*), l'antithèse les sépare dans la phrase.`;
    }

    if (lower.includes('argument') || lower.includes('intro') || lower.includes('certificat') || query.split(' ').length > 14) {
      // Analyze student's argumentative paragraph!
      const connectors = ['cependant', 'néanmoins', 'toutefois', 'en effet', 'de plus', 'ainsi', 'par conséquent', 'certes', 'or', 'donc'];
      const found = connectors.filter(c => lower.includes(c));
      const wordCount = query.split(/\s+/).length;
      if (wordCount > 12) {
        return `✍️ **Diagnostic Atelier Argumentatif (${wordCount} mots)** :
• Connecteurs logiques repérés : ${found.length > 0 ? found.map(f => `« ${f} »`).join(', ') + ' ✅' : 'Aucun détecté ⚠️ (ajoute *En effet*, *Néanmoins* ou *Par conséquent*)'}.
• Conseil 11e VP : Vérifie que ton paragraphe suit la structure **Idée directrice → Argument → Exemple précis**.`;
      }
      return `✍️ **Recette du Texte Argumentatif (Certificat Vaud)** :
1. **Intro** : Sujet amené → Sujet posé (question) → Sujet divisé (plan).
2. **Développement** : Thèse + arguments illustrés + concession (*Certes... toutefois...*).
3. **Conclusion** : Bilan + ouverture.`;
    }

    if (lower.includes('allemand') || lower.includes('weil') || lower.includes('dass') || lower.includes('obwohl')) {
      return `🇩🇪 **Tipp Allemand 11e VP** : Avec *weil*, *dass*, *obwohl* et *wenn*, le verbe conjugué part **tout à la fin** de la subordonnée. Et si la subordonnée est en tête de phrase, on inverse le sujet et le verbe après la virgule (V2) !`;
    }

    return `🇨🇭 **Coach 11e VP** : Excellente question ! Pour le Certificat vaudois, veux-tu qu'on révise :
1. La différence entre **relative et complétive** ?
2. Les **fonctions PER** (CP, CDV, CIV) ?
3. Ou colle un extrait de ton **texte argumentatif** pour que je l'analyse !`;
  }
}
