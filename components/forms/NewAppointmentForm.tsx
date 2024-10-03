"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";
import { FormFieldType } from "./ProfessionalLoginForm";
import SubmitButton from "../SubmitButton";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAppointmentSchema } from "@/lib";

type AppointmentType = "create" | "cancel" | "schedule";
type professionalDataType = {
  id: string;
  firstname: string;
  lastname: string;
};
const NewAppointmentForm = ({
  type,
  patientId,
}: {
  type: AppointmentType;
  patientId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [professionalId, setProfessionalId] = useState<professionalDataType>();
  const appointmentValidation = getAppointmentSchema(type);
  useEffect(() => {
    const professionalData = localStorage.getItem("infoProfSession");
    if (professionalData) {
      const parsedData: professionalDataType = JSON.parse(professionalData);
      setProfessionalId(parsedData);
    }
  }, []);

  const router = useRouter();
  const form = useForm<z.infer<typeof appointmentValidation>>({
    resolver: zodResolver(appointmentValidation),
    defaultValues: {
      schedule: new Date(),
      reason: "",
      notes: "",
      cancellationReason: "",
    },
  });

  async function onSubmit(values: z.infer<typeof appointmentValidation>) {
    setLoading(true);
    try {
      if (type === "create" && patientId && professionalId) {
        const appointmentData = {
          schedule: new Date(values.schedule),
          reason: values.reason,
          notes: values.notes,
          patientId: patientId,
          professionalId: professionalId?.id,
        };
      }
    } catch (error: any) {
      console.error(error);
      setLoading(false);
    }
  }

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancelar Turno";
      break;
    case "create":
      buttonLabel = "Crear Turno";
      break;
    case "schedule":
      buttonLabel = "Programar Turno";
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
        {type !== "cancel" && (
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

        {type === "cancel" && (
          <DinamicForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Razón de cancelación"
            placeholder="Ingrese la razón de cancelación"
          />
        )}
        <SubmitButton
          loading={loading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full rounded-md p-1`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default NewAppointmentForm;
