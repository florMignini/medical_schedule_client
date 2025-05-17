"use client";
import { useState, useMemo, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import dayjs from "dayjs";
import { addMinutes, format, setHours, setMinutes } from "date-fns";
import { Appointment, AppointmentsIncluded } from "@/interfaces";
import { getTodayAppointments } from "@/utils/getTodayAppointments";
import { getAppointmentDetail } from "@/utils/getAppointmentDetail";
import { useSelectedDate } from "@/utils/useSelectedDate";
import ConfigAppointmentButton from "./ConfigAppointmentButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReminderButton from "./ReminderButton";
import NewAppointmentForm from "@/components/forms/NewAppointmentForm";
import FollowUpForm from "@/components/forms/FollowUpForm";
import { useRouter } from "next/navigation";

const AppointmentsList = ({ appointments }: any) => {
  // patient info
  const [patientId, setPatientId] = useState<any | null>(null);

  // dialog state
  const [isOpen, setIsOpen] = useState(false);

  const { selectedDate } = useSelectedDate();
  // time at specific slot
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const events = getTodayAppointments(appointments, selectedDate || new Date());

  const [turnoOcita, setTurnoOcita] = useState<string>("");
  // get time slots
  const timeSlots = useMemo(() => {
    const slots = [];
    const date = selectedDate || new Date();
    for (let hour = 8; hour <= 20; hour++) {
      slots.push({ time: setHours(setMinutes(date, 0), hour) });
      slots.push({ time: setHours(setMinutes(date, 30), hour) });
    }
    return slots;
  }, [selectedDate]);

  // get appointment at selected date
  const getAppointmentAt = (time: Date) =>
    events.find(
      (appt: AppointmentsIncluded) =>
        dayjs(appt.appointment.schedule).format("HH:mm") ===
        dayjs(time).format("HH:mm")
    );

  const getRandomHue = () => Math.floor(Math.random() * 180) + 180; // Range from 180 to 240 for muted blues/teals
  const getSlotColor = (hue: number) => `hsla(${hue}, 40%, 90%, 0.8)`; // Reduced saturation to 40%, increased lightness to 90%
  const getBorderColor = (hue: number) => `hsl(${hue}, 40%, 90%)`;

  return (
    <div className="w-full flex flex-col gap-2">
      <h1 className="w-full p-4 text-lg font-semibold text-start">{`Turnos del dia ${dayjs(
        selectedDate || new Date()
      ).format("DD/MM/YYYY")}`}</h1>
      <ScrollArea className="w-full h-[500px] flex flex-col items-center justify-center ">
        {timeSlots.map(({ time }, i) => {
          const appt: AppointmentsIncluded | undefined = getAppointmentAt(time);
          const hue = getRandomHue();
          const slotColor = getSlotColor(hue);
          const borderColor = getBorderColor(hue);

          return (
            <div
              key={i}
              className="w-full h-[80px] border-b-[1px] border-t-[1px] flex items-center text-black text-sm cursor-pointer mb-1"
              style={{
                backgroundColor: appt ? slotColor : "transparent",
                borderColor: appt ? borderColor : "inherit",
              }}
              onClick={async () => {
                if (appt) {
                  const patientIdData = await getAppointmentDetail(
                    appt?.appointment?.id
                  );
                  setPatientId(patientIdData?.patientsIncluded[0]?.id);
                } else {
                  setSelectedTime(time);
                }
              }}
            >
              {/* appointment info card */}
              <div className="flex w-full px-2 gap-2 items-center justify-center">
                <span className="text-sm ">{format(time, "HH:mm")}</span>
                <div
                  className={`h-16 border-x-[2px]`}
                  style={{ borderColor: appt ? borderColor : "inherit" }}
                />
                {appt ? (
                  <div
                    className="w-full flex-col border-none h-[80px] flex items-start justify-center"
                    style={{
                      backgroundColor: slotColor,
                      borderColor: borderColor,
                    }}
                  >
                    <div className="w-full flex flex-col items-start justify-start">
                      <div className="w-full h-3 pt-1 flex items-center justify-end">
                        <ConfigAppointmentButton appointment={appt} />
                      </div>
                      <p className="font-bold truncate">
                        {appt.appointment.notes}
                      </p>
                      <p className="text-xs min-[1024px]:text-sm text-muted-foreground truncate">
                        {appt.appointment.reason}
                      </p>
                    </div>
                    <div className="text-xs min-[1024px]:text-sm text-muted-foreground text-start">
                      {`${format(
                        new Date(appt.appointment.schedule),
                        "HH:mm"
                      )} - ${format(
                        addMinutes(new Date(appt.appointment.schedule), 30),
                        "HH:mm"
                      )}`}
                    </div>
                  </div>
                ) : (
                  // Empty time slot
                  <>
                    <div className="w-full h-full flex items-center justify-center">
                      {
                        turnoOcita === "" && (
                          <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-sm text-black border-b-[1px] border-black/20">
                            agregar evento
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="backdrop-blur-[5px] bg-black/10 text-black border-[1px] border-black/20"
                          align="center"
                        >
                          <DropdownMenuLabel>seleccione tipo</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem
                            className="font-bold text-black hover:bg-black hover:text-white rounded-md"
                            onSelect={(e) => {
                              e.preventDefault(); // evita que se cierre el dropdown automáticamente
                              setTurnoOcita("turno");
                              setSelectedTime(time);
                              setIsOpen(true);
                            }}
                          >
                            turno
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="font-bold text-black hover:bg-black hover:text-white rounded-md"
                            onSelect={(e) => {
                              e.preventDefault();
                              setTurnoOcita("seguimiento");
                              setSelectedTime(time);
                              setIsOpen(true);
                            }}
                          >
                            seguimiento
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                        )
                      }
                    </div>

                    <Dialog
                      open={isOpen}
                      onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) setTurnoOcita("");
                      }}
                    >
                      <DialogContent className="w-full sm:max-w-[600px] max-h-[90vh] p-4 overflow-y-auto rounded-2xl shadow-lg [&>button]:text-white [&>button]:hover:text-white/80">
                        <DialogHeader>
                          <DialogTitle className="w-full flex font-bold text-3xl items-center justify-between text-gray-500">
                            {turnoOcita === "turno"
                              ? "Crear Turno"
                              : "Agregar Seguimiento"}
                            <div className="pr-5">
                              {patientId && (
                                <ReminderButton appointment={patientId} />
                              )}
                            </div>
                          </DialogTitle>
                          <DialogDescription className="text-gray-500 text-start font-light text-base">
                            {turnoOcita === "turno"
                              ? "Crear un nuevo turno para el paciente"
                              : "Agregar un seguimiento para el paciente"}
                          </DialogDescription>
                        </DialogHeader>

                        {turnoOcita === "turno" ? (
                          <ScrollArea className="h-full max-h-[80vh] pr-2">
                            <NewAppointmentForm
                              component="calendar"
                              patientId={patientId}
                              type="create"
                              initialDateTime={selectedTime}
                              onSuccess={() => {
                                setIsOpen(false);
                                setTurnoOcita("");
                              }}
                            />
                          </ScrollArea>
                        ) : (
                          <FollowUpForm
                            patientId={patientId}
                            initialDateTime={selectedTime}
                            onSuccess={() => {
                              setIsOpen(false);
                              setTurnoOcita("");
                            }}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </>
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
