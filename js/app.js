/* ==========================================================================
   Main Application Controller — Objectif Gymnase (11e VP Vaud)
   Version: v1.1.0
   Includes:
   - Full App Parametrization (Themes, Subjects, Topic Focus)
   - Official PER Aide-Mémoire Theory Drawer (Khan Academy Pattern)
   - Spaced Repetition Mistake Queue "Mes erreurs" (Anki/Voltaire Pattern)
   - Infinite Procedural PER Exercise Generation
   - In-App Version & Backlog Tracker
   ========================================================================== */

const CURRICULUM_DATA = window.CURRICULUM_DATA;
const VAUD_QUEST_STATIONS = window.VAUD_QUEST_STATIONS;
const INITIAL_LEADERBOARD = window.INITIAL_LEADERBOARD;
const VaudAICoach = window.VaudAICoach;
const PERExerciseGenerator = window.PERExerciseGenerator;

class ObjectifGymnaseApp {
  constructor() {
    const savedSubjects = JSON.parse(localStorage.getItem('vaud_enabled_subjects') || '["francais", "allemand"]');
    const defaultFrancaisFocus = CURRICULUM_DATA.francais.modules.map(m => m.id);
    const savedFocus = JSON.parse(localStorage.getItem('vaud_focused_modules') || JSON.stringify(defaultFrancaisFocus));
    const savedMistakes = JSON.parse(localStorage.getItem('vaud_mistake_questions') || '[]');

    // Ensure newly added v1.1.0 modules are included if user had older 4-module list
    const mergedFocus = [...new Set([...savedFocus, ...defaultFrancaisFocus.filter(id => !localStorage.getItem('vaud_focused_customized'))])];

    this.state = {
      vibe: localStorage.getItem('vaud_vibe') || 'academic',
      enabledSubjects: savedSubjects.length ? savedSubjects : ['francais'],
      focusedModules: mergedFocus.length ? mergedFocus : defaultFrancaisFocus,
      mistakeQuestions: savedMistakes,
      subject: 'francais',
      activeModuleId: mergedFocus[0] || 'subordonnees',
      currentQuestionIndex: 0,
      exerciseMode: 'all', // 'all' | 'surgery' | 'mistakes' | 'sprint'
      theoryOpen: false,
      xp: parseInt(localStorage.getItem('vaud_xp') || '340', 10),
      streak: parseInt(localStorage.getItem('vaud_streak') || '5', 10),
      answeredCount: parseInt(localStorage.getItem('vaud_answered') || '18', 10),
      correctCount: parseInt(localStorage.getItem('vaud_correct') || '15', 10),
      answeredCurrent: false,
      sprintTimer: null,
      sprintSecondsLeft: 60,
      leaderboard: [...INITIAL_LEADERBOARD]
    };

    this.aiCoach = new VaudAICoach();
    this.init();
  }

  init() {
    this.applyVibe(this.state.vibe);
    this.bindGlobalEvents();
    this.renderAll();
  }

  /* ------------------------------------------------------------------------
     Theme / Vibe Parametrization
     ------------------------------------------------------------------------ */
  applyVibe(vibeName) {
    this.state.vibe = vibeName;
    localStorage.setItem('vaud_vibe', vibeName);
    document.documentElement.setAttribute('data-vibe', vibeName);

    const vibeDescriptions = {
      academic: {
        badge: '🇨🇭 Canton de Vaud • 11e VP',
        title: 'Objectif Gymnase — Espace Révision PER',
        subtitle: 'Entraîne-toi gratuitement sur le programme officiel vaudois (PER) avec Aide-Mémoire, répétition espacée et Coach IA.'
      },
      quest: {
        badge: '🗺️ Quête du Léman • 11e VP',
        title: 'L’Odyssée du Certificat : De Nyon à Montreux',
        subtitle: 'Gagne des XP à chaque gare vaudoise pour débloquer le Boss Final du Certificat 11e VP !'
      },
      studio: {
        badge: '⚡ Focus Studio • PER L1/L2',
        title: 'Session Haute Concentration — Certificat VP',
        subtitle: 'Utilise les raccourcis clavier [1-4] pour enchaîner les analyses syntaxiques et optimiser ton score de maîtrise.'
      }
    };

    const info = vibeDescriptions[vibeName] || vibeDescriptions.academic;
    const badgeEl = document.getElementById('top-vibe-badge');
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');

    if (badgeEl) badgeEl.textContent = info.badge;
    if (heroTitle) heroTitle.textContent = info.title;
    if (heroSubtitle) heroSubtitle.textContent = info.subtitle;

    this.renderQuestMap();
    this.renderStudioMetrics();
  }

