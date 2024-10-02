"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";
import { FormFieldType } from "./ProfessionalLoginForm";
import SubmitButton from "../SubmitButton";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentValidation } from "@/lib";
import { z } from "zod";


type AppointmentType = "create" | "cancel" | "schedule";

const NewAppointmentForm = ({
  type,
  patientId,
}: {
  type: AppointmentType;
  patientId: string;
}) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof appointmentValidation>>({
    resolver: zodResolver(appointmentValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(value: z.infer<typeof appointmentValidation>) {
    setLoading(true);
    try {
      //   const res = await loginUser(value);
      //   localStorage.setItem('infoProfSession', JSON.stringify({
      //     firstname: res?.firstName,
      //     lastname: res?.lastName,
      //     id: res?.id,
      //   }))
      //   res ? router.push("/professional/dashboard") : router.push("/");
    } catch (error: any) {
      console.error(error);
      setLoading(false);
    }
  }

  let buttonLabel;
  switch (type) {
    case "cancel":
        buttonLabel = "Cancelar Turno"
        break;
    case "create":
        buttonLabel = "Crear Turno"
        break;
    case "schedule":
        buttonLabel = "Programar Turno"
        break;
    default:
        break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h3 className="header">Crear nuevo turno</h3>
        </section>
       {
        type !== "cancel" && (
            <>
            {/* pick date */}
            <DinamicForm
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="schedule"
                label="Fecha del Turno"
                showTimeSelect
                dateFormat="dd/MM/yyyy - h:mm aa"
              />
           <div className="flex flex-col gap-5 xl:flex-row">
            <DinamicForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="reason"
            label="Motivo de la consulta"
            placeholder="Ingrese el motivo de la consulta"
            />
            <DinamicForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="notes"
            label="Información adicional"
            placeholder="Ingrese innformación adicional"
            />
           </div>
            </>
        )}

        {
            type === "cancel" && (
              <DinamicForm
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="cancellationReason"
                label="Razón de cancelación"
                placeholder="Ingrese la razón de cancelación"
              />
            )
        }
        <SubmitButton loading={loading}
        className={`${type === 'cancel' ? "shad-danger-btn" : "shad-primary-btn"} w-full rounded-md p-1`}
        >{buttonLabel}</SubmitButton>
      </form>
    </Form>
  );
};

export default NewAppointmentForm;
