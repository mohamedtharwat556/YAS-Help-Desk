# YAS Help Desk - Backend API

واجهة برمجة التطبيقات لنظام YAS Help Desk.

## 🚀 النشر على Vercel

هذا المشروع مُعد للنشر على Vercel كـ API Serverless.

### المتغيرات البيئية المطلوبة:

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

### الخطوات:

1. ارفع هذا المستودع على GitHub
2. اربطه بـ Vercel
3. أضف جميع المتغيرات البيئية في إعدادات Vercel
4. انشر

## 📁 الهيكل

- `server.js` - الملف الرئيسي للسيرفر
- `routes/` - مسارات API
- `middleware/` - البرمجيات الوسيطة
- `config/` - ملفات التكوين
- `database/` - مخطط قاعدة البيانات
- `supabase/` - إعدادات Supabase

## � التشغيل المحلي

```bash
npm install
cp .env.example .env
# عدّل .env ببياناتك
npm start
```

سيعمل على `http://localhost:3000`

## 🔍 Health Check

افتح `http://localhost:3000/health` للتأكد من عمل السيرفر