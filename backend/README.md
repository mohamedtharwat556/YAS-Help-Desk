# YAS Help Desk Backend API

قائمة خلفية لنظام YAS Help Desk باستخدام Node.js + Express + Supabase

## 🚀 التقنيات المستخدمة

- **Node.js** - بيئة تشغيل JavaScript
- **Express.js** - إطار عمل الويب
- **Supabase** - قاعدة البيانات والخدمات السحابية
- **JWT** - نظام المصادقة
- **Bcrypt** - تشفير كلمات المرور
- **Multer** - رفع الملفات
- **Express Validator** - التحقق من البيانات

## 📋 المتطلبات

- Node.js (الإصدار 14 أو أحدث)
- npm أو yarn
- حساب Supabase

## 🔧 التثبيت

1. تثبيت الحزم:
```bash
cd backend
npm install
```

2. إنشاء ملف `.env`:
```bash
cp .env.example .env
```

3. تعديل ملف `.env` ببياناتك:
```env
PORT=3000
NODE_ENV=development

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

CORS_ORIGIN=http://localhost:8000
```

## 🗄️ إعداد قاعدة البيانات

1. أنشئ مشروعاً جديداً في Supabase
2. افتح SQL Editor في Supabase
3. انسخ محتوى ملف `database/schema.sql`
4. نفذ الأمر SQL لإنشاء الجداول
5. احصل على مفاتيح API من إعدادات المشروع

## 🚀 تشغيل السيرفر

### وضع التطوير:
```bash
npm run dev
```

### وضع الإنتاج:
```bash
npm start
```

السيرفر سيعمل على: `http://localhost:3000`

## 📡 واجهات API

### المصادقة (Authentication)
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - الحصول على بيانات المستخدم الحالي
- `PUT /api/auth/change-password` - تغيير كلمة المرور

### التذاكر (Tickets)
- `GET /api/tickets` - الحصول على جميع التذاكر
- `GET /api/tickets/:id` - الحصول على تذكرة محددة
- `POST /api/tickets` - إنشاء تذكرة جديدة
- `PUT /api/tickets/:id` - تحديث تذكرة
- `PUT /api/tickets/:id/status` - تحديث حالة التذكرة
- `POST /api/tickets/:id/notes` - إضافة ملاحظة للتذكرة
- `DELETE /api/tickets/:id` - حذف تذكرة (admin فقط)

### العملاء (Customers)
- `GET /api/customers` - الحصول على جميع العملاء
- `GET /api/customers/:id` - الحصول على عميل محدد
- `POST /api/customers` - إنشاء عميل جديد
- `PUT /api/customers/:id` - تحديث عميل
- `DELETE /api/customers/:id` - حذف عميل

### الأجهزة (Devices)
- `GET /api/devices` - الحصول على جميع الأجهزة
- `GET /api/devices/:id` - الحصول على جهاز محدد
- `POST /api/devices` - إنشاء جهاز جديد
- `PUT /api/devices/:id` - تحديث جهاز
- `DELETE /api/devices/:id` - حذف جهاز

### المستخدمين (Users)
- `GET /api/users` - الحصول على جميع المستخدمين (admin فقط)
- `GET /api/users/:id` - الحصول على مستخدم محدد
- `PUT /api/users/:id` - تحديث مستخدم
- `DELETE /api/users/:id` - حذف مستخدم (admin فقط)

### الإشعارات (Notifications)
- `GET /api/notifications` - الحصول على إشعارات المستخدم
- `PUT /api/notifications/:id/read` - تحديد إشعار كمقروء
- `PUT /api/notifications/read-all` - تحديد جميع الإشعارات كمقروءة
- `DELETE /api/notifications/:id` - حذف إشعار
- `DELETE /api/notifications/clear-all` - مسح جميع الإشعارات

### الصيانة (Maintenance)
- `GET /api/maintenance` - الحصول على سجلات الصيانة
- `POST /api/maintenance` - إنشاء سجل صيانة جديد
- `PUT /api/maintenance/:id` - تحديث سجل صيانة

### الإعدادات (Settings)
- `GET /api/settings` - الحصول على جميع الإعدادات
- `GET /api/settings/:key` - الحصول على إعداد محدد
- `PUT /api/settings/:key` - تحديث إعداد (admin فقط)

### رفع الملفات (Upload)
- `POST /api/upload` - رفع ملف واحد
- `POST /api/upload/multiple` - رفع ملفات متعددة
- `DELETE /api/upload/:filename` - حذف ملف

## 🔐 نظام المصادقة

جميع واجهات API المحمية تتطلب رمز JWT في الهيدر:

```
Authorization: Bearer <your_jwt_token>
```

## 📊 هيكل قاعدة البيانات

- `users` - مستخدمي النظام (مهندسين، مديرين)
- `customers` - بيانات العملاء
- `devices` - بيانات الأجهزة
- `tickets` - تذاكر الدعم الفني
- `ticket_notes` - ملاحظات التذاكر
- `ticket_activities` - نشاطات التذاكر
- `notifications` - إشعارات المستخدمين
- `settings` - إعدادات النظام
- `maintenance_records` - سجلات الصيانة
- `warranty_records` - سجلات الضمان

## 🧪 الاختبار

```bash
npm test
```

## 📝 البيانات التجريبية

النظام يتضمن مستخدمين تجريبيين:
- **Admin**: `admin@yas.sa` / `admin123`
- **Engineer**: `adam@yas.sa` / `admin123`

⚠️ **هام**: قم بتغيير كلمات المرور هذه في بيئة الإنتاج!

## 🚨 الأمان

- استخدام JWT للمصادقة
- تشفير كلمات المرور باستخدام bcrypt
- حماية من هجمات CSRF
- حد معدل الطلبات (Rate Limiting)
- التحقق من البيانات (Validation)
- معالجة الأخطاء الآمنة

## 📄 الترخيص

MIT License