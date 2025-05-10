"use client";
import React, { useState, useMemo } from "react";
import router, { useRouter } from "next/navigation";
import { Form, FormControl } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateInstitutionSchema } from "@/lib";
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
import { ICreateInstitution } from "@/interfaces";
import { updateInstitutionAction } from "@/app/actions";

type professionalType = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
};

const InstitutionUpdateForm = (institutionInfo: ICreateInstitution) => {
  const [loading, setLoading] = useState(false);
  const [isThereAnImage, setIsTthereAnImage] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof UpdateInstitutionSchema>>({
    resolver: zodResolver(UpdateInstitutionSchema),
    defaultValues: {
      name: institutionInfo.name,
      address: institutionInfo.address,
      phone: institutionInfo.phone,
      email: institutionInfo.email,
      website: institutionInfo.website,
      // @ts-ignore
      institutionImage: institutionInfo.institutionImage,
    },
  });
  // -------------------------------------
  // onSubmit form

  async function onSubmit(values: z.infer<typeof UpdateInstitutionSchema>) {
    setLoading(true);
    let formData;

    if (values.institutionImage !== undefined) {
      const blobFile = new Blob([values.institutionImage[0]], {
        type: values.institutionImage?.[0]?.type,
      });
      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.institutionImage[0]?.name);
    }
    const valuesUpdated = {
      name: values.name === undefined ? institutionInfo.name : values.name,
      address:
        values.address === undefined ? institutionInfo.address : values.address,
      phone: values.phone === undefined ? institutionInfo.phone : values.phone,
      email: values.email === undefined ? institutionInfo.email : values.email,
      website:
        values.website === undefined ? institutionInfo.website : values.website,
    };

    try {
      const updateInstitutionData = {
        ...valuesUpdated,
        institutionId: institutionInfo.id,
        institutionImage:
          formData !== undefined ? formData : institutionInfo.institutionImage,
      };

      const response = await updateInstitutionAction(updateInstitutionData) as { id: string };
      if (response) {
        setLoading(false);
        router.push(`/professional/institutions`);
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
        {/* appointment detail */}
        <div className="flex px-2 gap-2 mb-5">
          <div className="h-5 border-x-2 border-white" />
          <h1 className="text-16-semibold">
            Actualizar información de la Institución
          </h1>
        </div>
        {/* forms */}
        <div className="mb-5 space-y-4 flex flex-wrap items-center justify-center lg:grid lg:grid-cols-[40%,60%] gap-2">
          {/* left side */}
          <div className="flex items-center justify-center px-1 py-2">
            {form?.getValues()?.institutionImage?.length! > 0 ? (
              <div className="w-full h-full  flex-col flex items-start justify-center pt-0 text-black">
                <button
                  className="flex items-center justify-end"
                  onClick={() => {
                    setIsTthereAnImage(false);
                    form.resetField("institutionImage");
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
                  name="institutionImage"
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
                    Imágen de la Institución
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
            {/* name & address */}
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Nombre de la institución"
                defaultValue={institutionInfo.name}
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Dirección"
                defaultValue={institutionInfo.address}
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
              />
              <DinamicForm
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Número de teléfono"
                iconSrc={phoneIcon}
                iconAlt="phone-icon"
              />
            </div>
            <div className="flex flex-1 items-center justify-start mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="website"
                label="Sitio web"
                defaultValue={institutionInfo.website}
              />
            </div>
          </div>
        </div>

        <div className="w-full flex">
          <SubmitButton
            className="w-[95%] mx-auto border-[1px] border-gray-600 hover:bg-gradient-to-b from-black to-[#807f7f] text-white text-center hover:opacity-50 p-2 rounded-lg ease-in-out"
            loading={loading}
          >
            Actualizar Institución
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default InstitutionUpdateForm;
