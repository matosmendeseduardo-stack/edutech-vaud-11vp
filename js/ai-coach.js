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

    if (lower.includes('participe') || lower.includes('orthographe') || lower.includes('accord') || lower.includes('pronominal') || lower.includes('homophone')) {
      return `✒️ **Mémo PER — Participe passé & Orthographe** :
• **Être** : accord avec le sujet (*Elles sont parties*).
• **Avoir** : accord avec le **CDV** uniquement s'il est placé **avant** le verbe (*Les lettres qu'elle a écrites* vs *Elle a écrit des lettres*).
• **Pronominaux** : si « se » = CIV (*se téléphoner, se succéder, se parler*), le participe passé est **invariable** !`;
    }

    if (lower.includes('discours') || lower.includes('indirect') || lower.includes('imparfait') || lower.includes('passé simple') || lower.includes('conditionnel') || lower.includes('subjonctif') || lower.includes('valeur')) {
      return `⏳ **Discours rapporté & Valeurs des temps (PER)** :
• **Discours indirect** (verbe introducteur au passé) : Présent → Imparfait | Passé composé → Plus-que-parfait | Futur → Conditionnel présent (*demain* → *le lendemain*).
• **Récit** : **Imparfait** = arrière-plan/description/habitude ; **Passé simple** = premier plan/action soudaine et bornée.`;
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

    if (lower.includes('perfekt') || lower.includes('präteritum') || lower.includes('partizip') || lower.includes('haben') || lower.includes('sein') || lower.includes('modal')) {
      return `🇩🇪 **Perfekt & Präteritum (PER L2)** :
• **Perfekt** : *haben* pour la majorité des verbes ; **sein** pour les déplacements (*gehen, fahren, fliegen*) et changements d'état (*aufstehen, werden, bleiben*). Attention : pas de *ge-* pour *be-, ver-, er-, ent-* (ex: *verstanden*).
• **Präteritum** : pour *sein (war)*, *haben (hatte)* et les modaux (*konnte, musste, wollte, durfte*).`;
    }

    if (lower.includes('kasus') || lower.includes('dativ') || lower.includes('akkusativ') || lower.includes('nominativ') || lower.includes('préposition') || lower.includes('wohin')) {
      return `🇩🇪 **Kasus & Wechselpräpositionen (PER L2)** :
• **Toujours Dativ** : *mit, nach, aus, zu, von, bei, seit* (*mit dem Zug, bei meiner Freundin*).
• **Toujours Akkusativ** : *durch, für, gegen, ohne, um* (*für den Bruder*).
• **Mixtes (in, auf, an, unter, über)** : **Wo?** (statique) → *Dativ* | **Wohin?** (mouvement vers) → *Akkusativ* !`;
    }

    if (lower.includes('wortschatz') || lower.includes('vocabulaire') || lower.includes('allemand') || lower.includes('weil') || lower.includes('dass') || lower.includes('obwohl')) {
      return `🇩🇪 **Tipp Allemand 11e VP** : Avec *weil*, *dass*, *obwohl* et *wenn*, le verbe conjugué part **tout à la fin** de la subordonnée. Si la subordonnée est en tête de phrase, applique **Verb, Verb** autour de la virgule !`;
    }

    if (lower.includes('argument') || lower.includes('intro') || lower.includes('certificat') || query.split(' ').length > 14) {
      // Analyze student's argumentative paragraph!
      const report = this.evaluateArgumentativeEssay('Atelier Argumentatif', query);
      if (report.wordCount > 12) {
        return `✍️ **Diagnostic Atelier Argumentatif (${report.wordCount} mots — Estimation ${report.scoreOver6.toFixed(1)}/6.0)** :
• Connecteurs repérés : ${report.foundConnectors.length > 0 ? report.foundConnectors.map(f => `« ${f} »`).join(', ') + ' ✅' : 'Aucun détecté ⚠️ (ajoute *En effet*, *Néanmoins* ou *Par conséquent*)'}.
• Concession / nuance : ${report.hasConcession ? 'Repérée ✅' : 'À renforcer (*Certes... toutefois...*) 💡'}.
• Conseil PER : Vérifie la progression **Idée directrice → Argument → Exemple concret**.`;
      }
      return `✍️ **Recette du Texte Argumentatif (Certificat Vaud)** :
1. **Intro** : Sujet amené → Sujet posé (question) → Sujet divisé (plan).
2. **Développement** : Thèse + arguments illustrés + concession (*Certes... toutefois...*).
3. **Conclusion** : Bilan + ouverture.`;
    }

    return `🇨🇭 **Coach 11e VP** : Excellente question ! Pour le Certificat vaudois, veux-tu qu'on révise :
1. La différence entre **relative et complétive** ou l'**accord du participe passé** ?
2. Les **fonctions PER** (CP, CDV, CIV) ou les **figures de style** ?
3. La syntaxe **allemande** (V2, Nebensatz, Perfekt, Dativ/Akkusativ) ou un **texte argumentatif** ?`;
  }

  evaluateArgumentativeEssay(promptTitle, essayText) {
    const clean = (essayText || '').trim();
    const lower = clean.toLowerCase();
    const words = clean ? clean.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;

    const connectorBank = [
      'tout d\'abord', 'd’abord', 'en effet', 'de plus', 'en outre', 'par ailleurs',
      'cependant', 'néanmoins', 'toutefois', 'en revanche', 'certes', 'bien que',
      'malgré', 'ainsi', 'par conséquent', 'c\'est pourquoi', 'donc', 'en conclusion', 'finalement'
    ];
    const foundConnectors = connectorBank.filter(c => lower.includes(c));
    const hasConcession = ['certes', 'bien que', 'néanmoins', 'toutefois', 'cependant', 'malgré', 'il est vrai que'].some(c => lower.includes(c));
    const hasExample = ['par exemple', 'ainsi', 'comme', 'notamment', 'en témoigne'].some(c => lower.includes(c));
    const hasIntroQuestion = clean.includes('?') || ['aujourd\'hui', 'aujourd’hui', 'de nos jours', 'société', 'problématique'].some(c => lower.includes(c));
    const hasConclusion = ['en conclusion', 'pour conclure', 'en somme', 'finalement', 'bilan'].some(c => lower.includes(c));

    // Estimate Swiss grade (/6.0 scale) based on structure & richness
    let pts = 2.0;
    if (wordCount >= 50) pts += 0.5;
    if (wordCount >= 110) pts += 0.5;
    if (wordCount >= 170) pts += 0.5;
    if (foundConnectors.length >= 2) pts += 0.5;
    if (foundConnectors.length >= 4) pts += 0.5;
    if (hasConcession) pts += 0.5;
    if (hasExample) pts += 0.5;
    if (hasIntroQuestion) pts += 0.25;
    if (hasConclusion) pts += 0.25;

    const rawScore = Math.min(6.0, Math.max(1.5, pts));
    const scoreOver6 = Math.round(rawScore * 2) / 2;

    const tips = [];
    if (wordCount < 140) tips.push(`Allonge ton texte (${wordCount}/180 mots visés au Certificat) en développant un exemple concret par argument.`);
    if (foundConnectors.length < 3) tips.push('Ajoute davantage de connecteurs logiques (*En effet*, *De plus*, *Par conséquent*).');
    if (!hasConcession) tips.push('Intègre un paragraphe de concession/réfutation (*Certes..., toutefois...*) très valorisé par les experts DGEO.');
    if (!hasConclusion) tips.push('Termine par un paragraphe de conclusion clair (*En conclusion...* + phrase d’ouverture).');
    if (tips.length === 0) tips.push('Très belle maîtrise structurelle ! Relis attentivement les accords des participes passés et la ponctuation.');

    return {
      promptTitle,
      wordCount,
      scoreOver6,
      foundConnectors,
      hasConcession,
      hasExample,
      hasIntroQuestion,
      hasConclusion,
      tips
    };
  }
}
