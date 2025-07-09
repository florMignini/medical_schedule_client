"use client";
import { RescheduleAppointmentSchema } from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, Label } from "../ui";
import DinamicForm from "../DinamicForm";
import { FormFieldType } from "./ProfessionalLoginForm";
import SubmitButton from "../SubmitButton";
import { rescheduleAppointment } from "@/app/actions";
import { useSelectedDate } from "@/utils/useSelectedDate";
import { useToast } from "@/hooks/use-toast";

type Props = {
  id: string;
  appointment: any;
  onSuccess: () => void;
};
const RescheduleAppointmentForm = ({ id, appointment, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { setSelectedDate } = useSelectedDate();
  const form = useForm<z.infer<typeof RescheduleAppointmentSchema>>({
    resolver: zodResolver(RescheduleAppointmentSchema),
    defaultValues: {
      schedule: new Date(appointment?.appointment.schedule),
      reason: appointment?.appointment.reason,
      notes: appointment?.appointment.notes,
      cancellationReason:
        appointment?.appointment.cancellationReason ?? undefined,
    },
  });

  // onSubmit form

  async function onSubmit(values: z.infer<typeof RescheduleAppointmentSchema>) {
    setLoading(true);

    const valuesUpdated = {
      schedule:
        new Date(appointment?.appointment.schedule) ===
        new Date(appointment?.appointment.schedule)
          ? new Date(appointment?.appointment.schedule)
          : new Date(values.schedule),
      reason: appointment?.appointment.reason,
      notes: appointment?.appointment.notes,
      cancellationReason:
        values.cancellationReason === null
          ? appointment?.appointment.cancellationReason
          : values.cancellationReason,
    };

    try {
      const rescheduleData = {
        ...valuesUpdated,
        appointmentId: appointment?.appointment.id,
      };
      const response = await rescheduleAppointment(rescheduleData);
      if (response) {
        setLoading(false);
        form.reset();
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 flex-1"
      >
        <div className="flex px-2 gap-2 mb-5">
          <div className="h-5 border-x-2 border-black" />
          <h1 className="text-16-semibold">Reasignar turno</h1>
        </div>
        <div className="w-full mb-5 space-y-4 flex flex-wrap items-center justify-center gap-2">
          <div className="w-[95%]">
            {/* name & lastname */}
            <div className="w-full flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="reason"
                label="Motivo de la consulta"
                disable
                defaultValue={appointment?.appointment.reason}
              />
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="notes"
                label="Notas adicionales"
                disable
                defaultValue={appointment?.appointment.notes}
              />
            </div>
            <div className="flex flex-col mb-2">
              <Label
                htmlFor="schedule"
                className="pb-2 text-start font-semibold text-[13px] text-black"
              >
                Reprogramar para:
              </Label>
              <DinamicForm
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="schedule"
                showTimeSelect
                dateFormat="dd/MM/yyyy - h:mm aa"
              />
            </div>
            <div className="flex gap-2 mb-2">
              <DinamicForm
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="cancellationReason"
                label="Motivo de reprogramación"
                defaultValue={appointment?.appointment.cancellationReason}
              />
            </div>
          </div>
        </div>
        {/* submit button */}
        <div className="w-full min-[768px]:w-[60%] flex mb-5 items-center justify-center mx-auto">
          <SubmitButton
            loading={loading}
            className="min-[375px]:w-[95%] min-[768px]:w-[60%] text-base font-light bg-white hover:bg-white/50 transition-colors rounded-lg p-2"
          >
            Reprogramar
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default RescheduleAppointmentForm;
