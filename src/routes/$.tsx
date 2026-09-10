import { useAsyncDebouncer } from "@tanstack/react-pacer";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getPageFn, savePageFn } from "~/features/pages/functions";
import { MAX_CONTENT_LENGTH } from "~/features/pages/schemas";

const AUTOSAVE_DELAY_MS = 800;

const RouteComponent = () => {
  const { page } = Route.useLoaderData();
  const savePage = useServerFn(savePageFn);
  const [content, setContent] = useState(page.content);

  const debouncer = useAsyncDebouncer(
    (value: string) => savePage({ data: { slug: page.slug, content: value } }),
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
    <textarea
      value={content}
      onChange={(e) => handleChange(e.target.value)}
      maxLength={MAX_CONTENT_LENGTH}
    />
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
