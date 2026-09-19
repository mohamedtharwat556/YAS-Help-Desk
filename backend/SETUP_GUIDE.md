# دليل إعداد الباك إند - YAS Help Desk

## الخطوة 1: إعداد Supabase

1. **إنشاء حساب في Supabase**
   - اذهب إلى https://supabase.com
   - قم بتسجيل حساب جديد
   - أنشئ مشروع جديد

2. **تنفيذ ملف قاعدة البيانات**
   - بعد إنشاء المشروع، اذهب إلى SQL Editor
   - انسخ محتوى ملف `database/schema.sql`
   - الصق الكود ونفذ الأمر
   - هذا سينشئ جميع الجداول المطلوبة

3. **الحصول على مفاتيح API**
   - اذهب إلى Settings > API
   - انسخ:
     - `Project URL` → ضعه في `SUPABASE_URL`
     - `anon public` key → ضعه في `SUPABASE_ANON_KEY`
     - `service_role` key → ضعه في `SUPABASE_SERVICE_ROLE_KEY`

## الخطوة 2: إعداد الباك إند

1. **تثبيت الحزم**
```bash
cd backend
npm install
```

2. **إنشاء ملف `.env`**
```bash
cp .env.example .env
```

3. **تعديل ملف `.env`**
```env
PORT=3000
NODE_ENV=development

# ضع بيانات Supabase هنا
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# مفتاح JWT - استخدم كلمة قوية
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# إعدادات رفع الملفات
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

# إعدادات CORS
CORS_ORIGIN=http://localhost:8000
```

## الخطوة 3: تشغيل السيرفر

### وضع التطوير:
```bash
npm run dev
```

### وضع الإنتاج:
```bash
npm start
```

السيرفر سيعمل على: `http://localhost:3000`

## الخطوة 4: اختبار السيرفر

1. **اختبار الصحة**
```bash
curl http://localhost:3000/health
```

2. **تسجيل مستخدم جديد**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "engineer"
  }'
```

3. **تسجيل الدخول**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## الخطوة 5: ربط الفرونت إند

1. **تأكد من إضافة ملف `api.js`**
   - تم بالفعل إضافة `<script src="js/api.js"></script>` في جميع صفحات HTML

2. **تأكد من تشغيل الباك إند**
   - السيرفر يجب أن يعمل على `http://localhost:3000`

3. **اختبار الاتصال**
   - افتح صفحة تسجيل الدخول
   - استخدم بيانات المستخدم التجريبي:
     - البريد: `adam@yas.sa`
     - كلمة المرور: `admin123`

## البيانات التجريبية

النظام يتضمن مستخدمين تجريبيين:
- **Admin**: `admin@yas.sa` / `admin123`
- **Engineer**: `adam@yas.sa` / `admin123`

⚠️ **هام**: قم بتغيير كلمات المرور هذه في بيئة الإنتاج!

## استكشاف الأخطاء

### السيرفر لا يعمل
- تأكد من تثبيت جميع الحزم: `npm install`
- تأكد من تعديل ملف `.env` بشكل صحيح
- تحقق من أن المنفذ 3000 غير مستخدم

### أخطاء الاتصال بقاعدة البيانات
- تأكد من صحة مفاتيح Supabase
- تحقق من أن المشروع في Supabase نشط
- تأكد من تنفيذ ملف `schema.sql`

### أخطاء المصادقة
- تأكد من أن token يتم إرساله في الهيدر
- تحقق من صحة مفتاح JWT
- تأكد من أن المستخدم نشط في قاعدة البيانات

## الأمان

### في بيئة الإنتاج:
1. استخدم مفتاح JWT قوي
2. غيّر كلمات المرور الافتراضية
3. استخدم HTTPS
4. قم بتحديد CORS للمجال الصحيح
5. استخدم متغيرات البيئة الحساسة
6. قم بتفعيل حماية إضافية في Supabase

## الميزات المتاحة

### واجهات API:
- ✅ المصادقة (تسجيل دخول، تسجيل حساب)
- ✅ إدارة التذاكر
- ✅ إدارة العملاء
- ✅ إدارة الأجهزة
- ✅ إدارة المستخدمين
- ✅ الإشعارات
- ✅ سجلات الصيانة
- ✅ الإعدادات
- ✅ رفع الملفات

### الميزات:
- ✅ نظام مصادقة JWT
- ✅ ترقية الصلاحيات (Role-based access)
- ✅ التحقق من البيانات
- ✅ معالجة الأخطاء
- ✅ حد معدل الطلبات
- ✅ دعم CORS
- ✅ رفع الملفات
- ✅ الاستجابة التلقائية مع LocalStorage

## الدعم

إذا واجهت أي مشاكل:
1. تحقق من سجلات السيرفر
2. تأكد من إعدادات Supabase
3. راجع دليل Supabase: https://supabase.com/docs