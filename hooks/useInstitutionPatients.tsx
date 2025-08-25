import { useState, useEffect, useCallback } from "react";
import { useProfessionalIncludes } from "./useProfessionalIncludes";
import { API_BASE_URL } from "@/lib/constants.api";
import axios from "axios";
import { ICreateInstitution } from "@/interfaces";

type Patient = {
  id: string;
  name: string;
  email: string;
};
type InstitutionResponse = ICreateInstitution & { patients: Patient[] };

export function useInstitutionPatients(institutionId: string) {
  const { patients: allPatients } = useProfessionalIncludes();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<InstitutionResponse>(
        `${API_BASE_URL.prod}/institutions/get-institution/${institutionId}`
      );
      setPatients(data.patients || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [institutionId]);

  const addPatient = useCallback(
    async (patientId: string) => {
      try {
        await axios.post(
          `${API_BASE_URL.prod}/institutions/${institutionId}/patients`,
          { patientId },
          { headers: { "Content-Type": "application/json" } }
        );
        // Refetch después de agregar
        await fetchPatients();
      } catch (err: any) {
        setError(err.message);
      }
    },
    [institutionId, fetchPatients]
  );

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return { patients, allPatients, loading, error, addPatient };
}
