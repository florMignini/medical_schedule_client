"use client";

import { useState, useEffect } from "react";
import { ICreateInstitution } from "@/interfaces";
import { getInstitutionById } from "@/app/actions";

interface UseInstitutionReturn {
  institution: ICreateInstitution | null;
  loading: boolean;
  error: string | null;
}

const cache: Record<string, ICreateInstitution> = {};

export function useInstitution(institutionId: string): UseInstitutionReturn {
  const [institution, setInstitution] = useState<ICreateInstitution | null>(
    cache[institutionId] || null
  );
  const [loading, setLoading] = useState(!cache[institutionId]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!institutionId) return;

    // Si ya está en cache, usamos directamente
    if (cache[institutionId]) {
      setInstitution(cache[institutionId]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getInstitutionById(institutionId)
      .then((data) => {
        if (!data) throw new Error("Institución no encontrada");
        cache[institutionId] = data; // guardamos en cache
        setInstitution(data);
      })
      .catch((err: any) => setError(err.message || "Error al cargar la institución"))
      .finally(() => setLoading(false));
  }, [institutionId]);

  return { institution, loading, error };
}
