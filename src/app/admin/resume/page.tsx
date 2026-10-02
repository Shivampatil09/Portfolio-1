import { getResume } from "@/lib/db";
import { ResumeManager } from "./ResumeManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Resume Manager | Admin Dashboard",
};

export default async function AdminResumePage() {
  const resume = await getResume();

  return <ResumeManager initialResume={resume} />;
}
