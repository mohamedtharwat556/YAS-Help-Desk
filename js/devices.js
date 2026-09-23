/* ============================================================
   YAS Help Desk — Devices JS
   devices.html + device-details.html
   ============================================================ */

'use strict';

const DevicesPage = {
  devices:   [],
  filtered:  [],
  searchQuery: '',

  async init() {
    if (!document.getElementById('devices-table-body')) return;
    if (!YAS.requireAuth()) return;
    YAS.initDashboardSidebar();
    YAS.initGlobalSearch();
    YAS.initNotifPanel();

    await this.load();
    this.bindSearch();
    this.bindFilter();
  },

  async load() {
    const tickets = await YASStorage.getAllTickets();
    const map     = new Map();

    tickets.forEach(t => {
      const device = t.device || {};
      const key = device.serial_number || `${device.brand || ''}-${device.model || ''}-${t.customer?.phone || ''}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          type: device.type || 'unknown',
          brand: device.brand || 'Unknown',
          model: device.model || 'Unknown',
          serial_number: device.serial_number || '',
          purchase_date: device.purchase_date || device.purchaseDate || '',
          warranty_status: device.warranty_status || device.warranty || 'unknown',
          customer:   t.customer || {},
          tickets:    [],
          lastService: t.created_at || t.createdAt
        });
      }
      const d = map.get(key);
      d.tickets.push(t);
      const ticketDate = t.created_at || t.createdAt;
      if (ticketDate > d.lastService) d.lastService = ticketDate;
    });

    this.devices  = Array.from(map.values());
    this.filtered = [...this.devices];

    this.renderStats();
    this.renderTable();
  },

  renderStats() {
    const totalEl = document.getElementById('dev-stat-total');
    const activeEl = document.getElementById('dev-stat-active');
    const resolvedEl = document.getElementById('dev-stat-resolved');

    const totalDevices = this.devices.length;
    const activeWarranty = this.devices.filter(d => d.warranty_status === 'active').length;
    const expiredWarranty = this.devices.filter(d => d.warranty_status === 'expired').length;

    if (totalEl) YAS.animateCount(totalEl, totalDevices, 600);
    if (activeEl) YAS.animateCount(activeEl, activeWarranty, 600);
    if (resolvedEl) YAS.animateCount(resolvedEl, expiredWarranty, 600);
  },

  renderStats() {
    const setCount = (id, val) => {
      const el = document.getElementById(id);
      if (el) YAS.animateCount(el, val, 600);
    };

    setCount('dev-stat-total', this.devices.length);
    setCount('dev-stat-warranty-active', this.devices.filter(d => d.warranty === 'active').length);
    setCount('dev-stat-warranty-expired', this.devices.filter(d => d.warranty === 'expired').length);
  },

  bindSearch() {
    const input = document.getElementById('dev-search');
    if (!input) return;
    input.addEventListener('input', YAS.debounce(e => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.applyFilters();
    }, 250));
  },

  bindFilter() {
    const filterType = document.getElementById('filter-dev-type');
    const filterWarr = document.getElementById('filter-dev-warranty');

    if (filterType) filterType.addEventListener('change', () => this.applyFilters());
    if (filterWarr) filterWarr.addEventListener('change', () => this.applyFilters());
  },

  applyFilters() {
    let data = [...this.devices];
    const filterType = document.getElementById('filter-dev-type')?.value;
    const filterWarr = document.getElementById('filter-dev-warranty')?.value;

    if (this.searchQuery) {
      const q = this.searchQuery;
      data = data.filter(d =>
        (d.model || '').toLowerCase().includes(q) ||
        (d.brand || '').toLowerCase().includes(q) ||
        (d.serial_number || '').toLowerCase().includes(q) ||
        (d.customer?.name || '').toLowerCase().includes(q)
      );
    }

    if (filterType) data = data.filter(d => d.type === filterType);
    if (filterWarr) data = data.filter(d => d.warranty_status === filterWarr);

    this.filtered = data;
    this.renderTable();
  },

  renderTable() {
    const tbody = document.getElementById('devices-table-body');
    if (!tbody) return;

    if (this.filtered.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="8">
          <div class="empty-state">
            ${YAS.Icons.devices}
            <h3>لا توجد أجهزة</h3>
            <p>لا توجد أجهزة مسجلة في النظام حتى الآن</p>
          </div>
        </td></tr>`;
      return;
    }

    const q = this.searchQuery;
    tbody.innerHTML = this.filtered.map(d => {
      const openTickets = d.tickets.filter(t => !['resolved','closed'].includes(t.status)).length;
      return `
        <tr style="cursor:pointer" onclick="window.location.href='device-details.html?id=${encodeURIComponent(d.key)}'">
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:38px;height:38px;border-radius:var(--radius-md);background:var(--surface-secondary);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--text-muted)">
                ${YAS.getDeviceIcon(d.type)}
              </div>
              <div>
                <div class="fw-600">${YAS.highlightText(d.brand + ' ' + d.model, q)}</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">${YAS.DeviceTypeLabels[d.type] || d.type}</div>
              </div>
            </div>
          </td>
          <td style="font-size:0.875rem">${d.customer.name}</td>
          <td style="font-family:var(--font-ui);font-size:0.8125rem">${YAS.highlightText(d.serial_number || '—', q)}</td>
          <td style="font-size:0.8125rem">${d.purchaseDate ? YAS.formatDate(d.purchaseDate) : '—'}</td>
          <td>${YAS.warrantyBadge(d.warranty)}</td>
          <td>
            ${openTickets > 0
              ? `<span class="badge badge-reviewing">${openTickets}</span>`
              : `<span class="badge badge-closed">0</span>`}
          </td>
          <td style="font-size:0.8125rem;color:var(--text-muted)">${YAS.timeAgo(d.lastService)}</td>
          <td>
            <a href="device-details.html?id=${encodeURIComponent(d.key)}" class="btn btn-outline btn-sm" onclick="event.stopPropagation()">
              ${YAS.Icons.eye} عرض
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }
};

/* ── Device Details ────────────────────────────────────────── */
const DeviceDetails = {
  async init() {
    if (!document.getElementById('device-detail-body')) return;
    if (!YAS.requireAuth()) return;
    YAS.initDashboardSidebar();
    YAS.initGlobalSearch();
    YAS.initNotifPanel();

    const params = new URLSearchParams(window.location.search);
    const key    = decodeURIComponent(params.get('id') || '');
    if (!key) return this.showNotFound();

    const tickets = (await YASStorage.getAllTickets()).filter(t => {
      const k = t.device?.serial_number || `${t.device?.brand}-${t.device?.model}-${t.customer?.phone}`;
      return k === key;
    });

    if (tickets.length === 0) return this.showNotFound();

    const d = tickets[0].device;
    const c = tickets[0].customer;

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || '—';
    };

    const setHTML = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };

    // Device info
    const iconEl = document.getElementById('dev-icon-display');
    if (iconEl) iconEl.innerHTML = YAS.getDeviceIcon(d.type);

    setEl('dev-name-title',  `${d.brand} ${d.model}`);
    setEl('dev-type-label',  YAS.DeviceTypeLabels[d.type] || d.type);
    setEl('dev-brand',       d.brand);
    setEl('dev-model',       d.model);
    setEl('dev-serial',      d.serial_number);
    setEl('dev-purchase',    d.purchaseDate ? YAS.formatDate(d.purchaseDate) : '—');
    setHTML('dev-warranty',  YAS.warrantyBadge(d.warranty));

    // Owner
    setEl('dev-owner-name',  c.name);
    setEl('dev-owner-phone', c.phone);
    setEl('dev-owner-company', c.company);

    // Stats
    const openTickets = tickets.filter(t => !['resolved','closed'].includes(t.status));
    setEl('dev-stat-total',    tickets.length);
    setEl('dev-stat-open',     openTickets.length);
    setEl('dev-stat-resolved', tickets.filter(t => ['resolved','closed'].includes(t.status)).length);

    setEl('breadcrumb-dev-name', `${d.brand} ${d.model}`);

    // Tickets table
    const tbody = document.getElementById('dev-tickets-body');
    if (tbody) {
      tbody.innerHTML = tickets.map(t => `
        <tr style="cursor:pointer" onclick="window.location.href='ticket-details.html?id=${t.id}'">
          <td><span class="fw-700 text-primary" style="font-family:var(--font-ui);font-size:0.8125rem">${t.id}</span></td>
          <td>${YAS.RequestTypeLabels[t.request.type] || t.request.type}</td>
          <td>${YAS.priorityBadge(t.request.priority)}</td>
          <td>${YAS.statusBadge(t.status)}</td>
          <td style="font-size:0.8125rem;color:var(--text-muted)">${YAS.formatDate(t.createdAt)}</td>
        </tr>
      `).join('');
    }

    document.title = `${d.brand} ${d.model} — YAS Help Desk`;
  },

  showNotFound() {
    const body = document.getElementById('device-detail-body');
    if (body) body.innerHTML = `
      <div class="empty-state" style="padding:80px">
        ${YAS.Icons.devices}
        <h3>الجهاز غير موجود</h3>
        <a href="devices.html" class="btn btn-primary" style="margin-top:16px">العودة</a>
      </div>`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  DevicesPage.init();
  DeviceDetails.init();
});
