/* ============================================================
   YAS Help Desk — PWA Registration
   Progressive Web App functionality
   ============================================================ */

'use strict';

/* ── Service Worker Registration ───────────────────────────── */
function registerServiceWorker() {
  // Temporarily disabled Service Worker due to Vercel redirect issues
  console.log('[PWA] Service Worker temporarily disabled');
  
  // Unregister any existing service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister().then(function() {
          console.log('[PWA] Unregistered existing Service Worker');
        });
      }
    });
    
    // Also clear caches immediately
    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      }).then(function() {
        console.log('[PWA] Cleared all caches');
      });
    }
  }
  
  return;
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered with scope:', registration.scope);
          
          // Force update immediately for debugging
          registration.update();
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available - force reload
                  console.log('[PWA] New Service Worker available, reloading...');
                  navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
                  setTimeout(() => window.location.reload(), 1000);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log('[PWA] Service Worker registration failed:', error);
        });
    });
  }
}

/* ── Show Update Notification ─────────────────────────────── */
function showUpdateNotification() {
  // Create update notification container
  let updateContainer = document.getElementById('pwa-update-container');
  if (!updateContainer) {
    updateContainer = document.createElement('div');
    updateContainer.id = 'pwa-update-container';
    updateContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: var(--primary);
      color: white;
      padding: 16px 20px;
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 12px;
      animation: slideUp 0.3s ease;
      max-width: 320px;
    `;
    document.body.appendChild(updateContainer);
  }
  
  updateContainer.innerHTML = `
    <div style="flex: 1;">
      <div style="font-weight: 600; margin-bottom: 4px;">تحديث متاح</div>
      <div style="font-size: 0.875rem; opacity: 0.9;">نسخة جديدة من YAS Help Desk متاحة</div>
    </div>
    <button onclick="reloadPage()" style="background: white; color: var(--primary); border: none; padding: 8px 16px; border-radius: var(--radius-md); font-weight: 600; cursor: pointer;">
      تحديث
    </button>
  `;
}

function reloadPage() {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }
  window.location.reload();
}

/* ── Install Prompt ───────────────────────────────────────── */
let deferredPrompt;
let installButtonAdded = false;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show install button if not already shown
  if (!installButtonAdded) {
    addInstallButton();
    installButtonAdded = true;
  }
});

function addInstallButton() {
  const installBtn = document.createElement('button');
  installBtn.className = 'btn btn-primary';
  installBtn.id = 'pwa-install-btn';
  installBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    تثبيت التطبيق
  `;
  installBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
  
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] User response to the install prompt:', outcome);
      // We've used the prompt, and can't use it again, throw it away
      deferredPrompt = null;
      // Hide the install button
      installBtn.style.display = 'none';
    }
  });
  
  document.body.appendChild(installBtn);
}

/* ── Hide Install Button After Installation ─────────────────── */
window.addEventListener('appinstalled', () => {
  console.log('[PWA] App was installed');
  const installBtn = document.getElementById('pwa-install-btn');
  if (installBtn) {
    installBtn.style.display = 'none';
  }
  YAS.showToast('تم تثبيت التطبيق بنجاح!', 'success');
});

/* ── Online/Offline Status ─────────────────────────────────── */
function updateOnlineStatus() {
  const isOnline = navigator.onLine;
  const statusEl = document.getElementById('connection-status');
  
  if (statusEl) {
    statusEl.innerHTML = isOnline 
      ? `<span style="color: var(--success);">● متصل</span>`
      : `<span style="color: var(--danger);">● غير متصل</span>`;
  }
  
  if (!isOnline) {
    YAS.showToast('أنت غير متصل بالإنترنت. العمل في وضع عدم الاتصال.', 'warning');
  } else {
    YAS.showToast('تم استعادة الاتصال بالإنترنت', 'success');
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

/* ── Add Connection Status to Header ─────────────────────────── */
function addConnectionStatus() {
  const header = document.querySelector('.portal-header, .top-bar');
  if (!header) return;
  
  const statusEl = document.createElement('div');
  statusEl.id = 'connection-status';
  statusEl.style.cssText = 'font-size: 0.75rem; margin-right: auto; padding: 4px 8px; border-radius: var(--radius-full); background: var(--surface-secondary);';
  header.appendChild(statusEl);
  
  updateOnlineStatus();
}

/* ── Initialize PWA ───────────────────────────────────────── */
function initPWA() {
  // Register service worker
  registerServiceWorker();
  
  // Add connection status
  addConnectionStatus();
  
  // Add manifest link to head
  const manifestLink = document.createElement('link');
  manifestLink.rel = 'manifest';
  manifestLink.href = 'manifest.json';
  document.head.appendChild(manifestLink);
  
  // Add theme color meta
  const themeColor = document.createElement('meta');
  themeColor.name = 'theme-color';
  themeColor.content = '#1A56DB';
  document.head.appendChild(themeColor);
  
  // Add apple touch icon
  const appleTouchIcon = document.createElement('link');
  appleTouchIcon.rel = 'apple-touch-icon';
  appleTouchIcon.href = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"%3E%3Crect width="192" height="192" rx="36" fill="%231A56DB"/%3E%3Ctext x="96" y="132" text-anchor="middle" font-family="Inter" font-weight="800" font-size="72" fill="white"%3EYAS%3C/text%3E%3C/svg%3E';
  document.head.appendChild(appleTouchIcon);
}

/* ── Initialize on load ─────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPWA);
} else {
  initPWA();
}

/* ── Force clear everything on load ─────────────────────────── */
window.addEventListener('load', () => {
  console.log('[PWA] Force clearing Service Worker and caches');
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      console.log('[PWA] Cleared all caches on load');
    });
  }
  
  // Unregister all service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      return Promise.all(
        registrations.map(function(registration) {
          return registration.unregister();
        })
      );
    }).then(function() {
      console.log('[PWA] Unregistered all Service Workers on load');
    });
  }
});

/* ── Global Functions ─────────────────────────────────────────── */
window.YASPWA = {
  init: initPWA,
  reload: reloadPage,
  install: () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
    }
  }
};
