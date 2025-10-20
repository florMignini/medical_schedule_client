"use client";

import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { CalendarIcon, Plus } from "lucide-react";
import { AppointmentSkeletonLoader } from "./AppointmentSkeletonLoader";
import { AppointmentsIncluded, PatientsIncluded } from "@/interfaces";
import AppointmentSlidePanel from "./AppointmentSlidePannel";
import CalendarModern from "../../components/CalendarModern";
import { Button } from "@/components/ui/button";

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
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const appointmentsByDay = useMemo(() => {
    const map: Record<string, AppointmentsIncluded[]> = {};
    appointments.forEach((appt) => {
      const date = dayjs(appt.appointment.schedule).format("YYYY-MM-DD");
      if (!map[date]) map[date] = [];
      map[date].push(appt);
    });
    return map;
  }, [appointments]);

  return (
    <div className="relative flex flex-col w-full h-screen overflow-hidden bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-2">
      {isLoading ? (
        <AppointmentSkeletonLoader />
      ) : (
        <main className="relative flex-1 w-full overflow-hidden rounded-2xl">
          {/* Encabezado */}
          <div className="flex items-center justify-between mb-4 px-4">
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setSelectedDate(new Date())}
            >
              <Plus className="w-4 h-4" />
              Nueva cita
            </Button>
          </div>

          {/* Calendario mensual */}
          <div className="flex-1 h-screen bg-gray-50 rounded-xl p-2 shadow-inner overflow-y-auto">
            <CalendarModern
              isDemo={isDemo}
              appointments={appointments}
            />
          </div>

          {/* Drawer lateral (modern unified style) */}
          <AppointmentSlidePanel
            isOpen={!!selectedDate}
            onClose={() => setSelectedDate(null)}
            selectedDate={selectedDate}
            appointments={appointments}
            patientsList={patients}
          />
        </main>
      )}
    </div>
  );
}
