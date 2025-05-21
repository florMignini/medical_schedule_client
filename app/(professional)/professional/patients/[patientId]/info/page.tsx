"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import { DinamicPage } from "@/app/(professional)/professional/data";
import clsx from "clsx";
import { PatientInfoSection } from "@/app/(professional)/professional/components";

import { Skeleton } from "@/components/ui/skeleton";
import { Patient } from "@/interfaces";
import PastAppointments from "@/app/(professional)/professional/components/PastAppointments";
import FollowUp from "@/app/(professional)/professional/components/FollowUp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FollowUpForm from "@/components/forms/FollowUpForm";
import NewAppointmentForm from "@/components/forms/NewAppointmentForm";
import ReminderButton from "@/app/(professional)/professional/components/ReminderButton";
import { apiServer } from "../../../../../../api/api-server";

const PatientInfo = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patientInfo, setPatientInfo] = useState<Patient>();

  useEffect(() => {
    async function fetchPatientInfo() {
      let {data} = await apiServer.get<Patient>(
        `https://medical-schedule-server.onrender.com/api/patients/get-patient/${patientId}`
      );

      setPatientInfo(data as Patient);
    }
    fetchPatientInfo();
  }, [patientId]);
  const [dinamicPage, setDinamicPage] = useState<string>(
    "Informacion del Paciente"
  );
 
  const [turnoOcita, setTurnoOcita] = useState<string | null>(null);
  //  skeleton
  if (!patientInfo) {
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

  return (
    <section className="w-full h-auto min-[700px]:h-screen py-2 flex flex-col items-center justify-start gap-2">
      <Dialog>
        {/* Title */}
        <div className="flex w-[90%] h-10 items-start justify-start ">
          <h1 className="text-2xl max-[690px]:text-xl font-bold text-start">
            Paciente
          </h1>
        </div>
        {/* top section */}
        <div className="w-[95%] h-auto flex flex-col bg-white gap-5 shadow-[inset_0px_-2px_3px_rgba(73,73,73,0.2)] rounded-md">
          {/* top */}
          <div className="w-[100%] h-auto px-2 pt-3 flex flex-col min-[768px]:grid min-[768px]:grid-cols-[40%,60%] mx-auto">
            <Image
              src={patientInfo.patientPhotoUrl}
              alt="patient-photo"
              width={80}
              height={80}
              className="mx-auto rounded-full flex items-center justify-end mb-3"
            />
            {/* patient name and identity */}
            <div className="w-full h-auto text-black flex  items-center justify-around flex-col min-[768px]:flex-row my-auto">
              {/* left side */}
              <div className="w-[95%] text-[14px] md:text-18-bold flex flex-col items-center justify-center mb-2 min-[768px]:mb-0">
                <h1 className="">{`${patientInfo.firstName} ${patientInfo.lastName}`}</h1>
                <p className="">
                  <strong className="">
                    {patientInfo.identificationType}:{" "}
                  </strong>
                  {patientInfo.identityNumber}
                </p>
              </div>
              {/* rightside */}

              <div className="w-[95%] h-auto flex min-[768px]:flex-col justify-center gap-2">
                <DialogTrigger className="w-[60%] md:w-[50%] flex items-center justify-center bg-blue-700 p-1 rounded-lg cursor-pointer hover:scale-105 active:outline-none">
                  <button
                    className="text-white max-[690px]:text-[11px] text-14-medium"
                    onClick={() => setTurnoOcita("Turno")}
                  >
                    Crear turno
                  </button>
                </DialogTrigger>
                {/* follow up dialog */}
                <DialogTrigger
                  className="w-[60%] md:w-[50%] flex items-center justify-center bg-blue-700 px-5 py-1 rounded-lg cursor-pointer hover:scale-105 active:outline-none"
                >
                  <button
                    className="text-white max-[690px]:text-[10px] text-14-medium"
                    onClick={() => setTurnoOcita("Seguimiento")}
                  >
                    Agregar seguimiento
                  </button>
                </DialogTrigger>
                <DialogContent className="w-[90%] bg-dark-200">
                  <DialogHeader>
                    <DialogTitle className="w-full flex font-bold text-3xl items-center justify-between text-gray-500">
                      {turnoOcita === "Turno"
                        ? "Crear Turno"
                        : "Agregar Seguimiento"}
                     <div className="pr-5">
                     {patientInfo?.appointmentsIncluded && (
                        <ReminderButton appointment={patientInfo?.appointmentsIncluded} />
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
                    <NewAppointmentForm patientId={patientId} type="create" />
                  ) : (
                    <FollowUpForm 
                      patientId={patientId} 
                      onSuccess={() => setTurnoOcita(null)}
                      initialDateTime={null}
                    />
                  )}
                </DialogContent>
              </div>
            </div>
          </div>
          {/* info nav */}
          <div className="w-[100%] flex items-center justify-start gap-5 pb-2 px-3">
            {DinamicPage.map((data, index) => (
              <button
                key={index}
                onClick={() => setDinamicPage(data.name)}
                className={clsx(
                  "font-light text-xs md:text-sm",
                  dinamicPage === data.name
                    ? "text-blue-500 underline   underline-blue-500 font-bold" // Active link styles
                    : "text-gray-500 hover:text-black" // Inactive link styles
                )}
              >
                {data.name}
              </button>
            ))}
          </div>
        </div>
        {/* dinamic rendering components */}
        <div className="w-full pt-5">
          {dinamicPage === "Informacion del Paciente" ? (
            <PatientInfoSection {...patientInfo} />
          ) : dinamicPage === "Historial de Citas" ? (
            <PastAppointments {...patientInfo} />
          ) : dinamicPage === "Seguimientos" ? (
            <FollowUp {...patientInfo} />
          ) : (
            <div>Unknown dinamicPage</div>
          )}
        </div>
      </Dialog>
    </section>
  );
};

export default PatientInfo;
