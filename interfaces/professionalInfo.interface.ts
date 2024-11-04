import { Appointment } from "./appointment.interface";
import { Patient } from "./patientsResponse";

export interface ProfessionalInformation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  username: string;
  userImage: string;
  specialty: string;
  phoneNumber: number;
  gender: string;
  email: string;
  isActive: boolean;
  patientsIncluded?: PatientsIncluded[];
  appointmentsIncluded?: AppointmentsIncluded[];
}

export interface PatientsIncluded {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  patient: Patient;
}
export interface AppointmentsIncluded {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  appointment: Appointment;
}
