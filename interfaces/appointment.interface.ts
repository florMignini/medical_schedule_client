import { ICreatePastAppointment } from "./createAppointment.interface";

export interface Appointment {
    id: string;
    schedule: string;
    reason: string | undefined;
    notes: string | undefined;
    cancellationReason?: string | null;
    pastAppointment: ICreatePastAppointment | null;
  }