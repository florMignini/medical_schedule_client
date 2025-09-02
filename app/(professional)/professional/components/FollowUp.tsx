import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Patient } from "@/interfaces";
import CalendarIcon from "./icons/CalendarIcon";
import NoteIcon from "./icons/NoteIcon";
import dayjs from "dayjs";

type FollowUpProps = {
  patientInfo: Patient;
  isDemo?: boolean;
};

const FollowUp = ({ patientInfo, isDemo = false }: FollowUpProps) => {
  const { followUpIncluded } = patientInfo;

  return (
    <section className="w-full flex flex-col items-center justify-start gap-3 py-4 px-2">
      {/* Título */}
      <div className="w-full max-w-4xl flex items-center gap-2 text-white bg-[#262626] px-4 py-3 rounded-xl shadow-inner">
        <div className="h-5 border-l-2 border-emerald-500" />
        <h2 className="text-sm lg:text-base font-mono">Seguimientos Anteriores</h2>
      </div>

      {/* Cards */}
      <TooltipProvider>
       <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4">
          {followUpIncluded && followUpIncluded.length > 0 ? (
            followUpIncluded.map((followUp) => (
              <Tooltip key={followUp.followUp.id}>
                <TooltipTrigger asChild>
                  <button
                    className="w-[90vw] max-w-[300px] glass-effect rounded-md px-4 py-3 flex flex-col gap-2 text-left text-dark-600 hover:shadow-md transition-shadow disabled:opacity-60"
                    disabled={isDemo}
                  >
                    {/* Fecha y hora */}
                    <div className="flex items-center gap-2 text-xs">
                      <CalendarIcon width={16} height={16} />
                      <span>
                        {dayjs(followUp.createdAt).format("DD MMM YYYY")} |{" "}
                        {dayjs(followUp.followUp.createdAt).format("HH:mm A")}
                      </span>
                    </div>

                    {/* Síntomas */}
                    <div className="text-xs text-gray-700">
                      <p className="font-semibold">Síntomas:</p>
                      <p className="truncate">
                        {followUp.followUp.currentSymptoms}
                      </p>
                    </div>

                    {/* Notas */}
                    <div className="text-xs text-gray-700">
                      <p className="font-semibold">Notas:</p>
                      <p className="truncate">{followUp.followUp.notes}</p>
                    </div>
                  </button>
                </TooltipTrigger>

                <TooltipContent className="max-w-[90vw] w-[300px] p-3 bg-white rounded shadow-md text-xs text-gray-800">
                  <p className="font-semibold mb-1">Detalle del seguimiento</p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {dayjs(followUp.followUp.scheduled).format(
                      "DD MMM YYYY - HH:mm A"
                    )}
                  </p>
                  <p>
                    <strong>Síntomas:</strong>{" "}
                    {followUp.followUp.currentSymptoms}
                  </p>
                  <p>
                    <strong>Diagnóstico:</strong> {followUp.followUp.treatment}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay seguimientos registrados aún.
            </p>
          )}
        </div>
      </TooltipProvider>
    </section>
  );
};

export default FollowUp;
