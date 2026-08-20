import { AppLink } from "../components/app-link";
import { navigate } from "../navigation";
import { getNextQuizHref, getStepBySlug, quizSteps } from "../data/quiz";

export function QuizPage({ path }: { path: string }) {
  const [stepSlug = "", ...answers] = path.replace(/^\/quiz\/?/, "").split("/").filter(Boolean);
  const answerPath = answers.join("/");
  const step = getStepBySlug(stepSlug);

  if (!step) {
    navigate("/quiz/genre");
    return null;
  }

  const stepIndex = quizSteps.findIndex((item) => item.slug === step.slug);

  return (
    <main className="app-shell">
      <section className="experience" aria-labelledby="quiz-title">
        <div className="quiz-panel">
          <div className="progress-row">
            <span>{step.eyebrow}</span>
            <span>
              {stepIndex + 1} / {quizSteps.length}
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${((stepIndex + 1) / quizSteps.length) * 100}%` }}
            />
          </div>
          <h1 id="quiz-title">{step.title}</h1>
          <div className="option-grid">
            {step.options.map((option) => (
              <AppLink
                className="option-card"
                key={option.id}
                to={getNextQuizHref(`${step.slug}/${answerPath}`, option.id)}
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </AppLink>
            ))}
          </div>
          <AppLink className="text-link" to="/">
            Start over
          </AppLink>
        </div>
      </section>
    </main>
  );
}
