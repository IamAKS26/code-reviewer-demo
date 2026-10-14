// payment.js
const https = require("https");

// 1. Security issue: hardcoded API secret key
const PAYMENT_GATEWAY_API_KEY = "sk_live_9876543210abcdeffedcba";

// 2. Security issue: SQL injection vulnerability in transaction lookup
function getTransaction(db, transactionId) {
  const query = `SELECT * FROM transactions WHERE id = '${transactionId}' AND status = 'COMPLETED'`;
  return db.query(query);
}

// 3. Bug: Floating point precision issue for monetary calculations
function calculateTotalWithTax(amount, taxRate) {
  // Using direct floating-point multiplication causes precision errors with currency
  return amount + (amount * taxRate);
}

// 4. Reliability issue: Missing timeout and unhandled error events
async function processRefund(transactionId, amount) {
  const payload = JSON.stringify({ transactionId, amount });

  return new Promise((resolve, reject) => {
    const req = https.request("https://api.fakegateway.com/refund", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAYMENT_GATEWAY_API_KEY}`,
        "Content-Type": "application/json",
      },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        resolve(JSON.parse(data));
      });
    });

    // Missing req.on('error') and request timeout configuration
    req.write(payload);
    req.end();
  });
}

// 5. Security & Architecture: Insecure query and missing validation
function cancelSubscription(db, subscriptionId) {
  const query = `UPDATE subscriptions SET status = 'CANCELLED' WHERE id = '${subscriptionId}'`;
  return db.query(query);
}

module.exports = {
  getTransaction,
  calculateTotalWithTax,
  processRefund,
  cancelSubscription
};
