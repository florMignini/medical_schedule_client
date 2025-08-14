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



export async function createPastAppointment({
  patientAttachedFilesUrl,
  patientId,
  ...pastAppointmentData
}: ICreatePastAppointment & { patientId: string }) {
  try {
    let uploadedFilesUrls: string[] = [];

    // Subida de archivos si los hay
    if (patientAttachedFilesUrl && Array.isArray(patientAttachedFilesUrl)) {
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
          return null;
        }
      });

      // Esperar todas las subidas
      uploadedFilesUrls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
    }

    // Construir payload final
    const payload = {
      ...pastAppointmentData,
      patientId, // ✅ importante
      patientAttachedFilesUrl: uploadedFilesUrls.length ? uploadedFilesUrls : undefined,
    };

    // Llamada al backend
    const { data } = await apiServer.post(`/past-appointments/create-past-appointment`, payload);
    return data;
  } catch (error: any) {
    console.error("Error en createPastAppointment:", error);
    throw error;
  }
}
