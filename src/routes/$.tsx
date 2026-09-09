import { createFileRoute, notFound } from "@tanstack/react-router";
import { getPageFn } from "~/features/pages/functions";

const RouteComponent = () => {
  const { page } = Route.useLoaderData();

  return <div>{page.slug}</div>;
};

export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    if (!params._splat) {
      throw notFound();
    }

    const page = await getPageFn({ data: { slug: params._splat } });

    return { page };
  },
  component: RouteComponent,
});
