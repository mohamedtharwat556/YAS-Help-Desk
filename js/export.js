/* ============================================================
   YAS Help Desk — Export System
   CSV and PDF export functionality
   ============================================================ */

'use strict';

/* ── CSV Export ─────────────────────────────────────────────── */
function exportToCSV(data, filename = 'export.csv') {
  if (!data || data.length === 0) {
    YAS.showToast('لا توجد بيانات للتصدير', 'error');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV format
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle null/undefined
      if (value === null || value === undefined) return '';
      // Handle objects/arrays
      if (typeof value === 'object') return JSON.stringify(value);
      // Escape quotes and wrap in quotes
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  // Create BOM for UTF-8 Arabic support
  const BOM = '\uFEFF';
  const csvString = BOM + csvRows.join('\n');
  
  // Create download link
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  YAS.showToast('تم تصدير البيانات بنجاح', 'success');
}

/* ── Ticket Export ──────────────────────────────────────────── */
function exportTicketsToCSV(tickets) {
  if (!tickets) {
    tickets = YASStorage.getAllTickets();
  }
  
  const exportData = tickets.map(t => ({
    'رقم الطلب': t.id,
    'العميل': t.customer.name,
    'الجوال': t.customer.phone,
    'البريد': t.customer.email,
    'الشركة': t.customer.company,
    'نوع الجهاز': YAS.DeviceTypeLabels[t.device.type] || t.device.type,
    'الماركة': t.device.brand,
    'الموديل': t.device.model,
    'الرقم التسلسلي': t.device.serialNumber,
    'نوع الطلب': YAS.RequestTypeLabels[t.request.type] || t.request.type,
    'الأولوية': YAS.PriorityLabels[t.request.priority] || t.request.priority,
    'الحالة': YAS.StatusLabels[t.status] || t.status,
    'المسؤول': t.assignedTo,
    'تاريخ الإنشاء': t.createdAt,
    'آخر تحديث': t.updatedAt,
    'وصف المشكلة': t.request.description
  }));
  
  const filename = `YAS_Tickets_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(exportData, filename);
}

/* ── Customer Export ───────────────────────────────────────── */
function exportCustomersToCSV(customers) {
  if (!customers) {
    customers = YASStorage.getAllCustomers();
  }
  
  const exportData = customers.map(c => ({
    'الاسم': c.name,
    'الجوال': c.phone,
    'البريد': c.email,
    'الشركة': c.company,
    'عدد الطلبات': c.tickets.length,
    'أول طلب': c.firstTicket,
    'آخر طلب': c.lastTicket
  }));
  
  const filename = `YAS_Customers_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(exportData, filename);
}

/* ── Device Export ─────────────────────────────────────────── */
function exportDevicesToCSV(devices) {
  if (!devices) {
    const tickets = YASStorage.getAllTickets();
    devices = tickets.map(t => ({
      ...t.device,
      owner: t.customer.name,
      ownerPhone: t.customer.phone,
      ticketId: t.id,
      ticketStatus: t.status
    }));
  }
  
  const exportData = devices.map(d => ({
    'المالك': d.owner || '—',
    'الجوال': d.ownerPhone || '—',
    'نوع الجهاز': YAS.DeviceTypeLabels[d.type] || d.type,
    'الماركة': d.brand,
    'الموديل': d.model,
    'الرقم التسلسلي': d.serialNumber,
    'تاريخ الشراء': d.purchaseDate,
    'حالة الضمان': YAS.WarrantyLabels[d.warranty] || d.warranty,
    'رقم الطلب': d.ticketId || '—',
    'حالة الطلب': YAS.StatusLabels[d.ticketStatus] || d.ticketStatus
  }));
  
  const filename = `YAS_Devices_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(exportData, filename);
}

/* ── PDF Export (Simple HTML to PDF) ───────────────────────── */
function exportToPDF(elementId, filename = 'export.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    YAS.showToast('العنصر غير موجود', 'error');
    return;
  }
  
  // Create a simple print-friendly version
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    YAS.showToast('منع النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة', 'error');
    return;
  }
  
  // Get content
  const content = element.innerHTML;
  
  // Create print document
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>${filename}</title>
      <style>
        body {
          font-family: 'Cairo', 'Arial', sans-serif;
          direction: rtl;
          padding: 20px;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: right;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #1A56DB;
          padding-bottom: 20px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { padding: 0; }
        }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="header">
        <h1>YAS Help Desk</h1>
        <p>تقرير مُنشأ في ${new Date().toLocaleDateString('ar-SA')}</p>
      </div>
      ${content}
      <div class="footer">
        <p>إشراف Eng. Adam Farouk · جميع الحقوق محفوظة لـ YAS © 2026</p>
      </div>
    </body>
    </html>
  `);
  
  printWindow.document.close();
  
  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print();
    // Optionally close after print (commented out to allow user to save as PDF)
    // printWindow.close();
  }, 500);
  
  YAS.showToast('جاري فتح نافذة الطباعة. اختر "حفظ كـ PDF"', 'success');
}

