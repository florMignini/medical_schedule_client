"use client";

import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppointmentsIncluded, PatientsIncluded } from "@/interfaces";
import { getTodayAppointments } from "@/utils/getTodayAppointments";
import { getAppointmentDetail } from "@/utils/getAppointmentDetail";
import { useSelectedDate } from "@/utils/useSelectedDate";
import { addMinutes, format, setHours, setMinutes } from "date-fns";
import dayjs from "dayjs";
import ConfigAppointmentButton from "./ConfigAppointmentButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewAppointmentForm from "../../../../components/forms/NewAppointmentForm";
import AppointmentDialogDetail from "./AppointmentDialogDetail";

import { CalendarClock, Plus } from "lucide-react";

type appointmentListProps = {
  appointments: Array<AppointmentsIncluded>;
  patients: Array<PatientsIncluded>;
  pastAppointmentPatientData: any;
};

const AppointmentsList = ({
  appointments,
  patients,
  pastAppointmentPatientData,
}: appointmentListProps) => {
  const [patientId, setPatientId] = useState<any | null>(null);
  const [patientData, setPatientData] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [currentAppointment, setCurrentAppointment] = useState<any | null>(null);
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
        dayjs(appt.appointment.schedule).format("HH:mm") === dayjs(time).format("HH:mm")
    );

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="px-auto text-xl font-semibold text-gray-800">
        Turnos del día {dayjs(selectedDate || new Date()).format("DD/MM/YYYY")}
      </h1>

      <ScrollArea className="h-[500px] space-y-4">
        {timeSlots.map(({ time }, i) => {
          const appt = getAppointmentAt(time);
          const hour = format(time, "HH:mm");
          const isDisabled = isPast ||
            (appt && appt.appointment.id === pastAppointmentPatientData[0]?.pastAppointments?.id);

          return (
            <div
              key={i}
              className={`w-full rounded-xl p-4 transition border text-sm
                ${appt ? "bg-emerald-100 border-emerald-300" : "bg-white border-gray-200 hover:bg-gray-50"}
                ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <CalendarClock className="w-4 h-4" />
                  <span className="font-medium">{hour}</span>
                </div>
                {appt && <ConfigAppointmentButton appointment={appt} />}
              </div>
              {appt ? (
                <>
                  <p className="font-semibold text-gray-800 truncate">
                    {appt.appointment.notes}
                  </p>
                  <p className="text-gray-500 text-sm truncate">
                    {appt.appointment.reason}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {`${format(new Date(appt.appointment.schedule), "HH:mm")} - ${format(addMinutes(new Date(appt.appointment.schedule), 30), "HH:mm")}`}
                  </p>
                </>
              ) : (
                <div className="text-gray-500 text-sm italic flex items-center gap-2">
                  <Plus className="w-4 h-4" /> agregar evento
                </div>
              )}
            </div>
          );
        })}
      </ScrollArea>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setTurnoOcita("");
        }}
      >
        <DialogContent className="w-[80vw] bg-white/70 backdrop-blur-lg sm:max-w-[600px] max-h-[100vh] p-4 overflow-y-auto rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-700">
              {turnoOcita === "turno" ? "Crear Turno" : "Detalles del turno"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {turnoOcita === "turno"
                ? "Crear un nuevo turno para el paciente"
                : "Detalles del turno"}
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            {turnoOcita === "turno" && selectedTime && (
              <NewAppointmentForm
                key="create"
                type="create"
                patientId={patientId}
                initialDateTime={selectedTime}
                component="calendar"
                patientsList={patients}
                onSuccess={() => {
                  setIsOpen(false);
                  setTurnoOcita("");
                }}
              />
            )}

            {turnoOcita !== "turno" && currentAppointment && (
              <AppointmentDialogDetail
                key="update"
                patientData={patientData}
                patientId={patientId}
                initialDateTime={selectedTime}
                type="update"
                appt={currentAppointment}
                onSuccess={() => {
                  setIsOpen(false);
                  setTurnoOcita("");
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsList;
