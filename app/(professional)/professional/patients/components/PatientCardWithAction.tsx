"use client";

import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { Patient } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";
import { AnimatePresence, motion } from "framer-motion";

import PatientProfileUpdateForm from "@/components/forms/PatientProfileUpdateForm";
import PatientRegistrationForm from "@/components/forms/PatientRegisterForm";
import PatientCard from "./PatientCard";
import { Skeleton } from "@/components/ui/skeleton";

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

  const { data, refetch } = useProfessionalIncludes();
  const patientsIncluded = data?.patientsIncluded || [];

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
          patientsIncluded.map(({ patient }) =>
            !patient ? null : (
              <PatientCard
                key={patient.id}
                patient={patient}
                onEdit={() => handleOpenEdit(patient)}
                onDelete={handleRefetch}
                professionalId={data?.id || ""}
                isDemo={isDemo}
              />
            )
          )
        ) : (
          <>
          <Skeleton className="h-14 w-full bg-gray-100 border-[1px] border-gray-200 rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg bg-gray-100 border-[1px] border-gray-200" />
          <Skeleton className="h-14 w-full rounded-lg bg-gray-100 border-[1px] border-gray-200" />
          </>
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

      {/* Slide lateral */}
     <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              x: { type: "spring", stiffness: 90, damping: 20 },
              opacity: { duration: 0.3 },
              default: { ease: "easeInOut", duration: 0.6 },
            }}
            className={`fixed inset-y-0 right-0 z-50 flex flex-col bg-white p-6 overflow-y-auto rounded-l-2xl ${
              modalMode === "create" ? "w-[70%] min-w-[600px]" : "w-[50%] min-w-[500px]"
            }`}
          >
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-transparent z-10 py-1">
            <h2 className="text-xl font-semibold text-gray-800">
              {modalMode === "edit" ? "Editar paciente" : "Ingresar nuevo paciente"}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>
          </div>

          {/* Contenido del formulario */}
          <div className="flex-1 border-[1px] border-gray-300 rounded-lg overflow-y-auto p-1">
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
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
