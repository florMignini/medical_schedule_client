"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppointmentsIncluded } from "@/interfaces";
import { useSelectedDate } from "@/utils/useSelectedDate";
import AppointmentSlidePanel from "../appointments/components/AppointmentSlidePannel";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";
import AppointmentsList from "../appointments/components/AppointmentsList"; // ✅ se usa dentro del panel

dayjs.locale("es");

interface Props {
  appointments: AppointmentsIncluded[];
  isDemo?: boolean;
  refetch?: () => void;
}

export default function CalendarModern({ appointments, refetch, isDemo }: Props) {
  /**
   * 📅 Estado del mes actual en visualización
   */
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  /**
   * Rango de días que se renderizan en el calendario
   */
  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");

  /**
   * Array con todos los días a mostrar (incluye días de otras semanas parciales)
   */
  const days: dayjs.Dayjs[] = [];
  let day = startDate;
  while (day.isBefore(endDate) || day.isSame(endDate, "day")) {
    days.push(day);
    day = day.add(1, "day");
  }

  /**
   * Estado global de la fecha seleccionada (día u hora)
   */
  const { selectedDate, setSelectedDate } = useSelectedDate();

  /**
   * Controla la apertura del SlidePanel (creación / detalle de turno)
   */
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  /**
   * Datos del profesional (incluye pacientes)
   */
  const { patients } = useProfessionalIncludes();

  // ------------------------------------------------------
  // 🔹 HANDLERS
  // ------------------------------------------------------

  /**
   * Abre el panel con la fecha seleccionada.
   * Si se pasa una hora, la combina con la fecha (fecha + hora exacta).
   */
  const handleSelectDate = (date: Date, hour?: string) => {
    const datetime = hour
      ? dayjs(date)
          .hour(Number(hour.split(":")[0]))
          .minute(Number(hour.split(":")[1]))
          .toDate()
      : date;

    setSelectedDate(datetime);
    setIsPanelOpen(true);
  };

  /**
   * Cambiar al mes anterior / siguiente
   */
  const handlePrev = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNext = () => setCurrentMonth(currentMonth.add(1, "month"));

  // ------------------------------------------------------
  // 🔹 RENDER
  // ------------------------------------------------------

  return (
    <div className="flex flex-col justify-center">
      {/* 🔸 HEADER DEL CALENDARIO */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          aria-label="Mes anterior"
          data-testid="calendar-prev-month"
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </motion.button>

        <h2 className="text-xl font-semibold text-gray-800 tracking-wide capitalize">
          {currentMonth.format("MMMM YYYY")}
        </h2>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          aria-label="Mes siguiente"
          data-testid="calendar-next-month"
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </motion.button>
      </div>

      {/* 🔸 ENCABEZADO DE DÍAS DE LA SEMANA */}
      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-3">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div key={d} className="uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      {/* 🔸 GRID DE DÍAS DEL MES */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMonth.format("MM-YYYY")}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-7 gap-3 sm:gap-4"
        >
          {days.map((dayObj) => {
            const isCurrentMonth = dayObj.isSame(currentMonth, "month");
            const isToday = dayObj.isSame(dayjs(), "day");
            const isSelected = selectedDate
              ? dayObj.isSame(selectedDate, "day")
              : false;

            // Citas del día actual
            const dayAppointments = appointments.filter((a) =>
              dayjs(a.appointment.schedule).isSame(dayObj, "day")
            );
            const count = dayAppointments.length;

            return (
              <motion.button
                key={dayObj.toString()}
                onClick={() => handleSelectDate(dayObj.toDate())}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  relative flex flex-col items-center justify-center
                  aspect-square rounded-2xl border transition-all overflow-hidden
                  ${
                    isSelected
                      ? "border-emerald-500 shadow-md"
                      : "border-transparent"
                  }
                  ${
                    isToday
                      ? "bg-emerald-100 text-emerald-700 font-semibold"
                      : isCurrentMonth
                      ? "bg-white hover:bg-gray-50 text-gray-700"
                      : "bg-gray-50 text-gray-400"
                  }
                `}
              >
                {/* 🔹 Número del día */}
                <span className="absolute top-2 right-3 text-base font-medium">
                  {dayObj.date()}
                </span>

                {/* 🔹 Indicadores de cantidad de citas */}
                {count > 0 && (
                  <div className="flex flex-col items-center justify-center gap-1 mt-1">
                    <div className="flex items-center justify-center space-x-1">
                      {[...Array(Math.min(count, 3))].map((_, i) => (
                        <motion.span
                          key={i}
                          layoutId={`dot-${dayObj}-${i}`}
                          className="w-2.5 h-2.5 rounded-full bg-emerald-500"
                          animate={{ scale: [0.9, 1.1, 1] }}
                          transition={{
                            duration: 0.6,
                            delay: i * 0.1,
                            repeat: 0,
                          }}
                        />
                      ))}
                      {count > 3 && (
                        <span className="text-xs text-gray-600 ml-1">
                          +{count - 3}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{count} citas</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* 🔸 SLIDE PANEL (creación / detalle de turnos) */}
      <AnimatePresence>
        {isPanelOpen && selectedDate && (
          <AppointmentSlidePanel
            isOpen={isPanelOpen}
            onClose={() => {
              setIsPanelOpen(false);
              setSelectedDate(null);
            }}
            selectedDate={selectedDate}
            appointments={appointments}
            patientsList={patients}
            /**
             * 🔹 Integramos el nuevo AppointmentsList dentro del panel
             * Pasamos handleSelectDate como onAddAppointment para recibir hora exacta
             */
            refetch={refetch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
