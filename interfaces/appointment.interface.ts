export interface Appointment {
    id: string;
    schedule: string;
    medicalInstitutionId?: string;
    reason: string | undefined;
    notes: string | undefined;
    cancellationReason?: string;
  }