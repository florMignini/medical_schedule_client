"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  CalendarClock,
  ClipboardList,
  FileText,
  Stethoscope,
  UserRound,
  RefreshCcw,
  Plus,
  Pencil,
  CheckCircle2,
} from "lucide-react";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import AppointmentsList from "./AppointmentsList";
import NewAppointmentForm from "@/components/forms/NewAppointmentForm";
import PastAppointmentForm from "@/components/forms/PastAppointmentForm";
import { AppointmentsIncluded, PatientsIncluded } from "@/interfaces";
import PastAppointmentDetailCard from "./PastAppointmentDetailCard";

type PanelView = "list" | "create" | "detail" | "past";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null | undefined;
  appointments: AppointmentsIncluded[];

  /** ✅ Solo para crear (NewAppointmentForm) */
  patientsForCreate: PatientsIncluded[];

  refetch?: () => void;
  selectedAppointmentId?: string | null;
};

function Badge({
  variant = "neutral",
  children,
}: {
  variant?: "neutral" | "success" | "warning";
  children: React.ReactNode;
}) {
  const cls =
    variant === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : variant === "warning"
        ? "bg-amber-50 text-amber-800 border-amber-200"
        : "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}
    >
      {children}
    </span>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-gray-600">{icon}</div>
        <div className="text-sm font-semibold text-gray-900">{title}</div>
      </div>
      {children}
    </div>
  );
}

