import { ProfessionalInformation } from "@/interfaces";
import { API_BASE_URL } from "@/lib/constants.api";
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
    ? API_BASE_URL.demo
    : API_BASE_URL.prod;

  const res = await fetch(`${apiBase}/professional/get-professional/${professionalId}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Error fetching professional info");

  const data: ProfessionalInformation = await res.json();

  return {
    isDemo,
    data,
    appointments: data.appointmentsIncluded ?? [],
    patients: data.patientsIncluded ?? [],
    institutions: data.institutionsIncluded ?? [],
  };
}
