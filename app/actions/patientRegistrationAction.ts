"use server";
import { Gender } from "@/data";

import { cookies } from "next/headers";

interface IPatientData {
  firstName: "";
  lastName: "";
  patientPhoto: [];
  address: "";
  occupation: "";
  email: "";
  phone: "";
  birthDate: any;
  gender: Gender;
  identificationType: "";
  identificationNumber: "";
  emergencyContactName: "";
  emergencyContactNumber: "";
  insuranceProvider: "";
  insurancePolicyNumber: "";
  smoker: "No";
  exSmoker: "No";
  allergies: "";
  currentMedication: "";
  familyMedicalHistory: "";
  pastMedicalHistory: "";
  patientHeight: "";
  patientWeight: "";
  patientBMI: "";
  patientBFP: "";
  ObservationsComments: "";
}

export async function patientRegistration(patientData: IPatientData) {
  "use server";
  try {
    const res = await fetch(`http://localhost:3001/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });

    // const parsedRes: LoginUserResponse = await res.json();
    // cookies().set("session-cookie", parsedRes.accessToken, { secure: true });
    // return parsedRes.professional;
  } catch (error) {
    console.log(error);
  }
}
