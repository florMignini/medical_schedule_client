"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import { Patient, PatientsIncluded } from "@/interfaces";
import PatientProfileUpdateForm from "@/components/forms/PatientProfileUpdateForm";
import { toast } from "@/hooks/use-toast";
import ConfigButton from "../../components/ConfigButton";
import { AnimatedDialog } from "../../institutions/components/AnimatedDialog";

type Props = {
  isDemo: boolean;
  patientsIncluded: PatientsIncluded[];
};

export default function PatientCardWithActions({
  patientsIncluded,
  isDemo,
}: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);

  return (
    <>
      {/* Header */}
      <div className="w-full px-2 flex items-center justify-between border-b border-gray-300 text-gray-900 font-medium text-sm mb-3 max-w-full overflow-x-hidden">
        <p className="w-[25%] max-[690px]:w-[30%]">Paciente</p>
        <p className="w-[25%] max-[690px]:w-[50%]">Teléfono</p>
        <p className="w-[25%] max-[690px]:hidden">Mail</p>
        <p className="w-[25%] max-[690px]:hidden">Dirección</p>
      </div>

      {/* Pacientes */}
      <div className="w-full space-y-2 max-w-full overflow-x-hidden">
        {patientsIncluded?.map(({ patient }) => (
          <div
            key={patient.id}
            className="relative w-full p-2 flex items-center justify-between border border-gray-300 rounded-md hover:bg-gray-200 transition group overflow-x-hidden"
          >
            {/* Link card */}
            <Link
              href={`/professional/patients/${patient.id}`}
              className="flex flex-1 items-center justify-between gap-2"
            >
              {/* Nombre + foto */}
              <div className="w-[25%] max-[690px]:w-[30%] flex gap-2 items-center overflow-hidden">
                <Image
                  src={patient.patientPhotoUrl}
                  alt={`Foto de ${patient.firstName}`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover bg-gradient-to-b from-black to-[#001E80]"
                />
                <p className="text-[14px] font-semibold truncate">
                  {patient.firstName} {patient.lastName}
                </p>
              </div>

              {/* Teléfono */}
              <div className="w-[25%] max-[690px]:w-[50%] flex gap-1 items-center text-[14px] font-normal px-1 overflow-hidden">
                <Phone width={18} height={18} />
                <p className="truncate">{patient.phone}</p>
              </div>

              {/* Email */}
              <div className="w-[25%] hidden max-[690px]:hidden md:flex gap-1 items-center text-[14px] font-normal px-1 overflow-hidden">
                <Mail width={18} height={18} />
                <p className="truncate">{patient.email}</p>
              </div>

              {/* Dirección */}
              <div className="w-[25%] hidden max-[690px]:hidden md:block text-[14px] font-normal px-1 truncate">
                {patient.address}
              </div>
            </Link>

            {/* Botón de configuración */}
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <ConfigButton
                id={patient.id}
                isDemo={isDemo}
                component="patients"
                onEdit={() => {
                  setPatient(patient);
                  setFormOpen(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {formOpen && patient && (
        <AnimatedDialog open={formOpen} onOpenChange={setFormOpen}>
          <PatientProfileUpdateForm
            selectedPatient={patient}
            onClose={() => setFormOpen(false)}
            onSuccess={() => {
              toast({
                title: isDemo ? "Edición simulada" : "Paciente actualizado",
                description: isDemo
                  ? "Este es un entorno de prueba"
                  : "¡Paciente editado correctamente!",
                className: isDemo
                  ? "bg-blue-500 text-white"
                  : "bg-green-500 text-white",
              });
              setFormOpen(false);
            }}
          />
        </AnimatedDialog>
      )}
    </>
  );
}
