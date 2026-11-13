/* ==========================================================================
   Main Application Controller — Objectif Gymnase (11e VP Vaud)
   Version: v1.5.0 (Full PER Curriculum FR + DE, Examen Blanc, URL Duels & Mode Enseignant)
   Includes:
   - 7 Official Français 11e VP Chapters + 4 Full Allemand PER L2 Chapters
   - Mode « Examen Blanc de Certificat Vaud » (Compréhension + Rédaction /6.0)
   - URL-Encoded 1v1 Friend Duels (#duel=...) & Mode Enseignant (#devoir=...)
   - Cloud Firestore Profile, Mistake Queue & Duels Sync (conforme nLPD)
   - Sticky AI Coach Next to Main Page + Zero-Scroll Exercise Frame
   ========================================================================== */

const CURRICULUM_DATA = window.CURRICULUM_DATA;
const VAUD_QUEST_STATIONS = window.VAUD_QUEST_STATIONS;
const INITIAL_LEADERBOARD = window.INITIAL_LEADERBOARD;
const CERTIFICAT_MOCK_EXAMS = window.CERTIFICAT_MOCK_EXAMS || [];
const VaudAICoach = window.VaudAICoach;
const VaudFirebaseService = window.VaudFirebaseService;
const PERExerciseGenerator = window.PERExerciseGenerator;

class ObjectifGymnaseApp {
  constructor() {
    const savedSubjects = JSON.parse(localStorage.getItem('vaud_enabled_subjects') || '["francais", "allemand"]');
    const defaultFrancaisFocus = CURRICULUM_DATA.francais.modules.map(m => m.id);
    const savedFocus = JSON.parse(localStorage.getItem('vaud_focused_modules') || JSON.stringify(defaultFrancaisFocus));
    const savedMistakes = JSON.parse(localStorage.getItem('vaud_mistake_questions') || '[]');

    // Automatically include all 7 Français chapters unless user customized focus
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
      exerciseMode: 'all', // 'all' | 'surgery' | 'mistakes' | 'sprint' | 'exam'
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
      isCloudConnected: false,
      // v1.5.0: Examen Blanc, Synchronous URL Duels & Teacher Assignments
      activeExamId: CERTIFICAT_MOCK_EXAMS[0]?.id || 'certif-ecrans',
      activeExamPart: 1,
      examAnswers: {},
      examGraded: false,
      examTimer: null,
      examSecondsLeft: (CERTIFICAT_MOCK_EXAMS[0]?.durationMinutes || 45) * 60,
      activeDuelSession: null,
      teacherAssignment: null
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
    this.handleHashRoute();
    window.addEventListener('hashchange', () => this.handleHashRoute());
    this.renderAll();
  }

