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
let pastAppointmentFilesUrls:any[] = [];
if (patientAttachedFilesUrl && Array.isArray(patientAttachedFilesUrl)) {
  // Map files for PromiseAll
  const uploadPromises = patientAttachedFilesUrl.map(async (file: any) => {
    try {
      const inputFile = await InputFile.fromBuffer(
        file.get("blobFile") as Blob,
        file?.get("fileName") as string
      );
      const fileUrl = await storage.createFile(
        PATIENT_ANALYSIS_BUCKET_ID!,
        ID.unique(),
        inputFile
      );

      return `${ENDPOINT}/storage/buckets/${PATIENT_ANALYSIS_BUCKET_ID!}/files/${fileUrl?.$id}/view?project=${PROJECT_ID}`;
    } catch (error) {
      console.error(`Error subiendo el archivo ${file?.get("fileName")}:`, error);
    }
  });

  // waiting for all files to be uploaded
  try {
    pastAppointmentFilesUrls = await Promise.all(uploadPromises);
    
  } catch (error) {
    console.error('Error subiendo archivos:', error);
  }
}

   
    const pastAppointmentDataWithFile = {
      patientAttachedFilesUrl: pastAppointmentFilesUrls ? pastAppointmentFilesUrls : undefined,
     ...pastAppointmentData,
    };

    const { data } = await apiServer.post(
      `/past-appointments/create-past-appointment`,
      pastAppointmentDataWithFile
    );

    return data;
  } catch (error: any) {
    console.error(error.data);
}
}
export async function createPatientPastAppointmentRelation(IDs: IpatientPastAppointmentIDs) {
  const res = await apiServer.post(`/patients/add-past-appointment-relation`, IDs);
}
