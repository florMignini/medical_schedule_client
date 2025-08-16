import axios from "axios";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/constants.api";
import { ProfessionalInformation } from "@/interfaces";

export const getProfessionalIncludesFromCookies =
  async () => {
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
    
    const apiBase = isDemo ? API_BASE_URL.demo : API_BASE_URL.prod;
    
    const showFloatingButton = false;

      const { data } = await axios.get<ProfessionalInformation>(
        `${apiBase}/professional/get-professional/${professionalId}`
      );

      return {
        showFloatingButton,
        isDemo,
        data,
        appointments: data.appointmentsIncluded ?? [],
        patients: data.patientsIncluded ?? [],
        institutions: data.institutionsIncluded ?? [],
      };
    
  };
