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
import { Button } from "@/components/ui/button";
import PatientRegistrationForm from "@/components/forms/PatientRegisterForm";

type Props = {
  isDemo: boolean;
  patientsIncluded: PatientsIncluded[];
  showFloatingButton?: boolean;
};

export default function PatientCardWithActions({
  patientsIncluded,
  isDemo,
  showFloatingButton = true,
}: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] =
    useState<Partial<Patient> | null>(null);
  const { data, isLoading, refetch } = useProfessionalIncludes();
  console.log("Selected Patient:", selectedPatient);
  console.log("formOpen:", formOpen);

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
        {/* ➕ Botón flotante */}
        {showFloatingButton && (
          <div className="fixed bottom-6 right-10 z-50">
            <Button
              onClick={() => {
                setFormOpen(true);
                setSelectedPatient(null);
              }}
              className="rounded-full shadow-xl h-14 w-14 p-0 text-xl"
            >
              +
            </Button>
          </div>
        )}
      </div>
      {/* Modal de edición */}
      {formOpen && patient && (
        <AnimatedDialog open={formOpen} onOpenChange={setFormOpen}>
          <PatientProfileUpdateForm
            selectedPatient={selectedPatient}
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
      {/* Modal de registro */}
      {formOpen && (
        <AnimatedDialog open={formOpen} onOpenChange={setFormOpen}>
          <PatientRegistrationForm
            onClose={() => setFormOpen(false)}
            onSuccess={() => {
              toast({
                title: isDemo ? "Creación simulada" : "Paciente creado",
                description: isDemo
                  ? "Este es un entorno de prueba"
                  : "¡Paciente creado correctamente!",
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
