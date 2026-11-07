// Keyboard Shortcuts System for YAS Help Desk
class KeyboardShortcuts {
  constructor() {
    this.shortcuts = {
      // Navigation
      'Home': () => window.location.href = 'index.html',
      'Control + h': () => window.location.href = 'index.html',
      
      // Support Page
      'Control + s': () => window.location.href = 'support.html',
      'Control + n': () => window.location.href = 'support.html', // New ticket
      
      // Tracking Page
      'Control + t': () => window.location.href = 'tracking.html',
      
      // Troubleshooting
      'Control + f': () => window.location.href = 'troubleshooting.html',
      
      // Chatbot
      'Control + c': () => this.toggleChatbot(),
      'Escape': () => this.closeChatbot(),
      
      // Search
      'Control + k': () => this.focusSearch(),
      'Control + /': () => this.showShortcutsHelp(),
      
      // Refresh
      'Control + r': () => window.location.reload(),
      'F5': () => window.location.reload(),
      
      // Go Back
      'Alt + ArrowLeft': () => window.history.back(),
      'Backspace': () => window.history.back(),
      
      // Go Forward
      'Alt + ArrowRight': () => window.history.forward(),
      
      // Top of Page
      'Home': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      
      // Bottom of Page
      'End': () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
      
      // Scroll Down
      'ArrowDown': () => window.scrollBy({ top: 100, behavior: 'smooth' }),
      'PageDown': () => window.scrollBy({ top: 500, behavior: 'smooth' }),
      
      // Scroll Up
      'ArrowUp': () => window.scrollBy({ top: -100, behavior: 'smooth' }),
      'PageUp': () => window.scrollBy({ top: -500, behavior: 'smooth' }),
      
      // Focus on Forms
      'Control + Shift + f': () => this.focusFirstInput(),
      
      // Submit Form
      'Control + Enter': () => this.submitForm(),
      
      // Clear Form
      'Control + Delete': () => this.clearForm(),
      
      // Print
      'Control + p': () => window.print(),
      
      // Help
      'F1': () => this.showShortcutsHelp(),
    };
    
    this.init();
  }
  
  init() {
    document.addEventListener('keydown', (e) => {
      this.handleShortcut(e);
    });
    
    // Create shortcuts help button
    this.createHelpButton();
    
    console.log('Keyboard shortcuts initialized');
  }
  
  handleShortcut(e) {
    // Don't trigger shortcuts when typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
      // Allow only specific shortcuts in inputs
      if (e.key === 'Escape' || (e.ctrlKey && e.key === 'Enter')) {
        // These are allowed
      } else {
        return;
      }
    }
    
    const key = this.getKeyString(e);
    
