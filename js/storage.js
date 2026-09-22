/* ============================================================
   YAS Help Desk — Storage Layer
   Hybrid approach: API when available, LocalStorage fallback
   ============================================================ */

'use strict';

const YAS_STORAGE_KEY  = 'yas_tickets';
const YAS_NOTIF_KEY    = 'yas_notifications';
const YAS_SETTINGS_KEY = 'yas_settings';
const YAS_SESSION_KEY  = 'yas_session';
const YAS_THEME_KEY    = 'yas_theme';
const YAS_COUNTER_KEY  = 'yas_ticket_counter';

// Flag to determine if we should use API or LocalStorage
// Enabled to use real API with Supabase
const USE_API = true;

/* ── Ticket Counter ────────────────────────────────────────── */
function getNextTicketNumber() {
  const current = parseInt(localStorage.getItem(YAS_COUNTER_KEY) || '10481', 10);
  const next = current + 1;
  localStorage.setItem(YAS_COUNTER_KEY, String(next));
  return next;
}

function generateTicketId() {
  const num = getNextTicketNumber();
  return `YAS-SUP-${num}`;
}

/* ── Tickets ───────────────────────────────────────────────── */
async function getAllTickets() {
  console.log('[Storage] getAllTickets called, USE_API:', USE_API, 'Token exists:', !!YAS_API?.token);

  if (USE_API) {
    try {
      // Try to use API if we have a valid token
      if (YAS_API && YAS_API.token) {
        console.log('[Storage] Fetching tickets from API...');
        const response = await YAS_API.getTickets({ limit: 1000 });
        console.log('[Storage] API response:', response);

        if (response.success) {
          // Clear old LocalStorage data to ensure consistency
          localStorage.removeItem(YAS_STORAGE_KEY);
          const tickets = Array.isArray(response.data) ? response.data : [];
          console.log('[Storage] Returning', tickets.length, 'tickets from API');
          return tickets;
        }
      } else {
        console.log('[Storage] No API token available, checking if authenticated...');
        // Check if user is authenticated via session
        const session = getSession();
        if (session && session.authenticated) {
          console.log('[Storage] User is authenticated but no API token, trying to fetch...');
          const response = await YAS_API.getTickets({ limit: 1000 });
          if (response.success) {
            localStorage.removeItem(YAS_STORAGE_KEY);
            const tickets = Array.isArray(response.data) ? response.data : [];
            console.log('[Storage] Returning', tickets.length, 'tickets from API');
            return tickets;
          }
        } else {
          console.log('[Storage] No API token and not authenticated, using LocalStorage');
        }
      }
    } catch (error) {
      console.error('[Storage] API error, falling back to LocalStorage:', error);
    }
  }

  // Fallback to LocalStorage
  try {
    const localTickets = JSON.parse(localStorage.getItem(YAS_STORAGE_KEY) || '[]');
    console.log('[Storage] Returning', localTickets.length, 'tickets from LocalStorage');
    return localTickets;
  } catch {
    console.log('[Storage] No LocalStorage data, returning empty array');
    return [];
  }
}

function saveAllTickets(tickets) {
  localStorage.setItem(YAS_STORAGE_KEY, JSON.stringify(tickets));
}

async function getTicketById(id) {
  if (USE_API) {
    try {
      // Try to use public tracking endpoint first (no auth required)
      // This endpoint now supports both ticket_number and UUID
      const response = await YAS_API.trackTicket(id);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Public API error, trying authenticated endpoint:', error);
      try {
        // Fallback to authenticated endpoint
        const response = await YAS_API.getTicket(id);
        if (response.success) {
          return response.data;
        }
      } catch (authError) {
        console.error('Auth API error, falling back to LocalStorage:', authError);
      }
    }
  }

  // Fallback to LocalStorage
  const tickets = await getAllTickets();
  return tickets.find(t => t.id === id || t.ticket_number === id) || null;
}

