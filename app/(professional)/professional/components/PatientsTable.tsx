"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatedDialog } from "../institutions/components/AnimatedDialog"; // Usa este wrapper como en InstitutionList
import PatientRegistrationForm from "@/components/forms/PatientRegisterForm";
import { PatientsIncluded } from "@/interfaces";
import ConfigButton from "./ConfigButton";
import Phone from "./icons/Phone";
import Mail from "./icons/Mail";
import User from "./icons/User";

interface Props {
  patients: PatientsIncluded[];
  component?: string; // Para manejar diferentes contextos si es necesario
}

export default function PatientsTable({ patients, component }: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null); // Por si querés editar después

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

  return (
    <div className="relative space-y-4">
      {/* Tabla de pacientes */}
      <div className="w-full border rounded-lg shadow-md border-gray-300 p-2">
        <div className="mx-auto mb-2 px-2">
          <h2 className="text-xl font-semibold text-gray-800">Pacientes</h2>
        </div>

        {patients.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Aún no posee pacientes registrados.
          </p>
        ) : (
          <div className="w-full">
            <AnimatePresence>
              <div className="space-y-2">
                {currentPatients.map(({ patient }) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between rounded-md border p-2 hover:shadow-md transition-shadow"
                  >
                    <Link
                      href={`/professional/patients/${patient.id}/info`}
                      className="flex items-center gap-3 w-full"
                    >
                      <Image
                        src={patient.patientPhotoUrl}
                        alt="Foto de paciente"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{`${patient.firstName} ${patient.lastName}`}</p>
                        <div className="text-xs text-muted-foreground flex gap-3">
                          <span className="flex items-center gap-1">
                            <Phone width={14} height={14} /> {patient.phone}
                          </span>
                          <span className="items-center gap-1 hidden sm:flex">
                            <Mail width={14} height={14} /> {patient.email}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <ConfigButton id={patient.id} component="patients" />
                  </motion.div>
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
          <PatientRegistrationForm
            selectedPatient={selectedPatient}
            onClose={() => setFormOpen(false)}
            onSuccess={() => {
              toast({
                title: selectedPatient
                  ? "Paciente actualizado"
                  : "Paciente agregado",
                description: "¡Éxito!",
                className: "bg-green-500 text-white",
                duration: 3000,
              });
              setFormOpen(false);
            }}
          />
        </AnimatedDialog>
      )}
    </div>
  );
}
