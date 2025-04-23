import { z } from "zod";

export const CreateAppointmentSchema = z.object({
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const RescheduleAppointmentSchema = z.object({
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const NewPastAppointmentSchema = z.object({
  diagnosis: z.string(),
  prescription: z.string().optional(),
  notes: z.string().optional(),
  followUpRequired: z.boolean().optional(),
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
