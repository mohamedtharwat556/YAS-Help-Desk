/* ============================================================
   YAS Help Desk — App Core
   Shared utilities, icons, UI components
   ============================================================ */

'use strict';

/* ── WhatsApp Number (configure here) ─────────────────────── */
const YAS_WHATSAPP_NUMBER = '966500000000'; // Replace with real number

/* ── SVG Icons ─────────────────────────────────────────────── */
const Icons = {
  dashboard: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  tickets:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-4-4z"/><polyline points="15 5 15 9 19 9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>`,
  customers: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  devices:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  maintenance:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  warranty:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  reports:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  settings:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  search:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  bell:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  whatsapp:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  phone:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.29h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  email:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  laptop:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>`,
  desktop:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  pos:       `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/><path d="M7 13h2m0 0h2m-2 0v2m0-2v-2"/></svg>`,
  hikvision: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
  projector: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="8" width="22" height="8" rx="2"/><path d="M10 8V6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"/><circle cx="17" cy="12" r="1"/></svg>`,
  monitor:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  printer:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
  network:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="6"/><rect x="9" y="16" width="6" height="6"/><rect x="2" y="9" width="6" height="6"/><rect x="16" y="9" width="6" height="6"/><line x1="15" y1="5" x2="19" y2="12"/><line x1="9" y1="5" x2="5" y2="12"/><line x1="5" y1="15" x2="9" y2="19"/><line x1="19" y1="15" x2="15" y2="19"/></svg>`,
  accessories:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 11h4M8 9v4"/><circle cx="16" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>`,
  calendar:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  user:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  check:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  x:         `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  chevronDown:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  chevronRight:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  plus:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  edit:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  eye:       `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  trash:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  lock:      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  logout:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  sun:       `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  info:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  alert:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  filter:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  sort:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  note:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  activity:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  copy:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  menu:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  close:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  support:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>`,
  attachment:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
  priority:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h12M3 9h9M3 13h6"/><path d="M17 5l4 4-4 4V5z"/></svg>`,
  technician:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  other:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
};

/* ── Device Icon Map ───────────────────────────────────────── */
function getDeviceIcon(type) {
  const map = {
    laptop:    Icons.laptop,
    desktop:   Icons.desktop,
    pos:       Icons.pos,
    hikvision: Icons.hikvision,
    projector: Icons.projector,
    monitor:   Icons.monitor,
    printer:   Icons.printer,
    network:   Icons.network,
    accessories: Icons.accessories
  };
  return map[type] || Icons.other;
}

/* ── Label Maps ────────────────────────────────────────────── */
const StatusLabels = {
  received:    'تم الاستلام',
  reviewing:   'قيد المراجعة',
  contacting:  'جاري التواصل',
  diagnosing:  'جاري الفحص',
  maintenance: 'قيد الصيانة',
  waiting:     'بانتظار العميل',
  resolved:    'تم الحل',
  closed:      'مغلق'
};

const StatusBadgeClass = {
  received:    'badge-received',
  reviewing:   'badge-reviewing',
  contacting:  'badge-contacting',
  diagnosing:  'badge-diagnosing',
  maintenance: 'badge-maintenance',
  waiting:     'badge-waiting',
  resolved:    'badge-resolved',
  closed:      'badge-closed'
};

const PriorityLabels = {
  low:      'عادية',
  medium:   'مهمة',
  high:     'عالية',
  critical: 'عاجلة'
};

const PriorityBadgeClass = {
  low:      'badge-priority-low',
  medium:   'badge-priority-medium',
  high:     'badge-priority-high',
  critical: 'badge-priority-critical'
};

const RequestTypeLabels = {
  technical:   'دعم فني',
  maintenance: 'صيانة',
  warranty:    'ضمان',
  complaint:   'شكوى',
  inquiry:     'استفسار',
  installation:'تركيب',
  followup:    'متابعة',
  other:       'أخرى'
};

