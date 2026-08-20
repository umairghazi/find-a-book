export type RecommendationSignals = {
  genre: string;
  mood: string;
  pace: string;
};

export type RecommendedBook = {
  id: string;
  title: string;
  author: string;
  year: string;
  cover: string;
  subjects: string[];
  openLibraryUrl: string;
  source: "open-library" | "fallback";
};

export type RecommendationResult = {
  book: RecommendedBook;
  score: number;
  reasons: string[];
};

type OpenLibrarySearchResponse = {
  docs?: OpenLibraryDoc[];
};

type OpenLibraryDoc = {
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  key?: string;
  subject?: string[];
  ratings_average?: number;
  already_read_count?: number;
  edition_count?: number;
};

const signalSubjects: Record<string, string[]> = {
  romance: ["romance", "love stories"],
  thriller: ["thriller", "suspense", "mystery"],
  speculative: ["science fiction", "fantasy", "dystopia"],
  warm: ["humor", "friendship", "coming of age"],
  intense: ["suspense", "crime", "psychological fiction"],
  haunting: ["literary fiction", "dystopia", "memory"],
  brisk: ["adventure", "suspense"],
  balanced: ["fiction", "classic"],
  "slow-burn": ["literary fiction", "classic"],
};

const fallbackBooks: Record<string, RecommendedBook[]> = {
  romance: [
    {
      id: "fallback-pride-and-prejudice",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      year: "1813",
      cover: "https://covers.openlibrary.org/b/id/12645114-L.jpg",
      subjects: ["romance", "classic", "witty"],
      openLibraryUrl: "https://openlibrary.org/search?title=Pride+and+Prejudice&author=Jane+Austen",
      source: "fallback",
    },
    {
      id: "fallback-jane-eyre",
      title: "Jane Eyre",
      author: "Charlotte Bronte",
      year: "1847",
      cover: "https://covers.openlibrary.org/b/id/12818862-L.jpg",
      subjects: ["romance", "gothic", "classic"],
      openLibraryUrl: "https://openlibrary.org/search?title=Jane+Eyre&author=Charlotte+Bronte",
      source: "fallback",
    },
    {
      id: "fallback-bridget-jones-diary",
      title: "Bridget Jones's Diary",
      author: "Helen Fielding",
      year: "1996",
      cover: "https://covers.openlibrary.org/b/id/8578467-L.jpg",
      subjects: ["romance", "humor", "contemporary"],
      openLibraryUrl:
        "https://openlibrary.org/search?title=Bridget+Jones%27s+Diary&author=Helen+Fielding",
      source: "fallback",
    },
  ],
  thriller: [
    {
      id: "fallback-and-then-there-were-none",
      title: "And Then There Were None",
      author: "Agatha Christie",
      year: "1939",
      cover: "https://covers.openlibrary.org/b/id/12060150-L.jpg",
      subjects: ["thriller", "mystery", "classic"],
      openLibraryUrl:
        "https://openlibrary.org/search?title=And+Then+There+Were+None&author=Agatha+Christie",
      source: "fallback",
    },
    {
      id: "fallback-gone-girl",
      title: "Gone Girl",
      author: "Gillian Flynn",
      year: "2012",
      cover: "https://covers.openlibrary.org/b/id/13321360-L.jpg",
      subjects: ["thriller", "psychological fiction", "suspense"],
      openLibraryUrl: "https://openlibrary.org/search?title=Gone+Girl&author=Gillian+Flynn",
      source: "fallback",
    },
    {
      id: "fallback-the-lincoln-lawyer",
      title: "The Lincoln Lawyer",
      author: "Michael Connelly",
      year: "2005",
      cover: "https://covers.openlibrary.org/b/id/8235111-L.jpg",
      subjects: ["thriller", "legal", "crime"],
      openLibraryUrl:
        "https://openlibrary.org/search?title=The+Lincoln+Lawyer&author=Michael+Connelly",
      source: "fallback",
    },
  ],
  speculative: [
    {
      id: "fallback-the-left-hand-of-darkness",
      title: "The Left Hand of Darkness",
      author: "Ursula K. Le Guin",
      year: "1969",
      cover: "https://covers.openlibrary.org/b/id/9255566-L.jpg",
      subjects: ["science fiction", "literary fiction", "politics"],
      openLibraryUrl:
        "https://openlibrary.org/search?title=The+Left+Hand+of+Darkness&author=Ursula+K.+Le+Guin",
      source: "fallback",
    },
    {
      id: "fallback-the-martian",
      title: "The Martian",
      author: "Andy Weir",
      year: "2011",
      cover: "https://covers.openlibrary.org/b/id/8464876-L.jpg",
      subjects: ["science fiction", "survival", "humor"],
      openLibraryUrl: "https://openlibrary.org/search?title=The+Martian&author=Andy+Weir",
      source: "fallback",
    },
    {
      id: "fallback-never-let-me-go",
      title: "Never Let Me Go",
      author: "Kazuo Ishiguro",
      year: "2005",
      cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
      subjects: ["science fiction", "literary fiction", "memory"],
      openLibraryUrl:
        "https://openlibrary.org/search?title=Never+Let+Me+Go&author=Kazuo+Ishiguro",
      source: "fallback",
    },
  ],
};

