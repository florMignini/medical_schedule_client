"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { ICreateInstitution } from "@/interfaces";

import { InstitutionTabs } from "../components/InstitutionTabs";

import { InstitutionCard } from "../components/InstitutionCard";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";
import { DinamicInstitutionSection } from "../../data";
import { AnimatePresence, motion } from "framer-motion";
import { Overview } from "./Overview";
import Offices from "./Offices";

interface Props {
  institution: ICreateInstitution;
  isDemo: boolean;
}
export default function InstitutionInfo({ institution, isDemo }: Props) {
  const { institutionId } = useParams<{ institutionId: string }>();

  const { data, refetch } = useProfessionalIncludes();
  const [selectedInstitution, setSelectedInstitution] =
    useState<ICreateInstitution>();
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [dinamicPage, setDinamicPage] = useState<string>("Overview");
 
 <div className="flex flex-wrap gap-4 mt-2 px-1">
    {DinamicInstitutionSection.map(({ name }, index) => (
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
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        {/* Info general */}
        <InstitutionCard
          institution={institution}
          onEdit={() => {
            setSelectedInstitution(institution);
            setFormOpen(true);
          }}
          onDelete={() => {
            refetch();
          }}
          professionalId={data?.id || ""}
        />

        {/* Tabs y secciones extra */}
        <InstitutionTabs current={dinamicPage} onChange={setDinamicPage} />
        <div className="w-full pt-4 px-2 sm:px-4">
          <AnimatePresence mode="wait">
            {dinamicPage === "Overview" && (
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
            {dinamicPage === "Offices" && (
              <motion.div
                key="history"
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
