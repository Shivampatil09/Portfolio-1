"use client";

import { logoutAdminAction } from "@/actions/admin";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdminAction();
    toast.success("Signed out successfully.");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241a14] border border-[#3d2e24] text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all cursor-pointer"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Sign Out</span>
    </button>
  );
}
