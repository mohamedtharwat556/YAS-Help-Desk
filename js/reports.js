/* ============================================================
   YAS Help Desk — Reports JS
   Pure CSS/SVG/JS charts — no external libraries
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.getElementById('reports-page')) return;
  if (!YAS.requireAuth()) return;
  YAS.initDashboardSidebar();
  YAS.initGlobalSearch();
  YAS.initNotifPanel();

  const tickets = await YASStorage.getAllTickets();

  renderStatusChart(tickets);
  renderDeviceChart(tickets);
  renderTypeChart(tickets);
  renderMonthlyChart(tickets);
  renderSummaryStats(tickets);
});

/* ── Summary Stats ─────────────────────────────────────────── */
function renderSummaryStats(tickets) {
  const animate = (id, val) => {
    const el = document.getElementById(id);
    if (el) YAS.animateCount(el, val, 800);
  };

  animate('rep-total',    tickets.length);
  animate('rep-resolved', tickets.filter(t => ['resolved','closed'].includes(t.status)).length);
  animate('rep-open',     tickets.filter(t => !['resolved','closed'].includes(t.status)).length);
  animate('rep-urgent',   tickets.filter(t => t.priority === 'critical').length);
}

/* ── Tickets by Status (horizontal bar) ───────────────────── */
function renderStatusChart(tickets) {
  const container = document.getElementById('chart-status');
  if (!container) return;

  const items = [
    { label: 'تم الاستلام',     key: 'received',    color: '#7C3AED' },
    { label: 'قيد المراجعة',    key: 'reviewing',   color: '#B45309' },
    { label: 'جاري التواصل',    key: 'contacting',  color: '#1D4ED8' },
    { label: 'جاري الفحص',      key: 'diagnosing',  color: '#DC2626' },
    { label: 'قيد الصيانة',     key: 'maintenance', color: '#92400E' },
    { label: 'بانتظار العميل',  key: 'waiting',     color: '#374151' },
    { label: 'تم الحل',         key: 'resolved',    color: '#059669' },
    { label: 'مغلق',            key: 'closed',      color: '#64748B' }
  ];

  const max = Math.max(...items.map(i => tickets.filter(t => t.status === i.key).length), 1);

  container.innerHTML = `<div class="bar-chart">` +
    items.map(item => {
      const count = tickets.filter(t => t.status === item.key).length;
      const pct   = Math.round((count / max) * 100);
      return `
        <div class="bar-row">
          <div class="bar-label">${item.label}</div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${pct}%;background:${item.color};transition:width 0.9s cubic-bezier(.4,0,.2,1)">
              <span class="bar-value">${count}</span>
            </div>
          </div>
        </div>
      `;
    }).join('') + `</div>`;
}

