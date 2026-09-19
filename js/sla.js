/* ============================================================
   YAS Help Desk — SLA & Performance Tracking
   Service Level Agreement and performance metrics
   ============================================================ */

'use strict';

const YAS_SLA_KEY = 'yas_sla_settings';
const YAS_PERFORMANCE_KEY = 'yas_performance_data';

/* ── SLA Configuration ───────────────────────────────────────── */
const SLA_DEFAULTS = {
  // Response time in hours based on priority
  responseTime: {
    critical: 1,    // 1 hour
    high:     4,    // 4 hours
    medium:   8,    // 8 hours
    low:      24    // 24 hours
  },
  // Resolution time in hours based on priority
  resolutionTime: {
    critical: 8,    // 8 hours
    high:     24,   // 24 hours
    medium:   48,   // 48 hours
    low:      72    // 72 hours
  },
  // Business hours (for SLA calculation)
  businessHours: {
    start: 9,   // 9 AM
    end: 17,    // 5 PM
    weekends: false  // Count weekends
  }
};

function getSLASettings() {
  try {
    return { ...SLA_DEFAULTS, ...JSON.parse(localStorage.getItem(YAS_SLA_KEY) || '{}') };
  } catch {
    return SLA_DEFAULTS;
  }
}

function saveSLASettings(settings) {
  localStorage.setItem(YAS_SLA_KEY, JSON.stringify(settings));
}

/* ── SLA Calculation ─────────────────────────────────────────── */
function calculateSLA(ticket) {
  const sla = getSLASettings();
  const priority = ticket.request.priority || 'medium';
  
  const responseTarget = sla.responseTime[priority] * 60 * 60 * 1000; // Convert to ms
  const resolutionTarget = sla.resolutionTime[priority] * 60 * 60 * 1000;
  
  const createdAt = new Date(ticket.createdAt).getTime();
  const now = Date.now();
  
  // Response SLA
  const firstResponse = ticket.activities.find(a => a.type === 'contact' || a.type === 'assign');
  const responseTime = firstResponse ? new Date(firstResponse.time).getTime() - createdAt : null;
  const responseSLA = responseTime !== null ? responseTime <= responseTarget : null;
  
  // Resolution SLA
  const resolutionActivity = ticket.activities.find(a => a.type === 'status' && (a.label.includes('تم الحل') || a.label.includes('مغلق')));
  const resolutionTime = resolutionActivity ? new Date(resolutionActivity.time).getTime() - createdAt : null;
  const resolutionSLA = resolutionTime !== null ? resolutionTime <= resolutionTarget : null;
  
  // Current status for active tickets
  const elapsed = now - createdAt;
  const responseRemaining = responseTime === null ? responseTarget - elapsed : null;
  const resolutionRemaining = resolutionTime === null ? resolutionTarget - elapsed : null;
  
  return {
    priority,
    responseTarget,
    resolutionTarget,
    responseTime,
    resolutionTime,
    responseSLA,
    resolutionSLA,
    responseRemaining,
    resolutionRemaining,
    status: ticket.status,
    isOverdue: responseRemaining !== null && responseRemaining < 0 || resolutionRemaining !== null && resolutionRemaining < 0
  };
}

