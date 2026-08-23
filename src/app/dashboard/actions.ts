"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAppDate } from "@/lib/messages/server";

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

  if (existingMessage) {
    const { error } = await supabase
      .from("messages")
      .update({
        message,
        // A meaningful edit creates a fresh daily note. The read timestamp is
        // intentionally reset because the reader should encounter the edited note.
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

  revalidatePath("/dashboard");
  revalidatePath("/read");
}
