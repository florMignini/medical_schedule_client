"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";
import SubmitButton from "../SubmitButton";
import { Label } from "../ui";
import FileUploader from "../FileUploader";

import CloseIcon from "@/app/(professional)/professional/components/icons/CloseIcon";
import mailIcon from "../../public/assets/icons/email.svg";
import phoneIcon from "../../public/assets/icons/phone.svg";

import {
  createNewInstitution,
  createProfessionalInstitutionRelation,
} from "@/app/actions";

import { NewInstitutionSchema } from "@/lib";
import { FormFieldType } from "./ProfessionalLoginForm";
import { useCurrentProfessional } from "@/hooks/useCurrentProfessional";
import { ICreateInstitution } from "@/interfaces";

type Props = {
  selectedInstitution?: Partial<ICreateInstitution> | null;
  onClose: () => void;
};

const InstitutionRegisterForm: React.FC<Props> = ({
  selectedInstitution,
  onClose,
}) => {
  const router = useRouter();
  const professional = useCurrentProfessional();
  const isEditMode = Boolean(selectedInstitution?.id);
  const [loading, setLoading] = useState(false);
  const [hasImage, setHasImage] = useState(false);

  const form = useForm<z.infer<typeof NewInstitutionSchema>>({
    resolver: zodResolver(NewInstitutionSchema),
    defaultValues: {
      name: selectedInstitution?.name || "",
      address: selectedInstitution?.address || "",
      phone: selectedInstitution?.phone || "",
      email: selectedInstitution?.email || "",
      website: selectedInstitution?.website || "",
      institutionImage: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof NewInstitutionSchema>) => {
    setLoading(true);

    try {
      let formData;

      if ((values.institutionImage ?? []).length > 0) {
        const file = (values.institutionImage ?? [])[0];
        const blobFile = new Blob([file], { type: file.type });
        formData = new FormData();
        formData.append("blobFile", blobFile);
        formData.append("fileName", file.name);
      }

      const payload = {
        ...values,
        institutionImage: formData,
      };

      if (isEditMode) {
        // 🛠 Agregar lógica de edición si tenés una función tipo updateInstitution()
        console.log("Actualizar institución:", selectedInstitution?.id, payload);
      } else {
        const response = await createNewInstitution(payload) as { id: string };
        if (response?.id) {
          await createProfessionalInstitutionRelation({
            professional: professional?.id!,
            institution: response.id,
          });
        }
      }

      form.reset();
      setHasImage(false);
      onClose();
      router.push(`/professional/institutions`);
    } catch (error) {
      console.error("Error guardando institución:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 flex-1"
      >
        <div className="flex px-2 gap-2 mb-5">
          <div className="h-5 border-x-2 border-black" />
          <h1 className="text-16-semibold">
            {isEditMode ? "Editar Institución" : "Registrar Nueva Institución"}
          </h1>
        </div>

        <div className="mb-5 space-y-4 flex flex-wrap items-center justify-center lg:grid lg:grid-cols-[40%,60%] gap-2">
          {/* 📸 Imagen */}
          <div className="flex items-center justify-center px-1 py-2">
            {(form.getValues("institutionImage") ?? []).length > 0 ? (
              <div className="w-full flex-col flex items-start justify-center pt-0 text-black">
                <button
                  className="flex items-center justify-end"
                  onClick={(e) => {
                    e.preventDefault();
                    form.resetField("institutionImage");
                    setHasImage(false);
                  }}
                >
                  <CloseIcon height={30} width={30} className="z-30 text-black" />
                </button>
                <DinamicForm
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="institutionImage"
                  renderSkeleton={(field) => (
                    <FormControl className="w-full">
                      <FileUploader
                        files={hasImage ? field.value : []}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  )}
                />
              </div>
            ) : (
              <div className="w-full" onClick={() => setHasImage(true)}>
                <Label
                  htmlFor="institutionImage"
                  className="p-0 font-light text-[13px] text-gray-500"
                >
                  Imagen de la Institución
                </Label>
                <DinamicForm
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="institutionImage"
                  renderSkeleton={(field) => (
                    <FormControl>
                      <FileUploader
                        files={hasImage ? field.value : []}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  )}
                />
              </div>
            )}
          </div>

          {/* 🧾 Datos de la Institución */}
          <div className="w-[95%] space-y-3">
            <div className="flex gap-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Nombre de la institución"
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Dirección"
                placeholder="Av. Independencia 1111, Mar del Plata"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="institucion@email.com"
                iconSrc={mailIcon}
                iconAlt="user-email"
              />
              <DinamicForm
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Número de teléfono"
                placeholder="(0223) 1-234567"
                iconSrc={phoneIcon}
                iconAlt="phone-icon"
              />
            </div>

            <DinamicForm
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="website"
              label="Sitio web"
              placeholder="www.institucion.com.ar"
            />
          </div>
        </div>

        {/* 🔘 Botón Submit */}
        <div className="w-full flex">
          <SubmitButton
            className="w-[95%] mx-auto border border-gray-600 bg-gradient-to-b from-black to-[#807f7f] text-white hover:from-white hover:to-[#222] hover:text-[#1c1c1c] text-center p-2 rounded-lg"
            loading={loading}
          >
            {isEditMode ? "Actualizar Institución" : "Agregar Institución"}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default InstitutionRegisterForm;
