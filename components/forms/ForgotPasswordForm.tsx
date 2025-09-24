import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Form } from "../ui";
import { useRouter } from "next/navigation";
import DinamicForm from "../DinamicForm";
import { FormFieldType } from "./ProfessionalLoginForm";
import { passwordResetValidation } from "@/lib";
import { forgotPassword } from "@/app/actions";

const schema = z.object({
  email: z.string().email("Ingrese un email válido"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState<string>();

  const router = useRouter();
  const form = useForm<z.infer<typeof passwordResetValidation>>({
    resolver: zodResolver(passwordResetValidation),
    defaultValues: {
      email: "",
    },
  });

  const setErrorTimed = () => {
    setTimeout(() => setForgotPasswordError(""), 3000);
  };
  async function onSubmit(value: z.infer<typeof passwordResetValidation>) {
    setLoading(true);
    try {
      const res =  await forgotPassword(value);
      toast({
        title: "Éxito",
        description:
          "Se ha enviado un enlace de recuperación a su email.",
        className: "bg-green-100 text-black",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Error al enviar el email",
        className: "bg-red-100 text-black",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h2 className="text-2xl font-bold">Recuperar Contraseña</h2>
          <p className="text-sm text-black/50">
            Ingresa tu email para recibir un enlace de recuperación de
            contraseña.
          </p>
          <div className="h-1">
            {forgotPasswordError && (
              <p className="text-red-500 text-sm">{forgotPasswordError}</p>
            )}
          </div>
        </section>
        <DinamicForm
          fieldType={FormFieldType.EMAIL}
          control={form.control}
          name="email"
          label="Email"
          placeholder="professional@email.com"
          className="flex-1"
          inputClassName="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          labelClassName="mb-1 text-gray-700 font-medium"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace de recuperación"}
        </Button>
      </form>
    </Form>
  );
}
