import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-glow dashboard-glow-one" />
      <div className="dashboard-glow dashboard-glow-two" />
      <div className="noise-layer" />

      <header className="dashboard-header">
        <Link href="/" className="brand">
          <span className="brand-mark">✦</span>
          <span>dear you</span>
        </Link>

        <form action="/auth/signout" method="post">
          <button type="submit" className="dashboard-signout">
            Sign out
            <span>↗</span>
          </button>
        </form>
      </header>

      <section className="dashboard-content">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          <span>Your private space</span>
        </div>

        <h1>
          Hello,
          <span> {user.email?.split("@")[0] || "you"}.</span>
        </h1>

        <p className="dashboard-description">
          Your first message is waiting to be written here.
        </p>

        <div className="empty-message-card">
          <span className="empty-card-label">YOUR COLLECTION</span>

          <div className="empty-card-center">
            <span className="empty-card-symbol">✦</span>
            <h2>Something gentle is coming.</h2>
            <p>
              This is where your private messages, memories, and little
              reminders will appear.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}