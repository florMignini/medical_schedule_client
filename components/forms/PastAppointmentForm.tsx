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
import { createPastAppointment } from "@/app/actions";
import { useRouter } from "next/navigation";
import FileUploaderPlus from "../FileUploaderPlus";
import { useToast } from "@/hooks/use-toast";

const PastAppointmentForm = ({ patient, appointment }: any) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isThereAnImage, setIsThereAnImage] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof NewPastAppointmentSchema>>({
    resolver: zodResolver(NewPastAppointmentSchema),
    defaultValues: {
      diagnosis: "",
      prescription: "",
      notes: "",
      scheduled: new Date(appointment?.schedule),
      patientAttachedFilesUrl: [],
    },
  });

  async function onSubmit(values: z.infer<typeof NewPastAppointmentSchema>) {
    setLoading(true);

    try {
      let filesData: FormData[] = [];

      // Preparar archivos si hay
      if (values?.patientAttachedFilesUrl?.length) {
        filesData = values.patientAttachedFilesUrl.map((file: File) => {
          const formData = new FormData();
          const blobFile = new Blob([file], { type: file.type });
          formData.append("blobFile", blobFile);
          formData.append("fileName", file.name);
          return formData;
        });
      }

      // Construir payload
      const payload = {
        ...values,
        scheduled: appointment.schedule,
        patientId: patient.id,
        patientAttachedFilesUrl: filesData,
        appointmentId: appointment.id,
      };

      // Crear past appointment (backend se encarga de la relación)
      const response: any = await createPastAppointment(payload);

      if (!response.success) {
        toast({
          title: "Error",
          description: response.message || "Error al crear la cita pasada",
          className: "bg-red-500 text-white",
        });
      } else {
        toast({
          title: "Cita pasada creada",
          description: "La cita se ha creado exitosamente.",
          className: "bg-emerald-500 text-black",
        });
        form.reset();
        router.push(`/professional/patients/${patient.id}/info`);
      }
    } catch (error) {
      console.error("Error creando past appointment:", error);
      // Opcional: mostrar toast de error
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 flex-1"
      >
        {/* Scheduled (solo lectura) */}
        <div className="w-full">
          <Label className="text-sm text-white">Fecha de la cita:</Label>
          <DinamicForm
            name="scheduled"
            control={form.control}
            fieldType={FormFieldType.INPUT}
            type="text"
            defaultValue={new Date(appointment?.schedule).toLocaleString()}
            readOnly
          />
        </div>

        {/* diagnosis & prescription */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <Label className="text-sm text-white">Diagnóstico:</Label>
            <DinamicForm
              name="diagnosis"
              control={form.control}
              placeholder="Agregar detalles de la consulta"
              fieldType={FormFieldType.TEXTAREA}
            />
          </div>
          <div className="w-full md:w-1/2">
            <Label className="text-sm text-white">Prescripción:</Label>
            <DinamicForm
              name="prescription"
              control={form.control}
              placeholder="Agregar medicamentos a recetar"
              fieldType={FormFieldType.TEXTAREA}
            />
          </div>
        </div>

        {/* notes */}
        <div className="w-full">
          <Label className="text-sm text-white">Notas adicionales:</Label>
          <DinamicForm
            name="notes"
            control={form.control}
            placeholder="Agregar notas adicionales"
            fieldType={FormFieldType.TEXTAREA}
          />
        </div>

        {/* File uploader */}
        <div className="w-full">
          <Label className="text-sm text-white">
            Agregar Archivos Lab-Médicos:
          </Label>
          <DinamicForm
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="patientAttachedFilesUrl"
            renderSkeleton={(field) => (
              <FormControl className="w-full">
                <FileUploaderPlus
                  form={form}
                  name="patientAttachedFilesUrl"
                  files={field.value || []}
                  onChange={field.onChange}
                />
              </FormControl>
            )}
          />
        </div>

        <SubmitButton
          className="w-full text-black hover:text-white border-white/20 bg-white/80 hover:bg-black p-2 rounded-lg"
          loading={loading}
        >
          Finalizar cita
        </SubmitButton>
      </form>
    </Form>
  );
};

export default PastAppointmentForm;
