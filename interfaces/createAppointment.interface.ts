export interface ICreateAppointment {
    schedule: Date,
    reason: string | undefined,
    notes: string | undefined,
    // patientId: string,
    // professionalId: string | undefined,
}

export interface ICreatePastAppointment {
    details?: string | undefined;
    appointmentFileAttached?: FormData | undefined;
}