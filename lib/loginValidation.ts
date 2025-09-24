import { z } from "zod";

export const loginFormValidation = z.object({
  username: z
    .string()
    .min(6, "El nombre de usuario debe tener al menos 6 caracteres."),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export const inviteFormValidation = z.object({
  email: z.string().email("Email inválido"),
});

export const passwordResetValidation = z.object({
  email: z.string().email("Email inválido"),
});

export const newPasswordValidation = z.object({
  newPassword: z
    .string()
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres."),
  confirmNewPassword: z
    .string()
    .min(
      6,
      "La confirmación de la nueva contraseña debe tener al menos 6 caracteres."
    ),
});

export const passwordResetConfirmValidation = z
  .object({
    token: z.string().uuid("Token inválido"),
    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
