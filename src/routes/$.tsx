import { Markdown } from "@tanstack/markdown/react";
import { useAsyncDebouncer } from "@tanstack/react-pacer";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { getPageFn, savePageFn } from "~/features/pages/functions";
import { MAX_CONTENT_LENGTH } from "~/features/pages/schemas";

const AUTOSAVE_DELAY_MS = 800;

const RouteComponent = () => {
  const { page } = Route.useLoaderData();
  const savePage = useServerFn(savePageFn);
  const [content, setContent] = useState(page.content);
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
    <div className="editor">
      <textarea
        className="editor-input"
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        maxLength={MAX_CONTENT_LENGTH}
      />
      <div className="editor-preview">
        <Markdown>{content}</Markdown>
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
        title: loaderData
          ? `${loaderData.page.slug} - Slug Pages`
          : "Slug Pages",
      },
    ],
  }),
  component: RouteComponent,
});
