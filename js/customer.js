/* ============================================================
   YAS Help Desk — Customer Portal JS
   Home page and shared portal behaviour
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Animate the ticket preview counter (if on home page)
  const previewId = document.getElementById('preview-ticket-id');
  if (previewId) {
    const tickets = YASStorage.getAllTickets();
    if (tickets.length > 0) {
      const latest = tickets[0];
      previewId.textContent = latest.id;
      const statusEl = document.getElementById('preview-status');
      if (statusEl) {
        statusEl.innerHTML = YAS.statusBadge(latest.status);
      }
    }
  }

  // Category cards — clicking sets request type in sessionStorage then redirects
  document.querySelectorAll('.category-card[data-type]').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      const type = card.getAttribute('data-type');
      sessionStorage.setItem('yas_prefill_type', type);
      window.location.href = 'support.html';
    });
  });

  // Animate stats on home (if present)
  document.querySelectorAll('[data-count-to]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count-to'), 10);
    YAS.animateCount(el, target, 1000);
  });
});
