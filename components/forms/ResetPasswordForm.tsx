"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Form } from "../ui";
import DinamicForm from "../DinamicForm";
import { FormFieldType } from "./ProfessionalLoginForm";
import { resetPassword } from "@/app/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { passwordResetConfirmValidation } from "@/lib";

type FormData = z.infer<typeof passwordResetConfirmValidation>;

export default function ResetPasswordForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<FormData>({
    resolver: zodResolver(passwordResetConfirmValidation),
    defaultValues: {
      token: token || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

  async function onSubmit(values: FormData) {
    setLoading(true);
    try {
      await resetPassword({
        token: values.token,
        newPassword: values.newPassword,
      });
      toast({
        title: "Éxito",
        description: "Tu contraseña ha sido actualizada.",
        className: "bg-green-100 text-black",
      });
      router.push("/login");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo restablecer la contraseña",
        className: "bg-red-100 text-black",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h2 className="text-2xl font-bold">Restablecer Contraseña</h2>
          <p className="text-sm text-black/50">
            Ingrese su nueva contraseña para continuar.
          </p>
        </section>
        <DinamicForm
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="newPassword"
          label="Nueva Contraseña"
          placeholder="********"
          className="flex-1"
          inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          labelClassName="mb-1 text-gray-700 font-medium"
        />
        <DinamicForm
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="confirmPassword"
          label="Confirmar Contraseña"
          placeholder="********"
          className="flex-1"
          inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          labelClassName="mb-1 text-gray-700 font-medium"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Guardando..." : "Cambiar contraseña"}
        </Button>
      </form>
    </Form>
  );
}
