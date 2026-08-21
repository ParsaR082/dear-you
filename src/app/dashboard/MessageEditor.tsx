"use client";

import { useRef, useState } from "react";
import { saveTodayMessage } from "./actions";

type Props = {
  initialMessage: string;
};

export default function MessageEditor({ initialMessage }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const [message, setMessage] = useState(initialMessage);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      await saveTodayMessage(formData);

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <textarea
        name="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Write something for her..."
        rows={12}
        required
        style={{
          width: "100%",
          padding: "20px",
          resize: "vertical",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.03)",
          color: "white",
          fontSize: "16px",
          lineHeight: "1.8",
          outline: "none",
        }}
      />

      <button
        type="submit"
        disabled={saving || !message.trim()}
        style={{
          padding: "14px 24px",
          borderRadius: "10px",
          border: "none",
          cursor: saving ? "wait" : "pointer",
          opacity: saving || !message.trim() ? 0.6 : 1,
        }}
      >
        {saving ? "Saving..." : "Save today's message"}
      </button>

      {saved && (
        <p>
          ✓ Today's message has been saved.
        </p>
      )}

      {error && (
        <p>
          {error}
        </p>
      )}
    </form>
  );
}