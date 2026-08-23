import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  formatMessageDate,
  getMessages,
  getTodayMessage,
} from "@/lib/messages/server";

import MessageEditor from "./MessageEditor";
import MessageHistory from "./MessageHistory";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "writer") {
    redirect("/read");
  }

  const [todayMessage, messages] = await Promise.all([
    getTodayMessage(),
    getMessages(),
  ]);

  const totalMessages = messages.length;
  const isRead = Boolean(todayMessage?.read_at);

  return (
    <main className="dashboard-page">
      <div className="dashboard-glow dashboard-glow-one" />
      <div className="dashboard-glow dashboard-glow-two" />
      <div className="noise-layer" />

      <header className="dashboard-header">
        <Link href="/" className="brand" aria-label="Dear You home">
          <span className="brand-mark">✦</span>
          <span>dear you</span>
        </Link>

        <form action="/auth/signout" method="POST">
          <button className="dashboard-signout" type="submit">
            <span>↗</span>
            Sign out
          </button>
        </form>
      </header>

      <section className="dashboard-content">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          <span>Writer&apos;s space</span>
        </div>

        <h1>
          Say something
          <span> today.</span>
        </h1>

        <p className="dashboard-description">
          One message. One day. A small piece of you waiting for her whenever
          she comes back.
        </p>

        <div className="dashboard-stats" aria-label="Message statistics">
          <div>
            <span className="dashboard-stat-label">ARCHIVE</span>
            <strong>{totalMessages}</strong>
            <span>{totalMessages === 1 ? "message" : "messages"} written</span>
          </div>

          <div>
            <span className="dashboard-stat-label">TODAY</span>
            <strong>{todayMessage ? (isRead ? "READ" : "WAITING") : "OPEN"}</strong>
            <span>
              {todayMessage
                ? isRead
                  ? "she has opened your note"
                  : "your note is waiting for her"
                : "write her a note"}
            </span>
          </div>
        </div>

        {todayMessage && (
          <p className="dashboard-today-meta">
            Today&apos;s note · {formatMessageDate(todayMessage.message_date)}
          </p>
        )}

        <MessageEditor initialMessage={todayMessage?.message ?? ""} />

        <MessageHistory messages={messages} />
      </section>
    </main>
  );
}
