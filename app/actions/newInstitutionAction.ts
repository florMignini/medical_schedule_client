"use server";
import { apiServer } from "@/api/api-server";
import { ICreateInstitution } from "@/interfaces";
import { BUCKET_ID, ENDPOINT, PROJECT_ID, storage } from "@/lib";
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
            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
        }
        let institutionRegistrationData = {
            institutionImage: file ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}` : `https://img.freepik.com/premium-photo/modern-hospital-building-exterior_641010-59451.jpg?w=900`,
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