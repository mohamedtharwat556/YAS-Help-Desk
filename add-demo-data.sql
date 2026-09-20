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

-- Insert sample devices (using proper date casting)
INSERT INTO devices (customer_id, type, brand, model, serial_number, purchase_date, warranty_status)
VALUES
-- Device 1: Ahmed's Dell Laptop
((SELECT id FROM customers WHERE phone = '0501234567' LIMIT 1), 'laptop', 'Dell', 'Latitude 5420', 'DL5420-0012', '2023-03-15'::date, 'active'),

-- Device 2: Sara's Epson POS
((SELECT id FROM customers WHERE phone = '0559876543' LIMIT 1), 'pos', 'Epson', 'TM-T88VI', 'EP88VI-5521', '2022-11-01'::date, 'active'),

-- Device 3: Khalid's HP Desktop
((SELECT id FROM customers WHERE phone = '0533210987' LIMIT 1), 'desktop', 'HP', 'ProDesk 400 G7', 'HP400-G7-9921', '2021-06-20'::date, 'expired'),

-- Device 4: Noura's Hikvision Camera
((SELECT id FROM customers WHERE phone = '0505551234' LIMIT 1), 'hikvision', 'Hikvision', 'DS-2CD2143G2-I', 'HIK-CAM-3312', '2023-08-10'::date, 'active'),

-- Device 5: Omar's Epson Projector
((SELECT id FROM customers WHERE phone = '0556667788' LIMIT 1), 'projector', 'Epson', 'EB-X51', 'EP-X51-0087', '2022-01-15'::date, 'expired'),

-- Device 6: Fatima's Lenovo Laptop
((SELECT id FROM customers WHERE phone = '0512223344' LIMIT 1), 'laptop', 'Lenovo', 'ThinkPad E15', 'LN-E15-4421', '2023-12-01'::date, 'active');

-- Insert sample tickets
INSERT INTO tickets (ticket_number, customer_id, device_id, request_type, priority, description, status, assigned_user_id)
VALUES
-- Ticket 1: Ahmed's Dell Laptop
('YAS-SUP-10483',
 (SELECT id FROM customers WHERE phone = '0501234567' LIMIT 1),
 (SELECT id FROM devices WHERE serial_number = 'DL5420-0012' LIMIT 1),
 'technical',
 'high',
 'الجهاز يُعيد التشغيل بشكل عشوائي أثناء العمل. المشكلة بدأت بعد تحديث Windows الأخير.',
 'reviewing',
 (SELECT id FROM users WHERE email = 'adam@yas.sa' LIMIT 1)),

-- Ticket 2: Sara's Epson POS
('YAS-SUP-10484',
 (SELECT id FROM customers WHERE phone = '0559876543' LIMIT 1),
 (SELECT id FROM devices WHERE serial_number = 'EP88VI-5521' LIMIT 1),
 'maintenance',
 'critical',
 'جهاز الكاشير لا يطبع الفواتير بشكل صحيح. الطابعة تصدر صوتاً ثم تتوقف.',
 'contacting',
 (SELECT id FROM users WHERE email = 'adam@yas.sa' LIMIT 1)),

-- Ticket 3: Khalid's HP Desktop
('YAS-SUP-10485',
 (SELECT id FROM customers WHERE phone = '0533210987' LIMIT 1),
 (SELECT id FROM devices WHERE serial_number = 'HP400-G7-9921' LIMIT 1),
 'warranty',
 'medium',
 'الجهاز لا يشتغل تماماً. عند الضغط على زر التشغيل لا يحدث شيء.',
 'diagnosing',
 (SELECT id FROM users WHERE email = 'adam@yas.sa' LIMIT 1)),

-- Ticket 4: Noura's Hikvision Camera
('YAS-SUP-10486',
 (SELECT id FROM customers WHERE phone = '0505551234' LIMIT 1),
 (SELECT id FROM devices WHERE serial_number = 'HIK-CAM-3312' LIMIT 1),
 'installation',
 'medium',
 'طلب تركيب 4 كاميرات مراقبة إضافية في المستودع.',
 'received',
 (SELECT id FROM users WHERE email = 'adam@yas.sa' LIMIT 1)),

-- Ticket 5: Omar's Epson Projector
('YAS-SUP-10487',
 (SELECT id FROM customers WHERE phone = '0556667788' LIMIT 1),
 (SELECT id FROM devices WHERE serial_number = 'EP-X51-0087' LIMIT 1),
 'maintenance',
 'low',
 'البروجكتر يعرض صورة باهتة وألوانها ليست صحيحة.',
 'maintenance',
 (SELECT id FROM users WHERE email = 'adam@yas.sa' LIMIT 1)),

-- Ticket 6: Fatima's Lenovo Laptop
('YAS-SUP-10488',
 (SELECT id FROM customers WHERE phone = '0512223344' LIMIT 1),
 (SELECT id FROM devices WHERE serial_number = 'LN-E15-4421' LIMIT 1),
 'technical',
 'medium',
 'مشكلة في نظام التشغيل - Windows لا يعمل بشكل صحيح.',
 'received',
 (SELECT id FROM users WHERE email = 'adam@yas.sa' LIMIT 1));

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