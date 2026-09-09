import { eq } from "drizzle-orm";
import { db } from "~/db/client";
import { pages } from "~/db/schema";

export const getPage = async (slug: string) => {
  const page = await db.query.pages.findFirst({
    where: eq(pages.slug, slug),
  });

  if (!page) {
    return { slug, content: "", updatedAt: null };
  }

  return page;
};

export const savePage = async (slug: string, content: string) => {
  const [row] = await db
    .insert(pages)
    .values({ slug, content })
    .onConflictDoUpdate({
      target: pages.slug,
      set: {
        content,
        updatedAt: new Date(),
      },
    })
    .returning();

  return row;
};
