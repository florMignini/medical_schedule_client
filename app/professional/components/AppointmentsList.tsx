"use client";
import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import dayjs from "dayjs";
import { addMinutes, format, setHours, setMinutes } from "date-fns";
import { Appointment, AppointmentsIncluded } from "@/interfaces";
import { getTodayAppointments } from "@/utils/getTodayAppointments";
import { getAppointmentDetail } from "@/utils/getAppointmentDetail";
import { useSelectedDate } from "@/utils/useSelectedDate";
import ConfigAppointmentButton from "./ConfigAppointmentButton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ReminderButton from "./ReminderButton";
import NewAppointmentForm from "@/components/forms/NewAppointmentForm";
import FollowUpForm from "@/components/forms/FollowUpForm";

const AppointmentsList = ({ appointments }: any) => {
  // loading state
  const [loading, setLoading] = useState<boolean>(false);
  // appointment info
  const [appointment, setAppointment] = useState<Appointment>();
  // patient info
  const [patient, setPatient] = useState<any>();
  const [appointmentId, setAppointmentId] = useState<string>("");

  const { selectedDate } = useSelectedDate();
  const events = getTodayAppointments(appointments, selectedDate || new Date());
  const appointmentEdit = events.find(
    (event: any) => event.appointment.id === appointmentId
  );
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

  const handleAppintmentDetail = async (appointmentId: string) => {
    setLoading(true);
    try {
      const data = await getAppointmentDetail(appointmentId);
      if (data) {
        setAppointment(data);
        setPatient(data.patientsIncluded[0]);
      }
    } catch (error) {
      console.error("Failed to fetch appointment details", error);
    } finally {
      setLoading(false);
    }
  };

  const getRandomHue = () => Math.floor(Math.random() * 180) + 180; // Range from 180 to 240 for muted blues/teals
  const getSlotColor = (hue: number) => `hsla(${hue}, 40%, 90%, 0.8)`; // Reduced saturation to 40%, increased lightness to 90%
  const getBorderColor = (hue: number) => `hsl(${hue}, 40%, 90%)`; // Matching border color with reduced saturation

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2">
      <h1 className="text-lg font-bold">{`Turnos del dia ${dayjs(
        selectedDate || new Date()
      ).format("DD/MM/YYYY")}`}</h1>
      <ScrollArea className="w-full h-[500px] flex flex-col items-center justify-center ">
        {timeSlots.map(({ time }, i) => {
          const appt = getAppointmentAt(time);
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
                  <div className="w-full h-full flex items-center justify-center">
                    <Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                      <button className="text-sm text-black border-b-[1px] border-black/20">agregar evento</button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="backdrop-blur-[5px] bg-black/10 text-black border-[1px] border-black/20">
                        <DropdownMenuLabel>seleccione tipo</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-100"/>
                        <DropdownMenuItem 
                        className="font-bold text-black hover:bg-black hover:text-white rounded-md"
                        onClick={() => setTurnoOcita("turno")}>
                          <DialogTrigger
                          >
                          turno
                          </DialogTrigger>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        className="font-bold text-black hover:bg-black hover:text-white rounded-md"
                        onClick={() => setTurnoOcita("seguimiento")}>
                          <DialogTrigger
                          >
                          seguimiento
                          </DialogTrigger>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="w-[90%] bg-dark-200 [&>button]:text-white [&>button]:hover:text-white/80">
                  <DialogHeader>
                    <DialogTitle className="w-full flex font-bold text-3xl items-center justify-between text-gray-500">
                      {turnoOcita === "turno"
                        ? "Crear Turno"
                        : "Agregar Seguimiento"}
                     <div className="pr-5">
                     {patient && (
                        <ReminderButton appointment={patient?.appointmentsIncluded} />
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
                    <NewAppointmentForm patientId={patient?.id}
                    type="create" />
                  ) : (
                    <FollowUpForm patientId={patient?.id} />
                  )}
                </DialogContent>
                  </Dialog>
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
