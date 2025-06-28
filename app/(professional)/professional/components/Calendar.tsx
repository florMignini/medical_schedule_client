"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useCalendarLogic } from "@/utils/useCalendarLogic";
import CalendarDay from "./CalendarDay";
import CalendarHeader from "./CalendarHeader";
import { motion, AnimatePresence } from "framer-motion";
import { variants } from "@/lib/variants";

const Calendar = ({ appointments }: any) => {
  const {
    daysInMonth,
    startDay,
    handlePrevMonth,
    handleNextMonth,
    currentMonth,
    currentYear,
    selectedDate,
    setSelectedDate,
    today,
    holidays,
    direction,
  } = useCalendarLogic();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200"
    >
      <CalendarHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
      />

      {/* Nombres de los días */}
      <div className="grid grid-cols-7 gap-3 mt-6 text-center text-sm font-medium text-gray-500">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="py-1 rounded-lg">
            {day}
          </div>
        ))}
      </div>

      {/* Calendario con animación */}
      <TooltipProvider>
        <div className="relative w-full min-h-[300px] mt-2">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={`${currentYear}-${currentMonth}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0 grid grid-cols-7 gap-3 text-center text-sm font-medium text-gray-700"
            >
              {/* Espacios vacíos antes del primer día */}
              {Array.from({ length: startDay }).map((_, idx) => (
                <div key={`empty-${idx}`} />
              ))}

              {/* Días del mes */}
              {Array.from({ length: daysInMonth }).map((_, idx) => (
                <CalendarDay
                  key={idx}
                  day={idx + 1}
                  appointments={appointments}
                  selectedDate={
                    (selectedDate ?? today) instanceof Date
                      ? selectedDate ?? today
                      : ((selectedDate ?? today) as any).toDate()
                  }
                  setSelectedDate={setSelectedDate}
                  currentMonth={currentMonth}
                  currentYear={currentYear}
                  today={today}
                  holidays={holidays}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </TooltipProvider>
    </motion.div>
  );
};

export default Calendar;
