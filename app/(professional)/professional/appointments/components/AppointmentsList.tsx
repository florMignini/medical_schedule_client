"use client";

import React, { useMemo } from "react";
import dayjs from "dayjs";
import { Plus, ChevronRight, Stethoscope, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppointmentsIncluded } from "@/interfaces";

type Props = {
  appointments: AppointmentsIncluded[];
  selectedDate: Date;
  onAddAppointment: (datetime: Date) => void;
  onSelectAppointment?: (appointmentId: string) => void;
};

function timeLabel(iso: string) {
  return dayjs(iso).format("HH:mm");
}

export default function AppointmentsList({
  appointments,
  selectedDate,
  onAddAppointment,
  onSelectAppointment,
}: Props) {
  const sorted = useMemo(() => {
    return [...appointments].sort(
      (a, b) =>
        dayjs(a.appointment.schedule).valueOf() -
        dayjs(b.appointment.schedule).valueOf(),
    );
  }, [appointments]);

  const dateLabel = useMemo(() => {
    return dayjs(selectedDate).format("DD/MM/YYYY");
  }, [selectedDate]);

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="text-sm font-semibold text-gray-900">
          No hay turnos para el {dateLabel}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Podés crear uno nuevo en el horario que quieras.
        </div>
        <Button
          onClick={() => {
            const base = dayjs(selectedDate).hour(8).minute(0).second(0).millisecond(0);
            onAddAppointment(base.toDate());
          }}
          className="mt-4 rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear turno
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((a) => {
        const p = a.patient;
        const patientName = p
          ? `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim()
          : "Paciente";

        const hasPast = !!a.appointment.pastAppointment?.id;

        return (
          <button
            key={a.appointment.id}
            onClick={() => onSelectAppointment?.(a.appointment.id)}
            className={[
              "w-full text-left rounded-2xl border p-4 transition",
              "border-gray-200 bg-white hover:bg-gray-50",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-gray-500">{timeLabel(a.appointment.schedule)}</div>

                <div className="mt-1 flex items-center gap-2">
                  <UserRound className="w-4 h-4 text-gray-600" />
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {patientName}
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-gray-600" />
                  <div className="text-sm text-gray-800 truncate">
                    {a.appointment.reason?.trim() || "Sin motivo"}
                  </div>
                </div>

                {a.appointment.notes ? (
                  <div className="mt-2 text-xs text-gray-600 line-clamp-2">
                    {a.appointment.notes}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={[
                    "text-[11px] px-2 py-1 rounded-full border",
                    hasPast
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200",
                  ].join(" ")}
                >
                  {hasPast ? "Finalizada" : "Pendiente"}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
