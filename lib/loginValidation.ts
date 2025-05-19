import { z } from "zod";

export const loginFormValidation = z.object({
    username: z.string()
    .min(6, "El nombre de usuario debe tener al menos 6 caracteres."),
    password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
  });

  export const inviteFormValidation = z.object({
    email: z.string().email("Email inválido"),
  })