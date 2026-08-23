type Message = {
  id: string;
  message: string;
  message_date: string;
  created_at: string;
  updated_at: string;
};

type Props = {
  messages: Message[];
};

export default function MessageHistory({ messages }: Props) {
  return (
    <section className="message-history">
      <div className="message-history-heading">
        <div>
          <span className="message-history-kicker">ARCHIVE</span>
          <h2>What you've written.</h2>
        </div>
        <span className="message-history-kicker">
          {messages.length} {messages.length === 1 ? "note" : "notes"}
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="message-history-empty">
          Nothing here yet. Today's note will become the first page of the
          archive.
        </div>
      ) : (
        <div className="message-history-list">
          {messages.map((message) => (
            <article className="message-history-item" key={message.id}>
              <time className="message-history-date">
                {new Intl.DateTimeFormat("en", {
                  dateStyle: "long",
                  timeZone: "UTC",
                }).format(new Date(`${message.message_date}T00:00:00Z`))}
              </time>
              <p className="message-history-text">{message.message}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
