import { getCertifications } from "@/lib/db";
import { CertificationsManager } from "./CertificationsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Certifications Manager | Admin Dashboard",
};

export default async function AdminCertificationsPage() {
  const certs = await getCertifications();

  return <CertificationsManager initialCertifications={certs} />;
}
