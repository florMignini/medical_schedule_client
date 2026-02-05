"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
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

  // ⬇️ en tu padre ahora se llama así
  patientsForCreate: PatientsIncluded[];

  refetch?: () => void;
  selectedAppointmentId?: string | null;
};

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
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  // ===== Selected appointment (detail) =====
  const selectedAppointment = useMemo(() => {
    if (!selectedAppointmentId) return null;
    return (
      appointments.find((x) => x.appointment.id === selectedAppointmentId) ??
      null
    );
  }, [appointments, selectedAppointmentId]);

  // ===== FIX PRINCIPAL =====
  // Si se abre desde un click del grid (openCreateAt), selectedAppointmentId es null
  // y selectedDate trae la hora cliqueada -> abrir directo en CREATE con esa hora.
  useEffect(() => {
    if (!isOpen) return;

    // si viene un turno seleccionado -> detalle
    if (selectedAppointmentId && selectedAppointment) {
      setActiveDateTime(new Date(selectedAppointment.appointment.schedule));
      setView("detail");
      setSelectedPatientId("");
      return;
    }

    // si NO hay appointment seleccionado pero viene selectedDate -> create directo
    if (!selectedAppointmentId && selectedDate) {
      setActiveDateTime(new Date(selectedDate));
      setView("create"); // ✅ acá está la magia
      setSelectedPatientId("");
      return;
    }

    // fallback
    if (!selectedAppointmentId && !selectedDate) {
      setActiveDateTime(null);
      setView("list");
      setSelectedPatientId("");
    }
  }, [isOpen, selectedAppointmentId, selectedAppointment, selectedDate]);

  // Turnos del mismo día (para list)
  const filteredAppointments = useMemo(() => {
    if (!activeDateTime) return [];
    const day = dayjs(activeDateTime).startOf("day");
    return appointments.filter(({ appointment }) =>
      dayjs(appointment.schedule).isSame(day, "day"),
    );
  }, [appointments, activeDateTime]);

  // Resolver paciente (ya te viene en it.appt.patient por el normalize del backend/front)
  const resolvedPatient = useMemo(() => {
    return selectedAppointment?.patient ?? null;
  }, [selectedAppointment]);

  const goList = () => setView("list");
  const goCreate = () => setView("create");
  const goDetail = () => setView("detail");
  const goPast = () => setView("past");

  const headerTitle = useMemo(() => {
    if (view === "create") return "Nuevo turno";
    if (view === "past") return "Finalizar cita (Evolución)";
    if (view === "detail") return "Detalle del turno";

    const baseDate =
      activeDateTime ??
      (selectedAppointment
        ? new Date(selectedAppointment.appointment.schedule)
        : null);

    if (!baseDate) return "Turnos";
    return `Turnos del ${dayjs(baseDate).format("DD/MM/YYYY")}`;
  }, [activeDateTime, selectedAppointment, view]);

  const panelKey = useMemo(() => {
    const k1 = selectedAppointmentId ?? "none";
    const k2 = selectedDate ? new Date(selectedDate).getTime() : "no-date";
    return `panel-${k1}-${k2}`;
  }, [selectedAppointmentId, selectedDate]);

  return (
    <AnimatePresence>
      {isOpen && (activeDateTime || selectedAppointment) && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key={panelKey}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 22,
              mass: 0.6,
            }}
            className="fixed top-0 right-0 z-50 h-dvh w-[100vw] max-w-full sm:max-w-[760px]
                       bg-white text-black shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                {(view === "create" ||
                  view === "detail" ||
                  view === "past") && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (view === "past") return goDetail();
                      if (view === "detail") return goList();
                      return goList();
                    }}
                    className="h-9 px-2"
                    title="Volver"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}

                <h2 className="text-base font-semibold text-gray-800">
                  {headerTitle}
                </h2>
              </div>

              <button
                aria-label="Cerrar panel"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4">
              <AnimatePresence mode="wait">
                {/* ===== LIST ===== */}
                {view === "list" && (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-[600px] mx-auto space-y-4"
                  >
                    <AppointmentsList
                      appointments={filteredAppointments}
                      selectedDate={activeDateTime ?? new Date()}
                      onAddAppointment={(datetime) => {
                        setActiveDateTime(datetime);
                        goCreate();
                      }}
                      onSelectAppointment={() => {}}
                    />

                    <div className="pt-2">
                      <Button
                        onClick={() => {
                          const base = dayjs(activeDateTime ?? new Date());
                          const dt =
                            base.hour() === 0 && base.minute() === 0
                              ? base
                                  .hour(8)
                                  .minute(0)
                                  .second(0)
                                  .millisecond(0)
                                  .toDate()
                              : base.second(0).millisecond(0).toDate();

                          setActiveDateTime(dt);
                          goCreate();
                        }}
                        className="w-full rounded-xl text-white"
                      >
                        + Crear turno
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ===== CREATE ===== */}
                {view === "create" && activeDateTime && (
                  <motion.div
                    key={`create-${activeDateTime.getTime()}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    className="relative w-full max-w-[600px] mx-auto"
                  >
                    <NewAppointmentForm
                      type="create"
                      patientsList={patientsForCreate}
                      initialDateTime={activeDateTime} // ✅ acá va la hora cliqueada
                      onSuccess={() => {
                        refetch?.();
                        goList();
                      }}
                      component="calendar"
                    />
                  </motion.div>
                )}

                {/* ===== DETAIL ===== */}
                {view === "detail" && selectedAppointment && (
                  <motion.div
                    key={`detail-${selectedAppointment.appointment.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-[600px] mx-auto space-y-4"
                  >
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
                      <div>
                        <div className="text-xs text-gray-500">Horario</div>
                        <div className="text-lg font-semibold text-gray-800">
                          {dayjs(
                            selectedAppointment.appointment.schedule,
                          ).format("DD/MM/YYYY HH:mm")}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <div>
                          <div className="text-xs text-gray-500">Motivo</div>
                          <div className="text-sm text-gray-800">
                            {selectedAppointment.appointment.reason || "—"}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500">Notas</div>
                          <div className="text-sm text-gray-800 whitespace-pre-wrap">
                            {selectedAppointment.appointment.notes || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-800">
                            Evolución
                          </div>
                          <div className="text-xs text-gray-500">
                            {selectedAppointment.appointment.pastAppointment
                              ? "Ya hay evolución cargada."
                              : "Todavía no se finalizó esta cita."}
                          </div>
                        </div>

                        {selectedAppointment.appointment.pastAppointment?.id ? (
                          <PastAppointmentDetailCard
                            pastAppointment={
                              selectedAppointment.appointment.pastAppointment
                            }
                            onEdit={goPast}
                          />
                        ) : (
                          <div className="rounded-2xl border border-gray-200 bg-white p-4">
                            <div className="text-sm font-semibold text-gray-900">
                              Evolución pendiente
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Todavía no se finalizó esta cita. Cuando la
                              cierres, acá vas a ver el detalle clínico.
                            </div>
                            <Button
                              onClick={goPast}
                              className="mt-3 rounded-xl"
                            >
                              Finalizar ahora
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {!resolvedPatient && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <div className="text-sm font-semibold text-amber-900">
                          Seleccioná el paciente para cargar la evolución
                        </div>
                        <div className="text-xs text-amber-800 mt-1">
                          No se pudo resolver el paciente del turno.
                          Seleccionalo manualmente.
                        </div>

                        <div className="mt-3">
                          <label className="text-xs text-amber-900">
                            Paciente
                          </label>
                          <select
                            value={selectedPatientId}
                            onChange={(e) =>
                              setSelectedPatientId(e.target.value)
                            }
                            className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm"
                          >
                            <option value="">Seleccionar…</option>
                            {patientsForCreate.map((p) => (
                              <option key={p.patient.id} value={p.patient.id}>
                                {p.patient.firstName} {p.patient.lastName ?? ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ===== PAST FORM ===== */}
                {view === "past" && selectedAppointment && (
                  <motion.div
                    key={`past-${selectedAppointment.appointment.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-[600px] mx-auto"
                  >
                    {!resolvedPatient ? (
                      <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="text-sm font-semibold text-gray-800">
                          Falta seleccionar paciente
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Volvé al detalle y seleccioná el paciente para poder
                          finalizar la cita.
                        </div>
                        <Button onClick={goDetail} className="mt-3 rounded-xl">
                          Volver al detalle
                        </Button>
                      </div>
                    ) : (
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
                          <Button
                            onClick={() => refetch?.()}
                            className="ml-auto rounded-xl"
                          >
                            Refrescar
                          </Button>
                        </div>
                      </div>
                    )}
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
