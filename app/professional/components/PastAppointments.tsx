"use client";
import { Patient } from "@/interfaces";
import { useEffect, useState } from "react";

import Icon from "@/components/ui/icon";
import calendarIcon from "../../../public/assets/icons/calendar.svg";
import notesIcon from "../../../public/assets/icons/notes.svg";
import fileIcon from "../../../public/assets/icons/fileAttachment.svg";
import dayjs from "dayjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import CalendarIcon from "./icons/CalendarIcon";
import NoteIcon from "./icons/NoteIcon";
import FileAttachmentIcon from "./icons/FileAttachmentIcon";
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
console.log(pastAppointmentsIncluded)
  return (
    <section className="w-full flex flex-col items-center justify-start gap-3">
      <div className="w-[95%] flex flex-col items-start justify-start bg-white px-2 py-3 shadow-[inset_0px_-2px_3px_rgba(73,73,73,0.2)] rounded-md">
        {/* title general */}
        <div className="flex items-center justify-start gap-2">
          <div className="h-5 border-x-2 border-black" />
          <h1>Citas Anteriores</h1>
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
                          <CalendarIcon
                            width={20}
                            height={20}
                          />
                          <p>
                            {dayjs(
                              pastAppointment?.createdAt
                            ).format("DD MMMM  YYYY")}{" "}
                            <strong className="text-black pl-2">|</strong>{" "}
                          </p>
                          <p>
                            {dayjs(
                              pastAppointment?.pastApppointments?.createdAt
                            ).format("HH:mm A")}
                          </p>
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
                          }`}</p>
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
                      className="w-[100%] flex items-center justify-center">
                        <div className="w-[50%] flex flex-col items-center justify-start font-light text-xs gap-2">
                          {/* treatment notes */}
                          <div className="w-[100%] flex items-center justify-start gap-2">
                          <NoteIcon
                            width={20}
                            height={20}
                          />
                          <div className="flex flex-col ">
                            <p className="opacity-50">RAZÓN DE LA CONSULTA</p>
                            <p className="">
                              {pastAppointments?.pastAppointments?.notes}
                            </p>
                          </div>
                          </div>
                          <div className="w-[100%] flex items-center justify-start gap-2">
                          <NoteIcon
                            width={20}
                            height={20}
                          />
                          <div className="flex flex-col ">
                            <p className="opacity-50">DIAGNOSTICO</p>
                            <p className="">
                              {pastAppointments?.pastAppointments?.diagnosis}
                            </p>
                          </div>
                          </div>
                        </div>
                        <div className="w-[50%] flex flex-col items-center justify-start font-light text-xs gap-2">
                          {/* date & time */}
                          <div className="w-[100%] flex items-center justify-start gap-2">
                          <CalendarIcon
                            width={20}
                            height={20}
                          />
                          <div className="w-[100%] flex flex-col">
                            <p className="opacity-50">FECHA Y HORA</p>
                            <div className="flex flex-row gap-2">
                            <p>
                              {dayjs(
                                pastAppointments?.pastAppointments?.scheduled
                              ).format("DD MMMM  YYYY")}
                            </p>
                            <p>
                              {dayjs(
                                pastAppointments?.pastApppointments?.scheduled
                              ).format("HH:mm A")}
                            </p>
                            </div>
                          </div>
                          </div>
                    {/* attached files preview */}

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
