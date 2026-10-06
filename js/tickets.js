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
      const name     = document.getElementById('cust-name');
      const phone    = document.getElementById('cust-phone');
      const whatsapp = document.getElementById('cust-whatsapp');
      const email    = document.getElementById('cust-email');

      // Name validation
      if (!name?.value.trim()) {
        this.markError(name, 'cust-name-error', 'الاسم مطلوب');
        valid = false;
      } else if (name.value.trim().length < 3) {
        this.markError(name, 'cust-name-error', 'الاسم يجب أن يكون 3 أحرف على الأقل');
        valid = false;
      } else if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(name.value.trim())) {
        this.markError(name, 'cust-name-error', 'الاسم يجب أن يحتوي على أحرف فقط');
        valid = false;
      }

      // Phone validation
      if (!phone?.value.trim()) {
        this.markError(phone, 'cust-phone-error', 'رقم الجوال مطلوب');
        valid = false;
      } else if (!/^[0-9+\s()-]{10,15}$/.test(phone.value.trim())) {
        this.markError(phone, 'cust-phone-error', 'رقم الجوال غير صحيح (10-15 رقم)');
        valid = false;
      }

      // WhatsApp validation (optional but if provided must be valid)
      if (whatsapp?.value.trim()) {
        if (!/^[0-9+\s()-]{10,15}$/.test(whatsapp.value.trim())) {
          this.markError(whatsapp, 'cust-whatsapp-error', 'رقم الواتساب غير صحيح (10-15 رقم)');
          valid = false;
        }
      }

      // Email validation (optional but if provided must be valid)
      if (email?.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
          this.markError(email, 'cust-email-error', 'البريد الإلكتروني غير صحيح');
          valid = false;
        }
      }
    }

    if (step === 2) {
      const deviceType = document.getElementById('device-type-hidden');
      const brand      = document.getElementById('device-brand');
      const model      = document.getElementById('device-model');
      const serial     = document.getElementById('device-serial');
      const purchase   = document.getElementById('device-purchase');

      // Device type validation
      if (!deviceType?.value) {
        YAS.showToast('يرجى اختيار نوع الجهاز', 'warning');
        valid = false;
      }

      // Brand validation
      if (!brand?.value.trim()) {
        this.markError(brand, 'device-brand-error', 'الماركة مطلوبة');
        valid = false;
      } else if (brand.value.trim().length < 2) {
        this.markError(brand, 'device-brand-error', 'الماركة يجب أن تكون حرفين على الأقل');
        valid = false;
      }

      // Model validation
      if (!model?.value.trim()) {
        this.markError(model, 'device-model-error', 'موديل الجهاز مطلوب');
        valid = false;
      } else if (model.value.trim().length < 2) {
        this.markError(model, 'device-model-error', 'الموديل يجب أن يكون حرفين على الأقل');
        valid = false;
      }

      // Serial number validation (optional but if provided must be valid)
      if (serial?.value.trim()) {
        if (serial.value.trim().length < 3) {
          this.markError(serial, 'device-serial-error', 'الرقم التسلسلي يجب أن يكون 3 أحرف على الأقل');
          valid = false;
        }
      }

      // Purchase date validation (optional but if provided must be valid)
      if (purchase?.value) {
        const purchaseDate = new Date(purchase.value);
        const today = new Date();
        if (purchaseDate > today) {
          this.markError(purchase, 'device-purchase-error', 'تاريخ الشراء لا يمكن أن يكون في المستقبل');
          valid = false;
        }
      }
    }

    if (step === 3) {
      const type     = document.getElementById('request-type');
      const priority = document.getElementById('priority-hidden');
      const desc     = document.getElementById('problem-desc');

      // Request type validation
      if (!type?.value) {
        this.markError(type, 'request-type-error', 'نوع الطلب مطلوب');
        valid = false;
      }

      // Priority validation
      if (!priority?.value) {
        YAS.showToast('يرجى اختيار الأولوية', 'warning');
        valid = false;
      }

      // Description validation
      if (!desc?.value.trim()) {
        this.markError(desc, 'desc-error', 'وصف المشكلة مطلوب');
        valid = false;
      } else if (desc.value.trim().length < 20) {
        this.markError(desc, 'desc-error', 'يرجى وصف المشكلة بشكل كافٍ (20 حرف على الأقل)');
        valid = false;
      } else if (desc.value.trim().length > 2000) {
        this.markError(desc, 'desc-error', 'الوصف طويل جداً (أقصى 2000 حرف)');
        valid = false;
      }
    }

    if (!valid) {
      YAS.showToast('من فضلك أكمل البيانات المطلوبة بشكل صحيح', 'warning');
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
        serial_number: document.getElementById('device-serial')?.value.trim() || '',
        purchase_date: document.getElementById('purchase-date')?.value || '',
        warranty_status: document.getElementById('warranty-status')?.value || 'unknown'
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

    // Device - Use i18n translation functions if available
    const deviceTypeLabel = typeof translateDeviceType !== 'undefined' ? translateDeviceType(d.device.type) : (YAS.DeviceTypeLabels[d.device.type] || d.device.type);
    set('review-device-type',   deviceTypeLabel);
    set('review-device-brand',  d.device.brand);
    set('review-device-model',  d.device.model);
    set('review-device-serial', d.device.serial_number);
    set('review-purchase-date', d.device.purchase_date ? YAS.formatDate(d.device.purchase_date) : '—');
    setHTML('review-warranty', YAS.warrantyBadge(d.device.warranty_status || d.device.warranty));

    // Request - Use i18n translation functions if available
    const requestTypeLabel = typeof translateIssueType !== 'undefined' ? translateIssueType(d.request.type) : (YAS.RequestTypeLabels[d.request.type] || d.request.type);
    set('review-req-type',  requestTypeLabel);
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

    setTimeout(async () => {
      try {
        console.log('[TicketForm] Creating ticket with data:', this.data);
        const ticket = await YASStorage.createTicket(this.data);
        console.log('[TicketForm] Ticket created:', ticket);

        if (ticket) {
          // Save ticket ID for success page (use ticket_number if available)
          const ticketId = ticket.ticket_number || ticket.id;
          console.log('[TicketForm] Saving ticket ID:', ticketId);
          sessionStorage.setItem('yas_new_ticket_id', ticketId);
          sessionStorage.setItem('yas_new_ticket_name', this.data.customer.name);

          // Show success section with ticket code
          const formSection = document.getElementById('form-section');
          const successSection = document.getElementById('success-section');
          if (formSection) formSection.style.display = 'none';
          if (successSection) successSection.style.display = 'block';

          // Update success page with ticket info
          const idEl = document.getElementById('success-ticket-id');
          const nameEl = document.getElementById('success-cust-name');
          if (idEl) idEl.textContent = ticketId;
          if (nameEl) nameEl.textContent = this.data.customer.name;

          // Show countdown message
          const countdownEl = document.getElementById('countdown-message');
          if (countdownEl) {
            countdownEl.style.display = 'block';
          }

          // Define redirect function globally
          window.redirectToWhatsApp = () => {
            const dashboardUrl = `https://yas-help-desk.vercel.app/tickets.html?search=${ticketId}`;
            const trackingUrl = `https://yas-help-desk.vercel.app/tracking.html`;
            const whatsappMessage = `
🆕 *تذكرة دعم جديدة*

*رقم التذكرة:* ${ticketId}
*العميل:* ${this.data.customer.name}
*الهاتف:* ${this.data.customer.phone}
*واتساب:* ${this.data.customer.whatsapp || this.data.customer.phone}
*الجهاز:* ${this.data.device.brand} ${this.data.device.model}
*نوع الطلب:* ${this.data.request.type}
*الأولوية:* ${this.data.request.priority}
*الوصف:* ${this.data.request.description}

💡 *لإخبار العميل بكود التتبع:*
"كود التتبع الخاص بك هو: ${ticketId}
استخدمه في صفحة التتبع: ${trackingUrl}"

🔗 *افتح التذكرة في الداشبورد:*
${dashboardUrl}

تاريخ الإنشاء: ${new Date().toLocaleString('ar-EG')}
            `.trim();

            const whatsappUrl = `https://wa.me/201101267185?text=${encodeURIComponent(whatsappMessage)}`;
            console.log('[TicketForm] Redirecting to WhatsApp:', whatsappUrl);
            window.location.href = whatsappUrl;
          };

          // Start countdown
          let seconds = 30;
          const countdownInterval = setInterval(() => {
            seconds--;
            const countdownSpan = document.getElementById('countdown');
            if (countdownSpan) {
              countdownSpan.textContent = seconds;
            }
            if (seconds <= 0) {
              clearInterval(countdownInterval);
              // Redirect to WhatsApp
              window.redirectToWhatsApp();
            }
          }, 1000);

          // Store countdown interval globally so it can be cancelled if user copies code
          window.ticketCountdownInterval = countdownInterval;
        } else {
          YAS.showToast('حدث خطأ أثناء إنشاء الطلب. حاول مرة أخرى.', 'error');
          if (btn) { btn.textContent = 'إرسال طلب الدعم'; btn.disabled = false; }
        }
      } catch (error) {
        console.error('[TicketForm] Error creating ticket:', error);
        YAS.showToast('حدث خطأ أثناء إنشاء الطلب: ' + (error.message || 'يرجى المحاولة مرة أخرى'), 'error');
        if (btn) { btn.textContent = 'إرسال طلب الدعم'; btn.disabled = false; }
      }
    }, 800);
  }
};

