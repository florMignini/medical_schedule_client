"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Mail, Phone, Globe, MapPin } from "lucide-react";

import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";

const InstitutionDetail = () => {
  const { institutionId } = useParams<{ institutionId: string }>();
  const { institutions, data, refetch } = useProfessionalIncludes();
const [selectedInstitution, setSelectedInstitution] = useState();
  const institution = useMemo(
    () =>
      institutions.find(({ institution }) => institution.id === institutionId)
        ?.institution,
    [institutions, institutionId]
  );

  if (!institution) {
    return (
      <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-red-600 font-medium text-lg">
            No se encontró información de la institución.
          </p>
          <a
            href="/"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header con imagen contenida */}
         <div className="relative w-full h-[300px] rounded-2xl overflow-hidden shadow-lg bg-gray-200">
         <Image
            src={institution.institutionImage || "/fallback-image.jpg"}
            alt={`${institution.name} imagen`}
            width={800}
            height={600}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            priority
          /> 

          {/* Gradiente encima de la imagen */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Título encima de todo */}
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white truncate drop-shadow-md">
              {institution.name || "Sin nombre"}
            </h1>
          </div>
        </div> 

        {/* Sección de detalles */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Detalles de la Institución
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <MapPin
                size={18}
                className="text-gray-500 mt-0.5 flex-shrink-0"
              />
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Dirección
                </span>
                <p className="text-gray-800 text-base">
                  {institution.address || "No disponible"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Mail size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-gray-600">Email</span>
                <a
                  href={`mailto:${institution.email}`}
                  className="text-blue-600 text-base hover:underline truncate"
                >
                  {institution.email || "No disponible"}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Phone size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Teléfono
                </span>
                <a
                  href={`tel:${institution.phone}`}
                  className="text-blue-600 text-base hover:underline truncate"
                >
                  {institution.phone || "No disponible"}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Globe size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Sitio Web
                </span>
                <a
                  href={institution.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-base hover:underline truncate"
                >
                  {institution.website || "No disponible"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstitutionDetail;
