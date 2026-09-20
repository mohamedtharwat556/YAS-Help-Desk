# 🔧 إعداد البيئة المحلية - خطوة بخطوة

## 📋 إنشاء ملف .env المحلي

### الخطوة 1: إنشاء ملف .env
بما أن `.env` في `.gitignore`، ستحتاج لإنشائه يدوياً:

** على Windows:**
1. افتح Notepad أو أي محرر نصوص
2. انسخ المحتوى أدناه
3. احفظ الملف باسم `.env` في مجلد `yas-helpdesk`
4. تأكد من اختيار "All Files" عند الحفظ (لا Text Files)

** على Linux/Mac:**
```bash
cd yas-helpdesk
cat > .env << 'EOF'
SUPABASE_URL=https://dqepsuecouvnvozcnjth.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZXBzdWVjb3V2bnZvemNuanRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTgxODY3NCwiZXhwIjoyMTA1Mzk0Njc0fQ.yn1zGz8RIbyPKTkjw8YwTZr5cnTvyvd4Tp5COv046HE
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZXBzdWVjb3V2bnZvemNuanRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTg2NzQsImV4cCI6MjEwNTM5NDY3NH0.wwP_8ITnKaks3y1ZT0Yde_4tW_71VlhVEqne2-pYovE
JWT_SECRET=eUVaEpjQey1BsAW5hF1ck+5+gJfhfIpslDxrw8KP8+IEw0dVGQzP6hYhv3V9gTBaCLY185XPGP57mLHJz+SC8g==
NODE_ENV=development
EOF
```

### محتوى ملف .env:
```
SUPABASE_URL=https://dqepsuecouvnvozcnjth.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZXBzdWVjb3V2bnZvemNuanRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTgxODY3NCwiZXhwIjoyMTA1Mzk0Njc0fQ.yn1zGz8RIbyPKTkjw8YwTZr5cnTvyvd4Tp5COv046HE
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZXBzdWVjb3V2bnZvemNuanRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTg2NzQsImV4cCI6MjEwNTM5NDY3NH0.wwP_8ITnKaks3y1ZT0Yde_4tW_71VlhVEqne2-pYovE
JWT_SECRET=eUVaEpjQey1BsAW5hF1ck+5+gJfhfIpslDxrw8KP8+IEw0dVGQzP6hYhv3V9gTBaCLY185XPGP57mLHJz+SC8g==
NODE_ENV=development
```

---

## 🚀 إعداد قاعدة البيانات في Supabase

### الخطوة 1: الدخول إلى Supabase
1. اذهب إلى: https://supabase.com/dashboard
2. سجل الدخول
3. اختر مشروعك: `dqepsuecouvnvozcnjth`

### الخطوة 2: إنشاء جدول users
إذا لم يكن الجدول موجوداً، أنشئه:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'engineer',
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  whatsapp TEXT,
  email TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  warranty_status TEXT DEFAULT 'unknown',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  request_type TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  description TEXT,
  status TEXT DEFAULT 'received',
  files TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### الخطوة 3: إضافة المستخدمين الافتراضيين
```sql
-- Delete existing users if they exist (to avoid duplicates)
DELETE FROM users WHERE email IN ('admin@yas.sa', 'adam@yas.sa');

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role, phone, is_active) VALUES
('admin@yas.sa', '$2a$10$T1DDFcWsksoelcA2cv3Dr.kQo3GLMb.5FqfwR5GLD/OqPQy6tadHm', 'Admin User', 'admin', '0500000000', true),
('adam@yas.sa', '$2a$10$T1DDFcWsksoelcA2cv3Dr.kQo3GLMb.5FqfwR5GLD/OqPQy6tadHm', 'Eng. Adam Farouk', 'engineer', '0501234567', true);

-- Verify insertion
SELECT id, email, name, role, phone, is_active, created_at FROM users WHERE email IN ('admin@yas.sa', 'adam@yas.sa');
```

---

## 🧪 اختبار الاتصال المحلي

### اختبار API:
افتح المتصفح على:
```
http://localhost:8000/api/auth.js
```

### اختبار تسجيل الدخول:
```bash
curl -X POST http://localhost:8000/api/auth.js \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yas.sa","password":"admin123"}'
```

---

## 🌐 إضافة المتغيرات في Vercel

بعد إعداد البيئة المحلية بنجاح، اتبع دليل `VERCEL_ENV_VALUES.md` لإضافة نفس المتغيرات في Vercel.

---

## ✅ التحقق

بعد إكمال الخطوات:
- [ ] ملف `.env` موجود في مجلد المشروع
- [ ] جداول قاعدة البيانات منشأة في Supabase
- [ ] المستخدمين الافتراضيين مضافين
- [ ] API يعمل محلياً على `http://localhost:8000`
- [ ] تسجيل الدخول يعمل

---

## 🎯 الخطوات التالية

1. اختبار النظام محلياً
2. إضافة المتغيرات في Vercel (استخدم `VERCEL_ENV_VALUES.md`)
3. إعادة نشر المشروع على Vercel
4. اختبار النظام على Vercel
