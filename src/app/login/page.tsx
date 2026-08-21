"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      setMessage("Please enter both your email and password.");
      return;
    }

    setMessage(
      "Your private space is being prepared. Account connection comes next.",
    );
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
              />
            </div>

            <div className="input-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>

                <button
                  type="button"
                  className="show-password-button"
                  onClick={() => setShowPassword((current) => !current)}
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
              />
            </div>

            <button type="submit" className="login-submit">
              <span>Continue</span>
              <span className="button-icon">↗</span>
            </button>

            {message && (
              <p className="form-message" role="status">
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