"use server";
import { apiServer } from "@/api/api-server";
import { ICreateFollowUp } from "@/interfaces/createFollowUp.interface";
import axios from "axios";//only for testing
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
    const { data } = await apiServer.post(
      `/follow-up/new-follow-up`,
      followUpData
    );
    return { success: true, data };
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    console.error("FollowUp error:", message);

    // Podés actuar según el código
    if (status === 409) {
      return {
        success: false,
        error: "Ya existe un seguimiento para la fecha indicada",
        status,
      };
    }

    return {
      success: false,
      error: message || "Error inesperado al crear el seguimiento",
      status: status || 500,
    };
  }
}


export async function createPatientFollowUpRelation(IDs: IpatientIDs) {
  try {
  const res = await axios.post(`http://localhost:3001/patients/add-follow-up-relation`,IDs);
} catch (error: any) {
  console.error(error?.response?.data);
}  
}

export async function createProfessionalFollowUpRelation(IDs: IIDs) {
 try {
   const res = await axios.post(`http://localhost:3001/professional/add-follow-up-relation`,IDs);
 } catch (error: any) {
  console.error(error?.response?.data);
} 
}

export async function createAppointmentFollowUpRelation(IDs: IFollowUp) {
try {
  const res = await axios.post(`http://localhost:3001/appointment/add-follow-up-relation`,IDs);
} catch (error: any) {
  console.error(error?.response?.data);
} 
}