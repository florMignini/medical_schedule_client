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
import Link from "next/link";
import DinamicForm from "@/components/DinamicForm";
import { NewPastAppointmentSchema } from "@/lib";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldType } from "@/components/forms/ProfessionalLoginForm";
import PastAppointmentForm from "@/components/forms/PastAppointmentForm";

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

  const today = dayjs(new Date());
  const dateOfBirth = dayjs(patient?.birthDate);
  const age = today.diff(dateOfBirth, "month");

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
                      <SheetContent className="h-screen text-dark-700 backdrop backdrop-blur-sm pt-10">
                        {/* Header Section */}
                        <Link
                          href={`/professional/patients/${patient?.id}/info`}
                          className="w-[100%] h-auto flex items-center justify-center border-[1px] border-dark-600 p-1 rounded-lg text-dark-600"
                        >
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
                        </Link>
                        {/* General Information Section */}
                        <div className="flex flex-wrap gap-4 py-2">
                          {/* title */}
                          <div className="w-[90%] flex items-center gap-2 justify-start">
                            <div className="h-3 border-x-[2px] text-dark-600" />
                            <p className="font-medium text-sm">
                              Información General
                            </p>
                          </div>
                          {/* Info */}
                          {/* age & insuranceProvider&Number */}
                          <div className="w-[100%] h-auto flex items-center justify-start">
                            <div>
                              <Label
                                htmlFor="patient-age"
                                className="p-0 font-light text-[13px] text-gray-500"
                              >
                                Edad
                              </Label>
                              <Input
                                id="patient-age"
                                type="text"
                                disabled
                                value={`${age}`}
                                className="p-0 border-none bg-transparent text-white font-semibold"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="patient-insuranceProvider&Number"
                                className="p-0 font-light text-[13px] text-gray-500"
                              >
                                Proveedor de Salud - Número de Seguro
                              </Label>
                              <Input
                                id="patient-insuranceProvider&Number"
                                type="text"
                                disabled
                                value={`${patient?.insuranceProvider} ${patient?.insurancePolicyNumber}`}
                                className="p-0 border-none bg-transparent text-white font-semibold"
                              />
                            </div>
                          </div>
                          {/* Phone y Email */}
                          <div className="w-[100%] h-auto flex items-center justify-start">
                            <div>
                              <Label
                                htmlFor="patient-phone"
                                className="font-light p-0 text-[13px] text-gray-500"
                              >
                                Teléfono
                              </Label>
                              <Input
                                id="patient-phone"
                                type="text"
                                disabled
                                value={`${patient?.phone}`}
                                className="p-0 border-none bg-transparent text-white font-semibold"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="patient-gender"
                                className="p-0 font-light text-[13px] text-gray-500"
                              >
                                Email
                              </Label>
                              <Input
                                id="patient-gender"
                                type="text"
                                disabled
                                value={`${patient?.email}`}
                                className="p-0 border-none bg-transparent text-white font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                        <div className=" border-b-[1px] w-full border-x-[2px] text-dark-600" />
                        {/* Patient Medical History */}
                        <div className="w-[100%] flex items-center justify-start py-3">
                          {/* title */}
                          <div className="w-[90%] flex items-center gap-2 justify-start ">
                            <div className="h-3 border-x-[2px] text-dark-600" />
                            <p className="font-medium text-sm">
                              Consultas Previas
                            </p>
                          </div>
                          {/* past appointments */}
                          <div></div>
                        </div>
                        <div className=" border-b-[1px] w-full border-x-[2px] text-dark-600" />
                        {/* actual appointment data */}
                        <div className="w-[100%] flex flex-col items-center justify-start py-3">
                          {/* title */}
                          <div className="w-full flex items-center gap-2 justify-start pt-2">
                            <div className="h-3 border-x-[2px] text-dark-600" />
                            <p className="font-medium text-sm">
                              Consulta Actual
                            </p>
                          </div>
                          {/* appointment reason & details */}
                          <div className="w-[100%] flex flex-col">
                            <div className="px-1 py-2">
                              <Label
                                htmlFor="appointment-reason"
                                className="p-0 font-light text-[13px] text-gray-500"
                              >
                                Motivo de la consulta
                              </Label>
                              <Input
                                id="appointment-reason"
                                type="text"
                                disabled
                                value={`${appointment?.reason}`}
                                className="p-0 border-none bg-transparent text-white font-semibold"
                              />
                            </div>

                            <PastAppointmentForm 
                            patient={patient}
                            appointment={appointment}
                            />
                          </div>
                        </div>

                        <SheetFooter>
                          <SheetClose asChild>
                            {/* <Button type="submit">Finalizar Consulta</Button> */}
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
