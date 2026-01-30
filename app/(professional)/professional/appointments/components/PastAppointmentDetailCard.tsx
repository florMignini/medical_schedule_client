"use client";

import React, { useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Clipboard, ClipboardCheck, Calendar, Stethoscope, Pill, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ICreatePastAppointment } from "@/interfaces";

type PastAppointmentProps = ICreatePastAppointment & {
  /** Los campos de fecha pueden venir como string, Date o null según la fuente */
  scheduled?: string | Date | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  /** API puede devolver un único string o un array de URLs */
  patientAttachedFilesUrl?: string | string[] | null;
};

function Badge({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: "neutral" | "success" | "warning";
}) {
  const cls =
    variant === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : variant === "warning"
        ? "bg-amber-50 text-amber-800 border-amber-200"
        : "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-gray-500">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm text-gray-900 whitespace-pre-wrap break-words">
          {value?.trim() ? value : "—"}
        </div>
      </div>
    </div>
  );
}

export default function PastAppointmentDetailCard({
  pastAppointment,
  onEdit,
}: {
  pastAppointment: PastAppointmentProps;
  onEdit?: () => void;
}) {
  const [copied, setCopied] = React.useState(false);

  const normalizeDate = (value?: string | Date | null): Dayjs | null => {
    if (!value) return null;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  };

  const attachedFiles = useMemo(() => {
    const urls = pastAppointment.patientAttachedFilesUrl;
    if (!urls) return [] as string[];
    return Array.isArray(urls) ? urls.filter(Boolean) : [urls];
  }, [pastAppointment.patientAttachedFilesUrl]);

  const meta = useMemo(() => {
    const scheduled = normalizeDate(pastAppointment.scheduled);
    const created = normalizeDate(pastAppointment.createdAt);
    const updated = normalizeDate(pastAppointment.updatedAt);

    const updatedDiffMin = created && updated ? Math.abs(updated.diff(created, "minute")) : 0;
    const wasEdited = updatedDiffMin >= 1;

    return { scheduled, created, updated, wasEdited };
  }, [pastAppointment]);

  const copySummary = async () => {
    const displayDate = meta.scheduled ?? meta.created ?? meta.updated;

    const text = [
      `Evolución (${displayDate ? displayDate.format("DD/MM/YYYY HH:mm") : "sin fecha"})`,
      `Diagnóstico: ${pastAppointment.diagnosis?.trim() || "—"}`,
      `Indicaciones/Receta: ${pastAppointment.prescription?.trim() || "—"}`,
      `Seguimiento requerido: ${pastAppointment.followUpRequired ? "Sí" : "No"}`,
      `Notas: ${pastAppointment.notes?.trim() || "—"}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // sin romper UX si el navegador bloquea
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-sm font-semibold text-gray-900">Evolución clínica</div>
            <Badge variant="success">Finalizada</Badge>
            {pastAppointment.followUpRequired ? (
              <Badge variant="warning">Requiere seguimiento</Badge>
            ) : (
              <Badge>Sin seguimiento</Badge>
            )}
          </div>
          <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {meta.scheduled ? meta.scheduled.format("DD/MM/YYYY HH:mm") : "Fecha no disponible"}
            </span>
            <span className="text-gray-300">•</span>
            <span className="inline-flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              {meta.wasEdited
                ? `Editado ${meta.updated ? meta.updated.format("DD/MM/YYYY HH:mm") : "—"}`
                : `Creado ${meta.created ? meta.created.format("DD/MM/YYYY HH:mm") : "—"}`}
            </span>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button
            variant="ghost"
            onClick={copySummary}
            className="h-9 px-3 rounded-xl"
            title="Copiar resumen"
          >
            {copied ? (
              <ClipboardCheck className="w-4 h-4" />
            ) : (
              <Clipboard className="w-4 h-4" />
            )}
          </Button>

          {onEdit && (
            <Button onClick={onEdit} className="h-9 rounded-xl">
              Editar
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="space-y-3">
        <Row
          icon={<Stethoscope className="w-4 h-4" />}
          label="Diagnóstico"
          value={pastAppointment.diagnosis}
        />
        <Row
          icon={<Pill className="w-4 h-4" />}
          label="Indicaciones / Receta"
          value={pastAppointment.prescription}
        />
        <Row
          icon={<FileText className="w-4 h-4" />}
          label="Notas clínicas"
          value={pastAppointment.notes}
        />

        {/* Adjuntos */}
        <div className="pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Adjuntos del paciente</div>
          {attachedFiles.length ? (
            <div className="space-y-1">
              {attachedFiles.map((url, idx) => (
                <a
                  key={url + idx}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm text-blue-600 hover:underline break-all"
                >
                  Archivo {idx + 1}
                </a>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-900">—</div>
          )}
        </div>
      </div>
    </div>
  );
}
