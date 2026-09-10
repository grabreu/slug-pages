import { z } from "zod";

export const GetPageInputSchema = z.object({
  slug: z.string().min(1),
});

export const MAX_CONTENT_LENGTH = 100_000;

export const SavePageInputSchema = z.object({
  slug: z.string().min(1),
  content: z.string().max(MAX_CONTENT_LENGTH),
  expectedUpdatedAt: z.date().nullable(),
  force: z.boolean().optional(),
});
