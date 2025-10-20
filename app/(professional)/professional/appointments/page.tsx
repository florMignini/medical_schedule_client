"use client";

import { useState } from "react";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";
import CalendarLayout from "./components/CalendarLayout";

const Appointments = () => {
  const { appointments, patients, isDemo, isLoading, refetch } =
    useProfessionalIncludes();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <section className="flex flex-col w-full h-full bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <header className="flex flex-col w-full p-4 border-b border-gray-200 bg-white z-10">
        <h1 className="text-2xl text-gray-900 font-semibold">Calendario</h1>
        <p className="hidden md:flex text-sm text-gray-600">
          Aquí encontrarás los turnos programados para el mes seleccionado
        </p>
      </header>

      {/* Contenedor principal del calendario */}
      <div className="flex-1 min-h-0">
        <CalendarLayout
          appointments={appointments}
          patients={patients}
          isDemo={isDemo}
          isLoading={isLoading}
          refetch={refetch}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
    </section>
  );
};

export default Appointments;
