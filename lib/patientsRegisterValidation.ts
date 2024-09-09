import { z } from "zod";
export const PatientFormValidation = z.object({
  // personal
  firstName: z
    .string()
    .min(6, "El nombre debe tener al menos 6 caracteres")
    .max(50, "El nombre debe tener como máximo 50 caracteres"),
  lastName: z
    .string()
    .min(6, "El apellido debe tener al menos 6 caracteres")
    .max(50, "El apellido debe tener como máximo 50 caracteres"),
  address: z
    .string()
    .min(6, "Dirección debe tener al menos 6 caracteres")
    .max(500, "Dirección debe tener como máximo 500 caracteres"),
  occupation: z
    .string()
    .min(6, "Ocupación debe tener al menos 6 caracteres")
    .max(500, "Ocupación debe tener al menos 500 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .refine(
      (phone) => /^\+\d{10,15}$/.test(phone),
      "Número de teléfono inválido"
    ),
  birthDate: z.coerce.date(),
  gender: z.enum(["M", "F", "X"]),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number"
    ),
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  insuranceProvider: z
    .string()
    .min(2, "Insurance name must be at least 2 characters")
    .max(50, "Insurance name must be at most 50 characters"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Policy number must be at least 2 characters")
    .max(50, "Policy number must be at most 50 characters"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
});
