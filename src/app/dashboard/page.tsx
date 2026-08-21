import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  getTodayMessage,
  getMessages,
} from "@/lib/messages/server";

import MessageEditor from "./MessageEditor";
import MessageHistory from "./MessageHistory";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "writer") {
    redirect("/");
  }

  const todayMessage = await getTodayMessage();
  const messages = await getMessages();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            marginBottom: "40px",
          }}
        >
          <p>Dear You</p>

          <h1>
            Today's message
          </h1>

          <p>
            Write something for her today.
          </p>
        </header>

        <section>
          <MessageEditor
            initialMessage={todayMessage?.message ?? ""}
          />
        </section>

        <MessageHistory
          messages={messages}
        />
      </div>
    </main>
  );
}