/* ── Export Ticket Details to PDF ──────────────────────────── */
function exportTicketDetailsToPDF(ticketId) {
  const ticket = YASStorage.getTicketById(ticketId);
  if (!ticket) {
    YAS.showToast('الطلب غير موجود', 'error');
    return;
  }
  
  // Create detailed report
  const reportHTML = `
    <div style="max-width: 800px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div>
          <h2 style="margin: 0; color: #1A56DB;">تفاصيل طلب الدعم الفني</h2>
          <p style="margin: 5px 0 0; color: #666;">${ticket.id}</p>
        </div>
        <div style="text-align: left;">
          <p style="margin: 0; font-weight: bold;">تاريخ الإنشاء</p>
          <p style="margin: 0;">${new Date(ticket.createdAt).toLocaleDateString('ar-SA')}</p>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="background: #f5f5f5; font-weight: bold; width: 30%;">الحالة</td>
          <td>${YAS.StatusLabels[ticket.status] || ticket.status}</td>
        </tr>
        <tr>
          <td style="background: #f5f5f5; font-weight: bold;">الأولوية</td>
          <td>${YAS.PriorityLabels[ticket.request.priority] || ticket.request.priority}</td>
        </tr>
        <tr>
          <td style="background: #f5f5f5; font-weight: bold;">المسؤول</td>
          <td>${ticket.assignedTo}</td>
        </tr>
      </table>
      
      <h3 style="color: #1A56DB; border-bottom: 2px solid #1A56DB; padding-bottom: 10px;">معلومات العميل</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="background: #f5f5f5; font-weight: bold; width: 30%;">الاسم</td>
          <td>${ticket.customer.name}</td>
        </tr>
        <tr>
          <td style="background: #f5f5f5; font-weight: bold;">الجوال</td>
          <td>${ticket.customer.phone}</td>
        </tr>
        <tr>
          <td style="background: #f5f5f5; font-weight: bold;">البريد</td>
          <td>${ticket.customer.email || '—'}</td>
        </tr>
        <tr>
          <td style="background: #f5f5f5; font-weight: bold;">الشركة</td>
          <td>${ticket.customer.company || '—'}</td>
        </tr>
      </table>
      
      <h3 style="color: #1A56DB; border-bottom: 2px solid #1A56DB; padding-bottom: 10px;">معلومات الجهاز</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="background: #f5f5f5; font-weight: bold; width: 30%;">النوع</td>
          <td>${YAS.DeviceTypeLabels[ticket.device.type] || ticket.device.type}</td>
        </tr>
        <tr>
          <td style="background: #f5f5f5; font-weight: bold;">الماركة</td>
          <td>${ticket.device.brand}</td>
        </tr>
        <tr>
          <td style="background: #f5f5f5; font-weight: bold;">الموديل</td>
          <td>${ticket.device.model}</td>
        </tr>
        <tr>
          <td style="background: #f5f5f5; font-weight: bold;">الرقم التسلسلي</td>
          <td>${ticket.device.serialNumber || '—'}</td>
        </tr>
        <tr>
          <td style="background: #f5f5f5; font-weight: bold;">تاريخ الشراء</td>
          <td>${ticket.device.purchaseDate ? new Date(ticket.device.purchaseDate).toLocaleDateString('ar-SA') : '—'}</td>
        </tr>
        <tr>
          <td style="background: #f5f5f5; font-weight: bold;">الضمان</td>
          <td>${YAS.WarrantyLabels[ticket.device.warranty] || ticket.device.warranty}</td>
        </tr>
      </table>
      
      <h3 style="color: #1A56DB; border-bottom: 2px solid #1A56DB; padding-bottom: 10px;">تفاصيل الطلب</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="background: #f5f5f5; font-weight: bold; width: 30%;">نوع الطلب</td>
          <td>${YAS.RequestTypeLabels[ticket.request.type] || ticket.request.type}</td>
        </tr>
        <tr>
          <td style="background: #f5f5f5; font-weight: bold;">وصف المشكلة</td>
          <td>${ticket.request.description}</td>
        </tr>
      </table>
      
      <h3 style="color: #1A56DB; border-bottom: 2px solid #1A56DB; padding-bottom: 10px;">سجل النشاط</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <th style="background: #f5f5f5;">التوقيت</th>
          <th style="background: #f5f5f5;">النشاط</th>
          <th style="background: #f5f5f5;">التفاصيل</th>
        </tr>
        ${ticket.activities.map(a => `
          <tr>
            <td>${new Date(a.time).toLocaleString('ar-SA')}</td>
            <td>${a.label}</td>
            <td>${a.desc}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  `;
  
  // Create temporary element
  const tempDiv = document.createElement('div');
  tempDiv.id = 'temp-export-content';
  tempDiv.style.display = 'none';
  tempDiv.innerHTML = reportHTML;
  document.body.appendChild(tempDiv);
  
  // Export to PDF
  exportToPDF('temp-export-content', `Ticket_${ticket.id}.pdf`);
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(tempDiv);
  }, 1000);
}

/* ── Export Reports Data ───────────────────────────────────── */
function exportReportsData() {
  const tickets = YASStorage.getAllTickets();
  
  // Export comprehensive report
  const exportData = {
    summary: {
      totalTickets: tickets.length,
      resolved: tickets.filter(t => ['resolved', 'closed'].includes(t.status)).length,
      inProgress: tickets.filter(t => ['reviewing', 'contacting', 'diagnosing', 'maintenance'].includes(t.status)).length,
      new: tickets.filter(t => t.status === 'received').length,
      urgent: tickets.filter(t => t.request.priority === 'critical').length
    },
    byStatus: {},
    byType: {},
    byDevice: {},
    byPriority: {}
  };
  
  // Group by status
  tickets.forEach(t => {
    const status = YAS.StatusLabels[t.status] || t.status;
    exportData.byStatus[status] = (exportData.byStatus[status] || 0) + 1;
  });
  
  // Group by type
  tickets.forEach(t => {
    const type = YAS.RequestTypeLabels[t.request.type] || t.request.type;
    exportData.byType[type] = (exportData.byType[type] || 0) + 1;
  });
  
  // Group by device
  tickets.forEach(t => {
    const device = YAS.DeviceTypeLabels[t.device.type] || t.device.type;
    exportData.byDevice[device] = (exportData.byDevice[device] || 0) + 1;
  });
  
  // Group by priority
  tickets.forEach(t => {
    const priority = YAS.PriorityLabels[t.request.priority] || t.request.priority;
    exportData.byPriority[priority] = (exportData.byPriority[priority] || 0) + 1;
  });
  
  // Convert to flat format for CSV
  const flatData = [
    { category: 'ملخص', metric: 'إجمالي الطلبات', value: exportData.summary.totalTickets },
    { category: 'ملخص', metric: 'تم الحل', value: exportData.summary.resolved },
    { category: 'ملخص', metric: 'قيد التنفيذ', value: exportData.summary.inProgress },
    { category: 'ملخص', metric: 'جديدة', value: exportData.summary.new },
    { category: 'ملخص', metric: 'عاجلة', value: exportData.summary.urgent },
    ...Object.entries(exportData.byStatus).map(([key, value]) => ({ category: 'حسب الحالة', metric: key, value })),
    ...Object.entries(exportData.byType).map(([key, value]) => ({ category: 'حسب النوع', metric: key, value })),
    ...Object.entries(exportData.byDevice).map(([key, value]) => ({ category: 'حسب الجهاز', metric: key, value })),
    ...Object.entries(exportData.byPriority).map(([key, value]) => ({ category: 'حسب الأولوية', metric: key, value }))
  ];
  
  const filename = `YAS_Reports_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(flatData, filename);
}

