# 🔧 إضافة متغيرات البيئة في Vercel - خطوة بخطوة

## 📋 المتغيرات المطلوبة (REQUIRED)

### 1️⃣ SUPABASE_URL
- **الوصف**: رابط مشروع Supabase
- **كيفية الحصول عليه**:
  1. اذهب إلى https://supabase.com
  2. اختر مشروعك
  3. اذهب إلى Settings > API
  4. انسخ **Project URL**
- **مثال**: `https://abcdefgh.supabase.co`

### 2️⃣ SUPABASE_SERVICE_ROLE_KEY
- **الوصف**: مفتاح Service Role من Supabase (للصلاحيات الكاملة)
- **كيفية الحصول عليه**:
  1. في نفس صفحة Settings > API
  2. انسخ **service_role secret**
- **⚠️ تحذير**: هذا مفتاح سري جداً، لا تشاركه مع أحد!

### 3️⃣ JWT_SECRET
- **الوصف**: مفتاح سري لتشفير JWT tokens
- **كيفية إنشائه**:
  - على Linux/Mac: `openssl rand -base64 32`
  - على Windows: استخدم أي مولد random string عبر الإنترنت
  - يجب أن يكون طويلاً وعشوائياً (32+ حرف)
- **مثال**: `abc123xyz456...` (استخدم قيمة عشوائية حقيقية!)

---

## 🚀 خطوات الإضافة في Vercel

### الخطوة 1: الدخول إلى إعدادات المشروع
1. اذهب إلى: https://vercel.com/projs-projects-5ba5cc35/yas-help-desk
2. اضغط على **Settings** (الإعدادات)
3. من القائمة الجانبية، اختر **Environment Variables**

### الخطوة 2: إضافة المتغيرات

#### إضافة SUPABASE_URL:
1. اضغط على **Add New**
2. في حقل **Name**: اكتب `SUPABASE_URL`
3. في حقل **Value**: الصق رابط Supabase الخاص بك
4. اختر **All Environments** (أو Production فقط)
5. اضغط **Save**

#### إضافة SUPABASE_SERVICE_ROLE_KEY:
1. اضغط على **Add New**
2. في حقل **Name**: اكتب `SUPABASE_SERVICE_ROLE_KEY`
3. في حقل **Value**: الصق مفتاح service_role
4. اختر **All Environments**
5. اضغط **Save**

#### إضافة JWT_SECRET:
1. اضغط على **Add New**
2. في حقل **Name**: اكتب `JWT_SECRET`
3. في حقل **Value**: الصق المفتاح العشوائي الذي أنشأته
4. اختر **All Environments**
5. اضغط **Save**

### الخطوة 3: إعادة النشر
بعد إضافة جميع المتغيرات:
1. اذهب إلى **Deployments** في Vercel
2. بجانب آخر deployment، اضغط على نقاط القائمة (⋯)
3. اختر **Redeploy**
4. انتظر حتى ينتهي النشر

---

## ✅ التحقق من الإعدادات

### اختبار الاتصال:
افتح المتصفح على:
```
https://yas-help-desk.vercel.app/api/auth.js
```

### اختبار تسجيل الدخول:
استخدم Postman أو curl:
```bash
curl -X POST https://yas-help-desk.vercel.app/api/auth.js \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yas.sa","password":"admin123"}'
```

### النتيجة المتوقعة:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@yas.sa",
      "name": "Admin User",
      "role": "admin"
    },
    "token": "..."
  }
}
```

---

## 🚨 استكشاف الأخطاء

### خطأ: "Database not configured"
- **السبب**: متغيرات Supabase غير مضافة أو خاطئة
- **الحل**: تحقق من `SUPABASE_URL` و `SUPABASE_SERVICE_ROLE_KEY`

### خطأ: "Invalid token"
- **السبب**: `JWT_SECRET` غير صحيح أو مختلف بين الطلبات
- **الحل**: تأكد أن `JWT_SECRET` نفسه في جميع البيئات

### خطأ: 500 Internal Server Error
- **السبب**: متغير ناقص أو خاطئ
- **الحل**: تحقق من logs في Vercel (Deployments > View Logs)

---

## 📝 ملاحظات أمان هامة

1. **لا تشارك المفاتيح**: أبداً لا تضع مفاتيح حقيقية في GitHub
2. **استخدم بيئات منفصلة**: استخدم مفاتيح مختلفة للتطوير والإنتاج
3. **غيّر المفاتيح دورياً**: قم بتحديث المفاتيح كل 3-6 أشهر
4. **راقب الاستخدام**: راقب استخدام Supabase لاكتشاف أي نشاط مشبوه

---

## 🎯 الخلاصة

بعد إضافة هذه المتغيرات الثلاثة:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `JWT_SECRET`

سيعمل نظام API الخاص بك على Vercel بشكل كامل مع Supabase!

للمساعدة الإضافية، راجع:
- `VERCEL_ENV_SETUP.md` - التفاصيل الكاملة
- `DEPLOYMENT_GUIDE.md` - دليل النشر الشامل
