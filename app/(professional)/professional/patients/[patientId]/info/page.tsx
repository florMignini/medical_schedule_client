"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DinamicPage } from "@/app/(professional)/professional/data";
import ReminderButton from "@/app/(professional)/professional/components/ReminderButton";
import FollowUpForm from "@/components/forms/FollowUpForm";
import NewAppointmentForm from "@/components/forms/NewAppointmentForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Patient } from "@/interfaces";

import { PatientInfoSection } from "@/app/(professional)/professional/components";
import PastAppointments from "@/app/(professional)/professional/components/PastAppointments";
import FollowUp from "@/app/(professional)/professional/components/FollowUp";

interface Props {
  patient: Patient;
  isDemo: boolean;
}

const PatientInfo = ({ patient, isDemo }: Props) => {
  const [dinamicPage, setDinamicPage] = useState<string>("Informacion del Paciente");
  const [turnoOcita, setTurnoOcita] = useState<string | null>(null);

  if (!patient) {
    return (
      <div className="flex items-start justify-center h-screen flex-col space-y-3 mx-auto">
        <Skeleton className="h-[250px] w-[90%] rounded-xl" />
        <div className="space-y-2 opacity-30">
          <Skeleton className="h-[125px] w-[90%]" />
          <Skeleton className="h-[125px] w-[90%]" />
        </div>
      </div>
    );
  }
console.log("Patient Info:", patient);
  return (
    <section className="w-full h-auto bg-white min-[700px]:h-screen py-5 flex flex-col items-center justify-start gap-2">
      <Dialog>
        <div className="flex flex-col w-[100%] h-14 items-start justify-center px-2 border-b-[1px] border-b-gray-500">
          <h1 className="text-2xl text-black font-semibold text-start">Pacientes</h1>
          <p className="hidden md:flex text-xs font-light text-gray-600">
            Aquí encontrara el detalle del paciente seleccionado
          </p>
        </div>

        <div className="w-[95%] h-auto flex flex-col pt-5 bg-[#262626] gap-5 shadow-[inset_0px_-2px_3px_rgba(73,73,73,0.2)] rounded-xl">
          <div className="w-[100%] h-auto px-2 pt-3 flex flex-col min-[768px]:grid min-[768px]:grid-cols-[40%,60%] mx-auto">
            <Image
              src={patient.patientPhotoUrl}
              alt="patient-photo"
              width={80}
              height={80}
              className="mx-auto rounded-full flex items-center justify-end mb-3"
            />
            <div className="w-full h-auto text-white flex items-center justify-around flex-col min-[768px]:flex-row my-auto">
              <div className="w-[95%] text-[14px] md:text-18-bold flex flex-col items-center justify-center mb-2 min-[768px]:mb-0">
                <h1>{`${patient.firstName} ${patient.lastName}`}</h1>
                <p>
                  <strong>{patient.identificationType}: </strong>
                  {patient.identityNumber}
                </p>
              </div>
              <div className="w-[95%] h-auto flex min-[768px]:flex-col justify-center gap-2">
                <DialogTrigger className="w-[60%] md:w-[50%] bg-emerald-600 p-1 rounded-lg text-white hover:scale-105">
                  <button onClick={() => setTurnoOcita("Turno")}>Crear turno</button>
                </DialogTrigger>
                <DialogTrigger className="w-[60%] md:w-[50%] bg-emerald-600 px-5 py-1 rounded-lg text-white hover:scale-105">
                  <button onClick={() => setTurnoOcita("Seguimiento")}>
                    Agregar seguimiento
                  </button>
                </DialogTrigger>
                <DialogContent className="w-[90%] bg-dark-200">
                  <DialogHeader>
                    <DialogTitle className="w-full flex font-bold text-3xl items-center justify-between text-gray-500">
                      {turnoOcita === "Turno" ? "Crear Turno" : "Agregar Seguimiento"}
                      <div className="pr-5">
                        {patient.appointmentsIncluded && (
                          <ReminderButton appointment={patient.appointmentsIncluded} />
                        )}
                      </div>
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 text-start font-light text-base">
                      {turnoOcita === "Turno"
                        ? "Crear un nuevo turno para el paciente"
                        : "Agregar un seguimiento para el paciente"}
                    </DialogDescription>
                  </DialogHeader>
                  {turnoOcita === "Turno" ? (
                    <NewAppointmentForm patientId={patient.id} type="create" />
                  ) : (
                    <FollowUpForm
                      patientId={patient.id}
                      onSuccess={() => setTurnoOcita(null)}
                      initialDateTime={null}
                    />
                  )}
                </DialogContent>
              </div>
            </div>
          </div>

          {/* Navegación de sección */}
          <div className="w-[100%] flex items-center justify-start gap-5 pb-2 px-3">
            {DinamicPage.map((data, index) => (
              <button
                key={index}
                onClick={() => setDinamicPage(data.name)}
                className={clsx(
                  "font-light text-xs md:text-sm",
                  dinamicPage === data.name
                    ? "text-emerald-500 font-bold underline"
                    : "text-gray-300 hover:text-white"
                )}
              >
                {data.name}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido dinámico */}
        <div className="w-full pt-5">
          {dinamicPage === "Informacion del Paciente" ? (
            <PatientInfoSection {...patient} />
          ) : dinamicPage === "Historial de Citas" ? (
            <PastAppointments {...patient} />
          ) : dinamicPage === "Seguimientos" ? (
            <FollowUp {...patient} />
          ) : (
            <div>Unknown section</div>
          )}
        </div>
      </Dialog>
    </section>
  );
};

export default PatientInfo;
