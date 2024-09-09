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
import {
  AllergiesType,
  AllergiesDescription,
  booleanOption,
  genderOptions,
} from "@/data";
import phoneIcon from "../../public/assets/icons/phone.svg";
import UserIcon from "../../public/assets/icons/user-verification.svg";
import DropdownIcon from "../../public/assets/icons/arrowDown.svg";
import PencilIcon from "../../public/assets/icons/pencil.svg";
import mailIcon from "../../public/assets/icons/email.svg";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectItem } from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DinamicAllergieContent from "../DinamicAllergieContent";

const PatientRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [allergiesType, setAllergiesType] = useState("");
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
        <div className="mb-10">
          {/* head */}
          <div className="flex px-2 gap-2 mb-5">
            <div className="h-5 border-x-2 border-white" />
            <h1 className="text-16-semibold">Información Personal</h1>
          </div>
          {/* forms */}
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
                  placeholder="Av. Independencia 1111, Mar del Plata"
                />
                <DinamicForm
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="occupation"
                  label="Ocupación"
                  placeholder="Ingeniero en software"
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
                        className="flex h-14 xl:justify-between"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        {genderOptions.map((gender: string) => (
                          <div key={gender} className="radio-group gap-1">
                            <RadioGroupItem value={gender} id={gender} />
                            <Label htmlFor={gender} className="cursor-pointer">
                              {gender}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* medical records */}
        <div className="mb-10">
          {/* head */}
          <div className="flex px-2 gap-2 mb-5">
            <div className="h-5 border-x-2 border-white" />
            <h1 className="text-16-semibold capitalize">registros médicos</h1>
          </div>
          {/* forms */}
          <div className="px-[1.2rem]">
            {/* ensurance_provider & ensurance_policy_number */}
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insurance_provider"
                label="Cobertura Médica"
                placeholder="PAMI"
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insurance_policy_number"
                label="Número de Afiliado"
                placeholder="123456789012/00"
              />
            </div>
            {/* smoker & ex-smoker */}
            <div className="flex gap-2 mb-2">
              {/* smoker */}
              <DinamicForm
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="fumador"
                label="Fumador"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-14 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {booleanOption.map((bool: string) => (
                        <div key={bool} className="radio-group gap-1">
                          <RadioGroupItem value={bool} id={bool} />
                          <Label htmlFor={bool} className="cursor-pointer">
                            {bool}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
              {/* ex-smoker */}
              <DinamicForm
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="ex-fumador"
                label="Ex-Fumador"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-14 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {booleanOption.map((bool: string) => (
                        <div key={bool} className="radio-group gap-1">
                          <RadioGroupItem value={bool} id={bool} />
                          <Label htmlFor={bool} className="cursor-pointer">
                            {bool}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </div>
            {/* allergies */}
            <div className="flex gap-2 mb-2">
              {/* allergies type */}
              <div className="flex w-[50%] h-14 rounded-md items-center justify-center border border-dark-500 gap-2 p-1 outline-none bg-dark-400 flex-col">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center justify-center gap-2 outline-none">
                    Alérgias
                    <Icon
                      src={DropdownIcon}
                      alt="dropdown-icon"
                      width={18}
                      height={18}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="ml-5 w-full flex items-center justify-start">
                    <DropdownMenuRadioGroup
                      value={allergiesType}
                      onValueChange={setAllergiesType}
                      className="flex w-full flex-col items-center gap-1 rounded-md  border-dark-500 bg-dark-400
                      text-white text-ellipsis"
                    >
                      {AllergiesType.map((allergie) => (
                        <DropdownMenuRadioItem
                          value={allergie}
                          className="w-[90%] flex items-center justify-start pl-6"
                        >
                          {allergie}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <p className="text-16-semibold">{allergiesType}</p>
              </div>
              <div className="flex w-[50%]">
                {/* choose specific allergie */}
                {allergiesType ? (
                  <div className=" rounded-md border border-dark-500 gap-2 p-1 outline-none bg-dark-400 flex-col">
                    <DinamicAllergieContent
                      allergiesType={allergiesType}
                      form={form}
                    />
                  </div>
                ) : null}
              </div>
            </div>
            {/* current medication */}
            <div className="flex gap-2 mb-2">
              <DinamicForm
                control={form.control}
                name="current_medication"
                label="Medicamentos Actuales"
                placeholder="Ex: Prednisone, Amoxicilina, Paracetamol"
                fieldType={FormFieldType.TEXTAREA}
              />
              <DinamicForm
                control={form.control}
                name="family_medical_history"
                label="Antecedentes Familiares"
                placeholder="Diabetes, Cáncer..."
                fieldType={FormFieldType.TEXTAREA}
              />
            </div>
          </div>
        </div>

        {/* anthropometric measurements */}
        <div className="mb-10">
          {/* head */}
          <div className="flex px-2 gap-2 mb-5">
            <div className="h-5 border-x-2 border-white" />
            <h1 className="text-16-semibold capitalize">
              Medidas Antropométricas
            </h1>
          </div>
          <div className="flex gap-2 mb-2">
            <DinamicForm
              name="patient_height"
              control={form.control}
              placeholder="Altura"
              label="Altura"
              fieldType={FormFieldType.INPUT}
            />
            <DinamicForm
              name="patient_weight"
              control={form.control}
              placeholder="Peso"
              label="Peso"
              fieldType={FormFieldType.INPUT}
            />
            <DinamicForm
              name="patient_body_mass_index"
              control={form.control}
              placeholder="IMC"
              label="IMC"
              fieldType={FormFieldType.INPUT}
            />
            <DinamicForm
              name="patient_body_fat_percentage"
              control={form.control}
              placeholder="Porcentaje de grasa corporal"
              label="Porcentaje de grasa corporal"
              fieldType={FormFieldType.INPUT}
            />
          </div>
          <div className="flex gap-2 mb-2">
            <DinamicForm
              name="Observations/Comments"
              control={form.control}
              placeholder="Observaciones/Comentarios"
              label="Observaciones/Comentarios"
              fieldType={FormFieldType.TEXTAREA}
            />
          </div>
        </div>
        {/* 
        <SubmitButton loading={loading}>Ingresar</SubmitButton> */}
      </form>
    </Form>
  );
};

export default PatientRegistrationForm;
