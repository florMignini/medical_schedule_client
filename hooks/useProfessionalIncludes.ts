"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ProfessionalInformation } from "@/interfaces";
import axios from "axios";

export function useProfessionalIncludes() {
  const [data, setData] = useState<ProfessionalInformation | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    const professionalId = Cookies.get("professional-id");
    const isDemo = Cookies.get("isDemo") === "true";
    const token = Cookies.get("session-token");

    if (!professionalId || !token) {
      setError(new Error("Faltan cookies necesarias para la sesión"));
      setIsLoading(false);
      return;
    }

    const endpoint = `/professional/get-professional/${professionalId}`;
    const baseURL = isDemo
      ? "https://medical-schedule-server-demo.onrender.com/api"
      : "https://medical-schedule-server.onrender.com/api";

    try {
      const response = await axios.get<ProfessionalInformation>(
        `${baseURL}${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    appointments: data?.appointmentsIncluded ?? [],
    patients: data?.patientsIncluded ?? [],
    institutions: data?.institutionsIncluded ?? [],
    error,
    isLoading,
    refetch: fetchData,
  };
}
