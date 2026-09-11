import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type SubmitEvent, useState } from "react";

const RouteComponent = () => {
  const navigate = useNavigate();
  const [slug, setSlug] = useState("");

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = slug.trim();
    if (trimmed) {
      navigate({ to: `/${trimmed}` });
    }
  };

  return (
    <div className="landing-page">
      <a
        className="landing-github"
        href="https://github.com/grabreu/slug-pages"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
        GitHub
      </a>
      <main className="landing">
        <img src="/favicon.svg" alt="" className="landing-logo" />
        <h1 className="landing-title">Slug Pages</h1>
        <p className="landing-tagline">
          A page is just a URL.
          <br />
          No account. No setup. Just type.
        </p>
        <form className="landing-bar" onSubmit={handleSubmit}>
          <span className="landing-bar-domain">slug-pages.grabreu.dev/</span>
          <input
            className="landing-bar-input"
            type="text"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="my-notes"
            aria-label="Page name"
          />
        </form>
        <p className="landing-hint">
          Type a name and press <kbd className="landing-kbd">Enter</kbd>
        </p>
      </main>
      <footer className="landing-footer">
        Anyone with the URL can access the page.
      </footer>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: RouteComponent,
});