const DeviceTypeLabels = {
  laptop:      'لاب توب',
  desktop:     'كمبيوتر مكتبي',
  pos:         'كاشير / POS',
  hikvision:   'Hikvision',
  projector:   'بروجكتر',
  monitor:     'شاشة',
  printer:     'طابعة',
  network:     'جهاز شبكة',
  accessories: 'ملحقات',
  other:       'أخرى'
};

const WarrantyLabels = {
  active:   'ساري',
  expired:  'منتهي',
  expiring: 'يقترب من الانتهاء',
  unknown:  'غير محدد'
};

/* ── Status Badge HTML ─────────────────────────────────────── */
function statusBadge(status) {
  return `<span class="badge ${StatusBadgeClass[status] || 'badge-closed'}">${StatusLabels[status] || status}</span>`;
}

function priorityBadge(priority) {
  return `<span class="badge ${PriorityBadgeClass[priority] || 'badge-priority-low'}">${PriorityLabels[priority] || priority}</span>`;
}

function warrantyBadge(warranty) {
  const classes = { active: 'badge-resolved', expired: 'badge-diagnosing', expiring: 'badge-reviewing' };
  return `<span class="badge ${classes[warranty] || 'badge-closed'}">${WarrantyLabels[warranty] || warranty}</span>`;
}

