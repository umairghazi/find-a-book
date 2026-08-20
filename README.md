# Found You a Book

[![Netlify Status](https://api.netlify.com/api/v1/badges/0af8c98c-6780-49c5-8aac-9c88df653356/deploy-status)](https://app.netlify.com/projects/upbeat-mayer-e06e8a/deploys)

A guided book recommendation app built with React and Vite.

The app helps readers choose stories based on genre, mood, and pacing. Each answer is encoded in the URL, so browser navigation works naturally and final recommendation shortlists are shareable.

## Project Structure

- `index.html` is the Vite HTML entrypoint.
- `app/main.tsx` renders the app and switches views from the current URL.
- `app/navigation.ts` wraps the browser History API.
- `app/views/home.tsx` contains the product entry screen.
- `app/views/quiz.tsx` renders each quiz step from URL state.
- `app/views/result.tsx` renders the final shareable recommendation shortlist.
- `app/views/book-detail.tsx` renders individual book detail pages.
- `app/components/save-book-button.tsx` and `app/components/saved-shortlist.tsx` provide local saved-book interactions.
- `app/data/quiz.ts` holds typed quiz steps and URL helpers.
- `app/data/recommendations.ts` turns quiz answers into Open Library searches, scores candidates, and explains the match.
- `app/data/media.ts` generates related media links for adaptations, interviews, reviews, and adjacent games.
- `app/data/library-storage.ts` manages saved and hidden books in localStorage.
- `app/styles.css` contains the visual system.

## React Concepts Used

- URL-derived view state: paths like `/quiz/pace/romance/warm` preserve quiz progress.
- `useEffect`: loads recommendations and book details from Open Library.
- `useMemo`: filters ranked results after hiding weak matches.
- Local component state: handles loading, hidden books, and saved-book button state.
- LocalStorage: persists saved and hidden books without accounts.

## Local Development

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run build
```

## Recommendation Model

The recommendation system is dynamic rather than catalog-driven. Quiz answers become search signals, Open Library returns candidate books, and the app scores candidates based on subject matches, cover availability, reader rating, and catalog popularity.

The result route also explains why a book was chosen. If Open Library is unavailable, the app uses a small genre-level fallback so the experience still completes.

Each recommended book links to a detail page. Detail pages fetch Open Library work data when a work ID is available, then add outbound media searches for trailers, adaptations, author interviews, podcasts, reviews, and related games or interactive fiction.

Readers can save books to a local shortlist, hide weak matches, and refresh the top pick from the ranked candidate pool. These are local-only interactions for now; they do not require accounts or a backend.

Planned next improvements:

- Add more quiz dimensions.
- Add a real media provider integration for richer adaptation data.
- Add tests for matching logic and the quiz flow.
- Add a Netlify deployment config for the new RRv7 build output.
