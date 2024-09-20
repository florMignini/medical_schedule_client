"use server";
import { IPatientsResponse } from "@/interfaces";

export async function fetchPatients() {
'use server'
  try {
    const res = await fetch(`http://localhost:3001/api/patients/get-all-patients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const parsedRes : IPatientsResponse[] = await res.json();
    console.log(parsedRes)
    return parsedRes;
  } catch (error) {
   console.error(error)
  }
}
