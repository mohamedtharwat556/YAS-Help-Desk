# YAS Help Desk API Manual Test Guide

## Quick Manual Testing for Vercel Deployment

Replace `YOUR_APP_URL` with your actual Vercel deployment URL.

### 1. Health Check
```bash
curl -i https://YOUR_APP_URL/api/health
```

### 2. Authentication
```bash
# Login
curl -X POST https://YOUR_APP_URL/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yas.com","password":"admin123"}'
```

Save the token from the response for authenticated requests.

### 3. Get Current User
```bash
curl https://YOUR_APP_URL/api/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Get Users
```bash
curl https://YOUR_APP_URL/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Get Tickets (Main Endpoint)
```bash
curl -i https://YOUR_APP_URL/api/tickets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Get Tickets (Fresh Endpoint - Cache Bypass)
```bash
curl -i https://YOUR_APP_URL/api/get-tickets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Get Customers
```bash
curl https://YOUR_APP_URL/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 8. Get Devices
```bash
curl https://YOUR_APP_URL/api/devices \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 9. Submit Public Ticket (No Auth)
```bash
curl -X POST https://YOUR_APP_URL/api/submit-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test Customer",
      "phone": "+966500000000",
      "email": "test@example.com"
    },
    "device": {
      "type": "laptop",
      "brand": "Dell",
      "model": "XPS 15",
      "serial_number": "TEST123"
    },
    "request_type": "repair",
    "priority": "medium",
    "description": "Test ticket for API testing"
  }'
```

### 10. Cache Test
Run the same request multiple times to check if cache-buster is working:
```bash
# Request 1
curl -i "https://YOUR_APP_URL/api/get-tickets?_t=1" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Request 2 (different timestamp)
curl -i "https://YOUR_APP_URL/api/get-tickets?_t=2" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Request 3 (different timestamp)
curl -i "https://YOUR_APP_URL/api/get-tickets?_t=3" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Expected Cache Headers

Look for these headers in the response:
```
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0
Pragma: no-cache
Expires: 0
```

## Browser Console Testing

Open browser console on your Vercel deployment and run:

```javascript
// Test authentication
fetch('https://YOUR_APP_URL/api/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@yas.com', password: 'admin123' })
})
.then(r => r.json())
.then(data => {
  console.log('Login result:', data);
  if(data.success) {
    // Test get tickets with token
    return fetch('https://YOUR_APP_URL/api/get-tickets', {
      headers: { 'Authorization': `Bearer ${data.data.token}` }
    });
  }
})
.then(r => r.json())
.then(data => console.log('Tickets result:', data));
```

## Automated Test

Run the automated test script:
```bash
# Set your Vercel URL
export API_URL="https://YOUR_APP_URL/api"

# Run tests
npm test-api
```

Or directly:
```bash
API_URL="https://YOUR_APP_URL/api" node test-api.js
```
