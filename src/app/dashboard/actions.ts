"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formatMessageDate, getAppDate } from "@/lib/messages/server";
import { sendNewMessageNotification } from "@/lib/email/server";

const MAX_MESSAGE_LENGTH = 5000;

export async function saveTodayMessage(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "writer") {
    throw new Error("You are not allowed to write messages.");
  }

  const message = formData.get("message")?.toString().trim() ?? "";

  if (!message) {
    throw new Error("Message cannot be empty.");
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`);
  }

  const today = getAppDate();

  const { data: existingMessage, error: existingError } = await supabase
    .from("messages")
    .select("id")
    .eq("message_date", today)
    .maybeSingle();

  if (existingError) {
    throw new Error("Failed to check today's message.");
  }

  const isNewMessage = !existingMessage;

  if (existingMessage) {
    const { error } = await supabase
      .from("messages")
      .update({
        message,
        read_at: null,
      })
      .eq("id", existingMessage.id);

    if (error) {
      throw new Error("Failed to update today's message.");
    }
  } else {
    const { error } = await supabase.from("messages").insert({
      message,
      message_date: today,
    });

    if (error) {
      throw new Error("Failed to create today's message.");
    }
  }

  // Email is intentionally best-effort. The message is already safely stored;
  // an email provider outage must never make the writer lose today's note.
  if (isNewMessage) {
    const recipient = process.env.RECIPIENT_EMAIL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (recipient && appUrl) {
      try {
        await sendNewMessageNotification({
          recipient,
          appUrl,
          messageDate: formatMessageDate(today),
        });
      } catch (error) {
        console.error("Dear You email notification failed:", error);
      }
    } else {
      console.warn(
        "Email notification skipped: RECIPIENT_EMAIL or NEXT_PUBLIC_APP_URL is not configured.",
      );
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/read");
}