  /* ------------------------------------------------------------------------
     URL Hash Codec (#duel=... & #devoir=...)
     ------------------------------------------------------------------------ */
  encodeSharePayload(obj) {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);
    let bin = '';
    bytes.forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  decodeSharePayload(raw) {
    try {
      const clean = String(raw || '').trim().replace(/-/g, '+').replace(/_/g, '/');
      const padded = clean + '==='.slice((clean.length + 3) % 4);
      const bin = atob(padded);
      const bytes = Uint8Array.from(bin, ch => ch.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) {
      return null;
    }
  }

  findModuleMeta(moduleId) {
    for (const subjKey of Object.keys(CURRICULUM_DATA)) {
      const mod = CURRICULUM_DATA[subjKey].modules.find(m => m.id === moduleId);
      if (mod) return { subjKey, mod };
    }
    return null;
  }

  findQuestionById(questionId) {
    for (const subjKey of Object.keys(CURRICULUM_DATA)) {
      for (const mod of CURRICULUM_DATA[subjKey].modules) {
        const found = mod.questions.find(q => q.id === questionId);
        if (found) return found;
      }
    }
    return null;
  }

  buildDuelQuestionIds(mod) {
    const ids = mod.questions.slice(0, 5).map(q => q.id);
    if (ids.length < 5) {
      const meta = this.findModuleMeta(mod.id);
      const pool = meta ? CURRICULUM_DATA[meta.subjKey].modules.flatMap(m => m.questions) : [];
      for (const q of pool) {
        if (!ids.includes(q.id)) ids.push(q.id);
        if (ids.length >= 5) break;
      }
    }
    return ids;
  }

  handleHashRoute() {
    const hash = window.location.hash || '';
    if (hash.startsWith('#devoir=')) {
      const decoded = this.decodeSharePayload(hash.slice('#devoir='.length));
      if (decoded && Array.isArray(decoded.modules) && decoded.modules.length > 0) {
        this.state.teacherAssignment = {
          title: decoded.title || 'Devoir de classe 11e VP',
          modules: decoded.modules
        };
        const firstMeta = this.findModuleMeta(decoded.modules[0]);
        if (firstMeta) {
          this.state.subject = firstMeta.subjKey;
          this.state.activeModuleId = firstMeta.mod.id;
          if (!this.state.enabledSubjects.includes(firstMeta.subjKey)) {
            this.state.enabledSubjects.push(firstMeta.subjKey);
          }
        }
        this.renderSharedContextBanner();
        this.renderAll();
      }
      return;
    }

    if (hash.startsWith('#duel=')) {
      const decoded = this.decodeSharePayload(hash.slice('#duel='.length));
      if (decoded && decoded.modId) {
        this.startDuelSession(decoded);
      }
    }
  }

  renderSharedContextBanner() {
    const bannerEl = document.getElementById('shared-context-banner');
    if (!bannerEl) return;

    if (this.state.teacherAssignment) {
      const a = this.state.teacherAssignment;
      bannerEl.style.display = 'flex';
      bannerEl.innerHTML = `
        <div class="shared-context-banner-info">
          <span>👩‍🏫</span>
          <span>Devoir Enseignant actif : <strong>${a.title}</strong> (${a.modules.length} chapitre(s) ciblé(s))</span>
        </div>
        <div class="shared-context-banner-actions">
          <button class="primary-cta-btn compact-cta-btn" id="banner-start-devoir-btn">Commencer le devoir →</button>
          <button class="secondary-btn compact-btn" id="banner-clear-devoir-btn">Quitter ✕</button>
        </div>
      `;
      bannerEl.querySelector('#banner-start-devoir-btn')?.addEventListener('click', () => {
        this.switchView('entrainement');
      });
      bannerEl.querySelector('#banner-clear-devoir-btn')?.addEventListener('click', () => {
        this.state.teacherAssignment = null;
        if (window.location.hash.startsWith('#devoir=')) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        this.renderSharedContextBanner();
        this.renderAll();
      });
      return;
    }

    bannerEl.style.display = 'none';
    bannerEl.innerHTML = '';
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

    // If connected to Cloud Firestore, sync leaderboard + personal mistake queue
    if (this.firebaseService && this.state.isCloudConnected) {
      const [cloudRows, cloudMistakes] = await Promise.all([
        this.firebaseService.fetchLeaderboard(),
        this.firebaseService.loadCloudMistakes()
      ]);
      if (cloudRows && cloudRows.length > 0) {
        this.state.leaderboard = cloudRows;
      }
      if (Array.isArray(cloudMistakes) && cloudMistakes.length > 0) {
        const merged = [...this.state.mistakeQuestions];
        for (const cm of cloudMistakes) {
          if (!merged.some(m => m.id === cm.id)) merged.push(cm);
        }
        this.state.mistakeQuestions = merged;
        localStorage.setItem('vaud_mistake_questions', JSON.stringify(merged));
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

  copyTextSafe(text) {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(text).catch(() => {});
      }
    } catch (e) {}
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

    if (this.state.teacherAssignment?.modules?.length) {
      const assigned = subjectData.modules.filter(m => this.state.teacherAssignment.modules.includes(m.id));
      if (assigned.length > 0) return assigned;
    }

    if (subjKey !== 'francais') return subjectData.modules;

    const filtered = subjectData.modules.filter(m => this.state.focusedModules.includes(m.id));
    return filtered.length > 0 ? filtered : [subjectData.modules[0]];
  }

  /* ------------------------------------------------------------------------
     Render Orchestration Across Views
     ------------------------------------------------------------------------ */
  renderAll() {
    this.renderAuthHeaderPill();
    this.renderSharedContextBanner();
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
      summaryEl.textContent = this.state.teacherAssignment
        ? `👩‍🏫 Devoir actif : ${this.state.teacherAssignment.title} (${this.state.teacherAssignment.modules.length} chapitres)`
        : `Focus actif : ${visibleModules.length}/${CURRICULUM_DATA.francais.modules.length} chapitres PER (${totalQ} exercices)`;
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
      { id: 'allemand', label: '🇩🇪 Allemand 11e VP (4 chapitres)' }
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
    const meta = this.findModuleMeta(moduleId);
    if (meta) this.state.subject = meta.subjKey;
    this.state.activeModuleId = moduleId;
    this.state.activeDuelSession = null;
    if (this.state.exerciseMode === 'exam') {
      this.state.exerciseMode = 'all';
    }
    this.state.currentQuestionIndex = 0;
    this.state.answeredCurrent = false;
    this.state.theoryOpen = false;
    document.querySelectorAll('.mode-pill[data-mode]').forEach(p => {
      p.classList.toggle('active', p.dataset.mode === this.state.exerciseMode);
    });
    this.renderSubjectTabs();
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
    if (this.state.activeDuelSession?.questions?.length) {
      return this.state.activeDuelSession.questions;
    }
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

  renderDuelLiveHeader() {
    const headerEl = document.getElementById('duel-live-header');
    if (!headerEl) return;

    const duel = this.state.activeDuelSession;
    if (!duel) {
      headerEl.style.display = 'none';
      headerEl.innerHTML = '';
      return;
    }

    headerEl.style.display = 'flex';
    const total = duel.questions.length;
    if (duel.finished) {
      const target = duel.challengerScore <= total ? duel.challengerScore : Math.min(total, 4);
      const won = duel.correctCount >= target;
      headerEl.innerHTML = `
        <span>🏁 Duel ${duel.challengeCode} terminé vs <strong>${duel.challengerName}</strong> — Ton score : <strong>${duel.correctCount}/${total}</strong> (${won ? '🏆 Victoire !' : '💪 Beau duel !'})</span>
        <button class="secondary-btn compact-btn" id="exit-duel-btn">Terminer ✕</button>
      `;
    } else {
      const round = (this.state.currentQuestionIndex % total) + 1;
      headerEl.innerHTML = `
        <span>⚔️ Duel <strong>${duel.challengeCode}</strong> vs ${duel.challengerName} • Manche <strong>${round}/${total}</strong> • Score : <strong>${duel.correctCount}</strong></span>
        <button class="secondary-btn compact-btn" id="exit-duel-btn">Quitter duel ✕</button>
      `;
    }

    headerEl.querySelector('#exit-duel-btn')?.addEventListener('click', () => {
      this.state.activeDuelSession = null;
      this.state.currentQuestionIndex = 0;
      if (window.location.hash.startsWith('#duel=')) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      this.renderArena();
    });
  }

  renderArena() {
    const arenaCard = document.getElementById('arena-section');
    const examWorkspace = document.getElementById('exam-blanc-workspace');

    if (this.state.exerciseMode === 'exam') {
      if (arenaCard) arenaCard.style.display = 'none';
      if (examWorkspace) examWorkspace.classList.add('open');
      this.renderExamWorkspace();
      return;
    }

    if (arenaCard) arenaCard.style.display = 'flex';
    if (examWorkspace) examWorkspace.classList.remove('open');

    this.renderDuelLiveHeader();

    const mod = this.getActiveModule();
    if (!mod) return;

    const questions = this.getFilteredQuestions();
    const idx = this.state.currentQuestionIndex % questions.length;
    const q = questions[idx];
    this.currentQuestion = q;
    this.state.answeredCurrent = false;

    const titleEl = document.getElementById('arena-module-title');
    const refEl = document.getElementById('arena-per-ref');
    if (titleEl) {
      titleEl.textContent = this.state.activeDuelSession
        ? `⚔️ Duel 1v1 — ${this.state.activeDuelSession.moduleTitle.split('(')[0].trim()}`
        : `${mod.icon} ${mod.title.split('(')[0].trim()}`;
    }
    if (refEl) refEl.textContent = mod.perRef;

    const modeBadge = this.state.activeDuelSession
      ? ' • ⚔️ Duel'
      : (this.state.exerciseMode === 'mistakes' ? ' • 🔁 Erreurs' : (q.isGenerated ? ' • ✨ Généré' : ''));
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

    if (this.state.activeDuelSession && !this.state.activeDuelSession.finished) {
      this.state.activeDuelSession.answered += 1;
      if (isCorrect) this.state.activeDuelSession.correctCount += 1;
      this.renderDuelLiveHeader();
    }

    if (isCorrect) {
      clickedEl.classList.add('correct');
      const gainedXp = this.state.exerciseMode === 'sprint' ? 35 : 25;
      this.state.xp += gainedXp;
      this.state.correctCount += 1;

      const hadMistake = this.state.mistakeQuestions.some(item => item.id === this.currentQuestion.id);
      this.state.mistakeQuestions = this.state.mistakeQuestions.filter(item => item.id !== this.currentQuestion.id);
      localStorage.setItem('vaud_mistake_questions', JSON.stringify(this.state.mistakeQuestions));
      if (hadMistake) {
        this.firebaseService?.deleteCloudMistake(this.currentQuestion.id);
      }

      const clearedNote = hadMistake ? ' • 🎯 Retiré de « Mes erreurs » !' : '';
      feedbackTitle.innerHTML = `✅ Excellent ! +${gainedXp} XP${clearedNote}`;
      feedbackTitle.style.color = '#10b981';
    } else {
      clickedEl.classList.add('wrong');
      if (!this.state.mistakeQuestions.some(item => item.id === this.currentQuestion.id)) {
        this.state.mistakeQuestions.push(this.currentQuestion);
        localStorage.setItem('vaud_mistake_questions', JSON.stringify(this.state.mistakeQuestions));
        this.firebaseService?.upsertCloudMistake(this.currentQuestion);
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
    const duel = this.state.activeDuelSession;
    if (duel && !duel.finished && this.state.currentQuestionIndex + 1 >= duel.questions.length) {
      this.finishDuelSession();
      return;
    }

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

  async finishDuelSession() {
    const duel = this.state.activeDuelSession;
    if (!duel || duel.finished) return;

    duel.finished = true;
    const total = duel.questions.length;
    const target = duel.challengerScore <= total ? duel.challengerScore : Math.min(total, 4);
    const won = duel.correctCount >= target;
    const bonus = won ? 40 : 15;

    this.state.xp += bonus;
    localStorage.setItem('vaud_xp', String(this.state.xp));

    if (this.firebaseService && this.state.isCloudConnected && duel.challengeCode) {
      await this.firebaseService.completeCloudDuel(duel.challengeCode, duel.correctCount);
    }

    this.syncStateToCloud();
    this.renderDuelLiveHeader();
    this.renderHeaderAndReadiness();
    this.renderDefisAndFamilyView();

    const feedbackBanner = document.getElementById('feedback-banner');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackRule = document.getElementById('feedback-rule');
    if (feedbackBanner && feedbackTitle && feedbackRule) {
      feedbackTitle.innerHTML = won
        ? `🏆 Duel remporté contre ${duel.challengerName} (${duel.correctCount}/${total}) • +${bonus} XP !`
        : `⚔️ Duel terminé (${duel.correctCount}/${total} vs ${target}/${total}) • +${bonus} XP d’effort !`;
      feedbackTitle.style.color = won ? '#10b981' : 'var(--accent-primary)';
      feedbackRule.textContent = 'Tu peux cliquer sur « Quitter duel ✕ » pour revenir aux chapitres ou relancer un nouveau duel dans 🏆 Défis & Famille.';
      feedbackBanner.classList.add('visible');
    }
  }

  startDuelSession(payload) {
    const meta = this.findModuleMeta(payload.modId || 'subordonnees');
    if (meta) {
      this.state.subject = meta.subjKey;
      this.state.activeModuleId = meta.mod.id;
    }
    const fallbackMod = meta?.mod || CURRICULUM_DATA.francais.modules[0];
    let questions = Array.isArray(payload.qIds)
      ? payload.qIds.map(id => this.findQuestionById(id)).filter(Boolean)
      : [];
    if (questions.length === 0) {
      questions = this.buildDuelQuestionIds(fallbackMod).map(id => this.findQuestionById(id)).filter(Boolean);
    }

    this.state.activeDuelSession = {
      challengeCode: payload.code || 'VD-11VP-DUEL',
      challengerName: payload.ch || 'Camarade 11e VP',
      challengerScore: typeof payload.score === 'number' ? payload.score : Math.min(5, Math.max(3, questions.length - 1)),
      moduleId: fallbackMod.id,
      moduleTitle: payload.modTitle || fallbackMod.title,
      questions,
      answered: 0,
      correctCount: 0,
      finished: false
    };
    this.state.exerciseMode = 'all';
    this.state.currentQuestionIndex = 0;
    this.state.answeredCurrent = false;
    this.state.theoryOpen = false;
    document.querySelectorAll('.mode-pill[data-mode]').forEach(p => {
      p.classList.toggle('active', p.dataset.mode === 'all');
    });
    this.renderSubjectTabs();
    this.renderLessonChapterSelect();
    this.switchView('entrainement');
    this.renderArena();
  }

  generateAndOpenNewExercise() {
    const mod = this.getActiveModule();
    if (!mod || !PERExerciseGenerator) return;

    this.state.activeDuelSession = null;
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
    this.state.activeDuelSession = null;
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
     Mode « Examen Blanc de Certificat Vaud » (DGEO 11e VP Simulation)
     ------------------------------------------------------------------------ */
  getActiveExam() {
    return CERTIFICAT_MOCK_EXAMS.find(e => e.id === this.state.activeExamId) || CERTIFICAT_MOCK_EXAMS[0];
  }

  startMockExam(examId = null) {
    if (examId) {
      this.state.activeExamId = examId;
    }
    const exam = this.getActiveExam();
    if (!exam) return;

    this.state.activeDuelSession = null;
    this.state.exerciseMode = 'exam';
    this.state.activeExamPart = 1;
    this.state.examAnswers = {};
    this.state.examGraded = false;
    this.state.examSecondsLeft = (exam.durationMinutes || 45) * 60;

    if (this.state.sprintTimer) clearInterval(this.state.sprintTimer);
    const sprintBadge = document.getElementById('sprint-timer-badge');
    if (sprintBadge) sprintBadge.style.display = 'none';

    document.querySelectorAll('.mode-pill[data-mode]').forEach(p => {
      p.classList.toggle('active', p.dataset.mode === 'exam');
    });

    this.startExamTimer();
    this.switchView('entrainement');
    this.renderArena();
  }

  startExamTimer() {
    if (this.state.examTimer) clearInterval(this.state.examTimer);
    const updateLabel = () => {
      const el = document.getElementById('exam-timer-pill');
      if (!el) return;
      const mins = Math.floor(this.state.examSecondsLeft / 60);
      const secs = this.state.examSecondsLeft % 60;
      el.textContent = `⏱️ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    updateLabel();
    this.state.examTimer = setInterval(() => {
      if (this.state.exerciseMode !== 'exam') return;
      if (this.state.examSecondsLeft > 0) {
        this.state.examSecondsLeft -= 1;
        updateLabel();
      }
    }, 1000);
  }

  exitExamMode() {
    if (this.state.examTimer) clearInterval(this.state.examTimer);
    this.state.exerciseMode = 'all';
    document.querySelectorAll('.mode-pill[data-mode]').forEach(p => {
      p.classList.toggle('active', p.dataset.mode === 'all');
    });
    this.renderArena();
  }

  renderExamWorkspace() {
    const exam = this.getActiveExam();
    if (!exam) return;

    const selectEl = document.getElementById('exam-selector');
    if (selectEl) {
      selectEl.innerHTML = CERTIFICAT_MOCK_EXAMS.map(ex => `
        <option value="${ex.id}" ${ex.id === exam.id ? 'selected' : ''}>${ex.title}</option>
      `).join('');
    }

    const p1Btn = document.getElementById('exam-part1-tab');
    const p2Btn = document.getElementById('exam-part2-tab');
    const p1Pane = document.getElementById('exam-part1-pane');
    const p2Pane = document.getElementById('exam-part2-pane');
    const gradeP1Btn = document.getElementById('exam-grade-part1-btn');
    const evalEssayBtn = document.getElementById('exam-eval-essay-btn');
    const switchBtn = document.getElementById('exam-switch-part-btn');

    const isPart1 = this.state.activeExamPart === 1;
    p1Btn?.classList.toggle('active', isPart1);
    p2Btn?.classList.toggle('active', !isPart1);
    if (p1Pane) p1Pane.style.display = isPart1 ? 'grid' : 'none';
    if (p2Pane) p2Pane.style.display = isPart1 ? 'none' : 'flex';
    if (gradeP1Btn) gradeP1Btn.style.display = isPart1 ? 'inline-flex' : 'none';
    if (evalEssayBtn) evalEssayBtn.style.display = isPart1 ? 'none' : 'inline-flex';
    if (switchBtn) {
      switchBtn.textContent = isPart1
        ? 'Passer à la Partie 2 (Rédaction) →'
        : '← Revenir à la Partie 1 (Texte & QCM)';
    }

    document.getElementById('exam-per-badge').textContent = exam.perBadge;
    document.getElementById('exam-passage-title').textContent = exam.passageTitle;
    document.getElementById('exam-passage-author').textContent = exam.passageAuthor;
    document.getElementById('exam-passage-text').textContent = exam.passageText;

    const qListEl = document.getElementById('exam-questions-list');
    if (qListEl) {
      qListEl.innerHTML = exam.questions.map(q => {
        const chosenIdx = this.state.examAnswers[q.id];
        return `
          <div class="exam-question-item">
            <div class="exam-q-prompt">${q.prompt}</div>
            ${q.sentence ? `<div class="exam-q-sentence">${q.sentence}</div>` : ''}
            <div class="exam-q-options">
              ${q.options.map((opt, idx) => {
                const classes = ['exam-opt-btn'];
                if (chosenIdx === idx) classes.push('selected');
                if (this.state.examGraded) {
                  if (idx === q.correctIndex) classes.push('correct');
                  else if (chosenIdx === idx) classes.push('wrong');
                }
                return `<button class="${classes.join(' ')}" data-exam-qid="${q.id}" data-exam-opt="${idx}" ${this.state.examGraded ? 'disabled' : ''}>${opt}</button>`;
              }).join('')}
            </div>
            ${this.state.examGraded ? `<div class="exam-q-explanation">💡 ${q.perRule}</div>` : ''}
          </div>
        `;
      }).join('');

      qListEl.querySelectorAll('.exam-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.state.examGraded) return;
          this.state.examAnswers[btn.dataset.examQid] = parseInt(btn.dataset.examOpt, 10);
          this.renderExamWorkspace();
        });
      });
    }

    document.getElementById('exam-writing-prompt').textContent = exam.writingPrompt;
    document.getElementById('exam-writing-guidance').textContent = exam.writingGuidance;

    const rubricEl = document.getElementById('exam-rubric-list');
    if (rubricEl) {
      rubricEl.innerHTML = exam.rubric.map((item, i) => `
        <label class="exam-rubric-item">
          <input type="checkbox" class="exam-rubric-cb" data-rubric-idx="${i}" />
          <span>${item}</span>
        </label>
      `).join('');
    }
  }

  gradeExamPart1() {
    const exam = this.getActiveExam();
    if (!exam || this.state.examGraded) return;

    this.state.examGraded = true;
    let correct = 0;
    exam.questions.forEach(q => {
      const chosen = this.state.examAnswers[q.id];
      this.state.answeredCount += 1;
      if (chosen === q.correctIndex) {
        correct += 1;
        this.state.correctCount += 1;
      } else {
        const mistakeCopy = { ...q, type: 'mcq' };
        if (!this.state.mistakeQuestions.some(m => m.id === mistakeCopy.id)) {
          this.state.mistakeQuestions.push(mistakeCopy);
          this.firebaseService?.upsertCloudMistake(mistakeCopy);
        }
      }
    });
    localStorage.setItem('vaud_mistake_questions', JSON.stringify(this.state.mistakeQuestions));

    // Swiss Canton of Vaud scale (/6.0, rounded to 0.5, threshold 4.0)
    const rawGrade = 1 + 5 * (correct / exam.questions.length);
    const grade = Math.round(rawGrade * 2) / 2;
    const bonusXp = correct >= 5 ? 50 : 25;
    this.state.xp += bonusXp;
    localStorage.setItem('vaud_xp', String(this.state.xp));
    localStorage.setItem('vaud_answered', String(this.state.answeredCount));
    localStorage.setItem('vaud_correct', String(this.state.correctCount));

    const pillEl = document.getElementById('exam-grade-pill');
    if (pillEl) {
      pillEl.textContent = `Note Partie 1 : ${grade.toFixed(1)} / 6.0 (${correct}/${exam.questions.length}) • +${bonusXp} XP`;
      pillEl.classList.toggle('pass', grade >= 4.0);
    }

    this.syncStateToCloud();
    this.renderHeaderAndReadiness();
    this.renderExamWorkspace();
  }

  evaluateExamEssay() {
    const exam = this.getActiveExam();
    const textarea = document.getElementById('exam-essay-textarea');
    const reportEl = document.getElementById('exam-coach-report');
    if (!exam || !textarea || !reportEl) return;

    const text = textarea.value.trim();
    const checkedRubric = document.querySelectorAll('#exam-rubric-list .exam-rubric-cb:checked').length;
    const report = this.aiCoach.evaluateArgumentativeEssay(exam.title, text);

    reportEl.style.display = 'block';
    reportEl.innerHTML = `
      <div><strong>🤖 Évaluation Coach IA (Critères DGEO Vaud)</strong> — Note estimée : <strong>${report.scoreOver6.toFixed(1)} / 6.0</strong> (${report.wordCount} mots • ${checkedRubric}/${exam.rubric.length} critères cochés)</div>
      <div style="margin-top:6px;">
        <strong>Connecteurs logiques détectés :</strong> ${report.foundConnectors.length ? report.foundConnectors.map(c => `« ${c} »`).join(', ') : 'Aucun détecté ⚠️'}
      </div>
      <ul style="margin:6px 0 0 18px;">
        ${report.tips.map(t => `<li>${t}</li>`).join('')}
      </ul>
    `;

    const pillEl = document.getElementById('exam-grade-pill');
    if (pillEl && !this.state.examGraded) {
      pillEl.textContent = `Rédaction estimée : ${report.scoreOver6.toFixed(1)} / 6.0 (${report.wordCount} mots)`;
      pillEl.classList.toggle('pass', report.scoreOver6 >= 4.0);
    }

    if (text.length >= 20) {
      this.sendAICoachMessage(`Évalue mon texte d'examen blanc (${report.wordCount} mots) : ${text.slice(0, 320)}`);
    }
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

    this.renderTeacherAssignmentBuilder();
  }

  renderTeacherAssignmentBuilder() {
    const pillsEl = document.getElementById('teacher-chapters-pills');
    const previewEl = document.getElementById('teacher-devoir-link-preview');
    if (!pillsEl) return;

    const allModules = [
      ...CURRICULUM_DATA.francais.modules.map(m => ({ ...m, subjLabel: 'FR' })),
      ...CURRICULUM_DATA.allemand.modules.map(m => ({ ...m, subjLabel: 'DE' }))
    ];

    pillsEl.innerHTML = allModules.map(m => {
      const checked = m.id === 'subordonnees' || m.id === 'orthographe';
      return `
        <label class="teacher-chap-pill">
          <input type="checkbox" class="teacher-chap-cb" value="${m.id}" ${checked ? 'checked' : ''} />
          <span>${m.icon} [${m.subjLabel}] ${m.title.split('(')[0].trim()}</span>
        </label>
      `;
    }).join('');

    const refreshPreview = () => {
      const url = this.buildTeacherShareUrl();
      if (previewEl && url) previewEl.textContent = url;
    };

    pillsEl.querySelectorAll('.teacher-chap-cb').forEach(cb => {
      cb.addEventListener('change', refreshPreview);
    });
    document.getElementById('teacher-assignment-title')?.addEventListener('input', refreshPreview);
    refreshPreview();
  }

  buildTeacherShareUrl() {
    const title = document.getElementById('teacher-assignment-title')?.value.trim() || 'Révision Certificat 11e VP';
    const checked = Array.from(document.querySelectorAll('.teacher-chap-cb:checked')).map(cb => cb.value);
    const modules = checked.length ? checked : ['subordonnees'];
    const encoded = this.encodeSharePayload({ title, modules });
    const base = (typeof window !== 'undefined' && window.location)
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://edutech-vaud-11vp.web.app/';
    return `${base}#devoir=${encoded}`;
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
        if (mode === 'exam') {
          this.startMockExam();
          return;
        }
        if (this.state.sprintTimer) clearInterval(this.state.sprintTimer);
        if (this.state.examTimer) clearInterval(this.state.examTimer);
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

    document.getElementById('hero-exam-btn')?.addEventListener('click', () => {
      this.startMockExam();
    });

    // Examen Blanc de Certificat Vaud Controls
    document.getElementById('exam-selector')?.addEventListener('change', (e) => {
      this.startMockExam(e.currentTarget.value);
    });

    document.getElementById('exam-part1-tab')?.addEventListener('click', () => {
      this.state.activeExamPart = 1;
      this.renderExamWorkspace();
    });

    document.getElementById('exam-part2-tab')?.addEventListener('click', () => {
      this.state.activeExamPart = 2;
      this.renderExamWorkspace();
    });

    document.getElementById('exam-switch-part-btn')?.addEventListener('click', () => {
      this.state.activeExamPart = this.state.activeExamPart === 1 ? 2 : 1;
      this.renderExamWorkspace();
    });

    document.getElementById('exam-exit-btn')?.addEventListener('click', () => {
      this.exitExamMode();
    });

    document.getElementById('exam-grade-part1-btn')?.addEventListener('click', () => {
      this.gradeExamPart1();
    });

    document.getElementById('exam-eval-essay-btn')?.addEventListener('click', () => {
      this.evaluateExamEssay();
    });

    document.getElementById('exam-essay-textarea')?.addEventListener('input', (e) => {
      const words = e.currentTarget.value.trim().split(/\s+/).filter(Boolean).length;
      const wcEl = document.getElementById('exam-word-count');
      if (wcEl) wcEl.textContent = `${words} / 180 mots visés`;
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

    // View 3: Défis & Famille Actions (URL-Encoded #duel=... & Cloud Firestore Duels)
    document.getElementById('copy-duel-btn')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const activeMod = this.getActiveModule();
      const modId = activeMod?.id || 'subordonnees';
      const modTitle = activeMod?.title || 'Programme PER';
      const qIds = activeMod ? this.buildDuelQuestionIds(activeMod) : ['sub-1', 'sub-2', 'sub-3', 'sub-4', 'sub-5'];
      const targetScore = Math.min(5, qIds.length);
      const challengerName = this.state.currentUser?.pseudo || 'Ton camarade 11e VP';

      if (this.firebaseService) {
        await this.firebaseService.createCloudDuel(this.state.duelCode, modId, modTitle, targetScore, qIds);
      }

      const payload = {
        code: this.state.duelCode,
        modId,
        modTitle,
        ch: challengerName,
        score: targetScore,
        xp: this.state.xp,
        qIds
      };
      const base = `${window.location.origin}${window.location.pathname}`;
      const shareUrl = `${base}#duel=${this.encodeSharePayload(payload)}`;
      const duelText = `⚔️ Duel Objectif Gymnase (11e VP Vaud) ! Rejoins mon défi ${this.state.duelCode} sur « ${modTitle.split('(')[0].trim()} » : ${shareUrl}`;
      this.copyTextSafe(shareUrl);

      const previewEl = document.getElementById('duel-share-preview');
      if (previewEl) {
        previewEl.style.display = 'block';
        previewEl.textContent = duelText;
      }

      if (btn) {
        const orig = btn.textContent;
        btn.textContent = '✅ Lien Duel (#duel=...) copié !';
        setTimeout(() => { btn.textContent = orig; }, 2500);
      }
    });

    document.getElementById('join-duel-btn')?.addEventListener('click', async () => {
      const raw = document.getElementById('join-duel-input')?.value.trim();
      if (!raw) return;

      if (raw.includes('#duel=')) {
        const hashPart = raw.split('#duel=')[1];
        const decoded = this.decodeSharePayload(hashPart);
        if (decoded) {
          this.startDuelSession(decoded);
          return;
        }
      }

      const cleanCode = raw.toUpperCase();
      const cloudDuel = this.firebaseService
        ? await this.firebaseService.loadCloudDuel(cleanCode)
        : null;

      if (cloudDuel) {
        this.startDuelSession({
          code: cloudDuel.challengeCode,
          modId: cloudDuel.moduleId,
          modTitle: cloudDuel.moduleTitle,
          ch: cloudDuel.challengerName,
          score: cloudDuel.challengerScore,
          qIds: cloudDuel.questionIds
        });
        return;
      }

      const activeMod = this.getActiveModule();
      this.startDuelSession({
        code: cleanCode.startsWith('VD-') ? cleanCode : `VD-DUEL-${cleanCode.slice(0, 8)}`,
        modId: activeMod?.id || 'subordonnees',
        modTitle: activeMod?.title || 'Programme PER',
        ch: 'Camarade 11e VP',
        score: 4,
        qIds: activeMod ? this.buildDuelQuestionIds(activeMod) : []
      });
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
      this.copyTextSafe(shareText);
      const btn = e.currentTarget;
      const orig = btn.textContent;
      btn.textContent = '✅ Résumé copié pour WhatsApp !';
      setTimeout(() => { btn.textContent = orig; }, 2500);
    });

    // View 4: Paramètres Interactions + Mode Enseignant (#devoir=...)
    document.querySelectorAll('[data-pick-vibe]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.applyVibe(btn.dataset.pickVibe, true);
      });
    });

    document.getElementById('generate-devoir-link-btn')?.addEventListener('click', (e) => {
      const url = this.buildTeacherShareUrl();
      const previewEl = document.getElementById('teacher-devoir-link-preview');
      if (previewEl) previewEl.textContent = url;
      this.copyTextSafe(url);
      const btn = e.currentTarget;
      const orig = btn.textContent;
      btn.textContent = '✅ Lien Devoir copié !';
      setTimeout(() => { btn.textContent = orig; }, 2500);
    });

    document.getElementById('preview-devoir-link-btn')?.addEventListener('click', () => {
      const url = this.buildTeacherShareUrl();
      const hashIdx = url.indexOf('#devoir=');
      if (hashIdx >= 0) {
        window.location.hash = url.slice(hashIdx);
        this.handleHashRoute();
        this.switchView('parcours');
      }
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
      if (this.state.exerciseMode === 'exam') return;
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
