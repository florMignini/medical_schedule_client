"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { ICreateInstitution } from "@/interfaces";

import { InstitutionTabs } from "../components/InstitutionTabs";
import { InstitutionCard } from "../components/InstitutionCard";

import { AnimatePresence, motion } from "framer-motion";
import Offices from "./Offices";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";
import { Button } from "../../../../../components/ui/button";
import { API_BASE_URL } from "@/lib/constants.api";
import axios from "axios";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";
import { createPatientInstitutionRelation, IIDsPatient } from "@/app/actions";
import { Skeleton } from "../../../../../components/ui/skeleton";
import Overview from "./Overview";


interface Props {
  isDemo: boolean;
}

export default function InstitutionInfo() {
  const { institutionId } = useParams<{ institutionId: string }>();
  const { patients, isDemo } = useProfessionalIncludes();

  const [filter, setFilter] = useState("");
  const [dinamicPage, setDinamicPage] = useState<
    "Detalles de la institución" | "Oficinas/Consultorios"
  >("Detalles de la institución");
  const [formOpen, setFormOpen] = useState(false);
  const [institution, setInstitution] = useState<ICreateInstitution | null>(
    null
  );
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);

  /** Fetch institution */
  const fetchInstitution = useCallback(async () => {
    if (!institutionId) return;
    try {
      const { data } = await axios.get<ICreateInstitution>(
        `${API_BASE_URL.prod}/institutions/get-institution/${institutionId}`
      );
      setInstitution(data);
      setSelectedPatientIds(data.patientsIncluded?.map((p) => p.id) ?? []);
    } catch (error) {
      console.error("Error fetching institution:", error);
    }
  }, [institutionId]);

  useEffect(() => {
    fetchInstitution();
  }, [fetchInstitution]);

  /** Save relation */
  const handleSavePatients = async () => {
    try {
      if (selectedPatientIds.length === 0) return;

      // Armamos un array de DTOs para todos los pacientes seleccionados
      const payload: IIDsPatient[] = selectedPatientIds.map((patientId) => ({
        medicalInstitutionId: institutionId!,
        patientId,
      }));

      await createPatientInstitutionRelation(payload);

      setFormOpen(false);

      fetchInstitution(); // refrescamos la institución con los pacientes actualizados
      // Limpiamos los checkboxes
      setSelectedPatientIds([]);
    } catch (error) {
      console.error("Error al guardar pacientes:", error);
    }
  };

  /** Pacientes filtrados */
  const filteredPatients = useMemo(() => {
    const lower = filter.toLowerCase();
    return patients.filter(({ patient }) =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(lower)
    );
  }, [patients, filter]);

  useEffect(() => {
    if (!institution) return;
    setSelectedPatientIds(
      institution.patientsIncluded?.map((p) => p.patient.id) ?? []
    );
  }, [institution]);

    if (!institution) {
    return (
      <section className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-8 space-y-6">
        {/* Skeleton que imita InstitutionInfo HeaderCard */}
        <div className="flex items-center gap-4 mb-20">
          <div className="flex-1 items-center justify-center space-y-3">
            <Skeleton className="bg-gray-400 h-56 w-[75%]" /> {/* imagen */}
          </div>
        </div>

        {/* Skeleton para barra de acciones */}
        <div className="flex gap-2">
          <Skeleton className="bg-gray-400 h-10 w-full" />

        </div>

        {/* Skeleton para contenido principal */}
        <div className="flex gap-4">
          <Skeleton className="bg-gray-400 h-20 w-full" />
        </div>

      </section>
    );
  }
  return (
    <section className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-8 space-y-6">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        {/* InstitutionCard + Botón para asignar pacientes */}
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
          {institution && (
            <InstitutionCard
              institution={institution}
              onEdit={() => {}}
              onDelete={() => {}}
              professionalId=""
            />
          )}

          {/* Botón Asignar pacientes */}
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-400 text-white hover:bg-emerald-500 transition">
                Asignar pacientes
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg bg-white/20 backdrop-blur-md border border-gray-200 shadow-lg">
              <DialogHeader>
                <DialogTitle>
                  Asignar pacientes a {institution?.name}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-2">
                {/* Badges */}
                {selectedPatientIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {patients
                      .filter(({ patient }) =>
                        selectedPatientIds.includes(patient.id)
                      )
                      .map(({ patient }) => (
                        <span
                          key={patient.id}
                          className="bg-emerald-200 text-emerald-800 text-sm px-2 py-1 rounded-full flex items-center gap-1"
                        >
                          {patient.firstName} {patient.lastName}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPatientIds((prev) =>
                                prev.filter((id) => id !== patient.id)
                              )
                            }
                            className="ml-1 text-emerald-600 hover:text-emerald-800 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                )}

                {/* Buscador */}
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-gray-800"
                />

                {/* Select múltiple */}
                <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                  {filteredPatients.map(({ patient }) => (
                    <label key={patient.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPatientIds.includes(patient.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPatientIds((prev) => [
                              ...prev,
                              patient.id,
                            ]);
                          } else {
                            setSelectedPatientIds((prev) =>
                              prev.filter((id) => id !== patient.id)
                            );
                          }
                        }}
                        className="accent-emerald-400"
                      />
                      {patient.firstName} {patient.lastName}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setFormOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSavePatients}>Guardar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs y secciones extra */}
        <InstitutionTabs current={dinamicPage} onChange={setDinamicPage} />

        <div className="w-full pt-4 px-2 sm:px-4">
          <AnimatePresence mode="wait">
            {dinamicPage === "Detalles de la institución" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <Overview institutionId={institutionId} />
              </motion.div>
            )}
            {dinamicPage === "Oficinas/Consultorios" && (
              <motion.div
                key="offices"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <Offices />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
