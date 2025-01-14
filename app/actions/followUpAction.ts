"use server";
import { apiServer } from "@/api/api-server";
import { ICreateFollowUp } from "@/interfaces/createFollowUp.interface";
/* interface IIDs {
  professional: string | undefined;
  appointment: string | undefined;
}
interface IpatientIDs {
  patient: string | undefined;
  appointment: string | undefined;
} */
export default async function createFollowUp(followUpData: ICreateFollowUp) {
  "use server";
  try {
    const { data } = await apiServer.post(
      `/follow-up/new-follow-up`,
      followUpData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

/* export async function createProfessionalAppointmentRelation(IDs: IIDs) {
  const res = await apiServer.post(`/professional/add-appointment-relation`,IDs);
}

export async function createPatientAppointmentRelation(IDs: IpatientIDs) {
  const res = await apiServer.post(`/patients/add-appointment-relation`, IDs);
} */
