import Link from "next/link";

import { formatMessageDate, getAppDate } from "@/lib/messages/server";

const features = [
  {
    number: "01",
    title: "A private space",
    description:
      "A quiet little corner of the internet, created just for one special person.",
  },
  {
    number: "02",
    title: "A message every day",
    description:
      "A new thought, memory, or feeling waiting to be discovered each day.",
  },
  {
    number: "03",
    title: "Made with intention",
    description:
      "Every word is written with care, kept safe, and meant only for you.",
  },
];

export default function Home() {
  const todayLabel = formatMessageDate(getAppDate()).toUpperCase();

  return (
    <main className="site-shell">
      <div className="background-glow background-glow-one" />
      <div className="background-glow background-glow-two" />
      <div className="noise-layer" />

      <nav className="navbar">
        <Link href="/" className="brand">
          <span className="brand-mark">✦</span>
          <span>dear you</span>
        </Link>

        <Link href="/login" className="nav-link">
          Enter private space
          <span className="arrow">↗</span>
        </Link>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            <span>A little place made for you</span>
          </div>

          <h1>
            Some things are
            <span className="italic-line"> worth waiting for.</span>
          </h1>

          <p className="hero-description">
            A private collection of daily messages, gentle thoughts, and little
            reminders created especially for you.
          </p>

          <div className="hero-actions">
            <Link href="/login" className="primary-button">
              <span>Open your messages</span>
              <span className="button-icon">↗</span>
            </Link>

            <a href="#story" className="text-button">
              Discover the story
              <span>↓</span>
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="message-card">
            <div className="card-top">
              <span className="card-label">TODAY&apos;S NOTE</span>
              <span className="card-date">{todayLabel}</span>
            </div>

            <div className="card-content">
              <span className="quote-mark">“</span>
              <p>
                You are allowed to take your time. Beautiful things are rarely
                rushed.
              </p>
            </div>

            <div className="card-bottom">
              <span className="card-line" />
              <span className="card-heart">♡</span>
            </div>
          </div>

          <div className="floating-star star-one">✦</div>
          <div className="floating-star star-two">✧</div>
          <div className="floating-star star-three">·</div>
        </div>
      </section>

      <section id="story" className="intro-section">
        <div className="section-heading">
          <span className="section-kicker">THE IDEA</span>
          <h2>
            One small message.
            <br />
            <span>A meaningful moment.</span>
          </h2>
        </div>

        <p className="intro-text">
          Not everything needs to be loud. Sometimes, a few carefully chosen
          words can turn an ordinary day into something unforgettable.
        </p>
      </section>

      <section className="features-section">
        {features.map((feature) => (
          <article className="feature-item" key={feature.number}>
            <span className="feature-number">{feature.number}</span>
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="closing-section">
        <div className="closing-symbol">✦</div>

        <p className="closing-kicker">WHEN YOU&apos;RE READY</p>

        <h2>
          There&apos;s something
          <br />
          waiting for you.
        </h2>

        <Link href="/login" className="primary-button">
          <span>Enter your private space</span>
          <span className="button-icon">↗</span>
        </Link>
      </section>

      <footer className="footer">
        <span>© 2026 dear you</span>
        <span>Made with intention</span>
      </footer>
    </main>
  );
}
