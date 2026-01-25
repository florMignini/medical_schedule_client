"use client";

import Image from "next/image";
import { Patient } from "@/interfaces";
import { cn } from "@/lib/utils";
import { InfoItem } from "../../components";

type Props = {
  patient: Patient;
};

export default function PatientHeaderCard({ patient }: Props) {
  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row items-center justify-center",
        "bg-[#262626] rounded-xl",
        " rounded-2xl shadow-md p-4 sm:p-6 gap-4 sm:gap-6"
      )}
    >
      {/* patient profile pic */}
      <div className="flex items-center justify-center w-[30%]">
        <Image
          src={patient.patientPhotoUrl}
          alt={`Foto de ${patient.firstName}`}
          width={100}
          height={100}
          className="rounded-full border-4 border-white shadow-lg object-cover bg-gray-200"
        />
      </div>

      {/* patient info */}
      <div className="w-[70%] flex flex-col gap-3 text-white">
        
          <h2 className="flex text-xl sm:text-2xl font-bold  dark:text-white">
          {patient.firstName} {patient.lastName}
        </h2>
        <p className="flex text-sm sm:text-base dark:text-gray-300 gap-2">
          <strong>{patient.identificationType} : </strong>{" "}
          <p> {patient.identityNumber}</p>
        </p>
  
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <InfoItem label="Email" value={patient.email} />
                      <InfoItem label="Teléfono" value={patient.phone} />
                      <InfoItem label="Dirección" value={patient.address} />
        </div>
      </div>
    </div>
  );
}