async function createTicket(ticketData) {
  console.log('[Storage] createTicket called with data:', ticketData);

  if (USE_API) {
    try {
      // Use public endpoint for customer submissions (no auth required)
      console.log('[Storage] Using API to create ticket');
      const response = await YAS_API.submitPublicTicket(ticketData);
      console.log('[Storage] API response:', response);

      if (response.success) {
        console.log('[Storage] Ticket created successfully via API:', response.data);
        return response.data;
      } else {
        console.error('[Storage] API returned success=false:', response);
      }
    } catch (error) {
      console.error('[Storage] API error, falling back to LocalStorage:', error);
    }
  }
  
  // Fallback to LocalStorage
  const tickets = await getAllTickets();
  const id = generateTicketId();
  const now = new Date().toISOString();

  const ticket = {
    id,
    ticket_number: id, // For backward compatibility
    customer: {
      name:     ticketData.customer.name     || '',
      phone:    ticketData.customer.phone    || '',
      whatsapp: ticketData.customer.whatsapp || ticketData.customer.phone || '',
      email:    ticketData.customer.email    || '',
      company:  ticketData.customer.company  || ''
    },
    device: {
      type:         ticketData.device.type         || '',
      brand:        ticketData.device.brand        || '',
      model:        ticketData.device.model        || '',
      serialNumber: ticketData.device.serial_number || '',
      purchaseDate: ticketData.device.purchaseDate || '',
      warranty:     ticketData.device.warranty     || 'unknown'
    },
    request: {
      type:        ticketData.request.type        || '',
      priority:    ticketData.request.priority    || 'medium',
      description: ticketData.request.description || '',
      files:       ticketData.request.files       || []
    },
    // For backward compatibility with API format
    request_type: ticketData.request.type || '',
    priority: ticketData.request.priority || 'medium',
    description: ticketData.request.description || '',
    status:     'received',
    assignedTo: 'Adam Farouk',
    assigned_user: { name: 'Adam Farouk' }, // For API compatibility
    created_at: now,
    updated_at: now,
    createdAt:  now,
    updatedAt:  now,
    notes:      [],
    activities: [
      {
        time:  now,
        label: 'تم إنشاء الطلب',
        desc:  `أنشأ العميل ${ticketData.customer.name} طلب دعم جديد`,
        type:  'create'
      },
      {
        time:  new Date(Date.now() + 60000).toISOString(),
        label: 'تم استلام الطلب',
        desc:  'تم استلام الطلب وإسناده إلى Eng. Adam Farouk',
        type:  'assign'
      }
    ]
  };

  tickets.unshift(ticket);
  saveAllTickets(tickets);

  // Add notification
  addNotification({
    type:    'new',
    title:   'طلب دعم جديد',
    message: `طلب دعم جديد من ${ticket.customer.name} — ${ticket.ticket_number || ticket.id}`,
    ticketId: ticket.ticket_number || ticket.id
  });

  return ticket;
}

