# دليل نشر YAS Help Desk على Vercel

## 🚀 نظرة عامة

هذا الدليل يشرح كيفية نشر نظام YAS Help Desk على Vercel بشكل منفصل:
- **Frontend**: الواجهة الأمامية (HTML, CSS, JS)
- **Backend**: واجهة API (Node.js + Express + Supabase)

## 📋 المتطلبات الأساسية

1. حساب GitHub مع المشروع مرفوع عليه
2. حساب Vercel (يمكنك التسجيل باستخدام GitHub)
3. حساب Supabase (للـ Backend)
4. Node.js مثبت على جهازك (للاختبار المحلي)

---

## 🎯 الخطوة 1: إعداد المشروع على GitHub

### 1.1 فصل المشروع

حالياً المشروع في هيكل واحد. عليك فصله إلى مستودعين منفصلين:

**مستودع الفرونت إند:**
```
yas-helpdesk-frontend/
├── css/
├── js/
├── assets/
├── *.html (all HTML files)
├── manifest.json
├── service-worker.js
├── package.json (created)
├── vercel.json (created)
└── README.md
```

**مستودع الباك إند:**
```
yas-helpdesk-backend/
├── config/
├── middleware/
├── routes/
├── database/
├── server.js
├── package.json
├── .env.example
├── vercel.json (created)
└── README.md
```

### 1.2 إنشاء المستودعات على GitHub

1. أنشئ مستودع جديد `yas-helpdesk-frontend` على GitHub
2. أنشئ مستودع جديد `yas-helpdesk-backend` على GitHub
3. ارفع الملفات المناسبة لكل مستودع

---

## 🌐 الخطوة 2: نشر Backend على Vercel

### 2.1 ربط مستودع Backend بـ Vercel

