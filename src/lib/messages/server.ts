import { createClient } from "@/lib/supabase/server";

export async function getTodayMessage() {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("message_date", today)
    .maybeSingle();

  if (error) {
    console.error("Error fetching today's message:", error);
    throw new Error("Failed to fetch today's message");
  }

  return data;
}

export async function getMessages() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("message_date", { ascending: false });

  if (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }

  return data ?? [];
}

export async function createMessage(
  message: string,
  messageDate: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .insert({
      message,
      message_date: messageDate,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating message:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateMessage(
  id: string,
  message: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .update({
      message,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating message:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting message:", error);
    throw new Error(error.message);
  }

  return true;
}