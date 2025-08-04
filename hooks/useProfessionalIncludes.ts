// hooks/useProfessionalIncludes.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { ProfessionalInformation } from "@/interfaces";
import { API_BASE_URL } from "@/lib/constants.api";

export function useProfessionalIncludes() {
  const [data, setData] = useState<ProfessionalInformation | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const fetchData = useCallback(async () => {
    const professionalId = Cookies.get("professional-id");
    const isDemoCookie = Cookies.get("isDemo") === "true";
    const token = Cookies.get("session-token");

    if (!professionalId || !token) {
      setError(new Error("Faltan cookies necesarias para la sesión"));
      setIsLoading(false);
      return;
    }

    const baseURL = isDemoCookie ? API_BASE_URL.demo : API_BASE_URL.prod;

    const endpoint = `/professional/get-professional/${professionalId}`;

    try {
      const response = await axios.get<ProfessionalInformation>(
        `${baseURL}${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsDemo(isDemoCookie);
      setData(response.data);
    } catch (err: any) {
      console.error("❌ Error al obtener información del profesional:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    appointments: data?.appointmentsIncluded ?? [],
    patients: data?.patientsIncluded ?? [],
    institutions: data?.institutionsIncluded ?? [],
    isLoading,
    isDemo,
    error,
    refetch: fetchData,
  };
}
