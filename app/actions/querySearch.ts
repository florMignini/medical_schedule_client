"use server";
import { apiServer } from "@/api/api-server";

export async function querySearch(value: string) {
  "use server";
  try {
    const res = await apiServer.get(`/patients/search?firstName=${value}`);
    console.log(res);
    return res;
  } catch (error) {
    console.error(error);
  }
}
