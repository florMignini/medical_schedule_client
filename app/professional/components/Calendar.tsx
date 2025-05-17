"use client";
import { useState } from "react";
import dayjs from "dayjs";
import { CalendarX, PartyPopper } from "lucide-react";

import { Patient } from "@/interfaces";

import ArrowRight from "./icons/ArrowRight";
import ArrowLeft from "./icons/ArrowLeft";

import { useSelectedDate } from "@/utils/useSelectedDate";
import { useHolidays, Holiday } from "@/hooks/useHolidays";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Calendar = ({ appointments }: any) => {
  const { selectedDate, setSelectedDate } = useSelectedDate();
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  //useHolidays
  const holidays = useHolidays();

  // patient info
  const [patient, setPatient] = useState<Patient>();

  //  calendar data & methods ----------------
  const daysInMonth = dayjs(`${currentYear}-${currentMonth + 1}`).daysInMonth();
  const startDay = dayjs(`${currentYear}-${currentMonth + 1}-01`).day();

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  };

  const today = dayjs(new Date());
  const dateOfBirth = dayjs(patient?.birthDate);
  const age = today.diff(dateOfBirth, "years");

  return (
    <div className="w-[100%] p-4 h-auto min-[768px]:h-screen">
      {/* top section */}
      <div className="w-[100%] flex items-center justify-between mb-12 text-black">
        <h2 className="w-[33%] flex items-center justify-start font-light text-lg">
          {dayjs(`${currentYear}-${currentMonth + 1}`).format("MMMM YYYY")}
        </h2>
        <div className="flex items-center justify-center w-[33%] gap-4">
          <button
            onClick={handlePrevMonth}
            className="w-[33%] flex justify-start font-semibold   text-lg hover:text-gray-500"
          >
            <ArrowLeft width={20} height={20} />
          </button>
          <button
            className="w-[33%] flex justify-end font-semibold   text-lg hover:text-gray-500"
            onClick={handleNextMonth}
          >
            <ArrowRight width={20} height={20} />
          </button>
        </div>
      </div>
      {/* Calendar section */}
      <div className="grid grid-cols-7 gap-1 mt-4">
        {/* Days of the week */}
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div key={day} className="text-center font-light">
            {day}
          </div>
        ))}
        {/* Empty spaces before first day */}
        {Array.from({ length: startDay }).map((_, idx) => (
          <div className="bg-white/35 rounded-lg" key={idx}></div>
        ))}
        {/* Days of the week */}
        <TooltipProvider>
          {Array.from({ length: daysInMonth }).map((_, idx: number) => {
            const day = idx + 1;
            const date = dayjs(`${currentYear}-${currentMonth + 1}-${day}`);
            const formattedDate = date.format("DD-MM-YYYY");

            const matchingHoliday = holidays.find(
              (holiday: any) =>
                dayjs(holiday.fecha).format("DD-MM") === date.format("DD-MM")
            ) as Holiday | undefined;

            const isHoliday = Boolean(matchingHoliday);

            const dayEvents = appointments.filter(
              (appointment: any) =>
                dayjs(appointment.appointment.schedule).format("DD-MM-YYYY") ===
                formattedDate
            );

            const isSelected = dayjs(selectedDate).isSame(date, "day");

            return (
              <button
                className={`cursor-pointer flex items-start w-full h-20 border rounded-md mx-auto
        ${
          isHoliday
            ? "bg-black/50 cursor-not-allowed"
            : dayEvents.length > 0
            ? "bg-green-500"
            : "bg-black/10"
        }
        ${isSelected && !isHoliday ? "ring-2 ring-black" : ""}
      `}
                key={idx}
                onClick={() => {
                  if (!isHoliday) {
                    const newDate = date.toDate();
                    if (!isSelected) {
                      setSelectedDate(newDate);
                    }
                  }
                }}
                disabled={isHoliday}
              >
                <div className="flex flex-col rounded-lg p-1 items-end justify-start w-full h-full">
                  <h1 className="font-bold text-black text-end">{day}</h1>

                  {dayEvents.length > 0 && (
                    <div className="flex items-end justify-end text-white text-xl font-bold p-1 flex-col">
                      <p className="text-base font-bold text-center">
                        {dayEvents.length}
                      </p>
                      <p className="hidden min-[900px]:flex text-base font-bold text-end">
                        {dayEvents.length > 1 ? "turnos" : "turno"}
                      </p>
                    </div>
                  )}

                  {isHoliday && matchingHoliday && (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <p className="text-xs text-white truncate font-semibold text-end w-full">
                          {matchingHoliday.nombre}{" "}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent className="flex items-center justify-start ml-5 flex-col w-auto h-auto p-2 backdrop-blur-lg">
                        <p className="font-semibold">
                          {matchingHoliday.nombre}
                        </p>
                        <p className="text-xs">
                          {matchingHoliday.tipo === "inamovible" ? (
                            <div className="flex items-center justify-center gap-2">
                              <CalendarX className="w-4 h-4 text-red-500" />
                              <p>{`Feriado: ${matchingHoliday.tipo}`}</p>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <PartyPopper className="w-4 h-4 text-emerald-500" />
                              <p>{`Feriado: ${matchingHoliday.tipo}`}</p>
                            </div>
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </button>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Calendar;
