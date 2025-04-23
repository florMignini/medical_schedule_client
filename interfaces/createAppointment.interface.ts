export interface ICreateAppointment {
  appointmentId?: string | undefined;
  schedule: Date;
  reason: string | undefined;
  notes: string | undefined;
  cancellationReason?: string | undefined;
}

export interface ICreatePastAppointment {
  diagnosis?: string | undefined;
  prescription?: string | undefined;
  notes?: string | undefined;
  followUpRequired?: boolean | undefined;
  scheduled: Date | undefined;
  patientAttachedFilesUrl?: FormData[] | FormData | undefined;
}
