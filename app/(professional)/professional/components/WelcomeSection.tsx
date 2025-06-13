"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getDate, getDay } from "@/utils/getDate";
import Instagram from "../components/icons/Instagram";
import twitter from "../../professional/components/icons/NewTwitter";
import linkedin from "../../../(professional)/professional/components/icons/LinkedIn";
import "dayjs/locale/es";
dayjs.locale("es");
import {
  ProfessionalInformation,
  AppointmentsIncluded,
  PatientsIncluded,
} from "@/interfaces";
import Link from "next/link";
import TotalPatientVsTodayPatient from "./charts/TotalPatientVsTodayPatient";
import TotalAppoitmentsVsTodayAppoitments from "./charts/TotalAppointmentsVsTodayAppointments";
import EditIcon from "./icons/EditIcon";

import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import LinkedIn from "./icons/LinkedIn";
import NewTwitter from "./icons/NewTwitter";
import { filterTodayAppointments } from "@/utils/getChartsHelpers";
dayjs.extend(LocalizedFormat);

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
  const { patientsIncluded }: { patientsIncluded: PatientsIncluded[] } =
    professional;
  const filteredResult = filterTodayAppointments(appointmentsIncluded);

  return (
    <div className="w-[95%] mx-auto flex flex-col glass-effect-vibrant">
      {/* profile section */}
      <div className="w-[99%] h-auto flex items-center justify-start flex-col px-2 py-1">
        <div className="w-[100%] flex flex-col items-center justify-center mx-auto">
          <div className="w-[100%] flex flex-col items-center justify-center ">
            <Link
              href={`/professional/update-profile`}
              className="w-[100%] h-full flex items-start justify-end"
            >
              <div className="flex items-center justify-center rounded-xl border-[1px] border-[#6b7280] p-[2px] text-transparent hover:opacity-70 gap-1 transition-opacity duration-400 ease-in-out">
                <EditIcon
                  width={10}
                  height={10}
                  color="#6b7280"
                  className="flex items-center justify-center"
                />
                <p className="text-xs text-gray-500">editar</p>
              </div>
            </Link>
            <div className="w-[100%] flex items-center justify-center pr-3">
              <Image
                src={
                  professional.userImage
                    ? professional.userImage
                    : professional.gender !== "" && professional.gender === "M"
                    ? `https://avatar.iran.liara.run/public/job/doctor/male`
                    : `https://avatar.iran.liara.run/public/job/doctor/female`
                }
                width={100}
                height={100}
                priority
                alt="professional-image"
                className="flex items-center justify-end rounded-full"
              />
            </div>
          </div>
          <div className="w-[100%] flex flex-col items-center justify-center mx-auto text-xs">
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
              } flex items-center justify-center gap-2`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram width={12} height={12} color="#000000" />
              <p>
                {professional?.instagramUrl
                  ? professional?.instagramUrl
                  : "@instagram"}
              </p>
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
              } flex items-center justify-center gap-2`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedIn width={12} height={12} color="#000000" />
              <p>
                {professional?.linkedInUrl
                  ? professional?.linkedInUrl
                  : "@linkedIn"}
              </p>
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
              } flex items-center justify-center gap-2`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <NewTwitter color="#000000" width={12} height={12} />
              <p>
                {professional?.newTwitterUrl
                  ? professional?.newTwitterUrl
                  : "@twitter/x"}
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Welcome */}
      <div className="w-full flex flex-col items-start px-1 py-3 justify-start">
        {/* account and personal info */}
        <div className="w-full h-full min-[520px]:w-[95%] min-[520px]:flex flex-col items-center justify-center mx-auto">
          {/* personal details */}
          <h1 className="w-full text-start text-sm font-semibold text-black">
            Datos personales:
          </h1>
          <div className="w-full h-auto flex flex-col items-center justify-center pb-2">
            {/* fullname */}
            <div className="w-[100%] flex items-center justify-between py-1">
              <p className="text-xs font-medium text-gray-400">
                Nombre completo:{" "}
              </p>
              <p className="text-xs font-light text-black truncate">{`${professional?.firstName} ${professional?.lastName} `}</p>
            </div>
            {/* specialty */}
            <div className="w-[100%] flex items-center justify-between py-1">
              <p className="text-xs font-medium text-gray-400">
                Especialidad:{" "}
              </p>
              <p className="text-xs font-light text-black truncate">
                {professional?.specialty}
              </p>
            </div>
            {/* gender */}
            <div className="w-[100%] flex items-center justify-between py-1">
              <p className="text-xs font-medium text-gray-400">
                fecha de Nacimiento:{" "}
              </p>
              <p className="text-xs font-light text-black truncate">
                {professional?.gender === "M" ? "Masculino" : "Femenino"}
              </p>
            </div>
            {/* phone */}
            <div className="w-[100%] flex items-center justify-between py-1">
              <p className="text-xs font-medium text-gray-400">
                Número de teléfono:{" "}
              </p>
              <p className="text-xs font-light text-black truncate">
                {professional?.phoneNumber}
              </p>
            </div>
            {/* email */}
            <div className="w-[100%] flex items-center justify-between py-1">
              <p className="text-xs font-medium text-gray-400">Email: </p>
              <p className="text-xs font-light text-black truncate">
                {professional?.email}
              </p>
            </div>
            {/* account details */}
            <div className="w-[100%] flex flex-col items-start justify-between py-1">
              <h1 className="w-full text-start text-sm font-semibold text-black py-1">
                Detalles de la cuenta:
              </h1>
              <div className="w-full flex items-center justify-between py-1">
              <p className="text-xs font-medium text-gray-400">
                Miembro desde:{" "}
              </p>
              <p className="text-xs font-light text-black truncate">
                {dayjs(professional?.createdAt).locale("es").format("LL")}
              </p>
              </div>
            </div>
          </div>

          <div className="w-full h-auto flex flex-col items-center justify-start border-b-[1px] border-[#f8f9f9] pb-2"></div>
          {/* patients & appointments */}
          <div className="min-[520px]:w-full min-[520px]:flex items-center justify-start gap-2 mt-5">
            <div className="w-[50%] flex flex-col items-start justify-start">
              <h2 className="font-bold text-base">{filteredResult.length}</h2>
              <p className="font-light truncate text-xs">{`${
                filteredResult.length > 1 ? "turno del día" : "turnos del día"
              } `}</p>
            </div>
            <div className="w-[50%] flex flex-col items-start justify-start">
              <h2 className="font-bold text-base">{filteredResult.length}</h2>
              <p className="font-light truncate text-xs">pacientes hoy</p>
            </div>
          </div>
          {/* today & total patients chart */}
          <div className="min-[520px]:w-full min-[520px]:flex h-auto flex-col gap-2 items-center justify-center mt-6">
            <TotalPatientVsTodayPatient
              patients={patientsIncluded}
              appointments={appointmentsIncluded}
            />
            <TotalAppoitmentsVsTodayAppoitments
              appointments={appointmentsIncluded}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
