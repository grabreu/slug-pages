import { z } from "zod";

export const GetPageInputSchema = z.object({
  slug: z.string().min(1),
});

export const SavePageInputSchema = z.object({
  slug: z.string().min(1),
  content: z.string(),
});
