"use client";

import { useState } from "react";
import { AppointmentSkeletonLoader } from "./AppointmentSkeletonLoader";
import { AppointmentsIncluded, PatientsIncluded } from "@/interfaces";
import AppointmentSlidePanel from "./AppointmentSlidePannel";
import CalendarModern from "../../components/CalendarModern";

interface CalendarLayoutProps {
  appointments: AppointmentsIncluded[];
  patients: PatientsIncluded[];
  isDemo?: boolean;
  refetch?: () => void;
  isLoading?: boolean;
  selectedDate?: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

export default function CalendarLayout({
  appointments,
  patients,
  isDemo = false,
  refetch,
  isLoading = false,
  setSelectedDate,
  selectedDate,
}: CalendarLayoutProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const openCreateAt = (dt: Date) => {
    setSelectedAppointmentId(null);
    setSelectedDate(dt);
    setIsPanelOpen(true);
  };

  const openDetail = (appointmentId: string, dt: Date) => {
    setSelectedAppointmentId(appointmentId);
    setSelectedDate(dt);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedAppointmentId(null);
    setSelectedDate(null);
  };

  return (
    <div className="relative flex flex-col w-full h-dvh overflow-hidden bg-white p-2">
      {isLoading ? (
        <AppointmentSkeletonLoader />
      ) : (
        <main className="relative flex-1 w-full overflow-hidden rounded-2xl">
          <h1 className="text-red-500 font-extrabold text-xl">Seccion en optimizacion</h1>
          <div className="flex-1 h-full overflow-hidden">
            <CalendarModern
              isDemo={isDemo}
              appointments={appointments}
              patients={patients}
              refetch={refetch}
              // ✅ callbacks únicos
              onOpenCreate={openCreateAt}
              onOpenDetail={openDetail}
            />
          </div>

          <AppointmentSlidePanel
            isOpen={isPanelOpen}
            onClose={handleClosePanel}
            selectedDate={selectedDate}
            appointments={appointments}
            patientsList={patients}
            refetch={refetch}
            selectedAppointmentId={selectedAppointmentId}
          />
        </main>
      )}
    </div>
  );
}
