"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCalendarLogic } from "@/utils/useCalendarLogic";
import CalendarDay from "./CalendarDay";
import CalendarHeader from "./CalendarHeader";

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

        {Array.from({ length: startDay }).map((_, idx) => (
          <div key={idx}></div>
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
      </div>
    </div>
  );
};

export default Calendar;
