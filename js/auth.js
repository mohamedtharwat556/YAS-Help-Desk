/* ============================================================
   YAS Help Desk — Auth Module
   Real authentication using backend API
   ============================================================ */

'use strict';

/* ── Login Page ────────────────────────────────────────────── */
function initLoginPage() {
  const form      = document.getElementById('login-form');
  const emailInput= document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  const submitBtn = document.getElementById('login-submit');
  const errorDiv  = document.getElementById('login-error');
  const togglePass= document.getElementById('toggle-password');

  if (!form) return;

  // If already authenticated, go to dashboard
  if (YASStorage.isAuthenticated()) {
    window.location.href = 'dashboard.html';
    return;
  }

  // Toggle password visibility
  if (togglePass) {
    togglePass.addEventListener('click', () => {
      const type = passInput.type === 'password' ? 'text' : 'password';
      passInput.type = type;
      togglePass.innerHTML = type === 'text'
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    });
  }

  // Form submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    handleLogin(
      emailInput.value.trim(),
      passInput.value,
      submitBtn,
      errorDiv
    );
  });

  // Demo fill button
  const demoFill = document.getElementById('demo-fill');
  if (demoFill) {
    demoFill.addEventListener('click', () => {
      emailInput.value = 'adam@yas.sa';
      passInput.value  = 'admin123';
      emailInput.classList.remove('error');
      passInput.classList.remove('error');
      if (errorDiv) errorDiv.style.display = 'none';
    });
  }
}

async function handleLogin(email, password, btn, errorDiv) {
  // Clear previous errors
  if (errorDiv) errorDiv.style.display = 'none';

  if (!email || !password) {
    showLoginError(errorDiv, 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
    return;
  }

  // Show loading
  const originalText = btn.innerHTML;
  btn.innerHTML = `<span class="loading-dots"><span></span><span></span><span></span></span>`;
  btn.disabled  = true;

  try {
    // Use real API login
    const response = await YAS_API.login(email, password);
    
    if (response && response.user) {
      // Store session data
      YASStorage.setSession({
        authenticated: true,
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        phone: response.user.phone,
        initials: response.user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        loginTime: new Date().toISOString()
      });

      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        جاري الدخول...
      `;

      YAS.showToast('مرحباً، ' + response.user.name.split(' ')[0], 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 600);
    }
  } catch (error) {
    btn.innerHTML = originalText;
    btn.disabled  = false;
    showLoginError(errorDiv, error.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');

    // Shake animation on inputs
    document.getElementById('login-email')?.classList.add('error');
    document.getElementById('login-password')?.classList.add('error');
  }
}

function showLoginError(div, message) {
  if (!div) return;
  div.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
    <span>${message}</span>
  `;
  div.style.display = 'flex';
}

/* ── Logout ────────────────────────────────────────────────── */
function logout() {
  YAS.showConfirm({
    title:       'تسجيل الخروج',
    message:     'هل تريد تسجيل الخروج من لوحة التحكم؟',
    confirmText: 'نعم، خروج',
    cancelText:  'إلغاء',
    type:        'warning',
    onConfirm: () => {
      YAS_API.logout();
      YASStorage.clearSession();
      window.location.href = 'login.html';
    }
  });
}

/* ── Get current session user ──────────────────────────────── */
function getCurrentUser() {
  return YASStorage.getSession();
}

/* ── Populate user info in sidebar ────────────────────────── */
function populateSidebarUser() {
  const session = getCurrentUser();
  if (!session) return;

  const nameEl     = document.getElementById('sidebar-user-name');
  const roleEl     = document.getElementById('sidebar-user-role');
  const initialsEl = document.getElementById('sidebar-user-initials');

  if (nameEl)     nameEl.textContent     = session.name     || 'Eng. Adam Farouk';
  if (roleEl)     roleEl.textContent     = session.role     || 'Technical Support Engineer';
  if (initialsEl) initialsEl.textContent = session.initials || 'AF';
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoginPage();

  // Set up logout buttons
  document.querySelectorAll('.logout-btn, #logout-btn').forEach(btn => {
    btn.addEventListener('click', logout);
  });

  // Populate user info
  populateSidebarUser();
});

window.YASAuth = { logout, getCurrentUser, populateSidebarUser };
