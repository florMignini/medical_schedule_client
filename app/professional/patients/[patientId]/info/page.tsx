"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import Link from "next/link";
import { DinamicPage } from "@/data";
import clsx from "clsx";
import { PatientInfoSection } from "@/app/professional/components";
import AppointmentRecordSection from "@/app/professional/components/Calendar";
import LabResultSection from "@/app/professional/components/LabResultSection";
import { Skeleton } from "@/components/ui/skeleton";
import { Patient } from "@/interfaces";
import PastAppointments from "@/app/professional/components/PastAppointments";

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
  if (!patientInfo){
    return (
      <div className="w-full flex flex-col items-center justify-start gap-2">
        <Skeleton className="h-[250px] w-[95%] rounded-md bg-dark-200" />
        <div className="space-y-2">
          <Skeleton className="h-[450px] w-[95%] rounded-md bg-dark-200" />
          <Skeleton className="h-[450px] w-[95%] rounded-md bg-dark-200" />
        </div>
      </div>
    );
  }
    

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
      {/* Title */}
      <div className="flex w-[90%] h-10 items-start justify-start ">
        <h1 className="text-18-bold text-start">Paciente</h1>
      </div>
      {/* top section */}
      <div className="w-[95%] h-auto flex flex-col bg-dark-400 gap-5 rounded-md">
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
          <div className="w-full h-auto text-white flex  items-start justify-center my-auto">
            {/* left side */}
            <div className="w-[50%] flex flex-col">
              <h1 className="text-18-bold">{`${patientInfo.firstName} ${patientInfo.lastName}`}</h1>
              <p className="text-gray-500 font-light text-base">
                <strong className="font-bold">
                  {patientInfo.identificationType}:{" "}
                </strong>
                {patientInfo.identityNumber}
              </p>
            </div>
            {/* rightside */}
            <div className="w-[45%] h-auto flex items-end justify-center">
              <Link
                className="w-[50%] flex items-center justify-center bg-blue-700 p-1 rounded-lg cursor-pointer hover:scale-105 active:outline-none"
                href={`/professional/patients/${patientId}/new-appointment`}
              >
                <p className="text-white text-14-medium">Crear Turno</p>
              </Link>
            </div>
          </div>
        </div>
        {/* info nav */}
        <div className="w-[100%] flex items-center justify-start gap-5 pb-2 px-3">
          {DinamicPage.map((data) => (
            <button
              onClick={() => setDinamicPage(data.name)}
              className={clsx(
                "font-light text-sm",
                dinamicPage === data.name
                  ? "text-blue-500 underline   underline-blue-500 font-bold" // Active link styles
                  : "text-gray-500 hover:text-white" // Inactive link styles
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
          <PastAppointments
          {...patientInfo}
          />
        ) : dinamicPage === "Resultados Lab" ? (
          <LabResultSection />
        ) : (
          <div>Unknown dinamicPage</div>
        )}
      </div>
    </section>
  );
};

export default PatientInfo;
