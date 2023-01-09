const crypto = require("crypto");
function generateUniqueVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return hash;
}
module.exports = generateUniqueVerificationToken;