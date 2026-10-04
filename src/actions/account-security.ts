"use server";

import {
  changeAdminIdSchema,
  changePasswordSchema,
  requestEmailChangeSchema,
  verifyEmailChangeOtpSchema,
} from "@/lib/validations";
import {
  getAdminUserById,
  getAdminUserByUsername,
  updateAdminUsername,
  updateAdminPassword,
  createEmailVerificationRequest,
  getActiveEmailVerification,
  incrementEmailVerificationAttempts,
  confirmEmailVerification,
  invalidateEmailVerification,
} from "@/lib/db";
import {
  getSession,
  verifyPassword,
  hashPassword,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth";
import {
  generateNumericOtp,
  hashOtp,
  verifyOtpHash,
} from "@/lib/auth/otp";
import { sendEmail, buildEmailVerificationTemplate } from "@/lib/email/resend";
import { revalidatePath } from "next/cache";

/**
 * 1. Change Admin ID (Username)
 * Requires verification of current password.
 * Updates unique handle and refreshes active session token.
 */
export async function changeAdminIdAction(formData: {
  currentPassword?: string;
  newUsername?: string;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized. Please log in again." };
  }

  const parsed = changeAdminIdSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid Admin ID parameters.",
    };
  }

  const { currentPassword, newUsername } = parsed.data;
  const cleanNewUsername = newUsername.trim();

  try {
    const user = session.adminId
      ? await getAdminUserById(session.adminId)
      : await getAdminUserByUsername(session.username);

    if (!user) {
      return { success: false, message: "Admin account could not be found." };
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, message: "Incorrect current password." };
    }

    if (user.username.toLowerCase() === cleanNewUsername.toLowerCase()) {
      return {
        success: false,
        message: "New Admin ID must be different from current Admin ID.",
      };
    }

    // Check if new username is already taken by another account
    const existing = await getAdminUserByUsername(cleanNewUsername);
    if (existing && existing.id !== user.id) {
      return {
        success: false,
        message: `Admin ID "${cleanNewUsername}" is already in use. Please choose another.`,
      };
    }

    // Update username in database
    await updateAdminUsername(user.id, cleanNewUsername);

    // Refresh active session token with new username
    const updatedSession = {
      adminId: user.id,
      username: cleanNewUsername,
      role: session.role || "admin",
      tokenVersion: user.tokenVersion ?? 1,
    };
    const newToken = await createSessionToken(updatedSession);
    await setSessionCookie(newToken);

    revalidatePath("/admin/settings");
    revalidatePath("/admin", "layout");

    return {
      success: true,
      message: `Admin ID successfully updated to "${cleanNewUsername}".`,
      newUsername: cleanNewUsername,
    };
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred while updating Admin ID.",
    };
  }
}

/**
 * 2. Change Password
 * Requires verification of current password.
 * Hashes new password with 12-round bcrypt and revokes sessions on all other devices.
 */
export async function changeAdminPasswordAction(formData: {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized. Please log in again." };
  }

  const parsed = changePasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid password parameters.",
    };
  }

  const { currentPassword, newPassword } = parsed.data;

  try {
    const user = session.adminId
      ? await getAdminUserById(session.adminId)
      : await getAdminUserByUsername(session.username);

    if (!user) {
      return { success: false, message: "Admin account could not be found." };
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, message: "Incorrect current password." };
    }

    // Hash new password using bcrypt (12 rounds)
    const newPasswordHash = await hashPassword(newPassword);

    // Update password in DB and increment tokenVersion (revoking other active sessions)
    const newTokenVersion = await updateAdminPassword(user.id, newPasswordHash);

    // Issue refreshed session cookie for the CURRENT active browser session
    const refreshedSession = {
      adminId: user.id,
      username: user.username,
      role: session.role || "admin",
      tokenVersion: newTokenVersion,
    };
    const newToken = await createSessionToken(refreshedSession);
    await setSessionCookie(newToken);

    revalidatePath("/admin/settings");

    return {
      success: true,
      message:
        "Password updated successfully! All other active device sessions have been invalidated.",
    };
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred while changing password.",
    };
  }
}

