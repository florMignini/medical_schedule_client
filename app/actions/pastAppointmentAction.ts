"use server";
import { apiServer } from "@/api/api-server";
import { ICreatePastAppointment } from "@/interfaces";
import { PATIENT_ANALYSIS_BUCKET_ID, ENDPOINT, PROJECT_ID, storage } from "@/lib";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

interface IpatientPastAppointmentIDs {
  patient: string | undefined;
  pastAppointments: string | undefined;
}
export async function createPastAppointment({ patientAttachedFilesUrl, ...pastAppointmentData}: ICreatePastAppointment) {
  "use server";
  try {
console.log(patientAttachedFilesUrl)
console.log(pastAppointmentData)
let file;
    if (patientAttachedFilesUrl ) {
     
        const inputFile = InputFile.fromBuffer(
          patientAttachedFilesUrl.get("blobFile") as Blob,
          patientAttachedFilesUrl?.get("fileName") as string
        );
        file = await storage.createFile(PATIENT_ANALYSIS_BUCKET_ID!, ID.unique(), inputFile);
        console.log(file);
      
      file = await storage.createFile(PATIENT_ANALYSIS_BUCKET_ID!, ID.unique(), inputFile)
      console.log(file)
    }
    const { data } = await apiServer.post(
      `/past-appointments/create-past-appointment`,
      pastAppointmentData
    );
    console.log(data);
    return data;
  } catch (error: any) {
    console.error(error);
}
}
export async function createPatientPastAppointmentRelation(IDs: IpatientPastAppointmentIDs) {
  const res = await apiServer.post(`/patients/add-past-appointment-relation`, IDs);
}
