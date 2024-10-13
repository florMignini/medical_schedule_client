"use server";
import { apiServer } from "@/api/api-server";
import { ICreatePastAppointment } from "@/interfaces";

interface IpatientPastAppointmentIDs {
  patient: string | undefined;
  pastAppointment: string | undefined;
}
export async function createPastAppointment(pastAppointmentData: ICreatePastAppointment) {
  "use server";
  try {
    const { data } = await apiServer.post(
      `/appointment/new-appointment`,
      pastAppointmentData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createPatientPastAppointmentRelation(IDs: IpatientPastAppointmentIDs) {
  const res = await apiServer.post(`/patients/add-appointment-relation`, IDs);
}
