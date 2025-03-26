import { z } from "zod";

export const NewReminderSchema = z.object({
    appointmentId: z.string().optional(),
    userId: z.string().optional(),
    message: z.string().min(2, "El mensaje debe tener al menos 2 caracteres").max(500, "El mensaje debe tener como máximo 500 caracteres"),
    status: z.enum(['pending', 'sent', 'failed', 'canceled']),
    scheduledFor: z.coerce.date(),
  });