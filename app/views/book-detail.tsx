import { useEffect, useState } from "react";

import { AppLink } from "../components/app-link";
import { SaveBookButton } from "../components/save-book-button";
import { getMediaLinks } from "../data/media";
import type { RecommendedBook } from "../data/recommendations";

type WorkResponse = {
  title?: string;
  description?: string | { value?: string };
  subjects?: string[];
  covers?: number[];
  first_publish_date?: string;
};

type BookDetail = {
  id: string;
  title: string;
  author: string;
  year: string;
  cover: string;
  description: string;
  subjects: string[];
  openLibraryUrl: string;
  source: "open-library" | "fallback";
};

export function BookDetailPage({ path }: { path: string }) {
  const [book, setBook] = useState<BookDetail | null>(null);

  useEffect(() => {
    let active = true;
    const url = new URL(window.location.href);
    const bookId = decodeURIComponent(path.replace(/^\/book\/?/, ""));
    const fallback = {
      title: url.searchParams.get("title") ?? "Untitled",
      author: url.searchParams.get("author") ?? "Unknown author",
      year: url.searchParams.get("year") ?? "Unknown year",
      cover: url.searchParams.get("cover") ?? "https://covers.openlibrary.org/b/id/12645114-L.jpg",
    };

    setBook(null);
    getBookDetail(bookId, fallback).then((nextBook) => {
      if (active) {
        setBook(nextBook);
      }
    });

    return () => {
      active = false;
    };
  }, [path]);

  if (!book) {
    return (
      <main className="app-shell">
        <section className="experience empty-state">
          <p className="kicker">Loading details</p>
          <h1>Opening the catalog page...</h1>
        </section>
      </main>
    );
  }

  const saveableBook: RecommendedBook = {
    id: book.id,
    title: book.title,
    author: book.author,
    year: book.year,
    cover: book.cover,
    subjects: book.subjects,
    openLibraryUrl: book.openLibraryUrl,
    source: book.source,
  };
  const mediaLinks = getMediaLinks(book);
  const similarSearchUrl = makeSearchUrl(book.subjects.slice(0, 2).join(" "), book.author);

  return (
    <main className="app-shell">
      <section className="experience">
        <article className="book-detail">
          <div className="cover-wrap">
            <img src={book.cover} alt="" />
          </div>
          <div className="result-copy">
            <p className="kicker">Book details</p>
            <h1>{book.title}</h1>
            <p className="byline">
              {book.author} · {book.year}
            </p>
            <p>{book.description}</p>
            <div className="tag-row" aria-label="Book subjects">
              {book.subjects.map((subject) => (
                <span key={subject}>{subject}</span>
              ))}
            </div>
            <div className="action-row">
              <SaveBookButton book={saveableBook} />
              <a href={book.openLibraryUrl}>Open Library</a>
              <AppLink to="/quiz/genre">Find another book</AppLink>
            </div>
          </div>
        </article>
        <div className="detail-columns">
          <section>
            <p className="kicker">Overview</p>
            <h2>Catalog signal</h2>
            <p>
              Source: {book.source === "open-library" ? "Open Library work data" : "saved recommendation metadata"}.
              The subjects below are used as the bridge to similar reads and adjacent media.
            </p>
          </section>
          <section>
            <p className="kicker">Editions</p>
            <h2>Find a readable copy</h2>
            <p>
              Use Open Library for editions, borrowing options, linked scans, and catalog metadata.
            </p>
            <a href={book.openLibraryUrl}>View editions</a>
          </section>
          <section>
            <p className="kicker">Similar reads</p>
            <h2>Follow the subject trail</h2>
            <p>
              Search by the strongest subject signals from this book and compare nearby works.
            </p>
            <a href={similarSearchUrl}>Search similar books</a>
          </section>
        </div>
        <div className="detail-section">
          <p className="kicker">More media</p>
          <h2>Adaptations, interviews, reviews, and adjacent worlds.</h2>
          <div className="media-grid">
            {mediaLinks.map((link) => (
              <a href={link.url} key={link.label}>
                <em>{link.provider}</em>
                <strong>{link.label}</strong>
                <span>{link.description}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

async function getBookDetail(
  bookId: string,
  fallback: Pick<BookDetail, "title" | "author" | "year" | "cover">,
): Promise<BookDetail> {
  if (!/^OL\d+W$/.test(bookId)) {
    return {
      id: bookId,
      ...fallback,
      description: "Detailed catalog information is not available for this fallback recommendation yet.",
      subjects: [],
      openLibraryUrl: makeSearchUrl(fallback.title, fallback.author),
      source: "fallback",
    };
  }

  try {
    const response = await fetch(`https://openlibrary.org/works/${bookId}.json`);

    if (!response.ok) {
      throw new Error("Open Library detail request failed");
    }

    const work = (await response.json()) as WorkResponse;

    return {
      id: bookId,
      title: work.title ?? fallback.title,
      author: fallback.author,
      year: work.first_publish_date ?? fallback.year,
      cover: work.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${work.covers[0]}-L.jpg`
        : fallback.cover,
      description: getDescription(work.description),
      subjects: (work.subjects ?? []).slice(0, 10),
      openLibraryUrl: `https://openlibrary.org/works/${bookId}`,
      source: "open-library",
    };
  } catch {
    return {
      id: bookId,
      ...fallback,
      description: "Live catalog details are unavailable right now, but the saved recommendation metadata is still available.",
      subjects: [],
      openLibraryUrl: makeSearchUrl(fallback.title, fallback.author),
      source: "fallback",
    };
  }
}

function getDescription(description: WorkResponse["description"]) {
  if (!description) {
    return "No description is available from Open Library yet.";
  }

  return typeof description === "string" ? description : description.value ?? "";
}

function makeSearchUrl(title: string, author: string) {
  const params = new URLSearchParams({ title, author });
  return `https://openlibrary.org/search?${params.toString()}`;
}
