import { apiServer } from "@/api/api-server";
import { ICreateAppointment } from "@/interfaces";

export async function createAppointment(appointmentData: ICreateAppointment) {
    "use server";
    try {
      const { data } = await apiServer.post(`/auth/login`, appointmentData);
  
      return data;
    } catch (error) {
      console.log(error);
    }
  }