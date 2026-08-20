import { useEffect, useMemo, useState } from "react";

import { AppLink } from "../components/app-link";
import { SaveBookButton } from "../components/save-book-button";
import { SavedShortlist } from "../components/saved-shortlist";
import { hideBook } from "../data/library-storage";
import { getBookDetailHref, getMediaLinks } from "../data/media";
import { recommendBooks, type RecommendationResult } from "../data/recommendations";
import { decodeAnswerPath, quizSteps } from "../data/quiz";
import { navigate } from "../navigation";

export function ResultPage({ path }: { path: string }) {
  const answerPath = path.replace(/^\/result\/?/, "");
  const answers = decodeAnswerPath(answerPath);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    if (answers.length !== quizSteps.length) {
      navigate("/quiz/genre");
      return;
    }

    setLoading(true);
    setHiddenIds([]);
    recommendBooks(answers, 10).then((nextRecommendations) => {
      if (active) {
        setRecommendations(nextRecommendations);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [answerPath]);

  const visibleRecommendations = useMemo(
    () =>
      recommendations
        .filter((recommendation) => !hiddenIds.includes(recommendation.book.id))
        .slice(0, 5),
    [hiddenIds, recommendations],
  );

  if (loading) {
    return (
      <main className="app-shell">
        <section className="experience empty-state">
          <p className="kicker">Finding matches</p>
          <h1>Building your shortlist...</h1>
        </section>
      </main>
    );
  }

  const [topRecommendation, ...otherRecommendations] = visibleRecommendations;

  if (!topRecommendation) {
    return (
      <main className="app-shell">
        <section className="experience empty-state">
          <p className="kicker">No matches left</p>
          <h1>You hid every match in this set.</h1>
          <button type="button" onClick={() => setHiddenIds([])}>
            Restore matches
          </button>
        </section>
      </main>
    );
  }

  const { book } = topRecommendation;
  const mediaLinks = getMediaLinks(book);

  function hideRecommendation(recommendation: RecommendationResult) {
    hideBook(recommendation.book.id);
    setHiddenIds((current) => [...current, recommendation.book.id]);
  }

  function refreshTopPick() {
    setHiddenIds((current) => [...current, book.id]);
  }

  return (
    <main className="app-shell">
      <section className="experience">
        <SavedShortlist />
        <div className="result-heading">
          <p className="kicker">Your matches</p>
          <h1>Start with this one. Keep the shortlist handy.</h1>
        </div>
        <article className="result-panel">
          <div className="cover-wrap">
            <img src={book.cover} alt="" />
          </div>
          <div className="result-copy">
            <p className="kicker">Top pick</p>
            <h1>{book.title}</h1>
            <p className="byline">
              {book.author} · {book.year}
            </p>
            <p className="score-note">
              Recommendation score: {topRecommendation.score}. Source:{" "}
              {book.source === "open-library" ? "Open Library" : "fallback catalog"}.
            </p>
            <div className="reason-panel">
              <h2>Why this book?</h2>
              <ul>
                {topRecommendation.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
            <div className="tag-row" aria-label="Recommendation tags">
              {book.subjects.map((subject) => (
                <span key={subject}>{subject.replace("-", " ")}</span>
              ))}
            </div>
            <div className="action-row">
              <SaveBookButton book={book} />
              <AppLink to={getBookDetailHref(book)}>Book details</AppLink>
              <a href={book.openLibraryUrl}>Open Library</a>
              <button type="button" onClick={refreshTopPick}>
                Refresh top pick
              </button>
              <button type="button" onClick={() => hideRecommendation(topRecommendation)}>
                Hide
              </button>
              <AppLink to="/quiz/genre">Try another path</AppLink>
            </div>
            <div className="media-strip" aria-label="Related media links">
              {mediaLinks.map((link) => (
                <a href={link.url} key={link.label}>
                  <em>{link.provider}</em>
                  <strong>{link.label}</strong>
                  <span>{link.description}</span>
                </a>
              ))}
            </div>
          </div>
        </article>
        <div className="shortlist-grid" aria-label="More book matches">
          {otherRecommendations.map((recommendation, index) => (
            <article className="shortlist-card" key={`${recommendation.book.title}-${index}`}>
              <img src={recommendation.book.cover} alt="" />
              <div>
                <p className="kicker">Match {index + 2}</p>
                <h2>{recommendation.book.title}</h2>
                <p className="byline">
                  {recommendation.book.author} · {recommendation.book.year}
                </p>
                <p className="score-note">Score: {recommendation.score}</p>
                <div className="mini-actions">
                  <SaveBookButton book={recommendation.book} />
                  <button type="button" onClick={() => hideRecommendation(recommendation)}>
                    Hide
                  </button>
                </div>
                <AppLink to={getBookDetailHref(recommendation.book)}>Book details</AppLink>
                <a href={recommendation.book.openLibraryUrl}>Open Library</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
