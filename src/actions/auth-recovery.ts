"use server";

import crypto from "crypto";
import {
  directRecoverySchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSubmitSchema,
} from "@/lib/validations";
import {
  getAdminUserByRecoveryEmail,
  getFirstAdminUser,
  createPasswordResetRequest,
  getActivePasswordReset,
  incrementPasswordResetAttempts,
  savePasswordResetToken,
  getPasswordResetByToken,
  completePasswordReset,
} from "@/lib/db";
import {
  generateNumericOtp,
  hashOtp,
  verifyOtpHash,
  generateResetSessionToken,
} from "@/lib/auth/otp";
import { hashPassword } from "@/lib/auth/passwords";
import { clearSessionCookie } from "@/lib/auth";
import { sendEmail, buildPasswordResetEmailTemplate } from "@/lib/email/resend";

const GENERIC_FORGOT_PASSWORD_RESPONSE =
  "If this recovery email is registered to an administrator account, a 6-digit verification code has been sent.";

// In-memory rate limiting and lockout for Emergency Recovery Secret attempts
interface SecretAttemptRecord {
  failedAttempts: number;
  lockedUntil: number;
  lastAttempt: number;
}

const secretAttemptsMap = new Map<string, SecretAttemptRecord>();
const MAX_SECRET_ATTEMPTS = 5;
const SECRET_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout after 5 consecutive failures

function cleanOldAttemptRecords() {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [key, val] of secretAttemptsMap.entries()) {
    if (val.lastAttempt < oneHourAgo && val.lockedUntil < Date.now()) {
      secretAttemptsMap.delete(key);
    }
  }
}

/**
 * Constant-time comparison between user input and server-side secret
 */
function timingSafeSecretCompare(providedSecret: string, actualSecret: string): boolean {
  try {
    const hashProvided = crypto.createHash("sha256").update(providedSecret, "utf8").digest();
    const hashActual = crypto.createHash("sha256").update(actualSecret, "utf8").digest();
    return crypto.timingSafeEqual(hashProvided, hashActual);
  } catch {
    return false;
  }
}

/**
 * 1. Start Secure Direct Admin Recovery (Option A - Protected by ADMIN_RECOVERY_SECRET)
 * 
 * Validates the server-side emergency recovery secret using constant-time comparison,
 * enforces brute-force protection, generates a cryptographically secure 6-digit one-time code,
 * stores ONLY the SHA-256 hash in the database, and returns the one-time code ONLY to
 * the authorized administrator.
 */
