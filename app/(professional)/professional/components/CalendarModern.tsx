"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Clock,
  ArrowUp,
  Target,
} from "lucide-react";

import { AppointmentsIncluded, Appointment, PatientsIncluded } from "@/interfaces";

dayjs.locale("es");

// ====== CONFIG ======
const DAY_START_HOUR = 8;
const DAY_END_HOUR = 18;
const STEP_MINUTES = 15;

const DEFAULT_APPT_MINUTES = 15;

// ✅ Zoom bounds (px por minuto)
const ZOOM_MIN = 1.25;
const ZOOM_MAX = 4.0;
const ZOOM_STEP = 0.25;

interface Props {
  appointments: AppointmentsIncluded[];
  patients?: PatientsIncluded[]; // opcional (ya no es necesario para render)
  isDemo?: boolean;
  refetch?: () => void;
  onOpenCreate: (dt: Date) => void;
  onOpenDetail: (appointmentId: string, dt: Date) => void;
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const roundToStep = (minutes: number, step: number) =>
  Math.round(minutes / step) * step;

function minutesFromDayStart(d: dayjs.Dayjs) {
  return (d.hour() - DAY_START_HOUR) * 60 + d.minute();
}

function getStart(a: Appointment) {
  return dayjs(a.schedule);
}

function getEnd(a: Appointment) {
  return getStart(a).add(DEFAULT_APPT_MINUTES, "minute");
}

type LayoutItem = {
  key: string;
  top: number;
  height: number;
  col: number;
  cols: number;
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  appt: AppointmentsIncluded;
};

function computeOverlapsLayout(
  items: { key: string; start: dayjs.Dayjs; end: dayjs.Dayjs; appt: AppointmentsIncluded }[],
  timelineMinutes: number,
  pxPerMin: number,
): LayoutItem[] {
  const sorted = [...items].sort((a, b) => a.start.valueOf() - b.start.valueOf());

  type Active = { key: string; end: dayjs.Dayjs; col: number; groupId: number };
  const active: Active[] = [];
  const placed = new Map<string, { col: number; groupId: number }>();
  const groupMaxCols = new Map<number, number>();
  let groupId = 0;

  for (const it of sorted) {
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].end.valueOf() <= it.start.valueOf()) active.splice(i, 1);
    }
    if (active.length === 0) groupId++;

    const used = new Set(active.map((a) => a.col));
    let col = 0;
    while (used.has(col)) col++;

    active.push({ key: it.key, end: it.end, col, groupId });
    placed.set(it.key, { col, groupId });

    const currentMax = groupMaxCols.get(groupId) ?? 0;
    groupMaxCols.set(groupId, Math.max(currentMax, active.length));
  }

  return sorted.map((it) => {
    const p = placed.get(it.key)!;
    const cols = groupMaxCols.get(p.groupId) ?? 1;

    const startMin = clamp(minutesFromDayStart(it.start), 0, timelineMinutes);
    const endMin = clamp(minutesFromDayStart(it.end), 0, timelineMinutes);

    const top = startMin * pxPerMin;
    const bottom = endMin * pxPerMin;

    return {
      key: it.key,
      top,
      height: Math.max(18, bottom - top),
      col: p.col,
      cols,
      start: it.start,
      end: it.end,
      appt: it.appt,
    };
  });
}

function buildMiniMonthDays(anchor: dayjs.Dayjs) {
  const startOfMonth = anchor.startOf("month");
  const endOfMonth = anchor.endOf("month");
  const start = startOfMonth.startOf("week");
  const end = endOfMonth.endOf("week");

  const days: dayjs.Dayjs[] = [];
  let d = start;
  while (d.isBefore(end) || d.isSame(end, "day")) {
    days.push(d);
    d = d.add(1, "day");
  }
  return { startOfMonth, days };
}

function FabButton({
  icon,
  label,
  onClick,
  disabled,
  title,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        "flex items-center gap-2 rounded-full px-3 py-2 shadow-lg border",
        "backdrop-blur bg-white/90 border-black/10 text-slate-800",
        "hover:bg-white transition active:scale-[0.99]",
        "focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/50",
        disabled ? "opacity-50 cursor-not-allowed hover:bg-white" : "",
      ].join(" ")}
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function FabIconButton({
  icon,
  onClick,
  disabled,
  title,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        "h-11 w-11 rounded-full shadow-lg border",
        "backdrop-blur bg-white/90 border-black/10 text-slate-800",
        "hover:bg-white transition active:scale-[0.99]",
        "focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/50",
        "grid place-items-center",
        disabled ? "opacity-50 cursor-not-allowed hover:bg-white" : "",
      ].join(" ")}
    >
      {icon}
    </button>
  );
}

