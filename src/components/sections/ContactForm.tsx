"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, Loader2, CheckCircle2, User, Mail, MessageSquare } from "lucide-react";
import { contactFormSchema, ContactFormData } from "@/lib/validations";
import { submitContactMessage } from "@/actions/contact";

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setServerError(null);
    try {
      const res = await submitContactMessage(data);
      if (res.success) {
        setIsSubmitted(true);
        toast.success("Message Sent Successfully!", {
          description: "Thank you for reaching out. Shivam will get back to you soon.",
        });
        reset();
      } else {
        setServerError(res.message);
        toast.error("Failed to Send Message", {
          description: res.message,
        });
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
      toast.error("Submission Error", {
        description: "Please check your network and try again.",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="glass-card p-8 sm:p-12 rounded-3xl text-center space-y-6 border border-emerald-500/30">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-[#faf7f2]">Thank You for Reaching Out!</h3>
          <p className="text-sm text-[#b8ada0] max-w-md mx-auto">
            Your message has been stored and received. Shivam Patil will review your inquiry and get back to you promptly.
          </p>
        </div>
        <button
          onClick={() => setIsSubmitted(false)}
          className="px-6 py-2.5 rounded-xl bg-[#1f1814] border border-[#3d2e24] text-xs font-semibold text-amber-300 hover:border-amber-500/40"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 sm:p-10 rounded-3xl space-y-6 border border-amber-500/25">
      {serverError && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium">
          {serverError}
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <label className="block text-xs font-mono uppercase tracking-wider text-[#cfc5b8] font-semibold">
          Your Name <span className="text-amber-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7c7062]">
            <User className="w-4 h-4" />
          </div>
          <input
            {...register("name")}
            type="text"
            placeholder="e.g. John Doe"
            disabled={isSubmitting}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] placeholder-[#6e6357] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all disabled:opacity-50"
          />
        </div>
        {errors.name && (
          <p className="text-xs text-red-400 font-mono mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-xs font-mono uppercase tracking-wider text-[#cfc5b8] font-semibold">
          Your Email Address <span className="text-amber-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7c7062]">
            <Mail className="w-4 h-4" />
          </div>
          <input
            {...register("email")}
            type="email"
            placeholder="e.g. john@example.com"
            disabled={isSubmitting}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] placeholder-[#6e6357] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all disabled:opacity-50"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-400 font-mono mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label className="block text-xs font-mono uppercase tracking-wider text-[#cfc5b8] font-semibold">
          Project or Opportunity Details <span className="text-amber-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute top-3.5 left-3.5 pointer-events-none text-[#7c7062]">
            <MessageSquare className="w-4 h-4" />
          </div>
          <textarea
            {...register("message")}
            rows={5}
            placeholder="Describe your project, hiring opportunity, or inquiry..."
            disabled={isSubmitting}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#14100e] border border-[#3b2d24] text-sm text-[#faf7f2] placeholder-[#6e6357] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all disabled:opacity-50 resize-none"
          />
        </div>
        {errors.message && (
          <p className="text-xs text-red-400 font-mono mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-[#090807] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#090807]" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4 text-[#090807]" />
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
}
