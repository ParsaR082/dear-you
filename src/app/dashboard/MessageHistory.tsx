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
    <section
      style={{
        marginTop: "60px",
      }}
    >
      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <p
          style={{
            opacity: 0.5,
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          Archive
        </p>

        <h2>
          Previous messages
        </h2>
      </div>

      {messages.length === 0 ? (
        <p style={{ opacity: 0.5 }}>
          No messages yet.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {messages.map((message) => (
            <article
              key={message.id}
              style={{
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <time
                style={{
                  display: "block",
                  marginBottom: "10px",
                  opacity: 0.45,
                  fontSize: "13px",
                }}
              >
                {message.message_date}
              </time>

              <p
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.8",
                  margin: 0,
                }}
              >
                {message.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}