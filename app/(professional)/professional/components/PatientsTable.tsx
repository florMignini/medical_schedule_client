"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatedDialog } from "../institutions/components/AnimatedDialog";

import { Patient, PatientsIncluded } from "@/interfaces";

import PatientCard from "../patients/components/PatientCard";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";
import PatientProfileUpdateForm from "@/components/forms/PatientProfileUpdateForm";
import PatientRegistrationForm from "@/components/forms/PatientRegisterForm";

interface Props {
  patients: PatientsIncluded[];
  component?: string;
}

export default function PatientsTable({ patients, component }: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] =
    useState<Partial<Patient> | null>(null);

  const { toast } = useToast();
  let indexOfFirstPatient = 0;
  const patientsPerPage = 20;
  const totalPages = Math.ceil(patients.length / patientsPerPage);
  const indexOfLastPatient = currentPage * patientsPerPage;
  const currentPatients = patients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const handlePageChange = (page: number) => setCurrentPage(page);
  const { data, isLoading, refetch } = useProfessionalIncludes();
  return (
    <div className="relative space-y-4">
      {/* Tabla de pacientes */}
      <div className="w-full border rounded-lg shadow-md border-gray-300 p-2">
        {patients.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Aún no posee pacientes registrados.
          </p>
        ) : (
          <div className="w-full">
            <AnimatePresence>
              <div className="space-y-2">
                {currentPatients.map(({ patient }) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onEdit={() => {
                      setSelectedPatient(patient);
                      setFormOpen(true);
                    }}
                    onDelete={refetch}
                    professionalId={data?.id || ""}
                  />
                ))}
              </div>
            </AnimatePresence>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 py-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
            >
              Anterior
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                variant={currentPage === i + 1 ? "default" : "outline"}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>

      {/* ➕ Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => {
            setFormOpen(true);
            setSelectedPatient(null); // para agregar nuevo
          }}
          className="rounded-full shadow-xl h-14 w-14 p-0 text-xl"
        >
          +
        </Button>
      </div>

      {/* Modal con formulario de paciente */}
      {formOpen && (
        <AnimatedDialog open={formOpen} onOpenChange={setFormOpen}>
          <ScrollArea className="h-[90vh] w-full px-2">
            {selectedPatient ? (
              <PatientProfileUpdateForm
                selectedPatient={selectedPatient}
                onClose={() => {
                  setFormOpen(false);
                  setSelectedPatient(null);
                }}
                onSuccess={() => {
                  toast({
                    title: "Paciente actualizado",
                    description: "Cambios guardados correctamente ✅",
                    className: "bg-green-500 text-white",
                    duration: 3000,
                  });
                  setFormOpen(false);
                }}
              />
            ) : (
              <PatientRegistrationForm
                onClose={() => setFormOpen(false)}
                onSuccess={() => {
                  toast({
                    title: "Paciente agregado",
                    description: "¡Éxito!",
                    className: "bg-green-500 text-white",
                    duration: 3000,
                  });
                  setFormOpen(false);
                }}
              />
            )}
          </ScrollArea>
        </AnimatedDialog>
      )}
    </div>
  );
}
