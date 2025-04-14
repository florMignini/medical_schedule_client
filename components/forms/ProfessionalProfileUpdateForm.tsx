"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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

import FileUploader from "../FileUploader";
import phoneIcon from "../../public/assets/icons/phone.svg";

import mailIcon from "../../public/assets/icons/email.svg";
import {
  updateInstitutionAction,
  updateProfessionalProfileAction,
} from "@/app/actions";
import { genderOptions } from "@/app/professional/data";
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
      phoneNumber: professionalInfo.phoneNumber,
      email: professionalInfo.email,
      gender: professionalInfo.gender,
      specialty: professionalInfo.specialty,
      userImage: [],
      instagramUrl: professionalInfo.instagramUrl,
      linkedInUrl: professionalInfo.instagramUrl,
      newTwitterUrl: professionalInfo.instagramUrl,
    },
  });

  // -------------------------------------
  // onSubmit form
console.log(form.getValues());
  async function onSubmit(values: z.infer<typeof UpdateProfessionalSchema>) {

    setLoading(true);

    let formData;
    if (values.userImage && values.userImage.length > 0) {
      const blobFile = new Blob([values.userImage[0]], {
        type: values.userImage?.[0]?.type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.userImage[0]?.name);
    }
    const valuesUpdated = {
      firstName: professionalInfo.firstName,
      lastName: professionalInfo.lastName,
      username: professionalInfo.username,
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
      instagramUrl: professionalInfo.instagramUrl,
      linkedInUrl: professionalInfo.linkedInUrl,
      newTwitterUrl: professionalInfo.newTwitterUrl,
    };

    try {
      const updateProfessionalData = {
        ...valuesUpdated,
        userImage:
          formData !== undefined ? formData : professionalInfo.userImage,
      };

      const response = await updateProfessionalProfileAction(
        updateProfessionalData
      );

      if (response) {
        setLoading(false);
        router.refresh();
        router.push(`/professional/dashboard`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[100%] space-y-6 flex-1"
      >
        {/* professional profile detail */}
        <div className="flex px-2 gap-2 mb-5">
          <div className="h-5 border-x-2 border-black" />
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
                  <Icon
                    src={closeIcon}
                    alt="close-icon"
                    height={30}
                    width={30}
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
                    htmlFor="userImage"
                    className="p-0 font-light text-[13px] text-gray-500"
                  >
                    Imágen de perfil
                  </Label>
                  <DinamicForm
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="userImage"
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

            {/* username  */}
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="username"
                label="Usuario"
                disable
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
                placeholder={professionalInfo.email}
                defaultValue={professionalInfo.email}
              />
              <DinamicForm
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phoneNumber"
                label="Número de teléfono"
                iconSrc={phoneIcon}
                iconAlt="phone-icon"
                placeholder={professionalInfo.phoneNumber}
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
                          <RadioGroupItem value={gender} id={gender} disabled />
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
                placeholder={professionalInfo.specialty}
                defaultValue={professionalInfo.specialty}
              />
            </div>
          </div>
        </div>

        <div className="w-full flex">
          <SubmitButton
            className="w-[95%] mx-auto border-[1px] border-white/20 hover:bg-black bg-white text-black text-center hover:text-white shadow-[0px_6px_15px_rgba(0,0,0,0.3)] p-2 rounded-lg ease-in-out"
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
