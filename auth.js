// auth.js
const crypto = require("crypto");

// 1. Security issue: hardcoded secret key
const JWT_SECRET = "super_secret_12345";

// 2. Bug & SQL Injection risk
function getUser(db, userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return db.query(query);
}

// 3. Performance issue: synchronous hashing in loop
function hashPasswords(passwords) {
  const hashes = [];
  for (let i = 0; i < passwords.length; i++) {
    const hash = crypto.pbkdf2Sync(passwords[i], 'salt', 100000, 64, 'sha512');
    hashes.push(hash.toString('hex'));
  }
  return hashes;
}

module.exports = { getUser, hashPasswords };