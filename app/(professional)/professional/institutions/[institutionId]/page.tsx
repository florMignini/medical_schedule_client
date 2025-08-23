"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { InstitutionHeader } from "../components/InstitutionHeader";
import { InstitutionTabs } from "../components/InstitutionTabs";

import { useInstitution } from "@/hooks/useInstitution";

export default function InstitutionDetailPage() {
  const { institutionId } = useParams<{ institutionId: string }>();
  const { institution, loading, error } = useInstitution(institutionId);

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-100 px-4 py-6">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          <Skeleton className="h-[300px] w-full rounded-2xl" />
          <Skeleton className="h-6 w-3/5 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-10 w-1/2 rounded" />
        </div>
      </section>
    );
  }

  if (error || !institution) {
    return (
      <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-red-600 font-medium text-lg mb-4">
            {error || "No se encontró la institución"}
          </p>
          <Link
            href="/institutions"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a la lista de instituciones
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <InstitutionHeader institution={institution} />

        {/* Info general */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-900">Detalles de la Institución</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-sm font-medium text-gray-600">Dirección</span>
              <p className="text-gray-800 text-base">{institution.address || "No disponible"}</p>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-sm font-medium text-gray-600">Email</span>
              <a href={`mailto:${institution.email}`} className="text-blue-600 text-base hover:underline truncate">
                {institution.email || "No disponible"}
              </a>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-sm font-medium text-gray-600">Teléfono</span>
              <a href={`tel:${institution.phone}`} className="text-blue-600 text-base hover:underline truncate">
                {institution.phone || "No disponible"}
              </a>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-sm font-medium text-gray-600">Sitio Web</span>
              <a href={institution.website || "#"} target="_blank" className="text-blue-600 text-base hover:underline truncate">
                {institution.website || "No disponible"}
              </a>
            </div>
          </div>
        </div>

        {/* Tabs y secciones extra */}
        <InstitutionTabs institutionId={institutionId} />

        {/* Placeholder para futuras secciones */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Profesionales / Archivos / Turnos</h2>
          <p className="text-gray-600">Aquí podrás agregar más componentes según tu flujo.</p>
        </div>
      </div>
    </section>
  );
}
