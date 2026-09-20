/* ============================================================
   YAS Help Desk — Ticket Manager JS
   tickets.html + ticket-details.html
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   TICKETS LIST PAGE
   ══════════════════════════════════════════════════════════════ */
const TicketManager = {
  allTickets:    [],
  filtered:      [],
  currentPage:   1,
  perPage:       10,
  sortField:     'createdAt',
  sortDir:       'desc',
  activeFilters: {},
  searchQuery:   '',

  async init() {
    if (!document.getElementById('tickets-table-body')) return;
    if (!YAS.requireAuth()) return;
    YAS.initDashboardSidebar();
    YAS.initGlobalSearch();
    YAS.initNotifPanel();

    this.allTickets = await YASStorage.getAllTickets();
    this.filtered   = Array.isArray(this.allTickets) ? [...this.allTickets] : [];

    this.bindFilters();
    this.bindSearch();
    this.bindSort();
    this.render();
  },

  bindSearch() {
    const input = document.getElementById('ticket-search');
    if (!input) return;
    input.addEventListener('input', YAS.debounce(e => {
      this.searchQuery  = e.target.value.trim().toLowerCase();
      this.currentPage  = 1;
      this.applyFilters();
    }, 250));
  },

  bindFilters() {
    const filterIds = ['filter-status', 'filter-priority', 'filter-device', 'filter-type'];
    filterIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', () => {
        this.activeFilters[id] = el.value;
        this.currentPage = 1;
        this.applyFilters();
      });
    });

    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        filterIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
        const searchInput = document.getElementById('ticket-search');
        if (searchInput) searchInput.value = '';
        this.activeFilters = {};
        this.searchQuery   = '';
        this.currentPage   = 1;
        this.applyFilters();
      });
    }
  },

  bindSort() {
    document.querySelectorAll('[data-sort]').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const field = th.getAttribute('data-sort');
        if (this.sortField === field) {
          this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortField = field;
          this.sortDir   = 'desc';
        }
        this.applyFilters();
      });
    });

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        const [field, dir] = sortSelect.value.split('-');
        this.sortField = field;
        this.sortDir   = dir;
        this.applyFilters();
      });
    }
  },

  applyFilters() {
    let data = [...this.allTickets];

    // Search
    if (this.searchQuery) {
      const q = this.searchQuery;
      data = data.filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.customer.name.toLowerCase().includes(q) ||
        t.customer.phone.includes(q) ||
        t.device.model.toLowerCase().includes(q) ||
        t.device.serialNumber.toLowerCase().includes(q) ||
        t.customer.company.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (this.activeFilters['filter-status']) {
      data = data.filter(t => t.status === this.activeFilters['filter-status']);
    }

    // Priority filter
    if (this.activeFilters['filter-priority']) {
      data = data.filter(t => t.request.priority === this.activeFilters['filter-priority']);
    }

    // Device filter
    if (this.activeFilters['filter-device']) {
      data = data.filter(t => t.device.type === this.activeFilters['filter-device']);
    }

    // Type filter
    if (this.activeFilters['filter-type']) {
      data = data.filter(t => t.request.type === this.activeFilters['filter-type']);
    }

    // Sort
    data.sort((a, b) => {
      let va, vb;
      if (this.sortField === 'createdAt' || this.sortField === 'updatedAt') {
        va = new Date(a[this.sortField]).getTime();
        vb = new Date(b[this.sortField]).getTime();
      } else if (this.sortField === 'priority') {
        const order = { critical: 4, high: 3, medium: 2, low: 1 };
        va = order[a.request.priority] || 0;
        vb = order[b.request.priority] || 0;
      } else {
        va = a[this.sortField] || '';
        vb = b[this.sortField] || '';
      }

      return this.sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

    this.filtered    = data;
    this.currentPage = 1;
    this.render();
  },

  render() {
    this.renderTable();
    this.renderPagination();
    this.renderFilterCount();
  },

  renderTable() {
    const tbody = document.getElementById('tickets-table-body');
    if (!tbody) return;

    const start = (this.currentPage - 1) * this.perPage;
    const page  = this.filtered.slice(start, start + this.perPage);

    if (this.filtered.length === 0) {
      const isFiltering = this.searchQuery || Object.values(this.activeFilters).some(v => v);
      tbody.innerHTML = `
        <tr>
          <td colspan="11">
            <div class="empty-state">
              ${YAS.Icons.search}
              <h3>${isFiltering ? 'لم نجد أي نتائج مطابقة' : 'لا توجد طلبات دعم'}</h3>
              <p>${isFiltering ? 'حاول تغيير معايير البحث أو الفلترة' : 'لم يتم تلقي أي طلبات حتى الآن'}</p>
            </div>
          </td>
        </tr>`;
      return;
    }

    const q = this.searchQuery;
    tbody.innerHTML = page.map(t => {
      // Handle both API format (ticket_number) and LocalStorage format (id)
      const ticketId = t.ticket_number || t.id;
      const createdAt = t.createdAt || t.created_at;
      const updatedAt = t.updatedAt || t.updated_at;

      return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <span class="fw-700 text-primary" style="font-family:var(--font-ui);font-size:0.8125rem;white-space:nowrap">
              ${YAS.highlightText(ticketId, q)}
            </span>
            <button class="btn btn-ghost" style="padding:2px 4px" onclick="YAS.copyToClipboard('${ticketId}')" data-tooltip="نسخ">
              ${YAS.Icons.copy}
            </button>
          </div>
        </td>
        <td>
          <div class="fw-600">${YAS.highlightText(t.customer?.name || 'Unknown', q)}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">${YAS.highlightText(t.customer?.phone || '—', q)}</div>
        </td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="color:var(--text-muted);flex-shrink:0">${YAS.getDeviceIcon(t.device?.type || 'unknown')}</span>
            <div>
              <div class="fw-600" style="font-size:0.875rem">${YAS.highlightText(t.device?.model || 'Unknown', q)}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${YAS.DeviceTypeLabels[t.device?.type] || t.device?.type || 'Unknown'}</div>
            </div>
          </div>
        </td>
        <td>${YAS.RequestTypeLabels[t.request?.type || t.request_type] || t.request?.type || t.request_type || 'Unknown'}</td>
        <td>${YAS.priorityBadge(t.request?.priority || t.priority || 'medium')}</td>
        <td>${YAS.statusBadge(t.status)}</td>
        <td>${typeof YASSLA !== 'undefined' ? YASSLA.getBadge(t) : '—'}</td>
        <td style="font-size:0.875rem">${t.assignedTo || t.assigned_user?.name || 'Unassigned'}</td>
        <td style="font-size:0.8125rem;color:var(--text-muted);white-space:nowrap">${YAS.formatDate(createdAt)}</td>
        <td style="font-size:0.8125rem;color:var(--text-muted);white-space:nowrap">${YAS.timeAgo(updatedAt)}</td>
        <td>
          <div class="ticket-actions-cell">
            <a href="ticket-details.html?id=${t.id}" class="btn btn-outline btn-sm" data-tooltip="عرض">
              ${YAS.Icons.eye}
            </a>
            <button class="btn btn-ghost btn-sm" data-tooltip="تحديث الحالة" onclick="openStatusModal('${t.id}','${t.status}')">
              ${YAS.Icons.edit}
            </button>
            <button class="btn btn-ghost btn-sm" data-tooltip="حذف" onclick="deleteTicketAction('${t.id}')">
              ${YAS.Icons.trash}
            </button>
          </div>
        </td>
      </tr>
    `;
    }).join('');
  },

  renderPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;

    const total     = this.filtered.length;
    const totalPages = Math.ceil(total / this.perPage);
    const start      = (this.currentPage - 1) * this.perPage + 1;
    const end        = Math.min(this.currentPage * this.perPage, total);

    const infoEl = container.querySelector('.pagination-info');
    if (infoEl) {
      infoEl.textContent = total > 0
        ? `عرض ${start}–${end} من ${total} طلب`
        : 'لا توجد نتائج';
    }

    const btnsEl = container.querySelector('.pagination-buttons');
    if (!btnsEl) return;

    if (totalPages <= 1) {
      btnsEl.innerHTML = '';
      return;
    }

    let html = `
      <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="TicketManager.goToPage(${this.currentPage - 1})">
        ${YAS.Icons.chevronRight}
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (totalPages > 7 && (i > 3 && i < totalPages - 1 && Math.abs(i - this.currentPage) > 1)) {
        if (i === 4 || i === totalPages - 2) html += `<span class="page-btn" style="cursor:default">…</span>`;
        continue;
      }
      html += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" onclick="TicketManager.goToPage(${i})">${i}</button>`;
    }

    html += `
      <button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="TicketManager.goToPage(${this.currentPage + 1})">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
    `;

    btnsEl.innerHTML = html;
  },

  renderFilterCount() {
    const countEl = document.getElementById('filter-count');
    if (!countEl) return;
    countEl.textContent = this.filtered.length;
  },

  goToPage(page) {
    const totalPages = Math.ceil(this.filtered.length / this.perPage);
    if (page < 1 || page > totalPages) return;
    this.currentPage = page;
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  async refresh() {
    this.allTickets = await YASStorage.getAllTickets();
    this.allTickets = Array.isArray(this.allTickets) ? this.allTickets : [];
    this.applyFilters();
  }
};

/* ── Status Quick Update (from ticket list) ────────────────── */
function openStatusModal(ticketId, currentStatus) {
  const modal   = document.getElementById('status-modal');
  const select  = document.getElementById('modal-status-select');
  const titleEl = document.getElementById('modal-ticket-id');

  if (!modal || !select) return;

  if (titleEl) titleEl.textContent = ticketId;
  if (select)  select.value = currentStatus;

  modal.setAttribute('data-ticket-id', ticketId);
  YAS.openModal('status-modal');
}

function confirmStatusUpdate() {
  const modal    = document.getElementById('status-modal');
  const select   = document.getElementById('modal-status-select');
  const noteInput= document.getElementById('modal-status-note');
  const ticketId = modal?.getAttribute('data-ticket-id');

  if (!ticketId || !select) return;

  const newStatus = select.value;
  const note      = noteInput?.value.trim() || '';

  YASStorage.updateTicketStatus(ticketId, newStatus, note);

  YAS.closeModal('status-modal');
  YAS.showToast('تم تحديث حالة الطلب بنجاح', 'success');
  TicketManager.refresh();
}

function deleteTicketAction(ticketId) {
  YAS.showConfirm({
    title:       'حذف الطلب',
    message:     `هل أنت متأكد من حذف الطلب ${ticketId}؟ لا يمكن التراجع عن هذا الإجراء.`,
    confirmText: 'نعم، حذف',
    cancelText:  'إلغاء',
    type:        'danger',
    onConfirm: () => {
      YASStorage.deleteTicket(ticketId);
      YAS.showToast(`تم حذف الطلب ${ticketId}`, 'success');
      TicketManager.refresh();
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   TICKET DETAILS PAGE
   ══════════════════════════════════════════════════════════════ */
const TicketDetails = {
  ticket: null,

  init() {
    if (!document.getElementById('ticket-detail-container')) return;
    if (!YAS.requireAuth()) return;
    YAS.initDashboardSidebar();
    YAS.initGlobalSearch();
    YAS.initNotifPanel();

    const params   = new URLSearchParams(window.location.search);
    const ticketId = params.get('id');

    if (!ticketId) {
      this.showNotFound();
      return;
    }

    this.ticket = YASStorage.getTicketById(ticketId);

    if (!this.ticket) {
      this.showNotFound();
      return;
    }

    this.render();
    this.bindActions();
  },

  render() {
    const t = this.ticket;

    // Handle both API format (ticket_number) and LocalStorage format (id)
    const ticketId = t.ticket_number || t.id;
    const createdAt = t.createdAt || t.created_at;
    const updatedAt = t.updatedAt || t.updated_at;

    // Breadcrumb
    const bcId = document.getElementById('breadcrumb-ticket-id');
    if (bcId) bcId.textContent = ticketId;

    // Header
    this.setEl('detail-ticket-id',   ticketId);
    this.setEl('detail-ticket-type', YAS.RequestTypeLabels[t.request?.type || t.request_type] || t.request?.type || t.request_type);
    this.setHTML('detail-status',    YAS.statusBadge(t.status));
    this.setHTML('detail-priority',  YAS.priorityBadge(t.request?.priority || t.priority));
    this.setEl('detail-assigned',    t.assignedTo || t.assigned_user?.name || 'Unassigned');
    this.setEl('detail-created',     YAS.formatDateTime(createdAt));
    this.setEl('detail-updated',     YAS.timeAgo(updatedAt));

    // Customer
    this.setEl('cust-detail-name',    t.customer?.name || 'Unknown');
    this.setEl('cust-detail-phone',   t.customer?.phone || '—');
    this.setEl('cust-detail-wa',      t.customer?.whatsapp || t.customer?.phone || '—');
    this.setEl('cust-detail-email',   t.customer?.email || '—');
    this.setEl('cust-detail-company', t.customer?.company || '—');

    // Device
    this.setEl('dev-detail-type',    YAS.DeviceTypeLabels[t.device?.type] || t.device?.type || 'Unknown');
    this.setEl('dev-detail-brand',   t.device?.brand || '—');
    this.setEl('dev-detail-model',   t.device?.model || '—');
    this.setEl('dev-detail-serial',  t.device?.serial_number || t.device?.serialNumber || '—');
    this.setEl('dev-detail-date',    t.device?.purchase_date || t.device?.purchaseDate ? YAS.formatDate(t.device?.purchase_date || t.device?.purchaseDate) : '—');
    this.setHTML('dev-detail-warranty', YAS.warrantyBadge(t.device?.warranty_status || t.device?.warranty || 'unknown'));

    // Description
    this.setEl('issue-description', t.request?.description || t.description || '—');

    // Attached Files
    if (typeof YASFileUpload !== 'undefined' && (t.request?.files || t.files) && (t.request?.files?.length || t.files?.length) > 0) {
      YASFileUpload.displayFiles('attached-files-container', t.request?.files || t.files);
    }

    // Contact buttons
    const waBtn    = document.getElementById('contact-wa-btn');
    const phoneBtn = document.getElementById('contact-phone-btn');
    const emailBtn = document.getElementById('contact-email-btn');

    if (waBtn) {
      const waNumber = t.customer?.whatsapp || t.customer?.phone;
      const waMsg    = `مرحباً ${t.customer?.name}، بخصوص طلب الدعم الفني رقم ${ticketId}`;
      waBtn.href = YAS.buildWhatsAppLink(waNumber, waMsg);
      waBtn.target = '_blank';
      waBtn.addEventListener('click', () => {
        YASStorage.addTicketActivity(t.id, 'تم التواصل عبر WhatsApp', `تواصل الفني مع العميل ${t.customer.name} عبر واتساب`, 'contact');
        YAS.showToast('تم التواصل عبر واتساب', 'success');
        this.refreshActivities();
      });
    }

    if (phoneBtn) {
      phoneBtn.href = `tel:${t.customer.phone}`;
      phoneBtn.addEventListener('click', () => {
        YASStorage.addTicketActivity(t.id, 'تم الاتصال الهاتفي', `تواصل الفني مع العميل ${t.customer.name} هاتفياً`, 'contact');
        this.refreshActivities();
      });
    }

    if (emailBtn && t.customer.email) {
      emailBtn.href = `mailto:${t.customer.email}?subject=طلب الدعم ${t.id}&body=مرحباً ${t.customer.name}`;
    }

    // Notes
    this.renderNotes();

    // Activities
    this.renderActivities();

    // Status select
    const statusSelect = document.getElementById('status-select');
    if (statusSelect) statusSelect.value = t.status;

    // Page title
    document.title = `${ticketId} — YAS Help Desk`;
  },

  renderNotes() {
    const container = document.getElementById('notes-list');
    if (!container) return;

    const notes = this.ticket.notes || [];

    if (notes.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding:var(--space-5)">
          ${YAS.Icons.note}
          <p style="font-size:0.875rem">لا توجد ملاحظات داخلية حتى الآن</p>
        </div>`;
      return;
    }

    container.innerHTML = notes.map(n => `
      <div class="note-item fade-in">
        <div class="note-item-header">
          <span class="note-author">${n.author}</span>
          <span class="note-time">${YAS.formatDateTime(n.time)}</span>
        </div>
        <div class="note-text">${n.text}</div>
      </div>
    `).join('');
  },

  renderActivities() {
    const container = document.getElementById('activity-list');
    if (!container) return;

    const activities = [...(this.ticket.activities || [])].reverse();

    container.innerHTML = activities.map(a => `
      <div class="activity-item fade-in">
        <div class="activity-dot"></div>
        <div class="activity-time">${YAS.formatTime(a.time)} · ${YAS.formatDate(a.time)}</div>
        <div class="activity-label">${a.label}</div>
        ${a.desc ? `<div class="activity-desc">${a.desc}</div>` : ''}
      </div>
    `).join('');
  },

  bindActions() {
    // Status update
    const updateBtn = document.getElementById('update-status-btn');
    if (updateBtn) {
      updateBtn.addEventListener('click', () => {
        const select  = document.getElementById('status-select');
        const noteIn  = document.getElementById('status-note');
        if (!select) return;

        const newStatus = select.value;
        const note      = noteIn?.value.trim() || '';

        if (newStatus === this.ticket.status) {
          YAS.showToast('الحالة لم تتغير', 'warning');
          return;
        }

        YASStorage.updateTicketStatus(this.ticket.id, newStatus, note);
        this.ticket = YASStorage.getTicketById(this.ticket.id);

        // Refresh status badge
        this.setHTML('detail-status', YAS.statusBadge(this.ticket.status));
        this.renderActivities();

        if (noteIn) noteIn.value = '';

        YAS.showToast('تم تحديث حالة الطلب بنجاح', 'success');

        // Flash animation
        const headerCard = document.getElementById('ticket-header-card');
        if (headerCard) {
          headerCard.classList.add('status-changed');
          setTimeout(() => headerCard.classList.remove('status-changed'), 600);
        }
      });
    }

    // Add note
    const addNoteBtn = document.getElementById('add-note-btn');
    if (addNoteBtn) {
      addNoteBtn.addEventListener('click', () => {
        const textarea = document.getElementById('note-input');
        const text     = textarea?.value.trim();

        if (!text) {
          YAS.showToast('يرجى كتابة ملاحظة أولاً', 'warning');
          return;
        }

        YASStorage.addTicketNote(this.ticket.id, text);
        this.ticket = YASStorage.getTicketById(this.ticket.id);
        this.renderNotes();
        this.renderActivities();

        if (textarea) textarea.value = '';
        YAS.showToast('تم حفظ الملاحظة بنجاح', 'success');
      });
    }

    // Close ticket
    const closeBtn = document.getElementById('close-ticket-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const ticketId = this.ticket.ticket_number || this.ticket.id;
        YAS.showConfirm({
          title:       'إغلاق الطلب',
          message:     `هل تريد إغلاق الطلب ${ticketId}؟`,
          confirmText: 'نعم، إغلاق',
          type:        'warning',
          onConfirm: () => {
            YASStorage.updateTicketStatus(this.ticket.id, 'closed', 'تم إغلاق الطلب');
            this.ticket = YASStorage.getTicketById(this.ticket.id);
            this.setHTML('detail-status', YAS.statusBadge(this.ticket.status));
            this.renderActivities();
            YAS.showToast('تم إغلاق الطلب', 'success');
          }
        });
      });
    }
  },

  refreshActivities() {
    this.ticket = YASStorage.getTicketById(this.ticket.id);
    this.renderActivities();
  },

  setEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '—';
  },

  setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  },

  showNotFound() {
    const container = document.getElementById('ticket-detail-container');
    if (container) {
      container.innerHTML = `
        <div class="empty-state" style="padding:80px">
          ${YAS.Icons.alert}
          <h3>الطلب غير موجود</h3>
          <p>لم يتم العثور على الطلب المطلوب</p>
          <a href="tickets.html" class="btn btn-primary" style="margin-top:16px">العودة إلى الطلبات</a>
        </div>`;
    }
  }
};

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  TicketManager.init();
  TicketDetails.init();

  // Status modal confirm button
  const confirmBtn = document.getElementById('confirm-status-btn');
  if (confirmBtn) confirmBtn.addEventListener('click', confirmStatusUpdate);
});
