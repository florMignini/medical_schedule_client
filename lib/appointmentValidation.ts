import { z } from "zod";

export const CreateAppointmentSchema = z
  .object({
    schedule: z.coerce.date(),
    reason: z.string().min(2).max(500),
    notes: z.string().optional(),
    cancellationReason: z.string().optional(),
    patientId: z.string().min(1, "Patient must be selected"),

    // ✅ nuevo
    isPastAppointment: z.boolean().optional(),

    // ✅ nuevo (clínico) — opcional salvo que isPastAppointment sea true
    pastAppointment: z
      .object({
        diagnosis: z.string().optional(),
        prescription: z.string().optional(),
        notes: z.string().optional(),
        followUpRequired: z.boolean().optional(),
        patientAttachedFilesUrl: z.custom<File[]>().optional(),

        // legacy: tu front lo tiene, backend lo ignora/forza
        scheduled: z.coerce.date().optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isPastAppointment) {
      if (!data.pastAppointment) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pastAppointment"],
          message:
            "Para una cita espontánea necesitás completar los datos clínicos.",
        });
        return;
      }

      if (
        !data.pastAppointment.diagnosis ||
        data.pastAppointment.diagnosis.trim().length < 2
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pastAppointment", "diagnosis"],
          message: "Diagnóstico requerido para una cita espontánea.",
        });
      }

      // opcional: evitar futuro en el front (igual el backend valida)
      const now = new Date();
      if (data.schedule.getTime() > now.getTime() + 5 * 60 * 1000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["schedule"],
          message: "Una cita espontánea no puede ser futura.",
        });
      }
    }
  });

export const RescheduleAppointmentSchema = z.object({
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
  patientId: z.string().min(1, "Patient must be selected").optional(),
});

export const NewPastAppointmentSchema = z.object({
  diagnosis: z.string(),
  prescription: z.string().optional(),
  notes: z.string().optional(),
  scheduled: z.coerce.date(),
  patientAttachedFilesUrl: z.custom<File[]>().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  patientId: z.string().min(1, "Patient must be selected"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return RescheduleAppointmentSchema;
  }
}
