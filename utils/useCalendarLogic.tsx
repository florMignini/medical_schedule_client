import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

import { useSelectedDate } from "@/utils/useSelectedDate";
import { useHolidays } from "@/hooks/useHolidays";

export const useCalendarLogic = () => {
  const { selectedDate, setSelectedDate } = useSelectedDate();
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const holidays = useHolidays();
  const [direction, setDirection] = useState(0);

  const daysInMonth = dayjs(`${currentYear}-${currentMonth + 1}`).daysInMonth();
  const startDay = dayjs(`${currentYear}-${currentMonth + 1}-01`).day();
  const today = dayjs(new Date());

  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
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
