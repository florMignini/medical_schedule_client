"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import Link from "next/link";
import { DinamicPage } from "@/data";
import clsx from "clsx";
import { PatientInfoSection } from "@/app/professional/components";
import AppointmentRecordSection from "@/app/professional/components/Calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Patient } from "@/interfaces";
import PastAppointments from "@/app/professional/components/PastAppointments";
import FollowUp from "@/app/professional/components/FollowUp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FollowUpForm from "@/components/forms/FollowUpForm";

const PatientInfo = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patientInfo, setPatientInfo] = useState<Patient>();

  useEffect(() => {
    async function fetchPatientInfo() {
      let res = await fetch(
        `http://localhost:3001/api/patients/get-patient/${patientId}`
      );
      let data = await res.json();
      setPatientInfo(data);
    }
    fetchPatientInfo();
  }, [patientId]);
  const [dinamicPage, setDinamicPage] = useState<string>(
    "Informacion del Paciente"
  );
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
          <div className="w-[100%] h-auto px-2 pt-3 grid grid-cols-[20%,80%] ">
            <Image
              src={patientInfo.patientPhotoUrl}
              alt="patient-photo"
              width={80}
              height={80}
              className="rounded-full flex items-center justify-center"
            />
            {/* patient name and identity */}
            <div className="w-full h-auto text-black flex  items-center justify-center my-auto">
              {/* left side */}
              <div className="w-[50%] text-[14px] md:text-18-bold flex flex-col ">
                <h1 className="">{`${patientInfo.firstName} ${patientInfo.lastName}`}</h1>
                <p className="">
                  <strong className="">
                    {patientInfo.identificationType}:{" "}
                  </strong>
                  {patientInfo.identityNumber}
                </p>
              </div>
              {/* rightside */}

              <div className="w-[45%] max-[690px]:w-[50%] h-auto flex flex-col justify-start md:justify-center gap-2">
                <Link
                  className="w-[60%] md:w-[50%] flex justify-center bg-blue-700 p-1 rounded-lg cursor-pointer hover:scale-105 active:outline-none"
                  href={`/professional/patients/${patientId}/new-appointment`}
                >
                  <p className="text-white max-[690px]:text-[11px] text-14-medium">
                    Crear turno
                  </p>
                </Link>

                {/* follow up dialog */}
                <DialogTrigger
                  className="w-[60%] md:w-[50%] flex items-center justify-center bg-blue-700 px-5 py-1 rounded-lg cursor-pointer hover:scale-105 active:outline-none"
                  asChild
                >
                  <button className="text-white max-[690px]:text-[10px] text-14-medium">
                    Agregar seguimiento
                  </button>
                </DialogTrigger>
                <DialogContent className="w-[90%] bg-dark-200">
                  <DialogHeader>
                    <DialogTitle className="font-bold text-3xl text-center text-gray-500">Crear seguimiento</DialogTitle>
                    <DialogDescription className="text-gray-500 text-start font-light text-base">
                      Crear nuevo seguimiento al paciente
                    </DialogDescription>
                  </DialogHeader>
                  <FollowUpForm />
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
                  "font-light text-sm",
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
            <FollowUp />
          ) : (
            <div>Unknown dinamicPage</div>
          )}
        </div>
      </Dialog>
    </section>
  );
};

export default PatientInfo;
