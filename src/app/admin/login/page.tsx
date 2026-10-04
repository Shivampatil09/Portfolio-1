"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Lock,
  User,
  KeyRound,
  Loader2,
  ShieldCheck,
  Mail,
  ArrowLeft,
  CheckCircle2,
  RotateCw,
  Key,
  Send,
} from "lucide-react";
import {
  adminLoginSchema,
  AdminLoginData,
  forgotPasswordSchema,
  ForgotPasswordData,
  verifyOtpSchema,
  VerifyOtpData,
  resetPasswordSubmitSchema,
  ResetPasswordSubmitData,
} from "@/lib/validations";
import { loginAdminAction } from "@/actions/admin";
import {
  requestPasswordResetAction,
  verifyPasswordResetOtpAction,
  resendPasswordResetOtpAction,
  resetPasswordAction,
} from "@/actions/auth-recovery";

type AuthMode = "login" | "forgot" | "otp" | "reset" | "success";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recoveryEmail, setRecoveryEmail] = useState<string>("");
  const [activeResetId, setActiveResetId] = useState<string | undefined>(undefined);
  const [verifiedResetToken, setVerifiedResetToken] = useState<string>("");
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
  const [isResending, setIsResending] = useState<boolean>(false);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // 1. Login Form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoggingIn },
  } = useForm<AdminLoginData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { username: "", password: "" },
  });

  // 2. Forgot Password (Email) Form
  const {
    register: forgotRegister,
    handleSubmit: handleForgotSubmit,
    reset: resetForgotForm,
    formState: { errors: forgotErrors, isSubmitting: isSendingEmail },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // 3. OTP Verification Form
  const {
    register: otpRegister,
    handleSubmit: handleOtpSubmit,
    setValue: setOtpValue,
    reset: resetOtpForm,
    formState: { errors: otpErrors, isSubmitting: isVerifyingOtp },
  } = useForm<VerifyOtpData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email: "", otp: "", resetId: "" },
  });

  // 4. Reset Password Form
  const {
    register: resetRegister,
    handleSubmit: handleResetSubmit,
    setValue: setResetValue,
    reset: resetPasswordForm,
    formState: { errors: resetErrors, isSubmitting: isResettingPassword },
  } = useForm<ResetPasswordSubmitData>({
    resolver: zodResolver(resetPasswordSubmitSchema),
    defaultValues: { resetToken: "", newPassword: "", confirmPassword: "" },
  });

  // Handler: Login
  const onLoginSubmit = async (data: AdminLoginData) => {
    setErrorMsg(null);
    try {
      const res = await loginAdminAction(data);
      if (res.success) {
        toast.success("Welcome back, Shivam!", {
          description: "Authenticated successfully into Admin CMS.",
        });
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setErrorMsg(res.message);
        toast.error("Authentication Failed", { description: res.message });
      }
    } catch {
      setErrorMsg("An unexpected login error occurred. Please try again.");
    }
  };

  // Handler: Request Recovery OTP via Email
  const onForgotSubmit = async (data: ForgotPasswordData) => {
    setErrorMsg(null);
    try {
      const cleanEmail = data.email.trim().toLowerCase();
      const res = await requestPasswordResetAction({ email: cleanEmail });

      if (res.success) {
        setRecoveryEmail(cleanEmail);
        setActiveResetId(res.resetId);
        setOtpValue("email", cleanEmail);
        setOtpValue("resetId", res.resetId || "");
        setCooldownSeconds(res.cooldownSeconds || 60);
        setMode("otp");
        toast.success("Verification Code Sent", {
          description: res.message,
        });
      } else {
        setErrorMsg(res.message);
        toast.error("Request Failed", { description: res.message });
      }
    } catch {
      setErrorMsg("An unexpected error occurred while sending the verification code.");
    }
  };

  // Handler: Verify OTP
  const onOtpSubmit = async (data: VerifyOtpData) => {
    setErrorMsg(null);
    try {
      const res = await verifyPasswordResetOtpAction({
        email: recoveryEmail || data.email,
        otp: data.otp.trim(),
        resetId: activeResetId || data.resetId,
      });

      if (res.success && res.resetToken) {
        setVerifiedResetToken(res.resetToken);
        setResetValue("resetToken", res.resetToken);
        setMode("reset");
        toast.success("Code Confirmed", {
          description: "Please create your new password.",
        });
      } else {
        setErrorMsg(res.message);
        toast.error("Verification Failed", { description: res.message });
      }
    } catch {
      setErrorMsg("An unexpected verification error occurred.");
    }
  };

  // Handler: Resend OTP
  const handleResendOtp = async () => {
    if (cooldownSeconds > 0 || !recoveryEmail) return;
    setErrorMsg(null);
    setIsResending(true);
    try {
      const res = await resendPasswordResetOtpAction({
        email: recoveryEmail,
        resetId: activeResetId,
      });

      if (res.success) {
        setActiveResetId(res.resetId);
        setOtpValue("resetId", res.resetId || "");
        setCooldownSeconds(res.cooldownSeconds || 60);
        toast.success("New Code Sent", { description: res.message });
      } else {
        setErrorMsg(res.message);
        toast.error("Resend Failed", { description: res.message });
      }
    } catch {
      setErrorMsg("An unexpected error occurred while resending the code.");
    } finally {
      setIsResending(false);
    }
  };

  // Handler: Submit New Password
  const onResetSubmit = async (data: ResetPasswordSubmitData) => {
    setErrorMsg(null);
    const token = data.resetToken || verifiedResetToken;
    if (!token) {
      setErrorMsg("Reset authorization session is missing or expired. Please restart recovery.");
      toast.error("Reset Failed", { description: "Missing reset authorization token." });
      return;
    }

    try {
      const res = await resetPasswordAction({
        resetToken: token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      if (res.success) {
        resetForgotForm({ email: "" });
        resetOtpForm({ email: "", otp: "", resetId: "" });
        resetPasswordForm({ resetToken: "", newPassword: "", confirmPassword: "" });
        setMode("success");
        toast.success("Password Updated", { description: res.message });
      } else {
        setErrorMsg(res.message);
        toast.error("Reset Failed", { description: res.message });
      }
    } catch {
      setErrorMsg("An unexpected error occurred while resetting password.");
    }
  };

  const resetToLogin = () => {
    setErrorMsg(null);
    resetForgotForm({ email: "" });
    resetOtpForm({ email: "", otp: "", resetId: "" });
    resetPasswordForm({ resetToken: "", newPassword: "", confirmPassword: "" });
    setRecoveryEmail("");
    setActiveResetId(undefined);
    setVerifiedResetToken("");
    setMode("login");
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8 glass-card p-8 sm:p-10 rounded-3xl border border-amber-500/25 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            {mode === "login" && <Lock className="w-7 h-7" />}
            {mode === "forgot" && <Mail className="w-7 h-7" />}
            {mode === "otp" && <KeyRound className="w-7 h-7" />}
            {mode === "reset" && <Key className="w-7 h-7" />}
            {mode === "success" && <CheckCircle2 className="w-7 h-7 text-emerald-400" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#faf7f2]">
              {mode === "login" && "Admin Portal"}
              {mode === "forgot" && "Forgot Password"}
              {mode === "otp" && "Verify Email Code"}
              {mode === "reset" && "Create New Password"}
              {mode === "success" && "Password Reset Complete"}
            </h1>
            <p className="text-xs font-mono text-[#a39687] mt-1">
              {mode === "login" && "Secure Content Management System"}
              {mode === "forgot" && "Enter your recovery email to receive a 6-digit verification code"}
              {mode === "otp" && `Enter the 6-digit code sent to ${recoveryEmail || "your email"}`}
              {mode === "reset" && "Set a strong new password for your account"}
              {mode === "success" && "Your credentials have been safely updated"}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs text-center font-mono">
            {errorMsg}
          </div>
        )}

        {/* ─── MODE 1: LOGIN ─── */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7c7062]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  {...loginRegister("username")}
                  type="text"
                  placeholder="admin username"
                  disabled={isLoggingIn}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] placeholder-[#6e6357] focus:outline-none focus:border-amber-500 transition-all disabled:opacity-50"
                />
              </div>
              {loginErrors.username && (
                <p className="text-xs text-red-400 font-mono">{loginErrors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setMode("forgot");
                  }}
                  className="text-[11px] font-mono text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7c7062]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  {...loginRegister("password")}
                  type="password"
                  placeholder="••••••••••••"
                  disabled={isLoggingIn}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] placeholder-[#6e6357] focus:outline-none focus:border-amber-500 transition-all disabled:opacity-50"
                />
              </div>
              {loginErrors.password && (
                <p className="text-xs text-red-400 font-mono">{loginErrors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-[#090807] bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#090807]" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#090807]" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ─── MODE 2: FORGOT PASSWORD (ENTER RECOVERY EMAIL) ─── */}
        {mode === "forgot" && (
          <form onSubmit={handleForgotSubmit(onForgotSubmit)} className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#14100e] border border-amber-500/20 text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Mail className="w-4 h-4" />
                <span>Recovery Email Verification</span>
              </div>
              <p className="text-[#a39687] leading-relaxed">
                Enter your registered administrator recovery email address. A 6-digit OTP code will be sent to your inbox.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                Recovery Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7c7062]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  {...forgotRegister("email")}
                  type="email"
                  placeholder="e.g. yourname@example.com"
                  disabled={isSendingEmail}
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] placeholder-[#6e6357] focus:outline-none focus:border-amber-500 transition-all disabled:opacity-50 font-mono"
                />
              </div>
              {forgotErrors.email && (
                <p className="text-xs text-red-400 font-mono">{forgotErrors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSendingEmail}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-[#090807] bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              {isSendingEmail ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#090807]" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#090807]" />
                  <span>Send Verification Code</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetToLogin}
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-mono text-[#a39687] hover:text-[#faf7f2] transition-colors pt-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>
          </form>
        )}

        {/* ─── MODE 3: VERIFY OTP ─── */}
        {mode === "otp" && (
          <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-5">
            <div className="p-4 rounded-2xl bg-[#14100e] border border-blue-500/20 text-xs font-mono space-y-1.5">
              <span className="text-blue-400 font-bold block">
                Verification Code Dispatched
              </span>
              <p className="text-[#cfc5b8]">
                We sent a 6-digit OTP code to <strong className="text-amber-400">{recoveryEmail}</strong>.
              </p>
              <p className="text-[10px] text-[#8f8072]">
                Valid for 10 minutes • Maximum 5 attempts allowed
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                Enter 6-Digit Verification Code
              </label>
              <div className="relative">
                <input
                  {...otpRegister("otp")}
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  disabled={isVerifyingOtp}
                  autoComplete="one-time-code"
                  className="w-full py-3 px-4 text-center tracking-[0.35em] font-mono text-xl font-bold rounded-xl bg-[#14100e] border border-amber-500/40 text-amber-400 placeholder-[#6e6357] focus:outline-none focus:border-amber-400 transition-all disabled:opacity-50"
                />
              </div>
              {otpErrors.otp && (
                <p className="text-xs text-red-400 font-mono text-center">{otpErrors.otp.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifyingOtp}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-[#090807] bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              {isVerifyingOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#090807]" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#090807]" />
                  <span>Verify & Create New Password</span>
                </>
              )}
            </button>

            {/* Resend & Back button */}
            <div className="flex items-center justify-between pt-2 border-t border-[#352923]/60 text-xs font-mono">
              <button
                type="button"
                onClick={resetToLogin}
                className="text-[#a39687] hover:text-[#faf7f2] transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldownSeconds > 0 || isResending}
                className="text-amber-400 hover:text-amber-300 disabled:text-[#6e6357] disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isResending || cooldownSeconds > 0 ? "animate-spin" : ""}`} />
                <span>{cooldownSeconds > 0 ? `Resend (${cooldownSeconds}s)` : "Resend Code"}</span>
              </button>
            </div>
          </form>
        )}

        {/* ─── MODE 4: RESET PASSWORD ─── */}
        {mode === "reset" && (
          <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-5">
            {/* Hidden Token */}
            <input type="hidden" {...resetRegister("resetToken")} value={verifiedResetToken} />
            {resetErrors.resetToken && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs text-center font-mono">
                {resetErrors.resetToken.message}
              </div>
            )}

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7c7062]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  {...resetRegister("newPassword")}
                  type="password"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  disabled={isResettingPassword}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] placeholder-[#6e6357] focus:outline-none focus:border-amber-500 transition-all disabled:opacity-50"
                />
              </div>
              {resetErrors.newPassword && (
                <p className="text-xs text-red-400 font-mono">{resetErrors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7c7062]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  {...resetRegister("confirmPassword")}
                  type="password"
                  placeholder="Repeat new password"
                  disabled={isResettingPassword}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] placeholder-[#6e6357] focus:outline-none focus:border-amber-500 transition-all disabled:opacity-50"
                />
              </div>
              {resetErrors.confirmPassword && (
                <p className="text-xs text-red-400 font-mono">{resetErrors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isResettingPassword}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-[#090807] bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              {isResettingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#090807]" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#090807]" />
                  <span>Save New Password</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ─── MODE 5: SUCCESS ─── */}
        {mode === "success" && (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono space-y-1">
              <p className="font-bold">Password Successfully Updated</p>
              <p className="text-[#a39687]">
                Your previous password and all other device sessions have been invalidated.
              </p>
            </div>

            <button
              type="button"
              onClick={resetToLogin}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-[#090807] bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              <ShieldCheck className="w-4 h-4 text-[#090807]" />
              <span>Sign In with New Password</span>
            </button>
          </div>
        )}

        <div className="text-center pt-2 border-t border-[#352923]/60">
          <p className="text-[11px] font-mono text-[#7c7062]">
            Protected route • Sessions encrypted with JWT
          </p>
        </div>

      </div>
    </div>
  );
}
