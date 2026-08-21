import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getTodayMessage } from "@/lib/messages/server";

export default async function ReaderPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_recipient")
    .eq("id", user.id)
    .single();

  if (
    profile?.role !== "reader" ||
    profile?.is_recipient !== true
  ) {
    redirect("/");
  }

  const message = await getTodayMessage();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            opacity: 0.5,
            fontSize: "13px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Dear You
        </p>

        {message ? (
          <>
            <p
              style={{
                marginTop: "40px",
                opacity: 0.5,
              }}
            >
              {message.message_date}
            </p>

            <article
              style={{
                marginTop: "30px",
                padding: "40px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <p
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "2",
                  fontSize: "18px",
                }}
              >
                {message.message}
              </p>
            </article>
          </>
        ) : (
          <div
            style={{
              marginTop: "60px",
            }}
          >
            <h1>
              Nothing for today.
            </h1>

            <p
              style={{
                marginTop: "15px",
                opacity: 0.5,
              }}
            >
              Come back tomorrow.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}