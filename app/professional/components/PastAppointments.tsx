"use client";
import { Patient } from "@/interfaces";
import { useEffect, useState } from "react";
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
import Link from "next/link";
import Image from "next/image";
const PastAppointments = (patientInfo: Patient) => {
  const [profInfo, setProfInfo] = useState<string | null>(null);
  const { pastAppointmentsIncluded } = patientInfo!;
  console.log(patientInfo);
  useEffect(() => {
    const proffessionalInfo = JSON.parse(
      localStorage.getItem("infoProfSession")!
    );
    if (proffessionalInfo) {
      setProfInfo(proffessionalInfo);
    }
  }, []);

  return (
    <section className="w-full h-auto flex flex-col items-center justify-start gap-3">
      <div className="w-[95%] h-auto flex flex-col items-start justify-start bg-dark-400 px-2 py-3 rounded-md">
        {/* title general */}
        <div className="flex items-center justify-start gap-2">
          <div className="h-5 border-x-2 border-white" />
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
                    <TooltipTrigger asChild>
                      <button className="w-[250px] h-[100px] bg-dark-400/50 rounded-md px-4 py-3 flex flex-col items-center justify-center gap-2 text-dark-600 shadow-md shadow-dark-600 hover:scale-[1.01] hover:ease-in-out hover:transition-shadow">
                        {/* date and hr */}
                        <div className="w-[100%] flex flex-row items-center justify-start font-light text-xs gap-2">
                          <Icon
                            src={calendarIcon}
                            alt="calendar-icon"
                            width={20}
                            height={20}
                          />
                          <p>
                            {dayjs(
                              pastAppointment?.pastAppointments?.scheduled
                            ).format("DD MMMM  YYYY")}{" "}
                            <strong className="text-white pl-2">|</strong>{" "}
                          </p>
                          <p>
                            {dayjs(
                              pastAppointment?.pastApppointments?.scheduled
                            ).format("HH:mm A")}
                          </p>
                        </div>
                        {/* treatment notes */}
                        <div className="w-[100%] flex flex-row items-center justify-start font-light text-xs gap-2">
                          <Icon
                            src={notesIcon}
                            alt="notes-icon"
                            width={20}
                            height={20}
                          />
                          <p>{pastAppointment?.pastAppointments?.details}</p>
                        </div>
                        {/* file attachment */}
                        <div className="w-[100%] flex flex-row items-center justify-start font-light text-xs gap-2">
                          <Icon
                            src={fileIcon}
                            alt="file-icon"
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
                <TooltipContent className="flex items-center justify-start flex-col w-[500px] h-auto p-2 backdrop-blur-lg">
                  {/* Header Section */}
                  <div className="w-[99%] h-auto flex items-center mx-auto justify-center border-[1px] border-dark-600 rounded-lg text-dark-600">
                    <div className="w-[50%] flex items-center justify-center">
                      <Image
                        src={patientInfo?.patientPhotoUrl ?? ""}
                        width={50}
                        height={50}
                        alt="patient-profile-picture"
                        className="rounded-full "
                      />
                    </div>
                    <div className="w-[50%]">
                      <h2 className="font-light text-sm">
                        Nombre del Paciente
                      </h2>
                      <div>
                        <h3 className="text-3xl font-bold">{`${patientInfo?.firstName} ${patientInfo?.lastName}`}</h3>
                      </div>
                    </div>
                  </div>
                  {/* appointment info */}
                  <div className="w-[95%] flex items-center justify-start pt-5">
                    {pastAppointmentsIncluded.map((pastAppointments) => (
                      <div className="w-[100%] flex items-center justify-center">
                        <div className="w-[40%] flex flex-row items-center justify-start font-light text-xs gap-2">
                          {/* treatment notes */}
                          <Icon
                            src={notesIcon}
                            alt="notes-icon"
                            width={20}
                            height={20}
                          />
                          <div className="flex flex-col ">
                            <p className="opacity-50">RAZÓN DE LA CONSULTA</p>
                            <p className="">
                              {pastAppointments?.pastAppointments?.reason}
                            </p>
                          </div>
                        </div>
                        <div className="w-[60%] flex flex-row items-center justify-start font-light text-xs gap-2">
                          {/* date & time */}
                          <Icon
                            src={calendarIcon}
                            alt="calendar-icon"
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
                      </div>
                    ))}
                    {/* attached files preview */}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <p>No hay citas anteriores para este paciente.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PastAppointments;
