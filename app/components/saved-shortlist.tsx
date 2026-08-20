import { useEffect, useState } from "react";
import { AppLink } from "./app-link";
import { getBookDetailHref } from "../data/media";
import { getSavedBooks, type SavedBook } from "../data/library-storage";

export function SavedShortlist() {
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);

  useEffect(() => {
    function syncSavedBooks() {
      setSavedBooks(getSavedBooks());
    }

    syncSavedBooks();
    window.addEventListener("book-library-change", syncSavedBooks);
    window.addEventListener("storage", syncSavedBooks);

    return () => {
      window.removeEventListener("book-library-change", syncSavedBooks);
      window.removeEventListener("storage", syncSavedBooks);
    };
  }, []);

  if (!savedBooks.length) {
    return null;
  }

  return (
    <aside className="saved-rail" aria-label="Saved shortlist">
      <p className="kicker">Saved shortlist</p>
      <div className="saved-list">
        {savedBooks.slice(0, 4).map((book) => (
          <AppLink key={book.id} to={getBookDetailHref(book)}>
            <img src={book.cover} alt="" />
            <span>{book.title}</span>
          </AppLink>
        ))}
      </div>
    </aside>
  );
}
