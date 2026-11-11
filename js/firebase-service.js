/* ==========================================================================
   Firebase Authentication & Cloud Firestore Service (v1.3.0)
   Objectif Gymnase — 11e VP Vaud (edutech.emtechnica.ch)
   Supports:
   - Firebase Auth (Email/Password, Google Sign-In, Anonymous Pseudo Upgrade)
   - Cloud Firestore Real-Time Profile Sync, Mistake Queue & 1v1 Friend Duels
   - Seamless Offline/Local Fallback when running without network
   ========================================================================== */

window.DEFAULT_FIREBASE_CONFIG = {
  projectId: "edutech-vaud-11vp",
  appId: "1:826886294014:web:7a5ce35d74e4abb40f98af",
  storageBucket: "edutech-vaud-11vp.firebasestorage.app",
  apiKey: "AIzaSyAMz0oMQyYJyE7red2lEH2_FHcDZCNxIWo",
  authDomain: "edutech-vaud-11vp.firebaseapp.com",
  messagingSenderId: "826886294014"
};

window.FIREBASE_CONFIG = window.FIREBASE_CONFIG || JSON.parse(localStorage.getItem('vaud_firebase_config') || 'null') || window.DEFAULT_FIREBASE_CONFIG;

window.VaudFirebaseService = class VaudFirebaseService {
  constructor(onAuthChangeCallback) {
    this.onAuthChange = onAuthChangeCallback || (() => {});
    this.app = null;
    this.auth = null;
    this.db = null;
    this.sdk = null;
    this.currentUser = JSON.parse(localStorage.getItem('vaud_local_user') || 'null');
    this.isCloudConnected = false;
    this.initPromise = this.init();
  }

  async init() {
    const config = window.FIREBASE_CONFIG;
    if (!config || !config.apiKey || !config.projectId) {
      this.onAuthChange(this.currentUser, false);
      return;
    }

    try {
      const [appMod, authMod, firestoreMod] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js'),
        import('https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js')
      ]);

      this.sdk = { ...appMod, ...authMod, ...firestoreMod };
      this.app = this.sdk.initializeApp(config);
      this.auth = this.sdk.getAuth(this.app);
      this.db = this.sdk.getFirestore(this.app);
      this.isCloudConnected = true;

      this.sdk.onAuthStateChanged(this.auth, async (fbUser) => {
        if (fbUser) {
          const profile = await this.loadUserProfile(fbUser.uid);
          this.currentUser = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            pseudo: profile?.pseudo || fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Élève 11e VP'),
            etablissement: profile?.etablissement || 'Canton de Vaud',
            avatar: profile?.avatar || '⚡',
            isAnonymous: fbUser.isAnonymous,
            isCloud: true
          };
          localStorage.setItem('vaud_local_user', JSON.stringify(this.currentUser));
          this.onAuthChange(this.currentUser, true, profile);
        } else {
          this.onAuthChange(this.currentUser, true, null);
        }
      });
    } catch (err) {
      console.warn('Firebase Cloud SDK running in local-first mode:', err.message);
      this.isCloudConnected = false;
      this.onAuthChange(this.currentUser, false);
    }
  }

  saveFirebaseConfig(configObj) {
    localStorage.setItem('vaud_firebase_config', JSON.stringify(configObj));
    window.FIREBASE_CONFIG = configObj;
    window.location.reload();
  }

  /* ------------------------------------------------------------------------
     Authentication Methods (Email/Password, Google, Quick Vaud Student Pseudo)
     ------------------------------------------------------------------------ */
  async signInWithPseudo(pseudo, etablissement = 'Collège de Béthusy', avatar = '⚡') {
    const cleanPseudo = (pseudo || 'Élève 11e VP').trim().slice(0, 40);
    const cleanSchool = (etablissement || 'Canton de Vaud').trim().slice(0, 60);

    if (this.isCloudConnected && this.auth && this.sdk) {
      try {
        const cred = await this.sdk.signInAnonymously(this.auth);
        await this.sdk.updateProfile(cred.user, { displayName: cleanPseudo });
        this.currentUser = {
          uid: cred.user.uid,
          email: '',
          pseudo: cleanPseudo,
          etablissement: cleanSchool,
          avatar,
          isAnonymous: true,
          isCloud: true
        };
        localStorage.setItem('vaud_local_user', JSON.stringify(this.currentUser));
        await this.syncProfile({ pseudo: cleanPseudo, etablissement: cleanSchool, avatar });
        this.onAuthChange(this.currentUser, true);
        return this.currentUser;
      } catch (e) {
        console.warn('Fallback to local profile session:', e.message);
      }
    }

    // Local-First Student Session (Instant & Zero-Friction)
    this.currentUser = {
      uid: 'local-' + Math.random().toString(36).slice(2, 10),
      email: '',
      pseudo: cleanPseudo,
      etablissement: cleanSchool,
      avatar,
      isAnonymous: false,
      isCloud: false
    };
    localStorage.setItem('vaud_local_user', JSON.stringify(this.currentUser));
    this.onAuthChange(this.currentUser, this.isCloudConnected);
    return this.currentUser;
  }

  async signUpWithEmail(email, password, pseudo, etablissement, avatar = '🦊') {
    if (!this.isCloudConnected || !this.auth) {
      return this.signInWithPseudo(pseudo || email.split('@')[0], etablissement, avatar);
    }
    const cred = await this.sdk.createUserWithEmailAndPassword(this.auth, email.trim(), password);
    await this.sdk.updateProfile(cred.user, { displayName: pseudo.trim() });
    this.currentUser = {
      uid: cred.user.uid,
      email: cred.user.email,
      pseudo: pseudo.trim(),
      etablissement: etablissement.trim(),
      avatar,
      isAnonymous: false,
      isCloud: true
    };
    localStorage.setItem('vaud_local_user', JSON.stringify(this.currentUser));
    await this.syncProfile({ pseudo: pseudo.trim(), etablissement: etablissement.trim(), avatar });
    this.onAuthChange(this.currentUser, true);
    return this.currentUser;
  }

  async signInWithEmail(email, password) {
    if (!this.isCloudConnected || !this.auth) {
      throw new Error('Configurez le projet Firebase ou utilisez la connexion rapide par Pseudo.');
    }
    const cred = await this.sdk.signInWithEmailAndPassword(this.auth, email.trim(), password);
    return cred.user;
  }

  async signInWithGoogle() {
    if (!this.isCloudConnected || !this.auth) {
      throw new Error('Configurez le projet Firebase ou utilisez la connexion rapide par Pseudo.');
    }
    const provider = new this.sdk.GoogleAuthProvider();
    const cred = await this.sdk.signInWithPopup(this.auth, provider);
    return cred.user;
  }

  async signOutUser() {
    if (this.isCloudConnected && this.auth) {
      try { await this.sdk.signOut(this.auth); } catch (e) {}
    }
    this.currentUser = null;
    localStorage.removeItem('vaud_local_user');
    this.onAuthChange(null, this.isCloudConnected);
  }

  /* ------------------------------------------------------------------------
     Cloud Firestore Profile, Leaderboard & 1v1 Friend Duels
     ------------------------------------------------------------------------ */
  async loadUserProfile(uid) {
    if (!this.isCloudConnected || !this.db) return null;
    try {
      const ref = this.sdk.doc(this.db, 'profiles', uid);
      const snap = await this.sdk.getDoc(ref);
      return snap.exists() ? snap.data() : null;
    } catch (e) {
      return null;
    }
  }

  async syncProfile(statePatch = {}) {
    if (!this.currentUser) return;
    if (!this.isCloudConnected || !this.db) return;

    try {
      const ref = this.sdk.doc(this.db, 'profiles', this.currentUser.uid);
      const payload = {
        pseudo: this.currentUser.pseudo || 'Élève 11e VP',
        etablissement: this.currentUser.etablissement || 'Canton de Vaud',
        avatar: this.currentUser.avatar || '⚡',
        xp: typeof statePatch.xp === 'number' ? statePatch.xp : parseInt(localStorage.getItem('vaud_xp') || '340', 10),
        streak: typeof statePatch.streak === 'number' ? statePatch.streak : parseInt(localStorage.getItem('vaud_streak') || '5', 10),
        answeredCount: typeof statePatch.answeredCount === 'number' ? statePatch.answeredCount : parseInt(localStorage.getItem('vaud_answered') || '18', 10),
        correctCount: typeof statePatch.correctCount === 'number' ? statePatch.correctCount : parseInt(localStorage.getItem('vaud_correct') || '15', 10),
        vibe: statePatch.vibe || localStorage.getItem('vaud_vibe') || 'academic',
        enabledSubjects: statePatch.enabledSubjects || JSON.parse(localStorage.getItem('vaud_enabled_subjects') || '["francais","allemand"]'),
        focusedModules: statePatch.focusedModules || JSON.parse(localStorage.getItem('vaud_focused_modules') || '[]'),
        updatedAt: this.sdk.serverTimestamp()
      };
      await this.sdk.setDoc(ref, payload, { merge: true });
    } catch (e) {
      console.warn('Cloud profile sync skipped:', e.message);
    }
  }

  async fetchLeaderboard() {
    if (!this.isCloudConnected || !this.db) return null;
    try {
      const q = this.sdk.query(
        this.sdk.collection(this.db, 'profiles'),
        this.sdk.orderBy('xp', 'desc'),
        this.sdk.limit(10)
      );
      const snap = await this.sdk.getDocs(q);
      const rows = [];
      snap.forEach(d => {
        const data = d.data();
        rows.push({
          uid: d.id,
          name: `${data.pseudo} (${data.etablissement || 'Vaud'})`,
          xp: data.xp || 0,
          streak: data.streak || 1,
          avatar: data.avatar || '⚡',
          isMe: this.currentUser && d.id === this.currentUser.uid
        });
      });
      return rows.length ? rows : null;
    } catch (e) {
      return null;
    }
  }

  async loadCloudMistakes() {
    if (!this.isCloudConnected || !this.db || !this.currentUser) return null;
    try {
      const colRef = this.sdk.collection(this.db, 'profiles', this.currentUser.uid, 'mistakes');
      const snap = await this.sdk.getDocs(colRef);
      const list = [];
      snap.forEach(d => {
        const data = d.data();
        if (data && data.id && data.prompt) list.push(data);
      });
      return list;
    } catch (e) {
      return null;
    }
  }

  async upsertCloudMistake(question) {
    if (!this.isCloudConnected || !this.db || !this.currentUser || !question?.id) return false;
    try {
      const ref = this.sdk.doc(this.db, 'profiles', this.currentUser.uid, 'mistakes', String(question.id).slice(0, 100));
      const payload = {
        id: String(question.id).slice(0, 100),
        type: question.type === 'surgery' ? 'surgery' : 'mcq',
        prompt: String(question.prompt || '').slice(0, 500),
        perRule: String(question.perRule || 'Règle PER 11e VP').slice(0, 1000),
        addedAt: this.sdk.serverTimestamp()
      };
      if (typeof question.sentence === 'string') {
        payload.sentence = question.sentence.slice(0, 1000);
      }
      if (Array.isArray(question.options)) {
        payload.options = question.options.slice(0, 10).map(o => String(o));
      }
      if (typeof question.correctIndex === 'number') {
        payload.correctIndex = Math.max(0, Math.min(10, Math.floor(question.correctIndex)));
      }
      if (Array.isArray(question.tokens)) {
        payload.tokens = question.tokens.slice(0, 50).map(t => String(t));
      }
      if (typeof question.correctTokenIndex === 'number') {
        payload.correctTokenIndex = Math.max(0, Math.min(50, Math.floor(question.correctTokenIndex)));
      }
      if (typeof question.isGenerated === 'boolean') {
        payload.isGenerated = question.isGenerated;
      }
      await this.sdk.setDoc(ref, payload);
      return true;
    } catch (e) {
      return false;
    }
  }

  async deleteCloudMistake(questionId) {
    if (!this.isCloudConnected || !this.db || !this.currentUser || !questionId) return false;
    try {
      const ref = this.sdk.doc(this.db, 'profiles', this.currentUser.uid, 'mistakes', String(questionId).slice(0, 100));
      await this.sdk.deleteDoc(ref);
      return true;
    } catch (e) {
      return false;
    }
  }

  async createCloudDuel(challengeCode, moduleId, moduleTitle, challengerScore, questionIds = []) {
    if (!this.isCloudConnected || !this.db || !this.currentUser) return false;
    try {
      const ref = this.sdk.doc(this.db, 'duels', challengeCode);
      const payload = {
        challengeCode: String(challengeCode).slice(0, 30),
        challengerId: this.currentUser.uid,
        challengerName: (this.currentUser.pseudo || 'Élève 11e VP').slice(0, 40),
        challengerScore: Math.max(0, Math.floor(challengerScore || 0)),
        moduleId: String(moduleId || 'subordonnees').slice(0, 60),
        moduleTitle: String(moduleTitle || 'Programme PER').slice(0, 120),
        status: 'open',
        createdAt: this.sdk.serverTimestamp()
      };
      if (Array.isArray(questionIds) && questionIds.length > 0) {
        payload.questionIds = questionIds.slice(0, 20).map(q => String(q));
      }
      await this.sdk.setDoc(ref, payload);
      return true;
    } catch (e) {
      return false;
    }
  }

  async loadCloudDuel(challengeCode) {
    if (!this.isCloudConnected || !this.db || !challengeCode) return null;
    try {
      const ref = this.sdk.doc(this.db, 'duels', String(challengeCode).trim().toUpperCase());
      const snap = await this.sdk.getDoc(ref);
      return snap.exists() ? snap.data() : null;
    } catch (e) {
      return null;
    }
  }

  async completeCloudDuel(challengeCode, opponentScore) {
    if (!this.isCloudConnected || !this.db || !this.currentUser || !challengeCode) return false;
    try {
      const ref = this.sdk.doc(this.db, 'duels', String(challengeCode).trim().toUpperCase());
      await this.sdk.updateDoc(ref, {
        opponentId: this.currentUser.uid,
        opponentName: (this.currentUser.pseudo || 'Ami(e) 11e VP').slice(0, 40),
        opponentScore: Math.max(0, Math.floor(opponentScore || 0)),
        status: 'completed',
        updatedAt: this.sdk.serverTimestamp()
      });
      return true;
    } catch (e) {
      return false;
    }
  }
};
