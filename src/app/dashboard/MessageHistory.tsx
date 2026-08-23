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
              <div className="message-history-item-head">
                <time className="message-history-date">
                  {formatMessageDate(message.message_date)}
                </time>

                <span
                  className={`message-read-state ${message.read_at ? "is-read" : "is-unread"}`}
                >
                  <span aria-hidden="true">{message.read_at ? "✓" : "○"}</span>
                  {message.read_at ? "Read" : "Waiting"}
                </span>
              </div>

              <p className="message-history-text">{message.message}</p>

              {message.read_at && (
                <p className="message-read-time">
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
