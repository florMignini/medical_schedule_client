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

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);
  return isMobile;
};

const PastAppointments = ({
  isDemo = false,
  ...patientInfo
}: PastAppointmentsProps) => {
  const [profInfo, setProfInfo] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { pastAppointmentsIncluded } = patientInfo;
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="w-full bg-white min-h-screen flex flex-col gap-4 items-center p-4">
      <div className="w-full max-w-4xl flex items-center gap-2 text-white bg-[#262626] px-4 py-3 rounded-xl shadow-inner">
        <div className="h-5 border-l-2 border-emerald-500" />
        <h2 className="text-sm lg:text-base font-mono">Citas Anteriores</h2>
      </div>

      <TooltipProvider>
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4">
          {pastAppointmentsIncluded && pastAppointmentsIncluded.length > 0 ? (
            pastAppointmentsIncluded.map((item) => {
              const appointment = item.pastAppointments;
              const files = appointment?.patientAttachedFilesUrl || [];
              const isExpanded = expandedId === appointment.id;

              if (isMobile) {
                // Comportamiento móvil: acordeón
                return (
                  <div
                    key={appointment.id}
                    className="w-full max-w-[95vw] bg-black/10 backdrop-blur-sm border border-gray-200 rounded-lg p-5 shadow-md cursor-pointer transition-shadow duration-300 hover:shadow-lg overflow-hidden"
                    onClick={() => toggleExpand(appointment.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-900 font-semibold text-xs">
                        <CalendarIcon width={18} height={18} />
                        <span>
                          {dayjs(item.createdAt).format("DD MMM YYYY")} |{" "}
                          {dayjs(appointment.createdAt).format("HH:mm A")}
                        </span>
                      </div>
                      {!isDemo ? (
                        <div className="w-8 h-8 flex items-center justify-end">
                          <ConfigButton
                          id={appointment.id}
                          component="pastAppointment"
                        />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs px-2 py-1 border border-gray-300 rounded cursor-not-allowed select-none">
                          Demo
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <p className="text-gray-800 font-semibold text-sm leading-tight">
                        Diagnóstico:
                      </p>
                      <p className="text-gray-700 break-words">
                        {appointment.diagnosis || "—"}
                      </p>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 text-gray-700 space-y-3 text-sm leading-relaxed">
                        <p>
                          <strong>Notas:</strong>{" "}
                          <span className="break-words">
                            {appointment.notes || "—"}
                          </span>
                        </p>
                        <p>
                          <strong>Fecha programada:</strong>{" "}
                          {dayjs(appointment.scheduled).format(
                            "DD MMM YYYY - HH:mm A"
                          )}
                        </p>

                        {files.length > 0 && (
                          <>
                            <p className="font-semibold mt-3">Archivos:</p>
                            <div className="flex flex-wrap gap-3 mt-2">
                              {files.map((file: string, i: number) => (
                                <Link
                                  key={i}
                                  href={file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-gray-100 border border-gray-300 rounded-md px-3 py-1 flex items-center gap-2 text-xs text-gray-800 hover:bg-gray-200 transition"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Abrir
                                  <FileAttachmentIcon width={16} height={16} />
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              } else {
                // Comportamiento desktop: tooltip
                return (
                  <Tooltip key={appointment.id}>
                    <TooltipTrigger asChild>
                      <button
                        className="w-[90vw] max-w-[300px] bg-black/10 rounded-lg p-5 shadow-md hover:shadow-lg flex flex-col gap-3 text-left text-gray-900 overflow-hidden transition-shadow duration-300"
                        onClick={() => {
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
                           <div className="w-8 h-8 flex items-center justify-end">
                             <ConfigButton
                              id={appointment.id}
                              component="pastAppointment"
                            />
                           </div>
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
              }
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
