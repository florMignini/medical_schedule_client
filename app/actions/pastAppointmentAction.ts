"use server";
import { apiServer } from "@/api/api-server";
import { ICreatePastAppointment } from "@/interfaces";
import {
  PATIENT_ANALYSIS_BUCKET_ID,
  ENDPOINT,
  PROJECT_ID,
  storage,
} from "@/lib";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { cookies } from "next/headers";

interface ICreatePastAppointmentWithIds extends ICreatePastAppointment {
  patientId: string;
  appointmentId: string;
}

export async function createPastAppointment({
  patientAttachedFilesUrl,
  patientId,
  appointmentId,
  ...pastAppointmentData
}: ICreatePastAppointmentWithIds) {
  try {
    let uploadedFilesUrls: string[] = [];

    // Subida de archivos si los hay
    if (patientAttachedFilesUrl && Array.isArray(patientAttachedFilesUrl)) {
      const uploadPromises = patientAttachedFilesUrl.map(async (file: any) => {
        try {
          const inputFile = await InputFile.fromBuffer(
            file.get("blobFile") as Blob,
            file.get("fileName") as string
          );

          const fileUrl = await storage.createFile(
            PATIENT_ANALYSIS_BUCKET_ID!,
            ID.unique(),
            inputFile
          );

          return `${ENDPOINT}/storage/buckets/${PATIENT_ANALYSIS_BUCKET_ID!}/files/${
            fileUrl?.$id
          }/view?project=${PROJECT_ID}`;
        } catch (error) {
          console.error(
            `Error subiendo el archivo ${file?.get("fileName")}:`,
            error
          );
          return null;
        }
      });

      uploadedFilesUrls = (await Promise.all(uploadPromises)).filter(
        Boolean
      ) as string[];
    }

    // Construir payload final
    const payload = {
      ...pastAppointmentData,
      patientId,
      patientAttachedFilesUrl: uploadedFilesUrls.length
        ? uploadedFilesUrls
        : undefined,
    };

    // Obtener accessToken desde cookies (o ajusta según tu sistema de autenticación)
    const accessToken = cookies().get("accessToken")?.value;
    if (!accessToken) {
      throw new Error("No estás autenticado. Por favor, inicia sesión.");
    }

    // Llamada al backend con appointmentId en la URL
    const { data } = await apiServer.post(
      `/past-appointments/${appointmentId}`,
      payload,
      {
        headers: {
          accessToken,
        },
      }
    );
console.log("data", data);
    // Manejo del resultado
    return data;
  } catch (error: any) {
    console.error("Error en createPastAppointment:", error);
    return {
      success: false,
      message: error.message || "Error al crear la cita pasada",
    };
  }
}