async function updateTicket(id, updates) {
  if (USE_API) {
    try {
      const response = await YAS_API.updateTicket(id, updates);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('API error, falling back to LocalStorage:', error);
    }
  }

  // Fallback to LocalStorage
  const tickets = await getAllTickets();
  const idx = tickets.findIndex(t => t.id === id);
  if (idx === -1) return null;

  tickets[idx] = {
    ...tickets[idx],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveAllTickets(tickets);
  return tickets[idx];
}

async function updateTicketStatus(id, newStatus, note = '') {
  console.log('[Storage] updateTicketStatus called with id:', id, 'status:', newStatus);

  if (USE_API) {
    try {
      // For API, we need to fetch the current ticket first to get activities array
      const currentTicket = await getTicketById(id);
      console.log('[Storage] Current ticket found:', !!currentTicket);
      if (!currentTicket) return null;

      const statusLabels = {
        received:    'تم الاستلام',
        reviewing:   'قيد المراجعة',
        contacting:  'جاري التواصل',
        diagnosing:  'جاري الفحص',
        maintenance: 'قيد الصيانة',
        waiting:     'بانتظار العميل',
        resolved:    'تم الحل',
        closed:      'مغلق'
      };

      const activityLabel = statusLabels[newStatus] || newStatus || 'غير محدد';

      const activity = {
        time:  new Date().toISOString(),
        label: `تحديث الحالة: ${activityLabel}`,
        desc:  note || `تم تحديث حالة الطلب إلى "${activityLabel}"`,
        type:  'status'
      };

      console.log('[Storage] Calling API updateTicket with id:', id);
      // Update ticket with new status and activities as array to be merged
      const response = await YAS_API.updateTicket(id, {
        status: newStatus,
        activities: [activity]
      });

      if (response.success) {
        if (newStatus === 'resolved' || newStatus === 'closed') {
          addNotification({
            type:    'resolved',
            title:   'تم حل الطلب',
            message: `تم تحديث الطلب ${id} إلى "${activityLabel}"`,
            ticketId: id
          });
        }
        return response.data;
      }
    } catch (error) {
      console.error('API error, falling back to LocalStorage:', error);
    }
  }

  // Fallback to LocalStorage
  const ticket = await getTicketById(id);
  if (!ticket) return null;

  const statusLabels = {
    received:    'تم الاستلام',
    reviewing:   'قيد المراجعة',
    contacting:  'جاري التواصل',
    diagnosing:  'جاري الفحص',
    maintenance: 'قيد الصيانة',
    waiting:     'بانتظار العميل',
    resolved:    'تم الحل',
    closed:      'مغلق'
  };

  const activityLabel = statusLabels[newStatus] || newStatus || 'غير محدد';

  const activity = {
    time:  new Date().toISOString(),
    label: `تحديث الحالة: ${activityLabel}`,
    desc:  note || `تم تحديث حالة الطلب إلى "${activityLabel}"`,
    type:  'status'
  };

  const updated = await updateTicket(id, {
    status: newStatus,
    activities: [...ticket.activities, activity]
  });

  if (newStatus === 'resolved' || newStatus === 'closed') {
    addNotification({
      type:    'resolved',
      title:   'تم حل الطلب',
      message: `تم تحديث الطلب ${id} إلى "${activityLabel}"`,
      ticketId: id
    });
  }

  return updated;
}

async function addTicketNote(id, noteText) {
  if (USE_API) {
    try {
      // For API, we need to fetch the current ticket first to get notes array
      const currentTicket = await getTicketById(id);
      if (!currentTicket) return null;

      const newNote = {
        id: Date.now(),
        author: 'Eng. Adam Farouk',
        text: noteText,
        time: new Date().toISOString()
      };

      const updatedNotes = [...(currentTicket.notes || []), newNote];

      const activity = {
        time: new Date().toISOString(),
        label: 'تمت إضافة ملاحظة داخلية',
        desc: noteText.substring(0, 80) + (noteText.length > 80 ? '...' : ''),
        type: 'note'
      };

      const updatedActivities = [...(currentTicket.activities || []), activity];

      // Update ticket with new notes and activities as arrays to be merged
      const response = await YAS_API.updateTicket(id, {
        notes: [newNote],
        activities: [activity]
      });

      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('API error, falling back to LocalStorage:', error);
    }
  }

  // Fallback to LocalStorage
  const ticket = await getTicketById(id);
  if (!ticket) return null;

  const note = {
    id:     Date.now(),
    author: 'Eng. Adam Farouk',
    text:   noteText,
    time:   new Date().toISOString()
  };

  const activity = {
    time:  new Date().toISOString(),
    label: 'تمت إضافة ملاحظة داخلية',
    desc:  noteText.substring(0, 80) + (noteText.length > 80 ? '...' : ''),
    type:  'note'
  };

  return await updateTicket(id, {
    notes:      [...ticket.notes, note],
    activities: [...ticket.activities, activity]
  });
}

async function addTicketActivity(id, label, desc, type = 'action') {
  const ticket = await getTicketById(id);
  if (!ticket) return null;

  const activity = {
    time:  new Date().toISOString(),
    label,
    desc:  desc || '',
    type
  };

  return await updateTicket(id, {
    activities: [...ticket.activities, activity]
  });
}

async function deleteTicket(id) {
  const tickets = (await getAllTickets()).filter(t => t.id !== id);
  saveAllTickets(tickets);
}

/* ── Statistics ────────────────────────────────────────────── */
async function getStats() {
  console.log('[Storage] Getting stats...');

  const tickets = await getAllTickets();
  console.log('[Storage] Tickets for stats:', tickets.length);

  const today   = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

  // Handle both API format (created_at, priority) and LocalStorage format (createdAt, request.priority)
  const stats = {
    total:     tickets.length,
    newMonth:  tickets.filter(t => (t.createdAt || t.created_at) >= monthStart).length,
    new:       tickets.filter(t => t.status === 'received').length,
    reviewing: tickets.filter(t => t.status === 'reviewing').length,
    inProgress: tickets.filter(t =>
      ['reviewing','contacting','diagnosing','maintenance'].includes(t.status)
    ).length,
    resolved:  tickets.filter(t => ['resolved','closed'].includes(t.status)).length,
    urgent:    tickets.filter(t => (t.request?.priority || t.priority) === 'critical').length,
    waiting:   tickets.filter(t => t.status === 'waiting').length
  };

  console.log('[Storage] Stats calculated:', stats);

  return stats;
}

/* ── Customers (derived from tickets) ─────────────────────── */
async function getAllCustomers() {
  const tickets = await getAllTickets();
  const map = new Map();

  tickets.forEach(t => {
    const key = t.customer.phone || t.customer.email || t.customer.name;
    if (!map.has(key)) {
      map.set(key, {
        ...t.customer,
        id:         key,
        tickets:    [],
        firstTicket: t.createdAt,
        lastTicket:  t.createdAt
      });
    }
    const c = map.get(key);
    c.tickets.push(t.id);
    if (t.createdAt > c.lastTicket) c.lastTicket = t.createdAt;
  });

  return Array.from(map.values());
}

/* ── Notifications ─────────────────────────────────────────── */
async function getAllNotifications() {
  if (USE_API) {
    try {
      const response = await YAS_API.getNotifications();
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('API error, falling back to LocalStorage:', error);
    }
  }
  
  // Fallback to LocalStorage
  try {
    return JSON.parse(localStorage.getItem(YAS_NOTIF_KEY) || '[]');
  } catch {
    return [];
  }
}

function addNotification(data) {
  // Get notifications directly from LocalStorage (synchronous)
  try {
    const notifs = JSON.parse(localStorage.getItem(YAS_NOTIF_KEY) || '[]');
    const notif = {
      id:      Date.now(),
      ...data,
      read:    false,
      time:    new Date().toISOString()
    };
    notifs.unshift(notif);
    // Keep max 50
    if (notifs.length > 50) notifs.splice(50);
    localStorage.setItem(YAS_NOTIF_KEY, JSON.stringify(notifs));
    return notif;
  } catch (error) {
    console.error('[Storage] Error adding notification:', error);
    return null;
  }
}

async function markAllNotificationsRead() {
  if (USE_API) {
    try {
      await YAS_API.markAllNotificationsRead();
      return;
    } catch (error) {
      console.error('API error, falling back to LocalStorage:', error);
    }
  }
  
  // Fallback to LocalStorage
  const notifs = await getAllNotifications();
  const updated = notifs.map(n => ({ ...n, read: true }));
  localStorage.setItem(YAS_NOTIF_KEY, JSON.stringify(updated));
}

async function clearNotifications() {
  if (USE_API) {
    try {
      await YAS_API.clearNotifications();
      return;
    } catch (error) {
      console.error('API error, falling back to LocalStorage:', error);
    }
  }
  
  // Fallback to LocalStorage
  localStorage.setItem(YAS_NOTIF_KEY, JSON.stringify([]));
}

async function getUnreadCount() {
  const notifs = await getAllNotifications();
  return notifs.filter(n => !n.read).length;
}

/* ── Settings ──────────────────────────────────────────────── */
function getSettings() {
  const defaults = {
    whatsappNumber: '',
    companyName:    'YAS',
    engineerName:   'Eng. Adam Farouk',
    autoAssign:     true,
    emailNotif:     false,
    darkMode:       false,
    language:       'ar'
  };
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(YAS_SETTINGS_KEY) || '{}') };
  } catch {
    return defaults;
  }
}

