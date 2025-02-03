"use server"

import { apiServer } from "@/api/api-server";

export async function categorization() {
  try {
    const { data } = await apiServer.get(`/followUp/get-all-follow-ups`);
   console.log(data);
    // return data;
  } catch (error:any) {
    console.log(error?.response?.data);
  }
}