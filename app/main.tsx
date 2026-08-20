import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { BookDetailPage } from "./views/book-detail";
import { HomePage } from "./views/home";
import { QuizPage } from "./views/quiz";
import { ResultPage } from "./views/result";
import { getPath } from "./navigation";
import "./styles.css";

function App() {
  const [path, setPath] = useState(getPath());

  useEffect(() => {
    function syncPath() {
      setPath(getPath());
      window.scrollTo(0, 0);
    }

    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  if (path === "/") {
    return <HomePage />;
  }

  if (path.startsWith("/quiz/")) {
    return <QuizPage path={path} />;
  }

  if (path.startsWith("/result/")) {
    return <ResultPage path={path} />;
  }

  if (path.startsWith("/book/")) {
    return <BookDetailPage path={path} />;
  }

  return <HomePage />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
