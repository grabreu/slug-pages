import { createServerFn } from "@tanstack/react-start";
import { GetPageInputSchema, SavePageInputSchema } from "./schemas";
import { getPage, savePage } from "./server";

export const getPageFn = createServerFn({ method: "GET" })
  .validator(GetPageInputSchema)
  .handler(async ({ data }) => {
    return await getPage(data.slug);
  });

export const savePageFn = createServerFn({ method: "POST" })
  .validator(SavePageInputSchema)
  .handler(async ({ data }) => {
    return await savePage(data.slug, data.content);
  });
