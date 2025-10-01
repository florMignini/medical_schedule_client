"use client";

import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { ICreateInstitution } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";
import { motion, AnimatePresence } from "framer-motion";

import InstitutionUpdateForm from "@/components/forms/InstitutionUpdateForm";
import InstitutionRegisterForm from "@/components/forms/InstitutionRegisterForm";
import { InstitutionCard } from "./InstitutionCard";

type Props = {
  isDemo: boolean;
  showFloatingButton?: boolean;
};

type ModalMode = "create" | "edit" | null;

export default function InstitutionCardWithActions({
  isDemo,
  showFloatingButton = true,
}: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedInstitution, setSelectedInstitution] =
    useState<Partial<ICreateInstitution> | null>(null);

  // Traemos directamente la data del hook
  const { data, refetch } = useProfessionalIncludes();
  const institutionsIncluded = data?.institutionsIncluded || [];

  // Refetch envuelto en useCallback
  const handleRefetch = useCallback(async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Error al refetchear instituciones:", err);
    }
  }, [refetch]);

  const handleOpenCreate = () => {
    setSelectedInstitution(null);
    setModalMode("create");
    setFormOpen(true);
  };

  const handleOpenEdit = (institution: ICreateInstitution) => {
    setSelectedInstitution(institution);
    setModalMode("edit");
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setModalMode(null);
    setSelectedInstitution(null);
  };

  const handleSuccess = async (action: "create" | "edit") => {
    toast({
      title:
        action === "edit"
          ? isDemo
            ? "Edición simulada"
            : "Institución actualizada"
          : isDemo
          ? "Registro simulado"
          : "Institución registrada",
      description:
        action === "edit"
          ? isDemo
            ? "Este es un entorno de prueba"
            : "¡Institución editada correctamente!"
          : isDemo
          ? "Este es un entorno de prueba"
          : "¡Institución registrada correctamente!",
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
      {/* Lista de instituciones */}
      <div className="w-full space-y-2 max-w-full overflow-x-hidden">
        {institutionsIncluded.map(({ institution }) => (
          <InstitutionCard
            key={institution.id}
            institution={institution}
            onEdit={() => handleOpenEdit(institution)}
            onDelete={handleRefetch} // refetch directo
            professionalId={data?.id || ""}
            isDemo={isDemo}
          />
        ))}
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

      {/* Slide modal */}
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
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-transparent z-10 py-2">
              <h2 className="text-xl font-semibold text-gray-800">
                {modalMode === "edit" ? "Editar institución" : "Crear nueva institución"}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 border-[1px] border-gray-400 rounded-lg py-1 overflow-y-auto">
              {modalMode === "edit" && selectedInstitution ? (
                <InstitutionUpdateForm
                  institutionInfo={selectedInstitution}
                  onClose={handleClose}
                  onSuccess={() => handleSuccess("edit")}
                />
              ) : (
                <InstitutionRegisterForm
                  selectedInstitution={selectedInstitution}
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
