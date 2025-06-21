import React, { useState } from "react";
import NewAppointmentForm from "@/components/forms/NewAppointmentForm";
import PastAppointmentForm from "@/components/forms/PastAppointmentForm";
import { AppointmentsIncluded } from "@/interfaces";

interface AppointmentDialogDetailProps {
  appt: AppointmentsIncluded;
  component?: string;
  patientId: string;
  onSuccess: () => void;
  initialDateTime: Date | null;
  type?: string;
  patientData?: any;
}

const AppointmentDialogDetail = ({
  appt,
  component,
  patientId,
  onSuccess,
  initialDateTime,
  type,
  patientData,
}: AppointmentDialogDetailProps) => {
  const [requiereSeguimiento, setRequiereSeguimiento] = useState(false);

  const patient = patientData ? patientData.patient : undefined;
  const appointment = appt ? appt.appointment : undefined;

  return (
    <div>
      {/* patient details */}
      <div className="w-full flex items-center justify-between mb-4">
        {/* left section */}
        <div className="flex items-center text-white flex-col">
          <p className="text-sm md:text-base font-mono font-bold">Paciente:</p>
          <p className="text-xs md:text-sm">{`${patient?.firstName} ${patient?.lastName}`}</p>
        </div>
        {/* middle section */}
        <div className="flex items-center text-white flex-col">
          <p className="text-sm md:text-base font-mono font-bold">Cobertura:</p>
          <p className="text-xs md:text-sm">{patient?.insuranceProvider}</p>
        </div>
        {/* right section */}
        <div className="flex items-center text-white flex-col">
          <p className="text-sm md:text-base font-mono font-bold">Numero:</p>
          <p className="text-xs md:text-sm">{patient?.insurancePolicyNumber}</p>
        </div>
      </div>
      {/* appointment details */}
      <div className="w-full flex items-center justify-between mb-4 gap-2 text-white">
        {/* left section */}
        <div className="flex flex-col">
          <p className="font-mono text-sm md:text-base">Motivo:</p>
          <p className="text-xs md:text-sm truncate">
            {appointment?.reason || "No especificado"}
          </p>
        </div>
        {/* right section */}
        <div className="flex flex-col">
          <p className="font-mono text-sm md:text-base">Notas:</p>
          <p className="text-xs md:text-sm truncate">{appointment?.notes}</p>
        </div>
      </div>

      {/* Formulario para detalles pasados */}
      <PastAppointmentForm patient={patient} appointment={appointment} />

      {/* Checkbox para seguimiento */}
      <div className="mt-6 flex items-center gap-2">
        <input
          type="checkbox"
          id="seguimiento"
          checked={requiereSeguimiento}
          onChange={(e) => setRequiereSeguimiento(e.target.checked)}
          className="cursor-pointer"
        />
        <label htmlFor="seguimiento" className="text-sm text-white">
          Requiere seguimiento
        </label>
      </div>

      {/* Formulario para crear seguimiento */}
      {requiereSeguimiento && (
        <div className="mt-4 border-t pt-4">
          <h2 className="mb-2 text-md font-semibold text-white">
            Programar seguimiento
          </h2>
          <NewAppointmentForm
            key={`seguimiento-${patientId}`}
            type="create"
            patientId={patientId}
            initialDateTime={null}
            component="seguimiento"
            patients={patient} // No mostramos selector paciente acá
            onSuccess={() => {
              setRequiereSeguimiento(false);
              onSuccess();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AppointmentDialogDetail;
