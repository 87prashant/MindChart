const crypto = require('crypto');
function generateUniqueUrl() {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return hash;
}
module.exports = generateUniqueUrl;