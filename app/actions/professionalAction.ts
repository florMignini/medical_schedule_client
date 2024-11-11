"use server";
import { apiServer } from "@/api/api-server";
import { ICreateInstitution } from "@/interfaces";
import { BUCKET_ID, ENDPOINT, PROJECT_ID, storage } from "@/lib";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

interface IIDs {
  professional: string | undefined;
  institution: string | undefined;
}

//   export async function createNewProfessional({institutionImage, ...institution}: any) {
//     "use server";
//     try {
//         let file;
//         if(institutionImage){
//             const inputFile = InputFile.fromBuffer(
//                 institutionImage?.get("blobFile") as Blob,
//                 institutionImage?.get("fileName") as string
//             );
//             file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
//         }
//         let institutionRegistrationData = {
//             institutionImage: file ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}` : `https://img.freepik.com/premium-photo/modern-hospital-building-exterior_641010-59451.jpg?w=900`,
//             ...institution}
//             const { data } = await apiServer.post(
//               `/institutions/new-institution`,
//               institutionRegistrationData
//             );
//             return data;
//         } catch (error:any) {
//             console.log(error.response.data);
//         }
//         }

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
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    const professionalUpdateData = {
      userImage: file
        ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`
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
