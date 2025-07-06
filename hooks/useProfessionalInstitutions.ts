"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ProfessionalInformation } from "@/interfaces";
import { apiServer } from "@/api/api-server";

export function useProfessionalInstitutions() {
  const [data, setData] = useState<ProfessionalInformation | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    const professionalId = Cookies.get("professional-id");
    console.log("🔍 Cookie professional-id:", professionalId);

    if (!professionalId) {
      setError(new Error("ID de profesional no encontrado en la cookie"));
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = `/professional/get-professional/${professionalId}`;
      const response = await apiServer.get<ProfessionalInformation>(
        `https://medical-schedule-server.onrender.com/api${endpoint}`
      );

      setData(response.data);
    } catch (err: any) {
      console.error("❌ Error en la petición:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return {
    data,
    institutions: data?.institutionsIncluded ?? [],
    error,
    isLoading,
    refetch: fetchData,
  };
}
