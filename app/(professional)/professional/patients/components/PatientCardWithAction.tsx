"use client";

import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { Patient } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";
import { AnimatedDialog } from "../../institutions/components/AnimatedDialog";

import PatientProfileUpdateForm from "@/components/forms/PatientProfileUpdateForm";
import PatientRegistrationForm from "@/components/forms/PatientRegisterForm";
import PatientCard from "./PatientCard";

type Props = {
  isDemo: boolean;
  showFloatingButton?: boolean;
};

type ModalMode = "create" | "edit" | null;

export default function PatientCardWithActions({
  isDemo,
  showFloatingButton = true,
}: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedPatient, setSelectedPatient] = useState<Partial<Patient> | null>(null);
  // Traemos directamente los pacientes del hook
  const { data, refetch } = useProfessionalIncludes();
  const patientsIncluded = data?.patientsIncluded || [];
console.log("Patient card with actions", data);
  // Refetch envuelto en useCallback
  const handleRefetch = useCallback(async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Error al refetchear pacientes:", err);
    }
  }, [refetch]);

  const handleOpenCreate = () => {
    setSelectedPatient(null);
    setModalMode("create");
    setFormOpen(true);
  };

  const handleOpenEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalMode("edit");
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setModalMode(null);
    setSelectedPatient(null);
  };

  const handleSuccess = async (action: "create" | "edit") => {
    toast({
      title:
        action === "edit"
          ? isDemo
            ? "Edición simulada"
            : "Paciente actualizado"
          : isDemo
          ? "Creación simulada"
          : "Paciente creado",
      description:
        action === "edit"
          ? isDemo
            ? "Este es un entorno de prueba"
            : "¡Paciente editado correctamente!"
          : isDemo
          ? "Este es un entorno de prueba"
          : "¡Paciente creado correctamente!",
      className:
        action === "edit"
          ? isDemo
            ? "bg-blue-500 text-white"
            : "bg-green-500 text-white"
          : isDemo
          ? "bg-blue-500 text-white"
          : "bg-green-500 text-white",
    });

    handleClose();
    await handleRefetch();
  };

  return (
    <>
      {/* Lista de pacientes */}
      <div className="w-full space-y-4 max-w-full overflow-x-hidden">
        {patientsIncluded.length > 0 ? (
          patientsIncluded.map(({ patient }) => (

            !patient ? null : (
              <PatientCard
              key={patient.id}
              patient={patient}
              onEdit={() => handleOpenEdit(patient)}
              onDelete={handleRefetch} // refetch directo
              professionalId={data?.id || ""}
              isDemo={isDemo}
            />
          )))
        ) : (
          <p className="text-center text-muted-foreground">
            Aún no posee pacientes en su lista
          </p>
        )}
      </div>

      {/* ➕ Botón flotante */}
      {showFloatingButton && (
        <div className="fixed bottom-6 right-10 z-50">
          <Button
            onClick={handleOpenCreate}
            className="rounded-full shadow-xl h-14 w-14 p-0 text-xl"
          >
            +
          </Button>
        </div>
      )}

      {/* Modal único */}
      {formOpen && (
        <AnimatedDialog open={formOpen} onOpenChange={setFormOpen}>
          {modalMode === "edit" && selectedPatient ? (
            <PatientProfileUpdateForm
              selectedPatient={selectedPatient}
              onClose={handleClose}
              onSuccess={() => handleSuccess("edit")}
            />
          ) : (
            <PatientRegistrationForm
              selectedPatient={selectedPatient}
              onClose={handleClose}
              onSuccess={() => handleSuccess("create")}
            />
          )}
        </AnimatedDialog>
      )}
    </>
  );
}
