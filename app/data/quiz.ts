export type QuizOption = {
  id: string;
  label: string;
  description: string;
};

export type QuizStep = {
  slug: string;
  eyebrow: string;
  title: string;
  options: QuizOption[];
};

export const quizSteps: QuizStep[] = [
  {
    slug: "genre",
    eyebrow: "Shelf one",
    title: "What world do you want to step into?",
    options: [
      {
        id: "romance",
        label: "Romance",
        description: "Emotional stakes, longing, wit, and memorable relationships.",
      },
      {
        id: "thriller",
        label: "Thriller",
        description: "Secrets, reversals, investigations, and page-turning tension.",
      },
      {
        id: "speculative",
        label: "Speculative",
        description: "Dystopias, futures, alternate histories, and strange premises.",
      },
    ],
  },
  {
    slug: "mood",
    eyebrow: "Shelf two",
    title: "What kind of emotional weather sounds right?",
    options: [
      {
        id: "warm",
        label: "Warm",
        description: "Hopeful, charming, or comforting without being weightless.",
      },
      {
        id: "intense",
        label: "Intense",
        description: "High pressure, big consequences, and a little edge.",
      },
      {
        id: "haunting",
        label: "Haunting",
        description: "Reflective, layered, and likely to stay with you afterward.",
      },
    ],
  },
  {
    slug: "pace",
    eyebrow: "Shelf three",
    title: "How fast should it move?",
    options: [
      {
        id: "brisk",
        label: "Brisk",
        description: "Short chapters, clear momentum, and quick payoff.",
      },
      {
        id: "balanced",
        label: "Balanced",
        description: "A mix of plot, character, and room to breathe.",
      },
      {
        id: "slow-burn",
        label: "Slow burn",
        description: "Atmosphere, depth, and a payoff that builds patiently.",
      },
    ],
  },
];

export function getStepBySlug(slug: string) {
  return quizSteps.find((step) => step.slug === slug.split("/")[0]);
}

export function getNextQuizHref(stepSlug: string, optionId: string) {
  const [slug] = stepSlug.split("/");
  const stepIndex = quizSteps.findIndex((step) => step.slug === slug);
  const nextStep = quizSteps[stepIndex + 1];
  const currentAnswers = getAnswersFromStepSlug(stepSlug);
  const nextAnswers = [...currentAnswers, optionId];

  if (nextStep) {
    return `/quiz/${[nextStep.slug, ...nextAnswers].join("/")}`;
  }

  return `/result/${nextAnswers.join("/")}`;
}

export function decodeAnswerPath(answerPath: string) {
  return answerPath.split("/").filter(Boolean);
}

function getAnswersFromStepSlug(stepSlug: string) {
  const [, ...answers] = stepSlug.split("/").filter(Boolean);
  return answers;
}