1. سجل الدخول إلى [Vercel](https://vercel.com)
2. اضغط على "Add New Project"
3. اختر مستودع `yas-helpdesk-backend` من GitHub
4. اضغط "Import"

### 2.2 إعدادات المشروع

في صفحة إعدادات Vercel:

**Framework Preset:** `Other`

**Build & Development Settings:**
- Root Directory: `./`
- Build Command: تركه فارغاً
- Output Directory: تركه فارغاً

**Environment Variables:**
أضف المتغيرات التالية (ستأخذها من ملف `.env.example`):

```env
NODE_ENV=production
PORT=3000

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2.3 النشر

1. اضغط "Deploy"
2. انتظر حتى ينتهي النشر
3. ستحصل على رابط مثل: `https://yas-helpdesk-backend.vercel.app`
4. احفظ هذا الرابط للخطوة التالية

### 2.4 اختبار الـ Backend

افتح المتصفح على: `https://yas-helpdesk-backend.vercel.app/health`

يجب أن ترى:
```json
{
  "status": "OK",
  "message": "YAS Help Desk API is running",
  "timestamp": "...",
  "environment": "production"
}
```

---

## 🎨 الخطوة 3: نشر Frontend على Vercel

### 3.1 ربط مستودع Frontend بـ Vercel

1. من لوحة تحكم Vercel، اضغط "Add New Project"
2. اختر مستودع `yas-helpdesk-frontend` من GitHub
3. اضغط "Import"

### 3.2 إعدادات المشروع

**Framework Preset:** `Other`

**Build & Development Settings:**
- Root Directory: `./`
- Build Command: تركه فارغاً
- Output Directory: تركه فارغاً

**Environment Variables:**
أضف متغير واحد فقط:

```env
API_URL=https://yas-helpdesk-backend.vercel.app/api
```

### 3.3 النشر

1. اضغط "Deploy"
2. انتظر حتى ينتهي النشر
3. ستحصل على رابط مثل: `https://yas-helpdesk-frontend.vercel.app`

### 3.4 تحديث CORS في Backend

عد إلى إعدادات Backend في Vercel:
1. اذهب إلى Settings > Environment Variables
2. حدّث `CORS_ORIGIN` برابط الفرونت إند:
   ```
   CORS_ORIGIN=https://yas-helpdesk-frontend.vercel.app
   ```
3. أعد نشر الـ Backend (Redeploy)

---

## 🔗 الخطوة 4: ربط النظام مع Supabase

### 4.1 إنشاء مشروع Supabase

1. سجل الدخول إلى [Supabase](https://supabase.com)
2. اضغط "New Project"
3. أدخل:
   - **Name**: `yas-helpdesk`
   - **Database Password**: (اختر كلمة مرور قوية)
   - **Region**: اختر المنطقة الأقرب لعملائك
4. انتظر حتى ينتهي إنشاء المشروع

### 4.2 تنفيذ مخطط قاعدة البيانات

1. افتح SQL Editor في Supabase
2. انسخ محتوى ملف `backend/database/schema.sql`
3. الصقه في SQL Editor
4. اضغط "Run"

### 4.3 الحصول على مفاتيح API

1. في Supabase، اذهب إلى Settings > API
2. ستجد:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public**: `eyJ...`
   - **service_role secret**: `eyJ...`

### 4.4 تحديث متغيرات البيئة في Backend

عد إلى إعدادات Backend في Vercel:
1. اذهب إلى Settings > Environment Variables
2. حدّث القيم Supabase:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
3. أعد نشر الـ Backend

---

## ✅ الخطوة 5: اختبار النظام

### 5.1 اختبار الفرونت إند

1. افتح رابط الفرونت إند: `https://yas-helpdesk-frontend.vercel.app`
2. جرب تسجيل طلب دعم جديد
3. تحقق من ظهور البيانات بشكل صحيح

### 5.2 اختبار لوحة التحكم

1. افتح `https://yas-helpdesk-frontend.vercel.app/login.html`
2. سجل الدخول باستخدام:
   - **Email**: `admin@yas.sa`
   - **Password**: `admin123`
3. تحقق من عرض التذاكر والإحصائيات

### 5.3 اختبار API

استخدم Postman أو curl لاختبار endpoints:

```bash
# Health check
curl https://yas-helpdesk-backend.vercel.app/health

# Login
curl -X POST https://yas-helpdesk-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yas.sa","password":"admin123"}'
```

---

## 🔧 الخطوة 6: تحديث البيانات الافتراضية

### 6.1 تغيير كلمات المرور

هام جداً تغيير كلمات المرور الافتراضية:

1. في Supabase SQL Editor، نفذ:
```sql
-- تغيير كلمة مرور Admin
UPDATE users 
SET password_hash = '$2b$10$NEW_HASH_HERE' 
WHERE email = 'admin@yas.sa';

-- تغيير كلمة مرور Engineer
UPDATE users 
SET password_hash = '$2b$10$NEW_HASH_HERE' 
WHERE email = 'adam@yas.sa';
```

2. لتوليد hash جديد، استخدم:
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your_new_password', 10);
console.log(hash);
```

### 6.2 تحديث JWT Secret

في إعدادات Backend في Vercel:
1. غيّر `JWT_SECRET` إلى قيمة عشوائية طويلة
2. يمكنك استخدام: `openssl rand -base64 32`
3. أعد نشر الـ Backend

---

## 📊 الخطوة 7: المراقبة والصيانة

### 7.1 إعداد النطاق المخصص (اختياري)

**للفرونت إند:**
1. في Vercel، اذهب إلى Settings > Domains
2. أضف نطاقك: `helpdesk.yourcompany.com`
3. اتبع تعليمات DNS

**للباك إند:**
1. في Vercel، اذهب إلى Settings > Domains
2. أضف نطاق API: `api.yourcompany.com`
3. اتبع تعليمات DNS

### 7.2 إعداد إشعارات البريد الإلكتروني

في Vercel:
1. اذهب إلى Settings > Notifications
2. فعّل إشعارات النشر والخطأ

### 7.3 مراقبة الأداء

1. اذهب إلى Analytics في Vercel
2. راقب عدد الزيارات ووقت الاستجابة
3. تحقق من logs للكشف عن الأخطاء

---

## 🚨 استكشاف الأخطاء

### مشكلة: CORS Errors

**الحل:**
1. تأكد أن `CORS_ORIGIN` في Backend يحتوي على رابط الفرونت إند الصحيح
2. أعد نشر الـ Backend بعد التحديث

### مشكلة: API URL خاطئ

**الحل:**
1. تحقق من متغير `API_URL` في إعدادات Frontend
2. تأكد أنه ينتهي بـ `/api`
3. أعد نشر الفرونت إند

### مشكلة: اتصال Supabase فاشل

**الحل:**
1. تحقق من صحة مفاتيح Supabase
2. تأكد أن project URL صحيح
3. تحقق من أن قاعدة البيانات نشطة

### مشكلة: 404 Errors

**الحل:**
1. تأكد أن ملف `vercel.json` في المكان الصحيح
2. تحقق من هيكل الملفات
3. راجع logs في Vercel

---

## 📝 التحقق من النشر

بعد الانتهاء، تأكد من:

- [ ] Backend يعمل على `/health`
- [ ] Frontend يفتح بشكل صحيح
- [ ] تسجيل الدخول يعمل
- [ ] إنشاء تذكرة جديد يعمل
- [ ] عرض التذاكر يعمل
- [ ] رفع الملفات يعمل
- [ ] CORS مُعدّل بشكل صحيح
- [ ] كلمات المرور الافتراضية غُيّرت
- [ ] JWT Secret غُيّر
- [ ] النطاق المخصص (اختياري)

---

## 🎉 الخلاصة

الآن لديك:
- **Frontend**: `https://yas-helpdesk-frontend.vercel.app`
- **Backend**: `https://yas-helpdesk-backend.vercel.app`
- **Database**: Supabase
- **نظام متكامل** يعمل على السحابة

يمكنك الآن مشاركة رابط الفرونت إند مع العملاء ولوحة التحكم مع الفنيين!

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. راجع logs في Vercel
2. تحقق من متغيرات البيئة
3. تأكد من صحة إعدادات Supabase
4. راجع هذا الدليل مرة أخرى

**تم إنشاء هذا الدليل بواسطة Devin AI**