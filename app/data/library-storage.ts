import type { RecommendedBook } from "./recommendations";

export type SavedBook = RecommendedBook & {
  savedAt: string;
};

const savedKey = "found-you-a-book:saved";
const hiddenKey = "found-you-a-book:hidden";

export function getSavedBooks() {
  return readJson<SavedBook[]>(savedKey, []);
}

export function isBookSaved(bookId: string) {
  return getSavedBooks().some((book) => book.id === bookId);
}

export function toggleSavedBook(book: RecommendedBook) {
  const savedBooks = getSavedBooks();
  const existing = savedBooks.some((savedBook) => savedBook.id === book.id);
  const nextBooks = existing
    ? savedBooks.filter((savedBook) => savedBook.id !== book.id)
    : [{ ...book, savedAt: new Date().toISOString() }, ...savedBooks];

  writeJson(savedKey, nextBooks);
  return !existing;
}

export function getHiddenBookIds() {
  return readJson<string[]>(hiddenKey, []);
}

export function hideBook(bookId: string) {
  const hiddenIds = getHiddenBookIds();

  if (!hiddenIds.includes(bookId)) {
    writeJson(hiddenKey, [...hiddenIds, bookId]);
  }
}

export function clearHiddenBooks() {
  writeJson(hiddenKey, []);
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("book-library-change"));
}
