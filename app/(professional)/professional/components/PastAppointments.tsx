"use client";
import { Patient } from "@/interfaces";
import { useEffect, useState } from "react";
import {Skeleton} from '../../../../components/ui/skeleton';
import dayjs from "dayjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CalendarIcon from "./icons/CalendarIcon";
import NoteIcon from "./icons/NoteIcon";
import FileAttachmentIcon from "./icons/FileAttachmentIcon";
import Link from "next/link";
import ConfigButton from "./ConfigButton";
const PastAppointments = (patientInfo: Patient) => {
  const [profInfo, setProfInfo] = useState<string | null>(null);
  const { pastAppointmentsIncluded } = patientInfo!;

  useEffect(() => {
    const proffessionalInfo = JSON.parse(
      localStorage.getItem("infoProfSession")!
    );
    if (proffessionalInfo) {
      setProfInfo(proffessionalInfo);
    }
  }, []);
  if (!profInfo) {
    return (
      <section className="w-full bg-white h-screen flex flex-col items-center justify-start gap-2">
        <Skeleton className="h-30 bg-gray-500 w-[99%] rounded-xl" />
              <Skeleton className="h-30 bg-gray-500 w-[99%] rounded-xl" />
              <Skeleton className="h-30 bg-gray-500 w-[99%] rounded-xl" />
      </section>
    );
  }
  return (
    <section className="w-full bg-white h-screen flex flex-col items-center justify-start gap-2">
      <div className="w-[95%] flex flex-col items-start justify-start bg-[#262626] px-2 py-3 text-white shadow-[inset_0px_-2px_3px_rgba(73,73,73,0.2)] rounded-xl">
        {/* title general */}
        <div className="flex items-center justify-start gap-2">
          <div className="h-5 border-x-2 border-emerald-500" />
          <h1 className="font-mono text-sm lg:text-base">Citas Anteriores</h1>
        </div>
        {/* past appointments cards section */}
        <div className="w-[100%] flex items-center justify-start flex-wrap gap-12 pt-5">
          {pastAppointmentsIncluded !== undefined &&
          pastAppointmentsIncluded?.length > 0 ? (
            <TooltipProvider>
              <Tooltip>
                {pastAppointmentsIncluded.map((pastAppointment) => {
                  return (
                    <TooltipTrigger
                    key={pastAppointment.pastAppointments
.                      id}
                    asChild>
                      <button className="w-[250px] h-auto glass-effect rounded-md px-4 py-2 flex flex-col items-center justify-center gap-2 text-dark-600 hover:shadow-md hover:shadow-dark-600  hover:transition-shadow">
                        {/* date and hr */}
                        <div className="w-[100%] flex flex-row items-center justify-start font-light text-xs gap-2">
                          <div className="w-[90%] flex">
                          <CalendarIcon
                            width={20}
                            height={20}
                            className="mr-2"
                          />
                          <p>
                            {dayjs(
                              pastAppointment?.createdAt
                            ).format("DD MMMM  YYYY")}{" "}
                            <strong className="text-black px-1">|</strong>{" "}
                          </p>
                          <p>
                            {dayjs(
                              pastAppointment?.pastApppointments?.createdAt
                            ).format("HH:mm A")}
                          </p>
                          </div>
                          <div className="w-[10%]">
                          <ConfigButton
                          id={pastAppointment.pastAppointments
                            .id}
                            component={"pastAppointment"}
                          />
                          </div>
                        </div>
                          {/* treatment diagnosis */}
                          <div className="w-[100%] flex flex-row items-start justify-start font-light text-xs gap-2">
                          <NoteIcon
                            width={20}
                            height={20}
                          />
                          <div className="flex flex-col">
                          <p>Diagnostico:</p>
                          <p className="text-start truncate">{pastAppointment?.pastAppointments?.diagnosis}</p>
                          </div>
                        </div>
                        {/* treatment notes */}
                        <div className="w-[100%] flex flex-row items-start justify-start font-light text-xs gap-2">
                          <NoteIcon
                            width={20}
                            height={20}
                          />
                           <div className="flex flex-col">
                          <p>Notas: </p>
                          <p className="text-start truncate">{pastAppointment?.pastAppointments?.notes}</p>
                          </div>
                        </div>
                        {/* file attachment */}
                        <div className="w-[100%] flex flex-row items-center justify-start font-light text-xs gap-2">
                          <FileAttachmentIcon
                            width={20}
                            height={20}
                          />
                          <p>{`Analisis Adjuntos ${
                            pastAppointment?.pastAppointments
                              ?.patientAttachedFilesUrl === null
                              ? `(0)`
                              : `(${pastAppointment?.pastAppointments?.patientAttachedFilesUrl?.length})`
                          }: `}</p>
                        </div>
                      </button>
                    </TooltipTrigger>
                  );
                })}
                <TooltipContent className="flex items-center justify-start ml-5 flex-col w-[500px] h-auto p-2 backdrop-blur-lg">
                  {/* appointment info */}
                  <div className="w-[95%] flex items-center justify-start pt-5">
                    {pastAppointmentsIncluded.map((pastAppointments) => (
                      <div 
                      key={pastAppointments.id}
                      className="w-[100%] flex flex-col items-center justify-center">
                        <header className="flex w-[100%] gap-2">
                        <CalendarIcon
                            width={20}
                            height={20}
                          />
                          <div className="w-[100%] flex gap-4">
                            <p className="opacity-50">FECHA Y HORA: </p>
                            <div className="flex gap-2">
                            <p className="">
                              {dayjs(
                                pastAppointments?.pastAppointments?.scheduled
                              ).format("DD MMMM YYYY h:mm A")}
                            </p>
                            </div>
                          </div>
                        </header>
                        
                        <div className="w-[100%] pt-5 flex items-center justify-start font-light text-xs gap-2">
                          {/* treatment notes */}
                          <div className="w-[50%] flex items-center justify-start gap-2">
                          <NoteIcon
                            width={20}
                            height={20}
                          />
                          <div className="flex flex-col ">
                            <p className="opacity-50">RAZÓN DE LA CONSULTA</p>
                            <p className="truncate">
                              {pastAppointments?.pastAppointments?.notes}
                            </p>
                          </div>
                          </div>
                          <div className="w-[50%] flex items-center justify-start gap-2">
                          <NoteIcon
                            width={20}
                            height={20}
                          />
                          <div className="flex flex-col ">
                            <p className="opacity-50">DIAGNOSTICO</p>
                            <p className="truncate">
                              {pastAppointments?.pastAppointments?.diagnosis}
                            </p>
                          </div>
                          </div>
                        </div>
                    {/* attached files preview */}
                    <div className="w-[100%] pt-5 flex items-center justify-start font-light text-xs gap-2">
                      <FileAttachmentIcon
                        width={20}
                        height={20}
                      />
                        <p className="opacity-50">ANALISIS ADJUNTOS: </p>
                      <div className="flex flex-col">
                        <div className="w-[100%] flex items-center justify-center gap-2">
                          {pastAppointments?.pastAppointments?.patientAttachedFilesUrl?.map(
                            (file:any) => (
                              <Link
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                                key={file}
                                className="w-[50px] h-[50px] flex flex-col items-center justify-center bg-gray-200 rounded-md"
                              >
                                <p>Abrir</p>
                                <FileAttachmentIcon
                                width={20}
                                height={20}
                                />
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                     </div>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <p className="font-semibold text-center">No hay citas anteriores para este paciente.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PastAppointments;
