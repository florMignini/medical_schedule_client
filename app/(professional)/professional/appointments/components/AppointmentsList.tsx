"use client";

import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppointmentsIncluded, PatientsIncluded } from "@/interfaces";
import { getTodayAppointments } from "@/utils/getTodayAppointments";
import { getAppointmentDetail } from "@/utils/getAppointmentDetail";
import { useSelectedDate } from "@/utils/useSelectedDate";
import { addMinutes, format, setHours, setMinutes } from "date-fns";
import dayjs from "dayjs";
import ConfigAppointmentButton from "../../components/ConfigAppointmentButton";
import { CalendarClock, Plus } from "lucide-react";

type AppointmentListProps = {
  appointments: Array<AppointmentsIncluded>;
  patients: Array<PatientsIncluded>;
  pastAppointmentPatientData?: any;
  isDemo?: boolean;
  refetch?: () => void;
  /** 
   * 🔹 Handler recibido desde CalendarModern
   * Se usa para abrir el SlidePanel en la hora seleccionada.
   * Recibe un objeto Date con la fecha y hora exacta del turno.
   */
  onAddAppointment?: (datetime: Date) => void;
};

const AppointmentsList = ({
  appointments,
  patients,
  pastAppointmentPatientData,
  isDemo = false,
  refetch,
  onAddAppointment,
}: AppointmentListProps) => {
  // Fecha seleccionada global del calendario
  const { selectedDate } = useSelectedDate();

  // Lista de turnos del día actual
  const events = getTodayAppointments(appointments, selectedDate || new Date());

  // Determina si la fecha seleccionada ya pasó
  const isPast = dayjs(selectedDate || new Date()).isBefore(dayjs(), "day");

  /**
   * 🔹 Genera los intervalos de media hora (08:00 - 20:30)
   * Cada intervalo se usa como “bloque horario” del día.
   */
  const timeSlots = useMemo(() => {
    const slots = [];
    const date = selectedDate || new Date();

    for (let hour = 8; hour <= 20; hour++) {
      slots.push({ time: setHours(setMinutes(date, 0), hour) });
      slots.push({ time: setHours(setMinutes(date, 30), hour) });
    }

    return slots;
  }, [selectedDate]);

  /**
   * 🔹 Retorna el turno (si existe) en un horario específico
   */
  const getAppointmentAt = (time: Date) =>
    events.find(
      (appt: AppointmentsIncluded) =>
        dayjs(appt.appointment.schedule).format("HH:mm") ===
        dayjs(time).format("HH:mm")
    );

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Scroll de los intervalos horarios */}
      <ScrollArea className="h-[700px] space-y-4">
        {timeSlots.map(({ time }, i) => {
          const appt = getAppointmentAt(time);
          const hour = format(time, "HH:mm");
          const isDisabled =
            isPast ||
            (appt &&
              appt.appointment.id ===
                pastAppointmentPatientData?.[0]?.pastAppointments?.id);

          return (
            <div
              key={i}
              className={`w-full rounded-xl p-2 transition shadow-md border mb-1 text-sm
                ${
                  appt
                    ? "bg-emerald-100 border-emerald-300"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }
                ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {/* 🔹 Cabecera del bloque horario */}
              <div className="w-full flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-black">
                  <CalendarClock className="w-4 h-4" />
                  <span className="font-medium">{hour}</span>
                </div>

                {/* Botón de configuración (solo si existe turno en esa hora) */}
                {appt && (
                  <ConfigAppointmentButton
                    appointment={appt}
                    refetch={refetch}
                  />
                )}
              </div>

              {/* 🔹 Contenido del bloque */}
              {appt ? (
                /* Si hay un turno, mostramos su información */
                <div
                  onClick={async () => {
                    if (isDisabled) return;
                    // Muestra detalle o manejo de seguimiento
                    await getAppointmentDetail(appt.appointment.id);
                  }}
                  className="text-gray-800"
                >
                  <p className="font-semibold truncate">
                    {appt.appointment.notes}
                  </p>
                  <p className="text-gray-500 text-sm truncate">
                    {appt.appointment.reason}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {`${format(
                      new Date(appt.appointment.schedule),
                      "HH:mm"
                    )} - ${format(
                      addMinutes(new Date(appt.appointment.schedule), 30),
                      "HH:mm"
                    )}`}
                  </p>
                </div>
              ) : (
                /* Si no hay turno, mostramos “Agregar evento” */
                <div
                  onClick={() =>
                    !isDisabled &&
                    onAddAppointment &&
                    onAddAppointment(time) // ⏰ Pasa la hora exacta al SlidePanel
                  }
                  className="text-gray-500 text-sm italic flex items-center gap-2 hover:text-emerald-600 transition"
                >
                  <Plus className="w-4 h-4" /> agregar evento
                </div>
              )}
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default AppointmentsList;
