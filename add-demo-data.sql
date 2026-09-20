-- ============================================================
-- YAS Help Desk - Demo Data Script
-- Run this in Supabase SQL Editor to add sample data
-- ============================================================

-- Insert sample customers
INSERT INTO customers (name, phone, whatsapp, email, company) VALUES
('أحمد محمد العمري', '0501234567', '0501234567', 'ahmed@example.com', 'شركة الأمل'),
('سارة أحمد', '0559876543', '0559876543', 'sara@techcorp.sa', 'تيك كورب'),
('خالد الزهراني', '0533210987', '0533210987', 'khalid.z@gmail.com', ''),
('نورة المنصور', '0505551234', '0505551234', 'noura@company.com', 'مؤسسة النور'),
('عمر الشهري', '0556667788', '0556667788', 'omar.s@outlook.com', 'مدرسة الرواد'),
('فاطمة القحطاني', '0512223344', '0512223344', 'fatima@gmail.com', '')
ON CONFLICT (phone) DO NOTHING;

-- Get customer IDs (run these separately to get the IDs)
-- For this script, we'll use phone to reference customers

-- Insert sample devices
INSERT INTO devices (customer_id, type, brand, model, serial_number, purchase_date, warranty_status)
SELECT 
  c.id,
  'laptop',
  'Dell',
  'Latitude 5420',
  'DL5420-0012',
  '2023-03-15',
  'active'
FROM customers c WHERE c.phone = '0501234567'

UNION ALL

SELECT 
  c.id,
  'pos',
  'Epson',
  'TM-T88VI',
  'EP88VI-5521',
  '2022-11-01',
  'active'
FROM customers c WHERE c.phone = '0559876543'

UNION ALL

SELECT 
  c.id,
  'desktop',
  'HP',
  'ProDesk 400 G7',
  'HP400-G7-9921',
  '2021-06-20',
  'expired'
FROM customers c WHERE c.phone = '0533210987'

UNION ALL

SELECT 
  c.id,
  'hikvision',
  'Hikvision',
  'DS-2CD2143G2-I',
  'HIK-CAM-3312',
  '2023-08-10',
  'active'
FROM customers c WHERE c.phone = '0505551234'

UNION ALL

SELECT 
  c.id,
  'projector',
  'Epson',
  'EB-X51',
  'EP-X51-0087',
  '2022-01-15',
  'expired'
FROM customers c WHERE c.phone = '0556667788'

UNION ALL

SELECT 
  c.id,
  'laptop',
  'Lenovo',
  'ThinkPad E15',
  'LN-E15-4421',
  '2023-12-01',
  'active'
FROM customers c WHERE c.phone = '0512223344';

-- Insert sample tickets
INSERT INTO tickets (ticket_number, customer_id, device_id, request_type, priority, description, status, assigned_user_id)
SELECT 
  'YAS-SUP-10483',
  c.id,
  d.id,
  'technical',
  'high',
  'الجهاز يُعيد التشغيل بشكل عشوائي أثناء العمل. المشكلة بدأت بعد تحديث Windows الأخير.',
  'reviewing',
  (SELECT id FROM users WHERE email = 'adam@yas.sa' LIMIT 1)
FROM customers c
CROSS JOIN devices d
WHERE c.phone = '0501234567' AND d.serial_number = 'DL5420-0012'

UNION ALL

SELECT 
  'YAS-SUP-10484',
  c.id,
  d.id,
  'maintenance',
  'critical',
  'جهاز الكاشير لا يطبع الفواتير بشكل صحيح. الطابعة تصدر صوتاً ثم تتوقف.',
  'contacting',
  (SELECT id FROM users WHERE email = 'adam@yas.sa' LIMIT 1)
FROM customers c
CROSS JOIN devices d
WHERE c.phone = '0559876543' AND d.serial_number = 'EP88VI-5521'

UNION ALL

SELECT 
  'YAS-SUP-10485',
  c.id,
  d.id,
  'warranty',
  'medium',
  'الجهاز لا يشتغل تماماً. عند الضغط على زر التشغيل لا يحدث شيء.',
  'diagnosing',
  (SELECT id FROM users WHERE email = 'adam@yas.sa' LIMIT 1)
FROM customers c
CROSS JOIN devices d
WHERE c.phone = '0533210987' AND d.serial_number = 'HP400-G7-9921'

UNION ALL

SELECT 
  'YAS-SUP-10486',
  c.id,
  d.id,
  'installation',
  'medium',
  'طلب تركيب 4 كاميرات مراقبة إضافية في المستودع.',
  'received',
  (SELECT id FROM users WHERE email = 'adam@yas.sa' LIMIT 1)
FROM customers c
CROSS JOIN devices d
WHERE c.phone = '0505551234' AND d.serial_number = 'HIK-CAM-3312'

UNION ALL

SELECT 
  'YAS-SUP-10487',
  c.id,
  d.id,
  'maintenance',
  'low',
  'البروجكتر يعرض صورة باهتة وألوانها ليست صحيحة.',
  'maintenance',
  (SELECT id FROM users WHERE email = 'adam@yas.sa' LIMIT 1)
FROM customers c
CROSS JOIN devices d
WHERE c.phone = '0556667788' AND d.serial_number = 'EP-X51-0087'

UNION ALL

SELECT 
  'YAS-SUP-10488',
  c.id,
  d.id,
  'technical',
  'medium',
  'مشكلة في نظام التشغيل - Windows لا يعمل بشكل صحيح.',
  'received',
  (SELECT id FROM users WHERE email = 'adam@yas.sa' LIMIT 1)
FROM customers c
CROSS JOIN devices d
WHERE c.phone = '0512223344' AND d.serial_number = 'LN-E15-4421';

-- Verify the data
SELECT 
  t.ticket_number,
  c.name as customer_name,
  c.phone as customer_phone,
  d.brand,
  d.model,
  t.request_type,
  t.priority,
  t.status,
  u.name as assigned_to
FROM tickets t
JOIN customers c ON t.customer_id = c.id
JOIN devices d ON t.device_id = d.id
LEFT JOIN users u ON t.assigned_user_id = u.id
ORDER BY t.created_at DESC;