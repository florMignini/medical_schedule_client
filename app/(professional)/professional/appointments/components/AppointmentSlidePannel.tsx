"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import AppointmentsList from "./AppointmentsList";
import NewAppointmentForm from "@/components/forms/NewAppointmentForm";
import { Appointment, AppointmentsIncluded, Patient, PatientsIncluded } from "@/interfaces";

export default function AppointmentSlidePanel({
  isOpen,
  onClose,
  selectedDate,
  appointments,
  patientsList,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: null | Date | undefined;
  appointments: AppointmentsIncluded[];
  patientsList: PatientsIncluded[];
  refetch?: () => void;
}) {
  const [showNewForm, setShowNewForm] = useState(false);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(({ appointment }) =>
      dayjs(appointment.schedule).isSame(
        dayjs(selectedDate).startOf("day"),
        "day"
      )
    );
  }, [appointments, selectedDate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 22,
              mass: 0.6,
            }}
            className="fixed top-0 right-0 z-50 h-full w-[100vw] max-w-full sm:max-w-[760px] bg-white/90 backdrop-blur-xl border-l border-gray-200 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-800">
                {showNewForm
                  ? "Nuevo turno"
                  : `Turnos del ${dayjs(selectedDate).format("DD/MM/YYYY")}`}
              </h2>
              <div className="flex items-center gap-2">
                {!showNewForm && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowNewForm(true)}
                    className="hover:bg-gray-100"
                    title="Agregar turno"
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                  </Button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
              <AnimatePresence mode="wait">
                {!showNewForm ? (
                  <motion.div
                    key="appointments-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[600px] mx-auto space-y-4"
                  >
                    <AppointmentsList
                      patients={patientsList}
                      appointments={filteredAppointments}
                      onAddAppointment={() => setShowNewForm(true)}
                    />
                    <div className="flex justify-center">
                      <Button
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-md text-sm font-medium"
                        onClick={() => setShowNewForm(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar turno
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form-view"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-[600px] mx-auto"
                  >
                    <NewAppointmentForm
                      type="create"
                      patientsList={patientsList}
                      initialDateTime={selectedDate ?? new Date()}
                      onSuccess={() => {
                        setShowNewForm(false);
                        refetch?.();
                      }}
                      component="calendar"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => setShowNewForm(false)}
                      className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Volver
                    </Button>
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
