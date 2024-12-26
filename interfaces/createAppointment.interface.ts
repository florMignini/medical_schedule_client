export interface ICreateAppointment {
  schedule: Date;
  reason: string | undefined;
  notes: string | undefined;
  // patientId: string,
  // professionalId: string | undefined,
}

export interface ICreatePastAppointment {
  diagnosis?: string | undefined;
  prescription?: string | undefined;
  notes?: string | undefined;
  followUpRequired?: boolean | undefined;
  scheduled: Date | undefined;
  patientAttachedFilesUrl?: FormData | string | undefined;
}
