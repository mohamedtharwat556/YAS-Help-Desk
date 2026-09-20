# ============================================================
# YAS Help Desk - Vercel Environment Variables Setup
# ============================================================

## 📋 Required Environment Variables for Vercel

Go to your Vercel project: https://vercel.com/projs-projects-5ba5cc35/yas-help-desk/settings/environment-variables

### 🔴 REQUIRED VARIABLES (Must Add These)

### 1. Supabase Configuration
Get these from: https://supabase.com/dashboard/project/_/settings/api

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. JWT Configuration
Generate a secure key: `openssl rand -base64 32`

```
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### 🟢 OPTIONAL VARIABLES (Recommended)

### 3. Basic Configuration
```
NODE_ENV=production
```

### 4. File Upload Configuration
```
UPLOAD_DIR=/tmp
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf
```

### 5. CORS Configuration
After deployment, set this to your Vercel domain:
```
CORS_ORIGIN=https://yas-help-desk.vercel.app
```

### 6. Rate Limiting
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔧 How to Get Supabase Credentials:

1. Go to https://supabase.com
2. Select your project
3. Go to Settings > API
4. Copy:
   - Project URL → SUPABASE_URL
   - anon public → SUPABASE_ANON_KEY
   - service_role secret → SUPABASE_SERVICE_ROLE_KEY

## ⚠️ Important Notes:

1. **Never commit secrets to Git**
2. **Use different keys for development and production**
3. **Rotate secrets regularly**
4. **After adding variables, redeploy your project**

## 🚀 After Setting Up:

1. Add all environment variables in Vercel
2. Click "Redeploy" in Vercel
3. Test your API endpoints
4. Update CORS_ORIGIN with your actual domain if needed

## 🧪 Testing:

After deployment, test:
```
https://yas-help-desk.vercel.app/health
```

Should return:
```json
{
  "status": "OK",
  "message": "YAS Help Desk API is running",
  "timestamp": "...",
  "environment": "production",
  "database": {
    "status": "connected"
  }
}
```