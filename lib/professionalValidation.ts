import { z } from "zod";
export const NewProfessionalSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    username: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    phoneNumber: z
    .string()
    .refine(
      (phone) => /^\+\d{10,15}$/.test(phone),
      "Número de teléfono inválido"
    ),
    email: z.string().email("Email inválido"),
    gender: z.enum(["M", "F", "X"]),
    specialty: z.string().optional(),
    instagramUrl: z.string().optional(),
    linkedInUrl: z.string().optional(),
    newTwitterUrl: z.string().optional(),
    userImage: z.custom<File[]>().optional(),
    birthDate: z.coerce.date(),
    identificationType: z.enum(['DNI', 'Libreta de Enrolamiento', 'Pasaporte']),
    identityNumber: z.string().optional(),
    isActive: z.boolean().optional()
  });
  
  export const UpdateProfessionalSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    username: z.string().optional(),
    phoneNumber: z
    .string()
    .refine(
      (phone) => /^\+\d{10,15}$/.test(phone),
      "Número de teléfono inválido"
    ),
    instagramUrl: z.string().optional(),
    linkedInUrl: z.string().optional(),
    newTwitterUrl: z.string().optional(),
    email: z.string().email("Email inválido"),
    gender: z.enum(["M", "F", "X"]).optional(),
    specialty: z.string().optional(),
    userImage: z.custom<File[]>().optional(),
  })

  export const UpdateProfessionalPasswordSchema = z.object({ 
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
    newPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
    confirmPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres.").optional()
   });