/* ── Add Export Buttons to Pages ───────────────────────────── */
function addExportButtons() {
  // Add export button to tickets page
  const ticketsPage = document.querySelector('.page-header');
  if (ticketsPage && document.getElementById('tickets-table-body')) {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-outline';
    exportBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      تصدير CSV
    `;
    exportBtn.addEventListener('click', () => exportTicketsToCSV());
    ticketsPage.querySelector('div').appendChild(exportBtn);
  }
  
  // Add export button to customers page
  const customersPage = document.querySelector('.page-header');
  if (customersPage && document.getElementById('customers-table-body')) {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-outline';
    exportBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      تصدير CSV
    `;
    exportBtn.addEventListener('click', () => exportCustomersToCSV());
    customersPage.querySelector('div').appendChild(exportBtn);
  }
  
  // Add export button to devices page
  const devicesPage = document.querySelector('.page-header');
  if (devicesPage && document.getElementById('devices-table-body')) {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-outline';
    exportBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      تصدير CSV
    `;
    exportBtn.addEventListener('click', () => exportDevicesToCSV());
    devicesPage.querySelector('div').appendChild(exportBtn);
  }
  
  // Add export button to reports page
  const reportsPage = document.querySelector('.page-header');
  if (reportsPage && document.getElementById('rep-total')) {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-outline';
    exportBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      تصدير التقرير
    `;
    exportBtn.addEventListener('click', () => exportReportsData());
    reportsPage.querySelector('div').appendChild(exportBtn);
  }
  
  // Add PDF export button to ticket details
  const ticketDetailsActions = document.querySelector('.ticket-details-actions');
  if (ticketDetailsActions) {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('id');
    
    if (ticketId) {
      const pdfBtn = document.createElement('button');
      pdfBtn.className = 'btn btn-outline';
      pdfBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        تصدير PDF
      `;
      pdfBtn.addEventListener('click', () => exportTicketDetailsToPDF(ticketId));
      ticketDetailsActions.appendChild(pdfBtn);
    }
  }
}

/* ── Global Functions ─────────────────────────────────────────── */
window.YASExport = {
  toCSV: exportToCSV,
  ticketsToCSV: exportTicketsToCSV,
  customersToCSV: exportCustomersToCSV,
  devicesToCSV: exportDevicesToCSV,
  toPDF: exportToPDF,
  ticketToPDF: exportTicketDetailsToPDF,
  reportsData: exportReportsData,
  addButtons: addExportButtons
};

/* ── Auto-add export buttons on load ───────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(addExportButtons, 500);
});
