import dayjs from "dayjs";
import { motion } from "framer-motion";

import { CalendarX, PartyPopper } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  day: number;
  currentMonth: number;
  currentYear: number;
  appointments: any[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  today: dayjs.Dayjs;
  holidays: any[];
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
}: Props) => {
  const date = dayjs(`${currentYear}-${currentMonth + 1}-${day}`);
  const formattedDate = date.format("DD-MM-YYYY");

  const dayEvents = appointments.filter(
    (appointment: any) =>
      dayjs(appointment.appointment.schedule).format("DD-MM-YYYY") === formattedDate
  );
  const hasPastAppointment = dayEvents.some((appt: any) =>
    dayjs(appt.appointment.schedule).isBefore(today)
  );
  
  const isSelected = dayjs(selectedDate).isSame(date, "day");
  const isPast = date.isBefore(today, "day") && dayEvents.length === 0;

  const matchingHoliday = holidays.find(
    (holiday: any) =>
      dayjs(holiday.fecha).format("DD-MM") === date.format("DD-MM")
  );

  const isHoliday = Boolean(matchingHoliday);

  const handleClick = () => {
    if (isPast || isHoliday || hasPastAppointment) return;
    if (!isSelected) {
      setSelectedDate(date.toDate());
    }
  };
  

  const bgColor = isHoliday
    ? "bg-black/90 text-white cursor-not-allowed"
    : dayEvents.length > 0
    ? "bg-emerald-500 text-black hover:bg-emerald-300"
    : "bg-white";

  return (
    <button
      key={day}
      onClick={handleClick}
      disabled={isHoliday || isPast || hasPastAppointment}
      className={`cursor-pointer border-[1px] shadow-lg flex items-start w-full h-20 rounded-md mx-auto
        ${bgColor}
        ${isSelected && !isHoliday ? "ring-2 ring-black" : ""}
        ${(isPast || hasPastAppointment) && !isSelected ? "opacity-50 cursor-not-allowed" : "hover:bg-black/20"}
      `}
    >
      <div className="flex flex-col rounded-lg p-1 items-end justify-start w-full h-full">
      <motion.h1
  className={`font-bold text-end ${isHoliday ? "text-white" : "text-black"}`}
  animate={isSelected ? { scale: 1.2 } : { scale: 1 }}
  transition={{ type: "spring", stiffness: 500, damping: 12 }}
>
  {day}
</motion.h1>

        {dayEvents.length > 0 && (
          <div className="flex items-end justify-end text-white text-xl font-bold p-1 flex-col">
            <p className="text-base font-bold text-center truncate">
              {dayEvents.length}
            </p>
            <p className="hidden min-[1024px]:flex text-base font-bold truncate">
              {dayEvents.length > 1 ? "turnos" : "turno"}
            </p>
          </div>
        )}

        {isHoliday && matchingHoliday && (
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-xs truncate font-semibold text-end w-full">
                {matchingHoliday.nombre}
              </p>
            </TooltipTrigger>
            <TooltipContent className="flex flex-col items-start text-black p-2 w-auto backdrop-blur-lg">
              <p className="font-semibold">{matchingHoliday.nombre}</p>
              <div className="flex items-center gap-2 text-xs">
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
          </Tooltip>
        )}
      </div>
    </button>
  );
};

export default CalendarDay;
