"use server";
import {
  Gender,
  AllergiesTypeEnum,
  IdentificationTypeEnum,
  BloodType,
  BloodFactor,
  MedicalHistory,
  BooleanOption,
} from "@/data";
import { cookies } from "next/headers";
import { booleanOption } from "@/data";
import { InputFile } from "node-appwrite/file";
import { BUCKET_ID, ENDPOINT, PROJECT_ID, storage } from "@/lib";
import { ID } from "node-appwrite";
interface IPatient {
  // personal information
  firstName: string;
  lastName: string;
  identificationType: IdentificationTypeEnum;
  identityNumber: string;
  patientPhotoUrl: string;
  email: string;
  phone: string;
  birthDate: Date;
  address: string;
  occupation: string;
  gender: Gender;
  emergencyContactName: string;
  emergencyContactNumber: number;
  // medical records
  insuranceProvider: string;
  insurancePolicyNumber: string;
  smoker: BooleanOption;
  exSmoker: BooleanOption;
  bloodType: BloodType;
  bloodFactor: BloodFactor;
  allergiesType: AllergiesTypeEnum;
  allergies?: string;
  familyMedicalHistory?: string;
  medicalHistory?: string;
  medicalHistoryType: MedicalHistory;
  pastMedicalHistory: string;
  currentMedication?: string;
  ObservationsComments: string;
  // anthropometric measurements
  patientHeight: string;
  patientWeight: string;
  patientBMI: string;
  patientBFP: string;
  isActive: boolean;
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
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
    }
    let patientRegistrationData = {
      patientPhotoUrl: file ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}` : `https://static.vecteezy.com/system/resources/thumbnails/037/336/395/small_2x/user-profile-flat-illustration-avatar-person-icon-gender-neutral-silhouette-profile-picture-free-vector.jpg`,
      ...patient}
    const res = await fetch(
      `http://localhost:3001/api/patients/patient-registration`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientRegistrationData),
      }
    );

    const parsedRes = await res.json();
    // console.log(parsedRes);
    return parsedRes;
  } catch (error) {
    console.log(error);
  }
}

export async function createProfessionalPatientRelation (IDs: IIDs) {
  const res = await fetch(
    `http://localhost:3001/api/professional/add-patient-relation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(IDs),
    }
  );

  const parsedRes = await res.json();
}