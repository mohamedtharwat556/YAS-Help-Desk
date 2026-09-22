/* ============================================================
   YAS Help Desk — Warranty JS
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('warranty-body')) return;
  if (!YAS.requireAuth()) return;
  YAS.initDashboardSidebar();
  YAS.initGlobalSearch();
  YAS.initNotifPanel();

  renderWarrantyStats();
  renderWarrantyTable();
  bindWarrantySearch();
  bindWarrantyFilter();
});

function getWarrantyTickets() {
  return YASStorage.getAllTickets().filter(t =>
    t.request.type === 'warranty' ||
    t.device.warranty === 'active' ||
    t.device.warranty === 'expired' ||
    t.device.warranty === 'expiring'
  );
}

function renderWarrantyStats() {
  const tickets = YASStorage.getAllTickets();

  const animate = (id, val) => {
    const el = document.getElementById(id);
    if (el) YAS.animateCount(el, val, 600);
  };

  const warrantyRequests = tickets.filter(t => t.request.type === 'warranty');
  const activeWarranty   = tickets.filter(t => t.device.warranty === 'active');
  const expiredWarranty  = tickets.filter(t => t.device.warranty === 'expired');

  animate('warr-stat-requests', warrantyRequests.length);
  animate('warr-stat-active',   activeWarranty.length);
  animate('warr-stat-expired',  expiredWarranty.length);
}

function renderWarrantyTable(filter = '', query = '') {
  const tbody = document.getElementById('warranty-body');
  if (!tbody) return;

  let data = getWarrantyTickets();

  if (filter) data = data.filter(t => t.device.warranty === filter);
  if (query) {
    const q = query.toLowerCase();
    data = data.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.customer.name.toLowerCase().includes(q) ||
      t.device.model.toLowerCase().includes(q) ||
      (t.device.serial_number || '').toLowerCase().includes(q)
    );
  }

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="9">
        <div class="empty-state">
          ${YAS.Icons.warranty}
          <h3>لا توجد طلبات ضمان</h3>
          <p>لا توجد طلبات ضمان مطابقة للفلتر المحدد</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(t => {
    const warrantyStatusClass = {
      active:   'warranty-active',
      expired:  'warranty-expired',
      expiring: 'warranty-expiring',
      unknown:  ''
    }[t.device.warranty] || '';

    return `
      <tr style="cursor:pointer" onclick="window.location.href='ticket-details.html?id=${t.id}'">
        <td>
          <span class="fw-700 text-primary" style="font-family:var(--font-ui);font-size:0.8125rem">${t.id}</span>
        </td>
        <td class="fw-600">${t.customer.name}</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            ${YAS.getDeviceIcon(t.device.type)}
            <div>
              <div class="fw-600" style="font-size:0.875rem">${t.device.brand} ${t.device.model}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${YAS.DeviceTypeLabels[t.device.type] || ''}</div>
            </div>
          </div>
        </td>
        <td style="font-family:var(--font-ui);font-size:0.8125rem">${t.device.serial_number || '—'}</td>
        <td style="font-size:0.8125rem">${t.device.purchaseDate ? YAS.formatDate(t.device.purchaseDate) : '—'}</td>
        <td>
          <span class="badge ${warrantyStatusClass}" style="padding:4px 12px">
            ${YAS.WarrantyLabels[t.device.warranty] || '—'}
          </span>
        </td>
        <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.875rem;color:var(--text-muted)">
          ${t.request.description.substring(0, 50)}...
        </td>
        <td>${YAS.statusBadge(t.status)}</td>
        <td>
          <a href="ticket-details.html?id=${t.id}" class="btn btn-outline btn-sm" onclick="event.stopPropagation()">
            ${YAS.Icons.eye}
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

function bindWarrantySearch() {
  const input = document.getElementById('warr-search');
  if (!input) return;
  input.addEventListener('input', YAS.debounce(e => {
    const filter = document.getElementById('warr-filter')?.value || '';
    renderWarrantyTable(filter, e.target.value.trim());
  }, 250));
}

function bindWarrantyFilter() {
  const filter = document.getElementById('warr-filter');
  if (!filter) return;
  filter.addEventListener('change', () => {
    const query = document.getElementById('warr-search')?.value.trim() || '';
    renderWarrantyTable(filter.value, query);
  });
}
