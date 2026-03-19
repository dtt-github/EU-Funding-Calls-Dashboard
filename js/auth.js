/*
 * Supabase Auth + per-user selection persistence.
 *
 * Depends on:  js/config.js  (SUPABASE_URL, SUPABASE_ANON)
 *              Supabase JS SDK loaded via CDN
 */
(function () {
  'use strict';

  /* ── Supabase client ── */
  var sb = null;

  function getClient() {
    if (sb) return sb;
    if (typeof supabase === 'undefined' || typeof SUPABASE_URL === 'undefined') return null;
    if (SUPABASE_URL === 'https://YOUR_PROJECT.supabase.co') return null;
    sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    return sb;
  }

  /* ── State ── */
  var currentUser = null;
  var sharedUserId = null;
  var sharedUserEmail = null;

  function isConfigured() {
    return typeof SUPABASE_URL !== 'undefined' &&
           SUPABASE_URL !== 'https://YOUR_PROJECT.supabase.co';
  }

  /* ── Auth helpers ── */

  async function signUp(email, password) {
    var client = getClient();
    if (!client) throw new Error('Supabase not configured');
    var res = await client.auth.signUp({ email: email, password: password });
    if (res.error) throw res.error;
    return res.data;
  }

  async function signIn(email, password) {
    var client = getClient();
    if (!client) throw new Error('Supabase not configured');
    var res = await client.auth.signInWithPassword({ email: email, password: password });
    if (res.error) throw res.error;
    return res.data;
  }

  async function signOut() {
    var client = getClient();
    if (!client) return;
    await client.auth.signOut();
  }

  async function getSession() {
    var client = getClient();
    if (!client) return null;
    var res = await client.auth.getSession();
    return res.data.session;
  }

  function onAuthStateChange(callback) {
    var client = getClient();
    if (!client) return { data: { subscription: { unsubscribe: function () {} } } };
    return client.auth.onAuthStateChange(function (_event, session) {
      currentUser = session ? session.user : null;
      callback(currentUser);
    });
  }

  /* ── Selection CRUD ── */

  async function loadSelections(userId) {
    var client = getClient();
    if (!client) return [];
    var res = await client
      .from('selections')
      .select('topic_id')
      .eq('user_id', userId);
    if (res.error) { console.error('loadSelections:', res.error); return []; }
    return res.data.map(function (r) { return r.topic_id; });
  }

  async function saveSelection(topicId) {
    var client = getClient();
    if (!client || !currentUser) return false;
    var res = await client
      .from('selections')
      .insert({ user_id: currentUser.id, topic_id: topicId });
    if (res.error && res.error.code !== '23505') {
      console.error('saveSelection:', res.error);
      return false;
    }
    return true;
  }

  async function removeSelection(topicId) {
    var client = getClient();
    if (!client || !currentUser) return false;
    var res = await client
      .from('selections')
      .delete()
      .eq('user_id', currentUser.id)
      .eq('topic_id', topicId);
    if (res.error) { console.error('removeSelection:', res.error); return false; }
    return true;
  }

  /* ── Shared view ── */

  function getSharedUserId() {
    var params = new URLSearchParams(window.location.search);
    return params.get('shared') || null;
  }

  async function loadSharedUserEmail(userId) {
    var client = getClient();
    if (!client) return null;
    var res = await client
      .from('selections')
      .select('user_id')
      .eq('user_id', userId)
      .limit(1);
    if (res.error || !res.data.length) return null;
    return userId.slice(0, 8) + '…';
  }

  /* ── UI wiring ── */

  function initAuthUI() {
    var loginBtn = document.getElementById('auth-login-btn');
    var userInfo = document.getElementById('auth-user-info');
    var userEmail = document.getElementById('auth-user-email');
    var logoutBtn = document.getElementById('auth-logout-btn');
    var modal = document.getElementById('login-modal');
    var modalClose = document.getElementById('login-modal-close');
    var authForm = document.getElementById('auth-form');
    var authToggle = document.getElementById('auth-toggle');
    var authError = document.getElementById('auth-error');
    var authSubmit = document.getElementById('auth-submit');
    var shareBtn = document.getElementById('share-selections-btn');
    var sharedBanner = document.getElementById('shared-banner');
    var sharedBannerClose = document.getElementById('shared-banner-close');

    if (!loginBtn) return;

    if (!isConfigured()) {
      loginBtn.style.display = 'none';
      return;
    }

    var isSignUp = false;

    loginBtn.addEventListener('click', function () {
      modal.classList.add('visible');
      authError.textContent = '';
    });

    modalClose.addEventListener('click', function () {
      modal.classList.remove('visible');
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.remove('visible');
    });

    authToggle.addEventListener('click', function () {
      isSignUp = !isSignUp;
      authSubmit.textContent = isSignUp ? 'Create Account' : 'Sign In';
      authToggle.innerHTML = isSignUp
        ? 'Already have an account? <strong>Sign in</strong>'
        : "Don't have an account? <strong>Sign up</strong>";
      authError.textContent = '';
    });

    authForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var email = document.getElementById('auth-email').value.trim();
      var pass = document.getElementById('auth-password').value;
      authError.textContent = '';
      authSubmit.disabled = true;
      authSubmit.textContent = 'Please wait…';

      try {
        if (isSignUp) {
          await signUp(email, pass);
          authError.style.color = 'var(--type-csa)';
          authError.textContent = 'Check your email for a confirmation link!';
        } else {
          await signIn(email, pass);
          modal.classList.remove('visible');
        }
      } catch (err) {
        authError.style.color = 'var(--type-ppi)';
        authError.textContent = err.message || 'Authentication failed';
      }

      authSubmit.disabled = false;
      authSubmit.textContent = isSignUp ? 'Create Account' : 'Sign In';
    });

    logoutBtn.addEventListener('click', async function () {
      await signOut();
    });

    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        if (!currentUser) return;
        var url = window.location.origin + window.location.pathname + '?shared=' + currentUser.id;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            window.Auth._showToast('Share link copied to clipboard!');
          });
        } else {
          window.Auth._showToast(url);
        }
      });
    }

    sharedUserId = getSharedUserId();
    if (sharedUserId && sharedBanner) {
      sharedBanner.classList.add('visible');
      var sharedLabel = document.getElementById('shared-banner-label');
      if (sharedLabel) sharedLabel.textContent = 'Viewing selections shared by user ' + sharedUserId.slice(0, 8) + '…';
    }
    if (sharedBannerClose) {
      sharedBannerClose.addEventListener('click', function () {
        sharedBanner.classList.remove('visible');
        sharedUserId = null;
        window.history.replaceState({}, '', window.location.pathname);
        if (window.Auth._onSharedCleared) window.Auth._onSharedCleared();
      });
    }

    onAuthStateChange(function (user) {
      currentUser = user;
      if (user) {
        loginBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        userEmail.textContent = user.email;
        if (shareBtn) shareBtn.style.display = 'inline-flex';
      } else {
        loginBtn.style.display = 'inline-flex';
        userInfo.style.display = 'none';
        userEmail.textContent = '';
        if (shareBtn) shareBtn.style.display = 'none';
      }
      if (window.Auth._onAuthChange) window.Auth._onAuthChange(user);
    });

    (async function () {
      var session = await getSession();
      if (session && session.user) {
        currentUser = session.user;
        loginBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        userEmail.textContent = session.user.email;
        if (shareBtn) shareBtn.style.display = 'inline-flex';
        if (window.Auth._onAuthChange) window.Auth._onAuthChange(session.user);
      }
    })();
  }

  /* ── Public API ── */
  window.Auth = {
    initUI:           initAuthUI,
    isConfigured:     isConfigured,
    signUp:           signUp,
    signIn:           signIn,
    signOut:          signOut,
    getUser:          function () { return currentUser; },
    getSharedUserId:  getSharedUserId,
    loadSelections:   loadSelections,
    saveSelection:    saveSelection,
    removeSelection:  removeSelection,
    onAuthStateChange: onAuthStateChange,
    _onAuthChange:    null,
    _onSharedCleared: null,
    _showToast:       null
  };
})();
