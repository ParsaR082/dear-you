import { Suspense } from "react";
import LoginForm from "./LoginForm";

function LoginFallback() {
  return (
    <main className="auth-page">
      <div className="auth-background auth-background-one" />
      <div className="auth-background auth-background-two" />
      <div className="noise-layer" />

      <header className="auth-header">
        <div className="brand" aria-label="dear you">
          <span className="brand-mark">✦</span>
          <span>dear you</span>
        </div>
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
        </div>

        <div className="login-panel">
          <div className="login-heading">
            <h2>Enter your space</h2>
            <p>Preparing your private space…</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
