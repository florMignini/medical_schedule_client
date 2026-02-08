"use client";

import React, {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useDeferredValue,
} from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

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
import { cn } from "@/lib/utils";

import { ChevronDown, Copy, X, Search, Download, Printer } from "lucide-react";

type PastAppointmentsProps = Patient & {
  isDemo?: boolean;
};

type ProfInfo = any;

type SortMode = "newest" | "oldest";

type Row =
  | { type: "header"; key: string; label: string; count: number }
  | { type: "item"; key: string; item: any; id: string };

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
  return (s || "")
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

function getSortDate(it: any) {
  const ap = it?.pastAppointments;
  const d = ap?.scheduled ?? ap?.createdAt ?? it?.createdAt ?? 0;
  return new Date(d).getTime();
}

function groupByMonth(items: any[]) {
  const map = new Map<string, any[]>();
  for (const it of items) {
    const ap = it?.pastAppointments;
    const key = dayjs(ap?.scheduled ?? ap?.createdAt ?? it?.createdAt).format(
      "MMMM YYYY"
    );
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(it);
  }
  return Array.from(map.entries());
}

function useDebouncedValue<T>(value: T, delay = 150) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function highlight(text: string, query: string) {
  const q = normalize(query);
  if (!q) return text;

  const raw = text || "";
  const idx = normalize(raw).indexOf(q);
  if (idx < 0) return raw;

  // resaltado aproximado (suficiente y rápido)
  const before = raw.slice(0, idx);
  const match = raw.slice(idx, idx + Math.min(query.length, raw.length - idx));
  const after = raw.slice(idx + match.length);

  return (
    <>
      {before}
      <mark className="rounded px-1 bg-emerald-200/70 text-gray-900">
        {match}
      </mark>
      {after}
    </>
  );
}

