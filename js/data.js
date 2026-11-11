/* ==========================================================================
   Vaud 11e VP Curriculum Database (Aligned with PER & DGEO Vaud)
   Version: 1.5.0
   Includes:
   - 7 Complete Français 11e VP Chapters + Dictée / Repérage de fautes PER
   - 4 Complete Allemand 11e VP Chapters (PER L2)
   - 2 Full « Examen Blanc de Certificat Vaud » Simulations
   - Combinatorial PER Exercise Generator (+200 variations)
   ========================================================================== */

window.APP_VERSION = 'v1.5.0';

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
          },
          {
            id: 'sub-6',
            type: 'mcq',
            prompt: 'Distinguez le sens de la subordonnée circonstancielle introduite par « afin que » :',
            sentence: 'L’enseignante distribue un plan détaillé <mark>afin que chaque élève puisse structurer son essai</mark>.',
            options: [
              'Subordonnée circonstancielle de conséquence (CP)',
              'Subordonnée circonstancielle de but (CP — suivie du subjonctif)',
              'Subordonnée complétive conjonctive (CDV)',
              'Subordonnée relative déterminative'
            ],
            correctIndex: 1,
            perRule: '« afin que » et « pour que » expriment toujours l’objectif visé (le but) et imposent le mode subjonctif (« puisse ») ; leur fonction globale est Complément de phrase (CP).'
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
          },
          {
            id: 'fn-4',
            type: 'mcq',
            prompt: 'Quelle est la fonction exacte du groupe prépositionnel encadré ?',
            sentence: 'La révision <mark>des subordonnées circonstancielles</mark> rassure les élèves.',
            options: [
              'Complément de phrase (CP)',
              'Modificateur du nom « La révision »',
              'Complément indirect du verbe (CIV)',
              'Attribut du sujet'
            ],
            correctIndex: 1,
            perRule: 'Ce groupe complète exclusivement le nom noyau « révision » à l’intérieur du GN sujet : selon le PER romand, sa fonction est Modificateur du nom.'
          },
          {
            id: 'fn-5',
            type: 'surgery',
            prompt: 'CHIRURGIE PER : Cliquez sur le Complément de phrase (CP) déplaçable et supprimable :',
            tokens: [
              'Chaque matin dès sept heures,',
              'les élèves motivés',
              'relisent leurs notes',
              'de français.'
            ],
            correctTokenIndex: 0,
            perRule: '« Chaque matin dès sept heures, » peut être déplacé en fin de phrase ou supprimé tout en gardant une phrase grammaticale : c’est un Complément de phrase (CP).'
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
          },
          {
            id: 'disc-3',
            type: 'mcq',
            prompt: 'Comment transpose-t-on un verbe à l’impératif au discours indirect ?',
            sentence: 'La professeure lui a conseillé : <mark>« Relis soigneusement tes participes passés ! »</mark>',
            options: [
              'La professeure lui a conseillé qu’elle relit ses participes passés.',
              'La professeure lui a conseillé de relire soigneusement ses participes passés.',
              'La professeure lui a conseillé si elle relisait ses participes passés.',
              'La professeure lui a conseillé relis tes participes passés.'
            ],
            correctIndex: 1,
            perRule: 'Pour transposer un ordre ou un conseil à l’impératif au discours indirect, on remplace l’impératif par « de + infinitif » (ou « que + subjonctif ») et on adapte les déterminants possessifs (« tes » → « ses »).'
          },
          {
            id: 'disc-4',
            type: 'surgery',
            prompt: 'CHIRURGIE DE L’ÉNONCIATION : Cliquez sur l’erreur d’indice spatio-temporel oubliée dans cette phrase au discours indirect :',
            tokens: [
              'Hier soir,',
              'mon camarade m’a assuré',
              'qu’il m’apporterait le livre',
              'ici dès demain matin.'
            ],
            correctTokenIndex: 3,
            perRule: 'Si le verbe introducteur (« m’a assuré ») est au passé, « ici » et « demain » doivent être transposés en repères décalés : « là-bas dès le lendemain matin » !'
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
          },
          {
            id: 'conj-4',
            type: 'mcq',
            prompt: 'Identifiez la valeur du plus-que-parfait dans cette phrase du récit :',
            sentence: 'Il comprit soudain que les coureurs <mark>avaient déjà franchi</mark> le col du Mollendruz.',
            options: [
              'Une action simultanée au présent',
              'Une antériorité par rapport au passé simple « comprit »',
              'Une action future dans le passé',
              'Un ordre atténué'
            ],
            correctIndex: 1,
            perRule: 'Dans un récit au passé, le plus-que-parfait exprime une action accomplie AVANT le verbe principal au passé simple (« comprit ») : valeur d’antériorité.'
          },
          {
            id: 'conj-5',
            type: 'mcq',
            prompt: 'Quelle valeur exprime le présent dans cette phrase narrative au passé ?',
            sentence: 'Hier, tout semblait calme à la gare ; tout à coup, le haut-parleur <mark>grésille</mark> et annonce un train spécial.',
            options: [
              'Présent de vérité générale',
              'Présent de narration (rend la scène soudaine et vivante)',
              'Présent d’habitude',
              'Présent de politesse'
            ],
            correctIndex: 1,
            perRule: 'Introduit au cœur d’un récit à l’imparfait (« semblait »), le présent (« grésille ») rapproche l’action du lecteur : c’est le présent de narration.'
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
          },
          {
            id: 'fig-5',
            type: 'mcq',
            prompt: 'Identifiez la figure de style utilisée pour atténuer une idée pénible :',
            sentence: '« Au lieu d’annoncer son licenciement, le directeur expliqua qu’il <mark>allait réorienter sa carrière</mark>. »',
            options: [
              'Un euphémisme (atténuation d’une réalité brutale)',
              'Une hyperbole (exagération)',
              'Un oxymore',
              'Une antiphrase'
            ],
            correctIndex: 0,
            perRule: 'L’euphémisme adoucit une réalité choquante ou triste (« s’éteindre » pour mourir, « demandeur d’emploi » pour chômeur). À distinguer de la litote (« Va, je ne te hais point » = je t’aime beaucoup).'
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
          },
          {
            id: 'arg-3',
            type: 'mcq',
            prompt: 'Identifiez la nature de l’argument employé dans cet extrait :',
            sentence: 'Selon le rapport 2024 de l’Office fédéral de la statistique, <mark>78 % des jeunes lisent quotidiennement sur écran</mark>.',
            options: [
              'Un argument d’autorité / chiffré (source scientifique ou institutionnelle)',
              'Une anecdote personnelle affective',
              'Un raisonnement par l’absurde',
              'Une figure d’oxymore'
            ],
            correctIndex: 0,
            perRule: 'S’appuyer sur une étude reconnue ou des chiffres officiels renforce la crédibilité d’un paragraphe argumentatif : c’est un argument d’autorité / statistique.'
          },
          {
            id: 'arg-4',
            type: 'surgery',
            prompt: 'CHIRURGIE ARGUMENTATIVE : Cliquez sur le segment qui exprime la concession accordée à la thèse adverse :',
            tokens: [
              'Certes, l’intelligence artificielle accélère certaines recherches documentaires ;',
              'toutefois,',
              'elle ne peut jamais remplacer',
              'l’esprit critique personnel de l’élève.'
            ],
            correctTokenIndex: 0,
            perRule: '« Certes + concession » reconnaît un aspect valable du point de vue opposé avant de le dépasser avec « toutefois / cependant + réfutation ».'
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
          },
          {
            id: 'orth-4',
            type: 'surgery',
            prompt: 'DICTÉE INTERACTIVE — REPÉRAGE DE FAUTES : Cliquez sur le seul segment contenant une faute d’orthographe ou d’accord :',
            tokens: [
              'Les lettres que nous avons relues ce matin',
              'étaient toutes bien rédigées,',
              'malgré quelques hésitations',
              'que nos professeurs ont corrigé rapidement.'
            ],
            correctTokenIndex: 3,
            perRule: 'Faute repérée ! On écrit « ont corrigées » (-ées) : le CDV « que » placé avant le verbe « ont corrigé » reprend « quelques hésitations » (féminin pluriel) !'
          },
          {
            id: 'orth-5',
            type: 'mcq',
            prompt: 'Homophones & Accords PER : choisissez la phrase entièrement sans faute :',
            sentence: 'Attention aux pièges « s’est / c’est » et « leur / leurs » :',
            options: [
              'Elle c’est souvenue de ses erreurs et leur a expliqué ses réponses.',
              'Elle s’est souvenue de ces erreurs ou leur a expliqué ses réponses.',
              'Elle s’est souvenue de ses erreurs et leurs a expliqué ses réponses.',
              'Elle s’est souvenue de ses erreurs et leur a expliqué ses réponses.'
            ],
            correctIndex: 3,
            perRule: '« Elle s’est souvenue » (verbe pronominal s’en souvenir + accord avec le sujet féminin), « ses » (déterminant possessif = les siennes), et « leur » invariable devant un verbe (« leur a expliqué » = à eux).'
          },
          {
            id: 'orth-6',
            type: 'surgery',
            prompt: 'DICTÉE VOLTAIRE 11e VP : Cliquez sur le segment fautif dans cette dictée de préparation au Certificat :',
            tokens: [
              'Quant aux copies d’examen,',
              'la doyenne en a lues plus de cinquante',
              'avant de remettre ses résultats',
              'aux classes vaudoises.'
            ],
            correctTokenIndex: 1,
            perRule: 'Piège classique du Certificat ! Devant le verbe conjugué avec « avoir », lorsque le CDV est le pronom « en » (« en a lu cinquante »), le participe passé reste TOUJOURS invariable : « en a lu » !'
          }
        ]
      }
    ]
  },
  allemand: {
    id: 'allemand',
    name: 'Allemand 11e VP (PER L2)',
    isPlaceholder: false,
    perCode: 'PER L2 31-38 (DGEO Vaud)',
    examInfo: 'Certificat 11e VP Vaud : Compréhension écrite, syntaxe (V2/Nebensatz, Perfekt, Kasus) & Wortschatz',
    modules: [
      {
        id: 'nebensaetze',
        title: '1. Hauptsatz (V2) & Nebensätze (weil, dass, obwohl, wenn, als)',
        perRef: 'L2 36 — Grammatik & Satzbau',
        icon: '🇩🇪',
        station: 'Lausanne',
        description: 'Maîtriser la position 2 du verbe (V2), le rejet en fin de subordonnée (Nebensatz) et la règle weil/wenn/als.',
        mastery: 55,
        theorySheet: {
          title: 'Merkblatt PER L2 : Hauptsatz (V2) vs. Nebensatz (Verb am Ende)',
          points: [
            '<strong>Dans la principale (Hauptsatz)</strong> : Le verbe conjugué occupe toujours la <strong>position 2</strong> (y compris après un complément de temps ou de lieu en tête).',
            '<strong>Dans la subordonnée (Nebensatz)</strong> : Après <em>weil, dass, obwohl, wenn, als</em>, le verbe conjugué est rejeté à la <strong>toute fin</strong>.',
            '<strong>Nebensatz en tête</strong> : Formule magique <strong>Verb, Verb</strong> autour de la virgule (<em>Obwohl es <u>regnet</u>, <u>gehen</u> wir spazieren</em>).',
            '<strong>Wenn vs. Als (passé)</strong> : <em>Als</em> = événement ponctuel unique au passé ; <em>Wenn</em> = présent, futur ou action répétée au passé (<em>jedes Mal, wenn...</em>).'
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
          },
          {
            id: 'de-3',
            type: 'mcq',
            prompt: 'Complétez avec « als » ou « wenn » selon la règle du PER L2 :',
            sentence: '<mark>...</mark> ich im Sommer 2023 zum ersten Mal in Bern war, habe ich das Bundeshaus besichtigt.',
            options: [
              'Als (événement unique achevé dans le passé)',
              'Wenn (événement unique au passé)',
              'Obwohl (cause logique)',
              'Dass (complétive directe)'
            ],
            correctIndex: 0,
            perRule: 'Pour un événement unique survenu dans le passé (« im Sommer 2023 zum ersten Mal »), on utilise toujours « als ».'
          },
          {
            id: 'de-4',
            type: 'mcq',
            prompt: 'Identifiez la phrase correctement construite avec un complément temporel en tête (Inversion V2) :',
            sentence: 'Traduction : « Demain matin, nous réviserons le vocabulaire à la bibliothèque. »',
            options: [
              'Morgen früh wir wiederholen den Wortschatz in der Bibliothek.',
              'Morgen früh wiederholen wir den Wortschatz in der Bibliothek.',
              'Morgen früh den Wortschatz wir wiederholen in der Bibliothek.',
              'Wir morgen früh wiederholen den Wortschatz in der Bibliothek.'
            ],
            correctIndex: 1,
            perRule: 'En allemand, un seul groupe précède le verbe conjugué ! Si « Morgen früh » est en position 1, le verbe « wiederholen » reste en position 2 et passe avant le sujet « wir ».'
          }
        ]
      },
      {
        id: 'perfekt_praeteritum',
        title: '2. Perfekt (haben / sein + Partizip II) & Präteritum (Modaux)',
        perRef: 'L2 36 — Vergangenheitsformen',
        icon: '⏱️',
        station: 'Morges',
        description: 'Choisir entre haben et sein au Perfekt, former le Partizip II (inséparables, séparables, forts) et conjuguer les modaux au Präteritum.',
        mastery: 50,
        theorySheet: {
          title: 'Merkblatt PER L2 : Perfekt & Präteritum der Modalverben',
          points: [
            '<strong>Auxiliaire SEIN au Perfekt</strong> : Verbes de <strong>déplacement A → B</strong> (<em>gehen, fahren, fliegen, kommen, laufen</em>), de <strong>changement d’état</strong> (<em>aufstehen, einschlafen, werden</em>), plus <em>sein</em> et <em>bleiben</em>.',
            '<strong>Préfixes inséparables (be-, ver-, er-, ent-, zer-)</strong> : Jamais de <em>ge-</em> au Partizip II (ex: <em>verstehen → verstanden, besuchen → besucht</em>).',
            '<strong>Préfixes séparables (an-, auf-, ein-, mit-)</strong> : Le <em>-ge-</em> se glisse entre le préfixe et le radical (ex: <em>einkaufen → eingekauft</em>).',
            '<strong>Präteritum courant</strong> : À l’oral et à l’écrit, <em>sein (war), haben (hatte)</em> et les verbes modaux (<em>konnte, musste, wollte, durfte</em>) s’utilisent au Präteritum.'
          ]
        },
        questions: [
          {
            id: 'dep-1',
            type: 'mcq',
            prompt: 'Complétez au Perfekt avec l’auxiliaire et le Partizip II exacts :',
            sentence: 'Am Wochenende <mark>...</mark> meine Familie nach Zermatt <mark>...</mark>.',
            options: [
              'hat ... gefahren',
              'ist ... gefahren',
              'ist ... gefahrt',
              'hat ... gefahrt'
            ],
            correctIndex: 1,
            perRule: '« fahren » exprime un déplacement d’un point A à un point B : il prend l’auxiliaire « sein » (« ist »). Verbe fort : « gefahren ».'
          },
          {
            id: 'dep-2',
            type: 'mcq',
            prompt: 'Quel est le Partizip II correct du verbe à particule inséparable « verstehen » ?',
            sentence: 'Hast du die Grammatikregel gut <mark>...</mark> ?',
            options: [
              'geverstanden',
              'verstandet',
              'verstanden',
              'vergestanden'
            ],
            correctIndex: 2,
            perRule: 'Les verbes commençant par un préfixe inséparable (be-, ver-, er-, ent-, emp-, zer-, miss-) ne prennent JAMAIS « ge- » → « verstanden ».'
          },
          {
            id: 'dep-3',
            type: 'mcq',
            prompt: 'Mettez le verbe modal « müssen » au Präteritum (récit au passé) :',
            sentence: 'Gestern Abend <mark>...</mark> Lukas noch zwei Stunden für den Test lernen.',
            options: [
              'musste',
              'muss',
              'müsste',
              'gemusst'
            ],
            correctIndex: 0,
            perRule: 'Au Präteritum de l’indicatif, « müssen » perd son Umlaut : ich/er musste, wir mussten.'
          },
          {
            id: 'dep-4',
            type: 'surgery',
            prompt: 'VERB-CHIRURGIE : Cliquez sur la faute de conjugaison au Perfekt dans cette phrase :',
            tokens: [
              'Letzten Sonntag',
              'habe ich',
              'lange im Park',
              'geblieben.'
            ],
            correctTokenIndex: 1,
            perRule: 'Attention au piège du Certificat ! Même s’il n’exprime pas de mouvement, le verbe « bleiben » (rester) prend TOUJOURS l’auxiliaire « sein » : « bin ich ... geblieben ».'
          }
        ]
      },
      {
        id: 'kasus_praep',
        title: '3. Kasus (Nom, Akk, Dativ) & Wechselpräpositionen',
        perRef: 'L2 36 — Kasus & Präpositionen',
        icon: '🧭',
        station: 'Vevey',
        description: 'Maîtriser les prépositions à cas fixe (Dativ / Akkusativ) et les prépositions mixtes (Wo? → Dativ / Wohin? → Akkusativ).',
        mastery: 48,
        theorySheet: {
          title: 'Merkblatt PER L2 : Déclinaisons & Prépositions essentielles',
          points: [
            '<strong>Prépositions + DATIV obligatoires</strong> : <em>mit, nach, aus, zu, von, bei, seit</em> (articles : <em>dem, der, dem, den + -n</em> au pluriel).',
            '<strong>Prépositions + AKKUSATIV obligatoires</strong> : <em>durch, für, gegen, ohne, um</em> (seul le masculin change : <em>der → den</em> / <em>ein → einen</em>).',
            '<strong>Wechselpräpositionen (in, auf, an, unter, über, vor, hinter, neben, zwischen)</strong> : Question <strong>Wo?</strong> (lieu où l’on est, statique) = <strong>Dativ</strong> ; Question <strong>Wohin?</strong> (direction/mouvement vers) = <strong>Akkusativ</strong>.'
          ]
        },
        questions: [
          {
            id: 'dek-1',
            type: 'mcq',
            prompt: 'Complétez avec l’article correct après « mit » :',
            sentence: 'Wir fahren jeden Morgen mit <mark>...</mark> Bus zur Schule.',
            options: [
              'der (Nominativ)',
              'den (Akkusativ)',
              'dem (Dativ)',
              'des (Genitiv)'
            ],
            correctIndex: 2,
            perRule: '« der Bus » (masculin) après la préposition « mit » qui régit toujours le Dativ → « mit dem Bus ».'
          },
          {
            id: 'dek-2',
            type: 'mcq',
            prompt: 'Wechselpräposition « in » : s’agit-il d’un mouvement (Wohin?) ou d’une position fixe (Wo?) ?',
            sentence: 'Die Schüler gehen jetzt in <mark>...</mark> Klassenzimmer (das Klassenzimmer).',
            options: [
              'das (Akkusativ — mouvement Wohin?)',
              'dem (Dativ — position Wo?)',
              'der (Nominativ féminin)',
              'den (Dativ pluriel)'
            ],
            correctIndex: 0,
            perRule: 'Avec le verbe de déplacement « gehen » (Wohin gehen sie?), « in » régit l’Akkusativ. « das Klassenzimmer » étant neutre, il reste « in das (ins) Klassenzimmer ».'
          },
          {
            id: 'dek-3',
            type: 'mcq',
            prompt: 'Choisissez l’article exact après la préposition « für » :',
            sentence: 'Ich habe ein kleines Geschenk für <mark>...</mark> Bruder (der Bruder) gekauft.',
            options: [
              'meinem',
              'meinen',
              'mein',
              'meiner'
            ],
            correctIndex: 1,
            perRule: '« für » exige toujours l’Akkusativ ! « der Bruder » étant masculin singulier, le déterminant prend la terminaison « -en » → « für meinen Bruder ».'
          },
          {
            id: 'dek-4',
            type: 'surgery',
            prompt: 'KASUS-CHIRURGIE : Cliquez sur le segment qui contient une erreur de cas après une préposition :',
            tokens: [
              'Das Wörterbuch liegt',
              'schon seit eine Stunde',
              'auf dem Tisch',
              'in der Bibliothek.'
            ],
            correctTokenIndex: 1,
            perRule: 'La préposition temporelle « seit » régit obligatoirement le Dativ ! Il faut donc écrire « seit einer Stunde » (féminin Dativ = -er).'
          }
        ]
      },
      {
        id: 'wortschatz',
        title: '4. Wortschatz & Redewendungen 11e VP (École, Gymnase & Quotidien)',
        perRef: 'L2 37 — Lexique fondamental PER',
        icon: '🗣️',
        station: 'Montreux (Certificat)',
        description: 'Réviser le vocabulaire clé de 11e VP (argumentation en allemand, vie scolaire, environnement, faux-amis) sous forme de flashcards.',
        mastery: 60,
        theorySheet: {
          title: 'Merkblatt PER L2 : Mots-outils et lexique clé du Certificat',
          points: [
            '<strong>Connecteurs argumentatifs L2</strong> : <em>einerseits... andererseits</em> (d’un côté... d’un autre), <em>meiner Meinung nach</em> (à mon avis), <em>deshalb</em> (c’est pourquoi), <em>trotzdem</em> (malgré tout).',
            '<strong>Faux-amis célèbres</strong> : <em>das Gymnasium</em> (= lycée/gymnase vaudois), <em>bekommen</em> (= recevoir, PAS devenir = <em>werden</em> !), <em>fast</em> (= presque), <em>spenden</em> (= faire un don).',
            '<strong>École & Société</strong> : <em>die Umwelt</em> (l’environnement), <em>das Zeugnis</em> (le bulletin/certificat), <em>sich entscheiden</em> (se décider), <em>verbessern</em> (améliorer).'
          ]
        },
        questions: [
          {
            id: 'dew-1',
            type: 'mcq',
            prompt: 'Attention au faux-ami ! Que signifie « bekommen » en allemand ?',
            sentence: 'Am Ende des Jahres <mark>bekommen</mark> die Schülerinnen und Schüler ihr Zeugnis.',
            options: [
              'Devenir',
              'Recevoir / obtenir',
              'Commencer',
              'Comprendre'
            ],
            correctIndex: 1,
            perRule: 'Faux-ami classique de 11e VP : « bekommen » = recevoir (≠ anglais « become » qui se dit « werden » en allemand !).'
          },
          {
            id: 'dew-2',
            type: 'mcq',
            prompt: 'Comment traduit-on « À mon avis, la lecture est très importante » en allemand soutenu ?',
            sentence: '<mark>...</mark> ist das Lesen sehr wichtig.',
            options: [
              'Meiner Meinung nach',
              'Für mein Denken',
              'In meiner Idee',
              'Seit meiner Meinung'
            ],
            correctIndex: 0,
            perRule: '« Meiner Meinung nach » (suivi immédiatement du verbe conjugué en position 2 : « ... ist das Lesen ») est l’expression idéale pour donner son avis à l’examen.'
          },
          {
            id: 'dew-3',
            type: 'mcq',
            prompt: 'Choisissez le bon mot pour traduire « protéger l’environnement » :',
            sentence: 'Jugendliche können viel tun, um <mark>...</mark> zu schützen.',
            options: [
              'die Hausaufgabe',
              'die Umwelt',
              'das Wochenende',
              'die Prüfung'
            ],
            correctIndex: 1,
            perRule: '« die Umwelt schützen » = protéger l’environnement (« die Prüfung » = l’examen, « die Hausaufgabe » = les devoirs).'
          },
          {
            id: 'dew-4',
            type: 'mcq',
            prompt: 'Quel connecteur permet d’exprimer la conséquence tout en gardant le verbe juste après (« Verb in Position 2 ») ?',
            sentence: 'Er hat regelmäßig geübt ; <mark>...</mark> spricht er jetzt fließend Deutsch.',
            options: [
              'weil',
              'obwohl',
              'deshalb',
              'dass'
            ],
            correctIndex: 2,
            perRule: '« deshalb » (c’est pourquoi) est un adverbe de liaison en position 1 → le verbe « spricht » suit directement ! (Tandis que weil, obwohl et dass rejettent le verbe à la fin).'
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
   Simulation « Examen Blanc de Certificat Vaud » (DGEO / PER 11e VP)
   ========================================================================== */
window.CERTIFICAT_MOCK_EXAMS = [
  {
    id: 'certif-ecrans',
    title: 'Examen Blanc N°1 — Texte Argumentatif & Langue',
    subtitle: 'Épreuve type Certificat Vaud (45 min) — Compréhension, Syntaxe PER & Rédaction',
    durationMinutes: 45,
    perBadge: 'PER L1 31-38 • DGEO Vaud',
    passageTitle: 'À l’ère des écrans infinis, réapprendre l’ennui créatif',
    passageAuthor: 'Extrait d’essai contemporain (Adapté pour le Certificat 11e VP Vaud)',
    passageText: `    (§1) Chaque soir, dans les trains régionaux qui longent le Léman entre Lausanne et Vevey, un spectacle identique se répète : des dizaines de visages éclairés par la lueur bleutée d’un téléphone portable. Certes, ces appareils nous ouvrent en une fraction de seconde les bibliothèques du monde entier et facilitent les échanges entre amis.
    (§2) Néanmoins, plusieurs psychologues observent que le défilement continu de courtes vidéos fragmente notre capacité d’attention. Lorsque l’on s’ennuie ne serait-ce que trois minutes à l’arrêt du bus, le réflexe immédiat consiste à combler ce vide numérique, alors que l’ennui constituait jadis le terreau de l’imagination.
    (§3) Il ne s’agit pas de rejeter en bloc le progrès technique ; cependant, fixer des plages sans écran permet à chacun de retrouver une pensée profonde, indispensable pour analyser des textes complexes et construire des projets personnels durables.`,
    questions: [
      {
        id: 'ex1-q1',
        prompt: '1. [Compréhension] Quelle est la thèse défendue par l’auteur dans cet extrait ?',
        sentence: 'Appuie-toi sur les trois paragraphes du texte :',
        options: [
          'Il faut interdire totalement les téléphones portables dans les trains.',
          'Sans rejeter la technologie, il est nécessaire de limiter l’usage continu des écrans pour préserver la concentration et l’imagination.',
          'Les trains régionaux vaudois devraient supprimer la connexion internet.',
          'L’ennui est un problème grave qu’il faut combattre avec des vidéos courtes.'
        ],
        correctIndex: 1,
        perRule: 'Thèse nuancée typique du Certificat (§3) : l’auteur ne prône pas le rejet total, mais un usage maîtrisé pour préserver l’attention profonde.'
      },
      {
        id: 'ex1-q2',
        prompt: '2. [Argumentation] Dans le §1, quelle est la stratégie argumentative du mot « Certes » ?',
        sentence: '« <mark>Certes</mark>, ces appareils nous ouvrent en une fraction de seconde les bibliothèques du monde entier... »',
        options: [
          'Une conclusion définitive',
          'Une concession accordée à la thèse adverse avant la nuance (« Néanmoins »)',
          'Un argument d’autorité scientifique',
          'Une interrogation rhétorique'
        ],
        correctIndex: 1,
        perRule: '« Certes... Néanmoins... » forme le couple concession + réfutation/nuance essentiel en texte argumentatif 11e VP.'
      },
      {
        id: 'ex1-q3',
        prompt: '3. [Fonctions PER] Quelle est la fonction du groupe encadré au début du §1 ?',
        sentence: '« <mark>Chaque soir</mark>, dans les trains régionaux, un spectacle identique se répète. »',
        options: [
          'Complément direct du verbe (CDV)',
          'Complément de phrase (CP) de temps',
          'Attribut du sujet',
          'Modificateur du nom'
        ],
        correctIndex: 1,
        perRule: '« Chaque soir » est déplaçable en fin de phrase et supprimable : selon le PER, c’est un Complément de phrase (CP).'
      },
      {
        id: 'ex1-q4',
        prompt: '4. [Subordonnées] Quelle est la nature et fonction PER de la subordonnée encadrée (§1) ?',
        sentence: '« ... les trains régionaux <mark>qui longent le Léman</mark>... »',
        options: [
          'Subordonnée relative — fonction Modificateur du nom « trains régionaux »',
          'Subordonnée complétive — fonction CDV',
          'Subordonnée circonstancielle de lieu — fonction CP',
          'Subordonnée interrogative indirecte'
        ],
        correctIndex: 0,
        perRule: 'Introduite par le pronom relatif « qui », elle complète le groupe nominal antécédent « les trains régionaux » : fonction Modificateur du nom.'
      },
      {
        id: 'ex1-q5',
        prompt: '5. [Subordonnées] Quelle est la nature et fonction PER de la subordonnée encadrée (§2) ?',
        sentence: '« Plusieurs psychologues observent <mark>que le défilement continu fragmente notre attention</mark>. »',
        options: [
          'Subordonnée relative — Modificateur du nom',
          'Subordonnée complétive conjonctive — fonction CDV du verbe « observent »',
          'Subordonnée circonstancielle de cause — fonction CP',
          'Subordonnée de conséquence — fonction CP'
        ],
        correctIndex: 1,
        perRule: 'Placée juste après le verbe « observent » et remplaçable par « observent cela », cette subordonnée par « que » est une complétive conjonctive (CDV).'
      },
      {
        id: 'ex1-q6',
        prompt: '6. [Figures de style] Quelle figure de style contient l’expression encadrée (§2) ?',
        sentence: '« ... l’ennui constituait jadis <mark>le terreau de l’imagination</mark>. »',
        options: [
          'Une métaphore (image sans outil de comparaison)',
          'Une comparaison explicite',
          'Un oxymore',
          'Une anaphore'
        ],
        correctIndex: 0,
        perRule: 'L’ennui est assimilé directement à une terre fertile (« le terreau ») sans mot comparatif (comme, tel) : c’est une métaphore.'
      },
      {
        id: 'ex1-q7',
        prompt: '7. [Valeurs des temps] Quelle est la valeur du présent employé dans tout le §1 et le §2 ?',
        sentence: '« un spectacle identique <mark>se répète</mark>... le défilement <mark>fragmente</mark> notre attention. »',
        options: [
          'Présent de narration (récit historique)',
          'Présent de vérité générale / constat d’actualité',
          'Futur proche',
          'Conditionnel d’atténuation'
        ],
        correctIndex: 1,
        perRule: 'Dans un essai argumentatif, le présent exprime des faits généraux et des vérités actuelles valables au moment où le lecteur lit le texte.'
      },
      {
        id: 'ex1-q8',
        prompt: '8. [Orthographe PER] Complétez correctement le participe passé dans cette phrase inspirée du texte :',
        sentence: 'Les heures sans téléphone que nous avons <mark>...</mark> cette semaine nous ont apaisés.',
        options: [
          'passé (invariable)',
          'passés (masculin pluriel)',
          'passées (féminin pluriel — CDV « que » = Les heures)',
          'passée (féminin singulier)'
        ],
        correctIndex: 2,
        perRule: 'Avec « avoir », le participe passé s’accorde avec le CDV placé avant le verbe : le relatif « que » reprend « Les heures » (féminin pluriel) → « passées ».'
      }
    ],
    writingPrompt: 'Pensez-vous que les smartphones nuisent davantage qu’ils n’aident à la concentration des jeunes de 14-15 ans ? Rédigez un texte argumentatif structuré (180–250 mots) avec introduction, deux arguments illustrés, une concession et une conclusion.',
    writingGuidance: 'Vise la structure DGEO : Intro (Sujet amené / posé / divisé) → Argument 1 + Exemple → Concession (« Certes... toutefois... ») + Argument 2 → Conclusion.',
    rubric: [
      'Introduction complète en 3 temps (sujet amené → question posée → annonce du plan)',
      'Thèse claire et cohérente maintenue tout au long du texte',
      'Au moins 2 arguments distincts illustrés par un exemple concret',
      'Présence d’une concession / nuance (Certes... néanmoins / toutefois...)',
      'Connecteurs logiques variés et relecture des participes passés'
    ]
  },
  {
    id: 'certif-leman',
    title: 'Examen Blanc N°2 — Analyse Littéraire & Poétique',
    subtitle: 'Épreuve type Certificat Vaud (45 min) — Récit au passé, Figures de style & Langue',
    durationMinutes: 45,
    perBadge: 'PER L1 31-37 • DGEO Vaud',
    passageTitle: 'Tempête silencieuse sur les vignes de Lavaux',
    passageAuthor: 'Nouvelle originale vaudoise (Format Examen 11e VP)',
    passageText: `    (§1) Le brouillard s’accrochait encore aux terrasses de Lavaux lorsque Claire ouvrit les volets en bois de la maison familiale. En bas, le Léman dormait sous une couverture d’étain immobile.
    (§2) Soudain, une rafale glaciale descendue des Dents du Midi déchira ce calme apparent et fit claquer les volets contre la façade. Claire recula d’un pas. Fallait-il vraiment descendre au port malgré l’avertissement que son père lui avait répété la veille ?
    (§3) Elle se saisit de son ciré jaune que les tempêtes d’automne avaient déjà usé, puis franchit le seuil sans hésiter, persuadée que la barque ne supporterait pas une heure de vagues sans amarres solides.`,
    questions: [
      {
        id: 'ex2-q1',
        prompt: '1. [Valeurs des temps] Pourquoi l’auteur utilise-t-il « s’accrochait » puis « ouvrit » dans le §1 ?',
        sentence: '« Le brouillard <mark>s’accrochait</mark> encore... lorsque Claire <mark>ouvrit</mark> les volets... »',
        options: [
          'Deux actions soudaines au passé simple',
          'Imparfait de description (arrière-plan) suivi du passé simple de premier plan (action bornée)',
          'Présent d’énonciation suivi d’un futur dans le passé',
          'Imparfait de politesse'
        ],
        correctIndex: 1,
        perRule: 'Dans le système du récit au passé, l’imparfait (« s’accrochait », « dormait ») installe le décor (arrière-plan) et le passé simple (« ouvrit », « déchira ») fait surgir les événements.'
      },
      {
        id: 'ex2-q2',
        prompt: '2. [Figures de style] Quelle figure de style repérez-vous dans la phrase encadrée (§1) ?',
        sentence: '« En bas, <mark>le Léman dormait sous une couverture d’étain</mark> immobile. »',
        options: [
          'Une personnification (« le Léman dormait ») associée à une métaphore (« couverture d’étain »)',
          'Une litote et un euphémisme',
          'Une anaphore',
          'Une antiphrase ironique'
        ],
        correctIndex: 0,
        perRule: 'On prête un comportement humain au lac (« dormait » = personnification) tout en assimilant la surface brumeuse à une « couverture d’étain » (métaphore).'
      },
      {
        id: 'ex2-q3',
        prompt: '3. [Discours rapporté] Quelle forme d’énonciation apparaît dans le §2 ?',
        sentence: '« Claire recula d’un pas. <mark>Fallait-il vraiment descendre au port malgré l’avertissement... ?</mark> »',
        options: [
          'Discours direct avec guillemets',
          'Discours indirect libre',
          'Discours indirect introduit par « que »',
          'Monologue théâtral'
        ],
        correctIndex: 1,
        perRule: 'Absence de verbe introducteur et de guillemets + 3e personne + imparfait (« Fallait-il ») + point d’interrogation expressif = discours indirect libre.'
      },
      {
        id: 'ex2-q4',
        prompt: '4. [Orthographe PER] Dans le §3, pourquoi écrit-on « avait répété » sans -e ni -s (§2), mais « avait déjà usé » ou « s’est décidée » ?',
        sentence: '« malgré l’avertissement <mark>que</mark> son père lui avait <mark>répété</mark> » vs « les voiles <mark>que</mark> les tempêtes avaient <mark>usées</mark> »',
        options: [
          'Avec « avoir », le participe passé s’accorde en genre et en nombre avec le CDV « que » placé avant le verbe.',
          'Avec « avoir », il s’accorde toujours avec le sujet.',
          'Il ne s’accorde jamais devant un complément de lieu.',
          'L’adverbe « déjà » rend le verbe invariable.'
        ],
        correctIndex: 0,
        perRule: '« l’avertissement » est masculin singulier (« répété »), alors qu’un antécédent féminin pluriel comme « les voiles / tempêtes » exige « -ées ».'
      },
      {
        id: 'ex2-q5',
        prompt: '5. [Fonctions PER] Quelle est la fonction PER du groupe encadré dans le §2 ?',
        sentence: '« Claire recula <mark>d’un pas</mark>. » vs « <mark>Soudain</mark>, une rafale glaciale déchira ce calme. »',
        options: [
          '« Soudain » est Complément de phrase (CP) — déplaçable et supprimable',
          '« Soudain » est Attribut du sujet',
          '« Soudain » est Complément direct du verbe',
          '« Soudain » est Sujet inversé'
        ],
        correctIndex: 0,
        perRule: 'L’adverbe temporel « Soudain » modifie l’ensemble de la phrase et peut être déplacé (« Une rafale déchira soudain... ») : c’est un Complément de phrase (CP).'
      },
      {
        id: 'ex2-q6',
        prompt: '6. [Subordonnées] Quel est le statut de la proposition encadrée (§3) ?',
        sentence: '« ... persuadée <mark>que la barque ne supporterait pas une heure de vagues</mark>. »',
        options: [
          'Subordonnée relative — Modificateur du nom',
          'Subordonnée complétive (complément de l’adjectif « persuadée »)',
          'Subordonnée circonstancielle de but — fonction CP',
          'Proposition principale indépendante'
        ],
        correctIndex: 1,
        perRule: 'Complément essentiel introduit par la conjonction « que » après « persuadée » (persuadée de cela) : c’est une subordonnée complétive conjonctive.'
      },
      {
        id: 'ex2-q7',
        prompt: '7. [Figures de style] Que produit le contraste entre le §1 (« calme, dormait, immobile ») et le §2 (« déchira, claquer ») ?',
        sentence: 'Rupture lexicale entre les deux paragraphes :',
        options: [
          'Une antithèse / opposition nette entre deux atmosphères',
          'Une allitération en [m]',
          'Un euphémisme adoucissant',
          'Une litote'
        ],
        correctIndex: 0,
        perRule: 'L’opposition entre le champ lexical du calme (§1) et celui de la violence climatique (§2) crée un effet d’antithèse qui dramatise la scène.'
      },
      {
        id: 'ex2-q8',
        prompt: '8. [Orthographe] Repérez l’orthographe exacte du participe passé pronominal :',
        sentence: 'Une fois les vagues calmées, Claire et son père se sont <mark>...</mark> au bord du quai.',
        options: [
          'retrouvé (invariable)',
          'retrouvée (féminin singulier)',
          'retrouvés (masculin pluriel — sujet mixte « Claire et son père » = CDV « se »)',
          'retrouvées (féminin pluriel)'
        ],
        correctIndex: 2,
        perRule: '« Ils ont retrouvé qui ? se (l’un l’autre) » → « se » est CDV placé avant le verbe ! Avec un sujet mixte (Claire + son père), l’accord se fait au masculin pluriel → « retrouvés ».'
      }
    ],
    writingPrompt: 'Dans notre société pressée, le contact direct avec la nature (montagne, lac, forêt) reste-t-il indispensable aux adolescents pour se construire ? Développez un point de vue argumenté (180–250 mots).',
    writingGuidance: 'Organise ta copie : 1. Intro (amené / posé / divisé) ; 2. Thèse illustrée d’exemples suisses/quotidiens ; 3. Concession (*Certes les loisirs numériques séduisent, toutefois...*) ; 4. Conclusion.',
    rubric: [
      'Introduction structurée (sujet amené, question posée, annonce du plan)',
      'Position claire et nuance intégrée (concession / réfutation)',
      'Exemples précis (randonnée, sport en plein air, apaisement)',
      'Connecteurs logiques en début de paragraphes',
      'Orthographe & accords vérifiés (être/avoir/pronominaux)'
    ]
  }
];

/* ==========================================================================
   Procedural PER Exercise Generator (+200 Combinatorial Exercises across FR + DE)
   ========================================================================== */
window.PERExerciseGenerator = {
  counter: 100,

  _pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  _buildMcq(id, prompt, sentence, correct, distractors, perRule) {
    const uniqueOpts = [correct, ...distractors.filter(d => d !== correct)].slice(0, 4);
    const shuffled = [...uniqueOpts].sort(() => Math.random() - 0.5);
    return {
      id,
      type: 'mcq',
      isGenerated: true,
      prompt,
      sentence,
      options: shuffled,
      correctIndex: shuffled.indexOf(correct),
      perRule
    };
  },

  generateForModule(moduleId) {
    this.counter += 1;
    const id = `gen-${moduleId}-${this.counter}`;

    if (moduleId === 'subordonnees') {
      const subjects = ['Les élèves de 11e VP', 'Les rameurs de Morges', 'Les voyageurs matinaux', 'Nos camarades de Béthusy'];
      const lieux = ['à Lausanne', 'sur les quais d’Ouchy', 'au château de Chillon', 'dans les vignes de Lavaux'];
      const subj = this._pick(subjects);
      const lieu = this._pick(lieux);
      const patterns = [
        {
          sentence: `${subj} poursuivent leur effort ${lieu}, <mark>bien que la pluie redouble d’intensité</mark>.`,
          correct: 'Subordonnée circonstancielle d’opposition (concession) — fonction CP',
          distractors: ['Subordonnée relative — fonction Modificateur du nom', 'Subordonnée complétive conjonctive — fonction CDV', 'Subordonnée circonstancielle de cause — fonction CP'],
          rule: 'Introduite par « bien que + subjonctif », cette subordonnée exprime une concession et occupe la fonction de Complément de phrase (CP).'
        },
        {
          sentence: `${subj} observent ${lieu} <mark>que les lumières du port s’allument déjà</mark>.`,
          correct: 'Subordonnée complétive conjonctive — fonction CDV',
          distractors: ['Subordonnée relative — fonction Modificateur du nom', 'Subordonnée circonstancielle de temps — fonction CP', 'Subordonnée circonstancielle de but — fonction CP'],
          rule: 'Placée après le verbe « observent », elle est essentielle (non déplaçable) : c’est une subordonnée complétive conjonctive (fonction CDV).'
        },
        {
          sentence: `Le train CFF <mark>qui traverse les terrasses ${lieu}</mark> transporte ${subj.toLowerCase()}.`,
          correct: 'Subordonnée relative déterminative — fonction Modificateur du nom',
          distractors: ['Subordonnée complétive — fonction CDV', 'Subordonnée circonstancielle de lieu — fonction CP', 'Subordonnée interrogative indirecte — fonction CDV'],
          rule: 'Introduite par le pronom relatif « qui », elle complète l’antécédent nominal « Le train CFF » : fonction Modificateur du nom.'
        },
        {
          sentence: `${subj} s’arrêtent ${lieu} <mark>afin qu’ils puissent admirer le panorama alpin</mark>.`,
          correct: 'Subordonnée circonstancielle de but — fonction CP',
          distractors: ['Subordonnée circonstancielle de cause — fonction CP', 'Subordonnée relative explicative', 'Subordonnée complétive conjonctive — fonction CDV'],
          rule: '« afin que + subjonctif » indique l’objectif poursuivi (subordonnée circonstancielle de but, fonction CP).'
        },
        {
          sentence: `La professeure demande <mark>si tous les cahiers ont été rendus à temps</mark>.`,
          correct: 'Subordonnée complétive interrogative indirecte — fonction CDV',
          distractors: ['Subordonnée circonstancielle d’hypothèse — fonction CP', 'Subordonnée relative — Modificateur du nom', 'Subordonnée circonstancielle de concession — fonction CP'],
          rule: 'Après un verbe d’interrogation (« demande »), « si » introduit une complétive interrogative indirecte (fonction CDV), et NON une hypothèse !'
        }
      ];
      const p = this._pick(patterns);
      return this._buildMcq(id, '⚡ [Exercice Généré] Quelle est la nature et la fonction PER de la proposition encadrée ?', p.sentence, p.correct, p.distractors, p.rule);
    }

    if (moduleId === 'fonctions') {
      const contexts = ['Dans la bibliothèque cantonale', 'Chaque mercredi après-midi', 'Malgré la fatigue de la journée'];
      const ctx = this._pick(contexts);
      const items = [
        {
          sentence: `<mark>${ctx}</mark>, les candidats de 11e VP révisent leurs fiches avec méthode.`,
          answer: 'Complément de phrase (CP) — déplaçable et supprimable',
          others: ['Complément direct du verbe (CDV)', 'Attribut du sujet', 'Modificateur du nom'],
          rule: 'Placé en tête de phrase, ce groupe peut être déplacé ou supprimé sans rendre la phrase agrammaticale : c’est un Complément de phrase (CP).'
        },
        {
          sentence: 'Cette explication grammaticale demeure <mark>particulièrement limpide pour toute la classe</mark>.',
          answer: 'Attribut du sujet « Cette explication grammaticale »',
          others: ['Complément direct du verbe (CDV)', 'Complément de phrase (CP)', 'Complément indirect du verbe (CIV)'],
          rule: 'Après le verbe d’état « demeurer », le groupe adjectival qualifie le sujet et fait partie du prédicat : c’est un Attribut du sujet.'
        },
        {
          sentence: 'Le jury félicite <mark>les élèves qui ont présenté un exposé rigoureux</mark>.',
          answer: 'Complément direct du verbe (CDV)',
          others: ['Complément de phrase (CP)', 'Attribut du sujet', 'Complément indirect du verbe (CIV)'],
          rule: 'Construit sans préposition après le verbe « féliciter » et pronominalisable par « les » (Le jury les félicite) : c’est un CDV.'
        },
        {
          sentence: 'Cet essai <mark>d’une grande justesse philosophique</mark> a convaincu les correcteurs.',
          answer: 'Modificateur du nom « essai »',
          others: ['Complément de phrase (CP)', 'Complément indirect du verbe (CIV)', 'Attribut du COD'],
          rule: 'Inclus à l’intérieur du groupe nominal sujet « Cet essai... », ce groupe prépositionnel enrichit le nom noyau : fonction Modificateur du nom.'
        }
      ];
      const pick = this._pick(items);
      return this._buildMcq(id, '⚡ [Exercice Généré] Identifiez la fonction syntaxique PER du groupe encadré :', pick.sentence, pick.answer, pick.others, pick.rule);
    }

    if (moduleId === 'discours') {
      const speakers = ['Le professeur', 'La doyenne du collège', 'Le guide alpin', 'L’entraîneur'];
      const sp = this._pick(speakers);
      const items = [
        {
          sentence: `${sp} demanda aux élèves : <mark>« Avez-vous relu votre copie attentivement ? »</mark>`,
          answer: `${sp} demanda aux élèves s’ils avaient relu leur copie attentivement.`,
          others: [
            `${sp} demanda aux élèves qu’ils avaient relu leur copie attentivement.`,
            `${sp} demanda aux élèves si avaient-ils relu leur copie attentivement.`,
            `${sp} demanda aux élèves s’ils ont relu leur copie attentivement.`
          ],
          rule: 'Interrogation totale = conjonction « si » sans inversion du sujet, + concordance des temps (passé composé → plus-que-parfait).'
        },
        {
          sentence: `${sp} promit à la classe : <mark>« Nous corrigerons cet exercice demain. »</mark>`,
          answer: `${sp} promit à la classe qu’ils corrigeraient cet exercice le lendemain.`,
          others: [
            `${sp} promit à la classe qu’ils corrigeront cet exercice demain.`,
            `${sp} promit à la classe qu’ils corrigeaient cet exercice hier.`,
            `${sp} promit à la classe si ils corrigeraient cet exercice le lendemain.`
          ],
          rule: 'Avec un verbe introducteur au passé (« promit »), le futur (« corrigerons ») passe au conditionnel présent et « demain » devient « le lendemain ».'
        },
        {
          sentence: `${sp} ordonna aux participants : <mark>« Vérifiez vos accords avant de rendre la feuille ! »</mark>`,
          answer: `${sp} ordonna aux participants de vérifier leurs accords avant de rendre la feuille.`,
          others: [
            `${sp} ordonna aux participants qu’ils vérifient vos accords avant de rendre la feuille.`,
            `${sp} ordonna aux participants si vérifiaient leurs accords.`,
            `${sp} ordonna aux participants vérifiez leurs accords.`
          ],
          rule: 'L’impératif du discours direct se transpose le plus souvent par « de + infinitif » au discours indirect.'
        }
      ];
      const pick = this._pick(items);
      return this._buildMcq(id, '⚡ [Exercice Généré] Choisissez la transposition exacte au discours indirect :', pick.sentence, pick.answer, pick.others, pick.rule);
    }

    if (moduleId === 'figures') {
      const items = [
        {
          sentence: '« Je meurs de soif <mark>auprès de la fontaine</mark>. » (François Villon)',
          answer: 'Une antithèse',
          others: ['Une métaphore', 'Une anaphore', 'Un euphémisme'],
          rule: 'Deux réalités opposées (« meurs de soif » et « fontaine ») sont mises en contraste dans le même énoncé : antithèse.'
        },
        {
          sentence: '« Cet élève a versé <mark>des torrents de larmes</mark> en terminant ce récit. »',
          answer: 'Une hyperbole',
          others: ['Une litote', 'Un oxymore', 'Une métonymie'],
          rule: 'L’expression « des torrents de larmes » exagère volontairement la réalité pour frapper le lecteur : hyperbole.'
        },
        {
          sentence: '« Toute la ville de <mark>Lausanne</mark> applaudissait les jeunes musiciens. »',
          answer: 'Une métonymie',
          others: ['Une comparaison', 'Un chiasme', 'Une antiphrase'],
          rule: 'On désigne les habitants par le nom du lieu qu’ils occupent (« Lausanne ») : métonymie.'
        },
        {
          sentence: '« Ce vieux château dressait <mark>un silence assourdissant</mark> face au glacier. »',
          answer: 'Un oxymore',
          others: ['Une comparaison', 'Une périphrase', 'Une personnification'],
          rule: 'Deux mots directement contraires (« silence » et « assourdissant ») sont soudés dans le même groupe nominal : oxymore.'
        },
        {
          sentence: '« <mark>Le roi des animaux</mark> observa longuement la savane depuis le rocher. »',
          answer: 'Une périphrase',
          others: ['Une anaphore', 'Une antithèse', 'Un oxymore'],
          rule: 'Remplacer un nom simple (« le lion ») par une expression descriptive imagée constitue une périphrase.'
        }
      ];
      const pick = this._pick(items);
      return this._buildMcq(id, '⚡ [Exercice Généré] Identifiez la figure de style mise en évidence :', pick.sentence, pick.answer, pick.others, pick.rule);
    }

    if (moduleId === 'conjugaison') {
      const items = [
        {
          sentence: '« L’eau bout <mark>toujours à 100 °C</mark> à la pression normale. »',
          answer: 'Présent de vérité générale (gnomique)',
          others: ['Présent d’énonciation', 'Présent de narration', 'Futur proche'],
          rule: 'Ce présent énonce une loi scientifique ou un fait valable de tout temps : présent de vérité générale.'
        },
        {
          sentence: '« Chaque été, nous <mark>traversions</mark> le lac à bord d’un vieux dériveur. »',
          answer: 'Imparfait d’habitude (itératif)',
          others: ['Passé simple de premier plan', 'Imparfait de politesse', 'Conditionnel passé'],
          rule: 'L’indicateur « Chaque été » montre que l’action se répétait régulièrement dans le passé : imparfait d’habitude.'
        },
        {
          sentence: '« En 1815, l’éruption du Tambora <mark>bouleversa</mark> le climat suisse durant l’été 1816. »',
          answer: 'Passé simple de premier plan (événement historique borné)',
          others: ['Imparfait descriptif d’arrière-plan', 'Présent historique', 'Plus-que-parfait d’antériorité'],
          rule: 'Action datée, ponctuelle et achevée qui fait progresser la chronologie : passé simple de premier plan.'
        },
        {
          sentence: '« Pourriez-vous <mark>me transmettre</mark> la consigne de l’atelier ? »',
          answer: 'Conditionnel présent d’atténuation (politesse)',
          others: ['Conditionnel d’incertitude journalistique', 'Futur dans le passé', 'Impératif présent'],
          rule: 'Le conditionnel adoucit une demande formulée à l’interlocuteur : valeur de politesse / atténuation.'
        }
      ];
      const pick = this._pick(items);
      return this._buildMcq(id, '⚡ [Exercice Généré] Quelle est la valeur exacte du temps employé ?', pick.sentence, pick.answer, pick.others, pick.rule);
    }

    if (moduleId === 'orthographe') {
      const nounsF = ['les pommes du Valais', 'les lettres anciennes', 'les fiches de révision', 'les chansons romandes'];
      const nounF = this._pick(nounsF);
      const items = [
        {
          sentence: `${nounF.charAt(0).toUpperCase() + nounF.slice(1)} que j’ai <mark>...</mark> ce matin sont déjà prêtes.`,
          answer: 'préparées (féminin pluriel — CDV « que » placé avant)',
          others: ['préparé (invariable)', 'préparés (masculin pluriel)', 'préparée (féminin singulier)'],
          rule: `Avec « avoir », le participe passé s’accorde avec le CDV placé avant le verbe : « que » reprend « ${nounF} » (féminin pluriel) → « préparées ».`
        },
        {
          sentence: 'Ces deux gymnasiens se sont <mark>...</mark> pendant toute la récréation.',
          answer: 'parlé (invariable — parler À quelqu’un = CIV)',
          others: ['parlés (masculin pluriel)', 'parlées (féminin pluriel)', 'parler (infinitif)'],
          rule: 'On dit « parler À quelqu’un » : « se » occupe la fonction de CIV, donc le participe passé reste invariable (« parlé ») !'
        },
        {
          sentence: 'Elle s’est <mark>...</mark> très tôt pour réviser avant l’épreuve.',
          answer: 'levée (féminin singulier — « se » = CDV)',
          others: ['levé (invariable)', 'levés (masculin pluriel)', 'lever (infinitif)'],
          rule: '« Elle a levé qui ? se (elle-même) ». Le pronom réfléchi « se » étant CDV placé avant le verbe, le participe passé s’accorde avec « se / Elle » → « levée ».'
        },
        {
          sentence: 'Des erreurs d’accord, il n’en a presque jamais <mark>...</mark> dans ses copies.',
          answer: 'commis (invariable après le pronom « en »)',
          others: ['commises (féminin pluriel)', 'commise (féminin singulier)', 'commettre (infinitif)'],
          rule: 'Règle classique du Certificat vaudois : avec le pronom neutre « en » (en tant que CDV), le participe passé employé avec « avoir » reste invariable !'
        }
      ];
      const pick = this._pick(items);
      return this._buildMcq(id, '⚡ [Exercice Généré] Choisissez l’accord exact du participe passé selon le PER :', pick.sentence, pick.answer, pick.others, pick.rule);
    }

    if (moduleId === 'nebensaetze') {
      const items = [
        {
          sentence: 'Ich bleibe heute zu Hause, <mark>...</mark>',
          answer: 'weil ich mich auf die Deutschprüfung vorbereiten muss.',
          others: [
            'weil ich muss mich auf die Deutschprüfung vorbereiten.',
            'weil mich auf die Deutschprüfung vorbereiten muss ich.',
            'obwohl bereite ich mich auf die Prüfung vor.'
          ],
          rule: 'Après « weil », le verbe conjugué (« muss ») passe obligatoirement en toute fin de proposition subordonnée.'
        },
        {
          sentence: 'Quand j’étais enfant (événement continu/répété ou unique ?), chaque été à Verbier :',
          answer: 'Immer wenn ich als Kind im Sommer in Verbier war, wanderten wir viel.',
          others: [
            'Immer als ich im Sommer in Verbier war, wanderten wir viel.',
            'Immer dass ich in Verbier war, wir wanderten viel.',
            'Immer wenn war ich in Verbier, wanderten wir viel.'
          ],
          rule: 'Avec une action répétée dans le passé (« immer ... »), l’allemand utilise « wenn », et non « als » (réservé à l’événement unique).'
        }
      ];
      const pick = this._pick(items);
      return this._buildMcq(id, '⚡ [Exercice Généré — Allemand] Choisissez la syntaxe correcte :', pick.sentence, pick.answer, pick.others, pick.rule);
    }

    if (moduleId === 'perfekt_praeteritum') {
      const items = [
        {
          sentence: 'Letzten Sommer <mark>...</mark> wir mit dem Zug bis nach Brig <mark>...</mark>.',
          answer: 'sind ... gefahren',
          others: ['haben ... gefahren', 'sind ... gefahrt', 'haben ... gefahrt'],
          rule: '« fahren » indique un déplacement : auxiliaire « sein » (« wir sind ») + Partizip II fort « gefahren ».'
        },
        {
          sentence: 'Der Schüler <mark>...</mark> diese schwierige Frage leider nicht <mark>...</mark>.',
          answer: 'hat ... verstanden',
          others: ['hat ... geverstanden', 'ist ... verstanden', 'hat ... verstandet'],
          rule: 'Le préfixe « ver- » est inséparable : aucun « ge- » devant le radical → « hat ... verstanden ».'
        }
      ];
      const pick = this._pick(items);
      return this._buildMcq(id, '⚡ [Exercice Généré — Perfekt] Complétez exactement :', pick.sentence, pick.answer, pick.others, pick.rule);
    }

    if (moduleId === 'kasus_praep') {
      const items = [
        {
          sentence: 'Das Buch liegt ruhig auf <mark>...</mark> Schreibtisch (der Schreibtisch).',
          answer: 'dem (Wo? → Dativ statique)',
          others: ['den (Wohin? → Akkusativ)', 'der (Nominativ)', 'des (Genitiv)'],
          rule: 'Avec « liegen » (position statique, question Wo?), la préposition mixte « auf » régit le Dativ (« dem Schreibtisch »).'
        },
        {
          sentence: 'Ich danke Ihnen herzlich für <mark>...</mark> schnelle Hilfe (die Hilfe).',
          answer: 'Ihre / die (Akkusativ féminin)',
          others: ['Ihrer (Dativ féminin)', 'Ihrem (Dativ neutre)', 'Ihren (Dativ pluriel)'],
          rule: '« für » exige l’Akkusativ ! Au féminin singulier, die / Ihre ne change pas (« für die / Ihre schnelle Hilfe »).'
        }
      ];
      const pick = this._pick(items);
      return this._buildMcq(id, '⚡ [Exercice Généré — Kasus] Sélectionnez la bonne terminaison :', pick.sentence, pick.answer, pick.others, pick.rule);
    }

    if (moduleId === 'wortschatz') {
      const items = [
        {
          sentence: 'Comment traduire « devenir gymnasiens » sans tomber dans le faux-ami « bekommen » ?',
          answer: 'Gymnasiastinnen und Gymnasiasten werden',
          others: ['Gymnasiasten bekommen', 'Gymnasiasten verpassen', 'Gymnasiasten sparen'],
          rule: '« devenir » = werden ! (« bekommen » signifie recevoir / obtenir).'
        },
        {
          sentence: 'Quel connecteur convient : « Le temps était mauvais ; pourtant / malgré cela, nous sommes partis » ?',
          answer: 'trotzdem',
          others: ['deshalb', 'außerdem', 'sondern'],
          rule: '« trotzdem » = malgré cela / pourtant (concession), tandis que « deshalb » exprime la conséquence.'
        }
      ];
      const pick = this._pick(items);
      return this._buildMcq(id, '⚡ [Exercice Généré — Wortschatz] Choisissez l’équivalent exact :', pick.sentence, pick.answer, pick.others, pick.rule);
    }

    // Default: argumentation module
    const items = [
      {
        sentence: 'Il a travaillé avec régularité ; <mark>par conséquent</mark>, ses résultats au Certificat ont progressé.',
        answer: 'La conséquence',
        others: ['La cause', 'L’opposition', 'L’hypothèse'],
        rule: '« Par conséquent », « c’est pourquoi » et « donc » introduisent l’effet ou le résultat d’un fait : la conséquence.'
      },
      {
        sentence: '<mark>Certes</mark>, ce roman est dense, mais il offre une réflexion passionnante sur la liberté.',
        answer: 'La concession (étape préalable à la réfutation)',
        others: ['La conclusion finale', 'La comparaison littéraire', 'La narration chronologique'],
        rule: '« Certes... mais... » permet de reconnaître la part de vérité de l’opinion adverse avant de la nuancer ou de la réfuter.'
      },
      {
        sentence: '<mark>D’une part</mark>, les transports publics réduisent les émissions ; <mark>d’autre part</mark>, ils désengorgent Lausanne.',
        answer: 'L’addition / l’organisation ordonnée de deux arguments',
        others: ['L’exclusion totale', 'La concession réfutée', 'Le rapport de cause à effet'],
        rule: 'Les paires « D’une part... d’autre part... » ou « Premièrement... ensuite... » structurent clairement les paragraphes du développement.'
      }
    ];
    const pick = this._pick(items);
    return this._buildMcq(id, '⚡ [Exercice Généré] Quelle relation logique ce connecteur exprime-t-il ?', pick.sentence, pick.answer, pick.others, pick.rule);
  }
};
