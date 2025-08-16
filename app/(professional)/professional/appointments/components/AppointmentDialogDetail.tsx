"use client";
import React, { useState } from "react";
import NewAppointmentForm from "@/components/forms/NewAppointmentForm";
import PastAppointmentForm from "@/components/forms/PastAppointmentForm";
import { AppointmentsIncluded, Patient } from "@/interfaces";

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
  isDemo = false,
}: AppointmentDialogDetailProps) => {
  const [requiereSeguimiento, setRequiereSeguimiento] = useState(false);

  const {patient} = patientData || {};
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
        isDemo={isDemo}
      />
    );
  }

  return (
    <div className="p-2 md:p-4 rounded-lg flex flex-col gap-4 bg-white/10 backdrop-blur-sm">
      {/* Datos del paciente */}
      <div className="flex flex-col md:flex-row justify-between gap-4 text-white">
        <div className="flex flex-col">
          <span className="font-mono font-bold text-sm md:text-base">
            Paciente
          </span>
          <span className="text-xs md:text-sm">{`${patient?.firstName} ${patient?.lastName}`}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono font-bold text-sm md:text-base">
            Cobertura
          </span>
          <span className="text-xs md:text-sm">
            {patient?.insuranceProvider}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono font-bold text-sm md:text-base">
            Número
          </span>
          <span className="text-xs md:text-sm">
            {patient?.insurancePolicyNumber}
          </span>
        </div>
      </div>

      {/* Datos del turno */}
      <div className="flex flex-col md:flex-row justify-between gap-4 text-white">
        <div className="flex flex-col">
          <span className="font-mono text-sm md:text-base">Motivo</span>
          <span className="text-xs md:text-sm truncate">
            {appointment?.reason || "No especificado"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-sm md:text-base">Notas</span>
          <span className="text-xs md:text-sm truncate">
            {appointment?.notes}
          </span>
        </div>
      </div>

      {/* PastAppointment: lectura o creación */}
      {appointment?.pastAppointment ? (
        <div className="p-2 rounded-lg bg-white/20 text-black">
          <h3 className="font-semibold mb-2">Consulta pasada</h3>
          <p>
            <strong>Diagnóstico:</strong>{" "}
            {appointment.pastAppointment.diagnosis}
          </p>
          <p>
            <strong>Prescripción:</strong>{" "}
            {appointment.pastAppointment.prescription}
          </p>
          <p>
            <strong>Notas:</strong> {appointment.pastAppointment.notes}
          </p>
          {Array.isArray(
            appointment.pastAppointment?.patientAttachedFilesUrl
          ) &&
            appointment.pastAppointment.patientAttachedFilesUrl.length > 0 && (
              <div className="mt-2">
                <strong>Archivos adjuntos:</strong>
                <ul className="list-disc list-inside">
                  {Array.isArray(
                    appointment.pastAppointment?.patientAttachedFilesUrl
                  ) &&
                    (
                      appointment.pastAppointment
                        .patientAttachedFilesUrl as string[]
                    ).length > 0 && (
                      <div className="mt-2">
                        <strong>Archivos adjuntos:</strong>
                        <ul className="list-disc list-inside">
                          {(
                            appointment.pastAppointment
                              .patientAttachedFilesUrl as string[]
                          ).map((url, i) => (
                            <li key={i}>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-blue-500"
                              >
                                Archivo {i + 1}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </ul>
              </div>
            )}
        </div>
      ) : (
        <PastAppointmentForm patient={patient} appointment={appointment} />
      )}

      {/* Seguimiento */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="seguimiento"
          checked={requiereSeguimiento}
          onChange={(e) => setRequiereSeguimiento(e.target.checked)}
          className="cursor-pointer"
        />
        <label htmlFor="seguimiento" className="text-white text-sm">
          Requiere seguimiento
        </label>
      </div>

      {requiereSeguimiento && (
        <div className="mt-4 border-t border-white/30 pt-4">
          <h4 className="text-md font-semibold text-white mb-2">
            Programar seguimiento
          </h4>
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
