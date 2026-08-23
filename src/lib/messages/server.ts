import { createClient } from "@/lib/supabase/server";

const APP_TIME_ZONE = process.env.APP_TIMEZONE || "Asia/Tehran";

export type Message = {
  id: string;
  message: string;
  message_date: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

export function getAppDate(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export function isValidMessageDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

export function formatMessageDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export async function getTodayMessage() {
  return getMessageByDate(getAppDate());
}

export async function getMessageByDate(messageDate: string) {
  if (!isValidMessageDate(messageDate)) return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("id, message, message_date, read_at, created_at, updated_at")
    .eq("message_date", messageDate)
    .maybeSingle();

  if (error) {
    console.error("Error fetching message:", error);
    throw new Error("Failed to fetch message");
  }

  return data as Message | null;
}

export async function getMessages(limit = 60) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("id, message, message_date, read_at, created_at, updated_at")
    .order("message_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }

  return (data ?? []) as Message[];
}

export async function getLatestMessages(limit = 12) {
  return getMessages(limit);
}

export async function createMessage(message: string, messageDate: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .insert({
      message,
      message_date: messageDate,
    })
    .select("id, message, message_date, read_at, created_at, updated_at")
    .single();

  if (error) {
    console.error("Error creating message:", error);
    throw new Error(error.message);
  }

  return data as Message;
}

export async function updateMessage(id: string, message: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .update({ message })
    .eq("id", id)
    .select("id, message, message_date, read_at, created_at, updated_at")
    .single();

  if (error) {
    console.error("Error updating message:", error);
    throw new Error(error.message);
  }

  return data as Message;
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("messages").delete().eq("id", id);

  if (error) {
    console.error("Error deleting message:", error);
    throw new Error(error.message);
  }

  return true;
}