/**
 * 3. Request Recovery Email Change
 * Requires verification of current password.
 * Generates 6-digit verification code and sends to the NEW email address.
 * The old recovery email remains active until verification is completed.
 */
export async function requestRecoveryEmailChangeAction(formData: {
  currentPassword?: string;
  newEmail?: string;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized. Please log in again." };
  }

  const parsed = requestEmailChangeSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid email parameters.",
    };
  }

  const { currentPassword, newEmail } = parsed.data;
  const cleanNewEmail = newEmail.trim().toLowerCase();

  try {
    const user = session.adminId
      ? await getAdminUserById(session.adminId)
      : await getAdminUserByUsername(session.username);

    if (!user) {
      return { success: false, message: "Admin account could not be found." };
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, message: "Incorrect current password." };
    }

    if (user.recoveryEmail.toLowerCase() === cleanNewEmail) {
      return {
        success: false,
        message: "New recovery email is already set as your active recovery email.",
      };
    }

    // Check cooldown on existing active unconsumed request
    const existing = await getActiveEmailVerification({
      adminId: user.id,
      newEmail: cleanNewEmail,
    });
    if (existing) {
      const now = Date.now();
      const resendAvailableTime = new Date(existing.resendAvailableAt).getTime();
      if (resendAvailableTime > now) {
        const remainingCooldown = Math.ceil((resendAvailableTime - now) / 1000);
        return {
          success: true,
          message: `Verification code was already sent to ${cleanNewEmail}.`,
          verificationId: existing.id,
          cooldownSeconds: remainingCooldown,
        };
      }
    }

    // Generate cryptographically secure 6-digit numeric OTP
    const rawOtp = generateNumericOtp();
    const otpHash = hashOtp(rawOtp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const resendAvailableAt = new Date(Date.now() + 60 * 1000); // 60s cooldown

    const verificationRecord = await createEmailVerificationRequest({
      adminId: user.id,
      newEmail: cleanNewEmail,
      otpHash,
      expiresAt,
      resendAvailableAt,
    });

    // Send verification email to the NEW email address via Resend
    const { html, text } = buildEmailVerificationTemplate({
      otp: rawOtp,
      expiresMinutes: 10,
    });

    const emailResult = await sendEmail({
      to: cleanNewEmail,
      subject: "Shivam Patil Portfolio - Verify New Recovery Email",
      html,
      text,
    });

    if (!emailResult.success) {
      if (verificationRecord?.id) {
        await invalidateEmailVerification(verificationRecord.id);
      }
      return {
        success: false,
        message: "Unable to send the verification email. Please try again.",
      };
    }

    return {
      success: true,
      message: `A 6-digit confirmation code was sent to ${cleanNewEmail}.`,
      verificationId: verificationRecord?.id,
      cooldownSeconds: 60,
    };
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred while requesting email update.",
    };
  }
}

/**
 * 4. Confirm Recovery Email Change OTP
 * Validates OTP against stored hash, increments attempt counters,
 * and updates `admin_users.recovery_email` upon success.
 */
