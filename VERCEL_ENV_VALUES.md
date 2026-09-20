# 🔑 قيم متغيرات البيئة لـ Vercel

## 📋 القيم الجاهزة للإضافة في Vercel

### 1️⃣ SUPABASE_URL
```
https://dqepsuecouvnvozcnjth.supabase.co
```

### 2️⃣ SUPABASE_SERVICE_ROLE_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZXBzdWVjb3V2bnZvemNuanRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTgxODY3NCwiZXhwIjoyMTA1Mzk0Njc0fQ.yn1zGz8RIbyPKTkjw8YwTZr5cnTvyvd4Tp5COv046HE
```

### 3️⃣ JWT_SECRET
```
eUVaEpjQey1BsAW5hF1ck+5+gJfhfIpslDxrw8KP8+IEw0dVGQzP6hYhv3V9gTBaCLY185XPGP57mLHJz+SC8g==
```

---

## 🚀 خطوات الإضافة في Vercel

### الخطوة 1: الدخول إلى إعدادات المشروع
1. اذهب إلى: https://vercel.com/projs-projects-5ba5cc35/yas-help-desk
2. اضغط على **Settings** (الإعدادات)
3. من القائمة الجانبية، اختر **Environment Variables**

### الخطوة 2: إضافة المتغيرات

#### إضافة SUPABASE_URL:
1. اضغط على **Add New**
2. **Name**: `SUPABASE_URL`
3. **Value**: `https://dqepsuecouvnvozcnjth.supabase.co`
4. **Environment**: اختر **All Environments**
5. اضغط **Save**

#### إضافة SUPABASE_SERVICE_ROLE_KEY:
1. اضغط على **Add New**
2. **Name**: `SUPABASE_SERVICE_ROLE_KEY`
3. **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZXBzdWVjb3V2bnZvemNuanRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTgxODY3NCwiZXhwIjoyMTA1Mzk0Njc0fQ.yn1zGz8RIbyPKTkjw8YwTZr5cnTvyvd4Tp5COv046HE`
4. **Environment**: اختر **All Environments**
5. اضغط **Save**

#### إضافة JWT_SECRET:
1. اضغط على **Add New**
2. **Name**: `JWT_SECRET`
3. **Value**: `eUVaEpjQey1BsAW5hF1ck+5+gJfhfIpslDxrw8KP8+IEw0dVGQzP6hYhv3V9gTBaCLY185XPGP57mLHJz+SC8g==`
4. **Environment**: اختر **All Environments**
5. اضغط **Save**

### الخطوة 3: إعادة النشر
1. اذهب إلى **Deployments** في Vercel
2. بجانب آخر deployment، اضغط على نقاط القائمة (⋯)
3. اختر **Redeploy**
4. انتظر حتى ينتهي النشر

---

## ✅ التحقق من الإعدادات

### اختبار API:
افتح المتصفح على:
```
https://yas-help-desk.vercel.app/api/auth.js
```

### اختبار تسجيل الدخول:
```bash
curl -X POST https://yas-help-desk.vercel.app/api/auth.js \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yas.sa","password":"admin123"}'
```

---

## 🧪 إعداد قاعدة البيانات

قبل الاختبار، تأكد من تنفيذ هذا SQL في Supabase:

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

## 🎯 الخلاصة

بعد إضافة هذه المتغيرات الثلاثة:
- ✅ `SUPABASE_URL` = `https://dqepsuecouvnvozcnjth.supabase.co`
- ✅ `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGci...`
- ✅ `JWT_SECRET` = `eUVaEpjQey1...`

سيعمل نظام API الخاص بك على Vercel بشكل كامل مع Supabase!

---

## ⚠️ تحذير أمان

هذه المفاتيح محفوظة في ملف `local-env-config.txt` للاستخدام المحلي فقط:
- لا ترفع هذا الملف إلى GitHub
- لا تشاركه مع أحد
- الملف في `.gitignore` لذلك لن يتم رفعه تلقائياً
