/* ============================================================
   YAS Help Desk — Customers JS
   customers.html + customer-details.html
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   CUSTOMERS LIST
   ══════════════════════════════════════════════════════════════ */
const CustomersPage = {
  customers:   [],
  filtered:    [],
  searchQuery: '',

  async init() {
    if (!document.getElementById('customers-table-body')) return;
    if (!YAS.requireAuth()) return;
    YAS.initDashboardSidebar();
    YAS.initGlobalSearch();
    YAS.initNotifPanel();

    await this.load();
    this.bindSearch();
  },

  async load() {
    const tickets = await YASStorage.getAllTickets();
    const map     = new Map();

    tickets.forEach(t => {
      const key = t.customer?.phone || t.customer?.name;
      if (!map.has(key)) {
        map.set(key, {
          key,
          name:        t.customer?.name || 'Unknown',
          phone:       t.customer?.phone || '—',
          whatsapp:    t.customer?.whatsapp || '—',
          email:       t.customer?.email || '—',
          company:     t.customer?.company || '—',
          tickets:     [],
          lastTicket:  t.created_at || t.createdAt,
          firstTicket: t.created_at || t.createdAt
        });
      }
      const c = map.get(key);
      c.tickets.push(t);
      const ticketDate = t.created_at || t.createdAt;
      if (ticketDate > c.lastTicket) c.lastTicket = ticketDate;
    });

    this.customers = Array.from(map.values());
    this.filtered  = [...this.customers];

    await this.renderStats(tickets);
    this.renderTable();
  },

  async renderStats(tickets) {
    const totalEl   = document.getElementById('cust-stat-total');
    const activeEl  = document.getElementById('cust-stat-active');
    const resolvedEl= document.getElementById('cust-stat-resolved');

    const totalCustomers = this.customers.length;
    const activeTickets  = tickets.filter(t => !['resolved','closed'].includes(t.status)).length;
    const resolvedTickets= tickets.filter(t =>  ['resolved','closed'].includes(t.status)).length);

    if (totalEl)    YAS.animateCount(totalEl,    totalCustomers, 600);
    if (activeEl)   YAS.animateCount(activeEl,   activeTickets, 600);
    if (resolvedEl) YAS.animateCount(resolvedEl, resolvedTickets, 600);
  },

  bindSearch() {
    const input = document.getElementById('cust-search');
    if (!input) return;
    input.addEventListener('input', YAS.debounce(e => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.applySearch();
    }, 250));
  },

  applySearch() {
    if (!this.searchQuery) {
      this.filtered = [...this.customers];
    } else {
      const q = this.searchQuery;
      this.filtered = this.customers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.company || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q)
      );
    }
    this.renderTable();
  },

  renderTable() {
    const tbody = document.getElementById('customers-table-body');
    if (!tbody) return;

    if (this.filtered.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="7">
          <div class="empty-state">
            ${YAS.Icons.customers}
            <h3>لا يوجد عملاء</h3>
            <p>${this.searchQuery ? 'لم يتم العثور على نتائج مطابقة' : 'لا يوجد عملاء مسجلون حتى الآن'}</p>
          </div>
        </td></tr>`;
      return;
    }

    const q = this.searchQuery;
    tbody.innerHTML = this.filtered.map(c => {
      const open    = c.tickets.filter(t => !['resolved','closed'].includes(t.status)).length;
      const resolved= c.tickets.filter(t =>  ['resolved','closed'].includes(t.status)).length;
      const lastT   = c.tickets[0];
      const initials = c.name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

      return `
        <tr style="cursor:pointer" onclick="window.location.href='customer-details.html?id=${encodeURIComponent(c.key)}'">
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:36px;height:36px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.75rem;font-weight:700;flex-shrink:0;font-family:var(--font-ui)">${initials}</div>
              <div>
                <div class="fw-600">${YAS.highlightText(c.name, q)}</div>
                ${c.company ? `<div style="font-size:0.75rem;color:var(--text-muted)">${YAS.highlightText(c.company, q)}</div>` : ''}
              </div>
            </div>
          </td>
          <td style="font-family:var(--font-ui)">${YAS.highlightText(c.phone, q)}</td>
          <td style="font-size:0.875rem;color:var(--text-muted)">${c.email || '—'}</td>
          <td>
            <span style="font-weight:700;font-size:0.9rem;font-family:var(--font-ui)">${c.tickets.length}</span>
          </td>
          <td>
            <span class="badge badge-reviewing">${open}</span>
          </td>
          <td>
            <span class="badge badge-resolved">${resolved}</span>
          </td>
          <td style="font-size:0.8125rem;color:var(--text-muted)">${YAS.timeAgo(c.lastTicket)}</td>
          <td>
            <a href="customer-details.html?id=${encodeURIComponent(c.key)}" class="btn btn-outline btn-sm" onclick="event.stopPropagation()">
              ${YAS.Icons.eye} عرض
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }
};

