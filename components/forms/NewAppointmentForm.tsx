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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { FormField, FormItem } from "../ui/form";
import { Patient } from "@/interfaces";

// SpinnerOverlay: visual feedback al enviar
const SpinnerOverlay = () => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-md">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-400"></div>
  </div>
);

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
  patientsList,
  patient,
  initialDateTime,
  onSuccess,
  component,
  isDemo = false,
}: {
  type: AppointmentType;
  patientId: string;
  patientsList?: { patient: Patient }[];
  patient?: Patient;
  initialDateTime?: Date | null;
  onSuccess?: () => void;
  component?: string;
  isDemo?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [professionalId, setProfessionalId] = useState<professionalDataType>();
  const appointmentValidation = getAppointmentSchema(type);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const professionalData = localStorage.getItem("infoProfSession");
    if (professionalData) {
      const parsedData: professionalDataType = JSON.parse(professionalData);
      setProfessionalId(parsedData);
    }
  }, []);

  const form = useForm<z.infer<typeof appointmentValidation>>({
    resolver: zodResolver(appointmentValidation),
    defaultValues: {
      schedule: initialDateTime ? new Date(initialDateTime) : new Date(),
      reason: "",
      notes: "",
      cancellationReason: "",
      patientId: patient?.id || patientId || "",
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
      if (isDemo) {
        // 💡 Simulation without persistance
        await new Promise((res) => setTimeout(res, 1000));
        toast({
          title: "Turno simulado",
          description: "Este turno fue creado en modo demo.",
          className: "bg-yellow-400 text-black",
          duration: 4000,
        });
        form.reset();
        setLoading(false);
        onSuccess?.();
        return;
      }

      // 🟢 Real persistance
      const response = (await createAppointment(
        appointmentData
      )) as AppointmentResponse;
 
      if (response) {
        const professionalIDs = {
          professional: professionalId?.id,
          appointment: response.id,
        };
        await createProfessionalAppointmentRelation(professionalIDs);

        const patientsIDs = {
          patient: values.patientId || patient?.id || patientId,
          appointment: response.id,
        };
        await createPatientAppointmentRelation(patientsIDs);

        setLoading(false);
        toast({
          title: "Programando Turno...",
          description: "El turno ha sido creado correctamente",
          className: "bg-emerald-500 text-black",
          duration: 5000,
        });
        form.reset();
        onSuccess?.();
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Ocurrió un problema al crear el turno.",
        className: "bg-red-500 text-white",
        duration: 4000,
      });
    }
  }


  let buttonLabel = "Enviar";
  if (type === "cancel") buttonLabel = "Cancelar Turno";
  else if (type === "create") buttonLabel = "Crear Turno";
  else if (type === "schedule") buttonLabel = "Programar Turno";

  const showPatientSelector =
    patientsList &&
    patientsList.length > 0 &&
    component !== "seguimiento" &&
    component === "calendar";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex-1 relative"
      >
        {type !== "cancel" && (
          <>
            {showPatientSelector ? (
              <div className="w-full flex flex-col text-gray-500 gap-2 items-center justify-center bg-inherit">
                <h3 className="w-full font-thin text-lg">
                  Pacientes pertenecientes a su cartera:
                </h3>
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem className="w-[75%] mx-auto">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="h-16">
                          <SelectValue placeholder="Seleccione paciente" />
                        </SelectTrigger>
                        <ScrollArea className="w-full max-h-[300px]">
                          <SelectContent className="flex flex-col gap-2 items-center justify-center bg-black/10 backdrop-blur-lg">
                            {patientsList.map(({ patient }) => (
                              <SelectItem
                                key={patient.id}
                                value={patient.id}
                                className="text-white h-16"
                              >
                                <div className="flex gap-2 items-center justify-center">
                                  <Image
                                    src={patient.patientPhotoUrl}
                                    alt={patient.firstName}
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                  />
                                  <h2 className="text-white font-bold text-base">
                                    {patient.firstName} {patient.lastName}
                                  </h2>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </ScrollArea>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              patient && (
                <div className="w-auto flex items-center justify-center space-y-2">
                  <div className="w-full h-15 px-2 py-1 rounded-md shadow-inner shadow-white/20 text-white font-semibold">
                    <div className="w-auto flex gap-2 items-center justify-center">
                      <Image
                        src={patient.patientPhotoUrl}
                        alt={patient.firstName}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <h2 className="text-white font-bold text-base">
                        {patient.firstName} {patient.lastName}
                      </h2>
                    </div>
                  </div>
                </div>
              )
            )}

            <div className="flex flex-col gap-1">
              <label className="text-gray-500">Fecha del turno</label>
              <DinamicForm
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="schedule"
                disable={component === "calendar"}
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
          disabled={!patient && !showPatientSelector && !patientId}
        >
          {buttonLabel}
        </SubmitButton>

        {loading && <SpinnerOverlay />}
      </form>
    </Form>
  );
};

export default NewAppointmentForm;
