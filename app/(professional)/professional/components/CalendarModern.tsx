"use client";

import React, { useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { ChevronLeft, ChevronRight, Search, Settings2 } from "lucide-react";

import { AppointmentsIncluded, Appointment, PatientsIncluded } from "@/interfaces";
import AppointmentsList from "../appointments/components/AppointmentsList"; // ajustá path real

dayjs.locale("es");

// ====== CONFIG ======
const DAY_START_HOUR = 8;
const DAY_END_HOUR = 18;
const STEP_MINUTES = 15;

const DEFAULT_APPT_MINUTES = 15;
const PX_PER_MIN = 2;

interface Props {
  appointments: AppointmentsIncluded[];
  patients: PatientsIncluded[];
  isDemo?: boolean;
  refetch?: () => void;

  // ✅ CONTROLADO POR EL PADRE
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
  timelineMinutes: number
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

    const top = startMin * PX_PER_MIN;
    const bottom = endMin * PX_PER_MIN;

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

export default function CalendarModern({
  appointments,
  patients,
  refetch,
  onOpenCreate,
  onOpenDetail,
}: Props) {
  const [anchor, setAnchor] = useState(dayjs());
  const [selectedDateLocal, setSelectedDateLocal] = useState<Date>(() => new Date());

  const selectedDay = useMemo(() => dayjs(selectedDateLocal), [selectedDateLocal]);

  const weekDays = useMemo(() => {
    const start = anchor.startOf("week");
    return Array.from({ length: 7 }, (_, i) => start.add(i, "day"));
  }, [anchor]);

  const { startOfMonth, days: miniMonthDays } = useMemo(() => buildMiniMonthDays(anchor), [anchor]);

  const timelineMinutes = (DAY_END_HOUR - DAY_START_HOUR + 1) * 60;
  const timelineHeight = timelineMinutes * PX_PER_MIN;

  const dayAppointments = useMemo(() => {
    return appointments.filter((a) => dayjs(a.appointment.schedule).isSame(selectedDay, "day"));
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

    return computeOverlapsLayout(raw, timelineMinutes);
  }, [dayAppointments, selectedDay, timelineMinutes]);

  const isToday = selectedDay.isSame(dayjs(), "day");
  const nowLineTop = useMemo(() => {
    if (!isToday) return null;
    const now = dayjs();
    const mins = clamp(minutesFromDayStart(now), 0, timelineMinutes);
    return mins * PX_PER_MIN;
  }, [isToday, timelineMinutes]);

  const gridScrollRef = useRef<HTMLDivElement | null>(null);
  const gridInnerRef = useRef<HTMLDivElement | null>(null);

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

    const mins = clamp(Math.round(y / PX_PER_MIN), 0, timelineMinutes);
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

  return (
    <div className="h-dvh w-full bg-[#262626] text-slate-100">
      {/* TOP BAR */}
      <div className="sticky top-0 z-30 bg-[#262626]/95 backdrop-blur border-b border-white/10">
        <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={goToday}
              className="hidden sm:inline-flex text-xs px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={handlePrev} className="p-2 rounded-full hover:bg-white/5" aria-label="Semana anterior">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNext} className="p-2 rounded-full hover:bg-white/5" aria-label="Semana siguiente">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/5" aria-label="Buscar">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/5" aria-label="Ajustes">
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-3 sm:px-4 pb-3 flex items-center justify-between">
          <div className="text-sm sm:text-base text-slate-200 capitalize">
            {selectedDay.format("MMMM D, YYYY")}
          </div>
          <button
            onClick={goToday}
            className="sm:hidden text-xs px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5"
          >
            Today
          </button>
        </div>

        {/* WEEK STRIP */}
        <div className="px-3 sm:px-4 pb-3">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((d) => {
              const isSel = d.isSame(selectedDay, "day");
              const isT = d.isSame(dayjs(), "day");
              const count = appointments.filter((a) => dayjs(a.appointment.schedule).isSame(d, "day")).length;

              return (
                <button
                  key={d.toString()}
                  onClick={() => selectDayOnly(d)}
                  className={[
                    "rounded-xl border px-2 py-2 text-left transition-all",
                    "border-white/10 hover:bg-white/5",
                    isSel ? "bg-[#1a73e8] border-[#1a73e8]" : "bg-transparent",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] sm:text-xs uppercase text-slate-200">{d.format("ddd")}</div>
                    {isT && !isSel && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10">hoy</span>
                    )}
                  </div>
                  <div className="mt-1 flex items-end justify-between">
                    <div className="text-base sm:text-lg font-semibold leading-none">{d.format("D")}</div>
                    {count > 0 && (
                      <div className={["text-[10px] px-2 py-0.5 rounded-full", isSel ? "bg-white/20" : "bg-[#1a73e8]/20 text-[#8ab4f8]"].join(" ")}>
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
        {/* SIDEBAR (desktop) */}
        <aside className="hidden lg:flex w-[320px] min-w-[320px] border-r border-white/10 p-4 flex-col gap-4">
          <button
            onClick={() => openCreateAt(selectedDay, DAY_START_HOUR, 0)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10"
          >
            <span className="font-medium">+ Create</span>
            <span className="text-xs text-slate-300">{DEFAULT_APPT_MINUTES} min</span>
          </button>

          {/* Mini Month */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold capitalize">{anchor.format("MMMM YYYY")}</div>
              <div className="flex items-center gap-1">
                <button onClick={() => setAnchor((a) => a.subtract(1, "month"))} className="p-1.5 rounded-full hover:bg-white/10">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setAnchor((a) => a.add(1, "month"))} className="p-1.5 rounded-full hover:bg-white/10">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-[10px] text-slate-300 mb-2">
              {["D", "L", "M", "M", "J", "V", "S"].map((x) => (
                <div key={x} className="text-center">{x}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {miniMonthDays.map((d) => {
                const inMonth = d.isSame(startOfMonth, "month");
                const isSel = d.isSame(selectedDay, "day");
                const isT = d.isSame(dayjs(), "day");

                return (
                  <button
                    key={d.toString()}
                    onClick={() => selectDayOnly(d)}
                    className={[
                      "h-8 rounded-lg text-xs transition",
                      inMonth ? "text-slate-100" : "text-slate-400/60",
                      isSel ? "bg-[#1a73e8]" : "hover:bg-white/10",
                      isT && !isSel ? "border border-white/20" : "border border-transparent",
                    ].join(" ")}
                  >
                    {d.date()}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* DAY VIEW HYBRID */}
        <main className="flex-1 min-w-0">
          <div className="h-full px-2 sm:px-4 py-3 min-h-0">
            <div className="h-full rounded-2xl border border-white/10 bg-[#0f1620] overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-white/10 bg-[#262626] flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-xs text-slate-300">Day</div>
                  <div className="text-sm sm:text-base font-semibold capitalize truncate">
                    {selectedDay.format("dddd, D MMMM")}
                  </div>
                </div>
                <div className="text-xs text-slate-300">GMT-03</div>
              </div>

              {/* ✅ MOBILE/TABLET: LIST VIEW (intervalos 15m) */}
              <div className="flex-1 min-h-0 overflow-y-auto lg:hidden px-2 sm:px-4 py-3">
                <AppointmentsList
                  appointments={appointments}
                  patients={patients}
                  selectedDate={selectedDay.toDate()}
                  refetch={refetch}
                  onAddAppointment={(datetime) => onOpenCreate(datetime)}
                  onSelectAppointment={(id) => {
                    const appt = appointments.find((a) => a.appointment.id === id);
                    const dt = appt ? new Date(appt.appointment.schedule) : selectedDay.toDate();
                    onOpenDetail(id, dt);
                  }}
                />
              </div>

              {/* ✅ DESKTOP: GRID VIEW (visual + overlaps) */}
              <div className="hidden lg:block flex-1 min-h-0">
                <div ref={gridScrollRef} className="h-full overflow-y-auto">
                  <div className="grid grid-cols-[72px_1fr]">
                    {/* Hours */}
                    <div className="relative border-r border-white/10 mt-3 bg-[#0f1620]">
                      <div style={{ height: timelineHeight }} className="relative">
                        {Array.from({ length: DAY_END_HOUR - DAY_START_HOUR + 1 }, (_, i) => DAY_START_HOUR + i).map((h) => {
                          const top = (h - DAY_START_HOUR) * 60 * PX_PER_MIN;
                          return (
                            <div
                              key={h}
                              className="absolute left-0 w-full pr-3 text-right text-[11px] text-slate-300"
                              style={{ top: top - 7 }}
                            >
                              {String(h).padStart(2, "0")}:00
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Grid */}
                    <div className="relative" onClick={handleGridClick}>
                      <div ref={gridInnerRef} className="relative" style={{ height: timelineHeight }}>
                        {/* Lines */}
                        {Array.from({ length: Math.ceil(timelineMinutes / STEP_MINUTES) + 1 }).map((_, idx) => {
                          const top = idx * STEP_MINUTES * PX_PER_MIN;
                          const isHour = idx % (60 / STEP_MINUTES) === 0;
                          return (
                            <div
                              key={idx}
                              className="absolute left-0 right-0"
                              style={{
                                top,
                                borderTop: isHour ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.06)",
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
                          const title = it.appt.appointment.reason?.trim() || "Turno";

                          return (
                            <div
                              key={it.key}
                              data-appt
                              className="absolute z-10 px-2"
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
                                <div className="text-[11px] font-semibold text-slate-100 line-clamp-1">{title}</div>
                                <div className="text-[11px] text-slate-200/90">
                                  {startLabel} – {endLabel}
                                </div>
                                {it.appt.appointment.notes && (
                                  <div className="mt-1 text-[10px] text-slate-300/80 line-clamp-2">
                                    {it.appt.appointment.notes}
                                  </div>
                                )}
                              </button>
                            </div>
                          );
                        })}

                        <div className="absolute left-0 right-0 bottom-2 text-center text-xs text-slate-400 pointer-events-none">
                          Click para crear turno (duración default {DEFAULT_APPT_MINUTES} min)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile quick action */}
              <div className="lg:hidden border-t border-white/10 bg-[#0f1620] px-3 py-2 flex items-center justify-between">
                <button
                  onClick={() => openCreateAt(selectedDay, DAY_START_HOUR, 0)}
                  className="px-4 py-2 rounded-full bg-[#1a73e8] text-white text-sm font-medium"
                >
                  + Crear (15 min)
                </button>
                <div className="text-xs text-slate-300">{selectedDay.format("ddd D")}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
