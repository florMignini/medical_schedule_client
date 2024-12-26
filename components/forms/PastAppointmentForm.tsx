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
import { createPatientPastAppointmentRelation } from "@/app/actions";
import router, { useRouter } from "next/navigation";
import { createPastAppointment } from "@/app/actions/pastAppointmentAction";

const PastAppointmentForm = ({ patient, appointment }: any) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isThereAnImage, setIsTthereAnImage] = useState<boolean>(false);
  const form = useForm<z.infer<typeof NewPastAppointmentSchema>>({
    resolver: zodResolver(NewPastAppointmentSchema),
    defaultValues: {
      diagnosis: "",
      prescription: "",
      notes: "",
      followUpRequired: false,
      scheduled: new Date(),
      patientAttachedFilesUrl: [],
    },
  });
  // -------------------------------------
  // onSubmit form

  async function onSubmit(values: z.infer<typeof NewPastAppointmentSchema>) {
    setLoading(true);
    let formData;
    if (
      values.patientAttachedFilesUrl &&
      values.patientAttachedFilesUrl.length > 0
    ) {
      const blobFile = new Blob([values.patientAttachedFilesUrl[0]], {
        type: values.patientAttachedFilesUrl?.[0]?.type,
      });
      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.patientAttachedFilesUrl[0]?.name);
    }
    try {
      const pastAppointmentData = {
        ...values,
        scheduled: appointment.schedule,
        patientAttachedFilesUrl: formData,
      };
      const response: any = await createPastAppointment(pastAppointmentData);

      if (response !== undefined) {
        const IDs = {
          patient: patient.id!,
          pastAppointments: response.id,
        };
      
        const data = await createPatientPastAppointmentRelation(IDs);
        if(response){
          form.reset();
        setLoading(false);
        router.push(`/professional/patients/${patient.id}/info`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // -------------------------------------

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[100%] space-y-6 flex-1"
      >
        {/* appointment detail */}
        {/* diagnosis */}
       <div className="w-full flex items-start justify-center flex-col">
       <Label
          htmlFor="details"
          className="w-full p-0 text-start font-light text-[13px] text-gray-500"
        >
          Diagnostico:
        </Label>
        <DinamicForm
          name="diagnosis"
          control={form.control}
          placeholder="Agregar detalles de la consulta"
          fieldType={FormFieldType.TEXTAREA}
        />
       </div>
        {/* prescription */}
        <div className="w-full flex items-start justify-center flex-col">
       <Label
          htmlFor="details"
          className="w-full p-0 text-start font-light text-[13px] text-gray-500"
        >
          Prescribir medicamento:
        </Label>
        <DinamicForm
          name="prescription"
          control={form.control}
          placeholder="Agregar medicamentos a recetar"
          fieldType={FormFieldType.TEXTAREA}
        />
       </div>
       {/* notes */}
       <div className="w-full flex items-start justify-center flex-col">
       <Label
          htmlFor="details"
          className="w-full p-0 text-start font-light text-[13px] text-gray-500"
        >
          Notas adicionales:
        </Label>
        <DinamicForm
          name="notes"
          control={form.control}
          placeholder="Agregar notas adicionales"
          fieldType={FormFieldType.TEXTAREA}
        />
       </div>
       {/* followUpRequired  */}
       <div className="w-full flex items-start justify-center">
        <Label
          htmlFor="details"
          className="w-full p-0 text-start font-light text-[13px] text-gray-500"
        >Requiere Seguimiento?</Label>
        <DinamicForm
        name="followUpRequired"
        control={form.control}
        fieldType={FormFieldType.CHECKBOX}
        />
       </div>
        <div className="w-[100%] flex items-start justify-center">
          {form?.getValues()?.patientAttachedFilesUrl?.length! > 0 ? (
            <div className="w-full h-full  flex-col flex items-start justify-center pt-0 text-white">
              <button
                className="size-4 flex items-center justify-end"
                onClick={() => {
                  setIsTthereAnImage(false);
                  form.resetField("patientAttachedFilesUrl");
                }}
              >
                <Icon src={closeIcon} alt="close-icon" height={30} width={30} />
              </button>
              <DinamicForm
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="patientAttachedFilesUrl"
                renderSkeleton={(field) => (
                  <FormControl className="w-full">
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
              <div
                className="w-[100%]"
                onClick={() => setIsTthereAnImage(true)}
              >
                <Label
                  htmlFor="patientAttachedFilesUrl"
                  className="p-0 font-light text-[13px] text-gray-500"
                >
                  Agregar Árchivos Lab-Médicos
                </Label>
                <DinamicForm
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="patientAttachedFilesUrl"
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
