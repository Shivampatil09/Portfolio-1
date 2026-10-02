"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Trash2, CheckCircle, Clock, MapPin } from "lucide-react";
import { ContactMessage } from "@/lib/db/initial-data";
import { markMessageReadAction, deleteMessageAction } from "@/actions/admin";
import { formatDate } from "@/lib/utils";

export function MessagesManager({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    const nextRead = !currentRead;
    const res = await markMessageReadAction(id, nextRead);
    if (res.success) {
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, isRead: nextRead } : m))
      );
      toast.success(nextRead ? "Marked as read." : "Marked as unread.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this inquiry?")) {
      const res = await deleteMessageAction(id);
      if (res.success) {
        toast.success("Message deleted.");
        setMessages(messages.filter((m) => m.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#faf7f2] flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-400" />
            <span>Contact Inquiries ({messages.length})</span>
          </h2>
          <p className="text-xs text-[#a39687]">
            Messages submitted through the Work With Me contact form
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-3 border-amber-500/20">
          <Mail className="w-10 h-10 text-[#7c7062] mx-auto stroke-1" />
          <p className="text-sm text-[#a39687]">No messages yet.</p>
          <p className="text-xs text-[#6e6357]">
            Submitted messages via /contact will appear here and persist to Neon PostgreSQL.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`glass-card p-6 rounded-2xl space-y-4 border transition-all ${
                msg.isRead ? "border-[#352923] opacity-80" : "border-amber-500/40 bg-amber-500/[0.03]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-[#2d221c]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#faf7f2]">{msg.name}</span>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-400 text-[#090807] font-bold">
                        NEW
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs font-mono text-amber-400 hover:underline"
                  >
                    {msg.email}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#a39687]">
                  <span className="flex items-center gap-1" suppressHydrationWarning>
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              </div>

              <div className="text-sm text-[#cfc5b8] leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#2d221c]">
                <button
                  onClick={() => handleToggleRead(msg.id, msg.isRead)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a39687] hover:text-amber-300 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-amber-400" />
                  <span>{msg.isRead ? "Mark Unread" : "Mark as Read"}</span>
                </button>

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
