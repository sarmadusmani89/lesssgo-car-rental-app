const crypto = require('crypto');

/**
 * KINA CALLBACK SIMULATOR
 * Use this to test your backend logic (success/fail) without a live bank.
 * 
 * Usage: node simulate-kina-callback.js <ORDER_ID> <AMOUNT> <NONCE> [MERCHANT_ID] [SECRET_KEY]
 */

const args = process.argv.slice(2);
if (args.length < 3) {
  console.log('Usage: node simulate-kina-callback.js <ORDER_ID> <AMOUNT> <NONCE> [MERCHANT_ID] [SECRET_KEY]');
  process.exit(1);
}

const ORDER = args[0];
const AMOUNT = args[1];
const NONCE = args[2];
const MERCHANT = args[3] || '000000099999004';
const SECRET = args[4] || 'debdd135e436905c7a02f20c56c83a4c501adf555457f0df';

const payload = {
  ACTION: '0',        // 0 = Success
  RC: '00',          // 00 = Approved
  APPROVAL: '123456',
  CURRENCY: 'PGK',
  AMOUNT: parseFloat(AMOUNT).toFixed(2),
  TERMINAL: '99999004',
  TRTYPE: '1',        // Default to Purchase for simple test
  ORDER: ORDER,
  RRN: 'RRN' + Date.now().toString().slice(-8),
  MERCHANT: MERCHANT,
  TIMESTAMP: new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 14),
  INT_REF: 'INT' + Date.now().toString().slice(-8),
  NONCE: NONCE
};

function encodeField(val) {
  if (val === null || val === undefined || val === '') return '-';
  const str = String(val);
  return `${str.length}${str}`;
}

const macOrder = [
  'ACTION', 'RC', 'APPROVAL', 'CURRENCY', 'AMOUNT', 'TERMINAL', 'TRTYPE', 'ORDER', 'RRN', 'MERCHANT', 'TIMESTAMP', 'INT_REF', 'NONCE'
];

const macString = macOrder.map(k => encodeField(payload[k])).join('');
const keyBuffer = Buffer.from(SECRET, 'hex');
const pSign = crypto.createHmac('sha256', keyBuffer).update(macString, 'utf8').digest('hex').toUpperCase();

payload.P_SIGN = pSign;

console.log('\n--- KINA CALLBACK PAYLOAD (SUCCESS) ---');
console.log(JSON.stringify(payload, null, 2));
console.log('\n--- CURL COMMAND ---');
console.log(`curl -X POST http://localhost:3001/payment/callback \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(payload)}'`);
