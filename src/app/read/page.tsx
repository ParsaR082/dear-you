import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  formatMessageDate,
  getAppDate,
  getMessageByDate,
  getMessages,
} from "@/lib/messages/server";
import { createClient } from "@/lib/supabase/server";

const readerStyles = `
.reader-shell{min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 50% 15%,rgba(169,147,255,.11),transparent 32rem),radial-gradient(circle at 10% 90%,rgba(239,165,200,.07),transparent 28rem),#0a0b10;color:#f4f1eb}
.reader-shell,.reader-shell *{box-sizing:border-box}
.reader-header{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;width:min(100% - 2.7rem,82rem);height:6.5rem;margin:0 auto;border-bottom:1px solid rgba(244,241,235,.12)}
.reader-close{border:0;background:transparent;color:#9999a4;cursor:pointer;font:600 .62rem "DM Mono",monospace;letter-spacing:.12em;text-transform:uppercase}
.reader-close:hover{color:#f4f1eb}
.reader-main{position:relative;z-index:1;width:min(100% - 2.7rem,70rem);margin:0 auto;padding:4rem 0 7rem;text-align:center}
.reader-kicker{display:inline-flex;align-items:center;gap:.8rem;color:#efa5c8;font:500 .61rem "DM Mono",monospace;letter-spacing:.16em;text-transform:uppercase}
.reader-kicker:before,.reader-kicker:after{content:"";display:block;width:2.6rem;height:1px;background:rgba(239,165,200,.45)}
.reader-title{margin:1.5rem 0 0;font-size:clamp(3rem,8vw,6.7rem);font-weight:400;letter-spacing:-.07em;line-height:.92}
.reader-title em{font-family:"Playfair Display",Georgia,serif;color:#a993ff}
.reader-date{margin:1.1rem 0 0;color:#858592;font:500 .64rem "DM Mono",monospace;letter-spacing:.11em;text-transform:uppercase}
.reader-stage{display:flex;justify-content:center;margin:3rem auto 0}
.reader-gate,.reader-letter{width:min(100%,48rem);border:1px solid rgba(255,255,255,.14);border-radius:1.4rem;background:linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.025)),rgba(13,13,22,.72);box-shadow:0 2.5rem 7rem rgba(0,0,0,.35),inset 0 1px rgba(255,255,255,.09);backdrop-filter:blur(18px)}
.reader-gate{min-height:30rem;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem}
.reader-seal{display:grid;place-items:center;width:5rem;height:5rem;border:1px solid rgba(239,165,200,.45);border-radius:50%;color:#efa5c8;font-size:1.5rem;box-shadow:0 0 4rem rgba(239,165,200,.08);animation:reader-breathe 3.5s ease-in-out infinite}
.reader-gate h1{margin:2rem 0 .8rem;font:400 italic clamp(1.8rem,4vw,2.8rem) "Playfair Display",Georgia,serif}
.reader-gate p{max-width:28rem;margin:0;color:#9b9ba5;font-size:.9rem;line-height:1.8}
.reader-open-button{display:inline-flex;align-items:center;gap:1.25rem;margin-top:2rem;padding:.82rem 1rem .82rem 1.35rem;border:0;border-radius:999px;background:#f4f1eb;color:#11121a;cursor:pointer;font:600 .76rem "DM Sans",Arial,sans-serif;box-shadow:0 1rem 3rem rgba(255,255,255,.08);transition:transform .2s ease,box-shadow .2s ease}
.reader-open-button:hover{transform:translateY(-3px);box-shadow:0 1.3rem 3.5rem rgba(255,255,255,.12)}
.reader-open-icon{display:grid;place-items:center;width:2rem;height:2rem;border-radius:50%;background:#1b1b24;color:#fff}
.reader-letter{padding:1.6rem 1.6rem 1.35rem;text-align:left;animation:reader-rise .65s cubic-bezier(.2,.8,.2,1) both}
.reader-letter-top,.reader-letter-bottom{display:flex;align-items:center;justify-content:space-between;gap:1rem;color:#858592;font:500 .58rem "DM Mono",monospace;letter-spacing:.1em;text-transform:uppercase}
.reader-letter-top span:last-child{color:#efa5c8}
.reader-paper{padding:5rem clamp(1.5rem,7vw,6rem);border:1px solid rgba(255,255,255,.08);border-radius:1rem;background:rgba(8,9,14,.38)}
.reader-paper-mark{display:block;color:#efa5c8;font:400 4.8rem Georgia,serif;line-height:.45}
.reader-paper p{max-width:38rem;margin:1.6rem auto 0;color:#f2ecea;font:400 clamp(1.25rem,2.5vw,1.85rem)/1.75 "Playfair Display",Georgia,serif;white-space:pre-wrap}
.reader-letter-bottom{justify-content:center;margin-top:1.5rem;color:#efa5c8}
.reader-line{width:5rem;height:1px;background:rgba(239,165,200,.28)}
.reader-read-state{margin:1.25rem 0 0;color:#8d8d98;font-size:.74rem}
.reader-empty{padding:5rem 1.5rem;border:1px solid rgba(255,255,255,.09);border-radius:1.4rem;background:rgba(255,255,255,.025)}
.reader-empty h1{margin:1.2rem 0 .7rem;font:400 italic 2rem "Playfair Display",Georgia,serif}
.reader-empty p{max-width:29rem;margin:0 auto;color:#9b9ba5;line-height:1.8}
.reader-history{width:min(100%,48rem);margin:4rem auto 0;text-align:left}
.reader-history-head{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:1rem}
.reader-history-kicker{color:#efa5c8;font:500 .58rem "DM Mono",monospace;letter-spacing:.13em;text-transform:uppercase}
.reader-history h2{margin:.45rem 0 0;font-size:1.8rem;font-weight:400;letter-spacing:-.04em}
.reader-history-list{display:flex;flex-direction:column;gap:.65rem}
.reader-history-item{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1.1rem 1.2rem;border:1px solid rgba(255,255,255,.08);border-radius:.95rem;background:rgba(255,255,255,.02);transition:transform .2s ease,border-color .2s ease,background .2s ease}
.reader-history-item:hover{transform:translateY(-2px);border-color:rgba(239,165,200,.2);background:rgba(255,255,255,.035)}
.reader-history-item strong{font-weight:500}
.reader-history-meta{display:flex;align-items:center;gap:.75rem;color:#777784;font:500 .57rem "DM Mono",monospace;letter-spacing:.05em;text-transform:uppercase}
.reader-history-arrow{color:#efa5c8;font-size:1rem}
.reader-note{margin:3rem auto 0;color:#676874;font:500 .58rem/1.6 "DM Mono",monospace;letter-spacing:.06em;text-transform:uppercase}
.reader-glow{position:absolute;pointer-events:none;border-radius:50%;filter:blur(120px);opacity:.13}
.reader-glow-one{top:10rem;right:-12rem;width:28rem;height:28rem;background:#7255df}
.reader-glow-two{bottom:-14rem;left:-10rem;width:30rem;height:30rem;background:#b74c87}
@keyframes reader-breathe{0%,100%{transform:scale(.98);opacity:.8}50%{transform:scale(1.04);opacity:1}}
@keyframes reader-rise{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}
@media (max-width:600px){.reader-header{height:5.5rem}.reader-main{padding-top:3rem}.reader-gate{min-height:25rem;padding:2rem 1.25rem}.reader-letter{padding:1rem}.reader-paper{padding:3rem 1.2rem}.reader-paper p{font-size:1.18rem;line-height:1.85}.reader-history-item{align-items:flex-start}.reader-history-meta{flex-shrink:0}.reader-kicker:before,.reader-kicker:after{width:1.6rem}}
@media (prefers-reduced-motion:reduce){.reader-seal,.reader-letter{animation:none}}
`;

type ReaderPageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function ReaderPage({ searchParams }: ReaderPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_recipient")
    .eq("id", user.id)
    .single();

  if (profile?.role === "writer") redirect("/dashboard");
  if (profile?.role !== "reader" || profile.is_recipient !== true) redirect("/");

  const params = await searchParams;
  const appDate = getAppDate();
  const requestedDate = params.date;
  const selectedDate = requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate)
    ? requestedDate
    : appDate;

  const [message, messages] = await Promise.all([
    getMessageByDate(selectedDate),
    getMessages(30),
  ]);

  async function markMessageRead(formData: FormData) {
    "use server";

    const messageId = formData.get("messageId")?.toString();
    if (!messageId) return;

    const readerClient = await createClient();
    const {
      data: { user: currentUser },
    } = await readerClient.auth.getUser();

    if (!currentUser) return;

    const { data: currentProfile } = await readerClient
      .from("profiles")
      .select("role, is_recipient")
      .eq("id", currentUser.id)
      .single();

    if (currentProfile?.role !== "reader" || currentProfile.is_recipient !== true) {
      return;
    }

    const { error } = await readerClient.rpc("mark_message_read", {
      p_message_id: messageId,
    });

    if (error) {
      throw new Error("The note could not be opened. Please try again.");
    }

    revalidatePath("/read");
  }

  const needsOpen = Boolean(message && !message.read_at);
  const pastMessages = messages.filter((item) => item.message_date !== selectedDate);
  const formattedDate = message ? formatMessageDate(message.message_date) : null;
  const isToday = selectedDate === appDate;

  return (
    <main className="reader-shell">
      <style dangerouslySetInnerHTML={{ __html: readerStyles }} />
      <div className="reader-glow reader-glow-one" aria-hidden="true" />
      <div className="reader-glow reader-glow-two" aria-hidden="true" />

      <header className="reader-header">
        <Link href="/" className="brand" aria-label="Dear You home">
          <span className="brand-mark">✦</span>
          <span>dear you</span>
        </Link>

        <form action="/auth/signout" method="POST">
          <button className="reader-close" type="submit">Close ×</button>
        </form>
      </header>

      <section className="reader-main">
        <div className="reader-kicker">{isToday ? "A note for today" : "A note left for you"}</div>

        <h1 className="reader-title">
          Something <em>quietly written.</em>
        </h1>

        {formattedDate && <p className="reader-date">{formattedDate}</p>}

        <div className="reader-stage">
          {!message ? (
            <section className="reader-empty">
              <div className="reader-seal" style={{ margin: "0 auto" }}>✦</div>
              <h1>Nothing for this day.</h1>
              <p>
                There isn&apos;t a note waiting here yet. Some things are worth
                waiting for.
              </p>
              {!isToday && (
                <p style={{ marginTop: "1.4rem" }}>
                  <Link href="/read" style={{ color: "#efa5c8" }}>Back to today ↗</Link>
                </p>
              )}
            </section>
          ) : needsOpen ? (
            <section className="reader-gate">
              <div className="reader-seal" aria-hidden="true">✦</div>
              <h1>{isToday ? "Someone left you a little something." : "A little something was left here."}</h1>
              <p>
                {isToday
                  ? "It was written for today, and it is waiting to be opened."
                  : "It is still waiting for its first visit."}
              </p>
              <form action={markMessageRead}>
                <input type="hidden" name="messageId" value={message.id} />
                <button className="reader-open-button" type="submit">
                  <span>{isToday ? "Open today&apos;s letter" : "Open this letter"}</span>
                  <span className="reader-open-icon">↗</span>
                </button>
              </form>
            </section>
          ) : (
            <article className="reader-letter">
              <div className="reader-letter-top">
                <span>DEAR YOU</span>
                <span>{formattedDate}</span>
              </div>

              <div className="reader-paper">
                <span className="reader-paper-mark">“</span>
                <p>{message.message}</p>
              </div>

              <div className="reader-letter-bottom">
                <span className="reader-line" />
                <span>✦</span>
                <span className="reader-line" />
              </div>

              <p className="reader-read-state">
                {message.read_at ? "You opened this note." : "Written just for you."}
              </p>
            </article>
          )}
        </div>

        {pastMessages.length > 0 && (
          <section className="reader-history">
            <div className="reader-history-head">
              <div>
                <span className="reader-history-kicker">THE ARCHIVE</span>
                <h2>Little things left behind.</h2>
              </div>
              <span className="reader-history-kicker">{pastMessages.length} notes</span>
            </div>

            <div className="reader-history-list">
              {pastMessages.map((item) => (
                <Link
                  key={item.id}
                  href={`/read?date=${item.message_date}`}
                  className="reader-history-item"
                >
                  <strong>{formatMessageDate(item.message_date)}</strong>
                  <span className="reader-history-meta">
                    {item.read_at ? "read" : "waiting"}
                    <span className="reader-history-arrow">↗</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="reader-note">Written with intention · kept only for you</p>
      </section>
    </main>
  );
}
