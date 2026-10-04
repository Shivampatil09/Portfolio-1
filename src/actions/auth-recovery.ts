"use server";

import {
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSubmitSchema,
} from "@/lib/validations";
import {
  getAdminUserByRecoveryEmail,
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

/**
 * 1. Request Password Reset via Recovery Email
 * Compares entered recovery email with admin's stored email in database.
 * If matched, generates cryptographically secure 6-digit OTP, stores SHA-256 hash in DB,
 * and sends the OTP to the admin recovery email via Resend.
 */
export async function requestPasswordResetAction(formData: { email: string }) {
  const parsed = forgotPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Please provide a valid recovery email address.",
    };
  }

  const cleanEmail = parsed.data.email.trim().toLowerCase();

  try {
    const admin = await getAdminUserByRecoveryEmail(cleanEmail);

    if (!admin || admin.status !== "active") {
      return {
        success: false,
        message: "No active administrator account is registered with this recovery email address.",
      };
    }

    // Check for active unexpired reset request cooldown (60s)
    const existingReset = await getActivePasswordReset({ adminId: admin.id });
    if (existingReset) {
      const now = Date.now();
      const resendAvailableTime = new Date(existingReset.resendAvailableAt).getTime();
      if (resendAvailableTime > now) {
        const remainingCooldown = Math.ceil((resendAvailableTime - now) / 1000);
        return {
          success: false,
          message: `Please wait ${remainingCooldown}s before requesting another verification code.`,
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
          "Unable to send verification email. Please check email service configuration or try again later.",
      };
    }

    return {
      success: true,
      message: `A 6-digit verification code has been sent to ${admin.recoveryEmail}.`,
      resetId: resetRecord?.id,
      cooldownSeconds: 60,
    };
  } catch (err) {
    console.error("Password recovery request error");
    return {
      success: false,
      message: "An unexpected error occurred while processing your recovery request.",
    };
  }
}

/**
 * 2. Verify 6-Digit OTP Code
 * Validates entered OTP against stored SHA-256 hash using timing-safe comparison,
 * tracks attempt limit (max 5), checks expiration (10 min), and issues single-use resetToken.
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

    // Check attempt limit (max 5)
    if (resetRecord.attempts >= resetRecord.maxAttempts) {
      return {
        success: false,
        message:
          "Maximum verification attempts exceeded. For security, this code is now invalid. Please request a new code.",
      };
    }

    // Increment attempts count in database
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
        message: `Invalid verification code. ${remainingAttempts} attempt(s) remaining.`,
      };
    }

    // Generate single-use reset authorization token
    const resetToken = generateResetSessionToken();
    await savePasswordResetToken(resetRecord.id, resetToken);

    return {
      success: true,
      message: "Verification code confirmed successfully.",
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
 * 3. Resend Recovery OTP Code
 * Enforces 60-second cooldown and resends fresh 6-digit code to recovery email.
 */
export async function resendPasswordResetOtpAction(formData: {
  email: string;
  resetId?: string;
}) {
  if (!formData.email || formData.email.trim().length === 0) {
    return {
      success: false,
      message: "Recovery email address is required to resend verification code.",
    };
  }
  return requestPasswordResetAction({ email: formData.email });
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

    // Complete reset: update password hash on admin_users, increment tokenVersion, mark reset record consumed
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
