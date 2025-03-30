export type ReminderStatus = 'pending' | 'sent' | 'failed' | 'canceled';

export interface Reminder {
  id: string;
  appointmentId?: string;
  userId?: string;
  message: string;
  status: ReminderStatus;
  scheduledFor: string | undefined;
  sentAt?: string | null;
}

// server interface
export interface ICreateReminder {
  appointmentId: string | undefined;
  userId: string | undefined;
  message: string;
  status: ReminderStatus;
  scheduledFor: string | undefined;
}