export default function AppointmentSlidePanel({
  isOpen,
  onClose,
  selectedDate,
  appointments,
  patientsForCreate,
  refetch,
  selectedAppointmentId = null,
}: Props) {
  const [activeDateTime, setActiveDateTime] = useState<Date | null>(null);
  const [view, setView] = useState<PanelView>("list");

  useEffect(() => {
    if (selectedDate) setActiveDateTime(new Date(selectedDate));
  }, [selectedDate]);

  const selectedAppointment = useMemo(() => {
    if (!selectedAppointmentId) return null;
    return (
      appointments.find((x) => x.appointment.id === selectedAppointmentId) ??
      null
    );
  }, [appointments, selectedAppointmentId]);

  useEffect(() => {
    if (selectedAppointmentId && selectedAppointment) {
      setView("detail");
    } else {
      if (view === "detail" || view === "past") setView("list");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAppointmentId, selectedAppointment]);

  const filteredAppointments = useMemo(() => {
    if (!activeDateTime) return [];
    const day = dayjs(activeDateTime).startOf("day");
    return appointments
      .filter(({ appointment }) => dayjs(appointment.schedule).isSame(day, "day"))
      .sort(
        (a, b) =>
          dayjs(a.appointment.schedule).valueOf() -
          dayjs(b.appointment.schedule).valueOf(),
      );
  }, [appointments, activeDateTime]);

  /** ✅ Ahora viene plano del backend */
  const resolvedPatient = useMemo(() => {
    return selectedAppointment?.patient ?? null;
  }, [selectedAppointment]);

  const goList = () => setView("list");
  const goCreate = () => setView("create");
  const goDetail = () => setView("detail");
  const goPast = () => setView("past");

  const headerTitle = useMemo(() => {
    if (!activeDateTime && !selectedAppointment) return "Turnos";
    if (view === "create") return "Nuevo turno";
    if (view === "past") return "Finalizar cita (Evolución)";
    if (view === "detail") return "Detalle del turno";
    return `Turnos del ${dayjs(
      activeDateTime ?? selectedAppointment?.appointment.schedule,
    ).format("DD/MM/YYYY")}`;
  }, [activeDateTime, selectedAppointment, view]);

  const headerSubtitle = useMemo(() => {
    if (view === "detail" && selectedAppointment) {
      const dt = dayjs(selectedAppointment.appointment.schedule);
      const hasPast = !!selectedAppointment.appointment.pastAppointment?.id;
      return `${dt.format("DD/MM/YYYY HH:mm")} • ${hasPast ? "Evolución cargada" : "Evolución pendiente"}`;
    }
    if (view === "list" && activeDateTime) {
      return `${dayjs(activeDateTime).format("DD/MM/YYYY")} • ${filteredAppointments.length} turno(s)`;
    }
    return "";
  }, [view, selectedAppointment, activeDateTime, filteredAppointments.length]);

  const canRender = isOpen && (activeDateTime || selectedAppointment);

  return (
    <AnimatePresence>
      {canRender && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.aside
            key={`panel-${selectedAppointmentId ?? activeDateTime?.getTime() ?? "none"}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 24,
              mass: 0.65,
            }}
            className="fixed top-0 right-0 z-50 h-dvh w-[100vw] max-w-full sm:max-w-[760px]
                       bg-white text-black shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  {(view === "create" || view === "detail" || view === "past") && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (view === "past") return goDetail();
                        if (view === "detail") return goList();
                        return goList();
                      }}
                      className="h-9 px-2 rounded-xl"
                      title="Volver"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  )}

                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-gray-900 truncate">
                      {headerTitle}
                    </h2>
                    {headerSubtitle ? (
                      <div className="text-xs text-gray-500 truncate">
                        {headerSubtitle}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {refetch && (
                    <Button
                      variant="ghost"
                      onClick={() => refetch?.()}
                      className="h-9 px-2 rounded-xl"
                      title="Refrescar"
                    >
                      <RefreshCcw className="w-4 h-4 text-gray-600" />
                    </Button>
                  )}

                  <button
                    aria-label="Cerrar panel"
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {(view === "list" || view === "detail") && (
                <div className="px-4 pb-3 flex items-center gap-2">
                  {view === "list" && (
                    <Button
                      onClick={() => {
                        const base = dayjs(activeDateTime ?? new Date())
                          .hour(8)
                          .minute(0)
                          .second(0)
                          .millisecond(0);
                        setActiveDateTime(base.toDate());
                        goCreate();
                      }}
                      className="rounded-xl"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Crear turno
                    </Button>
                  )}

                  {view === "detail" && selectedAppointment && (
                    <Button
                      onClick={goPast}
                      className="rounded-xl"
                      variant={
                        selectedAppointment.appointment.pastAppointment?.id
                          ? "secondary"
                          : "default"
                      }
                    >
                      {selectedAppointment.appointment.pastAppointment?.id ? (
                        <>
                          <Pencil className="w-4 h-4 mr-2" />
                          Editar evolución
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Finalizar cita
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4">
              <AnimatePresence mode="wait">
                {/* LIST */}
                {view === "list" && (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-[600px] mx-auto space-y-4"
                  >
                    <AppointmentsList
                      appointments={filteredAppointments}
                      selectedDate={activeDateTime ?? new Date()}
                      onAddAppointment={(datetime) => {
                        setActiveDateTime(datetime);
                        goCreate();
                      }}
                      onSelectAppointment={() => {
                        // lo maneja el padre via selectedAppointmentId
                      }}
                    />

                    <div className="pt-1">
                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900">
                            Tip rápido
                          </div>
                          <div className="text-xs text-gray-600">
                            Abrí un turno para ver paciente y evolución en detalle.
                          </div>
                        </div>
                        <CalendarClock className="w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* CREATE */}
                {view === "create" && activeDateTime && (
                  <motion.div
                    key={`create-${activeDateTime.getTime()}`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full max-w-[600px] mx-auto"
                  >
                    <NewAppointmentForm
                      type="create"
                      patientsList={patientsForCreate}
                      initialDateTime={activeDateTime}
                      onSuccess={() => {
                        refetch?.();
                        goList();
                      }}
                      component="calendar"
                    />
                  </motion.div>
                )}

                {/* DETAIL */}
                {view === "detail" && selectedAppointment && (
                  <motion.div
                    key={`detail-${selectedAppointment.appointment.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-[600px] mx-auto space-y-4"
                  >
                    {/* Paciente */}
                    <Section icon={<UserRound className="w-4 h-4" />} title="Paciente">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-base font-semibold text-gray-900 truncate">
                            {resolvedPatient
                              ? `${resolvedPatient.firstName ?? ""} ${resolvedPatient.lastName ?? ""}`.trim()
                              : "—"}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            {resolvedPatient?.identityNumber && <Badge>DNI: {resolvedPatient?.identityNumber}</Badge>}
                            {resolvedPatient?.phone && <Badge>Tel: {resolvedPatient.phone}</Badge>}
                            {resolvedPatient?.email && <Badge>{resolvedPatient.email}</Badge>}
                          </div>
                        </div>

                        {selectedAppointment.appointment.pastAppointment?.id ? (
                          <Badge variant="success">Cita finalizada</Badge>
                        ) : (
                          <Badge variant="warning">Pendiente</Badge>
                        )}
                      </div>
                    </Section>

                    {/* Turno */}
                    <Section icon={<ClipboardList className="w-4 h-4" />} title="Turno">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-xs text-gray-500">Horario</div>
                            <div className="text-lg font-semibold text-gray-900">
                              {dayjs(selectedAppointment.appointment.schedule).format("DD/MM/YYYY HH:mm")}
                            </div>
                          </div>
                          <Badge>
                            Motivo: {selectedAppointment.appointment.reason?.trim() || "—"}
                          </Badge>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500">Notas</div>
                          <div className="text-sm text-gray-900 whitespace-pre-wrap">
                            {selectedAppointment.appointment.notes || "—"}
                          </div>
                        </div>

                        {selectedAppointment.appointment.cancellationReason && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                            <div className="text-xs font-semibold text-amber-900">
                              Motivo de cancelación
                            </div>
                            <div className="text-sm text-amber-900 whitespace-pre-wrap">
                              {selectedAppointment.appointment.cancellationReason}
                            </div>
                          </div>
                        )}
                      </div>
                    </Section>

                    {/* Evolución */}
                    <Section icon={<Stethoscope className="w-4 h-4" />} title="Evolución">
                      {selectedAppointment.appointment.pastAppointment?.id ? (
                        <PastAppointmentDetailCard
                          pastAppointment={selectedAppointment.appointment.pastAppointment}
                          onEdit={goPast}
                        />
                      ) : (
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                          <div className="text-sm font-semibold text-gray-900">
                            Evolución pendiente
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Cuando finalices la cita, vas a ver acá el detalle clínico.
                          </div>
                          <Button onClick={goPast} className="mt-3 rounded-xl">
                            Finalizar ahora
                          </Button>
                        </div>
                      )}
                    </Section>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" onClick={goList} className="rounded-xl">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver a lista
                      </Button>

                      <Button onClick={() => refetch?.()} className="ml-auto rounded-xl">
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Refrescar
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* PAST FORM */}
                {view === "past" && selectedAppointment && resolvedPatient && (
                  <motion.div
                    key={`past-${selectedAppointment.appointment.id}`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-[600px] mx-auto space-y-3"
                  >
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Evolución para
                          </div>
                          <div className="text-lg font-semibold text-gray-900 truncate">
                            {`${resolvedPatient.firstName ?? ""} ${resolvedPatient.lastName ?? ""}`.trim() || "—"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Turno: {dayjs(selectedAppointment.appointment.schedule).format("DD/MM/YYYY HH:mm")}
                          </div>
                        </div>
                        {selectedAppointment.appointment.pastAppointment?.id ? (
                          <Badge variant="success">Editando</Badge>
                        ) : (
                          <Badge variant="warning">Nueva</Badge>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-[#0f1620] p-4">
                      <PastAppointmentForm
                        patient={resolvedPatient}
                        appointment={selectedAppointment.appointment}
                      />
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="ghost"
                          onClick={goDetail}
                          className="text-white hover:bg-white/10"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Volver
                        </Button>
                        <Button onClick={() => refetch?.()} className="ml-auto rounded-xl">
                          <RefreshCcw className="w-4 h-4 mr-2" />
                          Refrescar
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
