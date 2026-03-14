
const crypto = require('crypto');

// ── Verify our HMAC implementation matches the guide's CryptoJS example ───────
// From Kina's integration guide:
const guideSecret = 'debdd135e436905c7a02f20c56c83a4c501adf555457f0df';
const guideMacString = '89999999911511.483USD67714461512345678901234519pgw@mail.sample.com33https://www.sample.com/shop/reply142003010515302117Books Online Inc.-14www.sample.com-16IT Books. Qty:216F2B2DD7E603A7ADA';

const keyBuffer = Buffer.from(guideSecret, 'hex');
const result = crypto.createHmac('sha256', keyBuffer).update(guideMacString, 'utf8').digest('hex').toUpperCase();
console.log('Guide example HMAC:', result);
console.log('');

// ── Now test our ACTUAL callback data from the logs ───────────────────────────
// The callback body received from Kina:
const actualData = {
  TERMINAL: "99999004",
  TRTYPE: "1",
  ORDER: "78976364261773501977",
  AMOUNT: "250.00",
  CURRENCY: "PGK",
  ACTION: "3",
  RC: "-3",
  APPROVAL: "",
  RRN: "",
  INT_REF: "",
  TIMESTAMP: "20260314152750",
  NONCE: "E298EEB0E5262EC7ADB2D089DC9053A2"
};
const RECEIVED_P_SIGN = "1CB294B2F133A1D86B82A8A5EE33E4BC7661EABBB56F96C1DC27A4986C3938FB";

// The guide example uses the SAME terminal/secret for test mode.
// This means if our key is a SAMPLE key (not assigned to terminal 99999004),
// the callback will be signed with a DIFFERENT key than in guide.
//
// Let's check: if the guide's sample key also generated the callback P_SIGN,
// that would mean the key is correct and it's purely a field order issue.
// Otherwise, the key is indeed wrong (guide sample ≠ real terminal key).

function encodeField(val) {
  if (val === null || val === undefined || val === '') return '-';
  return val.length + val;
}

// Test 3 most likely field orders for the response MAC
const orders = {
  'AIB-standard:  ACTION,RC,APPROVAL,RRN,INT_REF,TERMINAL,TRTYPE,AMOUNT,CURRENCY,ORDER,TIMESTAMP,NONCE':
    ['ACTION','RC','APPROVAL','RRN','INT_REF','TERMINAL','TRTYPE','AMOUNT','CURRENCY','ORDER','TIMESTAMP','NONCE'],
  'Kina-new:      TERMINAL,TRTYPE,AMOUNT,CURRENCY,ORDER,ACTION,RC,APPROVAL,RRN,INT_REF,TIMESTAMP,NONCE':
    ['TERMINAL','TRTYPE','AMOUNT','CURRENCY','ORDER','ACTION','RC','APPROVAL','RRN','INT_REF','TIMESTAMP','NONCE'],
  'No-TRTYPE:     TERMINAL,ORDER,AMOUNT,CURRENCY,ACTION,RC,APPROVAL,RRN,INT_REF,TIMESTAMP,NONCE':
    ['TERMINAL','ORDER','AMOUNT','CURRENCY','ACTION','RC','APPROVAL','RRN','INT_REF','TIMESTAMP','NONCE'],
};

for (const [label, order] of Object.entries(orders)) {
  const mac = order.map(k => encodeField(actualData[k])).join('');
  const sign = crypto.createHmac('sha256', keyBuffer).update(mac, 'utf8').digest('hex').toUpperCase();
  console.log(label);
  console.log('  MAC:      ', mac);
  console.log('  Computed: ', sign);
  console.log('  Received: ', RECEIVED_P_SIGN);
  console.log('  Match:    ', sign === RECEIVED_P_SIGN ? '✅ YES' : '❌ NO');
  console.log('');
}