function toCsvValue(v: any) {
  const s = String(v ?? "");
  // escapado CSV
  const escaped = s.replace(/"/g, '""');
  return `"${escaped}"`;
}

function downloadTextFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const PastAppointmentCard = memo(function PastAppointmentCard({
  item,
  isDemo,
  expandedIds,
  toggleExpanded,
  onDemoClick,
  query,
}: {
  item: any;
  isDemo: boolean;
  expandedIds: Set<string>;
  toggleExpanded: (id: string) => void;
  onDemoClick: () => void;
  query: string;
}) {
  const { toast } = useToast();
  const ap = item?.pastAppointments;
  const id: string = ap?.id;
  const isExpanded = expandedIds.has(id);
  const files: string[] = ap?.patientAttachedFilesUrl || [];

  const scheduledLabel = dayjs(ap?.scheduled ?? ap?.createdAt).format(
    "DD MMM YYYY • HH:mm"
  );

  const createdLabel = dayjs(item?.createdAt ?? ap?.createdAt).format(
    "DD MMM YYYY"
  );

  const copyToClipboard = async (label: string, value?: string) => {
    const text = (value || "").trim();
    if (!text) {
      toast({ title: "Nada para copiar", description: `No hay ${label.toLowerCase()}.` });
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copiado", description: `${label} copiado.` });
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
        onClick={() => toggleExpanded(id)}
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

              <Badge variant="outline" className="rounded-xl">
                Adjuntos: {files.length}
              </Badge>
            </div>

            <div className="mt-3 flex gap-2 items-start text-gray-800">
              <NoteIcon width={16} height={16} />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-700">Diagnóstico</p>
                <p className="text-sm font-medium break-words">
                  {query
                    ? highlight(ap?.diagnosis || "—", query)
                    : ap?.diagnosis || "—"}
                </p>
              </div>
            </div>

            <div className="mt-2 flex gap-2 items-start text-gray-700">
              <NoteIcon width={16} height={16} />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-700">Notas</p>
                <p className="text-sm text-gray-600 break-words">
                  {query
                    ? highlight(clamp(ap?.notes || "—", 160), query)
                    : clamp(ap?.notes, 160) || <span className="italic">—</span>}
                </p>
              </div>
            </div>
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
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Fecha programada
              </p>
              <p className="mt-1 text-sm">
                {ap?.scheduled
                  ? dayjs(ap.scheduled).format("DD MMM YYYY - HH:mm A")
                  : "—"}
              </p>
            </div>

            <div className="rounded-2xl border p-3 bg-muted/10">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Diagnóstico completo
              </p>
              <p className="mt-1 text-sm break-words">{ap?.diagnosis || "—"}</p>
              <div className="mt-2 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard("Diagnóstico", ap?.diagnosis);
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border p-3 bg-muted/10 md:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Notas
                  </p>
                  <p className="mt-1 text-sm whitespace-pre-wrap break-words">
                    {ap?.notes || "—"}
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard("Notas", ap?.notes);
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border p-3 bg-muted/10 md:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Análisis adjuntos
                </p>
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
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              className="rounded-2xl"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(id);
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

export default function PastAppointments({
  isDemo = false,
  ...patientInfo
}: PastAppointmentsProps) {
  const [profInfo, setProfInfo] = useState<ProfInfo | null>(null);

  // MULTI-expand + persistencia
  const [expandAll, setExpandAll] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // UI state
  const [query, setQuery] = useState("");
  const [onlyWithFiles, setOnlyWithFiles] = useState(false);
  const [onlyWithNotes, setOnlyWithNotes] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // mes selector (jump)
  const [jumpMonth, setJumpMonth] = useState<string>("");

  const { pastAppointmentsIncluded } = patientInfo;
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const router = useRouter();

  // Guardar preferencias UI (expandAll)
  useEffect(() => {
    const stored = safeParseJSON(localStorage.getItem("ms_pastAppointments_prefs"));
    if (stored && typeof stored.expandAll === "boolean") setExpandAll(stored.expandAll);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ms_pastAppointments_prefs",
      JSON.stringify({ expandAll })
    );
  }, [expandAll]);

  useEffect(() => {
    setProfInfo(safeParseJSON(localStorage.getItem("infoProfSession")));
  }, []);

  const onDemoClick = () =>
    toast({
      title: "Modo Demo: esta sección es solo visual",
      description: "No se pueden editar citas anteriores en esta vista.",
      className: "bg-emerald-500 text-black",
      duration: 4000,
    });

  // Búsqueda sin lag: debounce + deferred
  const debouncedQuery = useDebouncedValue(query, 150);
  const deferredQuery = useDeferredValue(debouncedQuery);

  const filtered = useMemo(() => {
    const base = pastAppointmentsIncluded || [];
    if (!base.length) return [];

    const q = normalize(deferredQuery);

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
  }, [
    pastAppointmentsIncluded,
    deferredQuery,
    onlyWithFiles,
    onlyWithNotes,
    sortMode,
    fromDate,
    toDate,
  ]);

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);

  // build rows + map month->headerIndex for jump
  const { rows, monthOptions, headerIndexByMonth } = useMemo(() => {
    const out: Row[] = [];
    const options: string[] = [];
    const headerMap = new Map<string, number>();

    for (const [label, arr] of grouped) {
      options.push(label);
      headerMap.set(label, out.length);
      out.push({ type: "header", key: `h:${label}`, label, count: arr.length });

      for (const it of arr) {
        const id = it?.pastAppointments?.id;
        if (!id) continue;
        out.push({ type: "item", key: `i:${id}`, item: it, id });
      }
    }

    return {
      rows: out,
      monthOptions: options,
      headerIndexByMonth: headerMap,
    };
  }, [grouped]);

  const total = pastAppointmentsIncluded?.length || 0;
  const shown = filtered.length;

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetFilters = () => {
    setQuery("");
    setOnlyWithFiles(false);
    setOnlyWithNotes(false);
    setSortMode("newest");
    setFromDate("");
    setToDate("");
    setJumpMonth("");
    setExpandAll(false);
    setExpandedIds(new Set());
    // limpiamos deep link (si existía)
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("pastId");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Expand all / collapse all
  useEffect(() => {
    if (!expandAll) {
      setExpandedIds(new Set());
      return;
    }
    // expandir todos los visibles filtrados
    const ids = new Set<string>();
    for (const it of filtered) {
      const id = it?.pastAppointments?.id;
      if (id) ids.add(id);
    }
    setExpandedIds(ids);
  }, [expandAll, filtered]);

  // Deep link: ?pastId=xxxx
  useEffect(() => {
    const pastId = searchParams?.get("pastId");
    if (!pastId) return;

    const exists = filtered.some((it: any) => it?.pastAppointments?.id === pastId);
    if (!exists) {
      toast({
        title: "Cita no encontrada en los filtros actuales",
        description: "Probá limpiar filtros o revisar el ID.",
      });
      return;
    }

    // abrir y scrollear
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.add(pastId);
      return next;
    });

    // scroll se hace cuando el virtualizer esté listo (debajo)
  }, [searchParams, filtered, toast]);

  // Virtualizer
  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: (index) => {
      const r = rows[index];
      if (!r) return 120;
      return r.type === "header" ? 62 : 210;
    },
    overscan: 10,
  });

  // Mes flotante: detecta el header más cercano al primer visible
  const virtualItems = virtualizer.getVirtualItems();
  const currentMonthLabel = useMemo(() => {
    if (!virtualItems.length) return null;
    const firstIndex = virtualItems[0].index;

    for (let i = firstIndex; i >= 0; i--) {
      const r = rows[i];
      if (r?.type === "header") return r.label;
    }
    for (let i = firstIndex; i < rows.length; i++) {
      const r = rows[i];
      if (r?.type === "header") return r.label;
    }
    return null;
  }, [virtualItems, rows]);

  // Deep link scroll (cuando haya rows)
  const didScrollToDeepLink = useRef(false);
  useEffect(() => {
    const pastId = searchParams?.get("pastId");
    if (!pastId || didScrollToDeepLink.current) return;

    const index = rows.findIndex((r) => r.type === "item" && r.id === pastId);
    if (index >= 0) {
      didScrollToDeepLink.current = true;
      virtualizer.scrollToIndex(index, { align: "start" });
    }
  }, [rows, searchParams, virtualizer]);

  // Jump to month
  const onJumpMonth = (label: string) => {
    setJumpMonth(label);
    const idx = headerIndexByMonth.get(label);
    if (typeof idx === "number") virtualizer.scrollToIndex(idx, { align: "start" });
  };

  // Export CSV (filtrados actuales)
  const exportCsv = () => {
    if (!filtered.length) {
      toast({ title: "Nada para exportar", description: "No hay resultados con esos filtros." });
      return;
    }

    const headers = [
      "scheduled",
      "createdAt",
      "diagnosis",
      "notes",
      "attachmentsCount",
      "attachments",
      "pastAppointmentId",
    ];

    const lines = [headers.map(toCsvValue).join(",")];

    for (const it of filtered) {
      const ap = it?.pastAppointments;
      const files: string[] = ap?.patientAttachedFilesUrl || [];
      lines.push(
        [
          toCsvValue(ap?.scheduled ? dayjs(ap.scheduled).toISOString() : ""),
          toCsvValue(ap?.createdAt ? dayjs(ap.createdAt).toISOString() : ""),
          toCsvValue(ap?.diagnosis || ""),
          toCsvValue(ap?.notes || ""),
          toCsvValue(files.length),
          toCsvValue(files.join(" | ")),
          toCsvValue(ap?.id || ""),
        ].join(",")
      );
    }

    const name = `past-appointments_${dayjs().format("YYYY-MM-DD_HH-mm")}.csv`;
    downloadTextFile(name, lines.join("\n"), "text/csv;charset=utf-8");
  };

  // Print / Save as PDF (navegador)
  const printPdf = () => {
    if (!filtered.length) {
      toast({ title: "Nada para imprimir", description: "No hay resultados con esos filtros." });
      return;
    }

    const title = "Citas Anteriores del Paciente";
    const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto; padding: 24px; }
    h1 { font-size: 18px; margin: 0 0 8px; }
    .meta { color:#666; font-size: 12px; margin-bottom: 16px; }
    .block { border: 1px solid #ddd; border-radius: 12px; padding: 12px; margin: 10px 0; }
    .row { display:flex; justify-content: space-between; gap:12px; }
    .k { color:#666; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
    .v { font-size: 13px; white-space: pre-wrap; }
    .small { font-size: 12px; color:#444; }
    .files { margin-top: 6px; font-size: 12px; color:#444; }
    @media print { body { padding: 0; } .block { break-inside: avoid; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">Generado: ${dayjs().format("DD/MM/YYYY HH:mm")} — Total: ${filtered.length}</div>
  ${filtered
    .map((it) => {
      const ap = it?.pastAppointments;
      const files: string[] = ap?.patientAttachedFilesUrl || [];
      const scheduled = ap?.scheduled
        ? dayjs(ap.scheduled).format("DD/MM/YYYY HH:mm")
        : "";
      const created = ap?.createdAt
        ? dayjs(ap.createdAt).format("DD/MM/YYYY HH:mm")
        : "";
      const diagnosis = (ap?.diagnosis || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const notes = (ap?.notes || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const filesHtml =
        files.length > 0
          ? `<div class="files"><span class="k">Adjuntos</span><div class="small">${files
              .map((f) => extractFileName(f))
              .join(", ")}</div></div>`
          : "";
      return `
        <div class="block">
          <div class="row">
            <div>
              <div class="k">Programada</div>
              <div class="v">${scheduled || "—"}</div>
            </div>
            <div>
              <div class="k">Creada</div>
              <div class="v">${created || "—"}</div>
            </div>
            <div>
              <div class="k">ID</div>
              <div class="v">${ap?.id || "—"}</div>
            </div>
          </div>
          <div style="margin-top:10px">
            <div class="k">Diagnóstico</div>
            <div class="v">${diagnosis || "—"}</div>
          </div>
          <div style="margin-top:10px">
            <div class="k">Notas</div>
            <div class="v">${notes || "—"}</div>
          </div>
          ${filesHtml}
        </div>
      `;
    })
    .join("")}
  <script>
    window.onload = () => { window.print(); };
  </script>
</body>
</html>`;

    const w = window.open("", "_blank");
    if (!w) {
      toast({ title: "Popup bloqueado", description: "Permití popups para imprimir/guardar PDF." });
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

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

      {/* Controls */}
      <div className="w-full max-w-4xl rounded-2xl border bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-xl">
              Mostrando {shown} de {total}
            </Badge>

            <Button
              variant={expandAll ? "default" : "secondary"}
              size="sm"
              className="rounded-xl"
              onClick={() => setExpandAll((v) => !v)}
              disabled={shown === 0}
              title="Persistente (se guarda)"
            >
              {expandAll ? "Contraer todo" : "Expandir todo"}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl"
              onClick={exportCsv}
              disabled={shown === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>

            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl"
              onClick={printPdf}
              disabled={shown === 0}
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir / PDF
            </Button>

            {(query ||
              onlyWithFiles ||
              onlyWithNotes ||
              fromDate ||
              toDate ||
              sortMode !== "newest" ||
              jumpMonth) && (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl"
                onClick={resetFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Limpiar
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
            {!!query && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-800"
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Jump month */}
          <div className="md:col-span-3">
            <select
              value={jumpMonth}
              onChange={(e) => onJumpMonth(e.target.value)}
              className={cn(
                "w-full h-10 rounded-2xl border bg-white px-3 text-sm",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              )}
              disabled={monthOptions.length === 0}
            >
              <option value="">Ir a mes…</option>
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-muted-foreground">Jump rápido</p>
          </div>

          {/* Date range */}
          <div className="md:col-span-3 grid grid-cols-2 gap-2">
            <div>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-2xl"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">Desde</p>
            </div>
            <div>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-2xl"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">Hasta</p>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-6 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <Checkbox
                checked={onlyWithFiles}
                onCheckedChange={(v) => setOnlyWithFiles(!!v)}
              />
              Solo con adjuntos
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <Checkbox
                checked={onlyWithNotes}
                onCheckedChange={(v) => setOnlyWithNotes(!!v)}
              />
              Solo con notas
            </label>

            <Badge variant="outline" className="rounded-xl">
              Search optimizado ⚡
            </Badge>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="w-full max-w-4xl">
        {rows.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">
              {total === 0
                ? "No hay citas anteriores para este paciente."
                : "No hay resultados con esos filtros."}
            </p>
            {total > 0 && (
              <Button
                variant="secondary"
                className="mt-3 rounded-2xl"
                onClick={resetFilters}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Month floating */}
            {currentMonthLabel && (
              <div className="sticky top-0 z-20 mb-3">
                <div className="inline-flex items-center gap-2 rounded-2xl border bg-white/90 backdrop-blur px-3 py-2 shadow-sm">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Viendo:
                  </span>
                  <span className="text-xs font-semibold">{currentMonthLabel}</span>
                </div>
              </div>
            )}

            {/* Virtualized container */}
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
                          expandedIds={expandedIds}
                          toggleExpanded={toggleExpanded}
                          onDemoClick={onDemoClick}
                          query={deferredQuery}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
