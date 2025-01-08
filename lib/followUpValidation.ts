import { z } from "zod";

export const FollowUpSchema = z.object({
  diagnosis: z.string(),
  treatment: z.string().optional(),
  currentSymptoms: z.string().optional(),
  notes: z.string().optional(),
  physicalEmotionalCondition: z.string().optional(),
  scheduled: z.coerce.date(),
  suggestedAnalysis: z.string().optional(),
});
