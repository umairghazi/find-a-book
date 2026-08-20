import { AppLink } from "../components/app-link";

export function HomePage() {
  return (
    <main className="app-shell">
      <section className="hero home-hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="kicker">Found You a Book</p>
          <h1 id="page-title">A smarter path to your next read.</h1>
          <p>
            Choose the kind of story you want right now. The app weighs your
            preferences, compares them against a curated catalog, and gives you
            a ranked shortlist with useful book links.
          </p>
          <AppLink className="primary-link" to="/quiz/genre">
            Start the finder
          </AppLink>
        </div>
        <div className="hero-stat" aria-label="Recommendation ingredients">
          <span>01</span>
          <strong>Reading mood</strong>
          <span>02</span>
          <strong>Weighted matching</strong>
          <span>03</span>
          <strong>Shareable result</strong>
        </div>
      </section>
    </main>
  );
}
