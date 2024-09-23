"use client"
import Image from 'next/image'
import WelcomeGif from "../../../public/assets/medical-welcome.gif";
import { useEffect, useState } from 'react';
import { getDate } from '@/utils/getDate';

const WelcomeSection = () => {
const [todayDate, setTodayDate] = useState<string>()
    useEffect(() => {
      let date = getDate()
      setTodayDate(date)
    }, [])
    
  return (
    <div className="w-[99%] grid grid-cols-[60%,40%] py-2 px-5 bg-dark-400 rounded-md">
    {/* Welcome */}
    <div className="w-full flex flex-col items-start pl-1 justify-between gap-1">
      {/* date */}
        <div className="w-36 h-7 px-2 flex items-center rounded-md bg-dark-500">
              <h1>Today Date</h1>
        </div>
        {/* Message */}
        <div className="w-[90%] flex flex-col gap-2 pb-1">
            <h1 className="text-24-bold capitalize">Bienvenido Dr. Lastname</h1>
            <p className="text-12-regular text-light-200 capitalize">{`que tengas un lindo ${todayDate}`}</p>
        </div>
    </div>
    {/* gif */}
    <div className="w-full flex items-center justify-end">
      <Image
        src={WelcomeGif}
        alt="welcome-gif"
        width={200}
        height={200}
        className="rounded-md"
      />
    </div>
  </div>
  )
}

export default WelcomeSection