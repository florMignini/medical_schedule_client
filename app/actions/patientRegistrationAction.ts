"use server";
import { Gender, AllergiesTypeEnum, IdentificationTypeEnum, BloodType, BloodFactor, MedicalHistory, BooleanOption } from "@/data";
import { cookies } from "next/headers";
import { booleanOption } from "@/data";

interface IPatient {
  // personal information
  firstName: string;
  lastName: string;
  identificationType: IdentificationTypeEnum;
  identityNumber: string;
  patientPhoto: [];
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
  isActive: boolean
}

export async function patientRegistration(patientData: any) {
  "use server";
  console.log(patientData)
  try {
    const res = await fetch(`http://localhost:3001/api/patients/patient-registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });

    const parsedRes = await res.json();
    console.log(parsedRes)
    return parsedRes;
  } catch (error) {
    console.log(error);
  }
}
