"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PatientInfo from "../../components/PatientInfo";
import { Patient } from "@/interfaces";
import { API_BASE_URL } from "@/lib/constants.api";
import { Skeleton } from "../../../../../../components/ui/skeleton";

export default function PatientInfoWrapper({ isDemo }: { isDemo: boolean }) {
  const router = useRouter();
  const { patientId } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
  const apiBase = isDemo ? API_BASE_URL.demo : API_BASE_URL.prod;
  useEffect(() => {
    if (!patientId) return;

    const fetchPatient = async () => {
      try {
       
         const res = await fetch(
           `${apiBase}/patients/get-patient/${patientId}`,
           {
             cache: "no-store",
           }
         );
       
         if (!res.ok) throw new Error("Error fetching patient info");
       
         const data: Patient = await res.json();
         setPatient(data);
      } catch (error) {
        console.error("Error fetching patient:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId, apiBase, setPatient, patient]);

  if (loading) {
    return (
      <section className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-8 space-y-6">
        {/* Skeleton que imita PatientHeaderCard */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-24 h-24 rounded-full" /> {/* Foto */}
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-1/3" /> {/* Nombre */}
            <Skeleton className="h-4 w-1/4" /> {/* Edad o dato extra */}
            <Skeleton className="h-4 w-1/2" /> {/* Otra info */}
          </div>
        </div>

        {/* Skeleton para barra de acciones */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Skeleton para tabs */}
        <div className="flex gap-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-28" />
        </div>

        {/* Skeleton para contenido principal */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </section>
    );
  }

  if (error || !patient) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6 text-gray-300">
        <p className="text-lg font-semibold text-red-400">
          No se encontró el paciente
        </p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg border border-gray-500 hover:bg-gray-700 transition-all"
        >
          Volver
        </button>
      </div>
    );
  }

  return <PatientInfo patient={patient} isDemo={isDemo} />;
}
