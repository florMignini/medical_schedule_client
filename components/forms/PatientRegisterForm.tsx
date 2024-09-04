"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";
import SubmitButton from "../SubmitButton";
import Icon from "../ui/icon";
import { Label } from "../ui";
import { loginFormValidation } from "@/lib";
import { FormFieldType } from "./ProfessionalLoginForm";
import { genderOptions } from "@/data";
import phoneIcon from "../../public/assets/icons/phone.svg";
import UserIcon from "../../public/assets/icons/user-verification.svg";

import PencilIcon from "../../public/assets/icons/pencil.svg";
import mailIcon from "../../public/assets/icons/email.svg";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

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
        <div className="mb-5 space-y-4 flex flex-wrap items-center justify-center lg:grid lg:grid-cols-[30%,70%] ">
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
            {/* firstname & lastname */}
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="firstName"
                label="Nombre/s"
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="lastName"
                label="Apellido/s"
              />
            </div>
            {/* address & occupation */}
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Dirección"
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                label="Ocupación"
              />
            </div>
            {/* email & phone number */}
            <div className="flex flex-col md:flex-row gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="paciente@email.com"
                iconSrc={mailIcon}
                iconAlt="user-email"
              />
              <DinamicForm
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Numero de teléfono"
                placeholder="(0223) 1-234567"
                iconSrc={phoneIcon}
                iconAlt="phone-icon"
              />
            </div>
            {/* birthdate & gender */}
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthDate"
                label="Fecha de Nacimiento"
                placeholder="dd/MM/YYYY"

              />
              <DinamicForm
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Genero"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-11 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {genderOptions.map((gender: string) => (
                        <div key={gender} className="radio-group gap-1">
                          <RadioGroupItem
                            value={gender}
                            id={gender}
                          />
                          <Label
                          htmlFor={gender}
                          className="cursor-pointer"
                          >{gender}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
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
