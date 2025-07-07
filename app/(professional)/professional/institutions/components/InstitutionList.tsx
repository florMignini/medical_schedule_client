"use client";
import { useState } from "react";
import { ICreateInstitution, InstitutionsIncluded } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDebounce } from "../hooks/useDebounce";
import { useProfessionalInstitutions } from "@/hooks/useProfessionalInstitutions";
import InstitutionRegisterForm from "@/components/forms/InstitutionRegisterForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { InstitutionCard } from "./InstitutionCard";
import { useCurrentProfessional } from "@/hooks/useCurrentProfessional";
import { InstitutionSkeletonCard } from "./InstitutionSkeletonCard";

export function InstitutionList() {
  const [search, setSearch] = useState("");

  const { data, institutions, isLoading, refetch } =
    useProfessionalInstitutions();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] =
    useState<Partial<ICreateInstitution> | null>(null);
  const router = useRouter();

  return (
    <div className="relative space-y-4">
      {/* 🔄 Loading */}
      {isLoading ? (
        <InstitutionSkeletonCard />
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {institutions?.length > 0 ? (
              institutions?.map(({ institution }: InstitutionsIncluded) => (
                <motion.div
                  key={institution.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <InstitutionCard
                    institution={institution}
                    onEdit={() => {
                      setSelectedInstitution(institution);
                      setFormOpen(true);
                    }}
                    onDelete={refetch}
                    professionalId={data?.id || ""}
                  />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center font-bold font-mono text-muted-foreground">
                Aún no posee instituciones registradas.
              </p>
            )}
          </div>
        </AnimatePresence>
      )}

      {/* ➕ Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => {
            setSelectedInstitution(null);
            setFormOpen(true);
          }}
          className="rounded-full shadow-xl h-14 w-14 p-0 text-xl"
        >
          +
        </Button>
      </div>

      {/* Mostrar modal/dialog con el formulario solo si formOpen === true */}
      {formOpen && (
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTitle className="text-lg font-semibold text-center">
            {selectedInstitution?.id
              ? "Editar Institución"
              : "Registrar Nueva Institución"}
          </DialogTitle>
          <DialogContent className="bg-white/50 glass-effect-vibrant backdrop:blur-lg w-full max-w-[90vw] lg:max-w-2xl xl:max-w-3xl max-h-[90vh] overflow-auto p-6 rounded-2xl">
            <InstitutionRegisterForm
              selectedInstitution={selectedInstitution}
              onClose={() => setFormOpen(false)}
              onSuccess={() => {
                refetch().then(() => {
                  toast({
                    title: selectedInstitution?.id
                      ? "Actualizando institución..."
                      : "Creando institución...",
                    description: selectedInstitution?.id
                      ? "Institución actualizada 🎉"
                      : "Institución creada 🎉",
                    duration: 3000,
                    className: "bg-green-500 text-white",
                  });
                });
                setFormOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
