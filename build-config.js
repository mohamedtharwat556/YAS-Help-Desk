// Build script to generate config.js with environment variables
const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL || 'http://localhost:3000/api';

const configContent = `// ============================================================
// YAS Help Desk - Configuration
// Auto-generated during build
// ============================================================

'use strict';

window.ENV = {
  API_URL: '${apiUrl}'
};
`;

const configPath = path.join(__dirname, 'js', 'config.js');
fs.writeFileSync(configPath, configContent);

console.log('✅ Config file generated with API_URL:', apiUrl);