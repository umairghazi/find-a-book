import type { RecommendedBook } from "./recommendations";

export type MediaLink = {
  label: string;
  provider: string;
  description: string;
  url: string;
};

export function getMediaLinks(book: Pick<RecommendedBook, "title" | "author">): MediaLink[] {
  const title = `${book.title} ${book.author}`;

  return [
    {
      label: "Trailers & adaptations",
      provider: "YouTube",
      description: "Search YouTube for trailers, scenes, and screen adaptations.",
      url: youtubeSearch(`${title} trailer adaptation`),
    },
    {
      label: "Author interviews",
      provider: "YouTube",
      description: "Find talks, interviews, and readings from or about the author.",
      url: youtubeSearch(`${book.author} interview ${book.title}`),
    },
    {
      label: "Podcasts & reviews",
      provider: "YouTube",
      description: "Search podcast episodes and video essays discussing the book.",
      url: youtubeSearch(`${title} book review podcast discussion`),
    },
    {
      label: "Related games",
      provider: "Web",
      description: "Look for video games, interactive fiction, or tabletop games with similar themes.",
      url: googleSearch(`${book.title} ${book.author} related video game interactive fiction tabletop game`),
    },
    {
      label: "Screen adaptation data",
      provider: "Web",
      description: "Search for films, series, cast details, and adaptation history.",
      url: googleSearch(`${book.title} ${book.author} film television adaptation cast`),
    },
    {
      label: "Reading guides",
      provider: "Web",
      description: "Find discussion guides, themes, and book club material.",
      url: googleSearch(`${book.title} ${book.author} reading guide themes discussion questions`),
    },
  ];
}

function youtubeSearch(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function googleSearch(query: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function getBookDetailHref(book: RecommendedBook) {
  const params = new URLSearchParams({
    title: book.title,
    author: book.author,
    year: book.year,
    cover: book.cover,
  });

  return `/book/${encodeURIComponent(book.id)}?${params.toString()}`;
}