export default function CalendarModern({
  appointments,
  refetch,
  onOpenCreate,
  onOpenDetail,
}: Props) {
  const [anchor, setAnchor] = useState(dayjs());
  const [selectedDateLocal, setSelectedDateLocal] = useState<Date>(() => new Date());

  // ✅ Zoom state (px por minuto)
  const [pxPerMin, setPxPerMin] = useState<number>(2);

  const selectedDay = useMemo(() => dayjs(selectedDateLocal), [selectedDateLocal]);

  const weekDays = useMemo(() => {
    const start = anchor.startOf("week");
    return Array.from({ length: 7 }, (_, i) => start.add(i, "day"));
  }, [anchor]);

  // (sigue existiendo para desktop sidebar)
  const { startOfMonth, days: miniMonthDays } = useMemo(
    () => buildMiniMonthDays(anchor),
    [anchor],
  );

  const timelineMinutes = (DAY_END_HOUR - DAY_START_HOUR + 1) * 60;
  const timelineHeight = timelineMinutes * pxPerMin;

  const dayAppointments = useMemo(() => {
    return appointments.filter((a) =>
      dayjs(a.appointment.schedule).isSame(selectedDay, "day"),
    );
  }, [appointments, selectedDay]);

  const layoutItems = useMemo(() => {
    const rangeStart = selectedDay.hour(DAY_START_HOUR).minute(0);
    const rangeEnd = selectedDay.hour(DAY_END_HOUR).minute(59);

    const raw = dayAppointments
      .map((a) => {
        const start = getStart(a.appointment);
        const end = getEnd(a.appointment);
        return { key: a.appointment.id, start, end, appt: a };
      })
      .filter(({ start, end }) => end.isAfter(rangeStart) && start.isBefore(rangeEnd));

    return computeOverlapsLayout(raw, timelineMinutes, pxPerMin);
  }, [dayAppointments, selectedDay, timelineMinutes, pxPerMin]);

  const isToday = selectedDay.isSame(dayjs(), "day");

  const nowLineTop = useMemo(() => {
    if (!isToday) return null;
    const now = dayjs();
    const mins = clamp(minutesFromDayStart(now), 0, timelineMinutes);
    return mins * pxPerMin;
  }, [isToday, timelineMinutes, pxPerMin]);

  const gridScrollRef = useRef<HTMLDivElement | null>(null);
  const gridInnerRef = useRef<HTMLDivElement | null>(null);

  const scrollToMinuteOffset = (minsFromStart: number) => {
    const scroller = gridScrollRef.current;
    if (!scroller) return;
    const topPx = clamp(minsFromStart, 0, timelineMinutes) * pxPerMin;

    // lo centramos un poco para que se vea contexto alrededor
    const targetTop = Math.max(0, topPx - scroller.clientHeight * 0.35);
    scroller.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  const scrollToStart = () => scrollToMinuteOffset(0);

  const scrollToNow = () => {
    if (!isToday) return;
    const now = dayjs();
    const mins = clamp(minutesFromDayStart(now), 0, timelineMinutes);
    scrollToMinuteOffset(mins);
  };

  // ✅ Auto-scroll al abrir: "ahora" si es hoy, sino inicio
  const didAutoScrollRef = useRef<string>("");
  useEffect(() => {
    const key = `${selectedDay.format("YYYY-MM-DD")}::${pxPerMin}`;
    if (didAutoScrollRef.current === key) return;

    const t = window.setTimeout(() => {
      if (isToday) scrollToNow();
      else scrollToStart();
      didAutoScrollRef.current = key;
    }, 60);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay, pxPerMin, isToday]);

  const openCreateAt = (day: dayjs.Dayjs, hour: number, minute: number) => {
    const dt = day.hour(hour).minute(minute).second(0).millisecond(0).toDate();
    onOpenCreate(dt);
  };

  const openDetail = (apptId: string, start: dayjs.Dayjs) => {
    onOpenDetail(apptId, start.toDate());
  };

  const handleGridClick = (e: React.MouseEvent) => {
    if (!gridInnerRef.current || !gridScrollRef.current) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-appt]")) return;

    const rect = gridInnerRef.current.getBoundingClientRect();
    const scrollTop = gridScrollRef.current.scrollTop;
    const y = e.clientY - rect.top + scrollTop;

    const mins = clamp(Math.round(y / pxPerMin), 0, timelineMinutes);
    const rounded = roundToStep(mins, STEP_MINUTES);

    const hour = DAY_START_HOUR + Math.floor(rounded / 60);
    const minute = rounded % 60;

    openCreateAt(selectedDay, hour, minute);
  };

  const handlePrev = () => setAnchor((a) => a.subtract(1, "week"));
  const handleNext = () => setAnchor((a) => a.add(1, "week"));

  const goToday = () => {
    const t = dayjs();
    setAnchor(t);
    setSelectedDateLocal(t.hour(0).minute(0).second(0).millisecond(0).toDate());
  };

  const selectDayOnly = (d: dayjs.Dayjs) => {
    setSelectedDateLocal(d.hour(0).minute(0).second(0).millisecond(0).toDate());
  };

  // ✅ Zoom controls
  const zoomIn = () =>
    setPxPerMin((p) => clamp(Number((p + ZOOM_STEP).toFixed(2)), ZOOM_MIN, ZOOM_MAX));
  const zoomOut = () =>
    setPxPerMin((p) => clamp(Number((p - ZOOM_STEP).toFixed(2)), ZOOM_MIN, ZOOM_MAX));
  const resetZoom = () => setPxPerMin(2);

  // ✅ Pinch-to-zoom (touch) en grilla
  const pinchRef = useRef<{
    active: boolean;
    startDist: number;
    startZoom: number;
    lastApplied: number;
  }>({ active: false, startDist: 0, startZoom: 2, lastApplied: 2 });

  const getTouchDist = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.hypot(dx, dy);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 2) return;
    pinchRef.current.active = true;
    pinchRef.current.startDist = getTouchDist(e.touches[0], e.touches[1]);
    pinchRef.current.startZoom = pxPerMin;
    pinchRef.current.lastApplied = pxPerMin;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!pinchRef.current.active || e.touches.length !== 2) return;
    e.preventDefault();

    const dist = getTouchDist(e.touches[0], e.touches[1]);
    if (pinchRef.current.startDist <= 0) return;

    const ratio = dist / pinchRef.current.startDist;
    const next = clamp(pinchRef.current.startZoom * ratio, ZOOM_MIN, ZOOM_MAX);

    const rounded = Number((Math.round(next / 0.05) * 0.05).toFixed(2));
    if (Math.abs(rounded - pinchRef.current.lastApplied) >= 0.05) {
      pinchRef.current.lastApplied = rounded;
      setPxPerMin(rounded);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      pinchRef.current.active = false;
      pinchRef.current.startDist = 0;
    }
  };

  return (
    <div className="h-dvh w-full bg-white text-slate-600">
      {/* TOP BAR */}
      <div className="sticky top-0 z-30 bg-white backdrop-blur border-b border-black/10">
        <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={goToday}
              className="hidden sm:inline-flex text-xs px-3 py-1.5 rounded-full border border-slate-500 hover:bg-black/5"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full hover:bg-black/5"
              aria-label="Semana anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full hover:bg-black/5"
              aria-label="Semana siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-3 sm:px-4 pb-3 flex items-center justify-between">
          <div className="text-sm sm:text-base text-slate-600 capitalize">
            {selectedDay.format("MMMM D, YYYY")}
          </div>
          <button
            onClick={goToday}
            className="sm:hidden text-xs px-3 py-1.5 rounded-full border text-slate-700 border-black/10 hover:bg-black/5"
          >
            Hoy
          </button>
        </div>

        {/* WEEK STRIP */}
        <div className="px-3 sm:px-4 pb-3">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((d) => {
              const isSel = d.isSame(selectedDay, "day");
              const isT = d.isSame(dayjs(), "day");
              const count = appointments.filter((a) =>
                dayjs(a.appointment.schedule).isSame(d, "day"),
              ).length;

              return (
                <button
                  key={d.format("YYYY-MM-DD")}
                  onClick={() => selectDayOnly(d)}
                  className={[
                    "rounded-xl border px-2 py-2 text-left transition-all",
                    "border-black/10 hover:bg-black/5",
                    isSel ? "bg-[#1a73e8] border-[#1a73e8] text-white" : "bg-transparent",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] sm:text-xs uppercase">{d.format("ddd")}</div>
                    {isT && !isSel && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5">
                        hoy
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-end justify-between">
                    <div className="text-base sm:text-lg font-semibold leading-none">
                      {d.format("D")}
                    </div>
                    {count > 0 && (
                      <div
                        className={[
                          "text-[12px] px-2 py-0.5 rounded-full",
                          isSel ? "bg-white/20" : "bg-[#1a73e8] text-white",
                        ].join(" ")}
                      >
                        {count}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="h-[calc(100dvh-170px)] sm:h-[calc(100dvh-190px)] flex min-h-0">
        {/* SIDEBAR (desktop only) */}
        <aside className="hidden lg:flex w-[320px] min-w-[320px] border-r border-black/10 p-4 flex-col gap-4">
          <button
            onClick={() =>
              onOpenCreate(
                selectedDay
                  .hour(DAY_START_HOUR)
                  .minute(0)
                  .second(0)
                  .millisecond(0)
                  .toDate(),
              )
            }
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white hover:bg-black/5 border border-black/10"
          >
            <span className="font-medium">+ Create</span>
            <span className="text-xs text-slate-600">{DEFAULT_APPT_MINUTES} min</span>
          </button>

          {/* Mini Month (solo desktop) */}
          <div className="rounded-2xl border border-black/10 bg-white p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold capitalize">{anchor.format("MMMM YYYY")}</div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAnchor((a) => a.subtract(1, "month"))}
                  className="p-1.5 rounded-full hover:bg-black/5"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAnchor((a) => a.add(1, "month"))}
                  className="p-1.5 rounded-full hover:bg-black/5"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-[12px] text-slate-600 mb-2">
              {["D", "L", "M", "M", "J", "V", "S"].map((x, idx) => (
                <div key={`${x}-${idx}`} className="text-center">
                  {x}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {miniMonthDays.map((d) => {
                const inMonth = d.isSame(startOfMonth, "month");
                const isSel = d.isSame(selectedDay, "day");
                const isT = d.isSame(dayjs(), "day");

                return (
                  <button
                    key={d.format("YYYY-MM-DD")}
                    onClick={() => selectDayOnly(d)}
                    className={[
                      "h-8 rounded-lg text-xs transition",
                      inMonth ? "text-slate-500" : "text-slate-300",
                      isSel ? "bg-[#1a73e8] text-white" : "hover:bg-black/5",
                      isT && !isSel ? "border border-black/10" : "border border-transparent",
                    ].join(" ")}
                  >
                    {d.date()}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* DAY GRID (responsive) */}
        <main className="flex-1 min-w-0 relative">
          <div className="h-full px-2 sm:px-4 py-3 min-h-0">
            <div className="h-full rounded-2xl border border-black/10 bg-white overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-black/10 bg-white flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-xs text-slate-600">Día</div>
                  <div className="text-sm sm:text-base font-semibold capitalize truncate">
                    {selectedDay.format("dddd, D MMMM")}
                  </div>
                </div>
                <div className="text-xs text-slate-600">GMT-03</div>
              </div>

              <div className="flex-1 min-h-0">
                <div ref={gridScrollRef} className="h-full overflow-y-auto">
                  <div className="grid grid-cols-[56px_1fr] sm:grid-cols-[72px_1fr]">
                    {/* ✅ Sticky hours column */}
                    <div className="border-r border-black/10 mt-3 bg-white sticky left-0 z-30">
                      <div style={{ height: timelineHeight }} className="relative">
                        {Array.from(
                          { length: DAY_END_HOUR - DAY_START_HOUR + 1 },
                          (_, i) => DAY_START_HOUR + i,
                        ).map((h) => {
                          const top = (h - DAY_START_HOUR) * 60 * pxPerMin;
                          return (
                            <div
                              key={h}
                              className="absolute left-0 w-full pr-2 sm:pr-3 text-right text-[10px] sm:text-[11px] text-slate-600"
                              style={{ top: top - 7 }}
                            >
                              {String(h).padStart(2, "0")}:00
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Grid */}
                    <div
                      className="relative"
                      onClick={handleGridClick}
                      onTouchStart={onTouchStart}
                      onTouchMove={onTouchMove}
                      onTouchEnd={onTouchEnd}
                      // ✅ importante para que preventDefault funcione en touchMove
                      style={{ touchAction: "none" }}
                      title="Tap para crear • Pinch para zoom"
                    >
                      <div ref={gridInnerRef} className="relative" style={{ height: timelineHeight }}>
                        {/* Lines */}
                        {Array.from({ length: Math.ceil(timelineMinutes / STEP_MINUTES) + 1 }).map((_, idx) => {
                          const top = idx * STEP_MINUTES * pxPerMin;
                          const isHour = idx % (60 / STEP_MINUTES) === 0;
                          return (
                            <div
                              key={idx}
                              className="absolute left-0 right-0"
                              style={{
                                top,
                                borderTop: isHour ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(0,0,0,0.06)",
                              }}
                            />
                          );
                        })}

                        {/* Now line */}
                        {nowLineTop !== null && (
                          <div className="absolute left-0 right-0 z-20" style={{ top: nowLineTop }}>
                            <div className="relative">
                              <div className="border-t border-red-500" />
                              <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-red-500" />
                            </div>
                          </div>
                        )}

                        {/* Appointments blocks */}
                        {layoutItems.map((it) => {
                          const widthPct = 100 / it.cols;
                          const leftPct = it.col * widthPct;

                          const startLabel = it.start.format("HH:mm");
                          const endLabel = it.end.format("HH:mm");
                          const reason = it.appt.appointment.reason?.trim() || "Turno";
                          const patientName = it.appt.patient
                            ? `${it.appt.patient.firstName ?? ""} ${it.appt.patient.lastName ?? ""}`.trim()
                            : "Paciente";

                          return (
                            <div
                              key={it.key}
                              data-appt
                              className="absolute z-10 px-1.5 sm:px-2"
                              style={{
                                top: it.top,
                                height: it.height,
                                left: `${leftPct}%`,
                                width: `${widthPct}%`,
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDetail(it.appt.appointment.id, it.start);
                                }}
                                className={[
                                  "h-full w-full rounded-xl text-left p-2",
                                  "border border-[#1a73e8]/40 bg-[#1a73e8]/15 hover:bg-[#1a73e8]/25",
                                  "transition shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/60",
                                ].join(" ")}
                              >
                                <div className="text-[11px] font-semibold text-slate-700 line-clamp-1">
                                  {patientName}
                                </div>
                                <div className="text-[11px] text-slate-600 line-clamp-1">
                                  {reason}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-slate-600 mt-0.5">
                                  {startLabel} – {endLabel}
                                </div>

                                {/* ✅ Mostrar notas solo si el bloque tiene altura suficiente */}
                                {it.height >= 56 && it.appt.appointment.notes && (
                                  <div className="mt-1 text-[10px] text-slate-600 line-clamp-2">
                                    {it.appt.appointment.notes}
                                  </div>
                                )}
                              </button>
                            </div>
                          );
                        })}

                        <div className="absolute left-0 right-0 bottom-2 text-center text-xs text-slate-400 pointer-events-none">
                          Tap para crear • Pinch para zoom • Duración {DEFAULT_APPT_MINUTES} min
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile quick action */}
              <div className="lg:hidden border-t border-black/10 bg-white px-3 py-2 flex items-center justify-between">
                <button
                  onClick={() => openCreateAt(selectedDay, DAY_START_HOUR, 0)}
                  className="px-4 py-2 rounded-full bg-[#1a73e8] text-white text-sm font-medium"
                >
                  + Crear (15 min)
                </button>
                <div className="text-xs text-slate-500">{selectedDay.format("ddd D")}</div>
              </div>
            </div>
          </div>

          {/* ✅ FLOATING CONTROLS (todas las pantallas) */}
          <div className="fixed right-4 bottom-4 z-[60] flex flex-col gap-2">
            {/* Jump buttons */}
            <FabButton
              icon={<ArrowUp className="w-4 h-4" />}
              label="Inicio"
              onClick={scrollToStart}
              title="Ir al inicio del día"
            />

            <FabButton
              icon={<Clock className="w-4 h-4" />}
              label="Ahora"
              onClick={scrollToNow}
              disabled={!isToday}
              title={isToday ? "Ir al horario actual" : "Disponible solo para hoy"}
            />

            {/* Zoom cluster */}
            <div className="flex items-center gap-2 justify-end">
              <FabIconButton
                icon={<Minus className="w-5 h-5" />}
                onClick={zoomOut}
                title="Zoom -"
              />

              <FabButton
                icon={<Target className="w-4 h-4" />}
                label={`${Math.round((pxPerMin / 2) * 100)}%`}
                onClick={resetZoom}
                title="Reset zoom"
              />

              <FabIconButton
                icon={<Plus className="w-5 h-5" />}
                onClick={zoomIn}
                title="Zoom +"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
