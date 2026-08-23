import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getMessages, getTodayMessage } from "@/lib/messages/server";

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
          <span>Writer's space</span>
        </div>

        <h1>
          Say something
          <span> today.</span>
        </h1>

        <p className="dashboard-description">
          One message. One day. Something she can come back to whenever she
          needs it.
        </p>

        <div className="dashboard-stats" aria-label="Message statistics">
          <div>
            <span className="dashboard-stat-label">ARCHIVE</span>
            <strong>{totalMessages}</strong>
            <span>{totalMessages === 1 ? "message" : "messages"} written</span>
          </div>
          <div>
            <span className="dashboard-stat-label">TODAY</span>
            <strong>{todayMessage ? "READY" : "OPEN"}</strong>
            <span>{todayMessage ? "your note is waiting" : "write her a note"}</span>
          </div>
        </div>

        <MessageEditor initialMessage={todayMessage?.message ?? ""} />

        <MessageHistory messages={messages} />
      </section>
    </main>
  );
}