  /* ------------------------------------------------------------------------
     Filtered Modules Helper (Topic Focus Parametrization)
     ------------------------------------------------------------------------ */
  getVisibleModulesForSubject(subjKey = this.state.subject) {
    const subjectData = CURRICULUM_DATA[subjKey];
    if (!subjectData) return [];
    if (subjKey !== 'francais') return subjectData.modules;

    const filtered = subjectData.modules.filter(m => this.state.focusedModules.includes(m.id));
    return filtered.length > 0 ? filtered : [subjectData.modules[0]];
  }

  /* ------------------------------------------------------------------------
     Render Orchestration
     ------------------------------------------------------------------------ */
  renderAll() {
    this.renderHeaderStats();
    this.renderSubjectTabs();
    this.renderSidebarModules();
    this.renderQuestMap();
    this.renderStudioMetrics();
    this.renderModuleGrid();
    this.renderArena();
    this.renderLeaderboard();
  }

  renderHeaderStats() {
    document.getElementById('stat-xp').textContent = `${this.state.xp} XP`;
    document.getElementById('stat-streak').textContent = `${this.state.streak} j. série`;

    const visibleModules = this.getVisibleModulesForSubject('francais');
    const totalQ = visibleModules.reduce((acc, m) => acc + m.questions.length, 0);
    const summaryEl = document.getElementById('active-focus-summary');
    if (summaryEl) {
      summaryEl.textContent = `Focus : ${visibleModules.length}/${CURRICULUM_DATA.francais.modules.length} chapitres PER (${totalQ} ex. + Générateur infini)`;
    }

    const mistakesPill = document.getElementById('mistakes-mode-pill');
    if (mistakesPill) {
      mistakesPill.textContent = `🔁 Mes erreurs (${this.state.mistakeQuestions.length})`;
    }

    const pct = Math.min(100, Math.round((this.state.xp / 600) * 100));
    const fill = document.getElementById('readiness-bar-fill');
    const lbl = document.getElementById('readiness-pct-label');
    if (fill) fill.style.width = `${pct}%`;
    if (lbl) lbl.textContent = `${pct}% prêt pour le Certificat (${this.state.xp} / 600 XP)`;
  }

