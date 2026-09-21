# YAS Help Desk - API Testing Guide

## Current Issue: Vercel Auth Protection

The deployment at `https://yas-help-desk-eaquxlwxw-projs-projects-5ba5cc35.vercel.app/` is protected by Vercel Auth, which prevents direct API access for testing.

## Solutions

### Option 1: Disable Vercel Auth Protection (Recommended for Testing)

1. Go to your Vercel project: https://vercel.com/projs-projects-5ba5cc35/yas-help-desk
2. Navigate to **Settings** → **Protection**
3. Disable **Vercel Authentication** or set it to "Preview only"
4. Redeploy the application
5. Then test using the methods below

### Option 2: Test After Vercel Login

1. Open https://yas-help-desk-eaquxlwxw-projs-projects-5ba5cc35.vercel.app/
2. Login with your Vercel account
3. Then open: https://yas-help-desk-eaquxlwxw-projs-projects-5ba5cc35.vercel.app/test-api-browser.html
4. Run the tests from the browser

### Option 3: Use Local Testing

1. Run the local server:
   ```bash
   cd yas-helpdesk
   npm run api
   ```

2. Open http://localhost:3001/test-api-browser.html in your browser

3. Run the tests locally

## Manual Testing via Browser Console

After accessing the site (either by disabling auth or logging in), open browser console and run:

```javascript
// Test health endpoint
fetch('/api/health')
  .then(r => r.json())
  .then(data => console.log('Health:', data));

// Test login
fetch('/api/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@yas.com', password: 'admin123' })
})
  .then(r => r.json())
  .then(data => {
    console.log('Login:', data);
    if(data.success) {
      // Test get tickets
      return fetch('/api/get-tickets', {
        headers: { 'Authorization': `Bearer ${data.data.token}` }
      });
    }
  })
  .then(r => r.json())
  .then(data => console.log('Tickets:', data));
```

## Expected Cache Headers

After successful API calls, check for these headers in browser DevTools (Network tab):

```
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0
Pragma: no-cache
Expires: 0
```

## Cache Buster Testing

The frontend automatically adds `?_t=TIMESTAMP` to all GET requests. You can verify this:

1. Open Network tab in DevTools
2. Make a request to `/api/get-tickets`
3. Check the URL - it should have `?_t=...` parameter
4. Make another request - the timestamp should be different
5. Both requests should return fresh data

## Current Deployment Status

- **URL**: https://yas-help-desk-eaquxlwxw-projs-projects-5ba5cc35.vercel.app/
- **Status**: Protected by Vercel Auth
- **API Endpoints**: Working but require authentication
- **Cache Fix**: Implemented (cache-control headers + cache-buster)
- **Health Endpoint**: Added at `/api/health`

## Next Steps

1. **Disable Vercel Auth** for testing purposes
2. **Run browser tests** using test-api-browser.html
3. **Verify cache headers** are working correctly
4. **Test dashboard API** specifically for cache issues
5. **Re-enable protection** after testing if needed
