"use client";

import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { Patient } from "@/interfaces";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const PatientInfoSection = (patientInfo: Patient) => {
  const {
    address,
    gender,
    phone,
    email,
    occupation,
    bloodType,
    bloodFactor,
    emergencyContactName,
    emergencyContactNumber,
    allergies,
    allergic,
    smoker,
    exSmoker,
    insurancePolicyNumber,
    insuranceProvider,
    patientBFP,
    patientBMI,
    patientHeight,
    patientWeight,
    pastMedicalHistory,
    medicalHistoryType,
    familyMedicalHistory,
    medicalHistory,
  } = patientInfo;

  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | null | undefined;
  }) => (
    <div className="flex flex-col">
      <Label className="text-xs text-gray-300 font-mono">{label}</Label>
      <p className="text-sm text-white">{value || "—"}</p>
    </div>
  );
  const {toast} = useToast();
  const sectionRef = useRef<HTMLDivElement>(null);

  const exportPDF = async() => {
    const html2pdf = (await import("html2pdf.js")) as any;
    if (sectionRef.current) {
      html2pdf()
        .set({
          margin: 0.5,
          filename: `paciente-${patientInfo?.lastName ?? "datos"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(sectionRef.current)
        .save();
        toast({
          title: "PDF Exportado",
          description: `El PDF del paciente ${patientInfo?.lastName ?? "datos"} ha sido exportado exitosamente.`,
          className: "bg-emerald-500 text-black",
          duration: 3000,
        })
    }
  };
  return (
    <section className="w-full flex flex-col gap-6">
      {/* 📤 Botón exportar PDF */}
      <div className="flex justify-end">
        <Button
          onClick={exportPDF}
          className="bg-emerald-400 shadow-lg shadow-emerald-800 hover:bg-emerald-600 print:hidden"
        >
          Exportar PDF
        </Button>
      </div>
      {/* 🩺 Sección Personal */}
      <div className="w-full max-w-6xl bg-[#262626] rounded-xl px-4 py-5 shadow-inner space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-5 border-l-2 border-emerald-500" />
          <h2 className="text-sm lg:text-base font-mono text-white">
            Información Personal
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <InfoItem
            label="Género"
            value={gender === "F" ? "Femenino" : "Masculino"}
          />
          <InfoItem label="Email" value={email} />
          <InfoItem label="Ocupación" value={occupation} />
          <InfoItem label="Teléfono" value={phone} />
          <InfoItem label="Dirección" value={address} />
          <InfoItem
            label="Seguro Médico"
            value={`${insuranceProvider || "—"} - N° ${
              insurancePolicyNumber || "—"
            }`}
          />
          <InfoItem
            label="Tipo y Factor de Sangre"
            value={`${bloodType ?? "—"} ${
              bloodFactor === "Negativo" ? "-" : "+"
            }`}
          />
          <InfoItem
            label="Contacto de Emergencia"
            value={emergencyContactName}
          />
          <InfoItem
            label="Número de Emergencia"
            value={emergencyContactNumber}
          />
        </div>
      </div>

      {/* 🧬 Sección Médica */}
      <div className="w-full max-w-6xl bg-[#262626] rounded-xl px-4 py-5 shadow-inner space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-5 border-l-2 border-emerald-500" />
          <h2 className="text-sm lg:text-base font-mono text-white">
            Información Médica
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <InfoItem label="Fumador" value={smoker} />
          <InfoItem label="Ex Fumador" value={exSmoker} />
          <InfoItem label="Alergico/a" value={allergic} />
          <InfoItem label="Alergias" value={allergies} />
          <InfoItem label="Peso (kg)" value={patientWeight} />
          <InfoItem label="Altura (cm)" value={patientHeight} />
          <InfoItem label="IMC" value={patientBMI} />
          <InfoItem label="Porcentaje de Grasa Corporal" value={patientBFP} />
        </div>
      </div>

      {/* 📚 Antecedentes */}
      <div className="w-full max-w-6xl bg-[#262626] rounded-xl px-4 py-5 shadow-inner space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-5 border-l-2 border-emerald-500" />
          <h2 className="text-sm lg:text-base font-mono text-white">
            Antecedentes Médicos
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <InfoItem
            label="Antecedentes Familiares"
            value={familyMedicalHistory}
          />
          <InfoItem
            label="Antecedentes Personales"
            value={medicalHistoryType}
          />
        </div>
      </div>
    </section>
  );
};
