"use client";

import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { ICreateInstitution } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";
import { AnimatedDialog } from "./AnimatedDialog";

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
    await handleRefetch(); // refetch garantiza que la lista se actualice
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

      {/* Modal único */}
      {formOpen && (
        <AnimatedDialog open={formOpen} onOpenChange={setFormOpen}>
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
        </AnimatedDialog>
      )}
    </>
  );
}
