import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

import { useSelectedDate } from "@/utils/useSelectedDate";
import { useHolidays } from "@/hooks/useHolidays";

export const useCalendarLogic = () => {
  const { selectedDate, setSelectedDate } = useSelectedDate();
  const holidays = useHolidays();
  const today = dayjs();

  // Manejo conjunto de mes y año para evitar loops
  const [{ currentMonth, currentYear }, setDateState] = useState(() => ({
    currentMonth: today.month(),
    currentYear: today.year(),
  }));

  const [direction, setDirection] = useState(1);

  const daysInMonth = dayjs(`${currentYear}-${currentMonth + 1}`).daysInMonth();
  const startDay = dayjs(`${currentYear}-${currentMonth + 1}-01`).day();

  const handlePrevMonth = () => {
    setDirection(-1);
    setDateState((prev) => {
      const isJanuary = prev.currentMonth === 0;
      return {
        currentMonth: isJanuary ? 11 : prev.currentMonth - 1,
        currentYear: isJanuary ? prev.currentYear - 1 : prev.currentYear,
      };
    });
  };

  const handleNextMonth = () => {
    setDirection(1);
    setDateState((prev) => {
      const isDecember = prev.currentMonth === 11;
      return {
        currentMonth: isDecember ? 0 : prev.currentMonth + 1,
        currentYear: isDecember ? prev.currentYear + 1 : prev.currentYear,
      };
    });
  };

  return {
    selectedDate,
    setSelectedDate,
    currentMonth,
    currentYear,
    handlePrevMonth,
    handleNextMonth,
    daysInMonth,
    startDay,
    today,
    holidays,
    direction,
  };
};
