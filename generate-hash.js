const bcrypt = require('bcryptjs');

// Generate hash for admin123
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('Password:', password);
console.log('Hash:', hash);

// Test the hash
const isValid = bcrypt.compareSync(password, hash);
console.log('Verification:', isValid ? 'SUCCESS' : 'FAILED');