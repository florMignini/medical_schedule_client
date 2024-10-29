"use client";
import Image from "next/image";
import WelcomeGif from "../../../public/assets/medical-welcome.gif";
import Icon from "@/components/ui/icon";
import { useEffect, useState } from "react";
import { getDate, getDay } from "@/utils/getDate";
import CalendarIcon from "../../../public/assets/icons/calendar.svg"

const WelcomeSection = () => {
  const [todayDay, setTodayDay] = useState<string>();
  const [infoProfSession, setInfoProfSession] = useState<any>();
  const [todayDate, setTodayDate] = useState<string>();
  // effect for week day
  useEffect(() => {
    let date = getDay();
    setTodayDay(date);
  }, [infoProfSession]);
  // effect for prof session info
  useEffect(() => {
    let profData = localStorage.getItem("infoProfSession");
    if (profData) {
      setInfoProfSession(JSON.parse(profData));
    }
  }, []);
//   effect for todays full date
useEffect(() => {
  let getTodayDate = getDate()
  setTodayDate(getTodayDate);
}, [])

  return (
    <div className="w-[99%] grid grid-cols-[60%,40%] py-2 px-5 border bg-transparent border-dark-400 rounded-md ">
      {/* Welcome */}
      <div className="w-full flex flex-col items-start pl-1 justify-evenly gap-1">
        {/* date */}
        <div className="w-36 h-7 px-2 flex justify-around items-center rounded-md bg-dark-500 text">
            <Icon
            src={CalendarIcon}
            alt="calendar-icon"
            width={15}
            height={15}
            />
          <h1 className="font-light ">{todayDate}</h1>
        </div>
        {/* Message */}
        <div className="w-[90%] flex flex-col gap-2 pb-1">
          <h1 className="text-24-bold capitalize">{`Bienvenido Dr. ${infoProfSession ? infoProfSession.lastname : "..."}`}</h1>
          <p className="text-base font-light text-light-200 capitalize">{`que tengas un lindo ${
            todayDay ? todayDay : `...`
          }`}</p>
        </div>
      </div>
      {/* gif */}
      <div className="w-full flex items-center justify-end">
        <Image
        unoptimized
          src={WelcomeGif}
          alt="welcome-gif"
          width={200}
          height={200}
          className="rounded-md"
        />
      </div>
    </div>
  );
};

export default WelcomeSection;
