"use client";

import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import AppointmentsList from "../components/AppointmentsList";
import { fetchProfessionalAppointments } from "@/utils/fetchProfessionalAppointments";
import CalendarIcon from "../components/icons/CalendarIcon";
import { useCurrentProfessional } from "@/hooks/useCurrentProfessional";

const Appointments = () => {
  const [appointmentsIncluded, setAppointmentsIncluded] = useState<any[]>([]);
  const [patientsIncluded, setPatientsIncluded] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const professional = useCurrentProfessional();
  useEffect(() => {
    async function loadData() {
        const professionalId = professional?.id!;

      try {
        const { appointmentsIncluded, patientsIncluded } = await fetchProfessionalAppointments(professionalId);
        setAppointmentsIncluded(appointmentsIncluded);
        setPatientsIncluded(patientsIncluded);
      } catch (error) {
        console.error("Error cargando datos", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

 if (loading)
    return (
      <div className="flex items-center justify-center w-full h-[60vh]">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full border-4 border-gray-300 border-t-black w-12 h-12" />
          <p className="text-sm text-gray-200 animate-pulse">Cargando turnos...</p>
        </div>
      </div>
    ); 
  

  return (
    <section className="max-w-7xl mx-auto py-8 px-4 flex flex-col items-center gap-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <header className="flex flex-col w-[100%] h-14 items-start justify-center px-2 border-b-[1px] border-b-gray-500">
            <h1 className="text-2xl text-black font-semibold text-start">
              Calendario
            </h1>
            <p className="hidden md:flex text-xs font-light text-gray-600">
            Aquí encontrará los turnos programados para el mes seleccionado
            </p>
          </header>

      {/* Info Top */}
      <div className="w-full flex items-center gap-3 text-gray-700">
        <CalendarIcon width={24} height={24} className="text-gray-600" />
        <h2 className="text-lg font-semibold">
          {appointmentsIncluded.length} {appointmentsIncluded.length > 1 ? "Citas totales" : "Cita total"}
        </h2>
      </div>

      {/* Main Content */}
      <main className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-effect-vibrant rounded-lg p-4 shadow-inner">
          <Calendar appointments={appointmentsIncluded} />
        </div>
        <div className="glass-effect-vibrant rounded-lg p-4 shadow-inner">
          <AppointmentsList
            patients={patientsIncluded}
            appointments={appointmentsIncluded}
            pastAppointmentPatientData={[]} // Ajustar si lo necesitás
          />
        </div>
      </main>
    </section>
  );
};

export default Appointments;
