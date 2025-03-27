
export type ReminderStatus = "pending" | "sent" | "failed" | "canceled";

export interface Reminder {
  id: string;
  appointmentId?: string;
  userId?: string;
  message: string;
  status: ReminderStatus;
  scheduledFor: Date | undefined;
  sentAt: string | null;
}

// server interface
export interface ICreateReminder {
  status: ReminderStatus;
  scheduledFor: Date | undefined;
}
