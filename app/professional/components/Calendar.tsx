"use client";
import { useState } from "react";
import dayjs from "dayjs";


import { Patient } from "@/interfaces";


import ArrowRight from "./icons/ArrowRight";
import ArrowLeft from "./icons/ArrowLeft";

import { useSelectedDate } from "@/utils/useSelectedDate";

const Calendar = ({ appointments }: any) => {
  const {selectedDate, setSelectedDate } = useSelectedDate();
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [currentYear, setCurrentYear] = useState(dayjs().year());

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
      <div className="w-[100%] flex items-center justify-between text-black">
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
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const date = dayjs(
            `${currentYear}-${currentMonth + 1}-${day}`
          ).format("DD-MM-YYYY");
          const dayEvents = appointments.filter(
            (appointment: any) =>
              dayjs(appointment.appointment.schedule).format("DD-MM-YYYY") ===
              date
          );

          return (
            <button
              className="cursor-pointer flex items-start w-full h-20 glass-effect border rounded-md mx-auto"
              key={idx}
              onClick={() => {
                const newDate = dayjs(`${currentYear}-${currentMonth + 1}-${day}`).toDate();
                if (!dayjs(selectedDate).isSame(newDate, "day")) {
                  setSelectedDate(newDate);
                }
              }}
            >
              <div className="flex flex-col items-end justify-start w-full h-full">
              <h1 className="font-bold text-black text-end">{day}</h1>
              {dayEvents.length > 0 && (
                <div className="flex items-center justify-center size-8 bg-black text-white font-bold rounded-full border-[1px] border-black p-1">
                  {dayEvents.length}
                </div>
              )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
