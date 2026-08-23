"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please enter both your email and password.");
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) {
      setMessage("The email or password is incorrect.");
      setIsLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_recipient")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      setMessage("Your account could not be verified.");
      setIsLoading(false);
      return;
    }

    const redirectPath = searchParams.get("redirectedFrom");

    if (profile.role === "writer") {
      if (redirectPath === "/dashboard" || redirectPath?.startsWith("/dashboard/")) {
        router.replace(redirectPath);
      } else {
        router.replace("/dashboard");
      }
    } else if (profile.role === "reader" && profile.is_recipient === true) {
      if (redirectPath === "/read" || redirectPath?.startsWith("/read/")) {
        router.replace(redirectPath);
      } else {
        router.replace("/read");
      }
    } else {
      await supabase.auth.signOut();
      setMessage("This account does not have a valid Dear You role.");
      setIsLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <main className="auth-page">
      <div className="auth-background auth-background-one" />
      <div className="auth-background auth-background-two" />
      <div className="noise-layer" />

      <header className="auth-header">
        <Link href="/" className="brand">
          <span className="brand-mark">✦</span>
          <span>dear you</span>
        </Link>

        <Link href="/" className="back-link">
          <span>←</span>
          Back home
        </Link>
      </header>

      <section className="auth-layout">
        <div className="auth-intro">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            <span>Your private space</span>
          </div>

          <h1>
            Welcome
            <span> back.</span>
          </h1>

          <p>
            Everything written here is meant for you. Enter your details to
            continue.
          </p>

          <div className="auth-decoration" aria-hidden="true">
            <span className="decoration-orbit decoration-orbit-one" />
            <span className="decoration-orbit decoration-orbit-two" />
            <span className="decoration-star">✦</span>
          </div>
        </div>

        <div className="login-panel">
          <div className="login-panel-header">
            <span className="panel-label">PRIVATE ACCESS</span>
            <span className="panel-number">01 / 01</span>
          </div>

          <div className="login-heading">
            <h2>Enter your space</h2>
            <p>Use the details that were shared with you.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="show-password-button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isLoading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={isLoading}
            >
              <span>{isLoading ? "Opening..." : "Continue"}</span>
              <span className="button-icon">{isLoading ? "…" : "↗"}</span>
            </button>

            {message && (
              <p className="form-message" role="alert">
                {message}
              </p>
            )}
          </form>

          <div className="login-panel-footer">
            <span className="footer-dot" />
            <span>Your messages are private and protected.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
