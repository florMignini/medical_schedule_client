"use server";
import { apiServer } from "@/api/api-server";
import { ICreateInstitution } from "@/interfaces";
import { PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID, ENDPOINT, PROJECT_ID, storage } from "@/lib";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

interface IIDs {
  professional: string | undefined;
  institution: string | undefined;
}

  export async function createNewProfessional({userImage, ...professional}: any) {
    "use server";
    console.log(professional)
    console.log(userImage)
    try {
        let file;
        if(userImage){
            const inputFile = InputFile.fromBuffer(
                userImage?.get("blobFile") as Blob,
                userImage?.get("fileName") as string
            );
            file = await storage.createFile(PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID!, ID.unique(), inputFile);
        }
        let professionalRegistrationData = {
            institutionImage: file ? `${ENDPOINT}/storage/buckets/${PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}` : `https://img.freepik.com/premium-photo/modern-hospital-building-exterior_641010-59451.jpg?w=900`,
            ...professional}
            console.log(professionalRegistrationData)
            const { data } = await apiServer.post(
              `/professional/register`,
              professionalRegistrationData
            );
            console.log(data)
            return data;
        } catch (error:any) {
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
    if (userImage === "object") {
      const inputFile = InputFile.fromBuffer(
        userImage?.get("blobFile") as Blob,
        userImage?.get("fileName") as string
      );
      file = await storage.createFile(PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID!, ID.unique(), inputFile);
    }

    const professionalUpdateData = {
      userImage: file
        ? `${ENDPOINT}/storage/buckets/${PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`
        : 
        `https://avatar.iran.liara.run/public/job/doctor/male`,
      ...professionalUpdate,
    };
    const { data } = await apiServer.put(
      `/professional/update/${professionalId}`,
      professionalUpdateData
    );
    console.log(data);
    return data;
  } catch (error: any) {
    console.log(error.response);
  }
}
