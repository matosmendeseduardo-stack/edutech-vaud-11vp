/* ==========================================================================
   Vaud 11e VP Curriculum Database (Aligned with PER & DGEO Vaud)
   Version: 1.2.1
   Includes:
   - 6 Complete Français 11e VP Chapters + Official PER Theory Sheets
   - Allemand 11e VP Option/Placeholder
   - Procedural PER Exercise Generator (Infinite Combinatorial Engine)
   ========================================================================== */

window.APP_VERSION = 'v1.3.0';

window.VAUD_QUEST_STATIONS = [
  { id: 'nyon', city: 'Nyon', topic: 'Fonctions PER', xpRequired: 0 },
  { id: 'morges', city: 'Morges', topic: 'Subordonnées', xpRequired: 150 },
  { id: 'lausanne', city: 'Lausanne', topic: 'Discours & Temps', xpRequired: 300 },
  { id: 'vevey', city: 'Vevey', topic: 'Figures de style', xpRequired: 450 },
  { id: 'montreux', city: 'Montreux (Certificat)', topic: 'Texte Argumentatif', xpRequired: 600 }
];

window.CURRICULUM_DATA = {
  francais: {
    id: 'francais',
    name: 'Français 11e VP',
    perCode: 'PER L1 31-38 (DGEO Vaud)',
    examInfo: 'Certificat de fin d’études secondaires (Écrit : texte argumentatif + compréhension / Oral : analyse littéraire)',
    modules: [
      {
        id: 'subordonnees',
        title: '1. Propositions Subordonnées (Relatives, Complétives, Circonstancielles)',
        perRef: 'PER L1 36 — La phrase complexe',
        icon: '🧩',
        station: 'Morges',
        description: 'Identifier la nature et la fonction des propositions subordonnées selon la grammaire officielle vaudoise.',
        mastery: 75,
        theorySheet: {
          title: 'Aide-Mémoire PER : Les 3 grandes familles de subordonnées',
          points: [
            '<strong>1. Subordonnée relative</strong> : Introduite par un pronom relatif (<em>qui, que, quoi, dont, où, lequel</em>). Elle complète un nom (l’<strong>antécédent</strong>). Fonction PER : <strong>Modificateur du nom</strong> (ou complément du nom).',
            '<strong>2. Subordonnée complétive</strong> : Introduite par la conjonction <em>que</em> (ou un mot interrogatif dans l’interrogative indirecte). Elle complète un <strong>verbe</strong> (ex: <em>Je pense qu’il viendra</em>). Fonction PER : le plus souvent <strong>Complément direct du verbe (CDV)</strong>.',
            '<strong>3. Subordonnée circonstancielle</strong> : Introduite par <em>parce que, bien que, afin que, lorsque, si...</em> Elle est déplaçable et supprimable. Fonction PER : <strong>Complément de phrase (CP)</strong>.',
            '⚠️ <strong>Piège fréquent au Certificat</strong> : Ne confonds jamais « <em>que</em> » pronom relatif (précédé d’un nom : <em>Le film <u>que</u> je vois</em>) et « <em>que</em> » conjonction de subordination (précédé d’un verbe : <em>Je sais <u>que</u> tu viens</em>) !'
          ]
        },
        questions: [
          {
            id: 'sub-1',
            type: 'mcq',
            prompt: 'Quelle est la nature et la fonction de la proposition subordonnée encadrée ?',
            sentence: 'Les élèves révisent sérieusement <mark>afin que leurs résultats au certificat soient excellents</mark>.',
            options: [
              'Subordonnée relative déterminative — Modificateur du nom',
              'Subordonnée complétive conjonctive — CDV',
              'Subordonnée circonstancielle de but — Complément de phrase (CP)',
              'Subordonnée circonstancielle de conséquence — CP'
            ],
            correctIndex: 2,
            perRule: 'Dans la terminologie du PER (Vaud), une subordonnée introduite par « afin que + subjonctif » exprime le but et occupe la fonction syntaxique de Complément de phrase (CP).'
          },
          {
            id: 'sub-2',
            type: 'mcq',
            prompt: 'Identifiez la nature et la fonction de la subordonnée encadrée :',
            sentence: 'Le professeur de français affirme <mark>que l’introduction comporte trois étapes essentielles</mark>.',
            options: [
              'Subordonnée complétive — Complément direct du verbe (CDV)',
              'Subordonnée relative — Modificateur du nom',
              'Subordonnée circonstancielle de cause — Complément de phrase (CP)',
              'Subordonnée interrogative indirecte — Sujet'
            ],
            correctIndex: 0,
            perRule: 'Elle est introduite par la conjonction « que » après un verbe de déclaration (« affirme »). Elle n’est ni déplaçable ni supprimable : c’est une subordonnée complétive qui occupe la fonction de CDV.'
          },
          {
            id: 'sub-3',
            type: 'surgery',
            prompt: 'CHIRURGIE DE LA PHRASE : Cliquez sur le segment qui est une subordonnée circonstancielle (fonction : Complément de phrase) :',
            tokens: [
              'Bien qu’il pleuve sur le Lavaux,',
              'les gymnasiens',
              'préparent',
              'leur examen oral de littérature.'
            ],
            correctTokenIndex: 0,
            perRule: '« Bien qu’il pleuve sur le Lavaux » est une subordonnée circonstancielle d’opposition (concession). Elle est déplaçable et supprimable : sa fonction dans le PER est Complément de phrase (CP).'
          },
          {
            id: 'sub-4',
            type: 'mcq',
            prompt: 'Quelle est la nature exacte du mot « que » dans la phrase suivante ?',
            sentence: 'Le roman de Ramuz <mark>que</mark> nous avons étudié en classe se déroule dans les Alpes vaudoises.',
            options: [
              'Conjonction de subordination',
              'Pronom relatif (antécédent : « Le roman de Ramuz »)',
              'Adverbe d’intensité',
              'Pronom interrogatif'
            ],
            correctIndex: 1,
            perRule: 'Astuce Examen Vaud : Si « que » suit un groupe nominal (l’antécédent) et peut être remplacé par « lequel », c’est un pronom relatif qui introduit une subordonnée relative (fonction CDV à l’intérieur de la subordonnée).'
          },
          {
            id: 'sub-5',
            type: 'mcq',
            prompt: 'Quelle est la nature de la subordonnée encadrée ?',
            sentence: 'Je me demande <mark>si le train pour Lausanne aura du retard</mark>.',
            options: [
              'Subordonnée circonstancielle d’hypothèse (CP)',
              'Subordonnée complétive interrogative indirecte (CDV)',
              'Subordonnée relative explicative',
              'Subordonnée participiale'
            ],
            correctIndex: 1,
            perRule: 'Attention au piège ! Après un verbe de questionnement (« se demander », « ignorer »), « si » n’introduit PAS une hypothèse, mais une subordonnée complétive interrogative indirecte (fonction CDV).'
          }
        ]
      },
      {
        id: 'fonctions',
        title: '2. Fonctions Syntaxiques PER (CP, CDV, CIV, Attribut, Modificateur)',
        perRef: 'PER L1 36 — Analyse syntaxique officielle',
        icon: '📐',
        station: 'Nyon',
        description: 'Maîtriser la terminologie grammaticale romande : distinguer Complément de phrase (CP) et Compléments de verbe (CDV/CIV).',
        mastery: 80,
        theorySheet: {
          title: 'Aide-Mémoire PER : Les fonctions dans la phrase',
          points: [
            '<strong>Complément de phrase (CP)</strong> : Remplace l’ancien « complément circonstanciel ». Il est <strong>déplaçable</strong> en tête de phrase et <strong>supprimable</strong>.',
            '<strong>Complément direct du verbe (CDV)</strong> : Essentiel au groupe verbal, construit sans préposition, pronominalisable par <em>le, la, les, cela</em>.',
            '<strong>Complément indirect du verbe (CIV)</strong> : Essentiel au verbe, introduit par une préposition (<em>à, de...</em>), pronominalisable par <em>lui, leur, y, en</em>.',
            '<strong>Attribut du sujet</strong> : Placé après un verbe d’état (<em>être, sembler, devenir, paraître, rester</em>). Ne jamais le confondre avec un CDV !',
            '<strong>Modificateur du nom</strong> : Fonction occupée par un adjectif, un GPrép ou une subordonnée relative à l’intérieur d’un groupe nominal.'
          ]
        },
        questions: [
          {
            id: 'fn-1',
            type: 'mcq',
            prompt: 'Quelle est la fonction syntaxique (selon le PER) du groupe encadré ?',
            sentence: 'Ce roman historique paraît <mark>passionnant dès le premier chapitre</mark>.',
            options: [
              'Complément direct du verbe (CDV)',
              'Attribut du sujet « Ce roman historique »',
              'Complément de phrase (CP)',
              'Modificateur du verbe'
            ],
            correctIndex: 1,
            perRule: 'Le verbe « paraître » est un verbe d’état (attributif). Le groupe qui le suit caractérise le sujet et ne peut pas être supprimé : c’est un Attribut du sujet.'
          },
          {
            id: 'fn-2',
            type: 'surgery',
            prompt: 'CHIRURGIE DES FONCTIONS : Cliquez sur le groupe qui occupe la fonction de Complément indirect du verbe (CIV) :',
            tokens: [
              'Chaque soir,',
              'cette élève sérieuse',
              'se souvient',
              'de ses règles de grammaire.'
            ],
            correctTokenIndex: 3,
            perRule: '« de ses règles de grammaire » complète le verbe pronominal « se souvenir de » (pronominalisable par « Elle s’en souvient »). C’est un Complément indirect du verbe (CIV).'
          },
          {
            id: 'fn-3',
            type: 'mcq',
            prompt: 'Pourquoi le groupe encadré est-il un Complément de verbe (CIV) et NON un Complément de phrase (CP) ?',
            sentence: 'Les candidats se rendent <mark>à la salle d’examen</mark>.',
            options: [
              'Parce qu’il indique un lieu',
              'Parce qu’il est obligatoire après le verbe « se rendre » (non supprimable et non déplaçable)',
              'Parce qu’il contient un nom féminin',
              'Parce qu’il est placé en fin de phrase'
            ],
            correctIndex: 1,
            perRule: 'Même s’il indique un lieu, on ne peut pas dire « *À la salle d’examen, les candidats se rendent » ni « *Les candidats se rendent ». Il fait partie du prédicat : c’est un complément du verbe !'
          }
        ]
      },
      {
        id: 'discours',
        title: '3. Discours Rapporté & Énonciation (Direct, Indirect, Indirect Libre)',
        perRef: 'PER L1 36 — Énonciation et modalisation',
        icon: '💬',
        station: 'Lausanne',
        description: 'Transposer un énoncé du discours direct au discours indirect en respectant la concordance des temps et les repères spatio-temporels.',
        mastery: 68,
        theorySheet: {
          title: 'Aide-Mémoire PER : Transposer au Discours Indirect',
          points: [
            '<strong>1. Suppression de la ponctuation</strong> : On enlève les guillemets et les deux-points, et on introduit une subordonnée complétive (<em>que, si, ce que</em>) ou un infinitif (pour l’impératif : <em>« Viens ! » → Il lui ordonne de venir</em>).',
            '<strong>2. Concordance des temps (si le verbe introducteur est au passé)</strong> : Présent → <strong>Imparfait</strong> | Passé composé → <strong>Plus-que-parfait</strong> | Futur simple → <strong>Conditionnel présent</strong> (futur dans le passé).',
            '<strong>3. Repères spatio-temporels</strong> : <em>aujourd’hui → ce jour-là</em> | <em>hier → la veille</em> | <em>demain → le lendemain</em> | <em>ici → là / à cet endroit</em>.'
          ]
        },
        questions: [
          {
            id: 'disc-1',
            type: 'mcq',
            prompt: 'Transposez correctement cette phrase au discours indirect :',
            sentence: 'Julie annonça : <mark>« Je partirai demain pour Genève. »</mark>',
            options: [
              'Julie annonça qu’elle partira demain pour Genève.',
              'Julie annonça qu’elle partirait le lendemain pour Genève.',
              'Julie annonça qu’elle était partie la veille pour Genève.',
              'Julie annonça : qu’elle partirait demain pour Genève.'
            ],
            correctIndex: 1,
            perRule: 'Le verbe introducteur (« annonça ») étant au passé, le futur simple (« partirai ») devient du conditionnel présent à valeur de futur dans le passé (« partirait »), et « demain » devient « le lendemain ».'
          },
          {
            id: 'disc-2',
            type: 'mcq',
            prompt: 'Quel type de discours rapporté est utilisé dans la phrase encadrée ?',
            sentence: 'Paul regarda sa montre avec angoisse. <mark>Était-il déjà trop tard pour rattraper le train ?</mark>',
            options: [
              'Discours direct',
              'Discours indirect',
              'Discours indirect libre',
              'Discours narrativisé'
            ],
            correctIndex: 2,
            perRule: 'Le discours indirect libre conserve la ponctuation expressive (point d’interrogation) du discours direct, mais utilise la 3e personne (« il ») et la concordance des temps (« Était-il ») du discours indirect, sans verbe introducteur.'
          }
        ]
      },
      {
        id: 'conjugaison',
        title: '4. Conjugaison & Valeurs des Temps (Récit et Discours)',
        perRef: 'PER L1 36 — Système verbal',
        icon: '⏳',
        station: 'Lausanne',
        description: 'Justifier l’emploi de l’imparfait, du passé simple, du présent, du conditionnel et du subjonctif lors des analyses de textes.',
        mastery: 62,
        theorySheet: {
          title: 'Aide-Mémoire PER : Les valeurs des temps à connaître par cœur',
          points: [
            '<strong>Valeurs du Présent</strong> : Présent d’énonciation (moment où l’on parle), Présent de vérité générale (proverbes, faits scientifiques), Présent de narration (rend un récit passé plus vivant).',
            '<strong>Imparfait vs Passé simple</strong> : L’imparfait sert à l’<strong>arrière-plan</strong> (description, habitude, action non bornée) ; le passé simple exprime le <strong>premier plan</strong> (action soudaine, bornée et achevée).',
            '<strong>Valeurs du Conditionnel</strong> : Potentiel/Irréel (après <em>si + imparfait</em>), Information incertaine (journalistique), Politesse/Atténuation, ou Futur dans le passé.'
          ]
        },
        questions: [
          {
            id: 'conj-1',
            type: 'mcq',
            prompt: 'Quelle est la valeur précise du temps employé pour le verbe encadré ?',
            sentence: 'La neige recouvrait les vignes en terrasses lorsque, soudain, un cri <mark>retentit</mark> dans la nuit.',
            options: [
              'Imparfait d’arrière-plan (description)',
              'Passé simple de premier plan (action soudaine et bornée)',
              'Présent de narration',
              'Passé composé d’antériorité'
            ],
            correctIndex: 1,
            perRule: 'Dans un récit au passé, l’imparfait (« recouvrait ») plante le décor (arrière-plan), tandis que le passé simple (« retentit ») exprime une action soudaine de premier plan qui fait avancer l’intrigue.'
          },
          {
            id: 'conj-2',
            type: 'mcq',
            prompt: 'Quelle est la valeur du conditionnel présent dans cette phrase issue d’un article de presse ?',
            sentence: 'Selon plusieurs témoins, le loup <mark>aurait été aperçu</mark> près du col du Marchairuz.',
            options: [
              'Un souhait ou un rêve',
              'Une information non confirmée (conditionnel d’incertitude / journalistique)',
              'Un futur dans le passé',
              'Une politesse atténuée'
            ],
            correctIndex: 1,
            perRule: 'C’est un indice de modalisation essentiel en 11e VP : le conditionnel permet au locuteur de mettre une information à distance lorsqu’elle n’est pas encore prouvée.'
          },
          {
            id: 'conj-3',
            type: 'surgery',
            prompt: 'CHIRURGIE DU VERBE : Cliquez sur le segment contenant un verbe conjugué au subjonctif présent :',
            tokens: [
              'Bien que les examens approchent,',
              'il est indispensable',
              'que vous sachiez',
              'structurer vos arguments.'
            ],
            correctTokenIndex: 2,
            perRule: '« que vous sachiez » est le verbe savoir au subjonctif présent, exigé après la tournure impersonnelle d’obligation « il est indispensable que ».'
          }
        ]
      },
      {
        id: 'figures',
        title: '5. Figures de Style & Analyse Littéraire (Écrit & Oral)',
        perRef: 'PER L1 31-35 — Lire et analyser des textes',
        icon: '🎭',
        station: 'Vevey',
        description: 'Repérer et interpréter les figures d’analogie, d’opposition, d’insistance et d’amplification pour l’écrit et l’oral.',
        mastery: 85,
        theorySheet: {
          title: 'Aide-Mémoire PER : Les figures de style incontournables en 11e VP',
          points: [
            '<strong>Analogie</strong> : <strong>Comparaison</strong> (avec outil : <em>comme, tel</em>), <strong>Métaphore</strong> (sans outil), <strong>Personnification</strong> (traits humains donnés à un objet/animal).',
            '<strong>Opposition</strong> : <strong>Oxymore</strong> (2 mots opposés côte à côte dans le même groupe : <em>obscure clarté</em>), <strong>Antithèse</strong> (2 termes opposés à distance dans la phrase), <strong>Antiphrase</strong> (dire le contraire de ce que l’on pense = ironie).',
            '<strong>Amplification / Atténuation</strong> : <strong>Hyperbole</strong> (exagération), <strong>Litote</strong> (dire moins pour suggérer plus : <em>« Je ne te hais point »</em>), <strong>Euphémisme</strong> (adoucir une réalité brutale : <em>« Il nous a quittés »</em>).'
          ]
        },
        questions: [
          {
            id: 'fig-1',
            type: 'mcq',
            prompt: 'Quelle figure de style est employée dans ce célèbre extrait poétique ?',
            sentence: '« Cette <mark>obscure clarté</mark> qui tombe des étoiles » (Corneille)',
            options: [
              'Un oxymore',
              'Une antithèse',
              'Un chiasme',
              'Une litote'
            ],
            correctIndex: 0,
            perRule: 'L’oxymore réunit directement à l’intérieur d’un même groupe nominal deux termes de sens contradictoire (« obscure » + « clarté »), alors que l’antithèse les oppose à distance dans la phrase.'
          },
          {
            id: 'fig-2',
            type: 'mcq',
            prompt: 'Identifiez la figure de style dominante dans cet extrait :',
            sentence: '« Le lac Léman était <mark>un miroir d’argent</mark> sous la lune d’hiver. »',
            options: [
              'Une comparaison',
              'Une métaphore',
              'Une métonymie',
              'Une hyperbole'
            ],
            correctIndex: 1,
            perRule: 'Il y a rapprochement entre le comparé (« Le lac Léman ») et le comparant (« un miroir d’argent ») SANS outil de comparaison (comme, tel que, pareil à). C’est donc une métaphore.'
          },
          {
            id: 'fig-3',
            type: 'surgery',
            prompt: 'CHIRURGIE LITTÉRAIRE : Cliquez sur le segment qui contient une personnification :',
            tokens: [
              'Au sommet des Diablerets,',
              'la montagne',
              'grondait de colère et retenait son souffle',
              'avant l’avalanche.'
            ],
            correctTokenIndex: 2,
            perRule: 'Attribuer des comportements ou sentiments humains (« grondait de colère et retenait son souffle ») à un élément inanimé (la montagne) constitue une personnification.'
          },
          {
            id: 'fig-4',
            type: 'mcq',
            prompt: 'Comment appelle-t-on la répétition d’un même mot ou groupe de mots en début de phrase ou de vers ?',
            sentence: '<mark>Paris</mark> outragé ! <mark>Paris</mark> brisé ! <mark>Paris</mark> martyrisé ! mais <mark>Paris</mark> libéré !',
            options: [
              'Une anaphore',
              'Une accumulation',
              'Un parallélisme',
              'Une allitération'
            ],
            correctIndex: 0,
            perRule: 'L’anaphore est une figure d’insistance très fréquente dans les textes argumentatifs et poétiques : elle répète le même terme en tête de vers ou de propositions successives.'
          }
        ]
      },
      {
        id: 'argumentation',
        title: '6. Atelier Texte Argumentatif (Spécial Certificat)',
        perRef: 'PER L1 32 — Produire un texte argumentatif',
        icon: '✍️',
        station: 'Montreux (Certificat)',
        description: 'Maîtriser le sujet amené/posé/divisé, les connecteurs logiques, la thèse, la concession et la réfutation.',
        mastery: 70,
        theorySheet: {
          title: 'Aide-Mémoire PER : Réussir l’épreuve écrite du texte argumentatif',
          points: [
            '<strong>Introduction en 3 étapes</strong> : 1. <em>Sujet amené</em> (constat général/actualité) → 2. <em>Sujet posé</em> (problématique / question) → 3. <em>Sujet divisé</em> (annonce du plan).',
            '<strong>Structure d’un paragraphe argumentatif</strong> : Connecteur logique + Argument (idée abstraite) + Explication + Exemple concret introduit par <em>ainsi, par exemple, comme en témoigne...</em>',
            '<strong>La concession / réfutation</strong> : Accorder un point à l’adversaire avec <em>Certes, il est vrai que, bien que...</em> puis réfuter avec <em>cependant, néanmoins, toutefois...</em>'
          ]
        },
        questions: [
          {
            id: 'arg-1',
            type: 'mcq',
            prompt: 'Dans l’introduction d’un texte argumentatif en 11e VP, quelles sont les 3 étapes dans l’ordre ?',
            sentence: 'Structure canonique de l’introduction exigée au Certificat vaudois :',
            options: [
              'Thèse → Exemple → Conclusion',
              'Sujet amené → Sujet posé (problématique) → Sujet divisé (annonce du plan)',
              'Citation → Biographie de l’auteur → Résumé',
              'Opinion personnelle → Contre-argument → Synthèse'
            ],
            correctIndex: 1,
            perRule: 'L’introduction commence toujours par contextualiser le thème (sujet amené), formule clairement la question/thèse (sujet posé), puis annonce les grandes parties du développement (sujet divisé).'
          },
          {
            id: 'arg-2',
            type: 'mcq',
            prompt: 'Quel rapport logique exprime le connecteur « Néanmoins » au début d’un paragraphe ?',
            sentence: 'Le numérique facilite l’accès au savoir. <mark>Néanmoins</mark>, il peut réduire la capacité de concentration.',
            options: [
              'La cause (justification)',
              'La conséquence (résultat)',
              'L’opposition / la concession (introduction de la réfutation ou nuance)',
              'L’addition d’un exemple'
            ],
            correctIndex: 2,
            perRule: '« Néanmoins », « toutefois », « cependant » et « en revanche » sont des connecteurs logiques d’opposition idéaux pour passer de la concession à votre thèse.'
          }
        ]
      },
      {
        id: 'orthographe',
        title: '7. Orthographe & Accord du Participe Passé (Être, Avoir, Pronominaux)',
        perRef: 'PER L1 37 — Orthographe grammaticale',
        icon: '✒️',
        station: 'Montreux (Certificat)',
        description: 'Maîtriser l’accord du participe passé avec être, avoir (CDV antéposé) et les verbes pronominaux pour éviter toute perte de points à l’écrit.',
        mastery: 66,
        theorySheet: {
          title: 'Aide-Mémoire PER : Les 3 règles d’or du Participe Passé',
          points: [
            '<strong>1. Auxiliaire ÊTRE</strong> : Le participe passé s’accorde toujours en genre et en nombre avec le <strong>sujet</strong> (ex: <em>Elles sont parties</em>).',
            '<strong>2. Auxiliaire AVOIR</strong> : Il ne s’accorde JAMAIS avec le sujet. Il s’accorde uniquement avec le <strong>Complément direct du verbe (CDV)</strong> si celui-ci est placé <strong>AVANT</strong> le verbe (ex: <em>Les lettres qu’il a écrites</em>). Avec « en », il reste invariable.',
            '<strong>3. Verbes pronominaux</strong> : S’accordent avec le sujet si le verbe est essentiellement pronominal (<em>Elles se sont enfuies</em>), ou avec le CDV placé avant (<em>Elles se sont lavées</em> vs <em>Elles se sont lavé les mains</em> ; et <em>Elles se sont téléphoné</em> = CIV → invariable !).'
          ]
        },
        questions: [
          {
            id: 'orth-1',
            type: 'mcq',
            prompt: 'Choisissez la forme correctement accordée du participe passé :',
            sentence: 'Les nouvelles que nous avons <mark>...</mark> hier soir nous ont rassurés.',
            options: [
              'reçu (invariable)',
              'reçus (masculin pluriel)',
              'reçues (féminin pluriel)',
              'reçue (féminin singulier)'
            ],
            correctIndex: 2,
            perRule: 'Avec l’auxiliaire « avoir », le participe passé s’accorde avec le CDV s’il est placé avant le verbe. Ici, le CDV est le pronom relatif « que », qui a pour antécédent « Les nouvelles » (féminin pluriel) → « reçues ».'
          },
          {
            id: 'orth-2',
            type: 'mcq',
            prompt: 'Pourquoi le participe passé est-il invariable dans cette phrase ?',
            sentence: 'Les deux amies se sont <mark>succédé</mark> à la tribune.',
            options: [
              'Parce que le sujet est au pluriel',
              'Parce que « se » est un Complément indirect du verbe (CIV : succéder À quelqu’un)',
              'Parce que le verbe est au présent',
              'Parce que l’auxiliaire est avoir'
            ],
            correctIndex: 1,
            perRule: 'Classique du Certificat vaudois ! On dit « succéder À quelqu’un » (comme « se téléphoner », « se sourire », « se plaire »). Le pronom « se » est donc un CIV et non un CDV : le participe passé reste strictement invariable !'
          },
          {
            id: 'orth-3',
            type: 'surgery',
            prompt: 'CHIRURGIE ORTHOGRAPHIQUE : Cliquez sur le segment qui contient une faute d’accord du participe passé :',
            tokens: [
              'Après la randonnée,',
              'les élèves',
              'se sont lavés les mains',
              'à la fontaine du village.'
            ],
            correctTokenIndex: 2,
            perRule: 'Il faut écrire « se sont lavé les mains » (sans -s) ! En effet, le CDV (« les mains ») est placé APRÈS le verbe, et « se » est un CIV (laver les mains À soi-même).'
          }
        ]
      }
    ]
  },
  allemand: {
    id: 'allemand',
    name: 'Allemand 11e VP (Option / Aperçu)',
    isPlaceholder: true,
    perCode: 'PER L2 31-36',
    examInfo: 'Module en construction (Aperçu disponible) — Nebensätze (weil, dass, obwohl), Perfekt & Präteritum',
    modules: [
      {
        id: 'nebensaetze',
        title: 'Nebensätze & Wortstellung (Aperçu)',
        perRef: 'L2 36 — Grammatik & Satzbau',
        icon: '🇩🇪',
        station: 'Lausanne',
        description: 'Module d’aperçu : Maîtriser le rejet du verbe conjugué en fin de subordonnée avec weil, dass, obwohl et wenn.',
        mastery: 45,
        theorySheet: {
          title: 'Merkblatt PER L2 : Hauptsatz (V2) vs. Nebensatz (Verb am Ende)',
          points: [
            '<strong>Dans la proposition principale (Hauptsatz)</strong> : Le verbe conjugué est toujours en <strong>position 2</strong>.',
            '<strong>Dans la subordonnée (Nebensatz)</strong> : Après <em>weil, dass, obwohl, wenn, als</em>, le verbe conjugué est rejeté à la <strong>toute fin</strong>.',
            '<strong>Nebensatz en tête de phrase</strong> : Formule magique <strong>Verb, Verb</strong> autour de la virgule (ex: <em>Obwohl es <u>regnet</u>, <u>gehen</u> wir spazieren</em>).'
          ]
        },
        questions: [
          {
            id: 'de-1',
            type: 'mcq',
            prompt: 'Choisissez la proposition subordonnée correctement construite en allemand :',
            sentence: 'Ich lerne jeden Tag Französisch und Deutsch, <mark>...</mark>',
            options: [
              'weil ich will ins Gymnasium gehen.',
              'weil ich ins Gymnasium gehen will.',
              'weil will ich ins Gymnasium gehen.',
              'dass ich gehen will ins Gymnasium.'
            ],
            correctIndex: 1,
            perRule: 'Après la conjonction de subordination « weil », le verbe conjugué (« will ») est obligatoirement rejeté à la toute fin de la proposition subordonnée.'
          },
          {
            id: 'de-2',
            type: 'surgery',
            prompt: 'SATZ-CHIRURGIE : Cliquez sur le segment où le verbe conjugué est bien placé en position 2 (V2) après une subordonnée en tête :',
            tokens: [
              'Obwohl das Wetter heute kalt ist,',
              'fahren wir',
              'mit dem Zug',
              'nach Montreux.'
            ],
            correctTokenIndex: 1,
            perRule: 'Quand la phrase commence par une subordonnée (« Obwohl ... ist, »), celle-ci occupe la position 1. Le verbe de la principale (« fahren ») vient donc immédiatement après la virgule (« fahren wir ») !'
          }
        ]
      }
    ]
  }
};

