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
import PatientCard from "./PatientCard";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";

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
  const [selectedPatient, setSelectedPatient] =
    useState<Partial<Patient> | null>(null);
  const { data, isLoading, refetch } = useProfessionalIncludes();
  return (
    <>
      {/* Pacientes */}
      <div className="w-full space-y-4 max-w-full overflow-x-hidden">
        {patientsIncluded?.map(({ patient }) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onEdit={() => setSelectedPatient(patient)}
            onDelete={refetch}
            professionalId={data?.id || ""}
            isDemo={isDemo}
          />
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
