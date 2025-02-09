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
import { ProfessionalInformation, AppointmentsIncluded, PatientsIncluded } from "@/interfaces";
import Link from "next/link";
import TotalPatientVsTodayPatient from "./charts/TotalPatientVsTodayPatient";
import TotalAppoitmentsVsTodayAppoitments from "./charts/TotalAppointmentsVsTodayAppointments";

const WelcomeSection = ({
  professional,
}: {
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

// charts information
// @ts-ignore
  const {
    appointmentsIncluded,
  }: { appointmentsIncluded: AppointmentsIncluded[] } = professional;

  // @ts-ignore
    const { patientsIncluded }: { patientsIncluded: PatientsIncluded[] } = professional;

  return (

      <div className="w-[95%] mx-auto h-full flex flex-col  bg-white glass-effect">
      {/* profile section */}
      <div className="w-[99%] h-auto  flex items-start flex-col gap-5 px-2 py-1">
        <div className="w-[100%] flex flex-col gap-3 items-center justify-center mx-auto">
          <Image
            src={
              professional.userImage
                ? professional.userImage
                : professional.gender !== "" && professional.gender === "M"
                ? `https://avatar.iran.liara.run/public/job/doctor/male`
                : `https://avatar.iran.liara.run/public/job/doctor/female`
            }
            width={200}
            height={200}
            priority
            alt="professional-image"
            className="flex items-center justify-center"
          />
          <div className="w-[80%] flex items-center justify-between px-3">
            <Link
              href={
                professional?.instagramUrl?.length! > 2
                  ? `${professional?.instagramUrl}`
                  : "#"
              }
              className={`${
                professional?.newTwitterUrl?.length! > 2
                  ? "p-1 rounded-full hover:bg-gradient-to-b hover:from-black hover:to-[#807f7f] text-transparent text-center hover:opacity-50"
                  : "opacity-40"
              }`}
            >
              <Image
                src={instagram}
                alt="instagram-icon"
                width={20}
                height={20}
              />
            </Link>
            <Link
              href={
                professional?.newTwitterUrl?.length! > 2
                  ? `${professional?.newTwitterUrl}`
                  : "#"
              }
              className={`${
                professional?.newTwitterUrl?.length! > 2
                  ? "p-1 rounded-full hover:bg-gradient-to-b hover:from-black hover:to-[#807f7f] text-transparent text-center hover:opacity-50"
                  : "opacity-40"
              }`}
            >
              <Image src={twitter} alt="twitter-icon" width={20} height={20} />
            </Link>
            <Link
              href={
                professional?.linkedInUrl?.length! > 2
                  ? `${professional?.linkedInUrl}`
                  : "#"
              }
              className={`${
                professional?.linkedInUrl?.length! > 2
                  ? "p-1 rounded-full hover:bg-gradient-to-b hover:from-black hover:to-[#807f7f] text-transparent text-center hover:opacity-50"
                  : "opacity-40"
              }`}
            >
              <Image
                src={linkedin}
                alt="linkedin-icon"
                width={20}
                height={20}
              />
            </Link>
          </div>
        </div>
      </div>
      {/* Welcome */}
      <div className="w-full h-full flex flex-col items-start px-1 py-3 justify-start gap-6">
        <div className="w-[95%] flex items-center justify-center gap-3 text-gradient border-gray-400 border-b-[1px] pb-3">
          <div className="flex items-center justify-center md:justify-start flex-col">
            <h1 className="text-lg font-semibold text-black">{`${professional.firstName} ${professional.lastName}`}</h1>
            <Badge
              className="w-auto text-color flex items-center justify-center border-[#A7B3C8]"
              variant={professional.isActive ? "outline" : "destructive"}
            >
              {professional.isActive ? "activo" : "inactivo"}
            </Badge>
          </div>
          <Link
            href={`/professional/update-profile`}
            className="flex w-[8] h-[8] p-2 rounded-full  text-transparent hover:opacity-50"
          >
            <Image
              src={EditIcon}
              alt="edit-icon"
              width={15}
              height={15}
              className="flex items-start justify-center hover:scale-105"
            />
          </Link>
        </div>
        {/* professional and personal info */}
        <div className="hidden min-[520px]:w-[95%] min-[520px]:flex flex-col items-center justify-center mx-auto">
          {/* specialty */}
          <div className="w-full h-8 flex items-center justify-start gap-2 text-xs font-medium truncate">
            <label className="text-black font-bold text-[15px]">
              Especialidad:{" "}
            </label>
            <input
              disabled
              value={professional.specialty}
              className="text-gray-800 font-light text-[14px] bg-transparent"
            />
          </div>
          {/* phone Number */}
          <div className="w-full h-8 flex items-center justify-start gap-2 text-xs font-medium">
            <label className="text-black font-bold text-[15px]">
              Teléfono:{" "}
            </label>
            <input
              disabled
              value={professional.phoneNumber}
              className="text-gray-800 font-light text-[14px] bg-transparent"
            />
          </div>
          {/* email */}
          <div className="w-full h-8 flex items-center justify-start gap-2 text-xs font-medium border-gray-400 border-b-[1px]">
            <label className="text-black font-bold text-[15px]">Email: </label>
            <input
              disabled
              value={professional.email}
              className="text-gray-800 font-light text-[14px] bg-transparent"
            />
          </div>
          {/* patients & appointments */}
          <div className="w-full flex items-center justify-start gap-2 mt-5">
            <div className="w-[50%] flex flex-col items-start justify-start">
              <h2 className="font-bold text-base">2543</h2>
              <p className="font-light truncate text-xs">turnos del día</p>
            </div>
            <div className="w-[50%] flex flex-col items-start justify-start">
              <h2 className="font-bold text-base">3567</h2>
              <p className="font-light truncate text-xs">pacientes hoy</p>
            </div>
          </div>
          {/* today & total patients chart */}
          <div className="w-[100%] h-auto flex flex-col gap-2 items-center justify-center mt-6">
            <TotalPatientVsTodayPatient patients={patientsIncluded} />
            <TotalAppoitmentsVsTodayAppoitments appointments={appointmentsIncluded}/>
          </div>
        </div>
      </div>
    </div>

  );
};

export default WelcomeSection;
