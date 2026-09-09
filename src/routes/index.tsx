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
    <main className="landing">
      <form className="landing-bar" onSubmit={handleSubmit}>
        <span className="landing-bar-domain">slug-pages.grabreu.dev/</span>
        <input
          className="landing-bar-input"
          type="text"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="anything"
          aria-label="Page name"
        />
      </form>
      <p className="landing-hint">or just type it in the address bar</p>
    </main>
  );
};

export const Route = createFileRoute("/")({
  component: RouteComponent,
});
