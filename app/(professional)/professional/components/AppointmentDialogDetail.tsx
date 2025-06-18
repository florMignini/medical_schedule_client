import FollowUpForm from "@/components/forms/FollowUpForm";
import { Appointment } from "@/interfaces";

interface AppointmentDialogDetailProps {
  appt: Appointment;
  component?:string;
  patientId: string;
  onSuccess: () => void;
  initialDateTime: Date | null;
  type?: string;
  }

const AppointmentDialogDetail = ({appt, component, patientId, onSuccess, initialDateTime, type  }:AppointmentDialogDetailProps) => {
  return (
    <div>
      <FollowUpForm
        component={component}
        patientId={patientId}
        onSuccess={onSuccess}
        initialDateTime={initialDateTime}
        type={type}
      />
    </div>
  )
}

export default AppointmentDialogDetail