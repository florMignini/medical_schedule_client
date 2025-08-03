import { Appointment } from "./appointment.interface";
import { Patient } from "./patientsResponse";
import { ICreateInstitution } from "./createInstitution.interface";

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
  instagramUrl?:string;
  newTwitterUrl?:string;
  linkedInUrl?: string;
  isActive: boolean;
  patientsIncluded?: PatientsIncluded[];
  appointmentsIncluded?: AppointmentsIncluded[];
  institutionsIncluded?: InstitutionsIncluded[];
}

export interface PatientsIncluded {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  patient: Patient;
}
export interface InstitutionsIncluded {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  institution: ICreateInstitution;
}
export interface AppointmentsIncluded {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  appointment: Appointment;
}