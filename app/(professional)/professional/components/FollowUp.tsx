import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Patient } from "@/interfaces";
import CalendarIcon from "./icons/CalendarIcon";
import dayjs from "dayjs";
import NoteIcon from "./icons/NoteIcon";

const FollowUp = (patientInfo: Patient) => {
  const { followUpIncluded } = patientInfo!;

  return (
    <section className="w-full flex flex-col items-center justify-start gap-3">
      <div className="w-[95%] flex flex-col items-start justify-start bg-white px-2 py-3 shadow-[inset_0px_-2px_3px_rgba(73,73,73,0.2)] rounded-md">
        {/* title general */}
        <div className="flex items-center justify-start gap-2">
          <div className="h-5 border-x-2 border-black" />
          <h1>Seguimientos Anteriores</h1>
        </div>
        {/* past appointments cards section */}
        <div className="w-[100%] flex items-center justify-start flex-wrap gap-12 pt-5">
          {followUpIncluded !== undefined && followUpIncluded?.length > 0 ? (
            <TooltipProvider>
              <Tooltip>
                {followUpIncluded.map((followUp) => {
                  return (
                    <TooltipTrigger key={followUp.followUp.id} asChild>
                      <button className="w-[250px] h-auto glass-effect rounded-md px-4 py-2 flex flex-col items-center justify-center gap-2 text-dark-600 hover:shadow-md hover:shadow-dark-600  hover:transition-shadow">
                        {/* date and hr */}
                        <div className="w-[100%] flex flex-row items-center justify-start font-light text-xs gap-2">
                          <CalendarIcon width={20} height={20} />
                          <p>
                            {dayjs(followUp?.createdAt).format("DD MMMM  YYYY")}{" "}
                            <strong className="text-black pl-2">|</strong>{" "}
                          </p>
                          <p>
                            {dayjs(followUp?.followUp?.createdAt).format(
                              "HH:mm A"
                            )}
                          </p>
                        </div>
                        {/* symptoms */}
                        <div className="w-[100%] flex flex-row items-center justify-start font-light text-xs gap-2">
                          <NoteIcon width={20} height={20} />
                          <div className="flex flex-col">
                            <p className="text-start font-semibold">
                              Síntomas:
                            </p>
                            <p className="text-start truncate">
                              {followUp?.followUp?.currentSymptoms}
                            </p>
                          </div>
                        </div>
                        {/* treatment notes */}
                        <div className="w-[100%] flex flex-row items-center justify-start font-light text-xs gap-2">
                          <NoteIcon width={20} height={20} />
                          <div className="flex flex-col">
                            <p className="text-start font-semibold">Notas: </p>
                            <p className="text-start truncate">
                              {followUp?.followUp?.notes}
                            </p>
                          </div>
                        </div>
                        {/* file attachment */}
                        {/* <div className="w-[100%] flex flex-row items-center justify-start font-light text-xs gap-2">
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
                        </div> */}
                      </button>
                    </TooltipTrigger>
                  );
                })}
                <TooltipContent className="flex items-center justify-start ml-5 flex-col w-[500px] h-auto p-2 backdrop-blur-lg">
                  {/* appointment info */}
                  <div className="w-auto flex items-center justify-center pt-5">
                    {followUpIncluded.map((followUp) => (
                      <div
                        key={followUp.id}
                        className="w-[100%] flex flex-col items-center justify-center"
                      >
                        <header className="flex w-[100%] gap-2">
                          <CalendarIcon width={20} height={20} />
                          <div className="w-[100%] flex gap-4">
                            <p className="opacity-50">FECHA Y HORA: </p>
                            <div className="flex gap-2">
                              <p className="">
                                {dayjs(followUp?.followUp?.scheduled).format(
                                  "DD MMMM YYYY h:mm A"
                                )}
                              </p>
                            </div>
                          </div>
                        </header>

                        <div className="w-[100%] pt-5 h-auto flex flex-col items-center mx-auto justify-start font-light text-xs gap-5">
                          {/* treatment notes */}

                          <div className="flex items-start justify-start gap-2">
                            <p className="text-start font-semibold">
                              RAZÓN DE LA CONSULTA
                            </p>
                            <p className="truncate">
                              {followUp?.followUp?.currentSymptoms}
                            </p>
                          </div>
                          <div className="flex items-start justify-start gap-2">
                            <NoteIcon width={20} height={20} />
                            <div className="flex flex-col ">
                              <p className="text-start font-semibold">DIAGNOSTICO</p>
                              <p className="truncate">
                                {followUp?.followUp?.treatment
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* attached files preview */}
                        {/* <div className="w-[100%] pt-5 flex items-center justify-start font-light text-xs gap-2">
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
                     </div> */}
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <p className="font-semibold text-center">
              No hay citas anteriores para este paciente.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FollowUp;
