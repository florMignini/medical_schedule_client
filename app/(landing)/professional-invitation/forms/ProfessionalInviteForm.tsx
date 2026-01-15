"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import DinamicForm from "@/components/DinamicForm";
import { useToast } from "@/hooks/use-toast";
import UserIcon from "../../../../public/assets/icons/user-verification.svg";
import SubmitButton from "../../../../components/SubmitButton";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { inviteProfessionalAction } from "@/app/actions";
import { inviteFormValidation } from "../../../../lib/loginValidation";
import { FormFieldType } from "../../../../components/forms/ProfessionalLoginForm";



const ProfessionalInviteForm = () => {
  const [loading, setLoading] = useState(false);
const [loginError, setLoginError] = useState<string>()
const {toast} = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof inviteFormValidation>>({
    resolver: zodResolver(inviteFormValidation),
    defaultValues: {
      email: "",
    },
  });

  const setErrorTimed = () => {
    setTimeout(() => setLoginError(""), 3000);
  }
  
  async function onSubmit(value: z.infer<typeof inviteFormValidation>) {
    setLoading(true);
    try {
      const response = await inviteProfessionalAction(value.email);
      if (response?.status === 200) {
        toast({
          title: "enviando invitacion...",
          description: response?.message,
          className: "bg-emerald-500 text-black",
          duration: 5000,
        })
      } else {
        setLoginError(response?.message);
        setErrorTimed();
      }
      form.reset();
      setLoading(false);
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
            Forme parte del gestor de pacientes más eficiente y accesible del mercado.
          </h3>
          <p className="text-sm text-dark-700">Registrarse en el sistema.</p>
          <div className="h-1">
          {
            loginError ? <p className="text-sm font-light text-red-800">{loginError}</p> : <p></p>
          }
          </div>
        </section>
        {/* username */}
        <DinamicForm
          fieldType={FormFieldType.EMAIL}
          control={form.control}
          name="email"
          label="Ingrese su email"
          placeholder="email@mail.com"
          iconSrc={UserIcon}
          iconAlt="user-icon"
        />
        <SubmitButton loading={loading}>Enviar Email</SubmitButton>
      </form>
    </Form>
  );
};

export default ProfessionalInviteForm;
