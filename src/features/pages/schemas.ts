import { z } from "zod";

export const GetPageInputSchema = z.object({
  slug: z.string().min(1),
});

export const SavePageInputSchema = z.object({
  slug: z.string().min(1),
  content: z.string().max(100_000),
  expectedUpdatedAt: z.date().nullable(),
  force: z.boolean().optional(),
});
