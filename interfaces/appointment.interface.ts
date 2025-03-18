export interface Appointment {
    id: string;
    schedule: string;
    medicalInstitutionId?: string | null;
    reason: string | undefined;
    notes: string | undefined;
    cancellationReason?: string | null;
  }