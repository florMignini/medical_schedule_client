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
    direction,
  } = useCalendarLogic();

  return (
    <div className="w-full p-4 h-auto overflow-hidden">
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

        <TooltipProvider>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${currentMonth}-${currentYear}`}
              initial={{ x: 100 * direction, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100 * direction, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="col-span-7 grid grid-cols-7 gap-1"
            >
              {/* Espacios vacíos antes del primer día del mes */}
              {Array.from({ length: startDay }).map((_, idx) => (
                <div key={`empty-${idx}`}></div>
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
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Calendar;
