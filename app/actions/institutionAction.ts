"use server";
import { apiServer } from "@/api/api-server";
import { ICreateInstitution } from "@/interfaces";
import { PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID, ENDPOINT, PROJECT_ID, storage } from "@/lib";
import { ID } from "node-appwrite";;
import { InputFile } from "node-appwrite/file";

interface IIDs {
    professional: string | undefined;
    institution: string | undefined;
  }

  export async function createNewInstitution({institutionImage, ...institution}: any) {
    "use server";
    try {
        let file;
        if(institutionImage){
            const inputFile = InputFile.fromBuffer(
                institutionImage?.get("blobFile") as Blob,
                institutionImage?.get("fileName") as string
            );
            file = await storage.createFile(PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID!, ID.unique(), inputFile);
        }
        let institutionRegistrationData = {
            institutionImage: file ? `${ENDPOINT}/storage/buckets/${PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}` : `https://img.freepik.com/premium-photo/modern-hospital-building-exterior_641010-59451.jpg?w=900`,
            ...institution}
            const { data } = await apiServer.post(
              `/institutions/new-institution`,
              institutionRegistrationData
            );
            return data;
        } catch (error:any) {
            console.log(error.response.data);
        }
        }
  

  export async function createProfessionalInstitutionRelation(IDs: IIDs) {
    const res = await apiServer.post(`/professional/add-institution-relation`,IDs);
  }

  export async function getInstitutionById(institutionId: string): Promise<ICreateInstitution | null> {
    "use server";
    try {
      const { data } = await apiServer.get(`/institutions/get-institution/${institutionId}`);
      return data as ICreateInstitution;
    } catch (error: any) {
      console.error("Error fetching institution:", error.response?.data || error.message);
      return null;
    }
  }

  export async function updateInstitutionAction({payload,
    institutionId}: any) {
    "use server";
    try {
      const {institutionImage, ...rest} = payload
      let file;
        if (institutionImage && typeof institutionImage === "object") {
            const inputFile = InputFile.fromBuffer(
                institutionImage?.get("blobFile") as Blob,
                institutionImage?.get("fileName") as string
            );
            file = await storage.createFile(PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID!, ID.unique(), inputFile);
        }

        const institutionUpdateData = {
            institutionImage: file ? `${ENDPOINT}/storage/buckets/${PROFESSIONALYINSTITUTION_PROFILE_BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}` : `https://img.freepik.com/premium-photo/modern-hospital-building-exterior_641010-59451.jpg?w=900`,
            ...rest}

            const { data } = await apiServer.put(
              `/institutions/update/${institutionId}`,
              institutionUpdateData
            );
            return data;
        } catch (error:any) {
            console.error("Error updating institution:", error);
        }
        }