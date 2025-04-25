"use client";
import { useState } from "react";
import dayjs from "dayjs";
import { Appointment, Patient } from "@/interfaces";
import { getTodayAppointments } from "@/utils/getTodayAppointments";
import { getAppointmentDetail } from "@/utils/getAppointmentDetail";
import { useSelectedDate } from "@/utils/useSelectedDate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ConfigAppointmentButton from "./ConfigAppointmentButton";
import Image from "next/image";
import PastAppointmentForm from "@/components/forms/PastAppointmentForm";
import { ScrollArea } from "@/components/ui/scroll-area";

const AppointmentsList = ({ appointments }: any) => {
  // loading state
  const [loading, setLoading] = useState<boolean>(false);
  // appointment info
  const [appointment, setAppointment] = useState<Appointment>();
  // patient info
  const [patient, setPatient] = useState<any>();
  const [appointmentId, setAppointmentId] = useState<string>("");
  const { selectedDate } = useSelectedDate();
  const events = getTodayAppointments(appointments, selectedDate);
const appointmentEdit = events.find(
    (event: any) => event.appointment.id === appointmentId
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

  return (
    <Dialog>
      <div className="h-screen flex-1 justify-start items-start p-1">
        {events.length > 0 ? (
          <div className="w-full flex flex-col gap-4">
            <h2 className="text-xl font-bold">
              Eventos del {dayjs(selectedDate).format("DD/MM/YYYY")}
            </h2>
            <div className="w-[100%] flex flex-col gap-4">
              {events.map((event: any, index: number) => (
                <DialogTrigger asChild key={index}>
                  <button
                    className="w-full md:w-[98%] mx-auto p-1 gap-2 flex items-center justify-between hover:transition-shadow rounded-md mb-1 shadow-md hover:shadow-inner hover:shadow-[#cccccc] text-gray-700"
                    onClick={() => {
                      setAppointmentId(event.appointment.id);
                      handleAppintmentDetail(event.appointment.id)
                    }}
                  >
                    {/* TIME */}
                    <div className="w-[30%] flex items-center justify-center font-semibold">
                      {dayjs(event.appointment.schedule).format("HH:mm")} {"-"}
                    </div>
                    {/* DETAILS */}
                    <div className="w-[70%] flex items-center justify-around">
                      <div className="flex flex-col items-start justify-start">
                        <p>Motivo de la consulta:</p>
                        <h3 className="text-sm font-semibold truncate">
                          {event.appointment.reason}
                        </h3>
                      </div>
                    </div>
                  </button>
                </DialogTrigger>
              ))}

              <DialogContent className="sm:max-w-[500px] h-[70%] bg-black/50 flex flex-col items-start justify-start text-white bg-opacity-50 p-4 rounded-lg shadow-md gap-5">
                <DialogHeader className="w-[100%] flex items-center justify-center text-white">
                  <div className="flex items-center justify-between w-full">
                    <DialogTitle className="w-[70%] font-light text-xl text-white text-start">
                      Detalles del Turno
                    </DialogTitle>
                    <div className="w-[30%] flex items-center justify-center">
                      <ConfigAppointmentButton
                      id={appointmentId}
                      appointment={appointmentEdit}
                      />
                    </div>
                  </div>
                  <DialogDescription className="w-[100%] h-20 flex items-center justify-around gap-2 rounded-lg shadow-md bg-black/70">
                    {/* foto */}
                    <Image
                      src={patient?.patient?.patientPhotoUrl}
                      width={60}
                      height={60}
                      className="flex rounded-full"
                      alt="Foto del paciente"
                    />
                    <div className="w-[80%] flex flex-col items-start justify-start ">
                      <p className="w-[100%] flex items-start justify-start text-xs font-light text-gray-400">
                        Nombre del paciente
                      </p>
                      <h3 className="text-2xl text-white">{`${patient?.patient?.firstName} ${patient?.patient?.lastName}`}</h3>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="w-full h-[80%]">
                  <div className="border-t-[1px] border-[#cccccc] w-[100%] p-2">
                    <div className="flex px-2 items-start justify-around">
                      <div className="flex-col">
                        <p className="text-[12px] font-light text-gray-400">
                          DETALLES:
                        </p>
                        <h3 className="truncate text-sm">
                          {appointment?.notes}
                        </h3>
                      </div>
                      <div className="flex-col">
                        <p className="text-[12px] font-light text-gray-400">
                          FECHA Y HORA:
                        </p>
                        <h3 className="truncate text-sm text-white">
                          {dayjs(appointment?.schedule).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="border-t-[1px] border-[#cccccc] w-[100%] p-2 z-40">
                    <h3 className="text-white font-semibold text-lg mb-2">
                      Información general
                    </h3>
                    {/* fullname - phone */}
                    <div className="w-[95%] flex items-start justify-center flex-wrap mb-2">
                      <div className="w-[50%] flex flex-col items-start justify-center">
                        <label className="text-gray-300 text-xs font-thin">
                          Nombre Completo:
                        </label>
                        <span className="text-sm text-white font-light">{`${patient?.patient?.firstName} ${patient?.patient?.lastName}`}</span>
                      </div>
                      <div className="w-[50%] flex flex-col items-start justify-center">
                        <label className="text-gray-300 text-xs font-thin">
                          Numero de Teléfono:
                        </label>
                        <span className="text-sm text-white font-light">
                          {patient?.patient.phone}
                        </span>
                      </div>
                    </div>
                    {/* age - mail */}
                    <div className="w-[95%] flex items-start justify-center flex-wrap mb-2">
                      <div className="w-[50%] flex flex-col items-start justify-center">
                        <label className="text-gray-300 text-xs font-thin">
                          Edad:
                        </label>
                        <span className="text-sm text-white font-light">{`${patientAge} años`}</span>
                      </div>
                      <div className="w-[50%] flex flex-col items-start justify-center">
                        <label className="text-gray-300 text-xs font-thin">
                          Email:
                        </label>
                        <span className="text-sm text-white font-light">
                          {patient?.patient.email}
                        </span>
                      </div>
                    </div>
                    {/* gender - address */}
                    <div className="w-[95%] flex items-start justify-center flex-wrap mb-2">
                      <div className="w-[50%] flex flex-col items-start justify-center">
                        <label className="text-gray-300 text-xs font-thin">
                          Genero:
                        </label>
                        <span className="text-sm text-white font-light">
                          {patient?.patient?.gender === "M"
                            ? "Masculino"
                            : "Femenino"}
                        </span>
                      </div>
                      <div className="w-[50%] flex flex-col items-start justify-center">
                        <label className="text-gray-300 text-xs font-thin">
                          Dirección:
                        </label>
                        <span className="text-sm font-light">
                          {patient?.patient.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <PastAppointmentForm
                    patient={patient?.patient}
                    appointment={appointment}
                  />
                </ScrollArea>
              </DialogContent>
            </div>
          </div>
        ) : (
          <h2 className="text-xl font-bold">No hay eventos para hoy</h2>
        )}
      </div>
    </Dialog>
  );
};

export default AppointmentsList;
