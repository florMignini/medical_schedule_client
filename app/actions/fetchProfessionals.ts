"use server";

import { apiServer } from "@/api/api-server";

export async function fetchProfessionals() {
  "use server";
  try {
    const res = await apiServer(`/patients/get-all-professionals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    return res;
  } catch (error) {
    console.error(error);
  }
}