  renderSubjectTabs() {
    const container = document.getElementById('subject-tabs-container');
    if (!container) return;

    const subjectMeta = [
      { id: 'francais', label: '📘 Français' },
      { id: 'allemand', label: '🇩🇪 Allemand (Aperçu)' }
    ];

    const activeList = subjectMeta.filter(s => this.state.enabledSubjects.includes(s.id));
    container.style.gridTemplateColumns = activeList.length === 1 ? '1fr' : '1fr 1fr';

    container.innerHTML = activeList.map(s => `
      <button class="subject-tab ${this.state.subject === s.id ? 'active' : ''}" data-subject="${s.id}">
        ${s.label}
      </button>
    `).join('');

    container.querySelectorAll('.subject-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const subj = tab.dataset.subject;
        this.state.subject = subj;
        const mods = this.getVisibleModulesForSubject(subj);
        this.state.activeModuleId = mods[0].id;
        this.state.currentQuestionIndex = 0;
        this.renderAll();
      });
    });
  }

  renderQuestMap() {
    const container = document.getElementById('quest-stations-track');
    if (!container) return;

    container.innerHTML = VAUD_QUEST_STATIONS.map((st, idx) => {
      const unlocked = this.state.xp >= st.xpRequired;
      const nextStation = VAUD_QUEST_STATIONS[idx + 1];
      const isCurrent = unlocked && (!nextStation || this.state.xp < nextStation.xpRequired);
      const statusClass = isCurrent ? 'current' : (unlocked ? 'completed' : '');
      const icon = isCurrent ? '🚂' : (unlocked ? '✓' : '🔒');

      return `
        <div class="quest-station ${statusClass}" data-station="${st.id}" title="${st.xpRequired} XP requis">
          <div class="station-node">${icon}</div>
          <span class="station-name">${st.city}</span>
          <span class="station-topic">${st.topic} (${st.xpRequired} XP)</span>
        </div>
      `;
    }).join('');
  }

  renderStudioMetrics() {
    const accuracy = this.state.answeredCount > 0
      ? Math.round((this.state.correctCount / this.state.answeredCount) * 100)
      : 100;
    const accEl = document.getElementById('studio-accuracy');
    const ansEl = document.getElementById('studio-answered');
    const rankEl = document.getElementById('studio-rank');

    if (accEl) accEl.textContent = `${accuracy}%`;
    if (ansEl) ansEl.textContent = `${this.state.answeredCount}`;

    const sorted = [...this.state.leaderboard].sort((a, b) => b.xp - a.xp);
    const myRank = sorted.findIndex(r => r.isMe) + 1;
    if (rankEl) rankEl.textContent = `#${myRank} Vaud`;
  }

  renderSidebarModules() {
    const visibleModules = this.getVisibleModulesForSubject();
    const navContainer = document.getElementById('module-nav-list');
    if (!navContainer) return;

    if (!visibleModules.some(m => m.id === this.state.activeModuleId)) {
      this.state.activeModuleId = visibleModules[0]?.id;
    }

    navContainer.innerHTML = visibleModules.map(mod => {
      const isActive = mod.id === this.state.activeModuleId;
      return `
        <button class="nav-item ${isActive ? 'active' : ''}" data-module-id="${mod.id}">
          <span class="nav-item-left">
            <span>${mod.icon}</span>
            <span>${mod.title.split('(')[0].trim()}</span>
          </span>
          <span class="nav-badge">${mod.questions.length} Q</span>
        </button>
      `;
    }).join('');

    navContainer.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectModule(btn.dataset.moduleId);
      });
    });
  }

  renderModuleGrid() {
    const visibleModules = this.getVisibleModulesForSubject();
    const grid = document.getElementById('modules-overview-grid');
    if (!grid) return;

    grid.innerHTML = visibleModules.map(mod => `
      <div class="module-card" data-module-card="${mod.id}">
        <div>
          <div class="module-card-top">
            <div class="module-icon">${mod.icon}</div>
            <span class="per-tag">${mod.perRef}</span>
          </div>
          <h3 style="margin-top: 12px;">${mod.title}</h3>
          <p>${mod.description}</p>
        </div>
        <div class="module-card-footer">
          <span>📍 Étape : ${mod.station} • ${mod.questions.length} exercices</span>
          <span class="play-link">S’entraîner →</span>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.module-card').forEach(card => {
      card.addEventListener('click', () => {
        this.selectModule(card.dataset.moduleCard);
        document.getElementById('arena-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  selectModule(moduleId) {
    this.state.activeModuleId = moduleId;
    this.state.currentQuestionIndex = 0;
    this.state.answeredCurrent = false;
    this.renderSidebarModules();
    this.renderArena();
  }

  getActiveModule() {
    const visibleModules = this.getVisibleModulesForSubject();
    return visibleModules.find(m => m.id === this.state.activeModuleId) || visibleModules[0];
  }

  getFilteredQuestions() {
    const mod = this.getActiveModule();
    if (this.state.exerciseMode === 'mistakes' && this.state.mistakeQuestions.length > 0) {
      return this.state.mistakeQuestions;
    }
    if (this.state.exerciseMode === 'surgery') {
      const surgeryQs = mod.questions.filter(q => q.type === 'surgery');
      return surgeryQs.length ? surgeryQs : mod.questions;
    }
    return mod.questions;
  }

  /* ------------------------------------------------------------------------
     Infinite Exercise Generator Action
     ------------------------------------------------------------------------ */
  generateAndOpenNewExercise() {
    const mod = this.getActiveModule();
    if (!mod || !PERExerciseGenerator) return;

    const newQ = PERExerciseGenerator.generateForModule(mod.id);
    mod.questions.push(newQ);
    this.state.exerciseMode = 'all';
    document.querySelectorAll('.mode-pill[data-mode]').forEach(p => {
      p.classList.toggle('active', p.dataset.mode === 'all');
    });

    this.state.currentQuestionIndex = mod.questions.length - 1;
    this.renderHeaderStats();
    this.renderSidebarModules();
    this.renderModuleGrid();
    this.renderArena();
  }

  /* ------------------------------------------------------------------------
     Interactive Exercise Arena + Official PER Theory Sheet
     ------------------------------------------------------------------------ */
  renderTheoryDrawer() {
    const mod = this.getActiveModule();
    const drawer = document.getElementById('theory-sheet-drawer');
    const titleEl = document.getElementById('theory-sheet-title');
    const listEl = document.getElementById('theory-points-list');
    const toggleBtn = document.getElementById('toggle-theory-btn');

    if (!drawer || !mod?.theorySheet) return;

    titleEl.textContent = `📖 ${mod.theorySheet.title}`;
    listEl.innerHTML = mod.theorySheet.points.map(pt => `<li>${pt}</li>`).join('');
    drawer.classList.toggle('open', this.state.theoryOpen);
    if (toggleBtn) toggleBtn.classList.toggle('active', this.state.theoryOpen);
  }

  renderArena() {
    const mod = this.getActiveModule();
    const questions = this.getFilteredQuestions();
    const idx = this.state.currentQuestionIndex % questions.length;
    const q = questions[idx];
    this.currentQuestion = q;
    this.state.answeredCurrent = false;

    document.getElementById('arena-module-title').textContent = `${mod.icon} ${mod.title}`;
    document.getElementById('arena-per-ref').textContent = mod.perRef;

    const modeTag = this.state.exerciseMode === 'mistakes'
      ? '• 🔁 Mode Répétition Espacée (Mes erreurs)'
      : (q.isGenerated ? '• ✨ Générée dynamiquement' : '');
    document.getElementById('question-counter').textContent = `Question ${idx + 1} sur ${questions.length} ${modeTag}`;
    document.getElementById('question-prompt').textContent = q.prompt;

    this.renderTheoryDrawer();

    const showcaseEl = document.getElementById('sentence-showcase');
    const surgeryContainer = document.getElementById('surgery-container');
    const optionsContainer = document.getElementById('options-container');
    const feedbackBanner = document.getElementById('feedback-banner');

    feedbackBanner.classList.remove('visible');

    if (q.type === 'surgery') {
      showcaseEl.style.display = 'none';
      optionsContainer.style.display = 'none';
      surgeryContainer.style.display = 'flex';
      surgeryContainer.innerHTML = q.tokens.map((tok, i) => `
        <button class="surgery-token" data-token-idx="${i}">
          ${tok}
        </button>
      `).join('');

      surgeryContainer.querySelectorAll('.surgery-token').forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.state.answeredCurrent) return;
          const chosen = parseInt(btn.dataset.tokenIdx, 10);
          this.handleAnswer(chosen === q.correctTokenIndex, btn, surgeryContainer.querySelectorAll('.surgery-token'), q.correctTokenIndex);
        });
      });
    } else {
      showcaseEl.style.display = 'block';
      showcaseEl.innerHTML = q.sentence;
      surgeryContainer.style.display = 'none';
      optionsContainer.style.display = 'grid';

      optionsContainer.innerHTML = q.options.map((opt, i) => `
        <button class="option-btn" data-opt-idx="${i}">
          <span>${opt}</span>
          <span class="key-hint">${i + 1}</span>
        </button>
      `).join('');

      optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.state.answeredCurrent) return;
          const chosen = parseInt(btn.dataset.optIdx, 10);
          this.handleAnswer(chosen === q.correctIndex, btn, optionsContainer.querySelectorAll('.option-btn'), q.correctIndex);
        });
      });
    }
  }

  handleAnswer(isCorrect, clickedEl, allButtons, correctIdx) {
    this.state.answeredCurrent = true;
    this.state.answeredCount += 1;

    allButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) {
        btn.classList.add('correct');
      }
    });

    const feedbackBanner = document.getElementById('feedback-banner');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackRule = document.getElementById('feedback-rule');

    if (isCorrect) {
      clickedEl.classList.add('correct');
      const gainedXp = this.state.exerciseMode === 'sprint' ? 35 : 25;
      this.state.xp += gainedXp;
      this.state.correctCount += 1;

      // Remove from Spaced Repetition Mistake Queue if mastered
      const beforeLen = this.state.mistakeQuestions.length;
      this.state.mistakeQuestions = this.state.mistakeQuestions.filter(item => item.id !== this.currentQuestion.id);
      localStorage.setItem('vaud_mistake_questions', JSON.stringify(this.state.mistakeQuestions));

      const clearedNote = beforeLen > this.state.mistakeQuestions.length
        ? ' • 🎯 Erreur maîtrisée et retirée de ta liste !'
        : '';
      feedbackTitle.innerHTML = `✅ Excellent ! +${gainedXp} XP (Conforme au PER Vaud)${clearedNote}`;
      feedbackTitle.style.color = '#10b981';
    } else {
      clickedEl.classList.add('wrong');
      // Add to Spaced Repetition Mistake Queue if not already present
      if (!this.state.mistakeQuestions.some(item => item.id === this.currentQuestion.id)) {
        this.state.mistakeQuestions.push(this.currentQuestion);
        localStorage.setItem('vaud_mistake_questions', JSON.stringify(this.state.mistakeQuestions));
      }
      feedbackTitle.innerHTML = `❌ Pas tout à fait — Ajouté à « 🔁 Mes erreurs » pour révision espacée :`;
      feedbackTitle.style.color = '#f43f5e';
    }

    feedbackRule.textContent = this.currentQuestion.perRule;
    feedbackBanner.classList.add('visible');

    localStorage.setItem('vaud_xp', String(this.state.xp));
    localStorage.setItem('vaud_answered', String(this.state.answeredCount));
    localStorage.setItem('vaud_correct', String(this.state.correctCount));

    const meRow = this.state.leaderboard.find(r => r.isMe);
    if (meRow) meRow.xp = this.state.xp;

    this.renderHeaderStats();
    this.renderQuestMap();
    this.renderStudioMetrics();
    this.renderLeaderboard();
  }

  nextQuestion() {
    if (this.state.exerciseMode === 'mistakes' && this.state.mistakeQuestions.length === 0) {
      this.state.exerciseMode = 'all';
      document.querySelectorAll('.mode-pill[data-mode]').forEach(p => {
        p.classList.toggle('active', p.dataset.mode === 'all');
      });
    }
    const questions = this.getFilteredQuestions();
    this.state.currentQuestionIndex = (this.state.currentQuestionIndex + 1) % questions.length;
    this.renderArena();
  }

  /* ------------------------------------------------------------------------
     Sprint Chrono 60s Mode
     ------------------------------------------------------------------------ */
  startSprintMode() {
    this.state.exerciseMode = 'sprint';
    this.state.sprintSecondsLeft = 60;
    document.querySelectorAll('.mode-pill[data-mode]').forEach(p => {
      p.classList.toggle('active', p.dataset.mode === 'sprint');
    });

    const timerBadge = document.getElementById('sprint-timer-badge');
    timerBadge.style.display = 'inline-flex';
    timerBadge.textContent = `⏱️ 60s`;

    if (this.state.sprintTimer) clearInterval(this.state.sprintTimer);
    this.state.sprintTimer = setInterval(() => {
      this.state.sprintSecondsLeft -= 1;
      timerBadge.textContent = `⏱️ ${this.state.sprintSecondsLeft}s`;
      if (this.state.sprintSecondsLeft <= 0) {
        clearInterval(this.state.sprintTimer);
        timerBadge.textContent = `🏁 Sprint terminé !`;
      }
    }, 1000);

    this.renderArena();
    document.getElementById('arena-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  /* ------------------------------------------------------------------------
     Leaderboard & Unified Modals (Settings + Roadmap/Backlog + Duel + Family)
     ------------------------------------------------------------------------ */
  renderLeaderboard() {
    const listEl = document.getElementById('leaderboard-list');
    if (!listEl) return;

    const sorted = [...this.state.leaderboard].sort((a, b) => b.xp - a.xp);
    listEl.innerHTML = sorted.map((user, idx) => `
      <div class="leader-row ${user.isMe ? 'me' : ''}">
        <div class="leader-left">
          <span class="rank-num">${idx + 1}</span>
          <span>${user.avatar} ${user.name}</span>
        </div>
        <span>${user.xp} XP</span>
      </div>
    `).join('');
  }

  openModal(type) {
    const backdrop = document.getElementById('social-modal-backdrop');
    const content = document.getElementById('social-modal-content');
    if (!backdrop || !content) return;

    const accuracy = this.state.answeredCount > 0
      ? Math.round((this.state.correctCount / this.state.answeredCount) * 100)
      : 100;

    if (type === 'roadmap') {
      content.innerHTML = `
        <h3 style="font-size:1.22rem; font-weight:800;">📋 Suivi des Versions & Backlog (v1.1.0)</h3>
        <p style="font-size:0.84rem; color:var(--text-secondary); margin-top:4px;">
          Plateforme 100% gratuite et open-source dédiée aux élèves de 11e VP du Canton de Vaud.
        </p>

        <div class="settings-section">
          <h4>✅ Livré dans la version actuelle (v1.1.0)</h4>
          <ul class="theory-points-list" style="margin-top:8px;">
            <li><strong>6 Chapitres Officiels Français 11e VP (PER L1 31-38)</strong> : Subordonnées, Fonctions PER (CP/CDV/CIV), Discours rapporté, Conjugaison & Valeurs des temps, Figures de style, Texte argumentatif.</li>
            <li><strong>📖 Aide-Mémoire PER intégré (Inspiré de Khan Academy)</strong> : Fiche de théorie officielle consultable en 1 clic pendant chaque exercice.</li>
            <li><strong>🔁 Répétition Espacée « Mes erreurs » (Inspiré d’Anki / Projet Voltaire)</strong> : File d’attente automatique des questions ratées jusqu’à maîtrise complète.</li>
            <li><strong>⚙️ Paramètres & Focus Personnalisé</strong> : Choix du thème visuel (Neo-Academic, Quest Map, Focus Studio), activation de l’Allemand (aperçu) et filtrage des chapitres ciblés.</li>
            <li><strong>✨ Générateur Procédural Infini + Coach IA Gratuit</strong> : Création d’exercices à la volée et diagnostic de paragraphes argumentatifs.</li>
          </ul>
        </div>

        <div class="settings-section">
          <h4>🚀 Backlog Priorisé (Prochaines Versions)</h4>
          <ul class="theory-points-list" style="margin-top:8px;">
            <li><strong>v1.2.0 — Mode « Examen Blanc du Certificat Vaud »</strong> : Simulation complète chronométrée (texte littéraire + questions de compréhension + rédaction argumentative guidée).</li>
            <li><strong>v1.3.0 — Module Orthographe & Dictée Interactive PER</strong> : Accord du participe passé (être, avoir, verbes pronominaux) et homophones grammaticaux.</li>
            <li><strong>v1.4.0 — Programme Complet Allemand 11e VP (PER L2)</strong> : Präteritum, Perfekt, Passiv, Relativsätze et vocabulaire thématique officiel.</li>
            <li><strong>v1.5.0 — Mode Multijoueur Temps Réel & Classement Inter-Collèges Vaudois</strong> : Défis en direct par lien partagé sans inscription obligatoire.</li>
          </ul>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:18px;">
          <button class="quick-sprint-btn" id="close-modal-btn">Fermer</button>
        </div>
      `;
    } else if (type === 'settings') {
      const allFrModules = CURRICULUM_DATA.francais.modules;
      const isDeEnabled = this.state.enabledSubjects.includes('allemand');

      content.innerHTML = `
        <h3 style="font-size:1.22rem; font-weight:800;">⚙️ Paramètres & Programme Personnalisé</h3>
        <p style="font-size:0.84rem; color:var(--text-secondary); margin-top:4px;">
          Personnalise l’apparence de ton application, tes branches actives et les chapitres du PER sur lesquels tu veux te concentrer.
        </p>

        <!-- 1. THEME / VIBE PARAMETRIZATION -->
        <div class="settings-section">
          <h4>🎨 1. Thème visuel de l’application</h4>
          <p>Choisis l’ambiance qui te motive le plus pour réviser :</p>
          <div class="theme-cards-grid">
            <button class="theme-choice-card ${this.state.vibe === 'academic' ? 'active' : ''}" data-pick-vibe="academic">
              <strong>🏛️ Neo-Academic</strong>
              <span>Émeraude vaudois & papier clair</span>
            </button>
            <button class="theme-choice-card ${this.state.vibe === 'quest' ? 'active' : ''}" data-pick-vibe="quest">
              <strong>🗺️ Vaud Quest Map</strong>
              <span>Carte RPG Nyon → Montreux</span>
            </button>
            <button class="theme-choice-card ${this.state.vibe === 'studio' ? 'active' : ''}" data-pick-vibe="studio">
              <strong>⚡ Focus Studio</strong>
              <span>Mode sombre & raccourcis clavier</span>
            </button>
          </div>
        </div>

        <!-- 2. SUBJECTS PARAMETRIZATION -->
        <div class="settings-section">
          <h4>📚 2. Branches d’étude (11e VP Vaud)</h4>
          <p>Active ou masque les branches dans ta barre latérale :</p>
          <div class="focus-checklist">
            <label class="focus-check-item">
              <span class="focus-check-left">
                <input type="checkbox" checked disabled />
                <span>📘 Français 11e VP (Programme complet PER L1)</span>
              </span>
              <span class="per-tag">Principal</span>
            </label>
            <label class="focus-check-item">
              <span class="focus-check-left">
                <input type="checkbox" id="toggle-german-subj" ${isDeEnabled ? 'checked' : ''} />
                <span>🇩🇪 Allemand 11e VP (PER L2 — Nebensätze, Perfekt)</span>
              </span>
              <span class="placeholder-pill">Option / Aperçu</span>
            </label>
          </div>
        </div>

        <!-- 3. TOPIC FOCUS PARAMETRIZATION -->
        <div class="settings-section">
          <h4>🎯 3. Chapitres ciblés en Français (Focus du moment)</h4>
          <p>Coche uniquement les sujets de ton prochain test ou du Certificat :</p>
          <div class="focus-checklist" id="focus-topics-checklist">
            ${allFrModules.map(mod => {
              const checked = this.state.focusedModules.includes(mod.id);
              return `
                <label class="focus-check-item">
                  <span class="focus-check-left">
                    <input type="checkbox" class="focus-topic-cb" value="${mod.id}" ${checked ? 'checked' : ''} />
                    <span>${mod.icon} ${mod.title}</span>
                  </span>
                  <span class="per-tag">${mod.questions.length} ex.</span>
                </label>
              `;
            }).join('')}
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:14px; border-top:1px solid var(--border-color);">
          <span style="font-size:0.76rem; color:var(--text-muted);">Version ${window.APP_VERSION || 'v1.1.0'} • Sauvegarde locale auto</span>
          <button class="quick-sprint-btn" id="close-modal-btn">✅ Appliquer & Continuer</button>
        </div>
      `;

      content.querySelectorAll('[data-pick-vibe]').forEach(btn => {
        btn.addEventListener('click', () => {
          const picked = btn.dataset.pickVibe;
          this.applyVibe(picked);
          content.querySelectorAll('[data-pick-vibe]').forEach(b => {
            b.classList.toggle('active', b.dataset.pickVibe === picked);
          });
        });
      });

      content.querySelector('#toggle-german-subj')?.addEventListener('change', (e) => {
        if (e.currentTarget.checked) {
          if (!this.state.enabledSubjects.includes('allemand')) {
            this.state.enabledSubjects.push('allemand');
          }
        } else {
          this.state.enabledSubjects = this.state.enabledSubjects.filter(s => s !== 'allemand');
          if (this.state.subject === 'allemand') {
            this.state.subject = 'francais';
          }
        }
        localStorage.setItem('vaud_enabled_subjects', JSON.stringify(this.state.enabledSubjects));
        this.renderAll();
      });

      content.querySelectorAll('.focus-topic-cb').forEach(cb => {
        cb.addEventListener('change', () => {
          const selected = Array.from(content.querySelectorAll('.focus-topic-cb:checked')).map(el => el.value);
          if (selected.length === 0) {
            cb.checked = true;
            return;
          }
          this.state.focusedModules = selected;
          localStorage.setItem('vaud_focused_customized', 'true');
          localStorage.setItem('vaud_focused_modules', JSON.stringify(selected));
          this.renderAll();
        });
      });

    } else if (type === 'family') {
      content.innerHTML = `
        <h3 style="font-size:1.2rem; font-weight:800;">👨‍👩‍👧‍👦 Partager mon bilan avec ma famille</h3>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:4px;">
          Envoie cette carte récapitulative sur WhatsApp ou iMessage pour montrer ta progression vers le Certificat 11e VP.
        </p>
        <div class="family-share-preview">
          <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.06em; opacity:0.85;">
            🇨🇭 Bilan Hebdomadaire • 11e VP Canton de Vaud
          </div>
          <h4>Objectif Gymnase — Français & Allemand</h4>
          <p style="font-size:0.82rem; opacity:0.9;">Chapitre actif : ${this.getActiveModule().title}</p>
          <div class="family-share-grid">
            <div class="family-stat-box">
              <strong>${this.state.xp} XP</strong>
              <span>Points d'étude</span>
            </div>
            <div class="family-stat-box">
              <strong>${accuracy}%</strong>
              <span>Réussite PER</span>
            </div>
            <div class="family-stat-box">
              <strong>🔥 ${this.state.streak} j.</strong>
              <span>Série régulière</span>
            </div>
          </div>
        </div>
        <div style="display:flex; gap:10px; justify-content:flex-end;">
          <button class="secondary-btn" id="close-modal-btn">Fermer</button>
          <button class="quick-sprint-btn" id="copy-family-msg-btn">📲 Copier pour WhatsApp / Famille</button>
        </div>
      `;

      content.querySelector('#copy-family-msg-btn')?.addEventListener('click', (e) => {
        const shareText = `🇨🇭 Bilan 11e VP (Objectif Gymnase) :\n✅ ${this.state.xp} XP gagnés\n🎯 ${accuracy}% de réussite sur le programme PER (${this.getActiveModule().title})\n🔥 Série de ${this.state.streak} jours consécutifs !`;
        navigator.clipboard?.writeText(shareText);
        e.currentTarget.textContent = '✅ Copié dans le presse-papier !';
      });
    } else {
      const challengeCode = `VD-11VP-${Math.floor(1000 + Math.random() * 9000)}`;
      content.innerHTML = `
        <h3 style="font-size:1.2rem; font-weight:800;">⚔️ Défier un ami en Duel 11e VP</h3>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:4px;">
          Ton ami recevra exactement les 5 mêmes questions sur <strong>${this.getActiveModule().title}</strong> pour voir qui obtient le meilleur score !
        </p>
        <div style="margin:18px 0; padding:16px; border-radius:12px; background:var(--bg-tertiary); border:1px dashed var(--accent-primary); text-align:center;">
          <div style="font-size:0.75rem; color:var(--text-muted);">CODE DE DÉFI SYNCHRONE</div>
          <div style="font-family:var(--font-mono); font-size:1.5rem; font-weight:800; color:var(--accent-primary); margin:6px 0;">
            ${challengeCode}
          </div>
          <div style="font-size:0.78rem; color:var(--text-secondary);">
            Score à battre : <strong>${this.state.xp} XP</strong> • Temps moyen : 14s/question
          </div>
        </div>
        <div style="display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap;">
          <button class="secondary-btn" id="close-modal-btn">Fermer</button>
          <button class="secondary-btn" id="simulate-friend-btn">🤖 Simuler la réponse de Léo</button>
          <button class="quick-sprint-btn" id="copy-duel-btn">🔗 Copier l'invitation Duel</button>
        </div>
      `;

      content.querySelector('#copy-duel-btn')?.addEventListener('click', (e) => {
        const duelText = `⚔️ Je te défie sur Objectif Gymnase (11e VP Vaud) ! Entre le code ${challengeCode} sur le chapitre "${this.getActiveModule().title}" et essaie de battre mes ${this.state.xp} XP !`;
        navigator.clipboard?.writeText(duelText);
        e.currentTarget.textContent = '✅ Lien de défi copié !';
      });

      content.querySelector('#simulate-friend-btn')?.addEventListener('click', (e) => {
        this.state.xp += 30;
        const meRow = this.state.leaderboard.find(r => r.isMe);
        if (meRow) meRow.xp = this.state.xp;
        this.renderHeaderStats();
        this.renderLeaderboard();
        e.currentTarget.textContent = '🏆 Victoire ! Tu as battu Léo (4/5 vs 3/5) → +30 XP !';
      });
    }

    backdrop.classList.add('open');
    content.querySelector('#close-modal-btn')?.addEventListener('click', () => {
      backdrop.classList.remove('open');
    });
  }

  /* ------------------------------------------------------------------------
     AI Coach Chat Interactions
     ------------------------------------------------------------------------ */
  async sendAICoachMessage(messageText) {
    const historyEl = document.getElementById('ai-chat-history');
    const inputEl = document.getElementById('ai-user-input');
    if (!historyEl) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'ai-msg user';
    userMsg.textContent = messageText;
    historyEl.appendChild(userMsg);
    historyEl.scrollTop = historyEl.scrollHeight;

    if (inputEl) inputEl.value = '';

    const reply = await this.aiCoach.askCoach(messageText, this.currentQuestion);
    const botMsg = document.createElement('div');
    botMsg.className = 'ai-msg bot';
    botMsg.innerHTML = reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    historyEl.appendChild(botMsg);
    historyEl.scrollTop = historyEl.scrollHeight;
  }

  /* ------------------------------------------------------------------------
     Event Listeners & Keyboard Shortcuts
     ------------------------------------------------------------------------ */
  bindGlobalEvents() {
    // Settings & Focus Parametrization Triggers
    ['open-settings-btn', 'sidebar-customize-btn', 'hero-settings-btn', 'filter-topics-btn'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', () => {
        this.openModal('settings');
      });
    });

    // Version & Backlog Triggers
    ['version-pill-btn', 'footer-roadmap-btn'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', () => {
        this.openModal('roadmap');
      });
    });

    // Theory Drawer Toggle
    document.getElementById('toggle-theory-btn')?.addEventListener('click', () => {
      this.state.theoryOpen = !this.state.theoryOpen;
      this.renderTheoryDrawer();
    });

    document.getElementById('close-theory-btn')?.addEventListener('click', () => {
      this.state.theoryOpen = false;
      this.renderTheoryDrawer();
    });

    // Exercise Mode Pills
    document.querySelectorAll('.mode-pill[data-mode]').forEach(pill => {
      pill.addEventListener('click', () => {
        const mode = pill.dataset.mode;
        if (mode === 'mistakes' && this.state.mistakeQuestions.length === 0) {
          this.sendAICoachMessage('Tu n’as aucune erreur en attente ! Continue à t’entraîner, les questions ratées s’ajouteront automatiquement ici.');
          return;
        }
        if (mode === 'sprint') {
          this.startSprintMode();
          return;
        }
        if (this.state.sprintTimer) clearInterval(this.state.sprintTimer);
        document.getElementById('sprint-timer-badge').style.display = 'none';

        this.state.exerciseMode = mode;
        this.state.currentQuestionIndex = 0;
        document.querySelectorAll('.mode-pill[data-mode]').forEach(p => {
          p.classList.toggle('active', p.dataset.mode === mode);
        });
        this.renderArena();
      });
    });

    // Next Question, Infinite Generator & Explain Error Buttons
    document.getElementById('next-question-btn')?.addEventListener('click', () => {
      this.nextQuestion();
    });

    document.getElementById('generate-infinite-btn')?.addEventListener('click', () => {
      this.generateAndOpenNewExercise();
    });

    document.getElementById('explain-ai-btn')?.addEventListener('click', () => {
      this.sendAICoachMessage('Explique-moi cette question et la règle du PER Vaud.');
    });

    document.getElementById('hero-sprint-btn')?.addEventListener('click', () => {
      this.startSprintMode();
    });

    // AI Coach Input & Quick Chips
    document.getElementById('ai-send-btn')?.addEventListener('click', () => {
      const val = document.getElementById('ai-user-input')?.value;
      if (val) this.sendAICoachMessage(val);
    });

    document.getElementById('ai-user-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = e.currentTarget.value;
        if (val) this.sendAICoachMessage(val);
      }
    });

    document.querySelectorAll('.ai-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.sendAICoachMessage(chip.dataset.prompt);
      });
    });

    document.getElementById('config-api-key-btn')?.addEventListener('click', () => {
      const current = this.aiCoach.apiKey;
      const entered = window.prompt(
        'Optionnel : Colle une clé API gratuite Google Gemini (AI Studio) pour activer le LLM en direct, ou laisse vide pour utiliser le moteur pédagogique PER Vaud intégré (100% gratuit sans compte) :',
        current
      );
      if (entered !== null) {
        this.aiCoach.setApiKey(entered);
      }
    });

    // Social & Family Modals
    document.getElementById('open-duel-modal-btn')?.addEventListener('click', () => {
      this.openModal('duel');
    });

    document.getElementById('open-family-modal-btn')?.addEventListener('click', () => {
      this.openModal('family');
    });

    document.getElementById('social-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'social-modal-backdrop') {
        e.currentTarget.classList.remove('open');
      }
    });

    // Keyboard Shortcuts [1-4] for Studio Focus Speed
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (['1', '2', '3', '4'].includes(e.key) && !this.state.answeredCurrent) {
        const idx = parseInt(e.key, 10) - 1;
        const buttons = document.querySelectorAll('#options-container .option-btn');
        if (buttons[idx]) buttons[idx].click();
      } else if (e.key === 'Enter' && this.state.answeredCurrent) {
        this.nextQuestion();
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.vaudApp = new ObjectifGymnaseApp();
});
