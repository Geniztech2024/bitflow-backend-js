import crypto from 'crypto';

// Generate a random 32-byte key and convert it to a hexadecimal string
const sessionSecret = crypto.randomBytes(32).toString('hex');

console.log(`Your session secret key: ${sessionSecret}`);
