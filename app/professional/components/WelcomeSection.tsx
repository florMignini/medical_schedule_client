"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getDate, getDay } from "@/utils/getDate";
import instagram from "../../../public/assets/icons/instagram.svg";
import twitter from "../../../public/assets/icons/newTwitter.svg";
import linkedin from "../../../public/assets/icons/linkedin.svg";
import Icon from "@/components/ui/icon";
import EditIcon from "../../../public/assets/icons/pencil.svg";
import CalendarIcon from "../../../public/assets/icons/calendar.svg";
import User from "../../../public/assets/profile-doctor.jpg";
import { ProfessionalInformation } from "@/interfaces";
import Link from "next/link";

const WelcomeSection = (professionalData: {
  professional: ProfessionalInformation;
}) => {
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
  //   effect for todayjs full date
  useEffect(() => {
    let getTodayDate = getDate();
    setTodayDate(getTodayDate);
  }, []);

  return (
    <div className="w-[95%] mx-auto h-full grid grid-cols-[50%,50%] p-2 bg-white shadow-[inset_0px_-2px_3px_rgba(73,73,73,0.2)] rounded-lg">
      {/* profile section */}
      <div className="w-[99%] h-auto  flex items-start flex-col gap-5 px-2 py-1">
        {/* date */}
        {/* <div className="w-36 h-5 px-2 flex justify-start gap-1 text-gradient items-center">
          <Image
            src={CalendarIcon}
            alt="calendar-icon"
            width={15}
            height={15}
            className="text-gradient"
          />
          <h1 className="font-light text-[14px]">{todayDate}</h1>
        </div> */}
        <div className="w-[100%] flex flex-col gap-3 items-center justify-center mx-auto">
          <Image
            src={(professionalData.professional.gender !== "" && professionalData.professional.gender === "M") ? `https://avatar.iran.liara.run/public/job/doctor/male` : `https://avatar.iran.liara.run/public/job/doctor/female`}
            width={200}
            height={200}
            priority
            alt="professional-image"
            className="flex items-center justify-center"
          />
          <div className="w-[80%] flex items-center justify-between px-3">
            <Link href="#"
            className="p-1 rounded-full hover:bg-gradient-to-b from-black to-[#807f7f] text-transparent text-center hover:opacity-50"
            >
              <Image
                src={instagram}
                alt="instagram-icon"
                width={20}
                height={20}
                className="hover:scale-105"
              />
            </Link>
            <Link href="#"
            className="p-1 rounded-full hover:bg-gradient-to-b from-black to-[#807f7f] text-transparent text-center hover:opacity-50"
            >
              <Image
                src={twitter}
                alt="twitter-icon"
                width={20}
                height={20}
                className="hover:scale-105"
              />
            </Link>
            <Link href="#"
            className="p-1 rounded-full hover:bg-gradient-to-b from-black to-[#807f7f] text-transparent text-center hover:opacity-50"
            >
              <Image
                src={linkedin}
                alt="linkedin-icon"
                width={20}
                height={20}
                className="hover:scale-105"
              />
            </Link>
          </div>
        </div>
      </div>
      {/* Welcome */}
      <div className="w-full h-full flex flex-col items-start px-1 py-3 justify-start gap-1">
        <div className="w-[95%] flex items-center justify-between text-gradient">
          <div className="flex items-center justify-start flex-col">
            <h1 className="text-lg font-semibold text-black">{`${professionalData.professional.firstName} ${professionalData.professional.lastName}`}</h1>
            <Badge
              className="w-[100%] flex items-center justify-start"
              variant={
                professionalData.professional.isActive
                  ? "secondary"
                  : "destructive"
              }
            >
              {professionalData.professional.isActive ? "activo" : "inactivo"}
            </Badge>
          </div>
          <Link
          href={`/professional/update-profile`}
            className="flex w-[8] h-[8] p-2 rounded-full hover:bg-gradient-to-b from-black to-[#807f7f] text-transparent hover:opacity-50"
          >
            <Image
              src={EditIcon}
              alt="edit-icon"
              width={15}
              height={15}
              className="flex items-start justify-center"
            />
          </Link>
        </div>
        {/* professional and personal info */}
        <div className="w-[95%] flex flex-col items-center justify-start">
          {/* specialty */}
          <div className="w-full h-8 flex items-center justify-start gap-2 text-xs font-medium">
            <label className="text-black">Especialidad: </label>
            <input
              disabled
              value={professionalData.professional.specialty}
              className="bg-transparent borde-b-[1px] border-b-gray-500"
            />
          </div>
          {/* phone Number */}
          <div className="w-full h-8 flex items-center justify-start gap-2 text-xs font-medium">
            <label className="text-black">Teléfono: </label>
            <input
              disabled
              value={professionalData.professional.phoneNumber}
              className="bg-transparent borde-b-[1px] border-b-gray-500"
            />
          </div>
          {/* email */}
          <div className="w-full h-8 flex items-center justify-start gap-2 text-xs font-medium">
            <label className="text-black">Email: </label>
            <input
              disabled
              value={professionalData.professional.email}
              className="bg-transparent borde-b-[1px] border-b-gray-500"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default WelcomeSection;
