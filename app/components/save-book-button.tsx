import { useEffect, useState } from "react";

import { isBookSaved, toggleSavedBook } from "../data/library-storage";
import type { RecommendedBook } from "../data/recommendations";

export function SaveBookButton({ book }: { book: RecommendedBook }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookSaved(book.id));
  }, [book.id]);

  return (
    <button
      aria-pressed={saved}
      onClick={() => setSaved(toggleSavedBook(book))}
      type="button"
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}
