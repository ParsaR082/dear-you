"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveTodayMessage(formData: FormData) {
  const supabase = await createClient();

  // Make sure the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Check user role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "writer") {
    throw new Error("You are not allowed to write messages.");
  }

  const message = formData.get("message")?.toString().trim();

  if (!message) {
    throw new Error("Message cannot be empty.");
  }

  const today = new Date().toISOString().split("T")[0];

  // Check if today's message already exists
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
      })
      .eq("id", existingMessage.id);

    if (error) {
      throw new Error("Failed to update today's message.");
    }
  } else {
    const { error } = await supabase
      .from("messages")
      .insert({
        message,
        message_date: today,
      });

    if (error) {
      throw new Error("Failed to create today's message.");
    }
  }

  revalidatePath("/dashboard");
}