import { z } from "zod";

export const FollowUpSchema = z.object({
  treatment: z.string().optional(),
  currentSymptoms: z.string().optional(),
  notes: z.string().optional(),
  scheduled: z.coerce.date(),
  suggestedAnalysis: z.string().optional(),
});
