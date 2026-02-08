"use client";

import React, { memo, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { Patient } from "@/interfaces";

import CalendarIcon from "./icons/CalendarIcon";
import NoteIcon from "./icons/NoteIcon";
import FileAttachmentIcon from "./icons/FileAttachmentIcon";
import ConfigButton from "./ConfigButton";

import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { ChevronDown, Copy, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

import { useWindowVirtualizer } from "@tanstack/react-virtual";

type PastAppointmentsProps = Patient & {
  isDemo?: boolean;
};

type ProfInfo = any;

function safeParseJSON(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function clamp(text?: string, max = 160) {
  if (!text) return "";
  const t = text.trim();
  return t.length > max ? t.slice(0, max).trimEnd() + "…" : t;
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function extractFileName(url: string) {
  try {
    const clean = url.split("?")[0];
    const parts = clean.split("/");
    const last = parts[parts.length - 1] || "Archivo";
    return decodeURIComponent(last);
  } catch {
    return "Archivo";
  }
}

function highlight(text: string, query: string) {
  const q = normalize(query);
  if (!q) return text;

  const raw = text || "";
  const idx = normalize(raw).indexOf(q);
  if (idx < 0) return raw;

  // resaltado aproximado (sirve muy bien para UX)
  const before = raw.slice(0, idx);
  const match = raw.slice(idx, idx + query.length);
  const after = raw.slice(idx + query.length);

  return (
    <>
      {before}
      <mark className="rounded px-1 bg-emerald-200/70 text-gray-900">{match}</mark>
      {after}
    </>
  );
}

type SortMode = "newest" | "oldest";

function getSortDate(it: any) {
  const ap = it?.pastAppointments;
  const d = ap?.scheduled ?? ap?.createdAt ?? it?.createdAt ?? 0;
  return new Date(d).getTime();
}

function groupByMonth(items: any[]) {
  const map = new Map<string, any[]>();
  for (const it of items) {
    const ap = it?.pastAppointments;
    const key = dayjs(ap?.scheduled ?? ap?.createdAt ?? it?.createdAt).format("MMMM YYYY");
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(it);
  }
  return Array.from(map.entries());
}

type Row =
  | { type: "header"; key: string; label: string; count: number }
  | { type: "item"; key: string; item: any };

const PastAppointmentCard = memo(function PastAppointmentCard({
  item,
  isDemo,
  expandedId,
  setExpandedId,
  onDemoClick,
  query,
  showNotes,
  showFiles,
}: {
  item: any;
  isDemo: boolean;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onDemoClick: () => void;
  query: string;
  showNotes: boolean;
  showFiles: boolean;
}) {
  const { toast } = useToast();

  const appointment = item?.pastAppointments;
  const files: string[] = appointment?.patientAttachedFilesUrl || [];
  const id: string = appointment?.id;
  const isExpanded = expandedId === id;

  const scheduledLabel = dayjs(appointment?.scheduled ?? appointment?.createdAt).format(
    "DD MMM YYYY • HH:mm"
  );

  const createdLabel = dayjs(item?.createdAt ?? appointment?.createdAt).format("DD MMM YYYY");

  const copyToClipboard = async (label: string, value?: string) => {
    const text = (value || "").trim();
    if (!text) {
      toast({ title: "Nada para copiar", description: `No hay ${label.toLowerCase()}.` });
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copiado", description: `${label} copiado al portapapeles.` });
    } catch {
      toast({ title: "No se pudo copiar", description: "Probá manualmente." });
    }
  };

  return (
    <div className="w-full rounded-2xl border bg-white shadow-sm transition hover:shadow-md overflow-hidden">
      <button
        type="button"
        className={cn(
          "w-full text-left p-4",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        )}
        onClick={() => setExpandedId(isExpanded ? null : id)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-xl">
                <span className="inline-flex items-center gap-2">
                  <CalendarIcon width={16} height={16} />
                  {scheduledLabel}
                </span>
              </Badge>

              <Badge variant="outline" className="rounded-xl">
                Registrada: {createdLabel}
              </Badge>

              {showFiles && (
                <Badge variant="outline" className="rounded-xl">
                  Adjuntos: {files.length}
                </Badge>
              )}
            </div>

            <div className="mt-3 flex gap-2 items-start text-gray-800">
              <NoteIcon width={16} height={16} />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-700">Diagnóstico</p>
                <p className="text-sm font-medium break-words">
                  {query ? highlight(appointment?.diagnosis || "—", query) : appointment?.diagnosis || "—"}
                </p>
              </div>
            </div>

            {showNotes && (
              <div className="mt-2 flex gap-2 items-start text-gray-700">
                <NoteIcon width={16} height={16} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-700">Notas</p>
                  <p className="text-sm text-gray-600 break-words">
                    {query
                      ? highlight(clamp(appointment?.notes || "—", 160), query)
                      : clamp(appointment?.notes, 160) || <span className="italic">—</span>}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isDemo ? (
              <div
                className="w-9 h-9 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <ConfigButton id={id} component="pastAppointment" />
              </div>
            ) : (
              <span
                className="text-gray-400 text-xs px-2 py-1 border border-gray-300 rounded-xl cursor-not-allowed select-none"
                onClick={(e) => {
                  e.stopPropagation();
                  onDemoClick();
                }}
              >
                Demo
              </span>
            )}

            <ChevronDown
              className={cn("h-5 w-5 text-gray-500 transition", isExpanded ? "rotate-180" : "")}
            />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <Separator className="mb-4" />

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border p-3 bg-muted/10">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Fecha programada</p>
              <p className="mt-1 text-sm">
                {appointment?.scheduled
                  ? dayjs(appointment.scheduled).format("DD MMM YYYY - HH:mm A")
                  : "—"}
              </p>
            </div>

            <div className="rounded-2xl border p-3 bg-muted/10">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Diagnóstico completo</p>
              <p className="mt-1 text-sm break-words">{appointment?.diagnosis || "—"}</p>
              <div className="mt-2 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard("Diagnóstico", appointment?.diagnosis);
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </Button>
              </div>
            </div>

            {showNotes && (
              <div className="rounded-2xl border p-3 bg-muted/10 md:col-span-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Notas</p>
                    <p className="mt-1 text-sm whitespace-pre-wrap break-words">{appointment?.notes || "—"}</p>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-xl shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard("Notas", appointment?.notes);
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar
                  </Button>
                </div>
              </div>
            )}

            {showFiles && (
              <div className="rounded-2xl border p-3 bg-muted/10 md:col-span-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Análisis adjuntos</p>
                  <span className="text-xs text-muted-foreground">
                    {files.length} archivo{files.length === 1 ? "" : "s"}
                  </span>
                </div>

                {files.length > 0 ? (
                  <div className="mt-2 flex flex-col gap-2">
                    {files.map((file: string, i: number) => (
                      <Link
                        key={`${file}-${i}`}
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-gray-200 rounded-2xl px-3 py-2 flex items-center justify-between gap-3 text-xs text-gray-800 hover:bg-gray-50 transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <FileAttachmentIcon width={14} height={14} />
                          <span className="truncate">{extractFileName(file)}</span>
                        </span>
                        <span className="text-muted-foreground">Abrir</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground italic">—</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              className="rounded-2xl"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedId(null);
              }}
            >
              Cerrar detalle
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

export default function PastAppointments({ isDemo = false, ...patientInfo }: PastAppointmentsProps) {
  const [profInfo, setProfInfo] = useState<ProfInfo | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [onlyWithFiles, setOnlyWithFiles] = useState(false);
  const [onlyWithNotes, setOnlyWithNotes] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const { pastAppointmentsIncluded } = patientInfo;
  const { toast } = useToast();

  useEffect(() => {
    setProfInfo(safeParseJSON(localStorage.getItem("infoProfSession")));
  }, []);

  const onDemoClick = () =>
    toast({
      title: "Modo Demo: esta sección es solo visual",
      description: "No se pueden editar citas anteriores en esta vista.",
      className: "bg-emerald-500 text-black",
      duration: 5000,
    });

  const filtered = useMemo(() => {
    const base = pastAppointmentsIncluded || [];
    if (!base.length) return [];

    const q = normalize(query);
    const fromTs = fromDate ? new Date(fromDate + "T00:00:00").getTime() : null;
    const toTs = toDate ? new Date(toDate + "T23:59:59").getTime() : null;

    const res = base.filter((it: any) => {
      const ap = it?.pastAppointments;
      if (!ap) return false;

      const files: string[] = ap?.patientAttachedFilesUrl || [];
      const notes = (ap?.notes || "").trim();
      const diagnosis = (ap?.diagnosis || "").trim();

      if (onlyWithFiles && files.length === 0) return false;
      if (onlyWithNotes && !notes) return false;

      const when = getSortDate(it);
      if (fromTs !== null && when < fromTs) return false;
      if (toTs !== null && when > toTs) return false;

      if (!q) return true;
      const haystack = normalize(`${diagnosis} ${notes}`);
      return haystack.includes(q);
    });

    res.sort((a: any, b: any) => {
      const da = getSortDate(a);
      const db = getSortDate(b);
      return sortMode === "newest" ? db - da : da - db;
    });

    return res;
  }, [pastAppointmentsIncluded, query, onlyWithFiles, onlyWithNotes, sortMode, fromDate, toDate]);

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);

  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    for (const [label, arr] of grouped) {
      out.push({ type: "header", key: `h:${label}`, label, count: arr.length });
      for (const it of arr) {
        const id = it?.pastAppointments?.id ?? `${label}:${Math.random()}`;
        out.push({ type: "item", key: `i:${id}`, item: it });
      }
      // separador “lógico” (opcional) -> lo hacemos como header spacing con CSS más abajo
    }
    return out;
  }, [grouped]);

  const total = pastAppointmentsIncluded?.length || 0;
  const shown = filtered.length;

  const resetFilters = () => {
    setQuery("");
    setOnlyWithFiles(false);
    setOnlyWithNotes(false);
    setSortMode("newest");
    setFromDate("");
    setToDate("");
    setExpandedId(null);
  };

  // Virtualizer (window scroll)
  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: (index) => {
      const r = rows[index];
      if (!r) return 120;
      // estimaciones: header ~56px, item ~190px (expand mide real)
      return r.type === "header" ? 56 : 190;
    },
    overscan: 10,
  });

  if (!profInfo) {
    return (
      <section className="w-full bg-white min-h-screen flex flex-col gap-2 items-center justify-start p-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 bg-gray-200 w-full max-w-4xl rounded-2xl" />
        ))}
      </section>
    );
  }

  return (
    <section className="w-full bg-white min-h-screen flex flex-col gap-4 items-center p-4">
      {/* Title */}
      <div className="w-full max-w-4xl flex items-center gap-2 text-white bg-[#262626] px-4 py-3 rounded-2xl shadow-inner">
        <div className="h-5 border-l-2 border-emerald-500" />
        <h2 className="text-sm lg:text-base font-mono">Citas Anteriores</h2>
      </div>

      {/* Filters bar */}
      <div className="w-full max-w-4xl rounded-2xl border bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-xl">
              Mostrando {shown} de {total}
            </Badge>

            {(query || onlyWithFiles || onlyWithNotes || fromDate || toDate || sortMode !== "newest") && (
              <Button variant="ghost" size="sm" className="rounded-xl" onClick={resetFilters}>
                <X className="mr-2 h-4 w-4" />
                Limpiar filtros
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={sortMode === "newest" ? "default" : "secondary"}
              size="sm"
              className="rounded-xl"
              onClick={() => setSortMode("newest")}
            >
              Más nuevas
            </Button>
            <Button
              variant={sortMode === "oldest" ? "default" : "secondary"}
              size="sm"
              className="rounded-xl"
              onClick={() => setSortMode("oldest")}
            >
              Más viejas
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-12">
          {/* Search */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por diagnóstico o notas…"
              className="pl-9 rounded-2xl"
            />
          </div>

          {/* Date range */}
          <div className="md:col-span-3">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-2xl"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">Desde</p>
          </div>

          <div className="md:col-span-3">
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-2xl"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">Hasta</p>
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-6 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <Checkbox checked={onlyWithFiles} onCheckedChange={(v) => setOnlyWithFiles(!!v)} />
              Solo con adjuntos
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <Checkbox checked={onlyWithNotes} onCheckedChange={(v) => setOnlyWithNotes(!!v)} />
              Solo con notas
            </label>
          </div>
        </div>
      </div>

      {/* Virtualized list */}
      <div className="w-full max-w-4xl">
        {rows.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">
              {total === 0 ? "No hay citas anteriores para este paciente." : "No hay resultados con esos filtros."}
            </p>
            {total > 0 && (
              <Button variant="secondary" className="mt-3 rounded-2xl" onClick={resetFilters}>
                Limpiar filtros
              </Button>
            )}
          </div>
        ) : (
          <div
            style={{
              height: virtualizer.getTotalSize(),
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((vRow) => {
              const row = rows[vRow.index];
              if (!row) return null;

              return (
                <div
                  key={row.key}
                  ref={virtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${vRow.start}px)`,
                  }}
                >
                  {row.type === "header" ? (
                    <div className="py-2">
                      <div className="flex items-center justify-between rounded-2xl border bg-white px-3 py-2 shadow-sm">
                        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          {row.label}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {row.count} cita{row.count === 1 ? "" : "s"}
                        </span>
                      </div>
                      <Separator className="mt-3" />
                    </div>
                  ) : (
                    <div className="py-2">
                      <PastAppointmentCard
                        item={row.item}
                        isDemo={isDemo}
                        expandedId={expandedId}
                        setExpandedId={setExpandedId}
                        onDemoClick={onDemoClick}
                        query={query}
                        showNotes={true}
                        showFiles={true}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
