"use client";

import { useState } from "react";
import { saveTodayMessage } from "./actions";

type Props = {
  initialMessage: string;
};

export default function MessageEditor({ initialMessage }: Props) {
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
      window.setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  }

  const canSave = message.trim().length > 0 && !saving;

  return (
    <form className="message-editor" action={handleSubmit}>
      <div className="message-editor-header">
        <div>
          <span className="dashboard-kicker">TODAY</span>
          <h2>Write her something.</h2>
        </div>
        <span className="message-count">{message.length} chars</span>
      </div>

      <textarea
        name="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Tell her something you want her to remember today..."
        rows={12}
        maxLength={5000}
        required
        aria-label="Today's message"
        disabled={saving}
      />

      <div className="message-editor-footer">
        <p className="editor-hint">
          This message will be the note waiting for her today.
        </p>

        <button type="submit" className="dashboard-primary-button" disabled={!canSave}>
          <span>{saving ? "Saving..." : "Save today's message"}</span>
          <span className="button-icon">{saving ? "…" : "↗"}</span>
        </button>
      </div>

      <div className="editor-status" aria-live="polite">
        {saved && <span className="success-message">✓ Saved for today.</span>}
        {error && <span className="error-message">{error}</span>}
      </div>
    </form>
  );
}
