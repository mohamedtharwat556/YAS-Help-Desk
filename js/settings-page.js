/* ============================================================
   YAS Help Desk — Settings Page JS
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('settings-page')) return;
  if (!YAS.requireAuth()) return;
  YAS.initDashboardSidebar();
  YAS.initGlobalSearch();
  YAS.initNotifPanel();

  loadSettings();
  bindSettingsNav();
  bindSettingsForms();
  bindDangerZone();
});

function loadSettings() {
  const s = YASStorage.getSettings();

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = !!val;
    else el.value = val || '';
  };

  set('set-company-name',    s.companyName);
  set('set-engineer-name',   s.engineerName);
  set('set-whatsapp',        s.whatsappNumber);
  set('set-email-notif',     s.emailNotif);
  set('set-auto-assign',     s.autoAssign);
  set('set-dark-mode',       YASStorage.getTheme() === 'dark');
}

function bindSettingsNav() {
  const navItems = document.querySelectorAll('.settings-nav-item');
  const panels   = document.querySelectorAll('.settings-panel');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      item.classList.add('active');
      const target = item.getAttribute('data-panel');
      const panel  = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });
}

function bindSettingsForms() {
  // General settings
  const generalForm = document.getElementById('general-settings-form');
  if (generalForm) {
    generalForm.addEventListener('submit', e => {
      e.preventDefault();
      const s = YASStorage.getSettings();
      s.companyName  = document.getElementById('set-company-name')?.value.trim() || s.companyName;
      s.engineerName = document.getElementById('set-engineer-name')?.value.trim() || s.engineerName;
      YASStorage.saveSettings(s);
      YAS.showToast('تم حفظ الإعدادات العامة', 'success');
    });
  }

  // Contact settings
  const contactForm = document.getElementById('contact-settings-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const s = YASStorage.getSettings();
      s.whatsappNumber = document.getElementById('set-whatsapp')?.value.trim() || '';
      YASStorage.saveSettings(s);
      YAS.showToast('تم حفظ إعدادات التواصل', 'success');
    });
  }

  // Dark mode toggle
  const darkToggle = document.getElementById('set-dark-mode');
  if (darkToggle) {
    darkToggle.addEventListener('change', () => {
      const theme = darkToggle.checked ? 'dark' : 'light';
      YASStorage.setTheme(theme);
      YAS.initTheme();
      YAS.showToast(theme === 'dark' ? 'تم تفعيل الوضع الداكن' : 'تم تفعيل الوضع الفاتح', 'info');
    });
  }

  // Auto-assign toggle
  const autoToggle = document.getElementById('set-auto-assign');
  if (autoToggle) {
    autoToggle.addEventListener('change', () => {
      const s = YASStorage.getSettings();
      s.autoAssign = autoToggle.checked;
      YASStorage.saveSettings(s);
      YAS.showToast(autoToggle.checked ? 'تم تفعيل التعيين التلقائي' : 'تم إيقاف التعيين التلقائي', 'info');
    });
  }

  // Email notif toggle
  const emailToggle = document.getElementById('set-email-notif');
  if (emailToggle) {
    emailToggle.addEventListener('change', () => {
      const s = YASStorage.getSettings();
      s.emailNotif = emailToggle.checked;
      YASStorage.saveSettings(s);
    });
  }
}

function bindDangerZone() {
  const resetBtn = document.getElementById('reset-demo-data');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      YAS.showConfirm({
        title:       'إعادة تعيين البيانات التجريبية',
        message:     'سيؤدي هذا إلى حذف جميع البيانات وإعادة تحميل البيانات التجريبية. هل أنت متأكد؟',
        confirmText: 'نعم، إعادة تعيين',
        type:        'danger',
        onConfirm: () => {
          localStorage.removeItem('yas_tickets');
          localStorage.removeItem('yas_notifications');
          localStorage.removeItem('yas_ticket_counter');
          YASStorage.seedDemoData();
          YAS.showToast('تمت إعادة تعيين البيانات التجريبية', 'success');
          setTimeout(() => window.location.reload(), 1000);
        }
      });
    });
  }

  const clearBtn = document.getElementById('clear-all-data');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      YAS.showConfirm({
        title:       'حذف جميع البيانات',
        message:     'هذا سيحذف جميع الطلبات والبيانات نهائياً. هذا الإجراء لا يمكن التراجع عنه.',
        confirmText: 'حذف الكل',
        type:        'danger',
        onConfirm: () => {
          ['yas_tickets','yas_notifications','yas_ticket_counter'].forEach(k => localStorage.removeItem(k));
          YAS.showToast('تم حذف جميع البيانات', 'success');
          setTimeout(() => window.location.reload(), 1000);
        }
      });
    });
  }
}
