"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import { InstitutionsIncluded } from "@/interfaces";
import ConfigButton from "../../components/ConfigButton";

type Props = {
  institutionsIncluded: InstitutionsIncluded[];
  isDemo: boolean;
};
export default function InstitutionCardWithActions({
  institutionsIncluded,
  isDemo,
}: Props) {
  return (
    <>
      {/* Header */}
      <div className="w-full px-2 flex items-center justify-between border-b border-gray-300 text-gray-900 font-medium text-sm mb-3 max-w-full overflow-x-hidden">
        <p className="w-[25%] max-[690px]:w-[30%]">Institución</p>
        <p className="w-[25%] max-[690px]:w-[50%]">Teléfono</p>
        <p className="w-[25%] max-[690px]:hidden">Mail</p>
        <p className="w-[25%] max-[690px]:hidden">Dirección</p>
      </div>

      {/* Lista de instituciones */}
      <div className="w-full space-y-2 max-w-full overflow-x-hidden">
        {institutionsIncluded?.map(({ institution }) => (
          <div
            key={institution.id}
            className="relative w-full p-2 flex items-center justify-between border border-gray-300 rounded-md hover:bg-gray-200 hover:shadow transition group overflow-x-hidden"
          >
            <Link
              href={
                isDemo
                  ? `/professional/institutions/${institution.id}/detail?demo=true`
                  : `/professional/institutions/${institution.id}/detail`
              }
              className="flex flex-1 items-center justify-between gap-2"
            >
              {/* Nombre + Imagen */}
              <div className="w-[25%] max-[690px]:w-[30%] flex gap-2 items-center overflow-hidden">
                <Image
                  src={institution.institutionImage}
                  alt={`Logo de ${institution.name}`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover bg-gradient-to-b from-black to-[#001E80]"
                />
                <p className="text-[14px] font-semibold truncate">
                  {institution.name}
                </p>
              </div>

              {/* Teléfono */}
              <div className="w-[25%] max-[690px]:w-[50%] flex gap-1 items-center text-[14px] font-normal px-1 overflow-hidden">
                <Phone width={18} height={18} />
                <p className="truncate">{institution.phone}</p>
              </div>

              {/* Email */}
              <div className="w-[25%] hidden max-[690px]:hidden md:flex gap-1 items-center text-[14px] font-normal px-1 overflow-hidden">
                <Mail width={18} height={18} />
                <p className="truncate">{institution.email}</p>
              </div>

              {/* Dirección */}
              <div className="w-[25%] hidden max-[690px]:hidden md:block text-[14px] font-normal px-1 truncate">
                {institution.address}
              </div>
            </Link>

            {/* Botón de configuración */}
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <ConfigButton
                id={institution.id}
                isDemo={isDemo}
                component="institutions"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
