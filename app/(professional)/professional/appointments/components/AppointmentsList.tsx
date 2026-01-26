"use client";

import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppointmentsIncluded, PatientsIncluded } from "@/interfaces";
import { addMinutes, format, setHours, setMinutes } from "date-fns";
import dayjs from "dayjs";
import ConfigAppointmentButton from "../../components/ConfigAppointmentButton";
import { CalendarClock, Plus } from "lucide-react";

type AppointmentListProps = {
  appointments: Array<AppointmentsIncluded>;
  patients: Array<PatientsIncluded>;
  isDemo?: boolean;
  refetch?: () => void;

  /** ✅ fecha del día que estamos viendo (evita acoplar con useSelectedDate) */
  selectedDate: Date;

  /** ✅ crear turno en datetime exacto (snap 15m idealmente) */
  onAddAppointment?: (datetime: Date) => void;

  /** ✅ abrir detalle del turno (para PastAppointment) */
  onSelectAppointment?: (appointmentId: string) => void;

  /** opcional: si querés bloquear por pastAppointment ya creado */
  pastAppointmentPatientData?: any;
};

const DAY_START_HOUR = 8;
const DAY_END_HOUR = 18;
const STEP_MINUTES = 15;
const DEFAULT_APPT_MINUTES = 15;

function buildSlots(date: Date) {
  const slots: { time: Date }[] = [];
  // 08:00 -> 18:00 inclusive (18:00)
  for (let hour = DAY_START_HOUR; hour <= DAY_END_HOUR; hour++) {
    for (let min = 0; min < 60; min += STEP_MINUTES) {
      // si hour == 18, solo 18:00 (no 18:15/18:30/18:45)
      if (hour === DAY_END_HOUR && min !== 0) continue;
      slots.push({ time: setHours(setMinutes(date, min), hour) });
    }
  }
  return slots;
}

const safeDate = (d: unknown): Date | null => {
  const date = d instanceof Date ? d : new Date(d as any);
  return Number.isNaN(date.getTime()) ? null : date;
};

const fmtHHmm = (d: unknown) => {
  const dd = safeDate(d);
  return dd ? dayjs(dd).format("HH:mm") : "--:--";
};

export default function AppointmentsList({
  appointments,
  patients,
  isDemo = false,
  refetch,
  onAddAppointment,
  onSelectAppointment,
  selectedDate,
  pastAppointmentPatientData,
}: AppointmentListProps) {
  // Turnos del día
  const events = useMemo(() => {
    const day = dayjs(selectedDate).startOf("day");
    return appointments
      .filter((a) => dayjs(a.appointment.schedule).isSame(day, "day"))
      .sort(
        (a, b) =>
          dayjs(a.appointment.schedule).valueOf() -
          dayjs(b.appointment.schedule).valueOf(),
      );
  }, [appointments, selectedDate]);

  const isPastDay = dayjs(selectedDate).isBefore(dayjs(), "day");

  const timeSlots = useMemo(() => {
    const base = selectedDate ? new Date(selectedDate) : new Date();
    const dayBase = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      0,
      0,
      0,
      0,
    );

    const slots: { time: Date }[] = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let min = 0; min < 60; min += 15) {
        if (hour === 18 && min !== 0) continue; // solo 18:00
        slots.push({
          time: new Date(
            dayBase.getFullYear(),
            dayBase.getMonth(),
            dayBase.getDate(),
            hour,
            min,
            0,
            0,
          ),
        });
      }
    }
    return slots;
  }, [selectedDate]);

  const getAppointmentAt = (time: Date) => {
  const key = dayjs(time).format("HH:mm");
  return events.find((appt) => dayjs(appt.appointment.schedule).format("HH:mm") === key);
};


  return (
    <div className="w-full flex flex-col gap-4">
      <ScrollArea className="h-[700px] space-y-4">
        {timeSlots.map(({ time }, i) => {
          const appt = getAppointmentAt(time);

          // ✅ hora del slot: siempre sale de timeSlots, pero igual la blindamos
          const hour = fmtHHmm(time);

          const isDisabled =
            isPastDay ||
            (appt &&
              appt.appointment.id ===
                pastAppointmentPatientData?.[0]?.pastAppointments?.id);

          // ✅ start/end seguros para render
          const start = appt ? fmtHHmm(appt.appointment.schedule) : null;
          const end = appt
            ? (() => {
                const sd = safeDate(appt.appointment.schedule);
                if (!sd) return "--:--";
                return dayjs(sd)
                  .add(DEFAULT_APPT_MINUTES, "minute")
                  .format("HH:mm");
              })()
            : null;

          return (
            <div
              key={i}
              className={[
                "w-full rounded-xl p-2 transition shadow-md border mb-1 text-sm",
                appt
                  ? "bg-emerald-100 border-emerald-300"
                  : "bg-white border-gray-200 hover:bg-gray-50",
                isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              {/* Header slot */}
              <div className="w-full flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-black">
                  <CalendarClock className="w-4 h-4" />
                  <span className="font-medium">{hour}</span>
                </div>

                {appt && (
                  <ConfigAppointmentButton
                    appointment={appt}
                    refetch={refetch}
                  />
                )}
              </div>

              {/* Content */}
              {appt ? (
                <div
                  onClick={() => {
                    if (isDisabled) return;
                    onSelectAppointment?.(appt.appointment.id);
                  }}
                  className="text-gray-800"
                >
                  <p className="font-semibold truncate">
                    {appt.appointment.reason || "Turno"}
                  </p>
                  <p className="text-gray-500 text-sm truncate">
                    {appt.appointment.notes || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {start} - {end}
                  </p>
                </div>
              ) : (
                <div
                  onClick={() => {
                    if (isDisabled) return;
                    // ✅ si por algún motivo time viniera inválido, no explota
                    const t = safeDate(time);
                    if (!t) return;
                    onAddAppointment?.(t);
                  }}
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
}
