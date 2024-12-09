"use client";
import { useState } from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import Clock from "./icons/Clock";
import CalendarIcon from "./icons/CalendarIcon";

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
  const age = today.diff(dateOfBirth, "years");

  return (
    <div className="w-[90%] p-4 h-screen">
      {/* top section */}
      <div className="w-[100%] flex items-center justify-between text-black">
        <button
          onClick={handlePrevMonth}
          className="w-[33%] flex justify-start font-semibold   text-lg hover:text-white"
        >
          Anterior
        </button>
        <h2 className="w-[33%] flex justify-center font-semibold   text-lg">
          {dayjs(`${currentYear}-${currentMonth + 1}`).format("MMMM YYYY")}
        </h2>
        <button
          className="w-[33%] flex justify-end font-semibold   text-lg hover:text-white"
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
          console.log(dayEvents[0]);
          return (
            <Drawer key={day}>
              <div className="w-full h-20 glass-effect border rounded-md mx-auto">
                <h1 className="font-bold text-black text-end">{day}</h1>
                {dayEvents.length > 0 && (
                  <>
                    <DrawerTrigger className="w-full flex items-center justify-center ">
                      <div className="flex items-center justify-center size-7 rounded-full border-[1px] border-black p-1">
                        {dayEvents.length}
                      </div>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader className="w-[90%] flex items-center justify-center">
                        <DrawerTitle className="font-bold text-white text-4xl">
                          Eventos del dia
                        </DrawerTitle>
                      </DrawerHeader>
                      <DrawerDescription>
                        {dayEvents.map((event: any) => (
                          <Sheet key={event.appointment.id}>
                            <SheetTrigger asChild>
                              <button
                                className="flex flex-col w-[90%] h-auto truncate glass-effect text-white mx-auto mt-1"
                                onClick={() =>
                                  getAppointmentDetail(event.appointment.id)
                                }
                              >
                                <div className="flex w-[100%] items-center justify-center flex-wrap">
                                  {/* date & hour */}
                                  <div className="w-[50%] flex flex-col items-center justify-start">
                                    <p className="font-semibold text-lg">
                                      Fecha y Hora
                                    </p>
                                    <div className="flex items-center justify-center gap-8">
                                      <div className="flex items-center justify-center text-white gap-1">
                                        <CalendarIcon
                                        width={20}
                                        height={20}
                                        />
                                        <p>
                                          {dayjs(
                                            event.appointment.schedule
                                          ).format("DD/MM/YYYY")}
                                        </p>
                                      </div>
                                      <div className="flex items-center justify-center text-white gap-1">
                                        <Clock 
                                        width={20}
                                        height={20}
                                        />
                                        <p>
                                          {dayjs(
                                            event.appointment.schedule
                                          ).format("HH:mm A")}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="w-[50%] flex flex-col items-center justify-start">
                                    <div>
                                      <p className="font-semibold text-lg">
                                        Paciente
                                      </p>
                                      {/* <p>{event.appointment.}</p> */}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-lg">
                                        Motivo de la consulta
                                      </p>
                                      <p>{event.appointment.reason}</p>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            </SheetTrigger>
                            <SheetContent className="w-full h-auto text-dark-700 backdrop backdrop-blur-sm pt-10">
                              <ScrollArea className="h-full w-full p-1">
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

                                    <div className="h-auto w-[100%]">
                                      <PastAppointmentForm
                                        patient={patient}
                                        appointment={appointment}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </ScrollArea>

                              <SheetFooter>
                                <SheetClose asChild>
                                  {/* <Button type="submit">Finalizar Consulta</Button> */}
                                </SheetClose>
                              </SheetFooter>
                            </SheetContent>
                          </Sheet>
                        ))}
                      </DrawerDescription>
                    </DrawerContent>
                  </>
                )}
              </div>
            </Drawer>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
