"use client";
import React, { useEffect, useState } from "react";
import { apiServer } from "@/api/api-server";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FormLabel } from "@/components";


const InstitutionDetail = () => {
  const { institutionId } = useParams<{ institutionId: string }>();
  const [institutionInfo, setInstitutionInfo] = useState<any>();

  useEffect(() => {
    async function fetchInstitutionInfo() {
      try {
        let { data } = await apiServer.get(
          `/institutions/get-institution/${institutionId}`
        );
        setInstitutionInfo(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchInstitutionInfo();
  }, [institutionId]);
 
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center gap-2">
      <div className="container">
        {institutionInfo && (
          <>
          {/* upper section */}
            <div className="w-full h-[210px] min-[400px]:h-[275px] sm:h-[350px] relative left-0 md:left-[10%] ">
              {/* institution image */}
              <Image
                src={institutionInfo?.institutionImage}
                alt="institution-image"
                width={600}
                height={300}
                className="absolute rounded-lg z-10 opacity-75 "
              />
              {/* Institution name */}
              <div className="flex items-center w-full left-0 sm:left-5 bottom-0 min-[400px]:bottom-8 sm:bottom-0 absolute truncate">
                <h1 className="font-extrabold text-4xl sm:text-5xl bg-gradient-to-b from-white via-[#5a8bbd] to-black text-transparent bg-clip-text z-20">
                  {institutionInfo?.name}
                </h1>
              </div>
            </div>
            {/* down form section */}
            <div className="w-[100%] mx-auto flex p-2 bg-white shadow-[inset_0px_-2px_3px_rgba(73,73,73,0.2)] rounded-lg mt-0 min-[400px]:mt-10 sm:mt-5">
              <div className="flex flex-wrap items-start justify-start py-5 px-3 gap-3">
                <div className="flex flex-col rounded-md ">
                  <label className="shad-input-label text-14-regular text-dark-700 truncate">Direccion</label>
                  <input
                  className="shad-input border-0 px-1 py-2 rounded-md"
                  type="text"
                  value={institutionInfo?.address}
                  disabled
                  />
                </div>
                <div className="flex flex-col rounded-md ">
                  <label className="shad-input-label text-14-regular text-dark-700 truncate">Email</label>
                  <input
                  className="shad-input border-0 px-1 py-2 rounded-md"
                  type="text"
                  value={institutionInfo?.email}
                  disabled
                  />
                </div>
                <div className="flex flex-col rounded-md ">
                  <label className="shad-input-label text-14-regular text-dark-700 truncate">Telefono</label>
                  <input
                  className="shad-input border-0 px-1 py-2 rounded-md"
                  type="text"
                  value={institutionInfo?.phone}
                  disabled
                  />
                </div>
                <div className="flex flex-col rounded-md  mt-2">
                  <label className="shad-input-label text-14-regular text-dark-700 truncate">Sitio web</label>
                  <input
                  className="shad-input border-0 px-1 py-2 rounded-md"
                  type="text"
                  value={institutionInfo?.website}
                  disabled
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default InstitutionDetail;
