"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, User, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { adminLoginSchema, AdminLoginData } from "@/lib/validations";
import { loginAdminAction } from "@/actions/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginData) => {
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
        toast.error("Authentication Failed", {
          description: res.message,
        });
      }
    } catch {
      setErrorMsg("An unexpected login error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8 glass-card p-8 sm:p-10 rounded-3xl border border-amber-500/25 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#faf7f2]">Admin Portal</h1>
            <p className="text-xs font-mono text-[#a39687] mt-1">
              Secure Content Management System
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs text-center font-mono">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                {...register("username")}
                type="text"
                placeholder="admin username"
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] placeholder-[#6e6357] focus:outline-none focus:border-amber-500 transition-all disabled:opacity-50"
              />
            </div>
            {errors.username && (
              <p className="text-xs text-red-400 font-mono">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-[#cfc5b8]">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7c7062]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••••••"
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] placeholder-[#6e6357] focus:outline-none focus:border-amber-500 transition-all disabled:opacity-50"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 font-mono">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-[#090807] bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            {isSubmitting ? (
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

        <div className="text-center pt-2 border-t border-[#352923]/60">
          <p className="text-[11px] font-mono text-[#7c7062]">
            Protected route • Sessions encrypted with JWT
          </p>
        </div>

      </div>
    </div>
  );
}
