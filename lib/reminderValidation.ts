import { z } from "zod";

export const NewReminderSchema = z.object({
    message: z.string().min(2, "El mensaje debe tener al menos 2 caracteres").max(500, "El mensaje debe tener como máximo 500 caracteres"),
    status: z.enum(['pending', 'sent', 'failed', 'canceled']),
    scheduledFor: z.coerce.date({
          required_error: "Por favor seleccione una fecha",
          invalid_type_error: "That's not a date!",
        }),
  });
