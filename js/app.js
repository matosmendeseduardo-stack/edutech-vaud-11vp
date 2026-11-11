/* ==========================================================================
   Main Application Controller — Objectif Gymnase (11e VP Vaud)
   Version: v1.3.0 (Firebase Auth & Cloud Firestore + Chapitre 7 Orthographe)
   Includes:
   - 7 Official Français 11e VP Chapters (including Module 7: Orthographe & PP)
   - Student Auth & Profile Modal (nLPD Vaud Quick Pseudo + Email/Google Auth)
   - Automatic Cloud Firestore Profile, Mistake Queue & 1v1 Duel Sync
   - Sticky AI Coach Next to Main Page + Zero-Scroll Exercise Frame
   ========================================================================== */

const CURRICULUM_DATA = window.CURRICULUM_DATA;
const VAUD_QUEST_STATIONS = window.VAUD_QUEST_STATIONS;
const INITIAL_LEADERBOARD = window.INITIAL_LEADERBOARD;
const VaudAICoach = window.VaudAICoach;
const VaudFirebaseService = window.VaudFirebaseService;
const PERExerciseGenerator = window.PERExerciseGenerator;

class ObjectifGymnaseApp {
  constructor() {
    const savedSubjects = JSON.parse(localStorage.getItem('vaud_enabled_subjects') || '["francais", "allemand"]');
    const defaultFrancaisFocus = CURRICULUM_DATA.francais.modules.map(m => m.id);
    const savedFocus = JSON.parse(localStorage.getItem('vaud_focused_modules') || JSON.stringify(defaultFrancaisFocus));
    const savedMistakes = JSON.parse(localStorage.getItem('vaud_mistake_questions') || '[]');

    // Automatically include new v1.3.0 modules (like 'orthographe') unless user customized focus
    const mergedFocus = [
      ...new Set([
        ...savedFocus,
        ...defaultFrancaisFocus.filter(() => !localStorage.getItem('vaud_focused_customized'))
      ])
    ];

    this.state = {
      activeView: 'parcours', // 'parcours' | 'entrainement' | 'defis' | 'parametres'
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
      duelCode: `VD-11VP-${Math.floor(1000 + Math.random() * 9000)}`,
      leaderboard: [...INITIAL_LEADERBOARD],
      currentUser: null,
      isCloudConnected: false
    };

    this.aiCoach = new VaudAICoach();
    this.firebaseService = VaudFirebaseService
      ? new VaudFirebaseService((user, isCloud, cloudProfile) => this.handleAuthStateChanged(user, isCloud, cloudProfile))
      : null;

    this.init();
  }

  init() {
    this.applyVibe(this.state.vibe, false);
    this.bindGlobalEvents();
    this.renderAll();
  }

  /* ------------------------------------------------------------------------
     Firebase Auth & Cloud Profile State Handler
     ------------------------------------------------------------------------ */
  async handleAuthStateChanged(user, isCloudConnected, cloudProfile = null) {
    this.state.currentUser = user;
    this.state.isCloudConnected = Boolean(isCloudConnected);

    // Merge cloud profile stats if higher / available
    if (cloudProfile) {
      if (typeof cloudProfile.xp === 'number' && cloudProfile.xp > this.state.xp) {
        this.state.xp = cloudProfile.xp;
        localStorage.setItem('vaud_xp', String(this.state.xp));
      }
      if (typeof cloudProfile.streak === 'number') {
        this.state.streak = cloudProfile.streak;
        localStorage.setItem('vaud_streak', String(this.state.streak));
      }
    }

    // Update "isMe" entry in leaderboard with student's custom pseudo, avatar & school
    const meRow = this.state.leaderboard.find(r => r.isMe);
    if (meRow) {
      if (user) {
        meRow.name = `${user.pseudo} (${user.etablissement || 'Vaud'})`;
        meRow.avatar = user.avatar || '⚡';
      } else {
        meRow.name = 'Toi (Élève 11e VP)';
        meRow.avatar = '⚡';
      }
      meRow.xp = this.state.xp;
    }

    // If connected to Cloud Firestore, attempt to fetch live leaderboard
    if (this.firebaseService && this.state.isCloudConnected) {
      const cloudRows = await this.firebaseService.fetchLeaderboard();
      if (cloudRows && cloudRows.length > 0) {
        this.state.leaderboard = cloudRows;
      }
    }

    this.renderAuthHeaderPill();
    this.renderHeaderAndReadiness();
    this.renderDefisAndFamilyView();
    this.renderSettingsView();
  }