/* ── Performance Metrics ───────────────────────────────────── */
function calculatePerformanceMetrics() {
  const tickets = YASStorage.getAllTickets();
  const now = Date.now();
  
  let totalTickets = 0;
  let responseMet = 0;
  let resolutionMet = 0;
  let totalResponseTime = 0;
  let totalResolutionTime = 0;
  let responseCount = 0;
  let resolutionCount = 0;
  
  const metricsByPriority = {
    critical: { total: 0, responseMet: 0, resolutionMet: 0, avgResponse: 0, avgResolution: 0 },
    high: { total: 0, responseMet: 0, resolutionMet: 0, avgResponse: 0, avgResolution: 0 },
    medium: { total: 0, responseMet: 0, resolutionMet: 0, avgResponse: 0, avgResolution: 0 },
    low: { total: 0, responseMet: 0, resolutionMet: 0, avgResponse: 0, avgResolution: 0 }
  };
  
  tickets.forEach(ticket => {
    const sla = calculateSLA(ticket);
    const priority = sla.priority;
    
    totalTickets++;
    metricsByPriority[priority].total++;
    
    // Response metrics
    if (sla.responseTime !== null) {
      responseCount++;
      totalResponseTime += sla.responseTime;
      if (sla.responseSLA) {
        responseMet++;
        metricsByPriority[priority].responseMet++;
      }
      metricsByPriority[priority].avgResponse += sla.responseTime;
    }
    
    // Resolution metrics
    if (sla.resolutionTime !== null) {
      resolutionCount++;
      totalResolutionTime += sla.resolutionTime;
      if (sla.resolutionSLA) {
        resolutionMet++;
        metricsByPriority[priority].resolutionMet++;
      }
      metricsByPriority[priority].avgResolution += sla.resolutionTime;
    }
  });
  
  // Calculate averages
  Object.keys(metricsByPriority).forEach(priority => {
    const metrics = metricsByPriority[priority];
    if (metrics.total > 0) {
      metrics.avgResponse = metrics.avgResponse / metrics.total;
      metrics.avgResolution = metrics.avgResolution / metrics.total;
    }
  });
  
  return {
    overall: {
      totalTickets,
      responseCompliance: responseCount > 0 ? Math.round((responseMet / responseCount) * 100) : 0,
      resolutionCompliance: resolutionCount > 0 ? Math.round((resolutionMet / resolutionCount) * 100) : 0,
      avgResponseTime: responseCount > 0 ? Math.round(totalResponseTime / responseCount / 60000) : 0, // minutes
      avgResolutionTime: resolutionCount > 0 ? Math.round(totalResolutionTime / resolutionCount / 3600000) : 0 // hours
    },
    byPriority: metricsByPriority
  };
}

/* ── SLA Status Badge ───────────────────────────────────────── */
function getSLABadge(ticket) {
  const sla = calculateSLA(ticket);
  
  if (['resolved', 'closed'].includes(ticket.status)) {
    if (sla.resolutionSLA === true) {
      return `<span class="badge badge-resolved">تم الالتزام</span>`;
    } else if (sla.resolutionSLA === false) {
      return `<span class="badge badge-diagnosing">تجاوز المدة</span>`;
    }
    return `<span class="badge badge-closed">غير محدد</span>`;
  }
  
  if (sla.isOverdue) {
    return `<span class="badge badge-critical">تجاوز المدة</span>`;
  }
  
  if (sla.responseRemaining !== null && sla.responseRemaining < sla.responseTarget * 0.25) {
    return `<span class="badge badge-reviewing">قارب الانتهاء</span>`;
  }
  
  return `<span class="badge badge-received">ضمن المدة</span>`;
}

/* ── SLA Warnings ──────────────────────────────────────────── */
function getSLAWarnings() {
  const tickets = YASStorage.getAllTickets();
  const warnings = [];
  
  tickets.forEach(ticket => {
    const sla = calculateSLA(ticket);
    
    // Skip closed tickets
    if (['resolved', 'closed'].includes(ticket.status)) return;
    
    // Check for overdue
    if (sla.isOverdue) {
      warnings.push({
        type: 'overdue',
        ticketId: ticket.id,
        customer: ticket.customer.name,
        priority: sla.priority,
        overdueBy: Math.abs(Math.min(sla.responseRemaining, sla.resolutionRemaining)) / 3600000, // hours
        message: `طلب ${ticket.id} تجاوز المدة المحددة`
      });
    }
    
    // Check for approaching deadline (less than 25% remaining)
    if (sla.responseRemaining !== null && sla.responseRemaining < sla.responseTarget * 0.25 && sla.responseRemaining > 0) {
      warnings.push({
        type: 'approaching',
        ticketId: ticket.id,
        customer: ticket.customer.name,
        priority: sla.priority,
        remainingHours: sla.responseRemaining / 3600000,
        message: `طلب ${ticket.id} يقترب من نهاية مدة الاستجابة`
      });
    }
  });
  
  // Sort by severity
  warnings.sort((a, b) => {
    if (a.type === 'overdue' && b.type !== 'overdue') return -1;
    if (a.type !== 'overdue' && b.type === 'overdue') return 1;
    return a.overdueBy - b.overdueBy;
  });
  
  return warnings;
}

