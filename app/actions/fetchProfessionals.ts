"use server";

import { apiServer } from "@/api/api-server";

export async function fetchProfessionals() {
  "use server";
  try {
    const res = await apiServer.get(`/professional/get-all-professionals`);

    return res;
  } catch (error) {
    console.error(error);
  }
}
