"use client";
import React, { useState } from "react";
import { Form, FormControl } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPastAppointmentSchema } from "@/lib";
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
import { Patient } from "@/interfaces";
import { createPatientPastAppointmentRelation } from "@/app/actions";
import router from "next/navigation";
import { createPastAppointment } from "@/app/actions/pastAppointmentAction";

const PastAppointmentForm = ({ patient }: any) => {
  console.log(patient);
  const [loading, setLoading] = useState(false);
  const [isThereAnImage, setIsTthereAnImage] = useState<boolean>(false);
  const form = useForm<z.infer<typeof NewPastAppointmentSchema>>({
    resolver: zodResolver(NewPastAppointmentSchema),
    defaultValues: {
      details: "",
      appointmentFileAttached: [],
    },
  });
  // -------------------------------------
  // onSubmit form

  async function onSubmit(values: z.infer<typeof NewPastAppointmentSchema>) {
    setLoading(true);
    let formData;
    if (
      values.appointmentFileAttached &&
      values.appointmentFileAttached.length > 0
    ) {
      const blobFile = new Blob([values.appointmentFileAttached[0]], {
        type: values.appointmentFileAttached?.[0]?.type,
      });
      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.appointmentFileAttached[0]?.name);
    }
    try {
      const pastAppointmentData = {
        ...values,
        appointmentFileAttached: formData,
      };
      const response = await createPastAppointment(pastAppointmentData);

      if (patient) {
        const IDs = {
          patient: patient.id,
          pastAppointment: response.id,
        };
        const data = await createPatientPastAppointmentRelation(IDs);
      }
      if (response) {
        form.reset();
        setLoading(false);
        router.redirect("/professional/patients");
      }
    } catch (error) {
      console.error(error);
    }
  }

  // -------------------------------------
  // console.log(form.getValues().appointmentFileAttached);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {/* appointment detail */}
        <Label
          htmlFor="details"
          className="p-0 font-light text-[13px] text-gray-500"
        >
          Descripción de la consulta:
        </Label>
        <DinamicForm
          name="details"
          control={form.control}
          placeholder="Agregar detalles de la consulta"
          fieldType={FormFieldType.TEXTAREA}
        />
        <div className="w-[100%] flex items-start justify-center">
          {form?.getValues()?.appointmentFileAttached?.length! > 0 ? (
            <div className="size-16 flex-col flex items-start justify-end pt-0">
              <button
                className="size-4 flex items-center justify-end"
                onClick={() => {
                  setIsTthereAnImage(false);
                  form.resetField("appointmentFileAttached");
                }}
              >
                <Icon src={closeIcon} alt="close-icon" height={30} width={30} />
              </button>
              <DinamicForm
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="appointmentFileAttached"
                renderSkeleton={(field) => (
                  <FormControl>
                    <FileUploader
                      files={isThereAnImage ? field.value : (field.value = [])}
                      onChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
            </div>
          ) : (
            <>
              <div className="" onClick={() => setIsTthereAnImage(true)}>
                <Label
                  htmlFor="appointmentFileAttached"
                  className="p-0 font-light text-[13px] text-gray-500"
                >
                  Agregar Árchivos Lab-Médicos
                </Label>
                <DinamicForm
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="appointmentFileAttached"
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
        <SubmitButton
          className="w-[100%] border-dark-600 bg-dark-500/80 hover:bg-dark-500 p-2 rounded-lg"
          loading={loading}
        >
          Finalizar cita
        </SubmitButton>
      </form>
    </Form>
  );
};

export default PastAppointmentForm;
