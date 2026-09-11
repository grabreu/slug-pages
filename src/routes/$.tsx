import { Markdown } from "@tanstack/markdown/react";
import { useAsyncDebouncer } from "@tanstack/react-pacer";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { getPageFn, savePageFn } from "~/features/pages/functions";
import { MAX_CONTENT_LENGTH } from "~/features/pages/schemas";

const AUTOSAVE_DELAY_MS = 800;
const REPO_URL = "https://github.com/grabreu/slug-pages";

const RouteComponent = () => {
  const { page } = Route.useLoaderData();
  const savePage = useServerFn(savePageFn);
  const [content, setContent] = useState(page.content);
  const [showPreview, setShowPreview] = useState(true);
  const expectedUpdatedAtRef = useRef(page.updatedAt);

  const debouncer = useAsyncDebouncer(
    async (value: string) => {
      const result = await savePage({
        data: {
          slug: page.slug,
          content: value,
          expectedUpdatedAt: expectedUpdatedAtRef.current,
        },
      });

      if (result.ok) {
        expectedUpdatedAtRef.current = result.updatedAt;
        return;
      }

      const keepMine = window.confirm(
        "This page changed elsewhere since you started editing. OK to keep your version (overwrite), Cancel to load the latest version instead.",
      );

      if (keepMine) {
        const forced = await savePage({
          data: {
            slug: page.slug,
            content: value,
            expectedUpdatedAt: null,
            force: true,
          },
        });
        if (forced.ok) {
          expectedUpdatedAtRef.current = forced.updatedAt;
        }
      } else {
        setContent(result.current.content);
        expectedUpdatedAtRef.current = result.current.updatedAt;
      }
    },
    {
      wait: AUTOSAVE_DELAY_MS,
      onUnmount: (d) => {
        d.flush();
      },
    },
  );

  const handleChange = (value: string) => {
    setContent(value);
    debouncer.maybeExecute(value);
  };

  return (
    <div className="editor-page">
      <div className="appbar">
        <Link to="/" className="appbar-title">
          Slug Pages
        </Link>
        <label className="appbar-toggle">
          <input
            type="checkbox"
            checked={showPreview}
            onChange={(e) => setShowPreview(e.target.checked)}
          />
          Markdown Preview
        </label>
        <a
          className="appbar-github"
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span className="sr-only">View source on GitHub</span>
        </a>
      </div>
      <div className="editor">
        <textarea
          className="editor-input"
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          maxLength={MAX_CONTENT_LENGTH}
        />
        {showPreview && (
          <div className="editor-preview">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    if (!params._splat) {
      throw notFound();
    }
    const page = await getPageFn({ data: { slug: params._splat } });
    return { page };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData ? `${loaderData.page.slug} - Slug Pages` : undefined,
      },
    ],
  }),
  component: RouteComponent,
});