export async function startAdminDirectRecoveryAction(formData: { recoverySecret: string }) {
  cleanOldAttemptRecords();

  const parsed = directRecoverySchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Emergency recovery secret is required.",
    };
  }

  const { recoverySecret } = parsed.data;

  // 1. FAIL-CLOSED: Reject if ADMIN_RECOVERY_SECRET is missing or empty
  // NO default fallback, NO fake secret, NO development bypass
  const expectedSecret = process.env.ADMIN_RECOVERY_SECRET;
  if (!expectedSecret || expectedSecret.trim().length === 0) {
    return {
      success: false,
      message: "Emergency recovery is disabled or not configured on this server.",
    };
  }

  try {
    const admin = await getFirstAdminUser();
    if (!admin || admin.status !== "active") {
      return {
        success: false,
        message: "No active administrator account was found.",
      };
    }

    // 2. Rate Limiting & Lockout Check
    const attemptRecord = secretAttemptsMap.get(admin.id);
    if (attemptRecord && attemptRecord.lockedUntil > Date.now()) {
      const remainingSeconds = Math.ceil((attemptRecord.lockedUntil - Date.now()) / 1000);
      const remainingMinutes = Math.ceil(remainingSeconds / 60);
      return {
        success: false,
        message: `Too many failed authorization attempts. Recovery is temporarily locked for ${remainingMinutes} minute(s).`,
      };
    }

    // 3. Timing-Safe Secret Verification
    const isSecretValid = timingSafeSecretCompare(recoverySecret, expectedSecret);
    if (!isSecretValid) {
      const currentRecord = attemptRecord || {
        failedAttempts: 0,
        lockedUntil: 0,
        lastAttempt: Date.now(),
      };
      currentRecord.failedAttempts += 1;
      currentRecord.lastAttempt = Date.now();

      if (currentRecord.failedAttempts >= MAX_SECRET_ATTEMPTS) {
        currentRecord.lockedUntil = Date.now() + SECRET_LOCKOUT_MS;
      }
      secretAttemptsMap.set(admin.id, currentRecord);

      // Artificial 500ms delay to mitigate timing analysis and automated brute force
      await new Promise((resolve) => setTimeout(resolve, 500));

      const remainingAttempts = Math.max(0, MAX_SECRET_ATTEMPTS - currentRecord.failedAttempts);
      if (remainingAttempts === 0) {
        return {
          success: false,
          message: "Maximum authorization attempts exceeded. Recovery is temporarily locked for 15 minutes.",
        };
      }
      return {
        success: false,
        message: `Invalid emergency recovery secret. ${remainingAttempts} attempt(s) remaining.`,
      };
    }

    // Reset failed secret attempts on successful authorization
    secretAttemptsMap.delete(admin.id);

    // 4. Check for active unexpired reset request cooldown (60s)
    const existingReset = await getActivePasswordReset({ adminId: admin.id });
    if (existingReset) {
      const now = Date.now();
      const resendAvailableTime = new Date(existingReset.resendAvailableAt).getTime();
      if (resendAvailableTime > now) {
        const remainingCooldown = Math.ceil((resendAvailableTime - now) / 1000);
        return {
          success: false,
          message: `Please wait ${remainingCooldown}s before generating another recovery code.`,
          cooldownSeconds: remainingCooldown,
        };
      }
    }

    // 5. Generate cryptographically secure 6-digit numeric recovery code
    const rawOtp = generateNumericOtp();
    const otpHash = hashOtp(rawOtp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const resendAvailableAt = new Date(Date.now() + 60 * 1000); // 60 seconds cooldown

    const resetRecord = await createPasswordResetRequest({
      adminId: admin.id,
      email: admin.recoveryEmail || "admin@portfolio.local",
      otpHash,
      expiresAt,
      resendAvailableAt,
    });

    return {
      success: true,
      message: "Emergency recovery authorized successfully.",
      recoveryCode: rawOtp, // Returned ONLY after successful secret authorization
      resetId: resetRecord?.id,
      cooldownSeconds: 60,
      expiresMinutes: 10,
    };
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred while processing recovery authorization.",
    };
  }
}

/**
 * 2. Request Password Reset via Email (Optional Resend integration)
 * Sends 6-digit OTP to recovery email registered in database.
 */
export async function requestPasswordResetAction(formData: { email: string }) {
  const parsed = forgotPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid recovery email address.",
    };
  }

  const cleanEmail = parsed.data.email.trim().toLowerCase();

  try {
    const admin = await getAdminUserByRecoveryEmail(cleanEmail);

    // Account enumeration protection: If email is not found, simulate realistic delay and return generic message
    if (!admin) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return {
        success: true,
        message: GENERIC_FORGOT_PASSWORD_RESPONSE,
        cooldownSeconds: 60,
      };
    }

    // Check for active unexpired reset request cooldown
    const existingReset = await getActivePasswordReset({ adminId: admin.id });
    if (existingReset) {
      const now = Date.now();
      const resendAvailableTime = new Date(existingReset.resendAvailableAt).getTime();
      if (resendAvailableTime > now) {
        const remainingCooldown = Math.ceil((resendAvailableTime - now) / 1000);
        return {
          success: true,
          message: GENERIC_FORGOT_PASSWORD_RESPONSE,
          resetId: existingReset.id,
          cooldownSeconds: remainingCooldown,
        };
      }
    }

    // Generate cryptographically secure 6-digit numeric OTP
    const rawOtp = generateNumericOtp();
    const otpHash = hashOtp(rawOtp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const resendAvailableAt = new Date(Date.now() + 60 * 1000); // 60 seconds cooldown

    const resetRecord = await createPasswordResetRequest({
      adminId: admin.id,
      email: admin.recoveryEmail,
      otpHash,
      expiresAt,
      resendAvailableAt,
    });

    // Send professional HTML email via Resend
    const { html, text } = buildPasswordResetEmailTemplate({
      otp: rawOtp,
      expiresMinutes: 10,
    });

    const emailResult = await sendEmail({
      to: admin.recoveryEmail,
      subject: "Shivam Patil Portfolio - Admin Password Reset Code",
      html,
      text,
    });

    if (!emailResult.success) {
      return {
        success: false,
        message:
          "Unable to deliver verification email at this time. Please try again later or verify email configuration.",
      };
    }

    return {
      success: true,
      message: GENERIC_FORGOT_PASSWORD_RESPONSE,
      resetId: resetRecord?.id,
      cooldownSeconds: 60,
    };
  } catch (err) {
    console.error("Password recovery request error");
    return {
      success: false,
      message: "An unexpected error occurred while processing your request.",
    };
  }
}