export async function confirmRecoveryEmailChangeAction(formData: {
  newEmail?: string;
  otp?: string;
  verificationId?: string;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized. Please log in again." };
  }

  const parsed = verifyEmailChangeOtpSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid verification parameters.",
    };
  }

  const { newEmail, otp, verificationId } = parsed.data;
  const cleanNewEmail = newEmail.trim().toLowerCase();
  const cleanOtp = otp.trim();

  try {
    const user = session.adminId
      ? await getAdminUserById(session.adminId)
      : await getAdminUserByUsername(session.username);

    if (!user) {
      return { success: false, message: "Admin account could not be found." };
    }

    const verificationRecord = await getActiveEmailVerification({
      id: verificationId,
      adminId: user.id,
      newEmail: cleanNewEmail,
    });

    if (!verificationRecord) {
      return {
        success: false,
        message: "No active verification request found for this email address.",
      };
    }

    // Check expiration (10 min)
    if (new Date(verificationRecord.expiresAt).getTime() < Date.now()) {
      return {
        success: false,
        message: "Verification code has expired. Please request a new code.",
      };
    }

    // Check max attempts
    if (verificationRecord.attempts >= verificationRecord.maxAttempts) {
      return {
        success: false,
        message:
          "Maximum verification attempts exceeded. For security, this code is now invalid. Please request a new code.",
      };
    }

    // Increment attempts
    const currentAttempts = await incrementEmailVerificationAttempts(verificationRecord.id);

    // Timing-safe OTP hash comparison
    const isValid = verifyOtpHash(cleanOtp, verificationRecord.otpHash);
    if (!isValid) {
      const remaining = Math.max(0, verificationRecord.maxAttempts - currentAttempts);
      if (remaining === 0) {
        return {
          success: false,
          message:
            "Maximum verification attempts exceeded. For security, please request a new code.",
        };
      }
      return {
        success: false,
        message: `Invalid verification code. ${remaining} attempt(s) remaining.`,
      };
    }

    // Confirm email verification and update admin recovery email
    await confirmEmailVerification(
      verificationRecord.id,
      user.id,
      cleanNewEmail
    );

    revalidatePath("/admin/settings");

    return {
      success: true,
      message: `Recovery email successfully changed to ${cleanNewEmail}.`,
      newEmail: cleanNewEmail,
    };
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred during email verification.",
    };
  }
}

/**
 * 5. Resend Recovery Email Verification OTP
 */
export async function resendRecoveryEmailChangeOtpAction(formData: {
  newEmail?: string;
  verificationId?: string;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized. Please log in again." };
  }

  const cleanEmail = formData.newEmail?.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, message: "New email address is required." };
  }

  try {
    const user = session.adminId
      ? await getAdminUserById(session.adminId)
      : await getAdminUserByUsername(session.username);

    if (!user) {
      return { success: false, message: "Admin account could not be found." };
    }

    const existing = await getActiveEmailVerification({
      id: formData.verificationId,
      adminId: user.id,
      newEmail: cleanEmail,
    });

    if (existing) {
      const now = Date.now();
      const resendAvailableTime = new Date(existing.resendAvailableAt).getTime();
      if (resendAvailableTime > now) {
        const remainingCooldown = Math.ceil((resendAvailableTime - now) / 1000);
        return {
          success: false,
          message: `Please wait ${remainingCooldown}s before requesting a new verification code.`,
          cooldownSeconds: remainingCooldown,
        };
      }
    }

    // Generate new OTP and send
    const rawOtp = generateNumericOtp();
    const otpHash = hashOtp(rawOtp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const resendAvailableAt = new Date(Date.now() + 60 * 1000);

    const record = await createEmailVerificationRequest({
      adminId: user.id,
      newEmail: cleanEmail,
      otpHash,
      expiresAt,
      resendAvailableAt,
    });

    const { html, text } = buildEmailVerificationTemplate({
      otp: rawOtp,
      expiresMinutes: 10,
    });

    const emailResult = await sendEmail({
      to: cleanEmail,
      subject: "Shivam Patil Portfolio - Verify New Recovery Email (Resent)",
      html,
      text,
    });

    if (!emailResult.success) {
      if (record?.id) {
        await invalidateEmailVerification(record.id);
      }
      return {
        success: false,
        message: "Unable to send the verification email. Please try again.",
      };
    }

    return {
      success: true,
      message: `A new 6-digit confirmation code was sent to ${cleanEmail}.`,
      verificationId: record?.id,
      cooldownSeconds: 60,
    };
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred while resending the code.",
    };
  }
}
