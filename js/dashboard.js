/* ============================================================
   YAS Help Desk — Dashboard Overview JS
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', async () => {
  if (!YAS.requireAuth()) return;
  YAS.initDashboardSidebar();
  YAS.initGlobalSearch();
  YAS.initNotifPanel();

  console.log('[Dashboard] Initializing dashboard...');

  // Make functions async and wait for data
  await renderStats();
  await renderRecentTickets();
  await renderQuickChart();
  initGreeting();

  console.log('[Dashboard] Dashboard initialized');

  // Auto-refresh data every 30 seconds
  setInterval(async () => {
    console.log('[Dashboard] Auto-refreshing data...');
    await renderStats();
    await renderRecentTickets();
    await renderQuickChart();
  }, 30000);
});

/* ── Greeting ──────────────────────────────────────────────── */
function initGreeting() {
  const hour = new Date().getHours();
  let greeting = 'مرحباً';
  if (hour >= 5  && hour < 12) greeting = 'صباح الخير';
  else if (hour >= 12 && hour < 17) greeting = 'مساء الخير';
  else if (hour >= 17 && hour < 21) greeting = 'مساء النور';
  else greeting = 'مرحباً';

  const el = document.getElementById('greeting-text');
  if (el) el.textContent = `${greeting}، آدم`;

  const subEl = document.getElementById('greeting-date');
  if (subEl) {
    subEl.textContent = new Date().toLocaleDateString('ar-SA', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}

/* ── Statistics ────────────────────────────────────────────── */
async function renderStats() {
  console.log('[Dashboard] Loading stats...');

  const stats = await YASStorage.getStats();
  console.log('[Dashboard] Stats loaded:', stats);

  const animate = (id, val) => {
    const el = document.getElementById(id);
    if (el) YAS.animateCount(el, val, 800);
  };

  animate('stat-total',      stats.total);
  animate('stat-new',        stats.new);
  animate('stat-inprogress', stats.inProgress);
  animate('stat-resolved',   stats.resolved);
  animate('stat-urgent',     stats.urgent);

  const monthEl = document.getElementById('stat-month-new');
  if (monthEl) monthEl.textContent = `+${stats.newMonth} هذا الشهر`;
}

/* ── Recent Tickets Table ──────────────────────────────────── */
async function renderRecentTickets() {
  console.log('[Dashboard] Loading recent tickets...');

  const tbody = document.getElementById('recent-tickets-body');
  if (!tbody) return;

  const tickets = await YASStorage.getAllTickets();
  console.log('[Dashboard] Tickets loaded:', tickets.length, 'tickets');

  const recentTickets = tickets.slice(0, 8);

  if (recentTickets.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state" style="padding:48px">
            ${YAS.Icons.tickets}
            <h3>لا توجد طلبات دعم</h3>
            <p>لم يتم تلقي أي طلبات حتى الآن</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = recentTickets.map(t => {
    // Handle both API format (ticket_number) and LocalStorage format (id)
    const ticketId = t.ticket_number || t.id;
    const requestType = t.request?.type || t.request_type;
    const requestPriority = t.request?.priority || t.priority;
    const customerName = t.customer?.name || 'Unknown';
    const customerCompany = t.customer?.company || '—';
    const deviceType = t.device?.type || 'unknown';
    const deviceBrand = t.device?.brand || 'Unknown';
    const deviceModel = t.device?.model || 'Unknown';
    const createdAt = t.createdAt || t.created_at;

    return `
    <tr class="reveal" style="cursor:pointer" onclick="window.location.href='ticket-details.html?id=${t.id}'">
      <td>
        <span class="fw-700 text-primary" style="font-family:var(--font-ui);font-size:0.8125rem">${ticketId}</span>
      </td>
      <td>
        <div style="font-weight:600">${customerName}</div>
        <div style="font-size:0.75rem;color:var(--text-muted)">${customerCompany}</div>
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <span style="color:var(--text-muted)">${YAS.getDeviceIcon(deviceType)}</span>
          <span>${deviceBrand} ${deviceModel}</span>
        </div>
      </td>
      <td>${YAS.RequestTypeLabels[requestType] || requestType}</td>
      <td>${YAS.priorityBadge(requestPriority)}</td>
      <td>${YAS.statusBadge(t.status)}</td>
      <td style="font-size:0.8125rem;color:var(--text-muted)">${YAS.timeAgo(createdAt)}</td>
      <td>
        <a href="ticket-details.html?id=${t.id}" class="btn btn-ghost btn-sm" onclick="event.stopPropagation()">
          ${YAS.Icons.eye} عرض
        </a>
      </td>
    </tr>
  `;
  }).join('');

  // Trigger reveal animations
  requestAnimationFrame(() => {
    tbody.querySelectorAll('.reveal').forEach((row, i) => {
      setTimeout(() => row.classList.add('visible'), i * 50);
    });
  });
}

/* ── Quick Status Chart ────────────────────────────────────── */
async function renderQuickChart() {
  console.log('[Dashboard] Loading chart...');

  const container = document.getElementById('quick-chart');
  if (!container) return;

  const tickets = await YASStorage.getAllTickets();
  console.log('[Dashboard] Chart tickets loaded:', tickets.length);

  const statusCounts = {};
  tickets.forEach(t => {
    statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
  });

  const items = [
    { label: 'تم الاستلام',     key: 'received',    color: '#6D28D9' },
    { label: 'قيد المراجعة',    key: 'reviewing',   color: '#B45309' },
    { label: 'جاري التواصل',    key: 'contacting',  color: '#1E40AF' },
    { label: 'جاري الفحص',      key: 'diagnosing',  color: '#B91C1C' },
    { label: 'قيد الصيانة',     key: 'maintenance', color: '#92400E' },
    { label: 'بانتظار العميل',  key: 'waiting',     color: '#374151' },
    { label: 'تم الحل',         key: 'resolved',    color: '#065F46' },
    { label: 'مغلق',            key: 'closed',      color: '#64748B' }
  ].filter(i => (statusCounts[i.key] || 0) > 0);

  const total = tickets.length || 1;

  container.innerHTML = items.map(item => {
    const count = statusCounts[item.key] || 0;
    const pct   = Math.round((count / total) * 100);
    return `
      <div class="bar-row">
        <div class="bar-label">${item.label}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${pct}%;background:${item.color}">
            <span class="bar-value">${count}</span>
          </div>
        </div>
        <div style="font-size:0.75rem;color:var(--text-muted);width:36px;text-align:left;font-family:var(--font-ui)">${pct}%</div>
      </div>
    `;
  }).join('');
}
