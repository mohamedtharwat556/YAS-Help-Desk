/* ============================================================
   YAS Help Desk — Notifications Module
   ============================================================ */

'use strict';

// Loaded by dashboard pages that need live notification updates
document.addEventListener('DOMContentLoaded', () => {
  YAS.initNotifPanel();

  // Poll for new notifications every 30 seconds
  setInterval(() => {
    YAS.updateNotifBadge();
  }, 30000);
});
