"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { Patient } from "@/interfaces";
import CalendarIcon from "./icons/CalendarIcon";
import NoteIcon from "./icons/NoteIcon";
import FileAttachmentIcon from "./icons/FileAttachmentIcon";
import ConfigButton from "./ConfigButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type PastAppointmentsProps = Patient & {
  isDemo?: boolean;
};

const PastAppointments = ({
  isDemo = false,
  ...patientInfo
}: PastAppointmentsProps) => {
  const [profInfo, setProfInfo] = useState<string | null>(null);
  const { pastAppointmentsIncluded } = patientInfo;
  const {toast} = useToast();
  useEffect(() => {
    const proInfo = localStorage.getItem("infoProfSession");
    if (proInfo) setProfInfo(JSON.parse(proInfo));
  }, []);

  if (!profInfo) {
    return (
      <section className="w-full bg-white min-h-screen flex flex-col gap-2 items-center justify-start p-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-24 bg-gray-300 w-full max-w-[95%] rounded-xl"
          />
        ))}
      </section>
    );
  }

  return (
    <section className="w-full bg-white min-h-screen flex flex-col gap-4 items-center p-4">
      <div className="w-full max-w-4xl flex items-center gap-2 text-white bg-[#262626] px-4 py-3 rounded-xl shadow-inner">
        <div className="h-5 border-l-2 border-emerald-500" />
        <h2 className="text-sm lg:text-base font-mono">Citas Anteriores</h2>
      </div>

      <TooltipProvider>
        <div className="w-full max-w-4xl flex flex-wrap justify-center gap-4">
          {pastAppointmentsIncluded && pastAppointmentsIncluded.length > 0 ? (
            pastAppointmentsIncluded.map((item) => {
              const appointment = item.pastAppointments;
              const files = appointment?.patientAttachedFilesUrl || [];

              return (
                <Tooltip key={appointment.id}>
                  <TooltipTrigger asChild>
                    <button
                      className="w-[90vw] max-w-[300px] glass-effect rounded-md px-4 py-3 flex flex-col gap-3 text-left text-dark-600 hover:shadow-md transition-shadow"
                      onClick={() =>{
                        if (isDemo) {
                          toast({
                            title: "Modo Demo: esta sección es solo visual",
                            description:
                              "No se pueden editar citas anteriores en esta vista.",
                            className: "bg-emerald-500 text-black",
                            duration: 5000,
                          });
                        }
                      }}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CalendarIcon width={16} height={16} />
                          <span>
                            {dayjs(item.createdAt).format("DD MMM YYYY")} |{" "}
                            {dayjs(appointment.createdAt).format("HH:mm A")}
                          </span>
                        </div>

                        {!isDemo ? (
                          <ConfigButton
                            id={appointment.id}
                            component="pastAppointment"
                          />
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-gray-400 cursor-not-allowed text-xs px-2 py-1 border border-gray-300 rounded">
                                  Demo
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="text-xs">
                                Edición desactivada en modo demo.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>

                      {/* Diagnóstico */}
                      <div className="text-xs text-gray-700 flex gap-2 items-start">
                        <NoteIcon width={16} height={16} />
                        <div>
                          <p className="font-semibold">Diagnóstico:</p>
                          <p className="truncate">{appointment.diagnosis}</p>
                        </div>
                      </div>

                      {/* Notas */}
                      <div className="text-xs text-gray-700 flex gap-2 items-start">
                        <NoteIcon width={16} height={16} />
                        <div>
                          <p className="font-semibold">Notas:</p>
                          <p className="truncate">{appointment.notes}</p>
                        </div>
                      </div>

                      {/* Archivos */}
                      <div className="text-xs text-gray-700 flex items-center gap-2">
                        <FileAttachmentIcon width={16} height={16} />
                        <p>Analisis Adjuntos ({files.length})</p>
                      </div>
                    </button>
                  </TooltipTrigger>

                  {/* Tooltip de detalle */}
                  <TooltipContent className="max-w-[90vw] w-[300px] p-3 bg-white rounded shadow-md text-xs text-gray-800">
                    <p className="font-semibold mb-1">Detalle de la cita</p>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {dayjs(appointment.scheduled).format(
                        "DD MMM YYYY - HH:mm A"
                      )}
                    </p>
                    <p>
                      <strong>Razón:</strong> {appointment.notes}
                    </p>
                    <p>
                      <strong>Diagnóstico:</strong> {appointment.diagnosis}
                    </p>

                    {files.length > 0 && (
                      <>
                        <p className="font-semibold mt-2">Archivos:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {files.map((file: string, i: number) => (
                            <Link
                              key={i}
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-100 border rounded p-1 flex items-center gap-1 text-xs"
                            >
                              Abrir
                              <FileAttachmentIcon width={14} height={14} />
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay citas anteriores para este paciente.
            </p>
          )}
        </div>
      </TooltipProvider>
    </section>
  );
};

export default PastAppointments;
