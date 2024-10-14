"use server";
import { apiServer } from "@/api/api-server";
import { ICreatePastAppointment } from "@/interfaces";

interface IpatientPastAppointmentIDs {
  patient: string | undefined;
  pastAppointments: string | undefined;
}
export async function createPastAppointment(pastAppointmentData: ICreatePastAppointment) {
  "use server";
  try {

    const { data } = await apiServer.post(
      `/past-appointments/create-past-appointment`,
      pastAppointmentData
    );
    return data;
  } catch (error: any) {
    console.error(error);
}
}
export async function createPatientPastAppointmentRelation(IDs: IpatientPastAppointmentIDs) {
  const res = await apiServer.post(`/patients/add-past-appointment-relation`, IDs);
}