/* ── SLA Display in Dashboard ───────────────────────────────── */
function displaySLAMetrics() {
  const metrics = calculatePerformanceMetrics();
  
  // Overall metrics
  const responseComplianceEl = document.getElementById('sla-response-compliance');
  const resolutionComplianceEl = document.getElementById('sla-resolution-compliance');
  const avgResponseEl = document.getElementById('sla-avg-response');
  const avgResolutionEl = document.getElementById('sla-avg-resolution');
  
  if (responseComplianceEl) {
    responseComplianceEl.textContent = metrics.overall.responseCompliance + '%';
    responseComplianceEl.style.color = metrics.overall.responseCompliance >= 80 ? 'var(--success)' : 
                                          metrics.overall.responseCompliance >= 60 ? 'var(--warning)' : 'var(--danger)';
  }
  
  if (resolutionComplianceEl) {
    resolutionComplianceEl.textContent = metrics.overall.resolutionCompliance + '%';
    resolutionComplianceEl.style.color = metrics.overall.resolutionCompliance >= 80 ? 'var(--success)' : 
                                            metrics.overall.resolutionCompliance >= 60 ? 'var(--warning)' : 'var(--danger)';
  }
  
  if (avgResponseEl) {
    avgResponseEl.textContent = metrics.overall.avgResponseTime + ' دقيقة';
  }
  
  if (avgResolutionEl) {
    avgResolutionEl.textContent = metrics.overall.avgResolutionTime + ' ساعة';
  }
  
  // Warnings count
  const warnings = getSLAWarnings();
  const warningsEl = document.getElementById('sla-warnings-count');
  if (warningsEl) {
    warningsEl.textContent = warnings.length;
    warningsEl.style.display = warnings.length > 0 ? 'inline-flex' : 'none';
  }
}

/* ── SLA Configuration UI ───────────────────────────────────── */
function addSLASettingsUI() {
  const settingsPanel = document.getElementById('panel-sla');
  if (!settingsPanel) return;
  
  const sla = getSLASettings();
  
  settingsPanel.innerHTML = `
    <div class="settings-section-title">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      إعدادات SLA
    </div>
    
    <form id="sla-settings-form">
      <div style="margin-bottom: var(--space-5);">
        <h4 style="margin-bottom: var(--space-3);">أوقات الاستجابة (بالساعات)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>عاجلة</label>
            <input type="number" id="sla-response-critical" value="${sla.responseTime.critical}" min="1">
          </div>
          <div class="form-group">
            <label>عالية</label>
            <input type="number" id="sla-response-high" value="${sla.responseTime.high}" min="1">
          </div>
          <div class="form-group">
            <label>مهمة</label>
            <input type="number" id="sla-response-medium" value="${sla.responseTime.medium}" min="1">
          </div>
          <div class="form-group">
            <label>عادية</label>
            <input type="number" id="sla-response-low" value="${sla.responseTime.low}" min="1">
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: var(--space-5);">
        <h4 style="margin-bottom: var(--space-3);">أوقات الحل (بالساعات)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>عاجلة</label>
            <input type="number" id="sla-resolution-critical" value="${sla.resolutionTime.critical}" min="1">
          </div>
          <div class="form-group">
            <label>عالية</label>
            <input type="number" id="sla-resolution-high" value="${sla.resolutionTime.high}" min="1">
          </div>
          <div class="form-group">
            <label>مهمة</label>
            <input type="number" id="sla-resolution-medium" value="${sla.resolutionTime.medium}" min="1">
          </div>
          <div class="form-group">
            <label>عادية</label>
            <input type="number" id="sla-resolution-low" value="${sla.resolutionTime.low}" min="1">
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: var(--space-5);">
        <h4 style="margin-bottom: var(--space-3);">ساعات العمل</h4>
        <div class="form-row">
          <div class="form-group">
            <label>بداية اليوم</label>
            <input type="number" id="sla-business-start" value="${sla.businessHours.start}" min="0" max="23">
          </div>
          <div class="form-group">
            <label>نهاية اليوم</label>
            <input type="number" id="sla-business-end" value="${sla.businessHours.end}" min="0" max="23">
          </div>
          <div class="form-group">
            <label>حساب عطلة نهاية الأسبوع</label>
            <select id="sla-weekends">
              <option value="true" ${sla.businessHours.weekends ? 'selected' : ''}>نعم</option>
              <option value="false" ${!sla.businessHours.weekends ? 'selected' : ''}>لا</option>
            </select>
          </div>
        </div>
      </div>
      
      <div style="display: flex; justify-content: flex-end;">
        <button type="submit" class="btn btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          حفظ الإعدادات
        </button>
      </div>
    </form>
  `;
  
  // Add form handler
  document.getElementById('sla-settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newSettings = {
      responseTime: {
        critical: parseInt(document.getElementById('sla-response-critical').value),
        high: parseInt(document.getElementById('sla-response-high').value),
        medium: parseInt(document.getElementById('sla-response-medium').value),
        low: parseInt(document.getElementById('sla-response-low').value)
      },
      resolutionTime: {
        critical: parseInt(document.getElementById('sla-resolution-critical').value),
        high: parseInt(document.getElementById('sla-resolution-high').value),
        medium: parseInt(document.getElementById('sla-resolution-medium').value),
        low: parseInt(document.getElementById('sla-resolution-low').value)
      },
      businessHours: {
        start: parseInt(document.getElementById('sla-business-start').value),
        end: parseInt(document.getElementById('sla-business-end').value),
        weekends: document.getElementById('sla-weekends').value === 'true'
      }
    };
    
    saveSLASettings(newSettings);
    YAS.showToast('تم حفظ إعدادات SLA بنجاح', 'success');
  });
}

