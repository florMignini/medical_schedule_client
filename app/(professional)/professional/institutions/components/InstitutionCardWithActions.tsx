"use client";

import { toast } from "@/hooks/use-toast";
import { ICreateInstitution, InstitutionsIncluded } from "@/interfaces";
import ConfigButton from "../../components/ConfigButton";
import { InstitutionCard } from "./InstitutionCard";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";
import { useState } from "react";
import { AnimatedDialog } from "./AnimatedDialog";
import InstitutionUpdateForm from "@/components/forms/InstitutionUpdateForm";

type Props = {
  institutionsIncluded: InstitutionsIncluded[];
  isDemo: boolean;
};
export default function InstitutionCardWithActions({
  institutionsIncluded,
  isDemo,
}: Props) {
  const [formOpen, setFormOpen] = useState(false);
    const [institution, setInstitution] = useState<ICreateInstitution | null>(null);
    const [selectedInstitution, setSelectedInstitution] =
      useState<Partial<ICreateInstitution> | null>(null);
  const { data, isLoading, refetch } = useProfessionalIncludes();
  return (
    <>
      
      {/* Lista de instituciones */}
      <div className="w-full space-y-2 max-w-full overflow-x-hidden">
        {institutionsIncluded?.map(({ institution }) => (
          <InstitutionCard
            key={institution.id}
            institution={institution}
            onEdit={() => {
              setSelectedInstitution(institution);
              setFormOpen(true);
            }}
            onDelete={refetch}
            professionalId={data?.id || ""}
          />
        ))}
      </div>
      {/* Modal de edición */}
            {formOpen && institution && (
              <AnimatedDialog open={formOpen} onOpenChange={setFormOpen}>
                <InstitutionUpdateForm
                 institutionInfo ={institution}
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
