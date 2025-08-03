import { cookies } from "next/headers";
import {
  AppointmentsIncluded,
  InstitutionsIncluded,
  PatientsIncluded,
} from "@/interfaces";
import WelcomeSection from "../components/WelcomeSection";

import AddButton from "../components/AddButton";

import PatientsByAge from "../components/charts/PatientsByAge";
import Categorization from "../components/charts/Categorization";

import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";
import PatientCardWithActions from "../patients/components/PatientCardWithAction";
import Loading from "../components/Loading";
import InstitutionCardWithActions from "../institutions/components/InstitutionCardWithActions";
import Link from "next/link";

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

  // Validación simple por si data no viene correctamente
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
  const { followsUpIncluded }: { followsUpIncluded: any[] } = data;
  // @ts-ignore
  const {
    institutionsIncluded,
  }: { institutionsIncluded: InstitutionsIncluded[] } = data;

  return (
    <section className="w-full h-full flex flex-col lg:grid lg:grid-cols-[70%,30%] overflow-y-auto px-4 py-4 gap-4 bg-[#f9fafa]">
      <div className="w-full bg-white rounded-lg h-auto flex flex-col gap-2 mx-auto items-center justify-start px-2 overflow-x-hidden max-w-full">
        {/* CHARTS */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow-md rounded-xl p-4">
            <PatientsByAge patients={patientsIncluded} />
          </div>
          <div className="bg-white shadow-md rounded-xl p-4">
            <Categorization
              appointments={appointmentsIncluded.length}
              followsUp={followsUpIncluded.length}
            />
          </div>
        </div>

        {/* PACIENTES */}
        <Link 
        href={"/professional/patients"}
        className="bg-white shadow-lg rounded-xl mt-6 p-6 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 hover:text-gray-400">Pacientes</h2>
          </div>

          {patientsIncluded.length < 1 ? (
            <p className="text-gray-600">Aún no posee pacientes registrados</p>
          ) : (
            <PatientCardWithActions
              patientsIncluded={patientsIncluded}
              isDemo={isDemo}
            />
          )}
        </Link>

        {/* INSTITUCIONES */}

        <Link
          href="/professional/institutions"
          className="bg-white shadow-lg rounded-xl mt-6 p-6 w-full"
        >
          <h2 className="hover:text-gray-400 text-xl font-semibold text-gray-800 mb-4">
            Instituciones
          </h2>

          {institutionsIncluded.length < 1 ? (
            <div className="w-full flex items-center justify-center gap-4">
              <p className="text-gray-600">
                Aún no posee instituciones activas
              </p>
              <AddButton to="/professional/institution-registration" />
            </div>
          ) : (
            <InstitutionCardWithActions
              institutionsIncluded={institutionsIncluded}
              isDemo={isDemo}
            />
          )}
        </Link>
      </div>

      {/* Right section */}
      <div className="hidden min-[768px]:flex">
        <WelcomeSection professional={data} />
      </div>
    </section>
  );
};

export default ProfessionalDashboard;
