/* ============================================================
   YAS Help Desk — Ticket Creation & Tracking (Customer side)
   ============================================================ */

'use strict';

/* ── Multi-step Form ───────────────────────────────────────── */
const TicketForm = {
  currentStep: 1,
  totalSteps:  4,
  data: {
    customer: {},
    device:   {},
    request:  {}
  },

  init() {
    if (!document.getElementById('ticket-form')) return;

    // Prefill type from category selection
    const prefill = sessionStorage.getItem('yas_prefill_type');
    if (prefill) {
      const typeSelect = document.getElementById('request-type');
      if (typeSelect) typeSelect.value = prefill;
      sessionStorage.removeItem('yas_prefill_type');
    }

    this.bindStepButtons();
    this.bindDeviceSelection();
    this.bindPrioritySelection();
    this.bindFileUpload();
    this.updateStepUI();
  },

  bindStepButtons() {
    document.querySelectorAll('[data-next-step]').forEach(btn => {
      btn.addEventListener('click', () => this.nextStep());
    });

    document.querySelectorAll('[data-prev-step]').forEach(btn => {
      btn.addEventListener('click', () => this.prevStep());
    });

    const submitBtn = document.getElementById('submit-ticket');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitTicket());
    }
  },

  bindDeviceSelection() {
    document.querySelectorAll('.device-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.device-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        const hiddenInput = document.getElementById('device-type-hidden');
        if (hiddenInput) hiddenInput.value = option.getAttribute('data-value');
      });
    });
  },

  bindPrioritySelection() {
    // Default to medium
    const mediumOpt = document.querySelector('.priority-option[data-value="medium"]');
    document.querySelectorAll('.priority-option').forEach(o => o.classList.remove('selected'));
    if (mediumOpt) mediumOpt.classList.add('selected');
    const hiddenInput = document.getElementById('priority-hidden');
    if (hiddenInput) hiddenInput.value = 'medium';

    document.querySelectorAll('.priority-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.priority-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        const h = document.getElementById('priority-hidden');
        if (h) h.value = option.getAttribute('data-value');
      });
    });
  },

  bindFileUpload() {
    // Initialize the new file upload system
    if (typeof YASFileUpload !== 'undefined') {
      this.fileUploader = YASFileUpload.init(
        'file-upload-area',
        'file-input',
        'file-list',
        { maxFiles: 5, maxSize: 10 * 1024 * 1024 }
      );
    }
  },

  nextStep() {
    if (!this.validateStep(this.currentStep)) return;
    this.collectStepData(this.currentStep);

    if (this.currentStep === this.totalSteps - 1) {
      this.buildReview();
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateStepUI();
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepUI();
    }
  },

  updateStepUI() {
    // Show/hide steps
    document.querySelectorAll('.form-step').forEach((step, idx) => {
      step.classList.toggle('active', idx + 1 === this.currentStep);
      if (idx + 1 === this.currentStep) {
        step.classList.add('step-transition');
        setTimeout(() => step.classList.remove('step-transition'), 350);
      }
    });

    // Update step indicators
    document.querySelectorAll('.step-item').forEach((item, idx) => {
      item.classList.remove('active', 'completed');
      if (idx + 1 === this.currentStep) item.classList.add('active');
      if (idx + 1 < this.currentStep)  item.classList.add('completed');
    });

    // Completed steps show checkmark
    document.querySelectorAll('.step-item.completed .step-dot').forEach(dot => {
      if (!dot.querySelector('svg')) {
        dot.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
      }
    });

    // Progress bar
    const progress = document.getElementById('form-progress');
    if (progress) {
      const pct = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
      progress.style.width = pct + '%';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  validateStep(step) {
    let valid = true;
    const errorClass = 'error';

    const clearErrors = () => {
      document.querySelectorAll('.form-step.active input, .form-step.active textarea, .form-step.active select')
        .forEach(el => el.classList.remove(errorClass));
      document.querySelectorAll('.form-error.show').forEach(el => el.classList.remove('show'));
    };

    clearErrors();

    if (step === 1) {
      const name  = document.getElementById('cust-name');
      const phone = document.getElementById('cust-phone');

      if (!name?.value.trim()) {
        this.markError(name, 'cust-name-error', 'الاسم مطلوب');
        valid = false;
      }
      if (!phone?.value.trim()) {
        this.markError(phone, 'cust-phone-error', 'رقم الجوال مطلوب');
        valid = false;
      } else if (!/^[0-9+\s()-]{7,15}$/.test(phone.value.trim())) {
        this.markError(phone, 'cust-phone-error', 'رقم الجوال غير صحيح');
        valid = false;
      }
    }

    if (step === 2) {
      const deviceType = document.getElementById('device-type-hidden');
      const model      = document.getElementById('device-model');

      if (!deviceType?.value) {
        YAS.showToast('يرجى اختيار نوع الجهاز', 'warning');
        valid = false;
      }
      if (!model?.value.trim()) {
        this.markError(model, 'device-model-error', 'موديل الجهاز مطلوب');
        valid = false;
      }
    }

    if (step === 3) {
      const type     = document.getElementById('request-type');
      const priority = document.getElementById('priority-hidden');
      const desc     = document.getElementById('problem-desc');

      if (!type?.value) {
        this.markError(type, 'request-type-error', 'نوع الطلب مطلوب');
        valid = false;
      }
      if (!priority?.value) {
        YAS.showToast('يرجى اختيار الأولوية', 'warning');
        valid = false;
      }
      if (!desc?.value.trim() || desc.value.trim().length < 10) {
        this.markError(desc, 'desc-error', 'يرجى وصف المشكلة بشكل كافٍ (10 أحرف على الأقل)');
        valid = false;
      }
    }

    if (!valid) {
      YAS.showToast('من فضلك أكمل البيانات المطلوبة', 'warning');
    }

    return valid;
  },

  markError(input, errorId, message) {
    if (input) input.classList.add('error');
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
  },

  collectStepData(step) {
    if (step === 1) {
      this.data.customer = {
        name:     document.getElementById('cust-name')?.value.trim() || '',
        phone:    document.getElementById('cust-phone')?.value.trim() || '',
        whatsapp: document.getElementById('cust-whatsapp')?.value.trim() || '',
        email:    document.getElementById('cust-email')?.value.trim() || '',
        company:  document.getElementById('cust-company')?.value.trim() || ''
      };
    }

    if (step === 2) {
      this.data.device = {
        type:         document.getElementById('device-type-hidden')?.value || '',
        brand:        document.getElementById('device-brand')?.value.trim() || '',
        model:        document.getElementById('device-model')?.value.trim() || '',
        serialNumber: document.getElementById('device-serial')?.value.trim() || '',
        purchaseDate: document.getElementById('purchase-date')?.value || '',
        warranty:     document.getElementById('warranty-status')?.value || 'unknown'
      };
    }

    if (step === 3) {
      this.data.request = {
        type:        document.getElementById('request-type')?.value || '',
        priority:    document.getElementById('priority-hidden')?.value || 'medium',
        description: document.getElementById('problem-desc')?.value.trim() || ''
      };
    }
  },

  buildReview() {
    const d = this.data;

    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || '—';
    };

    const setHTML = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };

    // Customer
    set('review-name',     d.customer.name);
    set('review-phone',    d.customer.phone);
    set('review-whatsapp', d.customer.whatsapp || d.customer.phone);
    set('review-email',    d.customer.email);
    set('review-company',  d.customer.company);

    // Device
    set('review-device-type',   YAS.DeviceTypeLabels[d.device.type] || d.device.type);
    set('review-device-brand',  d.device.brand);
    set('review-device-model',  d.device.model);
    set('review-device-serial', d.device.serialNumber);
    set('review-purchase-date', d.device.purchaseDate ? YAS.formatDate(d.device.purchaseDate) : '—');
    setHTML('review-warranty', YAS.warrantyBadge(d.device.warranty));

    // Request
    set('review-req-type',  YAS.RequestTypeLabels[d.request.type] || d.request.type);
    setHTML('review-priority', YAS.priorityBadge(d.request.priority));
    set('review-desc', d.request.description);
  },

  submitTicket() {
    this.collectStepData(3);

    // Get uploaded files
    if (this.fileUploader) {
      const uploadedFiles = this.fileUploader.getFiles();
      this.data.request.files = uploadedFiles.map(f => f.id);
    }

    const btn = document.getElementById('submit-ticket');
    if (btn) {
      btn.innerHTML = `<span class="loading-dots"><span></span><span></span><span></span></span> جاري الإرسال...`;
      btn.disabled  = true;
    }

    setTimeout(() => {
      const ticket = YASStorage.createTicket(this.data);

      if (ticket) {
        // Save ticket ID for success page
        sessionStorage.setItem('yas_new_ticket_id', ticket.id);
        sessionStorage.setItem('yas_new_ticket_name', this.data.customer.name);
        window.location.href = 'support.html?success=1';
      } else {
        YAS.showToast('حدث خطأ أثناء إنشاء الطلب. حاول مرة أخرى.', 'error');
        if (btn) { btn.textContent = 'إرسال طلب الدعم'; btn.disabled = false; }
      }
    }, 800);
  }
};

