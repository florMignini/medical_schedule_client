"use client";

import dayjs from "dayjs";
import { CalendarX, PartyPopper } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // si usás clsx o helper para concatenar clases

interface Props {
  day: number;
  currentMonth: number;
  currentYear: number;
  appointments: any[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  today: dayjs.Dayjs;
  holidays: any[];
  isDemo?: boolean;
}

const CalendarDay = ({
  day,
  currentMonth,
  currentYear,
  appointments,
  selectedDate,
  setSelectedDate,
  today,
  holidays,
  isDemo = false,
}: Props) => {
  const date = dayjs(`${currentYear}-${currentMonth + 1}-${day}`);
  const formattedDate = date.format("YYYY-MM-DD");

  const dayEvents = appointments.filter(
    (appt) => dayjs(appt.appointment.schedule).format("YYYY-MM-DD") === formattedDate
  );
  const isSelected = dayjs(selectedDate).isSame(date, "day");
  const isToday = date.isSame(today, "day");
  const isPast = date.isBefore(today, "day") && !isToday && dayEvents.length === 0;

  const matchingHoliday = holidays.find(
    (holiday) => dayjs(holiday.fecha).format("DD-MM") === date.format("DD-MM")
  );
  const isHoliday = Boolean(matchingHoliday);

  const handleClick = () => {
    if (isPast || isHoliday) return;
    setSelectedDate(date.toDate());
  };

  const baseStyle = cn(
    "relative flex flex-col justify-between items-end p-2 w-full h-24 rounded-xl text-sm font-medium transition-all",
    isSelected && "bg-blue-600 text-white ring-2 ring-blue-700 shadow-md",
    isToday && !isSelected && "ring-2 ring-blue-400",
    isHoliday && "bg-zinc-800 text-white cursor-not-allowed",
    isPast && !isSelected && "opacity-40 cursor-not-allowed",
    !isSelected && !isHoliday && !isPast && "hover:bg-zinc-100 hover:scale-[1.02]",
    "cursor-pointer"
  );

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <button onClick={handleClick} disabled={isPast || isHoliday} className={baseStyle}>
          {/* Número del día */}
          <motion.span
            key={day}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-base font-bold self-start"
          >
            {day}
          </motion.span>

          {/* Indicador de citas */}
          {dayEvents.length > 0 && (
            <div className="flex flex-col items-end text-xs">
              <span className="font-semibold">{dayEvents.length}</span>
              <span className="hidden xl:flex">
                {dayEvents.length > 1 ? "turnos" : "turno"}
              </span>
            </div>
          )}

          {/* Nombre del feriado */}
          {isHoliday && (
            <div className="absolute bottom-1 left-1 right-1 text-[10px] text-center text-white font-semibold truncate">
              {matchingHoliday?.nombre}
            </div>
          )}
        </button>
      </TooltipTrigger>

      {/* Tooltip de feriado */}
      {isHoliday && matchingHoliday && (
        <TooltipContent className="backdrop-blur border rounded-lg bg-white text-black shadow-md p-2 w-[200px]">
          <div className="font-semibold">{matchingHoliday.nombre}</div>
          <div className="flex items-center gap-2 text-xs mt-1">
            {matchingHoliday.tipo === "inamovible" ? (
              <>
                <CalendarX className="w-4 h-4 text-red-500" />
                <span>{`Feriado: ${matchingHoliday.tipo}`}</span>
              </>
            ) : (
              <>
                <PartyPopper className="w-4 h-4 text-emerald-500" />
                <span>{`Feriado: ${matchingHoliday.tipo}`}</span>
              </>
            )}
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export default CalendarDay;
