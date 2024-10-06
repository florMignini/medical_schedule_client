"use server";
import { apiServer } from "@/api/api-server";
import { ICreateAppointment } from "@/interfaces";
interface IIDs {
  professional: string | undefined;
  appointment: string | undefined;
}
interface IpatientIDs {
  patient: string | undefined;
  appointment: string | undefined;
}
export async function createAppointment(appointmentData: ICreateAppointment) {
  "use server";
  try {
    const { data } = await apiServer.post(
      `/appointment/new-appointment`,
      appointmentData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createProfessionalAppointmentRelation(IDs: IIDs) {
  const res = await apiServer.post(`/professional/add-appointment-relation`,IDs);
}

export async function createPatientAppointmentRelation(IDs: IpatientIDs) {
  const res = await apiServer.post(`/patients/add-appointment-relation`, IDs);
}
