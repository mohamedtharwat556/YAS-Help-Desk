// Dark Mode Toggle
class ThemeToggle {
  constructor() {
    this.init();
  }

  init() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }

    // Create toggle button
    this.createToggleButton();
  }

  createToggleButton() {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.innerHTML = '🌙';
    toggleBtn.title = 'تبديل الوضع الليلي';
    toggleBtn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #1a56db;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 20px;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(26, 86, 219, 0.3);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    toggleBtn.addEventListener('mouseenter', () => {
      toggleBtn.style.transform = 'scale(1.1)';
      toggleBtn.style.boxShadow = '0 6px 16px rgba(26, 86, 219, 0.4)';
    });

    toggleBtn.addEventListener('mouseleave', () => {
      toggleBtn.style.transform = 'scale(1)';
      toggleBtn.style.boxShadow = '0 4px 12px rgba(26, 86, 219, 0.3)';
    });

    toggleBtn.addEventListener('click', () => this.toggleTheme());

    document.body.appendChild(toggleBtn);
    this.toggleBtn = toggleBtn;

    // Update icon based on current theme
    this.updateIcon();
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    this.updateIcon();
  }

  updateIcon() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    this.toggleBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  window.themeToggle = new ThemeToggle();
});
