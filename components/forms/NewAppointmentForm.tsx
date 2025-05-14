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
import {
  createAppointment,
  createPatientAppointmentRelation,
  createProfessionalAppointmentRelation,
} from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type AppointmentType = "create" | "cancel" | "schedule";
export type professionalDataType = {
  id: string;
  firstname: string;
  lastname: string;
};

type AppointmentResponse = {
  id: string;
};

const NewAppointmentForm = ({
  type,
  patientId,
  initialDateTime,
  onSuccess,
  component,
}: {
  type: AppointmentType;
  patientId: string;
  initialDateTime?: Date | null;
  onSuccess?: () => void;
  component?: string;
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
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof appointmentValidation>>({
    resolver: zodResolver(appointmentValidation),
    defaultValues: {
      schedule: initialDateTime ? new Date(initialDateTime) : new Date(),
      reason: "",
      notes: "",
      cancellationReason: "",
    },
  });
  async function onSubmit(values: z.infer<typeof appointmentValidation>) {
    setLoading(true);
    try {
      const appointmentData = {
        schedule: new Date(values.schedule),
        reason: values.reason,
        notes: values.notes,
      };
      const response = await createAppointment(appointmentData) as AppointmentResponse;

      if (response) {
        const professionalIDs = {
          professional: professionalId?.id,
          appointment: response?.id,
        };
        const profData = await createProfessionalAppointmentRelation(
          professionalIDs
        );
        const patientsIDs = {
          patient: patientId,
          appointment: response?.id,
        };

        const patientData = await createPatientAppointmentRelation(patientsIDs);

        setLoading(false);
        toast({
          className: "bg-emerald-500 text-black",
          title: "Programando Turno...",
          description: "El turno ha sido creado correctamente",
          duration: 5000,
        });
        onSuccess?.();
        form.reset();
        router.refresh();
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
        
        {type !== "cancel" && (
          <>
          {component === "calendar" && (
            <div>
              <h3>Seleccione paciente:</h3>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione paciente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Paciente 1</SelectItem>
                  <SelectItem value="2">Paciente 2</SelectItem>
                  <SelectItem value="3">Paciente 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
            {/* pick date */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-500">Fecha del turno</label>
            <DinamicForm
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              showTimeSelect
              defaultValue={initialDateTime || new Date()}
              dateFormat="dd/MM/yyyy - h:mm aa"
            />
            </div>
            <div className="flex flex-col gap-5 xl:flex-row">
             <div className="flex flex-col gap-1">
              <label className="text-gray-500">Motivo de la consulta</label>
             <DinamicForm
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                placeholder="Ingrese el motivo de la consulta"
              />
             </div>
             <div className="flex flex-col gap-1">
              <label className="text-gray-500">Información adicional</label>
              <DinamicForm
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="notes"
                placeholder="Ingrese información adicional"
              />
             </div>
              
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
