"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";
import { ProfessionalInformation } from "@/interfaces";

export function useProfessionalInstitutions() {
  const [professionalId, setProfessionalId] = useState<string | null>(null);

  useEffect(() => {
    const id = Cookies.get("professional-id") || null;
    setProfessionalId(id);
  }, []);

  const { data, error, isLoading, mutate } = useSWR<ProfessionalInformation>(
    professionalId ? `/professional/get-professional/${professionalId}` : null,
    (url) =>
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Error fetching professional");
          return res.json();
        })
        .catch((e) => {
          console.error(e);
          return null;
        }),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    institutions: data?.institutionsIncluded ?? [],
    error,
    isLoading,
    mutate,
  };
}
