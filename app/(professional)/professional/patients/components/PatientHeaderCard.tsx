"use client";

import Image from "next/image";
import { Patient } from "@/interfaces";
import { cn } from "@/lib/utils";

type Props = {
  patient: Patient;
};

export default function PatientHeaderCard({ patient }: Props) {
  return (
    <div
      className={cn(
        "w-full flex flex-col sm:flex-row items-center justify-between",
        "bg-gradient-to-r from-sky-50 via-white to-emerald-50",
        "dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
        "rounded-2xl shadow-md p-4 sm:p-6 gap-4 sm:gap-6"
      )}
    >
      {/* patient profile pic */}
      <div className="flex-shrink-0">
        <Image
          src={patient.patientPhotoUrl}
          alt={`Foto de ${patient.firstName}`}
          width={100}
          height={100}
          className="rounded-full border-4 border-white shadow-lg object-cover bg-gray-200"
        />
      </div>

      {/* patient info */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          {patient.firstName} {patient.lastName}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          <strong>{patient.identificationType}:</strong>{" "}
          {patient.identityNumber}
        </p>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 italic">
          ID: {patient.id}
        </p>
      </div>
    </div>
  );
}
