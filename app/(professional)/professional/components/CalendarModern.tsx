"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppointmentsIncluded } from "@/interfaces";
import { useSelectedDate } from "@/utils/useSelectedDate";
import AppointmentSlidePanel from "../appointments/components/AppointmentSlidePannel";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";

interface Props {
  appointments: AppointmentsIncluded[];
  isDemo?: boolean;
}

export default function CalendarModern({ appointments, isDemo }: Props) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");
  const days = [];
  let day = startDate;
  const { selectedDate, setSelectedDate } = useSelectedDate();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const { patients } = useProfessionalIncludes();

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsPanelOpen(true);
  };

  while (day.isBefore(endDate) || day.isSame(endDate, "day")) {
    days.push(day);
    day = day.add(1, "day");
  }

  const handlePrev = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNext = () => setCurrentMonth(currentMonth.add(1, "month"));

  return (
    <div className="flex flex-col justify-center">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </motion.button>
        <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </motion.button>
      </div>

      {/* 🔹 Weekdays header */}
      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-3">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div key={d} className="uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      {/* 🔹 Days grid */}
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
                  ${isSelected ? "border-emerald-500 shadow-md" : "border-transparent"}
                  ${
                    isToday
                      ? "bg-emerald-100 text-emerald-700 font-semibold"
                      : isCurrentMonth
                      ? "bg-white hover:bg-gray-50 text-gray-700"
                      : "bg-gray-50 text-gray-400"
                  }
                `}
              >
                {/* 🔹 Número del día (arriba a la derecha) */}
                <span className="absolute top-2 right-3 text-base font-medium">
                  {dayObj.date()}
                </span>

                {/* 🔹 Indicador visual de citas */}
                {count > 0 && (
                  <div className="flex flex-col items-center justify-center gap-1 mt-1">
                    <div className="flex items-center justify-center space-x-1">
                      {/* Render dinámico de burbujas */}
                      {[...Array(Math.min(count, 3))].map((_, i) => (
                        <motion.span
                          key={i}
                          layoutId={`dot-${dayObj}-${i}`}
                          className="w-2.5 h-2.5 rounded-full bg-emerald-500"
                          animate={{
                            scale: [0.9, 1.1, 1],
                          }}
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

      {/* 🔹 Slide Panel */}
      <AnimatePresence>
        {isPanelOpen && selectedDate && (
          <AppointmentSlidePanel
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            selectedDate={selectedDate}
            appointments={appointments}
            patientsList={patients}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
