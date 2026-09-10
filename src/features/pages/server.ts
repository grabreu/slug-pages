import { and, eq } from "drizzle-orm";
import { db } from "~/db/client";
import { pages } from "~/db/schema";

export const getPage = async (slug: string) => {
  const row = await db.query.pages.findFirst({
    where: eq(pages.slug, slug),
  });
  if (!row) {
    return { slug, content: "", updatedAt: null };
  }
  return row;
};

export const savePageIfUnchanged = async (
  slug: string,
  content: string,
  expectedUpdatedAt: Date | null,
) => {
  const now = new Date();
  if (expectedUpdatedAt === null) {
    const [row] = await db
      .insert(pages)
      .values({ slug, content, updatedAt: now })
      .onConflictDoNothing()
      .returning();
    return row;
  }
  const [row] = await db
    .update(pages)
    .set({ content, updatedAt: now })
    .where(and(eq(pages.slug, slug), eq(pages.updatedAt, expectedUpdatedAt)))
    .returning();
  return row;
};

export const forceSavePage = async (slug: string, content: string) => {
  const now = new Date();
  const [row] = await db
    .insert(pages)
    .values({ slug, content, updatedAt: now })
    .onConflictDoUpdate({
      target: pages.slug,
      set: { content, updatedAt: now },
    })
    .returning();
  return row;
};
