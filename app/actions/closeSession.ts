"use server";
import { cookies } from "next/headers";

export async function closeSessionServer() {
    "use server";
    try {
     cookies().delete("professional-id")
     cookies().delete("session-token")
     return `Session Cerrada correctamente`
    } catch (error) {
      console.log(error);
    }
  }