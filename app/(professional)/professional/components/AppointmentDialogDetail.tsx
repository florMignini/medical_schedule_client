import FollowUpForm from "@/components/forms/FollowUpForm";
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
  const patient = patientData ? patientData.patient : undefined;
  const appointment = appt ? appt.appointment : undefined;

  console.log("appointment", appointment);
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
          {/* 
  me sirve para la fecha del dashboard del cumple y de la cuenta <span className="font-bold">Fecha:</span> {new Date(appt.startDateTime).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })}
  */}
        </div>
        {/* right section */}
        <div className="flex flex-col">
          <p className="font-mono text-sm md:text-base">Notas:</p>
          <p className="text-xs md:text-sm truncate">{appointment?.notes}</p>
        </div>
      </div>
      <PastAppointmentForm
      patient={patient}
        appointment={appointment}
      />
      {/* <FollowUpForm
        component={component}
        patientId={patientId}
        onSuccess={onSuccess}
        initialDateTime={initialDateTime}
        type={type}
      /> */}
    </div>
  );
};

export default AppointmentDialogDetail;
