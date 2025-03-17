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
import { createPastAppointment, createPatientPastAppointmentRelation } from "@/app/actions";
import  { useRouter } from "next/navigation";

import FileUploaderPlus from "../FileUploaderPlus";

const PastAppointmentForm = ({ patient, appointment }: any) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isThereAnImage, setIsThereAnImage] = useState<boolean>(false);
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
    let formData: FormData | undefined;

    const dataArr:any[] = [];
    if (
      values.patientAttachedFilesUrl &&
      values.patientAttachedFilesUrl.length > 0
    ) {
      values.patientAttachedFilesUrl.forEach((file: File) => {
        formData = new FormData();
        const blobFile = new Blob([file], {
          type: file.type,
        });
        formData?.append("blobFile", blobFile);
        formData?.append("fileName", file.name);
        dataArr.push(formData);
      });
    }

    try {
      const pastAppointmentData = {
        ...values,
        scheduled: appointment.schedule,
        patientAttachedFilesUrl: dataArr,
      };
      const response: any = await createPastAppointment(pastAppointmentData);

      if (response !== undefined) {
        const IDs = {
          patient: patient.id!,
          pastAppointments: response.id,
        };

        const data = await createPatientPastAppointmentRelation(IDs);
        if (response) {
          form.reset();
          setLoading(false);
          router.push(`/professional/patients/${patient.id}/info`);
        }else{
          setLoading(false);
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
        className="w-[100%] space-y-2 flex-1"
      >
        {/* appointment detail */}
       <div className="w-full flex flex-wrap mb-5 items-start justify-center">
         {/* diagnosis */}
         <div className="w-[50%] flex items-start justify-center flex-col">
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
        <div className="w-[50%] flex items-start justify-center flex-col">
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
       </div>
       <div className="w-full flex flex-wrap mb-5 items-start justify-center">
        {/* notes */}
        <div className="w-[50%] flex items-start justify-center flex-col">
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
        <div className="w-[50%] flex items-start justify-center">
          <Label
            htmlFor="details"
            className="w-full p-0 text-start font-light text-[13px] text-gray-500"
          >
            Requiere Seguimiento?
          </Label>
          <DinamicForm
            name="followUpRequired"
            control={form.control}
            fieldType={FormFieldType.CHECKBOX}
          />
        </div>
        </div>
        <div className="w-[100%] flex items-start justify-center">
          {form?.getValues()?.patientAttachedFilesUrl?.length! >= 0 ? (
            <>
              <div
                className="w-[100%]"
               >
                <Label
                  htmlFor="patientAttachedFilesUrl"
                  className="p-0 font-light text-[13px] text-gray-500"
                >
                  <p>Agregar Árchivos Lab-Médicos</p>
                </Label>

                <DinamicForm
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="patientAttachedFilesUrl"
                  renderSkeleton={(field) => (
                    <FormControl className="w-full">
                      <FileUploaderPlus
                      form={form}
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
          ) : (
            <div className="w-full h-full  flex-col flex items-start justify-center pt-0 text-white"></div>
          )}
        </div>
        <SubmitButton
          className="w-[100%] text-black hover:text-white border-white/20 bg-white/80 hover:bg-black p-2 rounded-lg"
          loading={loading}
        >
          Finalizar cita
        </SubmitButton>
      </form>
    </Form>
  );
};

export default PastAppointmentForm;
