import { z } from "zod";
export const patientsRegisterValidation = z.object({
  // personal
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 6 caracteres")
    .max(50, "El nombre debe tener como máximo 50 caracteres"),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 6 caracteres")
    .max(50, "El apellido debe tener como máximo 50 caracteres"),
  patientPhoto: z.custom<File[]>().optional(),
  address: z
    .string()
    .min(2, "Dirección debe tener al menos 6 caracteres")
    .max(500, "Dirección debe tener como máximo 500 caracteres"),
  occupation: z
    .string()
    .min(2, "Ocupación debe tener al menos 6 caracteres")
    .max(500, "Ocupación debe tener al menos 500 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .refine(
      (phone) => /^\+\d{10,15}$/.test(phone ?? ""),
      "Número de teléfono inválido"
    ),
    gender: z.enum(["M", "F", "X"]),
    birthDate: z.coerce.date({
      required_error: "Por favor seleccione una fecha",
      invalid_type_error: "That's not a date!",
    }),
  identificationType: z.enum(['DNI', 'Libreta de Enrolamiento', 'Pasaporte']),
  identityNumber: z.string().min(6, "Número de Identificación debe tener al menos 6 caracteres"),
  emergencyContactName: z
    .string()
    .min(6, "Nombre de Contacto debe tener al menos 6 caracteres")
    .max(50, "Nombre de Contacto debe tener como máximo 50 caracteres"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number"
    ).optional(),
    contactRelationship: z
  .string()
  .min(2, "Relación de Contacto debe tener al menos 6 caracteres")
  .max(50, "Relación de Contacto debe tener como máximo 50 caracteres").optional(),
  // medical
  insuranceProvider: z
    .string()
    .min(2, "Debe tener al menos 6 caracteres")
    .max(50, "Debe tener como máximo 50 caracteres"),
  insurancePolicyNumber: z.string().min(6, "Número de Póliza debe tener al menos 6 caracteres"),
  smoker: z.enum(["SI", "NO"]),
  exSmoker: z.enum(["SI", "NO"]),
  bloodType: z.enum(["A", "B", "AB", "O"]),
  bloodFactor: z.enum(["Positivo", "Negativo"]),
  // medical history
  allergic: z.enum(["SI", "NO"]),
  allergies: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  currentMedication: z.string().optional(),
  medicalHistoryType: z.enum(["Clinico", "Hematologico", "Oncologico", "Quirurgico", "Otro"]),
  // past medical histor
  // anthropometric measurements
  patientHeight: z.string().optional(),
  patientWeight: z.string().optional(),
  patientWaist: z.string().optional(),
  patientHip: z.string().optional(),
  patientArm: z.string().optional(),
  patientTricepsFold: z.string().optional(),
  patientBMI: z.string().optional(),
  patientBFP: z.string().optional(),
  ObservationsComments: z.string().optional(),
  isActive: z.boolean().optional(),
});


export const patientsUpdateValidationSchema = z.object({
  firstName: z
  .string()
  .min(2, "El nombre debe tener al menos 6 caracteres")
  .max(50, "El nombre debe tener como máximo 50 caracteres").optional(),
lastName: z
  .string()
  .min(2, "El apellido debe tener al menos 6 caracteres")
  .max(50, "El apellido debe tener como máximo 50 caracteres").optional(),
patientPhoto: z.custom<File[]>().optional(),
address: z
  .string()
  .min(2, "Dirección debe tener al menos 6 caracteres")
  .max(500, "Dirección debe tener como máximo 500 caracteres").optional(),
occupation: z
  .string()
  .min(2, "Ocupación debe tener al menos 6 caracteres")
  .max(500, "Ocupación debe tener al menos 500 caracteres").optional(),
email: z.string().email("Email inválido").optional(),
phone: z
  .string()
  .refine(
    (phone) => /^\+\d{10,15}$/.test(phone),
    "Número de teléfono inválido"
  ).optional(),
birthDate: z.coerce.date().optional(),
gender: z.enum(["M", "F", "X"]).optional(),
identificationType: z.enum(['DNI', 'Libreta de Enrolamiento', 'Pasaporte']),
identityNumber: z.string().min(6, "Número de Identificación debe tener al menos 6 caracteres").optional(),
emergencyContactName: z
  .string()
  .min(6, "Nombre de Contacto debe tener al menos 6 caracteres")
  .max(50, "Nombre de Contacto debe tener como máximo 50 caracteres").optional(),
emergencyContactNumber: z
  .string().optional()
  .refine(
    (phone) => /^\+\d{10,15}$/.test(phone ?? ""),
    "Número de teléfono inválido"
  ).optional(), 
  contactRelationship: z
  .string()
  .min(2, "Relación de Contacto debe tener al menos 6 caracteres")
  .max(50, "Relación de Contacto debe tener como máximo 50 caracteres").optional(),
// medical
insuranceProvider: z
  .string()
  .min(2, "Debe tener al menos 6 caracteres")
  .max(50, "Debe tener como máximo 50 caracteres").optional(),
insurancePolicyNumber: z.string().optional(),
smoker: z.enum(["SI", "NO"]).optional(),
exSmoker: z.enum(["SI", "NO"]).optional(),
bloodType: z.enum(["A", "B", "AB", "O"]).optional(),
bloodFactor: z.enum(["Positivo", "Negativo"]).optional(),
// medical history
allergic: z.enum(["SI", "NO"]).optional(),
allergies: z.string().optional(),
familyMedicalHistory: z.string().optional(),
pastMedicalHistory: z.string().optional(),
currentMedication: z.string().optional(),
medicalHistory: z.string().optional(),
medicalHistoryType: z.enum(["Clinico", "Hematologico", "Oncologico", "Quirurgico"]).optional(),
// past medical histor
// anthropometric measurements
patientHeight: z.string().optional(),
patientWeight: z.string().optional(),
patientWaist: z.string().optional(),
patientHip: z.string().optional(),
patientArm: z.string().optional(),
patientTricepsFold: z.string().optional(),
patientBMI: z.string().optional(),
patientBFP: z.string().optional(),
ObservationsComments: z.string().optional(),
isActive: z.boolean().optional(),
});