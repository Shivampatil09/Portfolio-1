import { getSession } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-[#090706] text-[#faf7f2] flex flex-col justify-center">
        {children}
      </div>
    );
  }

  return (
    <AdminLayoutClient username={session.username}>
      {children}
    </AdminLayoutClient>
  );
}
