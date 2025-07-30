"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";

import { DinamicPage } from "@/app/(professional)/professional/data";

import { Patient } from "@/interfaces";
import { PatientInfoSection } from "@/app/(professional)/professional/components";
import PastAppointments from "@/app/(professional)/professional/components/PastAppointments";
import FollowUp from "@/app/(professional)/professional/components/FollowUp";
import PatientHeaderCard from "../../components/PatientHeaderCard";
import PatientActionBar from "../../components/PatientActionBar";
import PatientSectionNav from "../../components/PatientSectionNav";


interface Props {
  patient: Patient;
  isDemo: boolean;
}

const PatientInfo = ({ patient, isDemo }: Props) => {
  const [activeTab, setActiveTab] = useState("Información");
  const [turnoOcita, setTurnoOcita] = useState<"Turno" | "Seguimiento" | null>(
    null
  );
  const [dinamicPage, setDinamicPage] = useState<string>("Informacion del Paciente");
 {/* Navegación dinámica */}
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
</div>
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

      {/* Modal de turno o seguimiento (opcional a implementar después) */}
    </section>
  );
};

export default PatientInfo;