/* ── Tickets by Device (donut) ─────────────────────────────── */
function renderDeviceChart(tickets) {
  const container = document.getElementById('chart-device');
  if (!container) return;

  const deviceTypes = [
    { label: 'لاب توب',          key: 'laptop',      color: '#1A56DB' },
    { label: 'كاشير / POS',      key: 'pos',         color: '#7C3AED' },
    { label: 'Hikvision',        key: 'hikvision',   color: '#0EA5E9' },
    { label: 'كمبيوتر مكتبي',   key: 'desktop',     color: '#10B981' },
    { label: 'بروجكتر',          key: 'projector',   color: '#F59E0B' },
    { label: 'شاشة',             key: 'monitor',     color: '#EF4444' },
    { label: 'ملحقات',           key: 'accessories', color: '#64748B' },
    { label: 'أخرى',             key: 'other',       color: '#94A3B8' }
  ];

  const data = deviceTypes.map(d => ({
    ...d,
    count: tickets.filter(t => t.device?.type === d.key).length
  })).filter(d => d.count > 0);

  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  // Build SVG donut
  const size   = 160;
  const cx     = size / 2;
  const cy     = size / 2;
  const r      = 60;
  const inner  = 38;

  let startAngle = -Math.PI / 2;
  const paths = data.map(d => {
    const angle    = (d.count / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const xi1 = cx + inner * Math.cos(startAngle);
    const yi1 = cy + inner * Math.sin(startAngle);
    const xi2 = cx + inner * Math.cos(endAngle);
    const yi2 = cy + inner * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;

    const path = `M ${xi1} ${yi1} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${inner} ${inner} 0 ${large} 0 ${xi1} ${yi1} Z`;
    startAngle = endAngle;
    return `<path d="${path}" fill="${d.color}" opacity="0.9"><title>${d.label}: ${d.count}</title></path>`;
  });

  const svg = `
    <svg class="donut-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      ${paths.join('')}
      <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="22" font-weight="800" fill="var(--text)" font-family="Inter,sans-serif">${total}</text>
      <text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="10" fill="var(--text-muted)" font-family="Cairo,sans-serif">طلب</text>
    </svg>
  `;

  const legend = `
    <div class="donut-legend">
      ${data.map(d => `
        <div class="legend-item">
          <div class="legend-dot" style="background:${d.color}"></div>
          <span class="legend-label">${d.label}</span>
          <span class="legend-val">${d.count}</span>
          <span style="font-size:0.75rem;color:var(--text-muted)">${Math.round(d.count / total * 100)}%</span>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = `<div class="donut-chart-wrap">${svg}${legend}</div>`;
}

/* ── Tickets by Request Type (bar) ────────────────────────── */
function renderTypeChart(tickets) {
  const container = document.getElementById('chart-type');
  if (!container) return;

  const types = [
    { label: 'دعم فني',  key: 'technical',    color: '#1A56DB' },
    { label: 'صيانة',    key: 'maintenance',  color: '#7C3AED' },
    { label: 'ضمان',     key: 'warranty',     color: '#0EA5E9' },
    { label: 'شكوى',     key: 'complaint',    color: '#EF4444' },
    { label: 'استفسار',  key: 'inquiry',      color: '#F59E0B' },
    { label: 'تركيب',    key: 'installation', color: '#10B981' },
    { label: 'متابعة',   key: 'followup',     color: '#64748B' },
    { label: 'أخرى',     key: 'other',        color: '#94A3B8' }
  ];

  const data = types.map(t => ({
    ...t,
    count: tickets.filter(tk => tk.request_type === t.key).length
  }));

  const max = Math.max(...data.map(d => d.count), 1);

  container.innerHTML = `<div class="bar-chart">` +
    data.map(item => `
      <div class="bar-row">
        <div class="bar-label">${item.label}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${Math.round(item.count / max * 100)}%;background:${item.color}">
            <span class="bar-value">${item.count}</span>
          </div>
        </div>
      </div>
    `).join('') + `</div>`;
}

/* ── Monthly Chart (12 months bar) ────────────────────────── */
function renderMonthlyChart(tickets) {
  const container = document.getElementById('chart-monthly');
  if (!container) return;

  const now     = new Date();
  const months  = [];
  const counts  = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString('ar-SA', { month: 'short' }));
    const count = tickets.filter(t => {
      const created = new Date(t.created_at || t.createdAt);
      return created.getFullYear() === d.getFullYear() &&
             created.getMonth()    === d.getMonth();
    }).length;
    counts.push(count);
  }

  const maxCount = Math.max(...counts, 1);

  container.innerHTML = `
    <div class="monthly-chart">
      ${months.map((m, i) => {
        const h = Math.round((counts[i] / maxCount) * 140);
        return `
          <div class="monthly-bar-wrap" data-tooltip="${m}: ${counts[i]} طلب">
            <div class="monthly-bar" style="height:${h}px;background:${counts[i] > 0 ? 'var(--primary)' : 'var(--border)'}"></div>
            <div class="monthly-label">${m}</div>
          </div>
        `;
      }).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;padding-top:var(--space-3)">
      <span style="font-size:0.75rem;color:var(--text-muted)">آخر 12 شهراً</span>
      <span style="font-size:0.75rem;color:var(--text-muted)">إجمالي: ${counts.reduce((a, b) => a + b, 0)} طلب</span>
    </div>
  `;
}
