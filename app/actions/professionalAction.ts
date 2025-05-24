"use server";
import { apiServer } from "@/api/api-server";
import {
  PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID,
  ENDPOINT,
  PROJECT_ID,
  storage,
} from "@/lib";
import axios from "axios";

import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

interface IIDs {
  professional: string | undefined;
  institution: string | undefined;
}

export async function inviteProfessionalAction(email: string) {
  "use server";
  try {
    const { data } = await apiServer.post(
      `/auth/invite`,
      { email }
    );
    return {
      status: 200,
      message: "Invitación enviada exitosamente, revise su email para completar el proceso"
    };
  } catch (error: any) {
    console.error("Error al invitar profesional:", error.response?.data || error.message);
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Error al enviar la invitación"
    };
  }
}

export async function validateToken(token: string) {
  "use server";
  try {
    const { data } = await apiServer.get(
      `/auth/validate-token/${token}`
    );
    return data;
  }
  catch (error: any) {
    console.error("Error al validar token:", error.response?.data || error.message);
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Error al validar token, intente nuevamente"
    };
  }
}

export async function createNewProfessional({
  userImage,
  ...professional
}: any) {
  "use server";

  try {
    let file;
    if (userImage) {
      const inputFile = InputFile.fromBuffer(
        userImage?.get("blobFile") as Blob,
        userImage?.get("fileName") as string
      );
      file = await storage.createFile(
        PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID!,
        ID.unique(),
        inputFile
      );
    }

    let professionalRegistrationData = {
      userImage: file
        ? `${ENDPOINT}/storage/buckets/${PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`
        : `https://img.freepik.com/premium-photo/modern-hospital-building-exterior_641010-59451.jpg?w=900`,
      ...professional,
    };

    const { data } = await apiServer.post(
      `/professional/register`,
      professionalRegistrationData
    );
    return data;
  } catch (error: any) {
    console.log(error.response.data);
  }
}

export async function updateProfessionalProfileAction({
  userImage,
  ...professionalUpdate
}: any) {
  "use server";
  const cookieStore = cookies();
  const professionalId = cookieStore.get("professional-id")?.value;
  try {
    let file;
    if (typeof userImage !== "string") {
      const inputFile = InputFile.fromBuffer(
        userImage?.get("blobFile") as Blob,
        userImage?.get("fileName") as string
      );
      file = await storage.createFile(
        PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID!,
        ID.unique(),
        inputFile
      );
    }
    console.log(file);
    const professionalUpdateData = {
      userImage:
        file !== undefined
          ? `${ENDPOINT}/storage/buckets/${PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`
          : userImage,
      ...professionalUpdate,
    };
    const { data } = await apiServer.put(
      `/professional/update/${professionalId}`,
      professionalUpdateData
    );

    return data;
  } catch (error: any) {
    console.log(error);
  }
}

export async function updateProfessionalPasswordAction(passwordValues: any) {
  "use server";
  const cookieStore = cookies();
  const professionalId = cookieStore.get("professional-id")?.value;

  try {
    const { data } = await apiServer.put(
      `/professional/update-password/${professionalId}`,
      passwordValues
    );

    return data;
  } catch (error: any) {
    return error.response.data;
  }
}
