import crypto from "crypto";

function getVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return hash;
}

export default getVerificationToken;
