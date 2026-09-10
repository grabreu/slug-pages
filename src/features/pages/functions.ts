import { createServerFn } from "@tanstack/react-start";
import { GetPageInputSchema, SavePageInputSchema } from "./schemas";
import { forceSavePage, getPage, savePageIfUnchanged } from "./server";

export const getPageFn = createServerFn({ method: "GET" })
  .validator(GetPageInputSchema)
  .handler(async ({ data }) => {
    return await getPage(data.slug);
  });

export const savePageFn = createServerFn({ method: "POST" })
  .validator(SavePageInputSchema)
  .handler(async ({ data }) => {
    if (data.force) {
      const row = await forceSavePage(data.slug, data.content);
      return { ok: true as const, updatedAt: row.updatedAt };
    }

    const row = await savePageIfUnchanged(
      data.slug,
      data.content,
      data.expectedUpdatedAt,
    );

    if (!row) {
      const current = await getPage(data.slug);
      return {
        ok: false as const,
        conflict: true as const,
        current: { content: current.content, updatedAt: current.updatedAt },
      };
    }

    return { ok: true as const, updatedAt: row.updatedAt };
  });
