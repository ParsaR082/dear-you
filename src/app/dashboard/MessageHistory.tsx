import type { Message } from "@/lib/messages/server";
import { formatMessageDate } from "@/lib/messages/server";

type Props = {
  messages: Message[];
};

export default function MessageHistory({ messages }: Props) {
  return (
    <section className="message-history">
      <div className="message-history-heading">
        <div>
          <span className="message-history-kicker">ARCHIVE</span>
          <h2>What you&apos;ve written.</h2>
        </div>
        <span className="message-history-kicker">
          {messages.length} {messages.length === 1 ? "note" : "notes"}
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="message-history-empty">
          Nothing here yet. Today&apos;s note will become the first page of the
          archive.
        </div>
      ) : (
        <div className="message-history-list">
          {messages.map((message) => (
            <article className="message-history-item" key={message.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  marginBottom: "0.7rem",
                }}
              >
                <time className="message-history-date" style={{ marginBottom: 0 }}>
                  {formatMessageDate(message.message_date)}
                </time>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    color: message.read_at ? "#9edab8" : "#efa5c8",
                    fontFamily: '"DM Mono", monospace',
                    fontSize: "0.57rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span aria-hidden="true">{message.read_at ? "✓" : "○"}</span>
                  {message.read_at ? "Read" : "Waiting"}
                </span>
              </div>

              <p className="message-history-text">{message.message}</p>

              {message.read_at && (
                <p className="editor-hint" style={{ marginTop: "0.75rem" }}>
                  Opened {formatOpenedAt(message.read_at)}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function formatOpenedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