    if (this.shortcuts[key]) {
      e.preventDefault();
      this.shortcuts[key]();
      this.showShortcutFeedback(key);
    }
  }
  
  getKeyString(e) {
    let parts = [];
    
    if (e.ctrlKey) parts.push('Control');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    if (e.metaKey) parts.push('Meta');
    
    if (e.key === ' ') {
      parts.push('Space');
    } else if (e.key.length === 1) {
      parts.push(e.key.toUpperCase());
    } else {
      parts.push(e.key);
    }
    
    return parts.join(' + ');
  }
  
  toggleChatbot() {
    const toggle = document.getElementById('chatbot-toggle');
    if (toggle) {
      toggle.click();
    }
  }
  
  closeChatbot() {
    const chatWidget = document.querySelector('.chatbot-widget');
    if (chatWidget && chatWidget.classList.contains('open')) {
      const toggle = document.getElementById('chatbot-toggle');
      if (toggle) {
        toggle.click();
      }
    }
  }
  
  focusSearch() {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="بحث"], input[placeholder*="بحث"]');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    } else {
      this.showToast('لا يوجد حقل بحث في هذه الصفحة');
    }
  }
  
  focusFirstInput() {
    const firstInput = document.querySelector('input:not([type="hidden"]), textarea');
    if (firstInput) {
      firstInput.focus();
      firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  submitForm() {
    const form = document.querySelector('form');
    if (form) {
      const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitButton) {
        submitButton.click();
      }
    }
  }
  
  clearForm() {
    const form = document.querySelector('form');
    if (form) {
      form.reset();
      this.showToast('تم مسح النموذج');
    }
  }
  
  showShortcutFeedback(key) {
    const feedback = document.createElement('div');
    feedback.className = 'shortcut-feedback';
    feedback.textContent = `⌨️ ${key}`;
    feedback.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #1a56db;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      animation: fadeInOut 1s ease;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.remove();
    }, 1000);
  }
  
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'shortcut-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1a56db;
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
  
  createHelpButton() {
    const helpButton = document.createElement('button');
    helpButton.className = 'shortcuts-help-btn';
    helpButton.innerHTML = '⌨️';
    helpButton.title = 'اختصارات لوحة المفاتيح (Ctrl + /)';
    helpButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #1a56db;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 24px;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(26, 86, 219, 0.3);
      transition: all 0.3s ease;
    `;
    
    helpButton.addEventListener('mouseenter', () => {
      helpButton.style.transform = 'scale(1.1)';
      helpButton.style.boxShadow = '0 6px 16px rgba(26, 86, 219, 0.4)';
    });
    
    helpButton.addEventListener('mouseleave', () => {
      helpButton.style.transform = 'scale(1)';
      helpButton.style.boxShadow = '0 4px 12px rgba(26, 86, 219, 0.3)';
    });
    
    helpButton.addEventListener('click', () => this.showShortcutsHelp());
    
    document.body.appendChild(helpButton);
  }
  
  showShortcutsHelp() {
    // Remove existing modal
    const existingModal = document.getElementById('shortcuts-modal');
    if (existingModal) {
      existingModal.remove();
      return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'shortcuts-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      border-radius: 16px;
      padding: 30px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
      animation: slideUp 0.3s ease;
    `;
    
    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #1a56db; font-size: 24px;">⌨️ اختصارات لوحة المفاتيح</h2>
        <button id="close-shortcuts" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #666;">&times;</button>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <h3 style="color: #1a56db; margin-bottom: 10px;">🧭 التنقل</h3>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Ctrl + H</kbd> - الصفحة الرئيسية</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Ctrl + S</kbd> - تسجيل طلب</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Ctrl + T</kbd> - تتبع طلب</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Ctrl + F</kbd> - دليل الحلول</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Alt + ←</kbd> - رجوع</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Alt + →</kbd> - تقدم</div>
        </div>
        
        <div>
          <h3 style="color: #1a56db; margin-bottom: 10px;">💬 الشات بوت</h3>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Ctrl + C</kbd> - فتح الشات</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Esc</kbd> - إغلاق الشات</div>
          
          <h3 style="color: #1a56db; margin-bottom: 10px; margin-top: 20px;">🔍 البحث والنماذج</h3>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Ctrl + K</kbd> - التركيز على البحث</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Ctrl + Shift + F</kbd> - التركيز على الحقل</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Ctrl + Enter</kbd> - إرسال النموذج</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Ctrl + Delete</kbd> - مسح النموذج</div>
        </div>
        
        <div>
          <h3 style="color: #1a56db; margin-bottom: 10px;">📜 التمرير</h3>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Home</kbd> - أعلى الصفحة</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">End</kbd> - أسفل الصفحة</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">↑ ↓</kbd> - التمرير</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Page Up/Down</kbd> - تمرير سريع</div>
        </div>
        
        <div>
          <h3 style="color: #1a56db; margin-bottom: 10px;">⚙️ أخرى</h3>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Ctrl + R</kbd> - تحديث الصفحة</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Ctrl + P</kbd> - طباعة</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">F1</kbd> - عرض المساعدة</div>
          <div style="margin-bottom: 5px;"><kbd style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Ctrl + /</kbd> - عرض المساعدة</div>
        </div>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 8px;">
        <strong>💡 نصيحة:</strong> اضغط <kbd style="background: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Esc</kbd> لإغلاق هذه النافذة
      </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close on escape
    const closeHandler = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', closeHandler);
      }
    };
    document.addEventListener('keydown', closeHandler);
    
    // Close on button click
    document.getElementById('close-shortcuts').addEventListener('click', () => {
      modal.remove();
      document.removeEventListener('keydown', closeHandler);
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        document.removeEventListener('keydown', closeHandler);
      }
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  window.keyboardShortcuts = new KeyboardShortcuts();
});
