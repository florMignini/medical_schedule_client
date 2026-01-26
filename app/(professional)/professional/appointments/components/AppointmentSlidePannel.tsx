"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import AppointmentsList from "./AppointmentsList";
import NewAppointmentForm from "@/components/forms/NewAppointmentForm";
import PastAppointmentForm from "@/components/forms/PastAppointmentForm"; // ✅ ajustá path si difiere
import { AppointmentsIncluded, PatientsIncluded } from "@/interfaces";

type PanelView = "list" | "create" | "detail" | "past";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null | undefined;
  appointments: AppointmentsIncluded[];
  patientsList: PatientsIncluded[];
  refetch?: () => void;

  /** ✅ NUEVO: cuando viene seteado, el panel abre en detalle de ese turno */
  selectedAppointmentId?: string | null;
};

/**
 * Slide panel:
 * - Listado de turnos del día
 * - Crear turno (NewAppointmentForm)
 * - Detalle del turno (y desde ahí crear/editar PastAppointment)
 */
export default function AppointmentSlidePanel({
  isOpen,
  onClose,
  selectedDate,
  appointments,
  patientsList,
  refetch,
  selectedAppointmentId = null,
}: Props) {
  // Estado local que guarda fecha/hora activa (para crear)
  const [activeDateTime, setActiveDateTime] = useState<Date | null>(null);

  // Vista actual
  const [view, setView] = useState<PanelView>("list");

  // Si no podemos resolver paciente del turno, permitimos elegirlo
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  /** Sync con selectedDate */
  useEffect(() => {
    if (selectedDate) setActiveDateTime(new Date(selectedDate));
  }, [selectedDate]);

  /** Turno seleccionado (si viene ID) */
  const selectedAppointment = useMemo(() => {
    if (!selectedAppointmentId) return null;
    return (
      appointments.find((x) => x.appointment.id === selectedAppointmentId) ??
      null
    );
  }, [appointments, selectedAppointmentId]);

  /** Cuando viene un appointmentId, abrimos detalle */
  useEffect(() => {
    if (selectedAppointmentId && selectedAppointment) {
      setView("detail");
      setSelectedPatientId(""); // reseteo elección manual
    } else {
      // Si no hay selectedAppointmentId, mantenemos flujo normal
      // No forzamos "list" para no cortar UX cuando estás creando
      if (view === "detail" || view === "past") setView("list");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAppointmentId, selectedAppointment]);

  /** Turnos del mismo día (sin importar hora) */
  const filteredAppointments = useMemo(() => {
    if (!activeDateTime) return [];
    const day = dayjs(activeDateTime).startOf("day");
    return appointments.filter(({ appointment }) =>
      dayjs(appointment.schedule).isSame(day, "day"),
    );
  }, [appointments, activeDateTime]);

  /** Resolver paciente para PastAppointmentForm:
   * - Si tu AppointmentsIncluded trae patient por runtime, lo usamos (aunque tu interface no lo declare)
   * - Si no, se elige manualmente desde el selector
   */
  const resolvedPatient = useMemo(() => {
    // 1) si el appointment ya trae patient “en runtime” (muy común aunque la interface esté incompleta)
    const anySelected = selectedAppointment as any;
    const runtimePatient = anySelected?.patient;
    if (runtimePatient?.id) return runtimePatient;

    // 2) si el appointment trae patientId “en runtime”
    const runtimePatientId =
      anySelected?.patientId ??
      anySelected?.appointment?.patientId ??
      anySelected?.appointment?.patient?.id;

    if (runtimePatientId) {
      const match = patientsList.find((p) => p.patient.id === runtimePatientId);
      if (match) return match.patient;
    }

    // 3) selección manual desde dropdown
    if (selectedPatientId) {
      const match = patientsList.find(
        (p) => p.patient.id === selectedPatientId,
      );
      if (match) return match.patient;
    }

    return null;
  }, [patientsList, selectedAppointment, selectedPatientId]);

  /** Helpers navegación */
  const goList = () => setView("list");
  const goCreate = () => setView("create");
  const goDetail = () => setView("detail");
  const goPast = () => setView("past");

  /** Header title */
  const headerTitle = useMemo(() => {
    if (!activeDateTime && !selectedAppointment) return "Turnos";
    if (view === "create") return "Nuevo turno";
    if (view === "past") return "Finalizar cita (Evolución)";
    if (view === "detail") return "Detalle del turno";
    return `Turnos del ${dayjs(activeDateTime ?? selectedAppointment?.appointment.schedule).format("DD/MM/YYYY")}`;
  }, [activeDateTime, selectedAppointment, view]);

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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key={`panel-${selectedAppointmentId ?? activeDateTime?.getTime() ?? "none"}`}
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
                       bg-[#262626] text-white backdrop-blur-xl border-l border-gray-200 shadow-2xl flex flex-col"
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
                      patients={patientsList}
                      appointments={filteredAppointments}
                      selectedDate={activeDateTime ?? new Date()}
                      onAddAppointment={(datetime) => {
                        setActiveDateTime(datetime);
                        goCreate();
                      }}
                      onSelectAppointment={(id) => {
                        // si querés: pasar a detail sin depender del padre
                        // pero acá el id viene desde CalendarLayout; igual lo dejo sin duplicar
                      }}
                    />

                    {/* CTA opcional */}
                    <div className="pt-2">
                      <Button
                        onClick={() => {
                          // Si el usuario abre panel desde un día (sin hora), creamos 08:00 por default
                          const base = dayjs(activeDateTime ?? new Date())
                            .hour(8)
                            .minute(0)
                            .second(0)
                            .millisecond(0);
                          setActiveDateTime(base.toDate());
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
                      patientsList={patientsList}
                      initialDateTime={activeDateTime}
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
                            Evolución (PastAppointment)
                          </div>
                          <div className="text-xs text-gray-500">
                            {selectedAppointment.appointment.pastAppointment
                              ? "Ya hay evolución cargada."
                              : "Todavía no se finalizó esta cita."}
                          </div>
                        </div>

                        <Button onClick={goPast} className="rounded-full">
                          {selectedAppointment.appointment.pastAppointment
                            ? "Editar"
                            : "Finalizar"}
                        </Button>
                      </div>
                    </div>

                    {/* Si no podemos resolver paciente, pedimos selección */}
                    {!resolvedPatient && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <div className="text-sm font-semibold text-amber-900">
                          Seleccioná el paciente para cargar la evolución
                        </div>
                        <div className="text-xs text-amber-800 mt-1">
                          Tu modelo de `AppointmentsIncluded` no trae el
                          paciente asociado. Podés seleccionarlo manualmente
                          acá.
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
                            {patientsList.map((p) => (
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

                {/* ===== PAST APPOINTMENT FORM ===== */}
                {view === "past" && selectedAppointment && (
                  <motion.div
                    key={`past-${selectedAppointment.appointment.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-[600px] mx-auto"
                  >
                    {/* Si no hay paciente resuelto, bloqueamos el form */}
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
                        {/* Tu form usa estilos oscuros (text-white), por eso el contenedor dark */}
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
                            onClick={() => {
                              // si querés cerrar después de guardar, el form hoy hace router.push.
                              // Esto lo dejo como acción manual por si preferís mantenerte en calendario.
                              refetch?.();
                            }}
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
