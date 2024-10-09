"use client";
import { useState } from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Appointment, Patient, PatientsIncluded } from "@/interfaces";
import { apiServer } from "@/api/api-server";
import Image from "next/image";

const Calendar = ({ appointments }: any) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  // loading state
  const [loading, setLoading] = useState<boolean>(false);
  // appointment info
  const [appointment, setAppointment] = useState<Appointment>();
  // patient info
  const [patient, setPatient] = useState<Patient>();

  //  calendar data & methods ----------------
  const daysInMonth = dayjs(`${currentYear}-${currentMonth + 1}`).daysInMonth();
  const startDay = dayjs(`${currentYear}-${currentMonth + 1}-01`).day();

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  };

  //-----------------------------------------
  // get appointment detail action
  const getAppointmentDetail = async (appointmentId: string): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await apiServer(
        `/appointment/get-appointment/${appointmentId}`
      );
      setAppointment(data);
      setPatient(data.patientsIncluded[0].patient);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  // console.log(appointment)
  // console.log(patient)
  return (
    <div className="w-[90%] p-4 h-screen">
      {/* top section */}
      <div className="w-[100%] flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="w-[33%] flex justify-start font-semibold  text-dark-600 text-lg hover:text-white"
        >
          Anterior
        </button>
        <h2 className="w-[33%] flex justify-center font-semibold  text-dark-600 text-lg">
          {dayjs(`${currentYear}-${currentMonth + 1}`).format("MMMM YYYY")}
        </h2>
        <button
          className="w-[33%] flex justify-end font-semibold  text-dark-600 text-lg hover:text-white"
          onClick={handleNextMonth}
        >
          Siguiente
        </button>
      </div>
      {/* Calendar section */}
      <div className="grid grid-cols-7 gap-1 mt-4">
        {/* Days of the week */}
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {/* Empty spaces before first day */}
        {Array.from({ length: startDay }).map((_, idx) => (
          <div key={idx}></div>
        ))}
        {/* Days of the week */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const date = dayjs(
            `${currentYear}-${currentMonth + 1}-${day}`
          ).format("DD-MM-YYYY");
          const dayEvents = appointments.filter(
            (appointment: any) =>
              dayjs(appointment.appointment.schedule).format("DD-MM-YYYY") ===
              date
          );

          return (
            <div key={day} className="h-32 p-1 border rounded-md text-center">
              <h1 className="font-bold text-dark-700">{day}</h1>
              {dayEvents.length > 0 && (
                <div className="mt-2">
                  {dayEvents.map((event: any) => (
                    <Sheet>
                      <SheetTrigger asChild>
                        <button
                          key={event.appointment.id}
                          className="flex flex-col w-[99%] h-auto truncate bg-dark-600/30 text-dark-700 p-1 rounded-md text-sm font-semibold hover:scale-105"
                          onClick={() =>
                            getAppointmentDetail(event.appointment.id)
                          }
                        >
                          <p className="flex flex-col">
                            {event.appointment.reason}
                          </p>
                          <p>
                            {dayjs(event.appointment.schedule).format(
                              "HH:mm A"
                            )}
                          </p>
                        </button>
                      </SheetTrigger>
                      <SheetContent className="text-dark-700 backdrop backdrop-blur-sm pt-16">
                        {/* Header Section */}
                        <div className="w-[100%] h-auto flex items-center justify-center border-[1px] border-dark-600 p-2 rounded-lg text-dark-600">
                          <div className="w-[30%]">
                            <Image
                              src={patient?.patientPhotoUrl ?? ""}
                              width={70}
                              height={70}
                              alt="patient-profile-picture"
                              className="rounded-full "
                            />
                          </div>
                          <div className="w-[70%]">
                            <SheetTitle className="font-light text-sm">
                              Nombre del Paciente
                            </SheetTitle>
                            <SheetDescription>
                              <h1 className="text-3xl font-bold">{`${patient?.firstName} ${patient?.lastName}`}</h1>
                            </SheetDescription>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 py-4">
                          {/* here goes the form */}
                          <div className="w-[90%] flex items-center gap-2 justify-start">
                            <div className="h-5 border-x-[2px] text-dark-600" />
                            <p className="font-medium text-sm">
                              Información General
                            </p>
                          </div>
                          {/* Info */}
                          <div className="w-[100%] h-auto flex items-center justify-start">
                            <div>
                              <Label
                                htmlFor="patient-name"
                                className="font-light text-[13px] text-gray-500"
                              >
                                Teléfono
                              </Label>
                              <Input
                                id="patient-name"
                                type="text"
                                disabled
                                value={`${patient?.phone}`}
                                className="border-none bg-transparent text-white font-semibold"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="patient-name"
                                className="font-light text-[13px] text-gray-500"
                              >
                                Género
                              </Label>
                              <Input
                                id="patient-name"
                                type="text"
                                disabled
                                value={`${
                                  patient?.gender === "M"
                                    ? "Masculino"
                                    : "Femenino"
                                }`}
                                className="border-none bg-transparent text-white font-semibold"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="patient-name"
                                className="font-light text-[13px] text-gray-500"
                              >
                                Email
                              </Label>
                              <Input
                                id="patient-name"
                                type="text"
                                disabled
                                value={`${patient?.email}`}
                                className="border-none bg-transparent text-white font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                        <SheetFooter>
                          <SheetClose asChild>
                            <Button type="submit">Save changes</Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
