import { apiServer } from "@/api/api-server";
import { ICreateAppointment } from "@/interfaces";
interface IIDs{
  professional: string;
  appointment: string;
}
interface IpatientIDs{
  patient: string;
  appointment: string;
}
export async function createAppointment(appointmentData: ICreateAppointment) {
    "use server";
    try {
      const { data } = await apiServer.post(`/auth/login`, appointmentData);
  
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  export async function createProfessionalAppointmentRelation (IDs: IIDs) {
    const res = await apiServer.post(
      `/professional/add-appointment-relation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(IDs),
      }
    );
  }

  export async function createPatientAppointmentRelation (IDs: IpatientIDs) {
    const res = await apiServer.post(
      `/patients/add-appointment-relation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(IDs),
      }
    );
  }