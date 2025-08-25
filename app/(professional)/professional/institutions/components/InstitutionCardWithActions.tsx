"use client";

import { toast } from "@/hooks/use-toast";
import { ICreateInstitution, InstitutionsIncluded } from "@/interfaces";
import ConfigButton from "../../components/ConfigButton";
import { InstitutionCard } from "./InstitutionCard";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";
import { useState } from "react";
import { AnimatedDialog } from "./AnimatedDialog";
import InstitutionUpdateForm from "@/components/forms/InstitutionUpdateForm";
import { Button } from "@/components/ui/button";
import InstitutionRegisterForm from "@/components/forms/InstitutionRegisterForm";
import Link from "next/link";

type Props = {
  isDemo: boolean;
  institutionsIncluded: InstitutionsIncluded[];
  showFloatingButton?: boolean;
};
export default function InstitutionCardWithActions({
  institutionsIncluded,
  isDemo,
  showFloatingButton = true,
}: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [institution, setInstitution] = useState<ICreateInstitution | null>(
    null
  );
  const [selectedInstitution, setSelectedInstitution] =
    useState<Partial<ICreateInstitution> | null>(null);
  const { data, institutions, isLoading, refetch } = useProfessionalIncludes();
  return (
    <>
      {/* Lista de instituciones */}
      <div className="w-full space-y-2 max-w-full overflow-x-hidden">
        {institutionsIncluded?.map(({ institution }) => (
          <InstitutionCard
            key={institution.id}
            institution={institution}
            onEdit={() => setSelectedInstitution(institution)}
            onDelete={refetch}
            professionalId={data?.id || ""}
            isDemo={isDemo}
          />
        ))}
      </div>
      {/* ➕ Botón flotante */}
      {showFloatingButton && (
        <div className="fixed bottom-6 right-10 z-50">
          <Button
            onClick={() => {
              setFormOpen(true);
              setSelectedInstitution(null);
            }}
            className="rounded-full shadow-xl h-14 w-14 p-0 text-xl"
          >
            +
          </Button>
        </div>
      )}

      {/* Modal de edición */}
      {formOpen && institution && (
        <AnimatedDialog open={formOpen} onOpenChange={setFormOpen}>
          <InstitutionUpdateForm
            institutionInfo={institution}
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
      {formOpen && (
        <AnimatedDialog open={formOpen} onOpenChange={setFormOpen}>
          <InstitutionRegisterForm
            selectedInstitution={selectedInstitution}
            onSuccess={() => {
              toast({
                title: isDemo ? "Registro simulado" : "Institución registrada",
                description: isDemo
                  ? "Este es un entorno de prueba"
                  : "Institución registrada correctamente!",
                className: isDemo
                  ? "bg-blue-500 text-white"
                  : "bg-green-500 text-white",
              });
              setFormOpen(false);

              refetch();
            }}
            onClose={() => {
              setFormOpen(false);
              setSelectedInstitution(null);
            }}
          />
        </AnimatedDialog>
      )}
    </>
  );
}
