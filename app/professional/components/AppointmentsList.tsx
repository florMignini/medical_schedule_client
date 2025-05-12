"use client";
import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import dayjs from "dayjs";
import { addMinutes, format, setHours, setMinutes } from "date-fns";
import { Appointment, AppointmentsIncluded } from "@/interfaces";
import { getTodayAppointments } from "@/utils/getTodayAppointments";
import { getAppointmentDetail } from "@/utils/getAppointmentDetail";
import { useSelectedDate } from "@/utils/useSelectedDate";


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
  const today = new Date();
  const patientAge = dayjs(today).diff(
    dayjs(patient?.patient.birthDate),
    "year"
  );

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
              className="w-full h-[80px] border-[1px] flex items-center text-black text-sm cursor-pointer rounded-md mb-1"
              style={{ backgroundColor: slotColor, borderColor }}
            >
              {/* appointment info card */}
              <div className="flex w-full px-2 gap-2 items-center justify-center">
                <span className="text-sm ">{format(time, "HH:mm")}</span>
                <div className={`h-16 border-x-[2px]`} style={{ borderColor }} />
                {appt ? (
                  <div className="w-full flex-col border-none h-[80px] flex items-start justify-center">
                    <div className="w-full flex flex-col items-start justify-start">
                      <p className="font-bold">{appt.appointment.notes}</p>
                      <p className="text-sm text-muted-foreground">
                        {appt.appointment.reason}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground text-start">
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
                  // Espacio libre
                  <button
                    // onClick={() => handleScheduleClick(time)}
                    className="w-full p-2 bg-muted text-sm rounded-md hover:bg-primary/10 transition"
                  >
                    + Agendar
                  </button>
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