/* ── Toast Notifications ───────────────────────────────────── */
function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const iconMap = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${'#10B981'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${'#EF4444'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${'#F59E0B'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${'#3B82F6'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${iconMap[type] || iconMap.info}</div>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

/* ── Confirm Dialog ────────────────────────────────────────── */
function showConfirm({ title, message, confirmText = 'تأكيد', cancelText = 'إلغاء', type = 'danger', onConfirm }) {
  let overlay = document.getElementById('confirm-overlay');
  if (overlay) overlay.remove();

  overlay = document.createElement('div');
  overlay.id = 'confirm-overlay';
  overlay.className = 'confirm-overlay';
  overlay.innerHTML = `
    <div class="confirm-box">
      <div class="confirm-icon ${type}">
        ${type === 'danger' ? Icons.trash : Icons.alert}
      </div>
      <div class="confirm-title">${title}</div>
      <div class="confirm-msg">${message}</div>
      <div class="confirm-actions">
        <button class="btn btn-secondary btn-confirm-cancel">${cancelText}</button>
        <button class="btn btn-${type === 'danger' ? 'danger' : 'primary'} btn-confirm-ok">${confirmText}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));

  overlay.querySelector('.btn-confirm-cancel').addEventListener('click', () => closeConfirm(overlay));
  overlay.querySelector('.btn-confirm-ok').addEventListener('click', () => {
    closeConfirm(overlay);
    if (typeof onConfirm === 'function') onConfirm();
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) closeConfirm(overlay); });
}

function closeConfirm(overlay) {
  overlay.classList.remove('open');
  setTimeout(() => overlay.remove(), 300);
}

/* ── Modal ─────────────────────────────────────────────────── */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ── Date / Time Helpers ───────────────────────────────────── */
function timeAgo(isoString) {
  const now  = Date.now();
  const then = new Date(isoString).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60)    return 'منذ لحظات';
  if (diff < 3600)  return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
  return formatDate(isoString);
}

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('ar-SA', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('ar-SA', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function formatTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString('ar-SA', {
    hour: '2-digit', minute: '2-digit'
  });
}

/* ── Debounce ──────────────────────────────────────────────── */
function debounce(fn, delay = 300) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ── Highlight Search Term ─────────────────────────────────── */
function highlightText(text, query) {
  if (!query || !text) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(escaped, 'gi'), match =>
    `<mark class="search-highlight">${match}</mark>`
  );
}

/* ── Skeleton Rows ─────────────────────────────────────────── */
function renderSkeletonRows(count = 5, cols = 8) {
  return Array.from({ length: count }, () => `
    <tr>
      ${Array.from({ length: cols }, () => `
        <td><div class="skeleton skeleton-text" style="width:${60 + Math.random() * 30}%"></div></td>
      `).join('')}
    </tr>
  `).join('');
}

/* ── Copy to Clipboard ─────────────────────────────────────── */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`تم النسخ: ${text}`, 'success', 2000);
  }).catch(() => {
    showToast('فشل النسخ', 'error');
  });
}

/* ── WhatsApp Link ─────────────────────────────────────────── */
function buildWhatsAppLink(number, message = '') {
  const clean = (number || YAS_WHATSAPP_NUMBER).replace(/\D/g, '');
  const msg = encodeURIComponent(message);
  return `https://wa.me/${clean}${msg ? '?text=' + msg : ''}`;
}

/* ── Count Up Animation ────────────────────────────────────── */
function animateCount(el, target, duration = 800) {
  const start = 0;
  const step  = target / (duration / 16);
  let   current = start;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

/* ── Theme Init ────────────────────────────────────────────── */
function initTheme() {
  const theme = YASStorage.getTheme();
  document.documentElement.setAttribute('data-theme', theme);

  // Update all theme toggles
  document.querySelectorAll('.theme-toggle, #theme-toggle-btn').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? Icons.sun : Icons.moon;
    btn.setAttribute('data-tooltip', theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن');
  });
}

/* ── Dashboard Auth Guard ──────────────────────────────────── */
function requireAuth() {
  if (!YASStorage.isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }

  // Also check if API token exists when using API
  if (typeof YAS_API !== 'undefined' && YAS_API.token) {
    // Token exists, proceed
    return true;
  }

  return true;
}

/* ── Render Dashboard Sidebar ──────────────────────────────── */
function initDashboardSidebar() {
  const currentPage = window.location.pathname.split('/').pop();

  const navItems = document.querySelectorAll('.nav-item[data-page]');
  navItems.forEach(item => {
    if (item.getAttribute('data-page') === currentPage) {
      item.classList.add('active');
    }
  });

  // Sidebar toggle for mobile
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // Notification badge
  updateNotifBadge();
}

function updateNotifBadge() {
  const count = YASStorage.getUnreadCount();
  const badge = document.getElementById('notif-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

/* ── Global Search ─────────────────────────────────────────── */
function initGlobalSearch() {
  const input    = document.getElementById('global-search');
  const dropdown = document.getElementById('search-results');
  if (!input || !dropdown) return;

  const doSearch = debounce((query) => {
    if (!query || query.length < 2) {
      dropdown.classList.remove('show');
      return;
    }

    const q = query.toLowerCase();
    const tickets = YASStorage.getAllTickets().filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.customer.name.toLowerCase().includes(q) ||
      t.customer.phone.includes(q) ||
      t.device.model.toLowerCase().includes(q) ||
      t.device.serial_number.toLowerCase().includes(q)
    ).slice(0, 6);

    if (tickets.length === 0) {
      dropdown.innerHTML = `<div class="search-result-item"><span class="search-result-sub">لا توجد نتائج</span></div>`;
    } else {
      dropdown.innerHTML = tickets.map(t => `
        <div class="search-result-item" onclick="window.location.href='ticket-details.html?id=${t.id}'">
          <div>
            <div class="search-result-id">${highlightText(t.id, query)}</div>
            <div class="search-result-name">${highlightText(t.customer.name, query)}</div>
            <div class="search-result-sub">${DeviceTypeLabels[t.device.type] || t.device.type} · ${RequestTypeLabels[t.request.type] || t.request.type}</div>
          </div>
          <span class="badge ${StatusBadgeClass[t.status]}">${StatusLabels[t.status]}</span>
        </div>
      `).join('');
    }

    dropdown.classList.add('show');
  }, 250);

  input.addEventListener('input', e => doSearch(e.target.value.trim()));
  document.addEventListener('click', e => {
    if (!input.closest('.global-search').contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
}

/* ── Notification Panel ────────────────────────────────────── */
function initNotifPanel() {
  const btn   = document.getElementById('notif-btn');
  const panel = document.getElementById('notif-panel');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    if (isOpen) {
      renderNotifications();
      YASStorage.markAllNotificationsRead();
      updateNotifBadge();
    }
  });

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  const clearBtn = document.getElementById('notif-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      YASStorage.clearNotifications();
      renderNotifications();
      updateNotifBadge();
    });
  }
}

function renderNotifications() {
  const list  = document.getElementById('notif-list');
  if (!list) return;
  const notifs = YASStorage.getAllNotifications();

  if (notifs.length === 0) {
    list.innerHTML = `
      <div class="empty-state" style="padding:var(--space-8)">
        ${Icons.bell}
        <p>لا توجد إشعارات</p>
      </div>`;
    return;
  }

  const iconMap = { new: 'new', urgent: 'urgent', resolved: 'resolved', reply: 'reply' };

  list.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}" 
         onclick="${n.ticketId ? `window.location.href='ticket-details.html?id=${n.ticketId}'` : ''}">
      <div class="notif-icon ${iconMap[n.type] || 'new'}">${Icons.bell}</div>
      <div>
        <div class="notif-text">${n.message}</div>
        <div class="notif-time">${timeAgo(n.time)}</div>
      </div>
    </div>
  `).join('');
}

/* ── Auto data-label for responsive tables ─────────────────── */
function initResponsiveTables() {
  document.querySelectorAll('table.table-responsive').forEach(table => {
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
    table.querySelectorAll('tbody tr').forEach(row => {
      row.querySelectorAll('td').forEach((td, i) => {
        if (headers[i]) td.setAttribute('data-label', headers[i]);
      });
    });
  });
}

// MutationObserver to auto-add data-label after dynamic table renders
const _tableObserver = new MutationObserver(() => {
  document.querySelectorAll('table.table-responsive').forEach(table => {
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
    table.querySelectorAll('tbody tr').forEach(row => {
      row.querySelectorAll('td').forEach((td, i) => {
        if (headers[i] && !td.getAttribute('data-label')) td.setAttribute('data-label', headers[i]);
      });
    });
  });
});

/* ── Init on DOM Ready ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Observe all table bodies for dynamic content
  document.querySelectorAll('table.table-responsive tbody').forEach(tbody => {
    _tableObserver.observe(tbody, { childList: true, subtree: true });
  });
  // Seed demo data on first visit
  YASStorage.seedDemoData();

  // Apply saved theme
  initTheme();

  // Theme toggle buttons
  document.querySelectorAll('.theme-toggle, #theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      YASStorage.toggleTheme();
      initTheme();
    });
  });

  // Page enter animation
  document.body.classList.add('page-enter');

  // FAQ accordion (if present)
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Portal mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const portalNav  = document.getElementById('portal-nav');
  if (menuToggle && portalNav) {
    menuToggle.addEventListener('click', () => {
      portalNav.classList.toggle('mobile-open');
    });
    document.addEventListener('click', e => {
      if (!menuToggle.contains(e.target) && !portalNav.contains(e.target)) {
        portalNav.classList.remove('mobile-open');
      }
    });
  }

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const overlay = btn.closest('.modal-overlay');
      if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
});

/* ── Exports ───────────────────────────────────────────────── */
window.YAS = {
  Icons,
  StatusLabels,
  StatusBadgeClass,
  PriorityLabels,
  PriorityBadgeClass,
  RequestTypeLabels,
  DeviceTypeLabels,
  WarrantyLabels,
  getDeviceIcon,
  statusBadge,
  priorityBadge,
  warrantyBadge,
  showToast,
  showConfirm,
  openModal,
  closeModal,
  timeAgo,
  formatDate,
  formatDateTime,
  formatTime,
  debounce,
  highlightText,
  renderSkeletonRows,
  copyToClipboard,
  buildWhatsAppLink,
  animateCount,
  initTheme,
  requireAuth,
  initDashboardSidebar,
  updateNotifBadge,
  initGlobalSearch,
  initNotifPanel,
  renderNotifications,
  initResponsiveTables,
  YAS_WHATSAPP_NUMBER
};
