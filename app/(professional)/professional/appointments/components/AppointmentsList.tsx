"use client";

import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppointmentsIncluded, PatientsIncluded } from "@/interfaces";
import { getTodayAppointments } from "@/utils/getTodayAppointments";
import { getAppointmentDetail } from "@/utils/getAppointmentDetail";
import { useSelectedDate } from "@/utils/useSelectedDate";
import { addMinutes, format, setHours, setMinutes } from "date-fns";
import dayjs from "dayjs";
import ConfigAppointmentButton from "../../components/ConfigAppointmentButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewAppointmentForm from "../../../../../components/forms/NewAppointmentForm";
import AppointmentDialogDetail from "./AppointmentDialogDetail";

import { CalendarClock, Plus } from "lucide-react";

type appointmentListProps = {
  appointments: Array<AppointmentsIncluded>;
  patients: Array<PatientsIncluded>;
  pastAppointmentPatientData?: any;
  isDemo?: boolean;
  refetch?: () => void;
  onAddAppointment?: () => void;
};

const AppointmentsList = ({
  appointments,
  patients,
  pastAppointmentPatientData,
  isDemo=false,
  refetch,
  onAddAppointment
}: appointmentListProps) => {
  const [patientId, setPatientId] = useState<any | null>(null);
  const [patientData, setPatientData] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [currentAppointment, setCurrentAppointment] = useState<any | null>(
    null
  );
  const [turnoOcita, setTurnoOcita] = useState<string>("");

  const { selectedDate } = useSelectedDate();

  const events = getTodayAppointments(appointments, selectedDate || new Date());
  const isPast = dayjs(selectedDate || new Date()).isBefore(dayjs(), "day");

  const timeSlots = useMemo(() => {
    const slots = [];
    const date = selectedDate || new Date();
    for (let hour = 8; hour <= 20; hour++) {
      slots.push({ time: setHours(setMinutes(date, 0), hour) });
      slots.push({ time: setHours(setMinutes(date, 30), hour) });
    }
    return slots;
  }, [selectedDate]);

  const getAppointmentAt = (time: Date) =>
    events.find(
      (appt: AppointmentsIncluded) =>
        dayjs(appt.appointment.schedule).format("HH:mm") ===
        dayjs(time).format("HH:mm")
    );

  return (
    <div className="w-full flex flex-col gap-4">
     
      <ScrollArea className="h-[700px] space-y-4">
        {timeSlots.map(({ time }, i) => {
          const appt = getAppointmentAt(time);
          const hour = format(time, "HH:mm");
          const isDisabled =
            isPast ||
            (appt &&
              appt.appointment.id ===
                pastAppointmentPatientData[0]?.pastAppointments?.id);

          return (
            <div
              key={i}
              className={`w-full rounded-xl p-2 transition shadow-md border-[1px] border-gray-100 mb-1 text-sm
                ${
                  appt
                    ? "bg-emerald-100 border-emerald-300"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }
                ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
            >
              <button className="w-full flex justify-between items-center mb-2">
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
              </button>
             <div
             onClick={async () => {
              if (isDisabled) return;
              if (appt) {
                setCurrentAppointment(appt);
                const data = await getAppointmentDetail(appt?.appointment?.id);
                setPatientId(data?.patientsIncluded[0]?.id);
                setPatientData(data?.patientsIncluded[0]);
                setTurnoOcita("seguimiento");
              } else {
                setTurnoOcita("turno");
              }
              setSelectedTime(time);
              setIsOpen(true);
            }}
             >
             {appt ? (
                <>
                  <p className="font-semibold text-gray-800 truncate">
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
                </>
              ) : (
                <div
                onClick={onAddAppointment}
                className="text-gray-500 text-sm italic flex items-center gap-2">
                  <Plus className="w-4 h-4" /> agregar evento
                </div>
              )}
             </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default AppointmentsList;
