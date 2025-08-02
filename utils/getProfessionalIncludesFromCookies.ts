import { ProfessionalInformation } from "@/interfaces";
import { cookies } from "next/headers";

export async function getProfessionalIncludesFromCookies() {
  const cookieStore = cookies();
  const professionalId = cookieStore.get("professional-id")?.value;
  const isDemo = cookieStore.get("isDemo")?.value === "true";

  // ✅ Si no hay ID, evitar fetch y devolver nulls
  if (!professionalId) {
    return {
      data: null,
      appointments: [],
      patients: [],
      institutions: [],
    };
  }

  const apiBase = isDemo
    ? "https://medical-schedule-server-demo.onrender.com/api"
    : "https://medical-schedule-server.onrender.com/api";

  const res = await fetch(`${apiBase}/professional/get-professional/${professionalId}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Error fetching professional info");

  const data: ProfessionalInformation = await res.json();

  return {
    data,
    appointments: data.appointmentsIncluded ?? [],
    patients: data.patientsIncluded ?? [],
    institutions: data.institutionsIncluded ?? [],
  };
}
