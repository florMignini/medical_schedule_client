import { z } from "zod";
export const patientsRegisterValidation = z.object({
  // personal
  firstName: z
    .string()
    .min(6, "El nombre debe tener al menos 6 caracteres")
    .max(50, "El nombre debe tener como máximo 50 caracteres"),
  lastName: z
    .string()
    .min(6, "El apellido debe tener al menos 6 caracteres")
    .max(50, "El apellido debe tener como máximo 50 caracteres"),
  patientPhoto: z.custom<File[]>().optional(),
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
  identificationType: z.enum(['DNI', 'Libreta de enrolamiento', 'pasaporte']),
  identityNumber: z.string().optional(),
  emergencyContactName: z
    .string()
    .min(6, "Nombre de Contacto debe tener al menos 6 caracteres")
    .max(50, "Nombre de Contacto debe tener como máximo 50 caracteres"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number"
    ),
  // medical
  insuranceProvider: z
    .string()
    .min(2, "Debe tener al menos 2 caracteres")
    .max(50, "Debe tener como máximo 50 caracteres"),
  insurancePolicyNumber: z.string(),
  smoker: z.enum(["Si", "No"]),
  exSmoker: z.enum(["Si", "No"]),
  allergiesType: z.enum(["Alimentos", "Drogas/Medicamentos","Ambientales/Estacionales", "Contacto", "Otras"]),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  // anthropometric measurements
  patientHeight: z.string().optional(),
  patientWeight: z.string().optional(),
  patientBMI: z.string().optional(),
  patientBFP: z.string().optional(),
  ObservationsComments: z.string().optional(),
});