export async function recommendBooks(
  answers: string[],
  limit = 5,
): Promise<RecommendationResult[]> {
  const signals = toSignals(answers);
  const docs = await searchCandidates(signals);
  const ranked = docs
    .map((doc) => scoreCandidate(doc, signals))
    .filter((result) => result.score > 0)
    .filter(isUniqueResult)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return ranked.length ? ranked : getFallbackResults(signals, limit);
}

function toSignals(answers: string[]): RecommendationSignals {
  return {
    genre: answers[0] ?? "romance",
    mood: answers[1] ?? "warm",
    pace: answers[2] ?? "balanced",
  };
}

async function searchCandidates(signals: RecommendationSignals) {
  const subjects = [
    ...signalSubjects[signals.genre],
    ...signalSubjects[signals.mood],
    ...signalSubjects[signals.pace],
  ];
  const params = new URLSearchParams({
    subject: subjects.slice(0, 4).join(" "),
    language: "eng",
    limit: "40",
    fields:
      "key,title,author_name,first_publish_year,cover_i,subject,ratings_average,already_read_count,edition_count",
  });

  try {
    const response = await fetch(`https://openlibrary.org/search.json?${params}`);

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as OpenLibrarySearchResponse;
    return data.docs ?? [];
  } catch {
    return [];
  }
}

function scoreCandidate(
  doc: OpenLibraryDoc,
  signals: RecommendationSignals,
): RecommendationResult {
  const subjects = doc.subject ?? [];
  const normalizedSubjects = subjects.map(normalize);
  const reasons: string[] = [];
  let score = 0;

  for (const signal of [signals.genre, signals.mood, signals.pace]) {
    const matches = signalSubjects[signal].filter((subject) =>
      normalizedSubjects.some((candidate) => candidate.includes(normalize(subject))),
    );

    if (matches.length) {
      score += signal === signals.genre ? 8 : signal === signals.mood ? 5 : 3;
      reasons.push(`Matches ${signal.replace("-", " ")} through ${matches[0]}`);
    }
  }

  if (doc.cover_i) {
    score += 2;
  }

  if (doc.ratings_average && doc.ratings_average >= 3.7) {
    score += 2;
    reasons.push(`Reader rating ${doc.ratings_average.toFixed(1)} on Open Library`);
  }

  if ((doc.already_read_count ?? 0) > 1000 || (doc.edition_count ?? 0) > 20) {
    score += 1;
  }

  if (normalizedSubjects.some((subject) => subject.includes("juvenile"))) {
    score -= 4;
  }

  if (normalizedSubjects.some((subject) => subject.includes("children"))) {
    score -= 3;
  }

  return {
    book: {
      id: doc.key?.replace("/works/", "") ?? slugify(doc.title ?? "untitled"),
      title: doc.title ?? "Untitled",
      author: doc.author_name?.[0] ?? "Unknown author",
      year: doc.first_publish_year?.toString() ?? "Unknown year",
      cover: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        : "https://covers.openlibrary.org/b/id/12645114-L.jpg",
      subjects: subjects.slice(0, 6),
      openLibraryUrl: doc.key ? `https://openlibrary.org${doc.key}` : "https://openlibrary.org",
      source: "open-library",
    },
    score,
    reasons,
  };
}

function getFallbackResults(
  signals: RecommendationSignals,
  limit: number,
): RecommendationResult[] {
  const books = fallbackBooks[signals.genre] ?? fallbackBooks.romance;

  return books.slice(0, limit).map((book) => ({
    book,
    score: 1,
    reasons: ["Using a reliable fallback while live recommendations are unavailable"],
  }));
}

function isUniqueResult(
  result: RecommendationResult,
  index: number,
  results: RecommendationResult[],
) {
  const key = normalize(`${result.book.title} ${result.book.author}`);
  return (
    results.findIndex(
      (candidate) => normalize(`${candidate.book.title} ${candidate.book.author}`) === key,
    ) === index
  );
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function slugify(value: string) {
  return normalize(value).replace(/\s+/g, "-");
}
