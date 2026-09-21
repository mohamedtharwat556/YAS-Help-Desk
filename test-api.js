// Comprehensive API Test for YAS Help Desk
// Tests all endpoints on Vercel deployment

// Use built-in fetch for Node.js 18+, otherwise require node-fetch
const fetch = global.fetch || require('node-fetch');

// Configuration - Update this with your Vercel URL
// Replace with your actual Vercel deployment URL
const BASE_URL = process.env.API_URL || 'https://your-app.vercel.app/api';
// For local testing: const BASE_URL = 'http://localhost:3001/api';

// Test credentials (update with valid credentials)
const TEST_USER = {
  email: 'admin@yas.com',
  password: 'admin123'
};

let authToken = null;
let testTicketId = null;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  console.log('\n' + '='.repeat(60));
  log(`TEST: ${testName}`, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

// Test helper
async function testEndpoint(name, url, options = {}) {
  try {
    logTest(name);
    logInfo(`URL: ${url}`);
    logInfo(`Method: ${options.method || 'GET'}`);

    const startTime = Date.now();
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;

    logInfo(`Status: ${response.status} (${duration}ms)`);
    logInfo(`Cache-Control: ${response.headers.get('cache-control') || 'Not set'}`);

    const data = await response.json();
    logInfo(`Response: ${JSON.stringify(data, null, 2)}`);

    if (response.ok) {
      logSuccess(`${name} passed`);
      return { success: true, data, status: response.status };
    } else {
      logError(`${name} failed with status ${response.status}`);
      return { success: false, data, status: response.status };
    }
  } catch (error) {
    logError(`${name} failed with error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test suite
async function runTests() {
  log('\n' + '='.repeat(60));
  log('YAS HELP DESK API TEST SUITE', 'yellow');
  log('='.repeat(60) + '\n');

  const results = [];

  // 1. Health Check (if available)
  results.push(await testEndpoint(
    'Health Check',
    `${BASE_URL}/health`,
    { method: 'GET' }
  ));

  // 2. Authentication - Login
  const loginResult = await testEndpoint(
    'User Login',
    `${BASE_URL}/auth`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_USER)
    }
  );
  results.push(loginResult);

  if (loginResult.success && loginResult.data.success) {
    authToken = loginResult.data.data.token;
    logSuccess(`Auth token obtained: ${authToken.substring(0, 20)}...`);
  } else {
    logError('Failed to obtain auth token, skipping authenticated tests');
    return summarizeResults(results);
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  };

  // 3. Get Current User
  results.push(await testEndpoint(
    'Get Current User',
    `${BASE_URL}/me`,
    { headers: authHeaders }
  ));

  // 4. Get Users
  results.push(await testEndpoint(
    'Get Users',
    `${BASE_URL}/users`,
    { headers: authHeaders }
  ));

  // 5. Get Tickets (main endpoint)
  const ticketsResult = await testEndpoint(
    'Get Tickets (Main Endpoint)',
    `${BASE_URL}/tickets`,
    { headers: authHeaders }
  );
  results.push(ticketsResult);

  // 6. Get Tickets (fresh endpoint)
  const freshTicketsResult = await testEndpoint(
    'Get Tickets (Fresh Endpoint - Cache Bypass)',
    `${BASE_URL}/get-tickets`,
    { headers: authHeaders }
  );
  results.push(freshTicketsResult);

  // 7. Get Customers
  results.push(await testEndpoint(
    'Get Customers',
    `${BASE_URL}/customers`,
    { headers: authHeaders }
  ));

  // 8. Get Devices
  results.push(await testEndpoint(
    'Get Devices',
    `${BASE_URL}/devices`,
    { headers: authHeaders }
  ));

  // 9. Cache Test - Multiple requests to same endpoint
  logTest('Cache Test - Multiple GET Requests');
  logInfo('Testing if cache-buster is working...');
  
  const cacheTestResults = [];
  for (let i = 1; i <= 3; i++) {
    const result = await testEndpoint(
      `Cache Test Request ${i}`,
      `${BASE_URL}/get-tickets`,
      { headers: authHeaders }
    );
    cacheTestResults.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between requests
  }
  results.push(...cacheTestResults);

  // 10. Submit Public Ticket (no auth required)
  const publicTicketData = {
    customer: {
      name: 'Test Customer',
      phone: '+966500000000',
      email: 'test@example.com'
    },
    device: {
      type: 'laptop',
      brand: 'Dell',
      model: 'XPS 15',
      serial_number: 'TEST123'
    },
    request_type: 'repair',
    priority: 'medium',
    description: 'Test ticket for API testing'
  };

  results.push(await testEndpoint(
    'Submit Public Ticket',
    `${BASE_URL}/submit-ticket`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publicTicketData)
    }
  ));

  // 11. Create Ticket (authenticated)
  if (ticketsResult.success && ticketsResult.data.data && ticketsResult.data.data.length > 0) {
    testTicketId = ticketsResult.data.data[0].id;
  }

  // 12. Statistics/Dashboard Data
  results.push(await testEndpoint(
    'Get Dashboard Stats (via tickets endpoint)',
    `${BASE_URL}/tickets?limit=1000`,
    { headers: authHeaders }
  ));

  return summarizeResults(results);
}

function summarizeResults(results) {
  console.log('\n' + '='.repeat(60));
  log('TEST SUMMARY', 'yellow');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const total = results.length;

  log(`Total Tests: ${total}`, 'cyan');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`, 'cyan');

  // Failed tests details
  if (failed > 0) {
    console.log('\n' + '-'.repeat(60));
    log('FAILED TESTS:', 'red');
    console.log('-'.repeat(60));
    results.forEach((result, index) => {
      if (!result.success) {
        log(`Test ${index + 1}: ${result.error || 'Unknown error'}`, 'red');
      }
    });
  }

  // Cache analysis
  console.log('\n' + '-'.repeat(60));
  log('CACHE ANALYSIS:', 'yellow');
  console.log('-'.repeat(60));
  const cacheResults = results.filter(r => r.cacheControl);
  if (cacheResults.length > 0) {
    cacheResults.forEach(r => {
      log(`Cache-Control: ${r.cacheControl}`, r.cacheControl.includes('no-cache') ? 'green' : 'yellow');
    });
  } else {
    log('No cache headers found in responses', 'yellow');
  }

  console.log('\n' + '='.repeat(60));
  log('TEST SUITE COMPLETED', 'yellow');
  console.log('='.repeat(60) + '\n');

  return { passed, failed, total };
}

// Run tests
runTests().catch(error => {
  logError(`Test suite failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
