/* ============================================================
   YAS Help Desk — Maintenance JS
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.getElementById('maintenance-body')) return;
  if (!YAS.requireAuth()) return;
  YAS.initDashboardSidebar();
  YAS.initGlobalSearch();
  YAS.initNotifPanel();

  await renderMaintenanceStats();
  await renderMaintenanceTable();
  bindSearch();
  bindFilter();
});

async function getMaintenanceTickets() {
  const tickets = await YASStorage.getAllTickets();
  return tickets.filter(t =>
    t.request_type === 'maintenance' ||
    t.status === 'maintenance' ||
    t.status === 'diagnosing'
  );
}

async function renderMaintenanceStats() {
  const tickets = await getMaintenanceTickets();

  const counts = {
    pending:    tickets.filter(t => ['received','reviewing'].includes(t.status)).length,
    inProgress: tickets.filter(t => ['contacting','diagnosing','maintenance'].includes(t.status)).length,
    waiting:    tickets.filter(t => t.status === 'waiting').length,
    completed:  tickets.filter(t => ['resolved','closed'].includes(t.status)).length
  };

  const animate = (id, val) => {
    const el = document.getElementById(id);
    if (el) YAS.animateCount(el, val, 600);
  };

  animate('maint-stat-pending',    counts.pending);
  animate('maint-stat-inprogress', counts.inProgress);
  animate('maint-stat-waiting',    counts.waiting);
  animate('maint-stat-completed',  counts.completed);
}

let maintData = [];

async function renderMaintenanceTable(filter = '', query = '') {
  const tbody = document.getElementById('maintenance-body');
  if (!tbody) return;

  maintData = await getMaintenanceTickets();

  let data = [...maintData];

  if (filter) data = data.filter(t => t.status === filter);
  if (query) {
    const q = query.toLowerCase();
    data = data.filter(t =>
      (t.id || t.ticket_number || '').toLowerCase().includes(q) ||
      (t.customer?.name || '').toLowerCase().includes(q) ||
      (t.device?.model || '').toLowerCase().includes(q)
    );
  }

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="9">
        <div class="empty-state">
          ${YAS.Icons.maintenance}
          <h3>لا توجد طلبات صيانة</h3>
          <p>لا توجد طلبات صيانة مطابقة</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(t => {
    const statusClass = {
      received:    'maint-pending',
      reviewing:   'maint-pending',
      contacting:  'maint-in-progress',
      diagnosing:  'maint-in-progress',
      maintenance: 'maint-in-progress',
      waiting:     'maint-waiting',
      resolved:    'maint-completed',
      closed:      'maint-completed'
    }[t.status] || 'maint-pending';

    const statusLabel = YAS.StatusLabels[t.status] || t.status;

    return `
      <tr style="cursor:pointer" onclick="window.location.href='ticket-details.html?id=${t.id}'">
        <td>
          <span class="fw-700 text-primary" style="font-family:var(--font-ui);font-size:0.8125rem">${t.id}</span>
        </td>
        <td class="fw-600">${t.customer.name}</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            ${YAS.getDeviceIcon(t.device.type)}
            ${t.device.brand} ${t.device.model}
          </div>
        </td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.875rem;color:var(--text-muted)" title="${t.request.description}">
          ${t.request.description.substring(0, 60)}${t.request.description.length > 60 ? '...' : ''}
        </td>
        <td style="font-size:0.8125rem;color:var(--text-muted)">${YAS.formatDate(t.createdAt)}</td>
        <td style="font-size:0.875rem">${t.assignedTo}</td>
        <td>
          <span class="badge ${statusClass}">${statusLabel}</span>
        </td>
        <td>${YAS.priorityBadge(t.request.priority)}</td>
        <td>
          <a href="ticket-details.html?id=${t.id}" class="btn btn-outline btn-sm" onclick="event.stopPropagation()">
            ${YAS.Icons.eye} عرض
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

function bindSearch() {
  const input = document.getElementById('maint-search');
  if (!input) return;
  input.addEventListener('input', YAS.debounce(e => {
    const filter = document.getElementById('maint-filter')?.value || '';
    renderMaintenanceTable(filter, e.target.value.trim());
  }, 250));
}

function bindFilter() {
  const filter = document.getElementById('maint-filter');
  if (!filter) return;
  filter.addEventListener('change', () => {
    const query = document.getElementById('maint-search')?.value.trim() || '';
    renderMaintenanceTable(filter.value, query);
  });
}
