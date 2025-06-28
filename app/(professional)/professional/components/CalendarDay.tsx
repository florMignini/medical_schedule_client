"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useCalendarLogic } from "@/utils/useCalendarLogic";
import CalendarDay from "./CalendarDay";
import CalendarHeader from "./CalendarHeader";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

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

  const prevMonthRef = useRef(currentMonth);
  const direction = currentMonth > prevMonthRef.current ? 1 : -1;
  prevMonthRef.current = currentMonth;

  const monthKey = `${currentYear}-${currentMonth}`;

  return (
    <div className="w-full p-4 h-auto">
      <CalendarHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
      />

      <div className="grid grid-cols-7 gap-1 mt-4">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="text-center font-light">
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key={monthKey}
          initial={{ x: 100 * direction, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100 * direction, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="grid grid-cols-7 gap-1"
        >
          {/* Empty spaces before first day */}
          {Array.from({ length: startDay }).map((_, idx) => (
            <div key={`empty-${idx}`} className="" />
          ))}

          <TooltipProvider>
            {Array.from({ length: daysInMonth }).map((_, idx) => (
              <CalendarDay
                key={idx}
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
            ))}
          </TooltipProvider>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
