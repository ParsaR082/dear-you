import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getTodayMessage } from "@/lib/messages/server";

export default async function ReaderPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_recipient")
    .eq("id", user.id)
    .single();

  if (profile?.role === "writer") {
    redirect("/dashboard");
  }

  if (profile?.role !== "reader" || profile.is_recipient !== true) {
    redirect("/");
  }

  const message = await getTodayMessage();

  const formattedDate = message
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "long",
        timeZone: "UTC",
      }).format(new Date(`${message.message_date}T00:00:00Z`))
    : null;

  return (
    <main className="reader-page">
      <div className="reader-glow reader-glow-one" />
      <div className="reader-glow reader-glow-two" />
      <div className="noise-layer" />

      <header className="reader-header">
        <Link href="/" className="brand" aria-label="Dear You home">
          <span className="brand-mark">✦</span>
          <span>dear you</span>
        </Link>

        <form action="/auth/signout" method="POST">
          <button className="reader-signout" type="submit">
            Close <span>×</span>
          </button>
        </form>
      </header>

      <section className="reader-content">
        <div className="reader-kicker">
          <span className="reader-kicker-line" />
          <span>A note for you</span>
          <span className="reader-kicker-line" />
        </div>

        {message ? (
          <article className="reader-letter">
            <div className="reader-letter-top">
              <span>DEAR YOU</span>
              <span>{formattedDate}</span>
            </div>

            <div className="reader-letter-body">
              <span className="reader-quote-mark">“</span>
              <p>{message.message}</p>
            </div>

            <div className="reader-letter-bottom">
              <span className="reader-line" />
              <span>✦</span>
              <span className="reader-line" />
            </div>
          </article>
        ) : (
          <section className="reader-empty">
            <div className="reader-empty-symbol">✦</div>
            <h1>Nothing for today.</h1>
            <p>
              There isn't a note waiting yet. Come back later — some things
              are worth waiting for.
            </p>
          </section>
        )}

        <p className="reader-footer-note">
          Written today, kept here for you.
        </p>
      </section>
    </main>
  );
}
