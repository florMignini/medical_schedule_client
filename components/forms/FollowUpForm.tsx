"use client";
import React, { useState } from "react";
import { Form, FormControl } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormFieldType } from "./ProfessionalLoginForm";
import SubmitButton from "../SubmitButton";
import { useForm } from "react-hook-form";
import { Label } from "../ui";

import { useRouter } from "next/navigation";

import FileUploaderPlus from "../FileUploaderPlus";
import { FollowUpSchema } from "@/lib/followUpValidation";
import { Checkbox } from "../ui/checkbox";

const FollowUpForm = ({ patient }: any) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [ifFollowUp, setIfFollowUp] = useState(false);
  const form = useForm<z.infer<typeof FollowUpSchema>>({
    resolver: zodResolver(FollowUpSchema),
    defaultValues: {
      diagnosis: "",
      treatment: "",
      currentSymptoms: "",
      notes: "",
      physicalEmotionalCondition: "",
      scheduled: new Date(),
      suggestedAnalysis: "",
    },
  });
  // -------------------------------------
  // onSubmit form

  async function onSubmit(values: z.infer<typeof FollowUpSchema>) {
    setLoading(true);
    // let formData: FormData | undefined;

    // const dataArr:any[] = [];
    // if (
    //   values.patientAttachedFilesUrl &&
    //   values.patientAttachedFilesUrl.length > 0
    // ) {
    //   values.patientAttachedFilesUrl.forEach((file: File) => {
    //     formData = new FormData();
    //     const blobFile = new Blob([file], {
    //       type: file.type,
    //     });
    //     formData?.append("blobFile", blobFile);
    //     formData?.append("fileName", file.name);
    //     dataArr.push(formData);
    //   });
    // }

    // try {
    //   const followUpData = {
    //     ...values,
    //     // scheduled: appointment.schedule,
    //   };
    //   const response: any = await createPastAppointment(followUpData);

    //   if (response !== undefined) {
    //     const IDs = {
    //       patient: patient.id!,
    //       pastAppointments: response.id,
    //     };

    //     const data = await createPatientPastAppointmentRelation(IDs);
    //     if (response) {
    //       form.reset();
    //       setLoading(false);
    //       router.push(`/professional/patients/${patient.id}/info`);
    //     }else{
    //       setLoading(false);
    //     }
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  }

  // -------------------------------------

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[100%] space-y-6 flex-1"
      >
        {/* personal information */}
        <div className="mb-5 text-gray-500">
          <div className="flex px-2 gap-2 mb-5">
            <div className="h-5 border-x-2 border-gray-500" />
            <h1 className="text-16-semibold text-">Información Personal</h1>
          </div>
          <div>
            <Label>Fecha del seguimiento</Label>
            <DinamicForm
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="scheduled"
              showTimeSelect
              defaultValue={new Date()}
              dateFormat="dd/MM/yyyy - h:mm aa"
            />
          </div>
        </div>
        {/* patient update */}
        <div className="mb-5 text-gray-500">
          <div className="flex px-2 gap-2 mb-5">
            <div className="h-5 border-x-2 border-gray-500" />
            <h1 className="text-16-semibold text-">Estado del paciente </h1>
          </div>
          <div className="flex w-full gap-3">
            {/* current symptoms */}
            <div className="w-full flex items-start justify-center flex-col">
              <Label
                htmlFor="details"
                className="w-full p-0 text-start font-light text-[13px] text-gray-500"
              >
                Sintomas Actuales:
              </Label>
              <DinamicForm
                name="currentSymptoms"
                control={form.control}
                placeholder="Agregar detalles de los sintomas"
                fieldType={FormFieldType.TEXTAREA}
              />
            </div>

            {/* notes */}
            <div className="w-full flex items-start justify-center flex-col">
              <Label
                htmlFor="details"
                className="w-full p-0 text-start font-light text-[13px] text-gray-500"
              >
                Observaciones medicas:
              </Label>
              <DinamicForm
                name="notes"
                control={form.control}
                placeholder="Agregar notas adicionales"
                fieldType={FormFieldType.TEXTAREA}
              />
            </div>
          </div>
        </div>
        {/*follow up */}
        <div className="mb-5 text-gray-500">
          <div className="flex px-2 gap-2 mb-5">
            <div className="h-5 border-x-2 border-gray-500" />
            <h1 className="text-16-semibold text-">Acciones o seguimiento</h1>
          </div>
          <div className="flex flex-col w-full gap-3">
            <div className="w-full flex items-start justify-center flex-col">
              <Label
                htmlFor="details"
                className="w-full p-0 text-start font-light text-[13px] text-gray-500"
              >
                Tratamiento sugerido:
              </Label>
              <DinamicForm
                name="treatment"
                control={form.control}
                placeholder="Agregar tratamiento sugerido"
                fieldType={FormFieldType.TEXTAREA}
              />
            </div>
            <div className="w-full flex flex-col items-start justify-center gap-5">
              <div className="w-full flex items-center gap-3 justify-start">
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Hacer seguimiento?
                </Label>
                <Checkbox
                  id="terms"
                  onClick={() => setIfFollowUp(!ifFollowUp)}
                />
              </div>
              {ifFollowUp ? (
                <div className=" transition-all w-full flex flex-col items-start justify-center gap-3">
                  <Label>Proximo control</Label>
                  <DinamicForm
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="scheduled"
                    showTimeSelect
                    defaultValue={new Date()}
                    dateFormat="dd/MM/yyyy - h:mm aa"
                  />
                </div>
              ) : null}
            </div>
          </div>
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

export default FollowUpForm;