  renderAuthHeaderPill() {
    const labelEl = document.getElementById('user-auth-label');
    const pillEl = document.getElementById('user-auth-pill');
    if (!labelEl || !pillEl) return;

    const u = this.state.currentUser;
    if (u && u.pseudo) {
      pillEl.innerHTML = `${u.avatar || '⚡'} <span id="user-auth-label">${u.pseudo} (${u.etablissement || 'Vaud'})</span>`;
    } else {
      pillEl.innerHTML = `👤 <span id="user-auth-label">Connexion / Profil</span>`;
    }
  }

  syncStateToCloud() {
    if (!this.firebaseService) return;
    this.firebaseService.syncProfile({
      xp: this.state.xp,
      streak: this.state.streak,
      answeredCount: this.state.answeredCount,
      correctCount: this.state.correctCount,
      vibe: this.state.vibe,
      enabledSubjects: this.state.enabledSubjects,
      focusedModules: this.state.focusedModules
    });
  }

  /* ------------------------------------------------------------------------
     Student Connexion & Profile Modal (nLPD Vaud Pseudo + Email/Google)
     ------------------------------------------------------------------------ */
  openAuthModal() {
    const backdrop = document.getElementById('auth-modal-backdrop');
    const content = document.getElementById('auth-modal-content');
    if (!backdrop || !content) return;

    const u = this.state.currentUser;
    const currentPseudo = u?.pseudo || '';
    const currentSchool = u?.etablissement || 'Collège de Béthusy (Lausanne)';
    const currentAvatar = u?.avatar || '⚡';
    const cloudBadgeText = this.state.isCloudConnected
      ? '☁️ Cloud Firebase Connecté'
      : '💾 Mode Local-First (Conforme nLPD)';

    const avatars = ['⚡', '🦊', '🏔️', '📚', '🎯', '🇨🇭'];
    const schools = [
      'Collège de Béthusy (Lausanne)',
      'Établissement de Nyon-Marens',
      'Morges Beausobre',
      'Établissement de Vevey',
      'Établissement d’Yverdon',
      'Autre établissement vaudois'
    ];

    content.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
        <div>
          <h3 id="auth-modal-title" style="font-size:1.18rem; font-weight:800;">👤 Connexion &amp; Profil Élève 11e VP</h3>
          <p style="font-size:0.82rem; color:var(--text-secondary); margin-top:2px;">
            Sauvegarde tes XP, tes chapitres ciblés et ton classement entre amis dans le Canton de Vaud.
          </p>
        </div>
        <button class="drawer-close-btn" id="close-auth-modal-btn">Fermer ✕</button>
      </div>

      ${u ? `
        <div class="profile-active-banner">
          <div>
            <div style="font-size:0.72rem; font-weight:700; text-transform:uppercase; color:var(--accent-primary);">
              Profil actif • ${cloudBadgeText}
            </div>
            <div style="font-size:1.02rem; font-weight:800; margin-top:2px;">
              ${u.avatar || '⚡'} ${u.pseudo} — <span style="font-weight:600; color:var(--text-secondary);">${u.etablissement}</span>
            </div>
            <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">
              Score : <strong>${this.state.xp} XP</strong> • Série : <strong>🔥 ${this.state.streak} j.</strong>
            </div>
          </div>
          <button class="secondary-btn compact-btn" id="auth-signout-btn" style="border-color:var(--accent-danger); color:var(--accent-danger);">
            Se déconnecter
          </button>
        </div>
      ` : ''}

      <!-- OPTION A: Quick Vaud Student Pseudo (Recommended nLPD) -->
      <div class="auth-option-box">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
          <h4>⚡ Option A — Connexion Rapide Élève (Recommandé nLPD Vaud)</h4>
          <span class="per-tag">Sans email requis</span>
        </div>
        <p style="font-size:0.78rem; color:var(--text-secondary);">
          Choisis un pseudonyme, ton collège vaudois et ton avatar pour apparaître dans le classement et synchroniser tes progrès :
        </p>

        <div class="auth-form-grid">
          <div class="auth-field">
            <label for="auth-pseudo-input">Pseudonyme (ex: Lucas_VD)</label>
            <input type="text" id="auth-pseudo-input" class="auth-input" placeholder="Ton pseudo..." value="${currentPseudo}" maxlength="32" />
          </div>
          <div class="auth-field">
            <label for="auth-school-select">Établissement Vaudois</label>
            <select id="auth-school-select" class="auth-input">
              ${schools.map(s => `<option value="${s}" ${s === currentSchool ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="auth-field">
          <label>Choisis ton avatar :</label>
          <div class="avatar-picker-row" id="auth-avatar-picker">
            ${avatars.map(av => `
              <button type="button" class="avatar-option-btn ${av === currentAvatar ? 'active' : ''}" data-avatar="${av}">
                ${av}
              </button>
            `).join('')}
          </div>
        </div>

        <button class="primary-cta-btn full-width-btn" id="auth-pseudo-submit-btn">
          ✅ Enregistrer &amp; Synchroniser mon profil
        </button>
      </div>

      <!-- OPTION B: Email / Password or Google via Firebase Auth -->
      <div class="auth-option-box">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
          <h4>🔐 Option B — Compte Cloud Firebase (Email ou Google)</h4>
          <span class="per-tag">${cloudBadgeText}</span>
        </div>

        <div class="auth-form-grid">
          <div class="auth-field">
            <label for="auth-email-input">Adresse e-mail</label>
            <input type="email" id="auth-email-input" class="auth-input" placeholder="eleve@edu-vd.ch" value="${u?.email || ''}" />
          </div>
          <div class="auth-field">
            <label for="auth-password-input">Mot de passe</label>
            <input type="password" id="auth-password-input" class="auth-input" placeholder="••••••••" />
          </div>
        </div>

        <div id="auth-feedback-msg" style="font-size:0.78rem; font-weight:700; color:var(--accent-primary); display:none;"></div>

        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="secondary-btn compact-btn" id="auth-email-signin-btn">Connexion Email</button>
          <button class="secondary-btn compact-btn" id="auth-email-signup-btn">Créer un compte</button>
          <button class="secondary-btn compact-btn" id="auth-google-btn" style="margin-left:auto;">
            🌐 Continuer avec Google
          </button>
        </div>
      </div>
    `;

    backdrop.classList.add('open');

    let pickedAvatar = currentAvatar;
    content.querySelectorAll('.avatar-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        pickedAvatar = btn.dataset.avatar;
        content.querySelectorAll('.avatar-option-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.avatar === pickedAvatar);
        });
      });
    });

    const showMsg = (txt, isError = false) => {
      const msgEl = content.querySelector('#auth-feedback-msg');
      if (!msgEl) return;
      msgEl.style.display = 'block';
      msgEl.style.color = isError ? 'var(--accent-danger)' : 'var(--accent-primary)';
      msgEl.textContent = txt;
    };

    content.querySelector('#close-auth-modal-btn')?.addEventListener('click', () => {
      backdrop.classList.remove('open');
    });

    content.querySelector('#auth-pseudo-submit-btn')?.addEventListener('click', async () => {
      const pseudoVal = content.querySelector('#auth-pseudo-input')?.value.trim() || 'Élève 11e VP';
      const schoolVal = content.querySelector('#auth-school-select')?.value || 'Canton de Vaud';
      if (this.firebaseService) {
        await this.firebaseService.signInWithPseudo(pseudoVal, schoolVal, pickedAvatar);
        this.syncStateToCloud();
      }
      backdrop.classList.remove('open');
    });

    content.querySelector('#auth-signout-btn')?.addEventListener('click', async () => {
      if (this.firebaseService) {
        await this.firebaseService.signOutUser();
      }
      backdrop.classList.remove('open');
    });

    content.querySelector('#auth-email-signup-btn')?.addEventListener('click', async () => {
      const email = content.querySelector('#auth-email-input')?.value.trim();
      const pass = content.querySelector('#auth-password-input')?.value;
      const pseudoVal = content.querySelector('#auth-pseudo-input')?.value.trim() || (email ? email.split('@')[0] : 'Élève 11e VP');
      const schoolVal = content.querySelector('#auth-school-select')?.value || 'Canton de Vaud';
      if (!email || !pass) {
        showMsg('Renseigne ton email et un mot de passe (min. 6 caractères).', true);
        return;
      }
      try {
        await this.firebaseService.signUpWithEmail(email, pass, pseudoVal, schoolVal, pickedAvatar);
        this.syncStateToCloud();
        backdrop.classList.remove('open');
      } catch (err) {
        showMsg(err.message, true);
      }
    });

    content.querySelector('#auth-email-signin-btn')?.addEventListener('click', async () => {
      const email = content.querySelector('#auth-email-input')?.value.trim();
      const pass = content.querySelector('#auth-password-input')?.value;
      if (!email || !pass) {
        showMsg('Renseigne ton email et ton mot de passe.', true);
        return;
      }
      try {
        await this.firebaseService.signInWithEmail(email, pass);
        backdrop.classList.remove('open');
      } catch (err) {
        showMsg(err.message, true);
      }
    });

    content.querySelector('#auth-google-btn')?.addEventListener('click', async () => {
      try {
        await this.firebaseService.signInWithGoogle();
        backdrop.classList.remove('open');
      } catch (err) {
        showMsg(err.message, true);
      }
    });
  }

  /* ------------------------------------------------------------------------
     Single-Focus Progressive Disclosure Navigation (4 Clean Views)
     ------------------------------------------------------------------------ */
  switchView(viewName) {
    this.state.activeView = viewName;

    document.querySelectorAll('.main-tab[data-view]').forEach(tab => {
      const isSelected = tab.dataset.view === viewName;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    document.querySelectorAll('.app-view[data-view-panel]').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.viewPanel === viewName);
    });

    if (viewName !== 'entrainement' && this.state.sprintTimer) {
      clearInterval(this.state.sprintTimer);
      this.state.sprintTimer = null;
      const badge = document.getElementById('sprint-timer-badge');
      if (badge) badge.style.display = 'none';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ------------------------------------------------------------------------
     Theme / Vibe Parametrization
     ------------------------------------------------------------------------ */
  applyVibe(vibeName, shouldSync = true) {
    this.state.vibe = vibeName;
    localStorage.setItem('vaud_vibe', vibeName);
    document.documentElement.setAttribute('data-vibe', vibeName);

    const vibeDescriptions = {
      academic: {
        badge: '🇨🇭 11e VP Vaud • PER',
        title: 'Prêt pour ta session 11e VP ?',
        subtitle: 'Révise étape par étape les 7 chapitres officiels vaudois (PER) à ton rythme, avec ton Coach IA toujours à côté.'
      },
      quest: {
        badge: '🗺️ Quête du Léman • 11e VP',
        title: 'L’Odyssée du Certificat : Nyon → Montreux',
        subtitle: 'Gagne des XP à chaque gare vaudoise pour débloquer l’étape finale du Certificat 11e VP !'
      },
      studio: {
        badge: '⚡ Focus Studio • PER L1/L2',
        title: 'Session Haute Concentration — 11e VP',
        subtitle: 'Utilise les raccourcis clavier [1-4] pour enchaîner les analyses syntaxiques sans jamais défiler.'
      }
    };

    const info = vibeDescriptions[vibeName] || vibeDescriptions.academic;
    const badgeEl = document.getElementById('top-vibe-badge');
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');

    if (badgeEl) badgeEl.textContent = info.badge;
    if (heroTitle) heroTitle.textContent = info.title;
    if (heroSubtitle) heroSubtitle.textContent = info.subtitle;

    document.querySelectorAll('[data-pick-vibe]').forEach(card => {
      card.classList.toggle('active', card.dataset.pickVibe === vibeName);
    });

    this.renderQuestMap();
    this.renderStudioMetrics();
    if (shouldSync) this.syncStateToCloud();
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
     Render Orchestration Across Views
     ------------------------------------------------------------------------ */
  renderAll() {
    this.renderAuthHeaderPill();
    this.renderHeaderAndReadiness();
    this.renderSubjectTabs();
    this.renderQuestMap();
    this.renderStudioMetrics();
    this.renderModuleGrid();
    this.renderLessonChapterSelect();
    this.renderArena();
    this.renderDefisAndFamilyView();
    this.renderSettingsView();
  }

  renderHeaderAndReadiness() {
    const xpEl = document.getElementById('stat-xp');
    const streakEl = document.getElementById('stat-streak');
    if (xpEl) xpEl.textContent = `${this.state.xp} XP`;
    if (streakEl) streakEl.textContent = `${this.state.streak} j.`;

    const visibleModules = this.getVisibleModulesForSubject('francais');
    const totalQ = visibleModules.reduce((acc, m) => acc + m.questions.length, 0);
    const summaryEl = document.getElementById('active-focus-summary');
    if (summaryEl) {
      summaryEl.textContent = `Focus actif : ${visibleModules.length}/${CURRICULUM_DATA.francais.modules.length} chapitres PER (${totalQ} exercices)`;
    }

    const mistakesPill = document.getElementById('mistakes-mode-pill');
    if (mistakesPill) {
      mistakesPill.textContent = `🔁 Erreurs (${this.state.mistakeQuestions.length})`;
    }

    const pct = Math.min(100, Math.round((this.state.xp / 600) * 100));
    const fill = document.getElementById('readiness-bar-fill');
    const lbl = document.getElementById('readiness-pct-label');
    if (fill) fill.style.width = `${pct}%`;
    if (lbl) lbl.textContent = `${pct}% prêt (${this.state.xp} / 600 XP)`;
  }

  renderSubjectTabs() {
    const container = document.getElementById('subject-tabs-container');
    if (!container) return;

    const subjectMeta = [
      { id: 'francais', label: '📘 Français 11e VP' },
      { id: 'allemand', label: '🇩🇪 Allemand 11e VP (Aperçu)' }
    ];

    const activeList = subjectMeta.filter(s => this.state.enabledSubjects.includes(s.id));

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
    if (rankEl) rankEl.textContent = `#${myRank || 2} Vaud`;
  }

  /* ------------------------------------------------------------------------
     VIEW 1: 📚 Parcours — Active Focused PER Chapters Grid
     ------------------------------------------------------------------------ */
  renderModuleGrid() {
    const visibleModules = this.getVisibleModulesForSubject();
    const grid = document.getElementById('modules-overview-grid');
    if (!grid) return;

    if (!visibleModules.some(m => m.id === this.state.activeModuleId)) {
      this.state.activeModuleId = visibleModules[0]?.id;
    }

    grid.innerHTML = visibleModules.map(mod => {
      const isCurrent = mod.id === this.state.activeModuleId;
      return `
        <article class="module-card ${isCurrent ? 'active-chapter' : ''}" data-module-card="${mod.id}">
          <div>
            <div class="module-card-top">
              <div class="module-icon">${mod.icon}</div>
              <span class="per-tag">${mod.perRef}</span>
            </div>
            <h3>${mod.title}</h3>
            <p>${mod.description}</p>
          </div>
          <div class="module-card-footer">
            <span>📍 ${mod.station} • ${mod.questions.length} exercices</span>
            <span class="train-chapter-btn">S’entraîner →</span>
          </div>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('.module-card').forEach(card => {
      card.addEventListener('click', () => {
        this.selectModuleAndStart(card.dataset.moduleCard);
      });
    });
  }

  renderLessonChapterSelect() {
    const selectEl = document.getElementById('lesson-chapter-select');
    if (!selectEl) return;

    const visibleModules = this.getVisibleModulesForSubject();
    selectEl.innerHTML = visibleModules.map(mod => `
      <option value="${mod.id}" ${mod.id === this.state.activeModuleId ? 'selected' : ''}>
        ${mod.icon} ${mod.title.split('(')[0].trim()}
      </option>
    `).join('');
  }

  selectModuleAndStart(moduleId) {
    this.state.activeModuleId = moduleId;
    this.state.currentQuestionIndex = 0;
    this.state.answeredCurrent = false;
    this.state.theoryOpen = false;
    this.renderModuleGrid();
    this.renderLessonChapterSelect();
    this.renderArena();
    this.renderDefisAndFamilyView();
    this.switchView('entrainement');
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
     VIEW 2: 🎯 Entraînement — Zero-Scroll Lesson Frame & Popover Theory Sheet
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
    if (!mod) return;

    const questions = this.getFilteredQuestions();
    const idx = this.state.currentQuestionIndex % questions.length;
    const q = questions[idx];
    this.currentQuestion = q;
    this.state.answeredCurrent = false;

    const titleEl = document.getElementById('arena-module-title');
    const refEl = document.getElementById('arena-per-ref');
    if (titleEl) titleEl.textContent = `${mod.icon} ${mod.title.split('(')[0].trim()}`;
    if (refEl) refEl.textContent = mod.perRef;

    const modeBadge = this.state.exerciseMode === 'mistakes'
      ? ' • 🔁 Erreurs'
      : (q.isGenerated ? ' • ✨ Généré' : '');
    const counterEl = document.getElementById('question-counter');
    if (counterEl) {
      counterEl.textContent = `Question ${idx + 1} / ${questions.length}${modeBadge}`;
    }

    const promptEl = document.getElementById('question-prompt');
    if (promptEl) promptEl.textContent = q.prompt;

    this.renderTheoryDrawer();

    const showcaseEl = document.getElementById('sentence-showcase');
    const surgeryContainer = document.getElementById('surgery-container');
    const optionsContainer = document.getElementById('options-container');
    const feedbackBanner = document.getElementById('feedback-banner');

    if (feedbackBanner) feedbackBanner.classList.remove('visible');

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

      const beforeLen = this.state.mistakeQuestions.length;
      this.state.mistakeQuestions = this.state.mistakeQuestions.filter(item => item.id !== this.currentQuestion.id);
      localStorage.setItem('vaud_mistake_questions', JSON.stringify(this.state.mistakeQuestions));

      const clearedNote = beforeLen > this.state.mistakeQuestions.length
        ? ' • 🎯 Retiré de « Mes erreurs » !'
        : '';
      feedbackTitle.innerHTML = `✅ Excellent ! +${gainedXp} XP${clearedNote}`;
      feedbackTitle.style.color = '#10b981';
    } else {
      clickedEl.classList.add('wrong');
      if (!this.state.mistakeQuestions.some(item => item.id === this.currentQuestion.id)) {
        this.state.mistakeQuestions.push(this.currentQuestion);
        localStorage.setItem('vaud_mistake_questions', JSON.stringify(this.state.mistakeQuestions));
      }
      feedbackTitle.innerHTML = `❌ Pas tout à fait — Ajouté à « 🔁 Erreurs » :`;
      feedbackTitle.style.color = '#f43f5e';
    }

    feedbackRule.textContent = this.currentQuestion.perRule;
    feedbackBanner.classList.add('visible');

    localStorage.setItem('vaud_xp', String(this.state.xp));
    localStorage.setItem('vaud_answered', String(this.state.answeredCount));
    localStorage.setItem('vaud_correct', String(this.state.correctCount));

    const meRow = this.state.leaderboard.find(r => r.isMe);
    if (meRow) {
      meRow.xp = this.state.xp;
      if (this.state.currentUser) {
        meRow.name = `${this.state.currentUser.pseudo} (${this.state.currentUser.etablissement || 'Vaud'})`;
        meRow.avatar = this.state.currentUser.avatar || '⚡';
      }
    }

    this.syncStateToCloud();
    this.renderHeaderAndReadiness();
    this.renderQuestMap();
    this.renderStudioMetrics();
    this.renderDefisAndFamilyView();
  }

  nextQuestion() {
    this.state.theoryOpen = false;
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

  generateAndOpenNewExercise() {
    const mod = this.getActiveModule();
    if (!mod || !PERExerciseGenerator) return;

    this.state.theoryOpen = false;
    const newQ = PERExerciseGenerator.generateForModule(mod.id);
    mod.questions.push(newQ);
    this.state.exerciseMode = 'all';
    document.querySelectorAll('.mode-pill[data-mode]').forEach(p => {
      p.classList.toggle('active', p.dataset.mode === 'all');
    });

    this.state.currentQuestionIndex = mod.questions.length - 1;
    this.renderHeaderAndReadiness();
    this.renderModuleGrid();
    this.renderArena();
  }

  startSprintMode() {
    this.switchView('entrainement');
    this.state.exerciseMode = 'sprint';
    this.state.sprintSecondsLeft = 60;
    document.querySelectorAll('.mode-pill[data-mode]').forEach(p => {
      p.classList.toggle('active', p.dataset.mode === 'sprint');
    });

    const timerBadge = document.getElementById('sprint-timer-badge');
    if (timerBadge) {
      timerBadge.style.display = 'inline-flex';
      timerBadge.textContent = `⏱️ 60s`;
    }

    if (this.state.sprintTimer) clearInterval(this.state.sprintTimer);
    this.state.sprintTimer = setInterval(() => {
      this.state.sprintSecondsLeft -= 1;
      if (timerBadge) timerBadge.textContent = `⏱️ ${this.state.sprintSecondsLeft}s`;
      if (this.state.sprintSecondsLeft <= 0) {
        clearInterval(this.state.sprintTimer);
        if (timerBadge) timerBadge.textContent = `🏁 Terminé !`;
      }
    }, 1000);

    this.renderArena();
  }

  /* ------------------------------------------------------------------------
     VIEW 3: 🏆 Défis & Famille
     ------------------------------------------------------------------------ */
  renderDefisAndFamilyView() {
    const listEl = document.getElementById('leaderboard-list');
    if (listEl) {
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

    const cloudBadgeEl = document.getElementById('leaderboard-cloud-badge');
    if (cloudBadgeEl) {
      cloudBadgeEl.textContent = this.state.isCloudConnected ? '☁️ Temps réel Vaud' : 'Canton de Vaud';
    }

    const activeMod = this.getActiveModule();
    const shortChapter = activeMod ? activeMod.title.split('(')[0].trim() : 'Programme PER';

    const duelChapEl = document.getElementById('duel-active-chapter');
    const duelCodeEl = document.getElementById('duel-challenge-code');
    const duelXpEl = document.getElementById('duel-xp-target');
    if (duelChapEl) duelChapEl.textContent = shortChapter;
    if (duelCodeEl) duelCodeEl.textContent = this.state.duelCode;
    if (duelXpEl) duelXpEl.textContent = `${this.state.xp} XP`;

    const accuracy = this.state.answeredCount > 0
      ? Math.round((this.state.correctCount / this.state.answeredCount) * 100)
      : 100;

    const famHeadingEl = document.getElementById('family-student-heading');
    const famChapEl = document.getElementById('family-active-chapter');
    const famXpEl = document.getElementById('family-stat-xp');
    const famAccEl = document.getElementById('family-stat-acc');
    const famStreakEl = document.getElementById('family-stat-streak');

    if (famHeadingEl) {
      famHeadingEl.textContent = this.state.currentUser
        ? `${this.state.currentUser.avatar || '⚡'} Bilan de ${this.state.currentUser.pseudo} (${this.state.currentUser.etablissement})`
        : 'Objectif Gymnase — Programme PER';
    }
    if (famChapEl) famChapEl.textContent = `Chapitre actif : ${shortChapter}`;
    if (famXpEl) famXpEl.textContent = `${this.state.xp} XP`;
    if (famAccEl) famAccEl.textContent = `${accuracy}%`;
    if (famStreakEl) famStreakEl.textContent = `🔥 ${this.state.streak} j.`;
  }

  /* ------------------------------------------------------------------------
     VIEW 4: ⚙️ Paramètres (Including Cloud Firebase Configuration)
     ------------------------------------------------------------------------ */
  renderSettingsView() {
    const deCheckbox = document.getElementById('toggle-german-subj');
    if (deCheckbox) {
      deCheckbox.checked = this.state.enabledSubjects.includes('allemand');
    }

    const fbStatusPill = document.getElementById('firebase-status-pill');
    if (fbStatusPill) {
      fbStatusPill.textContent = this.state.isCloudConnected
        ? '☁️ Cloud Firebase Connecté'
        : '💾 Mode Local-First';
    }

    const fbInput = document.getElementById('firebase-config-input');
    if (fbInput && window.FIREBASE_CONFIG && !fbInput.value) {
      fbInput.value = JSON.stringify(window.FIREBASE_CONFIG, null, 2);
    }

    const checklistEl = document.getElementById('focus-topics-checklist');
    if (!checklistEl) return;

    const allFrModules = CURRICULUM_DATA.francais.modules;
    checklistEl.innerHTML = allFrModules.map(mod => {
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
    }).join('');

    checklistEl.querySelectorAll('.focus-topic-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        const selected = Array.from(checklistEl.querySelectorAll('.focus-topic-cb:checked')).map(el => el.value);
        if (selected.length === 0) {
          cb.checked = true;
          return;
        }
        this.state.focusedModules = selected;
        localStorage.setItem('vaud_focused_customized', 'true');
        localStorage.setItem('vaud_focused_modules', JSON.stringify(selected));
        this.syncStateToCloud();
        this.renderHeaderAndReadiness();
        this.renderModuleGrid();
        this.renderLessonChapterSelect();
      });
    });
  }

  /* ------------------------------------------------------------------------
     AI Coach Chat Interactions (Inside Fixed/Sticky Right Panel)
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
     Global Event Listeners & Keyboard Shortcuts
     ------------------------------------------------------------------------ */
  bindGlobalEvents() {
    document.querySelectorAll('.main-tab[data-view]').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchView(tab.dataset.view);
      });
    });

    document.getElementById('brand-home-btn')?.addEventListener('click', () => {
      this.switchView('parcours');
    });

    document.getElementById('back-to-parcours-btn')?.addEventListener('click', () => {
      this.switchView('parcours');
    });

    document.getElementById('continue-study-btn')?.addEventListener('click', () => {
      this.switchView('entrainement');
    });

    ['parcours-customize-btn', 'filter-topics-btn'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', () => {
        this.switchView('parametres');
      });
    });

    // Student Profile / Auth Triggers
    ['user-auth-pill', 'open-auth-from-settings-btn'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', () => {
        this.openAuthModal();
      });
    });

    document.getElementById('auth-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'auth-modal-backdrop') {
        e.currentTarget.classList.remove('open');
      }
    });

    // Save Firebase Cloud Config in Paramètres
    document.getElementById('save-firebase-config-btn')?.addEventListener('click', (e) => {
      const raw = document.getElementById('firebase-config-input')?.value.trim();
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (parsed.apiKey && parsed.projectId && this.firebaseService) {
          this.firebaseService.saveFirebaseConfig(parsed);
        } else {
          e.currentTarget.textContent = '⚠️ Clés apiKey / projectId manquantes';
        }
      } catch (err) {
        e.currentTarget.textContent = '⚠️ Format JSON invalide';
      }
    });

    document.getElementById('lesson-chapter-select')?.addEventListener('change', (e) => {
      this.state.activeModuleId = e.target.value;
      this.state.currentQuestionIndex = 0;
      this.state.answeredCurrent = false;
      this.state.theoryOpen = false;
      this.renderModuleGrid();
      this.renderArena();
      this.renderDefisAndFamilyView();
    });

    // Popover Theory Sheet Toggle
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
          this.sendAICoachMessage('Tu n’as aucune erreur en attente dans « 🔁 Erreurs » ! Continue à t’entraîner, les questions ratées s’ajouteront automatiquement ici.');
          return;
        }
        if (mode === 'sprint') {
          this.startSprintMode();
          return;
        }
        if (this.state.sprintTimer) clearInterval(this.state.sprintTimer);
        const timerBadge = document.getElementById('sprint-timer-badge');
        if (timerBadge) timerBadge.style.display = 'none';

        this.state.exerciseMode = mode;
        this.state.currentQuestionIndex = 0;
        document.querySelectorAll('.mode-pill[data-mode]').forEach(p => {
          p.classList.toggle('active', p.dataset.mode === mode);
        });
        this.renderArena();
      });
    });

    // Lesson Bottom Action Buttons
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

    // Sticky AI Coach Input & Quick Chips
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

    // View 3: Défis & Famille Actions (with Cloud Duel Creation)
    document.getElementById('copy-duel-btn')?.addEventListener('click', async (e) => {
      const activeMod = this.getActiveModule();
      const modTitle = activeMod?.title || 'Programme PER';
      if (this.firebaseService) {
        await this.firebaseService.createCloudDuel(this.state.duelCode, activeMod?.id || 'subordonnees', modTitle, this.state.xp);
      }
      const duelText = `⚔️ Je te défie sur Objectif Gymnase (11e VP Vaud) ! Entre le code ${this.state.duelCode} sur le chapitre "${modTitle}" et essaie de battre mes ${this.state.xp} XP !`;
      navigator.clipboard?.writeText(duelText);
      const btn = e.currentTarget;
      const orig = btn.textContent;
      btn.textContent = '✅ Invitation Duel copiée !';
      setTimeout(() => { btn.textContent = orig; }, 2500);
    });

    document.getElementById('simulate-friend-btn')?.addEventListener('click', (e) => {
      this.state.xp += 30;
      localStorage.setItem('vaud_xp', String(this.state.xp));
      const meRow = this.state.leaderboard.find(r => r.isMe);
      if (meRow) meRow.xp = this.state.xp;
      this.syncStateToCloud();
      this.renderHeaderAndReadiness();
      this.renderDefisAndFamilyView();
      e.currentTarget.textContent = '🏆 Victoire contre Léo (4/5 vs 3/5) → +30 XP !';
    });

    document.getElementById('copy-family-msg-btn')?.addEventListener('click', (e) => {
      const accuracy = this.state.answeredCount > 0
        ? Math.round((this.state.correctCount / this.state.answeredCount) * 100)
        : 100;
      const modTitle = this.getActiveModule()?.title || 'Programme PER';
      const studentLabel = this.state.currentUser ? `${this.state.currentUser.pseudo} (${this.state.currentUser.etablissement})` : 'Élève 11e VP';
      const shareText = `🇨🇭 Bilan 11e VP — ${studentLabel} (Objectif Gymnase) :\n✅ ${this.state.xp} XP gagnés\n🎯 ${accuracy}% de réussite sur le programme PER (${modTitle})\n🔥 Série de ${this.state.streak} jours consécutifs !`;
      navigator.clipboard?.writeText(shareText);
      const btn = e.currentTarget;
      const orig = btn.textContent;
      btn.textContent = '✅ Résumé copié pour WhatsApp !';
      setTimeout(() => { btn.textContent = orig; }, 2500);
    });

    // View 4: Paramètres Interactions
    document.querySelectorAll('[data-pick-vibe]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.applyVibe(btn.dataset.pickVibe, true);
      });
    });

    document.getElementById('toggle-german-subj')?.addEventListener('change', (e) => {
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
      this.syncStateToCloud();
      this.renderSubjectTabs();
      this.renderModuleGrid();
      this.renderLessonChapterSelect();
      this.renderArena();
    });

    document.getElementById('select-all-chapters-btn')?.addEventListener('click', () => {
      const allIds = CURRICULUM_DATA.francais.modules.map(m => m.id);
      this.state.focusedModules = allIds;
      localStorage.setItem('vaud_focused_customized', 'true');
      localStorage.setItem('vaud_focused_modules', JSON.stringify(allIds));
      this.syncStateToCloud();
      this.renderSettingsView();
      this.renderHeaderAndReadiness();
      this.renderModuleGrid();
      this.renderLessonChapterSelect();
    });

    // Keyboard Shortcuts [1-4] + Enter when in Entraînement View
    window.addEventListener('keydown', (e) => {
      if (this.state.activeView !== 'entrainement') return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

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