/* ══════════════════════════════════════════════════════════════
   CUSTOMER DETAILS
   ══════════════════════════════════════════════════════════════ */
const CustomerDetails = {
  init() {
    if (!document.getElementById('customer-detail-body')) return;
    if (!YAS.requireAuth()) return;
    YAS.initDashboardSidebar();
    YAS.initGlobalSearch();
    YAS.initNotifPanel();

    const params = new URLSearchParams(window.location.search);
    const key    = decodeURIComponent(params.get('id') || '');
    if (!key) return this.showNotFound();

    const tickets = YASStorage.getAllTickets().filter(t =>
      (t.customer.phone || t.customer.name) === key
    );

    if (tickets.length === 0) return this.showNotFound();

    const c       = tickets[0].customer;
    const initials= c.name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    // Populate header
    const avatarEl = document.getElementById('cust-avatar');
    if (avatarEl) avatarEl.textContent = initials;

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || '—';
    };

    setEl('cust-name-title', c.name);
    setEl('cust-company',    c.company);
    setEl('cust-phone',      c.phone);
    setEl('cust-whatsapp',   c.whatsapp || c.phone);
    setEl('cust-email',      c.email);

    // Stats
    const openTickets = tickets.filter(t => !['resolved','closed'].includes(t.status));
    const closedTickets = tickets.filter(t => ['resolved','closed'].includes(t.status));
    setEl('cust-stat-tickets',  tickets.length);
    setEl('cust-stat-open',     openTickets.length);
    setEl('cust-stat-resolved', closedTickets.length);
    setEl('cust-last-contact',  YAS.timeAgo(tickets[0].updatedAt));

    // Breadcrumb
    setEl('breadcrumb-cust-name', c.name);

    // Render tickets
    const tbody = document.getElementById('cust-tickets-body');
    if (tbody) {
      tbody.innerHTML = tickets.map(t => `
        <tr style="cursor:pointer" onclick="window.location.href='ticket-details.html?id=${t.id}'">
          <td>
            <span class="fw-700 text-primary" style="font-family:var(--font-ui);font-size:0.8125rem">${t.id}</span>
          </td>
          <td>${YAS.RequestTypeLabels[t.request.type] || t.request.type}</td>
          <td>
            <div style="display:flex;align-items:center;gap:6px">
              ${YAS.getDeviceIcon(t.device.type)}
              ${t.device.brand} ${t.device.model}
            </div>
          </td>
          <td>${YAS.priorityBadge(t.request.priority)}</td>
          <td>${YAS.statusBadge(t.status)}</td>
          <td style="font-size:0.8125rem;color:var(--text-muted)">${YAS.formatDate(t.createdAt)}</td>
          <td style="font-size:0.8125rem;color:var(--text-muted)">${YAS.timeAgo(t.updatedAt)}</td>
        </tr>
      `).join('');
    }

    document.title = `${c.name} — YAS Help Desk`;
  },

  showNotFound() {
    const body = document.getElementById('customer-detail-body');
    if (body) body.innerHTML = `
      <div class="empty-state" style="padding:80px">
        ${YAS.Icons.customers}
        <h3>العميل غير موجود</h3>
        <a href="customers.html" class="btn btn-primary" style="margin-top:16px">العودة</a>
      </div>`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CustomersPage.init();
  CustomerDetails.init();
});
