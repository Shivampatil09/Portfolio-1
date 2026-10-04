import crypto from "crypto";

/**
 * Generates a cryptographically secure 6-digit numeric OTP (100000 - 999999).
 */
export function generateNumericOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Computes a secure SHA-256 hash of the OTP for storage.
 * Plaintext OTPs are NEVER stored in the database.
 */
export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp.trim()).digest("hex");
}

/**
 * Verifies an entered OTP against a stored SHA-256 hash using constant-time comparison
 * to eliminate timing attack vulnerabilities.
 */
export function verifyOtpHash(enteredOtp: string, storedHash: string): boolean {
  if (!enteredOtp || !storedHash) return false;
  const cleanEntered = enteredOtp.trim();
  if (!/^\d{6}$/.test(cleanEntered)) return false;

  const enteredHash = hashOtp(cleanEntered);
  if (enteredHash.length !== storedHash.length) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(enteredHash, "utf8"),
      Buffer.from(storedHash, "utf8")
    );
  } catch {
    return false;
  }
}

/**
 * Generates a secure random 64-character hex token used as proof of OTP verification
 * to authorize the password reset step.
 */
export function generateResetSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
