# دليل نشر YAS Help Desk على Vercel

## 🚀 الخطة:
1. رفع الفرونت إند على Vercel
2. رفع الباك إند على Vercel كـ API منفصل
3. ربطهم ببعض عبر environment variables

## 📋 الخطوات:

### الجزء 1: إعداد الفرونت إند لـ Vercel

#### 1.1 إنشاء ملف vercel.json للفرونت إند:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

#### 1.2 إنشاء ملف package.json للفرونت إند:
```json
{
  "name": "yas-helpdesk-frontend",
  "version": "1.0.0",
  "scripts": {
    "start": "serve ."
  },
  "dependencies": {
    "serve": "^14.2.0"
  }
}
```

### الجزء 2: إعداد الباك إند لـ Vercel

#### 2.1 تعديل server.js للعمل مع Vercel:
```javascript
// إضافة في بداية الملف
const isVercel = process.env.VERCEL === '1';

if (isVercel) {
  // تعديل المنفذ لـ Vercel
  const PORT = process.env.PORT || 3000;
}
```

#### 2.2 إنشاء ملف vercel.json للباك إند:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### الجزء 3: النشر على Vercel

#### 3.1 نشر الفرونت إند:
1. إنشاء مجلد `frontend` يحتوي على ملفات الفرونت إند فقط
2. رفع `frontend` على Vercel
3. الحصول على رابط الفرونت إند

#### 3.2 نشر الباك إند:
1. إنشاء مجلد `backend-api` يحتوي على ملفات الباك إند فقط
2. رفع `backend-api` على Vercel
3. الحصول على رابط الباك إند

#### 3.3 ربطهم ببعض:
1. تحديث `CORS_ORIGIN` في الباك إند برابط الفرونت إند
2. تحديث `baseURL` في الفرونت إند برابط الباك إند

## 🔗 الخطوات العملية:

سأقوم الآن بتنفيذ هذه الخطوات:
1. فصل المشروع إلى frontend و backend
2. إعداد ملفات التكوين
3. إنشاء ملفات vercel.json
4. إعداد environment variables