/* ── Add SLA Section to Dashboard ────────────────────────────── */
function addSLADashboardSection() {
  const dashboardContent = document.querySelector('.dashboard-main-grid');
  if (!dashboardContent) return;
  
  const slaSection = document.createElement('div');
  slaSection.className = 'sla-dashboard-section';
  slaSection.innerHTML = `
    <div class="card" style="margin-bottom: var(--space-5);">
      <div class="section-header">
        <div class="section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          مؤشرات الأداء (SLA)
        </div>
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <span class="badge badge-critical" id="sla-warnings-count" style="display: none">0</span>
          <button class="btn btn-ghost btn-sm" onclick="YASSLA.showSettings()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        </div>
      </div>
      
      <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); gap: var(--space-3);">
        <div style="text-align: center; padding: var(--space-3);">
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: var(--space-1);">الالتزام بالاستجابة</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);" id="sla-response-compliance">—%</div>
        </div>
        <div style="text-align: center; padding: var(--space-3);">
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: var(--space-1);">الالتزام بالحل</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--success);" id="sla-resolution-compliance">—%</div>
        </div>
        <div style="text-align: center; padding: var(--space-3);">
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: var(--space-1);">متوسط وقت الاستجابة</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--text);" id="sla-avg-response">—</div>
        </div>
        <div style="text-align: center; padding: var(--space-3);">
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: var(--space-1);">متوسط وقت الحل</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--text);" id="sla-avg-resolution">—</div>
        </div>
      </div>
    </div>
  `;
  
  // Insert after the recent tickets section
  const recentSection = dashboardContent.querySelector('.recent-section');
  if (recentSection) {
    recentSection.parentNode.insertBefore(slaSection, recentSection.nextSibling);
  }
}

/* ── Global Functions ─────────────────────────────────────────── */
window.YASSLA = {
  calculate: calculateSLA,
  getBadge: getSLABadge,
  getWarnings: getSLAWarnings,
  getMetrics: calculatePerformanceMetrics,
  displayMetrics: displaySLAMetrics,
  addSettingsUI: addSLASettingsUI,
  addDashboardSection: addSLADashboardSection,
  showSettings: () => {
    window.location.href = 'settings.html';
  }
};

/* ── Initialize SLA on Load ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Add SLA section to dashboard
  if (window.location.pathname.includes('dashboard.html')) {
    setTimeout(() => {
      addSLADashboardSection();
      displaySLAMetrics();
    }, 500);
  }
  
  // Add SLA settings to settings page
  if (window.location.pathname.includes('settings.html')) {
    setTimeout(() => {
      addSLASettingsUI();
    }, 500);
  }
});
