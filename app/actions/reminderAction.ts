"use server";
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
      `/reminder/create-reminder`,
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

  "use server";
  const professionalReminderRelation = await apiServer.post(
    `/professional/add-reminder-relation`,
    IDs
  );
  console.log(professionalReminderRelation.data)
    return professionalReminderRelation.data;
}