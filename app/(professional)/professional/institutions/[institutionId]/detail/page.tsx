"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Mail, Phone, Globe, MapPin } from "lucide-react";

import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";

const InstitutionDetail = () => {
  const { institutionId } = useParams<{ institutionId: string }>();
  const { institutions } = useProfessionalIncludes();

  const institution = useMemo(
    () => institutions.find(({ institution }) => institution.id === institutionId)?.institution,
    [institutions, institutionId]
  );

  if (!institution) {
    return (
      <section className="w-full bg-gray-50 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 text-center">
          <p className="text-red-600 font-semibold text-lg">
            No se pudo cargar la información de la institución.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-50 min-h-screen flex flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header con imagen contenida */}
        <div className=" w-full h-[200px] sm:h-[240px] md:h-[280px] rounded-2xl overflow-hidden shadow-2xl mx-auto">
          <Image
            src={institution.institutionImage || "/fallback-image.jpg"}
            alt={`${institution.name} image`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABgj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA="
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-white truncate drop-shadow-lg">
              {institution.name}
            </h1>
          </div>
        </div>

        {/* Sección de detalles */}
        <div className="bg-white w-full rounded-2xl shadow-xl p-6 md:p-8 flex flex-col gap-6 transition-shadow duration-300 hover:shadow-2xl">
          <h2 className="text-xl font-semibold text-gray-800">Información de Contacto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <MapPin size={20} className="text-gray-600 mt-1 flex-shrink-0" />
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600">Dirección</label>
                <p className="text-gray-800 text-base truncate">
                  {institution.address || "No disponible"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <Mail size={20} className="text-gray-600 mt-1 flex-shrink-0" />
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600">Email</label>
                <a
                  href={`mailto:${institution.email}`}
                  className="text-blue-600 text-base hover:underline truncate"
                >
                  {institution.email || "No disponible"}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <Phone size={20} className="text-gray-600 mt-1 flex-shrink-0" />
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600">Teléfono</label>
                <a
                  href={`tel:${institution.phone}`}
                  className="text-blue-600 text-base hover:underline truncate"
                >
                  {institution.phone || "No disponible"}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <Globe size={20} className="text-gray-600 mt-1 flex-shrink-0" />
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600">Sitio Web</label>
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