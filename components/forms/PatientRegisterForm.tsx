"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";

import UserIcon from "../../public/assets/icons/user-verification.svg";
import PasswordIcon from "../../public/assets/icons/security-password.svg";
import PencilIcon from "../../public/assets/icons/pencil.svg";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { loginFormValidation } from "@/lib";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./ProfessionalLoginForm";
import Image from "next/image";
import Icon from "../ui/icon";

const PatientRegistrationForm = () => {
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
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {/* patient personal information */}
        <div className="flex px-6 gap-2">
          <div className="h-5 border-x-2 border-white" />
          <h1 className="text-16-semibold">Información Personal</h1>
        </div>
        <div className="mb-5 space-y-4 grid grid-cols-[30%,70%] ">
          {/* left side */}
          <div className="flex items-start justify-center py-4">
            <Image
              src={UserIcon}
              alt="user-photo-placeholder"
              width={100}
              height={100}
            />
            <div className="h-[100%] flex items-start justify-end pt-[35%]">
              <button className="w-7 h-7 rounded-full cursor-pointer bg-dark-400 p-1">
                <Icon
                  src={PencilIcon}
                  alt="pencil-icon"
                  width={18}
                  height={18}
                />
              </button>
            </div>
          </div>
          {/* rightside */}
          <div className="w-[95%]">
            <DinamicForm
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="fullname"
              label="Nombre Completo"
            />
            {/* email & phone number */}
            <div className="flex gap-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="username"
                label="cellphone"
                placeholder="Usuario o Email"
                iconSrc={UserIcon}
                iconAlt="user-icon"
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="username"
                label="gender"
                placeholder="Usuario o Email"
                iconSrc={UserIcon}
                iconAlt="user-icon"
              />
            </div>
             {/* birthdate & gender */}
             <div className="flex gap-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="username"
                label="cellphone"
                placeholder="Usuario o Email"
                iconSrc={UserIcon}
                iconAlt="user-icon"
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="username"
                label="gender"
                placeholder="Usuario o Email"
                iconSrc={UserIcon}
                iconAlt="user-icon"
              />
            </div>
          </div>
        </div>
        {/* 
        <SubmitButton loading={loading}>Ingresar</SubmitButton> */}
      </form>
    </Form>
  );
};

export default PatientRegistrationForm;