function saveSettings(settings) {
  localStorage.setItem(YAS_SETTINGS_KEY, JSON.stringify(settings));
}

/* ── Session / Auth ────────────────────────────────────────── */
function getSession() {
  try {
    return JSON.parse(localStorage.getItem(YAS_SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

function setSession(user) {
  localStorage.setItem(YAS_SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(YAS_SESSION_KEY);
}

function isAuthenticated() {
  const session = getSession();
  return session && session.authenticated === true;
}

/* ── Theme ─────────────────────────────────────────────────── */
function getTheme() {
  return localStorage.getItem(YAS_THEME_KEY) || 'light';
}

function setTheme(theme) {
  localStorage.setItem(YAS_THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const current = getTheme();
  const next    = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

/* ── Demo Data ─────────────────────────────────────────────── */
async function seedDemoData() {
  // Disable demo data seeding when using real API
  if (USE_API) return;

  const tickets = await getAllTickets();
  if (tickets.length > 0) return; // already seeded

  localStorage.setItem(YAS_COUNTER_KEY, '10481');

  const demoTickets = [
    {
      id: 'YAS-SUP-10482',
      customer: { name: 'محمد أحمد', phone: '0501234567', whatsapp: '0501234567', email: 'mohammed@example.com', company: 'شركة الأمل' },
      device: { type: 'laptop', brand: 'Dell', model: 'Latitude 5420', serial_number: 'DL5420-0012', purchase_date: '2023-03-15', warranty_status: 'active' },
      request: { type: 'technical', priority: 'high', description: 'الجهاز يُعيد التشغيل بشكل عشوائي أثناء العمل. المشكلة بدأت بعد تحديث Windows الأخير. تمت محاولة إعادة التشغيل عدة مرات دون جدوى.' },
      status: 'reviewing', assignedTo: 'Adam Farouk',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 900000).toISOString(),
      notes: [{ id: 1, author: 'Eng. Adam Farouk', text: 'يبدو أن المشكلة مرتبطة بتحديث KB5034441. سيتم التراجع عن التحديث وإعادة الاختبار.', time: new Date(Date.now() - 1800000).toISOString() }],
      activities: [
        { time: new Date(Date.now() - 3600000 * 2).toISOString(), label: 'تم إنشاء الطلب', desc: 'أنشأ العميل محمد أحمد طلب دعم جديد', type: 'create' },
        { time: new Date(Date.now() - 3600000 * 2 + 300000).toISOString(), label: 'تم استلام الطلب', desc: 'تم استلام الطلب وإسناده إلى Eng. Adam Farouk', type: 'assign' },
        { time: new Date(Date.now() - 3600000).toISOString(), label: 'تحديث الحالة: قيد المراجعة', desc: 'يتم مراجعة تفاصيل المشكلة', type: 'status' }
      ]
    },
    {
      id: 'YAS-SUP-10483',
      customer: { name: 'سارة العمري', phone: '0559876543', whatsapp: '0559876543', email: 'sara@techcorp.sa', company: 'تيك كورب' },
      device: { type: 'pos', brand: 'Epson', model: 'TM-T88VI', serial_number: 'EP88VI-5521', purchase_date: '2022-11-01', warranty_status: 'active' },
      request: { type: 'maintenance', priority: 'critical', description: 'جهاز الكاشير لا يطبع الفواتير بشكل صحيح. الطابعة تصدر صوتاً ثم تتوقف. هذا يؤثر على سير العمل اليومي بشكل كامل.' },
      status: 'contacting', assignedTo: 'Adam Farouk',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
      notes: [],
      activities: [
        { time: new Date(Date.now() - 3600000 * 5).toISOString(), label: 'تم إنشاء الطلب', desc: 'أنشأت العميلة سارة العمري طلب دعم جديد', type: 'create' },
        { time: new Date(Date.now() - 3600000 * 5 + 300000).toISOString(), label: 'تم استلام الطلب', desc: 'تم استلام الطلب وإسناده إلى Eng. Adam Farouk', type: 'assign' },
        { time: new Date(Date.now() - 3600000 * 3).toISOString(), label: 'تحديث الحالة: جاري التواصل', desc: 'جاري التواصل مع العميل عبر WhatsApp', type: 'status' }
      ]
    },
    {
      id: 'YAS-SUP-10484',
      customer: { name: 'خالد الزهراني', phone: '0533210987', whatsapp: '0533210987', email: 'khalid.z@gmail.com', company: '' },
      device: { type: 'desktop', brand: 'HP', model: 'ProDesk 400 G7', serial_number: 'HP400-G7-9921', purchase_date: '2021-06-20', warranty_status: 'expired' },
      request: { type: 'warranty', priority: 'medium', description: 'الجهاز لا يشتغل تماماً. عند الضغط على زر التشغيل لا يحدث شيء. الضمان منتهي لكن أريد معرفة تكلفة الإصلاح.' },
      status: 'diagnosing', assignedTo: 'Adam Farouk',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      notes: [{ id: 2, author: 'Eng. Adam Farouk', text: 'على الأرجح مشكلة في وحدة الإمداد بالطاقة (PSU). يجب فحص المكونات الداخلية.', time: new Date(Date.now() - 3600000 * 3).toISOString() }],
      activities: [
        { time: new Date(Date.now() - 3600000 * 24).toISOString(), label: 'تم إنشاء الطلب', desc: 'أنشأ العميل خالد الزهراني طلب دعم جديد', type: 'create' },
        { time: new Date(Date.now() - 3600000 * 24 + 300000).toISOString(), label: 'تم استلام الطلب', desc: 'تم استلام الطلب وإسناده إلى Eng. Adam Farouk', type: 'assign' },
        { time: new Date(Date.now() - 3600000 * 20).toISOString(), label: 'تحديث الحالة: جاري التواصل', desc: '', type: 'status' },
        { time: new Date(Date.now() - 3600000 * 4).toISOString(), label: 'تحديث الحالة: جاري الفحص', desc: 'تم استلام الجهاز وبدأ الفحص الفعلي', type: 'status' }
      ]
    },
    {
      id: 'YAS-SUP-10485',
      customer: { name: 'نورة المنصور', phone: '0505551234', whatsapp: '0505551234', email: 'noura@company.com', company: 'مؤسسة النور' },
      device: { type: 'hikvision', brand: 'Hikvision', model: 'DS-2CD2143G2-I', serial_number: 'HIK-CAM-3312', purchase_date: '2023-08-10', warranty_status: 'active' },
      request: { type: 'installation', priority: 'medium', description: 'طلب تركيب 4 كاميرات مراقبة إضافية في المستودع. لدينا نظام Hikvision موجود ونريد التوسعة.' },
      status: 'received', assignedTo: 'Adam Farouk',
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      notes: [],
      activities: [
        { time: new Date(Date.now() - 3600000).toISOString(), label: 'تم إنشاء الطلب', desc: 'أنشأت العميلة نورة المنصور طلب دعم جديد', type: 'create' },
        { time: new Date(Date.now() - 3600000 + 120000).toISOString(), label: 'تم استلام الطلب', desc: 'تم استلام الطلب وإسناده إلى Eng. Adam Farouk', type: 'assign' }
      ]
    },
    {
      id: 'YAS-SUP-10486',
      customer: { name: 'عمر الشهري', phone: '0556667788', whatsapp: '0556667788', email: 'omar.s@outlook.com', company: 'مدرسة الرواد' },
      device: { type: 'projector', brand: 'Epson', model: 'EB-X51', serial_number: 'EP-X51-0087', purchase_date: '2022-01-15', warranty_status: 'expired' },
      request: { type: 'maintenance', priority: 'low', description: 'البروجكتر يعرض صورة باهتة وألوانها ليست صحيحة. يحتاج إلى فحص مصدر الضوء.' },
      status: 'maintenance', assignedTo: 'Adam Farouk',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      notes: [],
      activities: [
        { time: new Date(Date.now() - 3600000 * 48).toISOString(), label: 'تم إنشاء الطلب', desc: 'أنشأ العميل عمر الشهري طلب دعم جديد', type: 'create' },
        { time: new Date(Date.now() - 3600000 * 47).toISOString(), label: 'تم استلام الطلب', desc: '', type: 'assign' },
        { time: new Date(Date.now() - 3600000 * 30).toISOString(), label: 'تحديث الحالة: جاري الفحص', desc: '', type: 'status' },
        { time: new Date(Date.now() - 3600000 * 10).toISOString(), label: 'تحديث الحالة: قيد الصيانة', desc: 'تم اكتشاف مصدر الضوء تالف، طلب قطعة بديلة', type: 'status' }
      ]
    },
    {
      id: 'YAS-SUP-10487',
      customer: { name: 'فاطمة القحطاني', phone: '0512223344', whatsapp: '0512223344', email: 'fatima@gmail.com', company: '' },
      device: { type: 'laptop', brand: 'Lenovo', model: 'ThinkPad E15', serial_number: 'LN-E15-4421', purchase_date: '2023-12-01', warranty_status: 'active' },
      request: { type: 'technical', priority: 'high', description: 'شاشة اللاب توب تُظهر خطوطاً رأسية ملونة وتتشوه الصورة أحياناً. المشكلة متقطعة.' },
      status: 'resolved', assignedTo: 'Adam Farouk',
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      notes: [{ id: 3, author: 'Eng. Adam Farouk', text: 'تم استبدال كيبل الشاشة الداخلي، المشكلة حُلت بنجاح.', time: new Date(Date.now() - 3600000 * 26).toISOString() }],
      activities: [
        { time: new Date(Date.now() - 3600000 * 72).toISOString(), label: 'تم إنشاء الطلب', desc: '', type: 'create' },
        { time: new Date(Date.now() - 3600000 * 72 + 300000).toISOString(), label: 'تم استلام الطلب', desc: '', type: 'assign' },
        { time: new Date(Date.now() - 3600000 * 60).toISOString(), label: 'تحديث الحالة: جاري الفحص', desc: '', type: 'status' },
        { time: new Date(Date.now() - 3600000 * 30).toISOString(), label: 'تحديث الحالة: قيد الصيانة', desc: '', type: 'status' },
        { time: new Date(Date.now() - 3600000 * 24).toISOString(), label: 'تحديث الحالة: تم الحل', desc: 'تم استبدال كيبل الشاشة بنجاح', type: 'status' }
      ]
    },
    {
      id: 'YAS-SUP-10488',
      customer: { name: 'أحمد الدوسري', phone: '0534445566', whatsapp: '0534445566', email: 'ahmed.d@company.sa', company: 'مجموعة الدوسري' },
      device: { type: 'desktop', brand: 'Asus', model: 'ProArt PA300Q', serial_number: 'AS-PRO-7821', purchase_date: '2024-01-10', warranty_status: 'active' },
      request: { type: 'inquiry', priority: 'low', description: 'استفسار عن إمكانية ترقية الذاكرة العشوائية من 16GB إلى 32GB وما هي التكلفة المتوقعة.' },
      status: 'closed', assignedTo: 'Adam Farouk',
      createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      notes: [],
      activities: [
        { time: new Date(Date.now() - 3600000 * 96).toISOString(), label: 'تم إنشاء الطلب', desc: '', type: 'create' },
        { time: new Date(Date.now() - 3600000 * 72).toISOString(), label: 'تم التواصل مع العميل', desc: 'تم تقديم عرض سعر للترقية', type: 'contact' },
        { time: new Date(Date.now() - 3600000 * 48).toISOString(), label: 'تحديث الحالة: مغلق', desc: 'تم تقديم الاستشارة وإغلاق الطلب', type: 'status' }
      ]
    },
    {
      id: 'YAS-SUP-10489',
      customer: { name: 'ريم الحربي', phone: '0567778899', whatsapp: '0567778899', email: 'reem.h@edu.sa', company: 'كلية العلوم التطبيقية' },
      device: { type: 'monitor', brand: 'LG', model: '27UK850', serial_number: 'LG-27UK-1134', purchase_date: '2022-09-05', warranty_status: 'expired' },
      request: { type: 'complaint', priority: 'medium', description: 'الشاشة فيها بقع سوداء في الزاوية اليسرى. المشكلة ظهرت منذ أسبوع دون أي سبب واضح.' },
      status: 'waiting', assignedTo: 'Adam Farouk',
      createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      notes: [],
      activities: [
        { time: new Date(Date.now() - 3600000 * 36).toISOString(), label: 'تم إنشاء الطلب', desc: '', type: 'create' },
        { time: new Date(Date.now() - 3600000 * 30).toISOString(), label: 'تحديث الحالة: جاري الفحص', desc: '', type: 'status' },
        { time: new Date(Date.now() - 3600000 * 12).toISOString(), label: 'تحديث الحالة: بانتظار العميل', desc: 'بانتظار تأكيد العميلة لموعد الاستلام', type: 'status' }
      ]
    },
    {
      id: 'YAS-SUP-10490',
      customer: { name: 'تركي المطيري', phone: '0521112233', whatsapp: '0521112233', email: 'turki@startup.io', company: 'ستارت أب تك' },
      device: { type: 'accessories', brand: 'Logitech', model: 'MX Keys', serial_number: 'LG-MXK-6677', purchase_date: '2024-03-20', warranty_status: 'active' },
      request: { type: 'warranty', priority: 'medium', description: 'لوحة المفاتيح بعض مفاتيحها لا تستجيب. المنتج لا يزال في فترة الضمان.' },
      status: 'received', assignedTo: 'Adam Farouk',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
      notes: [],
      activities: [
        { time: new Date(Date.now() - 1800000).toISOString(), label: 'تم إنشاء الطلب', desc: '', type: 'create' },
        { time: new Date(Date.now() - 1500000).toISOString(), label: 'تم استلام الطلب', desc: '', type: 'assign' }
      ]
    },
    {
      id: 'YAS-SUP-10491',
      customer: { name: 'منى العسيري', phone: '0578889900', whatsapp: '0578889900', email: 'mona@mail.com', company: 'عيادة الشفاء' },
      device: { type: 'laptop', brand: 'HP', model: 'EliteBook 840 G8', serial_number: 'HP-EBK-840-2231', purchase_date: '2023-05-18', warranty_status: 'active' },
      request: { type: 'technical', priority: 'critical', description: 'اللاب توب لا يتصل بالشبكة اللاسلكية نهائياً. الواي فاي لا يظهر في القائمة. المشكلة تأثر على العمل الطبي الحيوي.' },
      status: 'contacting', assignedTo: 'Adam Farouk',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      notes: [],
      activities: [
        { time: new Date(Date.now() - 3600000 * 3).toISOString(), label: 'تم إنشاء الطلب', desc: '', type: 'create' },
        { time: new Date(Date.now() - 3600000 * 2.5).toISOString(), label: 'تم استلام الطلب', desc: '', type: 'assign' },
        { time: new Date(Date.now() - 3600000).toISOString(), label: 'تحديث الحالة: جاري التواصل', desc: 'تم الاتصال بالعميلة', type: 'status' }
      ]
    }
  ];

  localStorage.setItem(YAS_STORAGE_KEY, JSON.stringify(demoTickets));
  localStorage.setItem(YAS_COUNTER_KEY, '10491');

  // Demo notifications
  const demoNotifs = [
    { id: 1, type: 'new', title: 'طلب دعم جديد', message: 'طلب دعم جديد من تركي المطيري — YAS-SUP-10490', ticketId: 'YAS-SUP-10490', read: false, time: new Date(Date.now() - 1800000).toISOString() },
    { id: 2, type: 'urgent', title: 'طلب عاجل', message: 'الطلب YAS-SUP-10491 مُصنَّف كأولوية عاجلة من عيادة الشفاء', ticketId: 'YAS-SUP-10491', read: false, time: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, type: 'resolved', title: 'تم حل الطلب', message: 'تم إغلاق الطلب YAS-SUP-10488 بنجاح', ticketId: 'YAS-SUP-10488', read: true, time: new Date(Date.now() - 3600000 * 48).toISOString() }
  ];
  localStorage.setItem(YAS_NOTIF_KEY, JSON.stringify(demoNotifs));
}

/* ── Export (accessible globally) ─────────────────────────── */
window.YASStorage = {
  generateTicketId,
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketStatus,
  addTicketNote,
  addTicketActivity,
  deleteTicket,
  getStats,
  getAllCustomers,
  getAllNotifications,
  addNotification,
  markAllNotificationsRead,
  clearNotifications,
  getUnreadCount,
  getSettings,
  saveSettings,
  getSession,
  setSession,
  clearSession,
  isAuthenticated,
  getTheme,
  setTheme,
  toggleTheme,
  seedDemoData
};
