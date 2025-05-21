"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import DinamicForm from "@/components/DinamicForm";

import UserIcon from "../../../../../public/assets/icons/user-shield.svg";
import SubmitButton from "../../../../../components/SubmitButton";
import { useState } from "react";
import { inviteFormValidation } from "../../../../../lib/loginValidation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "../../../../../components/forms/ProfessionalLoginForm";



const ProfessionalInviteForm = () => {
  const [loading, setLoading] = useState(false);
const [loginError, setLoginError] = useState<string>()

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
     
 
    //   if(typeof res === "string"){
    //     setLoginError(`No existe el usuario ${value.username} ó la contraseña es incorrecta`)
    //     setErrorTimed();
    //   }
    //   if(res === undefined){
    //     setLoginError("Usuario ó Contraseña incorrectos")
    //     setErrorTimed();
    //   }
    //   res ? router.push("/professional/dashboard") : router.push("/");
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
