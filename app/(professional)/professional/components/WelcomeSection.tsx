import Image from "next/image";
import Link from "next/link";
import { ProfessionalInformation } from "@/interfaces";

import dayjs from "dayjs";
import Instagram from "./icons/Instagram";
import LinkedIn from "./icons/LinkedIn";
import NewTwitter from "./icons/NewTwitter";

const WelcomeSection = ({ professional }: { professional: ProfessionalInformation }) => {
  const monthlyConsultations = 100;
  const newPatientsThisMonth = 18;
  const todayAppointments = 4;
  const todayPatients = 5;
console.log(professional);
  return (
    <section className="w-full max-w-5xl mx-auto flex flex-col  gap-3 p-4">
      {/* Card Izquierda */}
      <div className="bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center">
        <div className="w-full bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-400 rounded-xl h-20 relative">
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
            <Image
              src={
                professional?.userImage ||
                (professional.gender === "M"
                  ? `https://avatar.iran.liara.run/public/job/doctor/male`
                  : `https://avatar.iran.liara.run/public/job/doctor/female`)
              }
              alt="Avatar"
              width={100}
              height={100}
              className="rounded-full border-4 border-white shadow-md"
            />
          </div>
        </div>

        <div className="mt-14 text-center">
          <h2 className="text-lg font-bold text-gray-900">
            Dr. {professional.firstName} {professional.lastName}
          </h2>
          <p className="text-sm text-gray-500">{professional.specialty}</p>
          <Link href="/professional/update-profile">
            <button className="mt-3 px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              editar
            </button>
          </Link>
        </div>

        <div className="w-full mt-6 text-left">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Información básica</h3>
          <div className="space-y-1 text-sm text-gray-700">
            <p>🎂 Fecha de nacimiento: {dayjs(professional.updatedAt).locale("es").format("DD [de] MMMM [de] YYYY")}</p>
            <p>📞 Teléfono: {professional.phoneNumber || "+54 9 11 2345 6789"}</p>
          </div>
          <h3 className="text-sm font-semibold text-gray-700 mt-2 mb-2">Detalles de la cuenta</h3>
          <div className="space-y-1 text-sm text-gray-700">
            <p>🧑‍⚕️ Miembro desde: {dayjs(professional.createdAt).locale("es").format("DD [de] MMMM [de] YYYY")}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-4 justify-center">
          <Link href={professional.instagramUrl || "#"} target="_blank">
            <Instagram width={16} height={16} color="#000" />
          </Link>
          <Link href={professional.linkedInUrl || "#"} target="_blank">
            <LinkedIn width={16} height={16} color="#000" />
          </Link>
          <Link href={professional.newTwitterUrl || "#"} target="_blank">
            <NewTwitter width={16} height={16} color="#000" />
          </Link>
        </div>
      </div>

      {/* Card Derecha - Estadísticas */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
        <div className="space-y-6">
          <Stat label="Consultas mensuales" value={monthlyConsultations} total={120} color="bg-yellow-400" />
          <Stat label="Pacientes nuevos" value={newPatientsThisMonth} total={30} color="bg-green-500" />
          <Stat label="Turnos del día" value={todayAppointments} total={6} color="bg-blue-500" />
          <Stat label="Pacientes del día" value={todayPatients} total={6} color="bg-purple-500" />
        </div>
      </div>
    </section>
  );
};

const Stat = ({ label, value, total, color }: { label: string; value: number; total: number; color: string }) => {
  const percentage = Math.min((value / total) * 100, 100);
  return (
    <div>
      <div className="flex justify-between items-center text-sm mb-1">
        <p className="text-gray-700 font-medium">{label}</p>
        <span className="text-gray-600">{value}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default WelcomeSection;