/* ── Success Page ──────────────────────────────────────────── */
function initSuccessPage() {
  const ticketId = sessionStorage.getItem('yas_new_ticket_id');
  const custName  = sessionStorage.getItem('yas_new_ticket_name');

  if (!ticketId) {
    // If arrived here without creating a ticket, show a generic message
    return;
  }

  const idEl   = document.getElementById('success-ticket-id');
  const nameEl = document.getElementById('success-cust-name');
  const trackBtn = document.getElementById('track-ticket-btn');

  if (idEl)   idEl.textContent  = ticketId;
  if (nameEl) nameEl.textContent = custName || '';
  if (trackBtn) {
    trackBtn.addEventListener('click', () => {
      sessionStorage.setItem('yas_track_id', ticketId);
      window.location.href = 'tracking.html';
    });
  }

  // Copy ticket ID
  const copyBtn = document.getElementById('copy-ticket-id');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => YAS.copyToClipboard(ticketId));
  }

  // Clear session after showing
  sessionStorage.removeItem('yas_new_ticket_id');
  sessionStorage.removeItem('yas_new_ticket_name');
}

/* ── Tracking Page ─────────────────────────────────────────── */
const TicketTracking = {
  init() {
    if (!document.getElementById('tracking-form')) return;

    const form      = document.getElementById('tracking-form');
    const input     = document.getElementById('track-input');
    const resultDiv = document.getElementById('ticket-result');

    // Pre-fill from session if redirected from success page
    const prefillId = sessionStorage.getItem('yas_track_id');
    if (prefillId && input) {
      input.value = prefillId;
      sessionStorage.removeItem('yas_track_id');
      setTimeout(() => this.searchTicket(prefillId, resultDiv), 300);
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const id = input.value.trim().toUpperCase();
      if (!id) {
        YAS.showToast('يرجى إدخال رقم الطلب', 'warning');
        return;
      }
      this.searchTicket(id, resultDiv);
    });
  },

  searchTicket(id, resultDiv) {
    // Normalize ID
    let normalized = id;
    if (!normalized.startsWith('YAS-SUP-') && /^\d+$/.test(normalized)) {
      normalized = 'YAS-SUP-' + normalized;
    }

    const ticket = YASStorage.getTicketById(normalized);

    if (!ticket) {
      YAS.showToast('رقم الطلب غير موجود. تحقق من الرقم وحاول مرة أخرى.', 'error');
      if (resultDiv) resultDiv.classList.remove('show');
      return;
    }

    this.renderTicket(ticket, resultDiv);
  },

  renderTicket(ticket, container) {
    if (!container) return;

    // Add null safety for request object
    const requestType = ticket.request?.type || ticket.request_type || 'Unknown';
    const requestPriority = ticket.request?.priority || ticket.priority || 'medium';

    // Header
    const headerEl = container.querySelector('.ticket-result-header');
    if (headerEl) {
      headerEl.innerHTML = `
        <div>
          <div class="ticket-result-id">${ticket.id || ticket.ticket_number || 'Unknown'}</div>
          <div style="font-size:0.875rem;color:var(--text-muted);margin-top:4px;">
            ${YAS.RequestTypeLabels[requestType] || requestType}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
          ${YAS.statusBadge(ticket.status)}
          ${YAS.priorityBadge(requestPriority)}
        </div>
      `;
    }

    // Info grid
    const infoGrid = container.querySelector('.ticket-info-grid');
    if (infoGrid) {
      infoGrid.innerHTML = `
        <div class="ticket-info-item">
          <label>اسم العميل</label>
          <span>${ticket.customer.name}</span>
        </div>
        <div class="ticket-info-item">
          <label>الجهاز</label>
          <span>${ticket.device.brand} ${ticket.device.model}</span>
        </div>
        <div class="ticket-info-item">
          <label>نوع الطلب</label>
          <span>${YAS.RequestTypeLabels[ticket.request.type] || ticket.request.type}</span>
        </div>
        <div class="ticket-info-item">
          <label>الفني المسؤول</label>
          <span>${ticket.assignedTo}</span>
        </div>
        <div class="ticket-info-item">
          <label>تاريخ الإنشاء</label>
          <span>${YAS.formatDateTime(ticket.createdAt)}</span>
        </div>
        <div class="ticket-info-item">
          <label>آخر تحديث</label>
          <span>${YAS.timeAgo(ticket.updatedAt)}</span>
        </div>
      `;
    }

    // Timeline
    const timelineEl = container.querySelector('.timeline');
    if (timelineEl) {
      timelineEl.innerHTML = this.buildTimeline(ticket.status, ticket.activities);
    }

    container.classList.add('show');
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  buildTimeline(currentStatus, activities) {
    const steps = [
      { key: 'create',      label: 'تم إنشاء الطلب' },
      { key: 'assign',      label: 'تم استلام الطلب' },
      { key: 'reviewing',   label: 'قيد المراجعة',    status: 'reviewing' },
      { key: 'contacting',  label: 'جاري التواصل',    status: 'contacting' },
      { key: 'diagnosing',  label: 'جاري الفحص',      status: 'diagnosing' },
      { key: 'maintenance', label: 'قيد الصيانة',     status: 'maintenance' },
      { key: 'resolved',    label: 'تم الحل',         status: 'resolved' },
      { key: 'closed',      label: 'مغلق',            status: 'closed' }
    ];

    const statusOrder = ['received', 'reviewing', 'contacting', 'diagnosing', 'maintenance', 'waiting', 'resolved', 'closed'];
    const currentIdx  = statusOrder.indexOf(currentStatus);

    return steps.map((step, idx) => {
      const isDone   = idx <= currentIdx || activities.some(a => a.type === step.key);
      const isActive = step.status === currentStatus || (idx === 0 && currentStatus === 'received');

      let dotClass = '';
      if (isActive) dotClass = 'active';
      else if (isDone) dotClass = 'done';

      const labelClass = isDone ? '' : 'muted';

      // Find activity time for this step
      const act = activities.find(a =>
        a.type === step.key || (step.status && a.label.includes(YAS.StatusLabels[step.status] || ''))
      );

      return `
        <div class="timeline-item">
          <div class="timeline-dot ${dotClass}">
            ${dotClass === 'done' || dotClass === 'active'
              ? `<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
              : ''}
          </div>
          <div class="timeline-label ${labelClass}">${step.label}</div>
          ${act ? `<div class="timeline-time">${YAS.formatDateTime(act.time)}</div>` : ''}
        </div>
      `;
    }).join('');
  }
};

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get('success') === '1') {
    // Show success state
    const formSection    = document.getElementById('form-section');
    const successSection = document.getElementById('success-section');
    if (formSection)    formSection.style.display    = 'none';
    if (successSection) successSection.style.display = 'block';
    initSuccessPage();
  } else {
    TicketForm.init();
  }

  TicketTracking.init();
});