/* ── Success Page ──────────────────────────────────────────── */
function initSuccessPage() {
  const ticketId = sessionStorage.getItem('yas_new_ticket_id');
  const custName  = sessionStorage.getItem('yas_new_ticket_name');

  console.log('[Success Page] Ticket ID from session:', ticketId);
  console.log('[Success Page] Customer name from session:', custName);

  if (!ticketId) {
    // If arrived here without creating a ticket, show a generic message
    console.log('[Success Page] No ticket ID found in session');
    return;
  }

  const idEl   = document.getElementById('success-ticket-id');
  const nameEl = document.getElementById('success-cust-name');
  const trackBtn = document.getElementById('track-ticket-btn');

  if (idEl) {
    idEl.textContent  = ticketId;
    console.log('[Success Page] Set ticket ID to element:', ticketId);
  }
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

  async searchTicket(id, resultDiv) {
    // Normalize ID
    let normalized = id.trim().toUpperCase();
    if (!normalized.startsWith('YAS-SUP-') && /^\d+$/.test(normalized)) {
      normalized = 'YAS-SUP-' + normalized;
    }

    console.log('[TicketTracking] Searching for ticket:', normalized);

    try {
      // Use API directly for public tracking
      const response = await YAS_API.trackTicket(normalized);
      console.log('[TicketTracking] API response:', response);

      if (!response.success || !response.data) {
        YAS.showToast('رقم الطلب غير موجود. تحقق من الرقم وحاول مرة أخرى.', 'error');
        if (resultDiv) resultDiv.classList.remove('show');
        return;
      }

      this.renderTicket(response.data, resultDiv);
    } catch (error) {
      console.error('[TicketTracking] Error searching ticket:', error);
      YAS.showToast('حدث خطأ أثناء البحث عن الطلب. حاول مرة أخرى.', 'error');
      if (resultDiv) resultDiv.classList.remove('show');
    }
  },

  renderTicket(ticket, container) {
    if (!container) return;

    console.log('[TicketTracking] Rendering ticket:', ticket);
    console.log('[TicketTracking] Ticket fields:', {
      ticket_number: ticket.ticket_number,
      id: ticket.id,
      request_type: ticket.request_type,
      priority: ticket.priority,
      status: ticket.status,
      customer: ticket.customer,
      device: ticket.device,
      assigned_user: ticket.assigned_user,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at
    });

    // Use API response field names
    const requestType = ticket.request_type || 'Unknown';
    const requestPriority = ticket.priority || 'medium';
    const ticketNumber = ticket.ticket_number || ticket.id || 'Unknown';
    const customerName = ticket.customer?.name || 'Unknown';
    const deviceBrand = ticket.device?.brand || '';
    const deviceModel = ticket.device?.model || 'Unknown';
    const assignedName = ticket.assigned_user?.name || 'Eng. Adam Farouk';
    const createdAt = ticket.created_at || ticket.createdAt;
    const updatedAt = ticket.updated_at || ticket.updatedAt;

    console.log('[TicketTracking] Extracted values:', {
      requestType,
      requestPriority,
      ticketNumber,
      customerName,
      deviceBrand,
      deviceModel,
      assignedName,
      createdAt,
      updatedAt
    });

    // Header
    const headerEl = container.querySelector('.ticket-result-header');
    if (headerEl) {
      headerEl.innerHTML = `
        <div>
          <div class="ticket-result-id">${ticketNumber}</div>
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
          <span>${customerName}</span>
        </div>
        <div class="ticket-info-item">
          <label>الجهاز</label>
          <span>${deviceBrand} ${deviceModel}</span>
        </div>
        <div class="ticket-info-item">
          <label>نوع الطلب</label>
          <span>${YAS.RequestTypeLabels[requestType] || requestType}</span>
        </div>
        <div class="ticket-info-item">
          <label>الفني المسؤول</label>
          <span>${assignedName}</span>
        </div>
        <div class="ticket-info-item">
          <label>تاريخ الإنشاء</label>
          <span>${YAS.formatDateTime(createdAt)}</span>
        </div>
        <div class="ticket-info-item">
          <label>آخر تحديث</label>
          <span>${YAS.timeAgo(updatedAt)}</span>
        </div>
      `;
    }

    // Timeline
    const timelineEl = container.querySelector('.timeline');
    if (timelineEl) {
      timelineEl.innerHTML = this.buildTimeline(ticket.status, ticket.activities || []);
    }

    // Update Notes Section
    const notesContainer = document.getElementById('update-notes-container');
    if (notesContainer) {
      const notes = ticket.notes || [];
      console.log('[TicketTracking] Ticket notes:', notes);
      console.log('[TicketTracking] Notes count:', notes.length);

      if (notes.length === 0) {
        notesContainer.innerHTML = `
          <div style="padding:var(--space-4);background:var(--surface-secondary);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-muted);font-size:0.875rem;text-align:center">
            لا توجد تحديثات بعد
          </div>
        `;
      } else {
        notesContainer.innerHTML = notes.map(note => {
          console.log('[TicketTracking] Rendering note:', note);
          return `
          <div style="padding:var(--space-4);background:var(--surface-secondary);border:1px solid var(--border);border-radius:var(--radius-md)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-2)">
              <span style="font-weight:600;font-size:0.875rem">${note.author || 'الفني'}</span>
              <span style="font-size:0.75rem;color:var(--text-muted)">${YAS.formatDateTime(note.timestamp || note.time)}</span>
            </div>
            <div style="font-size:0.875rem;color:var(--text);line-height:1.5">${note.text || note.note || ''}</div>
          </div>
        `;
        }).join('');
      }
    }

    // Show rating section if ticket is resolved or closed
    const ratingSection = document.getElementById('rating-section');
    if (ratingSection) {
      if (ticket.status === 'resolved' || ticket.status === 'closed') {
        ratingSection.style.display = 'block';
        document.getElementById('rating-ticket-number').textContent = ticketNumber;

        // Initialize rating form only once
        if (!ratingSection.hasAttribute('data-initialized')) {
          this.initRatingForm(ticket.id, ticketNumber, customerName);
          ratingSection.setAttribute('data-initialized', 'true');
        }
      } else {
        ratingSection.style.display = 'none';
      }
    }

    container.classList.add('show');
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  initRatingForm(ticketId, ticketNumber, customerName) {
    // Check if rating already exists
    fetch(`/api/ratings?ticket_number=${ticketNumber}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          // Rating already exists, show it instead of form
          const existingRating = data.data;
          const ratingSection = document.getElementById('rating-section');
          
          // Hide form elements
          document.getElementById('rating-stars').style.display = 'none';
          document.getElementById('rating-comment').style.display = 'none';
          document.getElementById('submit-rating').style.display = 'none';
          
          // Show existing rating
          const successDiv = document.getElementById('rating-success');
          successDiv.style.display = 'block';
          successDiv.innerHTML = `
            <div style="font-size:48px;margin-bottom:12px">⭐</div>
            <h4 style="color:var(--success);margin-bottom:8px">تم التقييم بالفعل</h4>
            <p style="font-size:0.875rem;color:var(--text-muted)">التقييم: ${existingRating.rating}/5 نجوم</p>
            ${existingRating.comment ? `<p style="font-size:0.875rem;color:var(--text-muted);margin-top:8px">"${existingRating.comment}"</p>` : ''}
          `;
        } else {
          // No rating exists, show the form
          this.setupRatingForm(ticketId, ticketNumber, customerName);
        }
      })
      .catch(error => {
        console.error('Error checking existing rating:', error);
        // Show form anyway if check fails
        this.setupRatingForm(ticketId, ticketNumber, customerName);
      });
  },

  setupRatingForm(ticketId, ticketNumber, customerName) {
    let selectedRating = 0;
    const stars = document.querySelectorAll('.rating-star');

    stars.forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.getAttribute('data-rating'));
        this.updateRatingStars(selectedRating);
      });

      star.addEventListener('mouseenter', () => {
        const rating = parseInt(star.getAttribute('data-rating'));
        this.highlightRatingStars(rating);
      });

      star.addEventListener('mouseleave', () => {
        this.updateRatingStars(selectedRating);
      });
    });

    // Submit rating
    const submitBtn = document.getElementById('submit-rating');
    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        if (selectedRating === 0) {
          alert('يرجى اختيار تقييم');
          return;
        }

        const comment = document.getElementById('rating-comment').value.trim();
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري الإرسال...';

        try {
          const response = await fetch('/api/ratings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ticket_id: ticketId,
              ticket_number: ticketNumber,
              customer_name: customerName,
              rating: selectedRating,
              comment: comment
            })
          });

          const data = await response.json();

          if (data.success) {
            document.getElementById('rating-success').style.display = 'block';
            submitBtn.style.display = 'none';
            document.getElementById('rating-stars').style.display = 'none';
            document.getElementById('rating-comment').style.display = 'none';
          } else {
            if (data.error === 'Rating already submitted for this ticket') {
              alert('لقد قمت بتقييم هذه التذكرة بالفعل');
              // Refresh to show existing rating
              location.reload();
            } else {
              alert('حدث خطأ أثناء إرسال التقييم. حاول مرة أخرى.');
              submitBtn.disabled = false;
              submitBtn.textContent = 'إرسال التقييم';
            }
          }
        } catch (error) {
          console.error('Error submitting rating:', error);
          alert('حدث خطأ أثناء إرسال التقييم. حاول مرة أخرى.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'إرسال التقييم';
        }
      });
    }
  },

  highlightRatingStars(rating) {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach(star => {
      const starRating = parseInt(star.getAttribute('data-rating'));
      star.classList.toggle('active', starRating <= rating);
    });
  },

  updateRatingStars(rating) {
    this.highlightRatingStars(rating);
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
      const isDone   = idx <= currentIdx || (activities && activities.some(a => a.type === step.key));
      const isActive = step.status === currentStatus || (idx === 0 && currentStatus === 'received');

      let dotClass = '';
      if (isActive) dotClass = 'active';
      else if (isDone) dotClass = 'done';

      const labelClass = isDone ? '' : 'muted';

      // Find activity time for this step
      const act = activities && activities.find(a =>
        a.type === step.key || (step.status && a.label && a.label.includes && a.label.includes(YAS.StatusLabels[step.status] || ''))
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
