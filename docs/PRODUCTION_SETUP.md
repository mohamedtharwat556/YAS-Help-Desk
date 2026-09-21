# إعداد النظام للإنتاج (Production Setup)

## 📋 نظرة عامة

هذا الدليل يساعدك على إعداد نظام YAS Help Desk للإنتاج على Vercel.

## 🔐 المتطلبات الأساسية

- حساب على [Supabase](https://supabase.com)
- حساب على [Vercel](https://vercel.com)
- حساب GitHub (لربط المشروع)

---

## الخطوة 1: إعداد Supabase

### 1.1 إنشاء مشروع جديد

1. سجل دخول على [Supabase](https://supabase.com)
2. اضغط على "New Project"
3. أدخل اسم المشروع (مثلاً: `yas-helpdesk`)
4. اختر المنطقة الأقرب لعملائك
5. أنشئ كلمة مرور قوية للقاعدة البيانات
6. اضغط "Create new project"

### 1.2 إنشاء الجداول المطلوبة

في Supabase Dashboard، اذهب إلى **SQL Editor** وشغل الأوامر التالية:

```sql
-- جدول المستخدمين
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'technician',
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول العملاء
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  whatsapp TEXT,
  email TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الأجهزة
CREATE TABLE devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  brand TEXT,
  model TEXT NOT NULL,
  serial_number TEXT,
  purchase_date DATE,
  warranty_status TEXT DEFAULT 'unknown',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول التذاكر
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  request_type TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  description TEXT,
  files JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'received',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهرس للبحث بالتذكرة
CREATE INDEX idx_tickets_number ON tickets(ticket_number);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_customer ON tickets(customer_id);
```

### 1.3 الحصول على بيانات الاتصال

1. في Supabase Dashboard، اذهب إلى **Settings** > **API**
2. انسخ القيم التالية:
   - **Project URL** (سيستخدم كـ `SUPABASE_URL`)
   - **service_role** secret (سيستخدم كـ `SUPABASE_SERVICE_ROLE_KEY`)

⚠️ **هام:** استخدم `service_role` وليس `anon` key لأنه يحتاج صلاحيات كاملة.

---

## الخطوة 2: إعداد البيئة المحلية

### 2.1 إنشاء ملف `.env`

```bash
# في مجلد المشروع
cp .env.example .env
```

### 2.2 تعبئة ملف `.env`

افتح ملف `.env` وأضف قيمك الحقيقية:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Secret (استخدم سلسلة عشوائية قوية)
JWT_SECRET=your-very-secure-random-secret-key-at-least-32-characters

# تكوين المسؤول (اختياري - سيستخدم القيم الافتراضية إذا لم تُحدد)
ADMIN_EMAIL=admin@yas-helpdesk.com
ADMIN_PASSWORD=Admin@2026
ADMIN_NAME=YAS Admin
```

### 2.3 إنشاء المستخدم الإداري

```bash
# تثبيت الاعتماديات
npm install

# إنشاء المستخدم الإداري
npm run seed:admin
```

هذا الأمر سيُنشئ مستخدم إداري في قاعدة البيانات.

---

## الخطوة 3: إعداد Vercel

### 3.1 ربط المشروع بـ Vercel

1. سجل دخول على [Vercel](https://vercel.com)
2. اضغط "Add New" > "Project"
3. اضغط "Import" من GitHub (أو ارفع المشروع يدوياً)
4. اختر مستودع المشروع

### 3.2 إضافة Environment Variables

في صفحة إعدادات المشروع في Vercel، أضف المتغيرات التالية:

| المتغير | القيمة | البيئة |
|---------|--------|--------|
| `SUPABASE_URL` | URL من Supabase | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key من Supabase | Production, Preview, Development |
| `JWT_SECRET` | سلسلة عشوائية قوية (نفس القيمة في .env) | Production, Preview, Development |

⚠️ **هام:** تأكد من اختيار جميع البيئات (Production, Preview, Development).

### 3.3 النشر

1. اضغط "Deploy"
2. انتظر حتى انتهاء النشر
3. ستحصل على رابط مثل: `https://your-project.vercel.app`

---

## الخطوة 4: الاختبار

### 4.1 اختبار Health Endpoint

```bash
curl https://your-project.vercel.app/api/health
```

يجب أن يعود بـ: `{"status":"ok"}`

### 4.2 اختبار تسجيل الدخول

```bash
curl -X POST https://your-project.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yas-helpdesk.com","password":"Admin@2026"}'
```

يجب أن يعود بـ token وبيانات المستخدم.

### 4.3 اختبار إنشاء تذكرة عامة

```bash
curl -X POST https://your-project.vercel.app/api/submit-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {"name":"Test User","phone":"123456789"},
    "device": {"model":"iPhone 13","type":"mobile"},
    "request_type":"repair",
    "priority":"medium",
    "description":"Test ticket"
  }'
```

---

## الخطوة 5: التأمين الإضافي

### 5.1 تغيير كلمة مرور المسؤول

بعد أول تسجيل دخول:
1. ادخل لوحة التحكم
2. اذهب إلى إعدادات المستخدم
3. غيّر كلمة المرور فوراً

### 5.2 تفعيل Row Level Security (RLS) في Supabase

```sql
-- تفعيل RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- سياسات إضافية حسب الحاجة
```

### 5.3 إعداد Domain مخصص (اختياري)

1. في Vercel Dashboard، اذهب إلى **Settings** > **Domains**
2. أضف domain الخاص بك
3. اتبع خطوات التحقق من DNS

---

## استكشاف الأخطاء

### خطأ: Database not configured

**الحل:** تأكد من إضافة environment variables في Vercel بشكل صحيح.

### خطأ: Invalid token

**الحل:** تأكد من أن `JWT_SECRET` نفسه في جميع البيئات.

### خطأ: Unauthorized

**الحل:** تأكد من أن المستخدم الإداري تم إنشاؤه بشكل صحيح باستخدام `npm run seed:admin`.

---

## الصيانة

### تحديث الكود

```bash
git pull origin main
# Vercel سيعيد النشر تلقائياً
```

### إضافة مستخدمين جدد

يمكنك إضافة مستخدمين من لوحة التحكم أو عبر SQL مباشرة في Supabase.

---

## الدعم

إذا واجهت أي مشاكل:
1. تحقق من logs في Vercel Dashboard
2. تحقق من logs في Supabase Dashboard
3. تأكد من أن جميع environment variables صحيحة

---

## ✅ قائمة التحقق قبل الإطلاق

- [ ] إنشاء مشروع Supabase
- [ ] إنشاء الجداول المطلوبة
- [ ] الحصول على Supabase URL و Service Role Key
- [ ] إنشاء ملف `.env` محلياً
- [ ] تشغيل `npm run seed:admin` لإنشاء المستخدم الإداري
- [ ] ربط المشروع بـ Vercel
- [ ] إضافة environment variables في Vercel
- [ ] نشر المشروع على Vercel
- [ ] اختبار health endpoint
- [ ] اختبار تسجيل الدخول
- [ ] اختبار إنشاء تذكرة عامة
- [ ] تغيير كلمة مرور المسؤول
- [ ] تفعيل RLS في Supabase (اختياري)

---

**تم إنشاء هذا الدليل بواسطة Devin - مساعد البرمجة الذكي**
