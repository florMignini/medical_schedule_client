"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";

import UserIcon from "../../public/assets/icons/user-shield.svg";
import PasswordIcon from "../../public/assets/icons/security-password.svg";
import SubmitButton from "../SubmitButton";
import { useEffect, useState } from "react";
import { loginFormValidation } from "@/lib";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/actions";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  SELECT = "select",
  CHECKBOX = "checkbox",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SKELETON = "skeleton",
}

const ProfessionalLoginform = () => {
  const [loading, setLoading] = useState(false);


  const router = useRouter();
  const form = useForm<z.infer<typeof loginFormValidation>>({
    resolver: zodResolver(loginFormValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  async function onSubmit(value: z.infer<typeof loginFormValidation>) {
    setLoading(true);
    try {
      const res = await loginUser(value);
      localStorage.setItem('infoProfSession', JSON.stringify({
        firstname: res?.firstName,
        lastname: res?.lastName,
        id: res?.id,
      }))
      res ? router.push("/professional/dashboard") : router.push("/");
    } catch (error:any) {
      console.error(error);
      setLoading(false);
    }
  }
 
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h3 className="header">
            Gestiona el seguimiento de pacientes de forma más eficiente.
          </h3>
          <p className="text-sm text-dark-700">Ingresar al sistema.</p>
        </section>
        {/* username */}
        <DinamicForm
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="username"
          label="Ingrese nombre de usuario o email"
          placeholder="Usuario o Email"
          iconSrc={UserIcon}
          iconAlt="user-icon"
        />
        {/* password */}
        <DinamicForm
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="password"
          label="Ingrese su contraseña"
          placeholder="Contraseña"
          iconSrc={PasswordIcon}
          iconAlt="password-icon"
        />
        <SubmitButton loading={loading}>Ingresar</SubmitButton>
      </form>
    </Form>
  );
};

export default ProfessionalLoginform;
