import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getContactMessages } from "@/lib/db";
import { MessagesManager } from "./MessagesManager";

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const messages = await getContactMessages();

  return <MessagesManager initialMessages={messages} />;
}
