# 🔑 كيفية الحصول على مفاتيح Supabase

## 📋 خطوات الحصول على المفاتيح

### 1️⃣ إنشاء مشروع Supabase (إذا لم يكن لديك واحد)

1. اذهب إلى https://supabase.com
2. اضغط **Start your project**
3. سجل الدخول باستخدام GitHub أو Google
4. اضغط **New Project**
5. املأ البيانات:
   - **Name**: `yas-helpdesk`
   - **Database Password**: (اختر كلمة مرور قوية واحفظها!)
   - **Region**: اختر المنطقة الأقرب لعملائك (مثلاً: Southeast Asia)
6. اضغط **Create new project**
7. انتظر 1-2 دقيقة حتى ينتهي الإنشاء

---

### 2️⃣ تنفيذ قاعدة البيانات

1. بعد إنشاء المشروع، اذهب إلى **SQL Editor** (من القائمة الجانبية)
2. اضغط **New Query**
3. انسخ محتوى ملف `insert-users.sql`:
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

4. الصقه في SQL Editor
5. اضغط **Run** (أو Ctrl+Enter)
6. تأكد من ظهور رسالة Success

---

### 3️⃣ الحصول على مفاتيح API

#### الحصول على SUPABASE_URL:
1. من القائمة الجانبية، اذهب إلى **Settings** > **API**
2. في قسم **Project API keys**، ستجد:
   - **Project URL**: هذا هو `SUPABASE_URL`
   - **مثال**: `https://abcdefgh.supabase.co`
3. انسخ هذا الرابط

#### الحصول على SUPABASE_SERVICE_ROLE_KEY:
1. في نفس صفحة Settings > API
2. في قسم **Project API keys**، ستجد:
   - **service_role secret**: هذا هو `SUPABASE_SERVICE_ROLE_KEY`
   - يبدأ بـ `eyJ...`
3. انسخ هذا المفتاح
4. ⚠️ **هام**: هذا مفتاح سري جداً، لا تشاركه مع أحد!

---

### 4️⃣ إنشاء JWT_SECRET

#### على Linux/Mac:
```bash
openssl rand -base64 32
```

#### على Windows:
**الخيار 1 - باستخدام PowerShell:**
```powershell
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
[Convert]::ToBase64String($bytes)
```

**الخيار 2 - باستخدام موقع عبر الإنترنت:**
1. اذهب إلى موقع مثل: https://www.random.org/strings/
2. اختر:
   - Length: 32
   - Characters: Alphanumeric
3. انسخ النتيجة

**الخيار 3 - يدوياً:**
أنشئ سلسلة عشوائية طويلة مثل:
```
my-super-secret-jwt-key-2024-yas-helpdesk-xyz123
```

---

## 📝 ملخص القيم المطلوبة

بعد إكمال الخطوات، ستحتاج إلى هذه القيم:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-random-secret-key-here
```

---

## 🚨 تحذيرات أمان

### ❌ لا تفعل هذه الأشياء:
- لا تضع المفاتيح الحقيقية في GitHub
- لا تشارك `SUPABASE_SERVICE_ROLE_KEY` مع أحد
- لا تستخدم نفس المفاتيح في مشاريع مختلفة
- لا تستخدم `JWT_SECRET` سهل التخمين مثل "secret123"

### ✅ افعل هذه الأشياء:
- احفظ المفاتيح في مكان آمن (مثل password manager)
- استخدم مفاتيح مختلفة للتطوير والإنتاج
- حدّث المفاتيح دورياً (كل 3-6 أشهر)
- راقب استخدام Supabase لاكتشاف أي نشاط غير عادي

---

## 🧪 اختبار الاتصال

### اختبار باستخدام curl:
```bash
curl https://your-project-id.supabase.co/rest/v1/users
```

### اختبار باستخدام JavaScript:
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://your-project-id.supabase.co',
  'your-service-role-key'
);

async function testConnection() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connection successful!', data);
  }
}

testConnection();
```

---

## 📚 روابط مفيدة

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase API Guide](https://supabase.com/docs/guides/api)
- [JWT Best Practices](https://jwt.io/introduction)

---

## 🎯 الخطوة التالية

بعد الحصول على هذه القيم:
1. اذهب إلى `VERCEL_ENV_ADD_GUIDE.md`
2. اتبع الخطوات لإضافة المتغيرات في Vercel
3. أعد نشر المشروع
4. اختبر النظام

**ملاحظة**: إذا واجهت أي مشاكل، تحقق من:
- صحة `SUPABASE_URL` (يجب أن يبدأ بـ https://)
- صحة `SUPABASE_SERVICE_ROLE_KEY` (يجب أن يبدأ بـ eyJ)
- أن مشروع Supabase نشط (not paused)
- أنك نفذت `insert-users.sql` لإضافة المستخدمين
