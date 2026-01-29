"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import DinamicForm from "../DinamicForm";
import { FormFieldType } from "./ProfessionalLoginForm";
import SubmitButton from "../SubmitButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAppointmentSchema } from "@/lib";
import { uploadPatientFilesClient } from "@/lib/uploadPatientFilesClient";
import {
  createAppointment,
  createProfessionalAppointmentRelation,
  // ❌ NO usar: createPatientAppointmentRelation
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
import { Patient } from "@/interfaces";
import FileUploaderPlus from "../FileUploaderPlus";

const SpinnerOverlay = () => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-md">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-400"></div>
  </div>
);

type AppointmentType = "create" | "cancel" | "schedule";
type professionalDataType = { id: string; firstname: string; lastname: string };
type AppointmentResponse = { id: string };

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
  patientId?: string;
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

  useEffect(() => {
    const professionalData = localStorage.getItem("infoProfSession");
    if (professionalData) setProfessionalId(JSON.parse(professionalData));
  }, []);

  const form = useForm<z.infer<typeof appointmentValidation>>({
    resolver: zodResolver(appointmentValidation),
    defaultValues: {
      schedule: initialDateTime ? new Date(initialDateTime) : new Date(),
      reason: "",
      notes: "",
      cancellationReason: "",
      patientId: patient?.id || patientId || "",
      isPastAppointment: false,
      pastAppointment: undefined,
    } as any,
  });

  const showPatientSelector =
    patientsList &&
    patientsList.length > 0 &&
    (component === "calendar" || component === "dashboard");

  const isPast = !!form.watch("isPastAppointment");

  async function onSubmit(values: z.infer<typeof appointmentValidation>) {
    setLoading(true);

    try {
      const isPastLocal = !!(values as any).isPastAppointment;

      // Demo mode
      if (isDemo) {
        await new Promise((res) => setTimeout(res, 800));
        toast({
          title: "Turno simulado",
          description: "Este turno fue creado en modo demo.",
          className: "bg-yellow-400 text-black",
          duration: 3500,
        });
        form.reset();
        onSuccess?.();
        return;
      }

      // 1) Upload archivos si es espontánea
      let uploadedFilesUrls: string[] = [];
      const files = (values as any)?.pastAppointment
        ?.patientAttachedFilesUrl as File[] | undefined;

      if (isPastLocal && files?.length) {
        try {
          uploadedFilesUrls = await uploadPatientFilesClient(files);
        } catch (e) {
          console.error("Upload failed:", e);
          toast({ title:"Error", description:"No se pudieron subir los archivos", className:"bg-red-500 text-white", duration:4000 });
          uploadedFilesUrls = [];
        }
      }

      // 2) Payload compatible con backend
      const payload: any = {
        schedule: new Date((values as any).schedule).toISOString(),
        reason: (values as any).reason,
        notes: (values as any).notes ?? "",
        cancellationReason: (values as any).cancellationReason ?? "",
        patientId: (values as any).patientId || patient?.id || patientId,
        isPastAppointment: isPastLocal,
      };

      if (isPastLocal) {
        payload.pastAppointment = {
          diagnosis: (values as any)?.pastAppointment?.diagnosis,
          prescription: (values as any)?.pastAppointment?.prescription,
          notes: (values as any)?.pastAppointment?.notes,
          followUpRequired:
            (values as any)?.pastAppointment?.followUpRequired ?? false,

          // legacy (backend lo ignora/forza)
          scheduled: payload.schedule,

          patientAttachedFilesUrl: uploadedFilesUrls.length
            ? uploadedFilesUrls
            : undefined,
        };
      }

      const response = (await createAppointment(
        payload,
      )) as AppointmentResponse;

      if (response?.id) {
        // ✅ Solo profesional relation (por ahora)
        await createProfessionalAppointmentRelation({
          professional: professionalId?.id,
          appointment: response.id,
        });

        // ❌ NO crear relación paciente acá (backend ya lo hace)
        // await createPatientAppointmentRelation(...)

        toast({
          title: isPastLocal
            ? "Registrando cita espontánea..."
            : "Programando turno...",
          description: isPastLocal
            ? "La cita espontánea fue registrada correctamente."
            : "El turno ha sido creado correctamente.",
          className: "bg-emerald-500 text-black",
          duration: 5000,
        });

        form.reset({
          schedule: new Date(),
          reason: "",
          notes: "",
          cancellationReason: "",
          patientId: patient?.id || patientId || "",
          isPastAppointment: false,
          pastAppointment: undefined,
        } as any);

        onSuccess?.();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Ocurrió un problema al crear el turno.",
        className: "bg-red-500 text-white",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  }

  let buttonLabel = "Enviar";
  if (type === "cancel") buttonLabel = "Cancelar Turno";
  else if (type === "create")
    buttonLabel = isPast ? "Registrar espontánea" : "Crear Turno";
  else if (type === "schedule")
    buttonLabel = isPast ? "Registrar espontánea" : "Programar Turno";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex-1 relative"
      >
        {/* ✅ Toggle solo cuando no es cancel */}
        {type !== "cancel" && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                form.setValue("isPastAppointment", false as any);
                form.setValue("pastAppointment", undefined as any);
              }}
              className={`flex-1 rounded-lg px-3 py-2 text-sm border ${
                !isPast
                  ? "bg-emerald-500 text-black border-emerald-500"
                  : "bg-white/60 text-gray-700"
              }`}
            >
              Programada
            </button>

            <button
              type="button"
              onClick={() => {
                form.setValue("isPastAppointment", true as any);
                form.setValue("schedule", new Date() as any);
                form.setValue("pastAppointment", {
                  diagnosis: "",
                  prescription: "",
                  notes: "",
                  followUpRequired: false,
                  scheduled: new Date(),
                  patientAttachedFilesUrl: [],
                } as any);
              }}
              className={`flex-1 rounded-lg px-3 py-2 text-sm border ${
                isPast
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-white/60 text-gray-700"
              }`}
            >
              Espontánea
            </button>
          </div>
        )}

        {type !== "cancel" && (
          <>
            {/* Paciente selector */}
            {showPatientSelector && patientsList ? (
              <div className="w-full flex flex-col text-gray-500 gap-2 items-center justify-center bg-inherit">
                <h3 className="w-full font-thin text-lg">
                  Pacientes pertenecientes a su cartera:
                </h3>

                <FormField
                  control={form.control}
                  name={"patientId" as any}
                  render={({ field }) => (
                    <FormItem className="w-[75%] mx-auto">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger
                          className="h-16"
                          data-testid="patient-select"
                        >
                          <SelectValue placeholder="Seleccione paciente" />
                        </SelectTrigger>

                        <ScrollArea className="w-full max-h-[300px]">
                          <SelectContent className="flex flex-col gap-2 items-center justify-center bg-black/10 backdrop-blur-lg">
                            {patientsList.map(({ patient }) => (
                              <SelectItem
                                key={patient.id}
                                value={patient.id}
                                className="text-black h-16"
                              >
                                <div className="flex gap-2 items-center justify-center">
                                  <Image
                                    src={patient.patientPhotoUrl}
                                    alt={patient.firstName}
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                  />
                                  <h2 className="font-bold text-base">
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
            ) : patientsList && patientsList.length === 0 ? (
              <div className="w-full text-center text-gray-400 italic py-4">
                <h3 className="underline text-gray-400 hover:text-gray-300">
                  No tienes pacientes registrados aún
                </h3>
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

            {/* Fecha */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-500">Fecha del turno</label>
              <DinamicForm
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name={"schedule" as any}
                disable={component === "calendar"}
                showTimeSelect
                defaultValue={initialDateTime || new Date()}
                dateFormat="dd/MM/yyyy - h:mm aa"
              />
            </div>

            {/* Motivo + notas */}
            <div className="flex flex-col gap-5 xl:flex-row">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-gray-500">Motivo de la consulta</label>
                <DinamicForm
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name={"reason" as any}
                  placeholder="Ingrese el motivo de la consulta"
                />
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <label className="text-gray-500">Información adicional</label>
                <DinamicForm
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name={"notes" as any}
                  placeholder="Ingrese información adicional"
                />
              </div>
            </div>

            {/* ✅ Spontánea: datos clínicos + adjuntos */}
            {isPast && (
              <div className="rounded-xl border border-black/10 bg-white/70 p-4 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Datos clínicos (cita espontánea)
                </h3>

                <div className="flex flex-col gap-1">
                  <label className="text-gray-500">Diagnóstico</label>
                  <DinamicForm
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name={"pastAppointment.diagnosis" as any}
                    placeholder="Ej: Gripe común"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-gray-500">
                    Prescripción (opcional)
                  </label>
                  <DinamicForm
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name={"pastAppointment.prescription" as any}
                    placeholder="Ej: Paracetamol 500mg..."
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-gray-500">
                    Notas clínicas (opcional)
                  </label>
                  <DinamicForm
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name={"pastAppointment.notes" as any}
                    placeholder="Observaciones..."
                  />
                </div>

                <FormField
                  control={form.control}
                  name={"pastAppointment.followUpRequired" as any}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-black/10 p-3">
                      <span className="text-gray-600 text-sm">
                        Requiere seguimiento
                      </span>
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4"
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={"pastAppointment.patientAttachedFilesUrl" as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUploaderPlus
                          form={form}
                          name="pastAppointment.patientAttachedFilesUrl"
                          files={field.value || []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </>
        )}

        {type === "cancel" && (
          <DinamicForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name={"cancellationReason" as any}
            label="Razón de cancelación"
            placeholder="Ingrese la razón de cancelación"
          />
        )}

        <SubmitButton
          data-testid="appointment-submit-btn"
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
