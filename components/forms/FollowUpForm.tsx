"use client";
import React, { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormFieldType } from "./ProfessionalLoginForm";
import SubmitButton from "../SubmitButton";
import { useForm } from "react-hook-form";
import { Label } from "../ui";
import { useToast } from "@/hooks/use-toast";

import { useRouter } from "next/navigation";

import { FollowUpSchema } from "@/lib/followUpValidation";
import { Checkbox } from "../ui/checkbox";
import createFollowUp, {
  createAppointmentFollowUpRelation,
  createPatientFollowUpRelation,
  createProfessionalFollowUpRelation,
} from "@/app/actions/followUpAction";
import {
  createAppointment,
  createProfessionalAppointmentRelation,
} from "@/app/actions";
import { ICreateAppointment } from "@/interfaces";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import professionalDataType from "./NewAppointmentForm";

const FollowUpForm = ({
  component,
  patientId,
  onSuccess,
  initialDateTime,
  type,
}: {
  component?: string;
  patientId: string;
  onSuccess: () => void;
  initialDateTime: Date | null;
  type?: string;
}) => {
  const router = useRouter();
  const [professionalId, setProfessionalId] =
    useState<{ id: string } | undefined>();
  const [loading, setLoading] = useState(false);
  const [ifFollowUp, setIfFollowUp] = useState(false);
  const [nextAppointmentSchedule, setNextAppointmentSchedule] =
    useState<Date | null>(initialDateTime);
  const { toast } = useToast();

  useEffect(() => {
    const professionalData = localStorage.getItem("infoProfSession");
    if (professionalData) {
      const parsedData = JSON.parse(professionalData);
      setProfessionalId({ id: parsedData.id });
    }
  }, []);
  const form = useForm<z.infer<typeof FollowUpSchema>>({
    resolver: zodResolver(FollowUpSchema),
    defaultValues: {
      treatment: "",
      currentSymptoms: "",
      notes: "",
      scheduled: initialDateTime ? new Date(initialDateTime) : new Date(),
      suggestedAnalysis: "",
    },
  });
  // -------------------------------------
  // onSubmit form

  async function onSubmit(values: z.infer<typeof FollowUpSchema>) {
    setLoading(true);

    try {
      const response = await createFollowUp(values);

      if (!response?.success) return;

      const followUpId = ((response.data as { id?: string })?.id ??
        "") as string;

      await createProfessionalFollowUpRelation({
        professional: professionalId?.id,
        followUp: followUpId,
      });

      await createPatientFollowUpRelation({
        patient: patientId,
        followUp: followUpId,
      });

      if (ifFollowUp) {
        const appointmentData: ICreateAppointment & { patientId: string } = {
          schedule: nextAppointmentSchedule
            ? new Date(nextAppointmentSchedule).toISOString()
            : new Date().toISOString(),
          reason: values.currentSymptoms?.trim() || null,
          notes: values.notes?.trim() || null,
          patientId, // ✅ clave: backend crea la relación paciente-cita
        };

        const appointmentResponse = (await createAppointment(
          appointmentData,
        )) as {
          id: string;
        };

        if (appointmentResponse?.id) {
          // ✅ profesional relation (seguí haciéndola como antes)
          await createProfessionalAppointmentRelation({
            professional: professionalId?.id,
            appointment: appointmentResponse.id,
          });


          // ✅ relación followUp <-> appointment (queda igual)
          await createAppointmentFollowUpRelation({
            followUpId: ((response.data as { id?: string })?.id ??
              "") as string,
            appointment: appointmentResponse.id,
          });
        }
      }

      form.reset();
      router.push(`/professional/patients/${patientId}/info`);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Ocurrió un problema al finalizar el seguimiento.",
        className: "bg-red-500 text-white",
      });
    } finally {
      setLoading(false);
    }
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
          <div>
            <Label>Fecha del seguimiento</Label>
            <DinamicForm
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="scheduled"
              disable={component === "calendar" ? true : false}
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
                  onClick={() => {
                    setIfFollowUp(!ifFollowUp);
                  }}
                />
              </div>
              {ifFollowUp ? (
                <div className="transition-all w-full flex flex-col items-center justify-center gap-3 ">
                  <Label>Proximo control</Label>
                  <DatePicker
                    className="date-picker bg-white"
                    selected={nextAppointmentSchedule}
                    onChange={(date) => setNextAppointmentSchedule(date)}
                    showTimeSelect
                    dateFormat="dd/MM/yyyy - h:mm aa"
                    timeInputLabel="Time:"
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
