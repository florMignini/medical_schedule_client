import { apiServer } from "@/api/api-server";
import { ICreateReminder } from "@/interfaces/reminder.interface";
interface IIDs{
    professional: string;
    reminder: string;
  }
export async function createReminder(reminderData: ICreateReminder) {

  "use server";
  try {
    const { data } = await apiServer.post(
      `/reminders/create-reminder`,
      reminderData
    );
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
  }
}

//professional reminder relation
export async function createProfessionalReminderRelation (IDs: IIDs) {
  const professionalReminderRelation = await apiServer.post(
    `/reminders/add-reminder-relation`,
    IDs
  );
    return professionalReminderRelation.data;
}