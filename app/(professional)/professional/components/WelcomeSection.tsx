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

  // Calculate monthly consultations
  const currentMonth = dayjs().month();
  const monthlyConsultations = appointmentsIncluded.filter(
    (appointment) => dayjs(appointment.appointment.schedule).month() === currentMonth
  ).length;

  // Calculate new patients this month
  const newPatientsThisMonth = patientsIncluded.filter(
    (patient) => dayjs(patient.createdAt).month() === currentMonth
  ).length;

  // Calculate today's appointments
  const todayAppointments = filteredResult?.length;

  // Calculate today's patients (unique patients with appointments today)
  const todayPatients = new Set(
    filteredResult?.map(appointment => appointment.appointment.id)
  ).size;

  // Calculate percentages for progress bars
  const monthlyConsultationsPercentage = Math.min((monthlyConsultations / 120) * 100, 100); // ~6 patients per day, 20 working days
  const newPatientsPercentage = Math.min((newPatientsThisMonth / 30) * 100, 100); // ~1-2 new patients per day
  const todayAppointmentsPercentage = Math.min((todayAppointments ?? 0 / 6) * 100, 100); // 6 appointments per day
  const todayPatientsPercentage = Math.min((todayPatients / 6) * 100, 100); // 6 patients per day

  return (
    <div className="w-[95%] font-mono text-xs md:sm mx-auto flex flex-col  gap-2">
      {/* profile section */}
      <div className="w-full max-w-md mx-auto rounded-2xl shadow-lg overflow-hidden bg-white">
        {/* Header con fondo y avatar */}
        <div className="relative h-32 bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-400">
          {/* <div className="absolute inset-0 bg-[url('/fondo-abstracto.jpg')] bg-cover opacity-20"></div> */}
          <div className="absolute bottom-[-2.5rem] left-1/2 transform -translate-x-1/2">
            <Image
              src={
                professional.userImage
                  ? professional.userImage
                  : professional.gender === "M"
                  ? `https://avatar.iran.liara.run/public/job/doctor/male`
                  : `https://avatar.iran.liara.run/public/job/doctor/female`
              }
              width={100}
              height={100}
              alt="professional-image"
              className="rounded-full border-4 border-white shadow-md"
            />
          </div>
        </div>

        {/* Información del profesional */}
        <div className="pt-12 pb-6 px-1 text-center">
 
          <h2 className="text-lg font-semibold text-gray-800">
            {professional &&
              `${professional.firstName} ${professional.lastName}`}
          </h2>
          <p className="text-sm text-gray-500">
            {professional && professional.specialty}
          </p>

          {/* Botón editar */}
          <div className="flex justify-center space-y-2">
            <Link href={`/professional/update-profile`}>
              <div className="flex items-center gap-1 text-xs text-gray-500 hover:opacity-70 border border-gray-400 px-2 py-1 rounded-lg transition">
                <EditIcon width={10} height={10} color="#6b7280" />
                <span>editar</span>
              </div>
            </Link>
          </div>

          {/* Redes sociales */}
          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-600">
            <Link
              href={professional.instagramUrl || "#"}
              className={`${
                professional.instagramUrl &&
                professional.instagramUrl.length > 2
                  ? "hover:opacity-80"
                  : "opacity-40 pointer-events-none"
              }`}
              target="_blank"
            >
              <Instagram width={16} height={16} color="#000" />
            </Link>
            <Link
              href={professional.linkedInUrl || "#"}
              className={`${
                professional.linkedInUrl && professional.linkedInUrl?.length > 2
                  ? "hover:opacity-80"
                  : "opacity-40 pointer-events-none"
              }`}
              target="_blank"
            >
              <LinkedIn width={16} height={16} color="#000" />
            </Link>
            <Link
              href={professional.newTwitterUrl || "#"}
              className={`${
                professional.newTwitterUrl &&
                professional.newTwitterUrl?.length > 2
                  ? "hover:opacity-80"
                  : "opacity-40 pointer-events-none"
              }`}
              target="_blank"
            >
              <NewTwitter width={16} height={16} color="#000" />
            </Link>
          </div>
          {/* Datos personales */}
          <div className="mt-7 text-left">
          <div className="p-4">
            <h3 className="text-gray-600 font-semibold font-mono text-sm lg:text-base mb-1">
              Información básica
            </h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="truncate">🎂 Fecha de nacimiento:</span>
                <span>{"26/09/98"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="truncate">📞 Telefono:</span>
                <span>{professional.phoneNumber || "+54 9 11 2345 6789"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="truncate">✉️ Email:</span>
                <span>{professional.email || "correo@ejemplo.com"}</span>
              </div>
            </div>
         
          {/* account details */}
          <div className="mt-4 text-left">
            <h3 className="text-gray-600 font-semibold font-mono text-sm lg:text-base mb-1">
              Detalles de la cuenta:
            </h3>
            <div className="flex items-center text-xs gap-2 text-gray-700">
              <span className="truncate">⏳ Miembro desde: </span>
              <span className="truncate">
                {dayjs(professional?.createdAt).locale("es").format("LL")}
              </span>
            </div>
          </div>
          </div>
        </div>
        </div>
      </div>

      {/* Statistics section */}
      <div className="w-full max-w-md mx-auto rounded-2xl shadow-lg overflow-hidden bg-white">
        <div className="p-4">
          <h3 className="text-gray-600 text-sm md:text-base font-semibold mb-4">Estadísticas</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-gray-600">Consultas mensuales</p>
                <span className="text-sm font-medium text-gray-700">{monthlyConsultations}/120</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-yellow-400 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${monthlyConsultationsPercentage}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-gray-600">Pacientes nuevos</p>
                <span className="text-sm font-medium text-gray-700">{newPatientsThisMonth}/30</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-400 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${newPatientsPercentage}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-gray-600">Turnos del día</p>
                <span className="text-sm font-medium text-gray-700">{todayAppointments}/6</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-400 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${todayAppointmentsPercentage}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-gray-600">Pacientes del día</p>
                <span className="text-sm font-medium text-gray-700">{todayPatients}/6</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-400 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${todayPatientsPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
