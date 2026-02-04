export interface ICreateAppointment {
  appointmentId?: string | null | undefined;
  schedule?: Date | string;
  reason: string | null;
  notes: string | null;
  cancellationReason?: string | null;
}

export interface ICreatePastAppointment {
  id?: string | null | undefined;
  diagnosis: string | null;
  prescription?: string | null;
  reason?: string | null;
  notes: string | null;
  followUpRequired?: boolean;
  patientAttachedFilesUrl?: string | null;
  scheduled?: string; // ISO
  createdAt?: string; // ISO
  updatedAt?: string; // ISO
}
