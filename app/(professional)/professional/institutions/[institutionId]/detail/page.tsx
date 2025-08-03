"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";

import { Mail, Phone, Globe } from "lucide-react";
import Loading from "../../../components/Loading";

const InstitutionDetail = () => {
  const { institutionId } = useParams<{ institutionId: string }>();
  const searchParams = useSearchParams();
  const isDemo = searchParams?.get("demo") === "true";

  const [institutionInfo, setInstitutionInfo] = useState<any>();
  const [loading, setLoading] = useState(true);

  const BASE_URL = isDemo
    ? "https://medical-schedule-server-demo.onrender.com/api"
    : process.env.NEXT_PUBLIC_API_BASE_URL || "https://medical-schedule-server.onrender.com/api";

  useEffect(() => {
    async function fetchInstitutionInfo() {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/institutions/get-institution/${institutionId}`
        );
        setInstitutionInfo(data);
      } catch (error) {
        console.error("Error al obtener la institución:", error);
      } finally {
        setLoading(false);
      }
    }

    if (institutionId) fetchInstitutionInfo();
  }, [institutionId, BASE_URL]);

  if (loading) return <Loading />;

  return (
    <section className="w-full bg-white min-h-screen flex flex-col items-center justify-start gap-4 px-2 py-4">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        {/* Header con imagen y nombre */}
        <div className="relative w-full h-[220px] sm:h-[300px] md:h-[360px] rounded-lg overflow-hidden shadow-md">
          <Image
            src={institutionInfo.institutionImage}
            alt="institution-image"
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute bottom-4 left-4 bg-white/80 px-4 py-2 rounded-xl shadow text-gray-800">
            <h1 className="font-extrabold text-3xl sm:text-4xl truncate">
              {institutionInfo.name}
            </h1>
          </div>
        </div>

        {/* Detalles */}
        <div className="bg-white w-full rounded-xl shadow-lg p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Dirección</label>
              <input
                type="text"
                value={institutionInfo.address}
                disabled
                className="border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-800"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Email</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md bg-gray-100 p-2">
                <Mail size={16} />
                <p className="text-sm text-gray-800 truncate">{institutionInfo.email}</p>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Teléfono</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md bg-gray-100 p-2">
                <Phone size={16} />
                <p className="text-sm text-gray-800 truncate">{institutionInfo.phone}</p>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Sitio Web</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md bg-gray-100 p-2">
                <Globe size={16} />
                <p className="text-sm text-gray-800 truncate">{institutionInfo.website}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstitutionDetail;
