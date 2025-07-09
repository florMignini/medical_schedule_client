"use client";

import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import AppointmentsList from "../components/AppointmentsList";
import CalendarIcon from "../components/icons/CalendarIcon";
import { useCurrentProfessional } from "@/hooks/useCurrentProfessional";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";
import { AppointmentSkeletonLoader } from "./components/AppointmentSkeletonLoader";

const Appointments = () => {
  const [loading, setLoading] = useState(true);
  const professional = useCurrentProfessional();
  const { appointments, patients, isLoading, refetch } =
    useProfessionalIncludes();
  return (
    <section className="w-[99%] mx-auto p-6 space-y-4 bg-white rounded-lg shadow-md h-[100%]">
      {/* Header */}
      <header className="flex flex-col w-[100%] h-14 items-start justify-center px-2 border-b-[1px] border-b-gray-500">
        <h1 className="text-2xl text-black font-semibold text-start">
          Calendario
        </h1>
        <p className="hidden md:flex text-xs font-light text-gray-600">
          Aquí encontrará los turnos programados para el mes seleccionado
        </p>
      </header>

      {isLoading ? (
        <AppointmentSkeletonLoader />
      ) : (
        <>
          <div className="w-full flex items-center gap-3 text-gray-700">
            <CalendarIcon width={24} height={24} className="text-gray-600" />
            <h2 className="text-lg font-semibold">
              {appointments.length}{" "}
              {appointments.length > 1 ? "Citas totales" : "Cita total"}
            </h2>
          </div>

          {/* Main Content */}
          <main className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-effect-vibrant rounded-lg p-4 shadow-inner">
              <Calendar appointments={appointments} />
            </div>
            <div className="glass-effect-vibrant rounded-lg p-4 shadow-inner">
              <AppointmentsList
                patients={patients}
                appointments={appointments}
                pastAppointmentPatientData={[]} 
                refetch={refetch}
              />
            </div>
          </main>
        </>
      )}
    </section>
  );
};

export default Appointments;
