import React, { useState } from "react";
import NewAppointmentForm from "@/components/forms/NewAppointmentForm";
import PastAppointmentForm from "@/components/forms/PastAppointmentForm";
import { AppointmentsIncluded } from "@/interfaces";

interface AppointmentDialogDetailProps {
  appt?: AppointmentsIncluded;
  component?: string;
  patientId?: string;
  onSuccess: () => void;
  initialDateTime: Date | null;
  type?: "create" | "update";
  patientData?: any;
  isDemo?: boolean;
}

const AppointmentDialogDetail = ({
  appt,
  component,
  patientId,
  onSuccess,
  initialDateTime,
  type = "update",
  patientData,
  isDemo = false
}: AppointmentDialogDetailProps) => {
  const [requiereSeguimiento, setRequiereSeguimiento] = useState(false);

  const patient = patientData?.patient;
  const appointment = appt?.appointment;

  if (type === "create") {
    return (
      <NewAppointmentForm
        key={`create-${patientId}`}
        type="create"
        patientId={patientId || ""}
        initialDateTime={initialDateTime}
        component={component}
        patientsList={[]}
        onSuccess={onSuccess}
        isDemo={isDemo} // 🟡 modo demo propagado
      />
    );
  }

  return (
    <div>
      {/* Detalles del paciente */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center text-white flex-col">
          <p className="text-sm md:text-base font-mono font-bold">Paciente:</p>
          <p className="text-xs md:text-sm">{`${patient?.firstName} ${patient?.lastName}`}</p>
        </div>
        <div className="flex items-center text-white flex-col">
          <p className="text-sm md:text-base font-mono font-bold">Cobertura:</p>
          <p className="text-xs md:text-sm">{patient?.insuranceProvider}</p>
        </div>
        <div className="flex items-center text-white flex-col">
          <p className="text-sm md:text-base font-mono font-bold">Número:</p>
          <p className="text-xs md:text-sm">{patient?.insurancePolicyNumber}</p>
        </div>
      </div>

      {/* Detalles del turno */}
      <div className="w-full flex items-center justify-between mb-4 gap-2 text-white">
        <div className="flex flex-col">
          <p className="font-mono text-sm md:text-base">Motivo:</p>
          <p className="text-xs md:text-sm truncate">
            {appointment?.reason || "No especificado"}
          </p>
        </div>
        <div className="flex flex-col">
          <p className="font-mono text-sm md:text-base">Notas:</p>
          <p className="text-xs md:text-sm truncate">{appointment?.notes}</p>
        </div>
      </div>

      <PastAppointmentForm patient={patient} appointment={appointment} />

      {/* Checkbox y formulario de seguimiento */}
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

      {requiereSeguimiento && (
        <div className="mt-4 border-t pt-4">
          <h2 className="mb-2 text-md font-semibold text-white">
            Programar seguimiento
          </h2>
          <NewAppointmentForm
            key={`seguimiento-${patientId}`}
            type="create"
            patientId={patientId || ""}
            initialDateTime={null}
            component="seguimiento"
            patientsList={[]}
            patient={patient}
            onSuccess={() => {
              setRequiereSeguimiento(false);
              onSuccess();
            }}
            isDemo={isDemo}
          />
        </div>
      )}
    </div>
  );
};

export default AppointmentDialogDetail;
