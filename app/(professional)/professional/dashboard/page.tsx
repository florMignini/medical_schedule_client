import { cookies } from "next/headers";
import {
  AppointmentsIncluded,
  InstitutionsIncluded,
  PatientsIncluded,
} from "@/interfaces";
import Link from "next/link";
import WelcomeSection from "../components/WelcomeSection";

import PatientsByAge from "../components/charts/PatientsByAge";

import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";
import Loading from "../components/Loading";
import InstitutionCardWithActions from "../institutions/components/InstitutionCardWithActions";
import StatsCardsWrapper from "../components/StatsCardsWrapper";
import AppointmentsPerWeekChart from "../components/charts/AppointmentsPerWeekChart";
import PatientCardWithActions from "../patients/components/PatientCardWithAction";

const ProfessionalDashboard = async () => {
  const cookieStore = cookies();
  const isDemo = cookieStore.get("isDemo")?.value === "true";
  let data;
  try {
    const res = await getProfessionalIncludesFromCookies();
    data = res.data;
  } catch (error) {
    return <Loading />;
  }

  if (!data || !data.patientsIncluded || !data.institutionsIncluded) {
    return <Loading />;
  }

  // @ts-ignore
  const { patientsIncluded }: { patientsIncluded: PatientsIncluded[] } = data;

  // @ts-ignore
  const {
    appointmentsIncluded,
  }: { appointmentsIncluded: AppointmentsIncluded[] } = data;
  
  // @ts-ignore
  const {
    institutionsIncluded,
  }: { institutionsIncluded: InstitutionsIncluded[] } = data;
  // preview data for rendering
  const previewPatients = patientsIncluded.slice(0, 6);
  const previewInstitutions = institutionsIncluded.slice(0, 3);

  return (
    <section className="w-full z-50 h-full flex flex-col lg:grid lg:grid-cols-[70%,30%] overflow-y-auto px-4 py-4 gap-1 bg-gradient-to-br from-[#f0f4f8] via-[#f9fafa] to-[#e8f0ff]">
      {/* Left section */}
      <div className="w-full bg-white rounded-lg h-auto flex flex-col gap-2 mx-auto items-center justify-start px-2 overflow-x-hidden max-w-full">
        <StatsCardsWrapper
          data={[
            { label: "Pacientes", value: patientsIncluded.length },
            { label: "Turnos", value: appointmentsIncluded.length },
          ]}
        />

        {/* CHARTS */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow-md rounded-xl p-4">
            <PatientsByAge patients={patientsIncluded} />
          </div>
          <div className="bg-white/40 backdrop-blur-md shadow-md rounded-xl p-4 border border-white/20">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Turnos por día (últimos 7 días)
            </h2>
            <AppointmentsPerWeekChart appointments={appointmentsIncluded} />
          </div>
        </div>

        {/* PACIENTES */}
        <div className="bg-white shadow-lg rounded-xl mt-6 p-6 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 hover:text-gray-400">
              Pacientes
            </h2>
            <Link
              href="/professional/patients"
              className="text-blue-600 hover:font-bold text-sm"
            >
              Ver todos
            </Link>
          </div>

          {patientsIncluded.length < 1 ? (
            <p className="text-gray-600">Aún no posee pacientes registrados</p>
          ) : (
            <PatientCardWithActions
              patientsIncluded={previewPatients}
              isDemo={isDemo}
              showFloatingButton={false} 
            />
          )}
          <p className="text-xs text-gray-400 mt-2">
            Mostrando {previewPatients.length} de {patientsIncluded.length}{" "}
            pacientes
          </p>
        </div>

        {/* INSTITUCIONES */}

        <div className="bg-white shadow-lg rounded-xl mt-6 p-6 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 hover:text-gray-400">
              Instituciones
            </h2>
            <Link
              href="/professional/institutions"
              className="text-blue-600 hover:font-bold text-sm"
            >
              Ver todas
            </Link>
          </div>

          {institutionsIncluded.length < 1 ? (
            <p className="text-gray-600">Aún no posee instituciones activas</p>
          ) : (
            <InstitutionCardWithActions
              institutionsIncluded={previewInstitutions}
              isDemo={isDemo}
              showFloatingButton={false} 
            />
          )}
          <p className="text-xs text-gray-400 mt-2">
            Mostrando {previewInstitutions.length} de{" "}
            {institutionsIncluded.length} instituciones
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="hidden min-[768px]:flex">
        <WelcomeSection professional={data} />
      </div>
    </section>
  );
};

export default ProfessionalDashboard;
