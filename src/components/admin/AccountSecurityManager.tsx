"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  User,
  KeyRound,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  RefreshCw,
  Clock,
  Send,
} from "lucide-react";
import {
  changeAdminIdAction,
  changeAdminPasswordAction,
  requestRecoveryEmailChangeAction,
  confirmRecoveryEmailChangeAction,
  resendRecoveryEmailChangeOtpAction,
} from "@/actions/account-security";

interface AccountSecurityManagerProps {
  currentUsername: string;
  currentRecoveryEmail?: string | null;
}

type TabType = "adminId" | "password" | "recoveryEmail";

export function AccountSecurityManager({
  currentUsername,
  currentRecoveryEmail,
}: AccountSecurityManagerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("adminId");

  // Admin ID state
  const [adminIdForm, setAdminIdForm] = useState({
    newUsername: "",
    currentPassword: "",
  });
  const [adminIdLoading, setAdminIdLoading] = useState(false);
  const [adminIdFeedback, setAdminIdFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Recovery Email state
  const [emailStep, setEmailStep] = useState<"request" | "verify" | "success">(
    "request"
  );
  const [emailForm, setEmailForm] = useState({
    currentPassword: "",
    newEmail: "",
  });
  const [verificationForm, setVerificationForm] = useState({
    otp: "",
    verificationId: "",
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);

  // Cooldown countdown
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Handler: Change Admin ID
  async function handleAdminIdSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAdminIdFeedback(null);
    setAdminIdLoading(true);

    try {
      const res = await changeAdminIdAction(adminIdForm);
      if (res.success) {
        setAdminIdFeedback({ type: "success", message: res.message });
        setAdminIdForm({ newUsername: "", currentPassword: "" });
      } else {
        setAdminIdFeedback({ type: "error", message: res.message });
      }
    } catch {
      setAdminIdFeedback({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setAdminIdLoading(false);
    }
  }

  // Handler: Change Password
  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordFeedback(null);
    setPasswordLoading(true);

    try {
      const res = await changeAdminPasswordAction(passwordForm);
      if (res.success) {
        setPasswordFeedback({ type: "success", message: res.message });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordFeedback({ type: "error", message: res.message });
      }
    } catch {
      setPasswordFeedback({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setPasswordLoading(false);
    }
  }

  // Handler: Request Recovery Email Change
  async function handleRequestEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailFeedback(null);
    setEmailLoading(true);

    try {
      const res = await requestRecoveryEmailChangeAction(emailForm);
      if (res.success) {
        setEmailFeedback({ type: "success", message: res.message });
        if (res.verificationId) {
          setVerificationForm((prev) => ({
            ...prev,
            verificationId: res.verificationId!,
          }));
        }
        if (res.cooldownSeconds) {
          setCooldownSeconds(res.cooldownSeconds);
        }
        setEmailStep("verify");
      } else {
        setEmailFeedback({ type: "error", message: res.message });
      }
    } catch {
      setEmailFeedback({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setEmailLoading(false);
    }
  }

  // Handler: Confirm Email Verification OTP
  async function handleConfirmEmailOtp(e: React.FormEvent) {
    e.preventDefault();
    setEmailFeedback(null);
    setEmailLoading(true);

    try {
      const res = await confirmRecoveryEmailChangeAction({
        newEmail: emailForm.newEmail,
        otp: verificationForm.otp,
        verificationId: verificationForm.verificationId,
      });

      if (res.success) {
        setConfirmedEmail(res.newEmail || emailForm.newEmail);
        setEmailFeedback({ type: "success", message: res.message });
        setEmailStep("success");
      } else {
        setEmailFeedback({ type: "error", message: res.message });
      }
    } catch {
      setEmailFeedback({
        type: "error",
        message: "An unexpected error occurred during verification.",
      });
    } finally {
      setEmailLoading(false);
    }
  }

  // Handler: Resend Email Verification OTP
  async function handleResendEmailOtp() {
    if (cooldownSeconds > 0) return;
    setEmailFeedback(null);
    setEmailLoading(true);

    try {
      const res = await resendRecoveryEmailChangeOtpAction({
        newEmail: emailForm.newEmail,
        verificationId: verificationForm.verificationId,
      });

      if (res.success) {
        setEmailFeedback({ type: "success", message: res.message });
        if (res.cooldownSeconds) {
          setCooldownSeconds(res.cooldownSeconds);
        }
      } else {
        setEmailFeedback({ type: "error", message: res.message });
      }
    } catch {
      setEmailFeedback({
        type: "error",
        message: "Failed to resend code. Please try again.",
      });
    } finally {
      setEmailLoading(false);
    }
  }

  // Mask email helper
  function maskEmail(email?: string | null): string {
    if (!email || !email.includes("@")) return "Not Configured";
    const [local, domain] = email.split("@");
    if (!local || !domain) return "Not Configured";
    const firstChar = local.charAt(0);
    return `${firstChar}•••@${domain}`;
  }

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/25 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#261c17] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#faf7f2]">
              Account Security Management
            </h2>
            <p className="text-xs font-mono text-[#a39687]">
              Manage Admin ID, update password, and verify recovery email
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#140f0d] border border-[#2d221c] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab("adminId");
              setAdminIdFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "adminId"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                : "text-[#8f8072] hover:text-[#faf7f2]"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Admin ID</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("password");
              setPasswordFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "password"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                : "text-[#8f8072] hover:text-[#faf7f2]"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Password</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("recoveryEmail");
              setEmailFeedback(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "recoveryEmail"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                : "text-[#8f8072] hover:text-[#faf7f2]"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Recovery Email</span>
          </button>
        </div>
      </div>

      {/* TAB A: ADMIN ID CHANGE */}
      {activeTab === "adminId" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#140f0d] border border-[#261c17] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-[#8f8072] block">Current Admin ID</span>
              <span className="text-base font-bold text-amber-400">
                {currentUsername}
              </span>
            </div>
            <span className="text-[11px] text-[#6e6357] max-w-sm">
              Changing your Admin ID updates your login handle. Existing sessions remain valid.
            </span>
          </div>

          {adminIdFeedback && (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 text-xs font-mono ${
                adminIdFeedback.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              {adminIdFeedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              )}
              <span>{adminIdFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleAdminIdSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-[#cfc5b8] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>New Admin ID (Username)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin_shivam"
                  value={adminIdForm.newUsername}
                  onChange={(e) =>
                    setAdminIdForm({ ...adminIdForm, newUsername: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140f0d] border border-[#2d221c] text-[#faf7f2] placeholder-[#6e6357] text-xs font-mono focus:border-amber-500/60 focus:outline-none transition-colors"
                />
                <p className="text-[10px] font-mono text-[#6e6357]">
                  3–32 characters (letters, numbers, hyphens, underscores)
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-[#cfc5b8] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Current Password Verification</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={adminIdForm.currentPassword}
                  onChange={(e) =>
                    setAdminIdForm({
                      ...adminIdForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140f0d] border border-[#2d221c] text-[#faf7f2] placeholder-[#6e6357] text-xs font-mono focus:border-amber-500/60 focus:outline-none transition-colors"
                />
                <p className="text-[10px] font-mono text-[#6e6357]">
                  Required to authorize identifier change
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={
                  adminIdLoading ||
                  !adminIdForm.newUsername ||
                  !adminIdForm.currentPassword
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-mono font-bold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-amber-500/10"
              >
                {adminIdLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating Admin ID...</span>
                  </>
                ) : (
                  <>
                    <span>Save New Admin ID</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB B: PASSWORD ROTATION */}
      {activeTab === "password" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#140f0d] border border-[#261c17] flex items-start gap-3 text-xs font-mono">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <p className="text-amber-300 font-semibold">
                Session Revocation Policy
              </p>
              <p className="text-[11px] text-[#8f8072] mt-0.5">
                Updating your password increments the account security version and immediately invalidates all active sessions on other devices and browsers.
              </p>
            </div>
          </div>

          {passwordFeedback && (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 text-xs font-mono ${
                passwordFeedback.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              {passwordFeedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              )}
              <span>{passwordFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-[#cfc5b8] flex items-center justify-between">
                  <span>Current Password</span>
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        current: !showPassword.current,
                      })
                    }
                    className="text-[#8f8072] hover:text-amber-400 cursor-pointer"
                  >
                    {showPassword.current ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </label>
                <input
                  type={showPassword.current ? "text" : "password"}
                  required
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140f0d] border border-[#2d221c] text-[#faf7f2] placeholder-[#6e6357] text-xs font-mono focus:border-amber-500/60 focus:outline-none transition-colors"
                />
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-[#cfc5b8] flex items-center justify-between">
                  <span>New Password</span>
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        new: !showPassword.new,
                      })
                    }
                    className="text-[#8f8072] hover:text-amber-400 cursor-pointer"
                  >
                    {showPassword.new ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </label>
                <input
                  type={showPassword.new ? "text" : "password"}
                  required
                  placeholder="Min. 8 chars, 1 uppercase, 1 number"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140f0d] border border-[#2d221c] text-[#faf7f2] placeholder-[#6e6357] text-xs font-mono focus:border-amber-500/60 focus:outline-none transition-colors"
                />
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-[#cfc5b8] flex items-center justify-between">
                  <span>Confirm New Password</span>
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirm: !showPassword.confirm,
                      })
                    }
                    className="text-[#8f8072] hover:text-amber-400 cursor-pointer"
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </label>
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  required
                  placeholder="Re-enter new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#140f0d] border border-[#2d221c] text-[#faf7f2] placeholder-[#6e6357] text-xs font-mono focus:border-amber-500/60 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={
                  passwordLoading ||
                  !passwordForm.currentPassword ||
                  !passwordForm.newPassword ||
                  !passwordForm.confirmPassword
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-mono font-bold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-amber-500/10"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Update Password</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB C: RECOVERY EMAIL CHANGE WITH VERIFICATION */}
      {activeTab === "recoveryEmail" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#140f0d] border border-[#261c17] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-[#8f8072] block">Current Active Recovery Email</span>
              <span className="text-base font-bold text-blue-400">
                {confirmedEmail || maskEmail(currentRecoveryEmail)}
              </span>
            </div>
            <span className="text-[11px] text-[#6e6357] max-w-sm">
              Your recovery email receives emergency 6-digit OTP verification codes during password recovery. A verification code must be confirmed before any changes take effect.
            </span>
          </div>

          {emailFeedback && (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 text-xs font-mono ${
                emailFeedback.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              {emailFeedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              )}
              <span>{emailFeedback.message}</span>
            </div>
          )}

          {/* Step 1: Request New Email */}
          {emailStep === "request" && (
            <form onSubmit={handleRequestEmailSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-[#cfc5b8] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>New Recovery Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@example.com"
                    value={emailForm.newEmail}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, newEmail: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140f0d] border border-[#2d221c] text-[#faf7f2] placeholder-[#6e6357] text-xs font-mono focus:border-amber-500/60 focus:outline-none transition-colors"
                  />
                  <p className="text-[10px] font-mono text-[#6e6357]">
                    A 6-digit verification code will be sent to this address
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-[#cfc5b8] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Current Password Verification</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={emailForm.currentPassword}
                    onChange={(e) =>
                      setEmailForm({
                        ...emailForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#140f0d] border border-[#2d221c] text-[#faf7f2] placeholder-[#6e6357] text-xs font-mono focus:border-amber-500/60 focus:outline-none transition-colors"
                  />
                  <p className="text-[10px] font-mono text-[#6e6357]">
                    Required to authorize verification code dispatch
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={
                    emailLoading ||
                    !emailForm.newEmail ||
                    !emailForm.currentPassword
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-mono font-bold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  {emailLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Verification Code...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Verification Code</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Verify OTP Code */}
          {emailStep === "verify" && (
            <form onSubmit={handleConfirmEmailOtp} className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#140f0d] border border-blue-500/20 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-blue-400 font-semibold block">
                    Verification Code Sent
                  </span>
                  <p className="text-xs font-mono text-[#faf7f2] mt-0.5">
                    We sent a 6-digit code to{" "}
                    <strong className="text-amber-400 font-semibold">
                      {emailForm.newEmail}
                    </strong>
                  </p>
                  <p className="text-[10px] font-mono text-[#8f8072] mt-1">
                    Valid for 10 minutes • Max 5 attempts
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEmailStep("request");
                    setEmailFeedback(null);
                  }}
                  className="text-xs font-mono text-[#8f8072] hover:text-[#faf7f2] underline cursor-pointer"
                >
                  Change Email
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold text-[#cfc5b8] flex items-center justify-between">
                  <span>6-Digit Verification Code</span>
                  {cooldownSeconds > 0 ? (
                    <span className="text-[10px] font-mono text-[#8f8072] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Resend available in{" "}
                      {cooldownSeconds}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendEmailOtp}
                      disabled={emailLoading}
                      className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Resend Code
                    </button>
                  )}
                </label>

                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={verificationForm.otp}
                  onChange={(e) =>
                    setVerificationForm({
                      ...verificationForm,
                      otp: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#140f0d] border border-[#2d221c] text-[#faf7f2] text-center font-mono text-xl tracking-[0.4em] focus:border-amber-500/60 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmailStep("request");
                    setEmailFeedback(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#140f0d] border border-[#261c17] text-xs font-mono text-[#8f8072] hover:text-[#faf7f2] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    emailLoading || verificationForm.otp.length !== 6
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-mono font-bold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  {emailLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Update Recovery Email</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success Confirmation */}
          {emailStep === "success" && (
            <div className="p-6 rounded-2xl bg-[#140f0d] border border-emerald-500/30 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#faf7f2]">
                Recovery Email Verified & Activated
              </h3>
              <p className="text-xs font-mono text-[#8f8072] max-w-md mx-auto">
                Your portfolio administrator recovery address is now set to{" "}
                <strong className="text-emerald-400">{confirmedEmail}</strong>. All future emergency recovery OTPs will be dispatched exclusively to this address.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmailStep("request");
                    setEmailForm({ currentPassword: "", newEmail: "" });
                    setVerificationForm({ otp: "", verificationId: "" });
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1f1713] border border-[#3b2d24] text-xs font-mono text-amber-300 hover:text-amber-200 cursor-pointer"
                >
                  Update Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