/**
 * 3. Verify 6-Digit OTP / Recovery Code
 * Validates recovery code against stored hash, tracks attempts, and issues a single-use reset authorization token.
 */
export async function verifyPasswordResetOtpAction(formData: {
  email?: string;
  otp: string;
  resetId?: string;
}) {
  const parsed = verifyOtpSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid verification parameters.",
    };
  }

  const cleanEmail = parsed.data.email ? parsed.data.email.trim().toLowerCase() : undefined;
  const cleanOtp = parsed.data.otp.trim();

  try {
    const resetRecord = await getActivePasswordReset({
      id: formData.resetId,
      email: cleanEmail,
    });

    if (!resetRecord) {
      return {
        success: false,
        message: "No active recovery session found. Please start a new recovery request.",
      };
    }

    // Check expiration (10 minutes)
    if (new Date(resetRecord.expiresAt).getTime() < Date.now()) {
      return {
        success: false,
        message: "Recovery code has expired. Please request a new code.",
      };
    }

    // Check attempt limit
    if (resetRecord.attempts >= resetRecord.maxAttempts) {
      return {
        success: false,
        message:
          "Maximum verification attempts exceeded. For security, this code is now invalid. Please request a new code.",
      };
    }

    // Increment attempts count
    const currentAttempts = await incrementPasswordResetAttempts(resetRecord.id);

    // Verify OTP hash with timing-safe comparison
    const isValid = verifyOtpHash(cleanOtp, resetRecord.otpHash);
    if (!isValid) {
      const remainingAttempts = Math.max(0, resetRecord.maxAttempts - currentAttempts);
      if (remainingAttempts === 0) {
        return {
          success: false,
          message:
            "Maximum verification attempts exceeded. For security, please request a new code.",
        };
      }
      return {
        success: false,
        message: `Invalid recovery code. ${remainingAttempts} attempt(s) remaining.`,
      };
    }

    // Generate single-use reset authorization token
    const resetToken = generateResetSessionToken();
    await savePasswordResetToken(resetRecord.id, resetToken);

    return {
      success: true,
      message: "Recovery code verified.",
      resetToken,
    };
  } catch (err) {
    console.error("Recovery code verification error");
    return {
      success: false,
      message: "An unexpected error occurred during code verification.",
    };
  }
}

/**
 * 4. Resend Recovery Code
 * Respects 60-second cooldown and generates fresh 6-digit recovery code.
 */
export async function resendPasswordResetOtpAction(formData: {
  email?: string;
  resetId?: string;
  recoverySecret?: string;
}) {
  if (formData.email && formData.email.trim().length > 0) {
    return requestPasswordResetAction({ email: formData.email });
  }
  if (formData.recoverySecret && formData.recoverySecret.trim().length > 0) {
    return startAdminDirectRecoveryAction({ recoverySecret: formData.recoverySecret });
  }
  return {
    success: false,
    message: "Emergency recovery secret is required to generate a new recovery code.",
  };
}

/**
 * 4. Reset Password
 * Hashes new password with 12-round bcrypt, updates database, invalidates reset tokens and active sessions.
 */
export async function resetPasswordAction(formData: {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const parsed = resetPasswordSubmitSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid password parameters.",
    };
  }

  const { resetToken, newPassword } = parsed.data;

  try {
    const resetRecord = await getPasswordResetByToken(resetToken);
    if (!resetRecord) {
      return {
        success: false,
        message:
          "Password reset authorization has expired or is invalid. Please restart the recovery process.",
      };
    }

    // Check expiration
    if (new Date(resetRecord.expiresAt).getTime() < Date.now()) {
      return {
        success: false,
        message: "Password reset authorization has expired. Please restart the recovery process.",
      };
    }

    // Hash new password using bcrypt (12 rounds)
    const newPasswordHash = await hashPassword(newPassword);

    // Complete reset: update password hash on admin_users, mark reset requests consumed
    await completePasswordReset(
      resetRecord.id,
      resetRecord.adminId,
      newPasswordHash
    );

    // Invalidate any existing authenticated session cookie
    await clearSessionCookie();

    return {
      success: true,
      message:
        "Password has been reset successfully! You can now sign in with your new credentials.",
    };
  } catch (err) {
    console.error("Password reset execution error");
    return {
      success: false,
      message: "An unexpected error occurred while updating your password.",
    };
  }
}
