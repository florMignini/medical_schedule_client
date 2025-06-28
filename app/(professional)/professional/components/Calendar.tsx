"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useCalendarLogic } from "@/utils/useCalendarLogic";
import CalendarDay from "./CalendarDay";
import CalendarHeader from "./CalendarHeader";
import { motion, AnimatePresence } from "framer-motion";

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

      <div className="grid grid-cols-7 gap-3 mt-6 text-center text-sm font-medium text-gray-500">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="py-1 rounded-lg">
            {day}
          </div>
        ))}

        {Array.from({ length: startDay }).map((_, idx) => (
          <div key={`empty-${idx}`} className="py-4"></div>
        ))}

        <TooltipProvider>
          <AnimatePresence mode="wait">
            {Array.from({ length: daysInMonth }).map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <CalendarDay
                  day={idx + 1}
                  appointments={appointments}
                  selectedDate={
                    (selectedDate ?? today) instanceof Date
                      ? (selectedDate ?? today)
                      : ((selectedDate ?? today) as any).toDate()
                  }
                  setSelectedDate={setSelectedDate}
                  currentMonth={currentMonth}
                  currentYear={currentYear}
                  today={today}
                  holidays={holidays}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </TooltipProvider>
      </div>
    </motion.div>
  );
};

export default Calendar;
