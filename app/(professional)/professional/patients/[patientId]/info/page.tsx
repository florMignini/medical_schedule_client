"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";

import { Patient } from "@/interfaces";
import PastAppointments from "../../../components/PastAppointments";
import FollowUp from "../../../components/FollowUp";
import PatientHeaderCard from "../../components/PatientHeaderCard";
import PatientActionBar from "../../components/PatientActionBar";
import PatientSectionNav from "../../components/PatientSectionNav";
import NewAppointmentForm from "../../../../../../components/forms/NewAppointmentForm";
import AppointmentDialogDetail from "../../../components/AppointmentDialogDetail";
import { Dialog, DialogContent } from "../../../../../../components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DinamicPage } from "../../../data";
import { PatientInfoSection } from "../../../components";

interface Props {
  patient: Patient;
  isDemo: boolean;
}

const PatientInfo = ({ patient, isDemo }: Props) => {
  const [activeTab, setActiveTab] = useState("Información");
  const [turnoOcita, setTurnoOcita] = useState<"Turno" | "Seguimiento" | null>(
    null
  );
  const [dinamicPage, setDinamicPage] = useState<string>(
    "Informacion del Paciente"
  );
  const { toast } = useToast();

  {
    /* Navegación dinámica */
  }
  <div className="flex flex-wrap gap-4 mt-2 px-1">
    {DinamicPage.map(({ name }, index) => (
      <button
        key={index}
        onClick={() => setDinamicPage(name)}
        className={clsx(
          "text-sm transition-all duration-150 underline-offset-4 hover:underline",
          dinamicPage === name
            ? "text-emerald-400 font-bold"
            : "text-gray-400 hover:text-white"
        )}
        aria-current={dinamicPage === name ? "page" : undefined}
      >
        {name}
      </button>
    ))}
  </div>;
  return (
    <section className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-8 space-y-6">
      {/* Header with photo and basic info */}
      <PatientHeaderCard patient={patient} />
      {/* action buttons */}
      <PatientActionBar
        onCreateAppointment={() => setTurnoOcita("Turno")}
        onAddFollowUp={() => setTurnoOcita("Seguimiento")}
      />

      {/* Tabs dinámicos para navegar entre secciones */}
      <PatientSectionNav current={dinamicPage} onChange={setDinamicPage} />

      <div className="w-full pt-4 px-2 sm:px-4">
        <AnimatePresence mode="wait">
          {dinamicPage === "Informacion del Paciente" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <PatientInfoSection {...patient} />
            </motion.div>
          )}
          {dinamicPage === "Historial de Citas" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <PastAppointments {...patient} />
            </motion.div>
          )}
          {dinamicPage === "Seguimientos" && (
            <motion.div
              key="followup"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FollowUp patientInfo={patient} isDemo={isDemo} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {turnoOcita === "Turno" && (
  <NewAppointmentForm
    key="create"
    type="create"
    component="patient-info"
    initialDateTime={new Date()}
    patientId={patient.id}
    patientsList={[{ patient }]}
    isDemo={isDemo}
    onSuccess={() => {
      setTurnoOcita(null);
      toast({
        title: isDemo ? "Simulación de Turno" : "Turno agendado",
        description: isDemo
          ? "Este turno fue simulado en modo demo."
          : "El turno se ha agendado correctamente.",
        duration: 3000,
        className: isDemo
          ? "bg-yellow-500/10 text-yellow-800"
          : "bg-emerald-500/10 text-emerald-500",
      });
    }}
  />
)}
{turnoOcita === "Seguimiento" && (
  <AppointmentDialogDetail
    key="followup"
    type="create"
    initialDateTime={new Date()}
    patientId={patient.id}
    patientData={patient}
    isDemo={isDemo} // <-- también aquí
    onSuccess={() => {
      setTurnoOcita(null);
      toast({
        title: isDemo ? "Simulación de Seguimiento" : "Seguimiento creado",
        description: isDemo
          ? "Este seguimiento fue simulado en modo demo."
          : "El seguimiento se ha creado correctamente.",
        duration: 3000,
        className: isDemo
          ? "bg-yellow-500/10 text-yellow-800"
          : "bg-emerald-500/10 text-emerald-500",
      });
    }}
  />
)}

    </section>
  );
};

export default PatientInfo;