window.INITIAL_LEADERBOARD = [
  { name: 'Chloé M. (Collège de Béthusy)', xp: 540, streak: 9, avatar: '🦊', isMe: false },
  { name: 'Toi (Élève 11e VP)', xp: 340, streak: 5, avatar: '⚡', isMe: true },
  { name: 'Léo R. (Établissement de Nyon)', xp: 310, streak: 4, avatar: '🏔️', isMe: false },
  { name: 'Inès K. (Morges Beausobre)', xp: 275, streak: 6, avatar: '📚', isMe: false }
];

/* ==========================================================================
   Procedural PER Exercise Generator (Infinite Combinatorial Exercise Engine)
   ========================================================================== */
window.PERExerciseGenerator = {
  counter: 100,

  generateForModule(moduleId) {
    this.counter += 1;
    const id = `gen-${moduleId}-${this.counter}`;

    if (moduleId === 'subordonnees') {
      const templates = [
        {
          clause: 'bien que le vent souffle fort sur le Léman',
          main: 'Les voiliers quittent le port d’Ouchy',
          nature: 'Subordonnée circonstancielle d’opposition (concession) — fonction CP',
          distractors: [
            'Subordonnée relative déterminative — fonction Modificateur',
            'Subordonnée complétive conjonctive — fonction CDV',
            'Subordonnée circonstancielle de cause — fonction CP'
          ],
          rule: 'Introduite par « bien que + subjonctif », cette subordonnée exprime la concession/opposition et occupe la fonction de Complément de phrase (CP).'
        },
        {
          clause: 'parce que les épreuves écrites approchent à grands pas',
          main: 'Toute la classe de 11e VP révise la syntaxe',
          nature: 'Subordonnée circonstancielle de cause — fonction CP',
          distractors: [
            'Subordonnée circonstancielle de conséquence — fonction CP',
            'Subordonnée complétive — fonction Sujet',
            'Subordonnée relative — fonction Attribut'
          ],
          rule: 'Introduite par « parce que », elle indique le motif de l’action et peut être déplacée : c’est une subordonnée circonstancielle de cause (fonction CP).'
        },
        {
          clause: 'que la lecture régulière enrichit le vocabulaire',
          main: 'Tous les enseignants vaudois constatent',
          nature: 'Subordonnée complétive conjonctive — fonction CDV',
          distractors: [
            'Subordonnée relative — fonction Modificateur du nom',
            'Subordonnée circonstancielle de but — fonction CP',
            'Subordonnée circonstancielle de temps — fonction CP'
          ],
          rule: 'Placée après le verbe « constatent », elle est essentielle et non déplaçable : c’est une subordonnée complétive qui occupe la fonction de Complément direct du verbe (CDV).'
        },
        {
          clause: 'qui surplombe le château de Chillon',
          main: 'La cime enneigée',
          tail: 'attire le regard des voyageurs.',
          nature: 'Subordonnée relative — fonction Modificateur du nom',
          distractors: [
            'Subordonnée complétive — fonction CDV',
            'Subordonnée circonstancielle de lieu — fonction CP',
            'Subordonnée interrogative indirecte — fonction CDV'
          ],
          rule: 'Introduite par le pronom relatif « qui », elle complète l’antécédent nominal « La cime enneigée » : sa fonction dans le PER est Modificateur du nom.'
        }
      ];
      const pick = templates[Math.floor(Math.random() * templates.length)];
      const shuffled = [pick.nature, ...pick.distractors].sort(() => Math.random() - 0.5);
      const sentence = pick.tail
        ? `${pick.main} <mark>${pick.clause}</mark> ${pick.tail}`
        : `${pick.main}, <mark>${pick.clause}</mark>.`;

      return {
        id,
        type: 'mcq',
        isGenerated: true,
        prompt: '⚡ [Exercice Généré] Quelle est la nature et la fonction PER de la proposition encadrée ?',
        sentence,
        options: shuffled,
        correctIndex: shuffled.indexOf(pick.nature),
        perRule: pick.rule
      };
    }

    if (moduleId === 'fonctions') {
      const items = [
        {
          sentence: '<mark>Dans la bibliothèque cantonale</mark>, les élèves travaillent en silence.',
          answer: 'Complément de phrase (CP) — déplaçable et supprimable',
          others: [
            'Complément direct du verbe (CDV)',
            'Attribut du sujet',
            'Modificateur du nom'
          ],
          rule: 'Ce groupe prépositionnel est placé en tête de phrase et peut être déplacé ou supprimé sans rendre la phrase agrammaticale : c’est un Complément de phrase (CP).'
        },
        {
          sentence: 'Cette explication grammaticale demeure <mark>très claire pour toute la classe</mark>.',
          answer: 'Attribut du sujet « Cette explication grammaticale »',
          others: [
            'Complément direct du verbe (CDV)',
            'Complément de phrase (CP)',
            'Complément indirect du verbe (CIV)'
          ],
          rule: 'Après le verbe d’état « demeurer », le groupe adjectival caractérise le sujet : c’est un Attribut du sujet.'
        }
      ];
      const pick = items[Math.floor(Math.random() * items.length)];
      const shuffled = [pick.answer, ...pick.others].sort(() => Math.random() - 0.5);
      return {
        id,
        type: 'mcq',
        isGenerated: true,
        prompt: '⚡ [Exercice Généré] Identifiez la fonction syntaxique PER du groupe encadré :',
        sentence: pick.sentence,
        options: shuffled,
        correctIndex: shuffled.indexOf(pick.answer),
        perRule: pick.rule
      };
    }

    if (moduleId === 'discours') {
      const items = [
        {
          sentence: 'Le professeur demanda aux élèves : <mark>« Avez-vous compris cette règle ? »</mark>',
          answer: 'Le professeur demanda aux élèves s’ils avaient compris cette règle.',
          others: [
            'Le professeur demanda aux élèves qu’ils avaient compris cette règle.',
            'Le professeur demanda aux élèves si avaient-ils compris cette règle.',
            'Le professeur demanda aux élèves s’ils ont compris cette règle.'
          ],
          rule: 'Une interrogation totale (oui/non) devient une subordonnée interrogative indirecte introduite par « si », sans inversion du sujet, et le passé composé passe au plus-que-parfait (« avaient compris »).'
        }
      ];
      const pick = items[0];
      const shuffled = [pick.answer, ...pick.others].sort(() => Math.random() - 0.5);
      return {
        id,
        type: 'mcq',
        isGenerated: true,
        prompt: '⚡ [Exercice Généré] Choisissez la transposition correcte au discours indirect :',
        sentence: pick.sentence,
        options: shuffled,
        correctIndex: shuffled.indexOf(pick.answer),
        perRule: pick.rule
      };
    }

    if (moduleId === 'figures') {
      const items = [
        {
          sentence: '« Je meurs de soif <mark>auprès de la fontaine</mark>. » (Villon)',
          answer: 'Une antithèse',
          others: ['Une métaphore', 'Une anaphore', 'Un euphémisme'],
          rule: 'Deux réalités opposées (« meurs de soif » et « fontaine ») sont mises en contraste dans le même énoncé.'
        },
        {
          sentence: '« Cet élève a versé <mark>des torrents de larmes</mark> en lisant ce poème. »',
          answer: 'Une hyperbole',
          others: ['Une litote', 'Un oxymore', 'Une métonymie'],
          rule: 'L’expression « des torrents de larmes » exagère fortement la réalité pour frapper l’esprit : c’est une hyperbole.'
        },
        {
          sentence: '« Toute la ville de <mark>Lausanne</mark> applaudissait le spectacle. »',
          answer: 'Une métonymie',
          others: ['Une comparaison', 'Un chiasme', 'Une antiphrase'],
          rule: 'On désigne les habitants par le nom du lieu (« Lausanne ») : c’est une métonymie (le contenant pour le contenu).'
        }
      ];
      const pick = items[Math.floor(Math.random() * items.length)];
      const shuffled = [pick.answer, ...pick.others].sort(() => Math.random() - 0.5);
      return {
        id,
        type: 'mcq',
        isGenerated: true,
        prompt: '⚡ [Exercice Généré] Identifiez la figure de style mise en évidence :',
        sentence: pick.sentence,
        options: shuffled,
        correctIndex: shuffled.indexOf(pick.answer),
        perRule: pick.rule
      };
    }

    if (moduleId === 'conjugaison') {
      const items = [
        {
          sentence: '« La Terre <mark>tourne</mark> autour du Soleil. »',
          answer: 'Présent de vérité générale (gnomique)',
          others: ['Présent d’énonciation', 'Présent de narration', 'Futur proche'],
          rule: 'Ce présent exprime un fait scientifique ou un proverbe valable de tout temps : c’est le présent de vérité générale.'
        },
        {
          sentence: '« Tous les étés, nous <mark>nagions</mark> dans le lac à Vidy. »',
          answer: 'Imparfait d’habitude (itératif)',
          others: ['Passé simple de premier plan', 'Imparfait de politesse', 'Conditionnel passé'],
          rule: 'Accompagné de « Tous les étés », l’imparfait exprime une action qui se répète régulièrement dans le passé (valeur d’habitude).'
        }
      ];
      const pick = items[Math.floor(Math.random() * items.length)];
      const shuffled = [pick.answer, ...pick.others].sort(() => Math.random() - 0.5);
      return {
        id,
        type: 'mcq',
        isGenerated: true,
        prompt: '⚡ [Exercice Généré] Quelle est la valeur exacte du temps employé ?',
        sentence: pick.sentence,
        options: shuffled,
        correctIndex: shuffled.indexOf(pick.answer),
        perRule: pick.rule
      };
    }

    if (moduleId === 'orthographe') {
      const items = [
        {
          sentence: 'Les pommes du Valais que j’ai <mark>...</mark> au marché sont délicieuses.',
          answer: 'achetées (féminin pluriel — CDV « que » placé avant)',
          others: [
            'acheté (invariable)',
            'achetés (masculin pluriel)',
            'achetée (féminin singulier)'
          ],
          rule: 'Avec l’auxiliaire « avoir », le participe passé s’accorde avec le CDV placé avant le verbe : ici le pronom relatif « que » reprend « Les pommes » (féminin pluriel) → « achetées ».'
        },
        {
          sentence: 'Ces deux gymnasiens se sont <mark>...</mark> pendant toute la récréation.',
          answer: 'parlé (invariable — parler À quelqu’un = CIV)',
          others: [
            'parlés (masculin pluriel)',
            'parlées (féminin pluriel)',
            'parler (infinitif)'
          ],
          rule: 'On dit « parler À quelqu’un » : le pronom réfléchi « se » occupe la fonction de Complément indirect du verbe (CIV). Le participe passé reste donc invariable (« parlé ») !'
        }
      ];
      const pick = items[Math.floor(Math.random() * items.length)];
      const shuffled = [pick.answer, ...pick.others].sort(() => Math.random() - 0.5);
      return {
        id,
        type: 'mcq',
        isGenerated: true,
        prompt: '⚡ [Exercice Généré] Choisissez l’accord exact du participe passé selon le PER :',
        sentence: pick.sentence,
        options: shuffled,
        correctIndex: shuffled.indexOf(pick.answer),
        perRule: pick.rule
      };
    }

    const items = [
      {
        sentence: 'Il a beaucoup révisé ; <mark>par conséquent</mark>, il a brillamment réussi son examen.',
        answer: 'La conséquence',
        others: ['La cause', 'L’opposition', 'L’hypothèse'],
        rule: '« Par conséquent », « c’est pourquoi » et « donc » introduisent le résultat logique d’un fait : la conséquence.'
      },
      {
        sentence: '<mark>Certes</mark>, ce roman est exigeant, mais il offre une réflexion profonde.',
        answer: 'La concession (étape préalable à la réfutation)',
        others: ['La conclusion finale', 'La comparaison littéraire', 'La narration chronologique'],
        rule: '« Certes... mais... » permet d’accorder un point à la thèse adverse (concession) avant de présenter son propre argument.'
      }
    ];
    const pick = items[Math.floor(Math.random() * items.length)];
    const shuffled = [pick.answer, ...pick.others].sort(() => Math.random() - 0.5);
    return {
      id,
      type: 'mcq',
      isGenerated: true,
      prompt: '⚡ [Exercice Généré] Quelle relation logique ce connecteur exprime-t-il ?',
      sentence: pick.sentence,
      options: shuffled,
      correctIndex: shuffled.indexOf(pick.answer),
      perRule: pick.rule
    };
  }
};
