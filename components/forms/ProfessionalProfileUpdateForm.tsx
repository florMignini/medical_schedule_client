"use client";
import React, { useState, useMemo } from "react";
import router, { useRouter } from "next/navigation";
import { Form, FormControl } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProfessionalSchema } from "@/lib";
import { z } from "zod";
import { FormFieldType } from "./ProfessionalLoginForm";
import SubmitButton from "../SubmitButton";
import { useForm } from "react-hook-form";
import { Label } from "../ui";
import Icon from "../ui/icon";
import closeIcon from "../../public/assets/icons/close.svg";
import uploadIcon from "../../public/assets/icons/upload.svg";
import FileUploader from "../FileUploader";
import Image from "next/image";
import phoneIcon from "../../public/assets/icons/phone.svg";
import UserIcon from "../../public/assets/icons/user-verification.svg";
import mailIcon from "../../public/assets/icons/email.svg";
import { updateInstitutionAction } from "@/app/actions";
import { genderOptions } from "@/data";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";


const ProfessionalProfileUpdateForm = (professionalInfo: any) => {
  const [loading, setLoading] = useState(false);
  const [isThereAnImage, setIsTthereAnImage] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof UpdateProfessionalSchema>>({
    resolver: zodResolver(UpdateProfessionalSchema),
    defaultValues: {
      firstName: professionalInfo.firstName,
      lastName: professionalInfo.lastName,
      username: professionalInfo.username,
      password: professionalInfo.password,
      phoneNumber: professionalInfo.phoneNumber,
      email: professionalInfo.email,
      gender: professionalInfo.gender,
      specialty: professionalInfo.specialty,
      userImage: professionalInfo.userImage,
    },
  });
  // -------------------------------------
  // onSubmit form

  async function onSubmit(values: z.infer<typeof UpdateProfessionalSchema>) {
    setLoading(true);
    let formData;

    if (values.userImage !== undefined) {
      const blobFile = new Blob([values.userImage[0]], {
        type: values.userImage?.[0]?.type,
      });
      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.userImage[0]?.name);
    }
    const valuesUpdated = {
      firstName:professionalInfo.firstName,
      lastName:professionalInfo.lastName,
      username:
        values.username === undefined
          ? professionalInfo.username
          : values.username,
      password:
        values.password === undefined
          ? professionalInfo.password
          : values.password,
      phoneNumber:
        values.phoneNumber === undefined
          ? professionalInfo.phoneNumber
          : values.phoneNumber,
      email: values.email === undefined ? professionalInfo.email : values.email,
      gender: professionalInfo.gender,
      specialty:
        values.specialty === undefined
          ? professionalInfo.specialty
          : values.specialty,
    };
console.log(valuesUpdated)
setLoading(false)
    // try {
    //   const updateInstitutionData = {
    //     ...valuesUpdated,
    //     userImage:
    //       formData !== undefined ? formData : professionalInfo.userImage,
    //   };

    //   const response = await updateInstitutionAction(updateInstitutionData);
    //   if (response) {
    //     setLoading(false);
    //     router.push(`/professional/institutions`);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[100%] space-y-6 flex-1"
      >
        {/* appointment detail */}
        <div className="flex px-2 gap-2 mb-5">
          <div className="h-5 border-x-2 border-white" />
          <h1 className="text-16-semibold">
            Actualizar mi información personal
          </h1>
        </div>
        {/* forms */}
        <div className="mb-5 space-y-4 flex flex-wrap items-center justify-center lg:grid lg:grid-cols-[40%,60%] gap-2">
          {/* left side */}
          <div className="flex items-center justify-center px-1 py-2">
            {form?.getValues()?.userImage?.length! > 0 ? (
              <div className="w-full h-full  flex-col flex items-start justify-center pt-0 text-black">
                <button
                  className="flex items-center justify-end"
                  onClick={() => {
                    setIsTthereAnImage(false);
                    form.resetField("userImage");
                  }}
                >
                  <Image
                    src={closeIcon}
                    alt="close-icon"
                    height={30}
                    width={30}
                    className="z-30"
                  />
                </button>
                <DinamicForm
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="userImage"
                  renderSkeleton={(field) => (
                    <FormControl className="w-full">
                      <FileUploader
                        files={
                          isThereAnImage ? field.value : (field.value = [])
                        }
                        onChange={field.onChange}
                      />
                    </FormControl>
                  )}
                />
              </div>
            ) : (
              <>
                <div
                  className="w-[100%]"
                  onClick={() => setIsTthereAnImage(true)}
                >
                  <Label
                    htmlFor="institutionImage"
                    className="p-0 font-light text-[13px] text-gray-500"
                  >
                    Imágen de perfil
                  </Label>
                  <DinamicForm
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="institutionImage"
                    renderSkeleton={(field) => (
                      <FormControl>
                        <FileUploader
                          files={
                            isThereAnImage ? field.value : (field.value = [])
                          }
                          onChange={field.onChange}
                        />
                      </FormControl>
                    )}
                  />
                </div>
              </>
            )}
          </div>
          {/* rightside */}
          <div className="w-[95%]">
            {/* name & lastname */}
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="firstName"
                label="Nombre"
                disable
                defaultValue={professionalInfo.firstName}
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="lastName"
                label="Apellido"
                disable
                defaultValue={professionalInfo.lastName}
              />
            </div>

            {/* username & password */}
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="username"
                label="Usuario"
                defaultValue={professionalInfo.username}
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="password"
                label="Contraseña"
                type="password"
                placeholder={`xxxxxxxxx`}
              />
            </div>

            {/* email & phone */}
            <div className="flex flex-col md:flex-row gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                iconSrc={mailIcon}
                iconAlt="user-email"
                defaultValue={professionalInfo.email}
              />
              <DinamicForm
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phoneNumber"
                label="Número de teléfono"
                iconSrc={phoneIcon}
                iconAlt="phone-icon"
                defaultValue={professionalInfo.phoneNumber}
              />
            </div>
            {/* gender & specialty */}
            <div className="flex flex-col md:flex-row gap-2 mb-2">
            <DinamicForm
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="gender"
                  label="Genero"
                  disable
                  renderSkeleton={(field) => (
                    <FormControl>
                      <RadioGroup
                        className="flex h-12 xl:justify-between"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        {genderOptions.map((gender: string) => (
                          <div key={gender} className="radio-group gap-1">
                            <RadioGroupItem value={gender} id={gender} disabled/>
                            <Label htmlFor={gender} className="cursor-pointer">
                              {gender}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="specialty"
                label="Especialidad médica"
                defaultValue={professionalInfo.specialty}
              />
            </div>
            </div>
          </div>
      

        <div className="w-full flex">
          <SubmitButton
            className="w-[95%] mx-auto border-[1px] border-gray-600 hover:bg-gradient-to-b from-black to-[#807f7f] text-white text-center hover:opacity-50 p-2 rounded-lg ease-in-out"
            loading={loading}
          >
            Actualizar Perfil
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default ProfessionalProfileUpdateForm;
