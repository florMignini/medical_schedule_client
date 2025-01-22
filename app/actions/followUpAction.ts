"use server";
import { apiServer } from "@/api/api-server";
import { ICreateFollowUp } from "@/interfaces/createFollowUp.interface";
interface IpatientIDs {
  patient: string | undefined;
  followUp: string | undefined;
}
interface IIDs {
  professional: string | undefined;
  followUp: string | undefined;
}
interface IFollowUp {
  followUpId: string | undefined;
  appointment: string | undefined;
}
export default async function createFollowUp(followUpData: ICreateFollowUp) {
  "use server";
  try {
    console.log(followUpData);
    const { data } = await apiServer.post(
      `/follow-up/new-follow-up`,
      followUpData
    );
    return data;
  } catch (error:any) {
      console.log(error?.response?.data);
  }
}

export async function createPatientFollowUpRelation(IDs: IpatientIDs) {
  const res = await apiServer.post(`/patients/add-follow-up-relation`,IDs);
}

export async function createProfessionalFollowUpRelation(IDs: IIDs) {
  const res = await apiServer.post(`/professional/add-follow-up-relation`,IDs);
}

export async function createAppointmentFollowUpRelation(IDs: IFollowUp) {
  const res = await apiServer.post(`/appointment/add-follow-up-relation`,IDs);
}