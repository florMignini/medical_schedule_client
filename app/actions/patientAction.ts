"use server";
import {
  Gender,
  AllergiesTypeEnum,
  IdentificationTypeEnum,
  BloodType,
  BloodFactor,
  MedicalHistory,
  BooleanOption,
} from "@/app/(professional)/professional/data";
import { cookies } from "next/headers";
import { booleanOption } from "@/app/(professional)/professional/data";
import { InputFile } from "node-appwrite/file";
import { PATIENT_PROFILE_BUCKET_ID, ENDPOINT, PROJECT_ID, storage } from "@/lib";
import { ID } from "node-appwrite";
import { apiServer } from "@/api/api-server";
interface IPatient {
  // personal information
  firstName?: string;
  lastName?: string;
  identificationType?: IdentificationTypeEnum;
  identityNumber?: string;
  patientPhotoUrl?: string;
  email?: string;
  phone?: string;
  birthDate?: Date;
  address?: string;
  occupation?: string;
  gender?: Gender;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  // medical records
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  smoker?: BooleanOption;
  exSmoker?: BooleanOption;
  bloodType?: BloodType;
  bloodFactor?: BloodFactor;
  allergiesType?: AllergiesTypeEnum;
  allergies?: string;
  familyMedicalHistory?: string;
  medicalHistory?: string;
  medicalHistoryType?: string | MedicalHistory;
  pastMedicalHistory?: string;
  currentMedication?: string;
  ObservationsComments?: string;
  // anthropometric measurements
  patientHeight?: string;
  patientWeight?: string;
  patientBMI?: string;
  patientBFP?: string;
  isActive?: boolean;
  patientPhoto ?: any
  patientId ?:string
}
interface IIDs{
  professional: string;
  patient: string;
}
export async function patientRegistration({ patientPhoto, ...patient }: any) {
  "use server";

  try {
    let file;
    if (patientPhoto) {
      const inputFile = InputFile.fromBuffer(
        patientPhoto?.get("blobFile") as Blob,
        patientPhoto?.get("fileName") as string
      );
      file = await storage.createFile(PATIENT_PROFILE_BUCKET_ID!, ID.unique(), inputFile)
    }
    let patientRegistrationData = {
      patientPhotoUrl: file ? `${ENDPOINT}/storage/buckets/${PATIENT_PROFILE_BUCKET_ID!}/files/${file?.$id}/view?project=${PROJECT_ID}` : `https://static.vecteezy.com/system/resources/thumbnails/037/336/395/small_2x/user-profile-flat-illustration-avatar-person-icon-gender-neutral-silhouette-profile-picture-free-vector.jpg`,
      ...patient}
      const { data } = await apiServer.post(
        `/patients/patient-registration`,
        patientRegistrationData
      );

    return data;
  } catch (error:any) {
    if(error?.response.message){
      return error?.response.message
    }else{
      return error
    }
    
  }
}

 export async function updatePatientProfileAction({patientPhoto, ...patientUpdate}: IPatient) {
    "use server";

  try {
      const {patientId, ...rest} = patientUpdate
        let file;
        if(patientPhoto){
            const inputFile = InputFile.fromBuffer(
                patientPhoto?.get("blobFile") as Blob,
                patientPhoto?.get("fileName") as string
            );
            file = await storage.createFile(PATIENT_PROFILE_BUCKET_ID!, ID.unique(), inputFile);
        }
        const patientUpdateData = {
          patientPhotoUrl: file ? `${ENDPOINT}/storage/buckets/${PATIENT_PROFILE_BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}` : `https://static.vecteezy.com/system/resources/thumbnails/037/336/395/small_2x/user-profile-flat-illustration-avatar-person-icon-gender-neutral-silhouette-profile-picture-free-vector.jpg`,
            ...rest}

            const { data } = await apiServer.put(
              `/patients/update/${patientId}`,
              patientUpdateData
            );

            return data;
        } catch (error:any) {
            console.log(error.response);
        }
        }

export async function createProfessionalPatientRelation (IDs: IIDs) {
  const relationData = await apiServer.post(
    `/professional/add-patient-relation`,
    IDs
  );

  return relationData.data;
}