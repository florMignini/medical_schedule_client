import { Appointment } from "./appointment.interface";

export interface ProfessionalPatient {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  patient: Patient[];
}

export interface Patient {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  patientPhotoUrl: string;
  identificationType: string;
  identityNumber: string;
  email: string;
  phone: string;
  birthDate: Date;
  address: string;
  occupation: string;
  gender: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  contactRelationship: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  smoker: string;
  exSmoker: string;
  bloodType: string;
  bloodFactor: string;
  allergic: string;
  allergies: string;
  familyMedicalHistory: string;
  medicalHistory: string;
  medicalHistoryType: string;
  pastMedicalHistory: string;
  currentMedication: string;
  ObservationsComments: string;
  patientHeight: string;
  patientWeight: string;
  patientWaist: string;
  patientHip: string;
  patientArm: string;
  patientTricepsFold: string;
  patientBMI: string;
  patientBFP: string;
  isActive: boolean;
  pastAppointmentsIncluded?: any[];
  appointmentsIncluded?: any[];
  followUpIncluded?: any[];
}
