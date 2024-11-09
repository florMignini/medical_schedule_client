import { z } from "zod";
export const NewInstitutionSchema = z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    phone: z
    .string()
    .refine(
      (phone) => /^\+\d{10,15}$/.test(phone),
      "Número de teléfono inválido"
    ),
    email: z.string().email("Email inválido"),
    website: z.string().optional(),
    institutionImage: z.custom<File[]>().optional(),
  });
  
  export const UpdateInstitutionSchema = z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    phone: z
    .string()
    .refine(
      (phone) => /^\+\d{10,15}$/.test(phone),
      "Número de teléfono inválido"
    ).optional(),
    email: z.string().email("Email inválido").optional(),
    website: z.string().optional(),
    institutionImage: z.custom<File[]>().optional(),
  })