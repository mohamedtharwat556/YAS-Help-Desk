# YAS Help Desk - Deployment Guide

## 🚀 Quick Deployment to Vercel

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click "Deploy"

### 3. Configure Environment Variables in Vercel

In your Vercel project settings, add these environment variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-jwt-secret
NODE_ENV=production
```

**Where to get these values:**
- **Supabase URL & Keys**: Go to your Supabase project → Settings → API
- **JWT Secret**: Generate a secure key using `openssl rand -base64 32`

### 4. Setup Supabase Database

1. Go to your Supabase project → SQL Editor
2. Run the SQL script from `setup-database.sql`
3. This will create all required tables and default users

## 📁 Project Structure

```
yas-helpdesk/
├── api/                    # Vercel serverless functions
│   ├── auth.js            # Authentication endpoint
│   ├── tickets.js         # Tickets CRUD operations
│   ├── public-ticket.js   # Public ticket creation (no auth)
│   ├── customers.js       # Customers endpoint
│   ├── devices.js         # Devices endpoint
│   └── users.js           # Users endpoint
├── css/                   # Stylesheets
├── js/                    # Frontend JavaScript
│   ├── api.js            # API client
│   ├── storage.js        # Storage layer (API + LocalStorage fallback)
│   ├── config.js         # Configuration
│   └── ...
├── server.js             # Local Express server (for development)
├── vercel.json           # Vercel configuration
├── setup-database.sql    # Database setup script
└── env.example           # Environment variables template
```

## 🔧 Local Development

### Using Express Server (Recommended)
```bash
npm install
npm run api
```
The server will run on `http://localhost:3000`

### Using Static Serve
```bash
npm install
npm run serve
```
The static site will run on `http://localhost:8000`

## 🔄 API Endpoints

### Public Endpoints (No Auth Required)
- `POST /api/public-ticket` - Create a new support ticket

### Protected Endpoints (Auth Required)
- `POST /api/auth` - Login and get JWT token
- `GET /api/me` - Get current user info
- `GET /api/tickets` - Get all tickets
- `POST /api/tickets` - Create a new ticket
- `PUT /api/tickets/:id` - Update a ticket
- `GET /api/customers` - Get all customers
- `GET /api/devices` - Get all devices
- `GET /api/users` - Get all users

## 🔐 Default Users

After running the database setup script, these users will be created:

**Admin:**
- Email: `admin@yas.sa`
- Password: `admin123`
- Role: `admin`

**Engineer:**
- Email: `adam@yas.sa`
- Password: `admin123`
- Role: `engineer`

## 📊 Database Schema

The system uses the following Supabase tables:
- `users` - System users (admin, engineers)
- `customers` - Customer information
- `devices` - Device information linked to customers
- `tickets` - Support tickets linked to customers and devices

## 🐛 Troubleshooting

### API Not Working
- Check that environment variables are set correctly in Vercel
- Verify Supabase project is active
- Check browser console for API errors

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check that database tables exist (run setup-database.sql)
- Ensure Supabase project is not paused

### CORS Errors
- The API client handles CORS automatically
- For local development, the Express server includes CORS middleware

## 📝 Notes

- The system uses a hybrid approach: API when available, LocalStorage fallback
- For production, ensure USE_API is set to true in js/storage.js
- Service Worker is disabled to prevent caching issues
- All API requests include proper error handling and logging