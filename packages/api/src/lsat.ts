import crypto from "crypto";

export function validatePreimage(preimage: string, paymentHash: string) {
  const hash = crypto.createHash("sha256").update(preimage).digest("hex");
  return hash === paymentHash;
}
