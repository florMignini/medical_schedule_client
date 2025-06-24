import { cookies } from "next/headers";
import { apiServer } from "@/api/api-server";
import {
  AppointmentsIncluded,
  Patient,
  PatientsIncluded,
  ProfessionalInformation,
} from "@/interfaces";

import Calendar from "../components/Calendar";
import CalendarIcon from "../components/icons/CalendarIcon";
import AppointmentsList from "../components/AppointmentsList";


const Appointments = async () => {
  const cookieStore = cookies();
  const professionalId = cookieStore.get("professional-id")?.value;
  let { data }: { data: ProfessionalInformation } = await apiServer.get(
    `/professional/get-professional/${professionalId}`
  );
  // @ts-ignore
  const {
    appointmentsIncluded,
  }: { appointmentsIncluded: AppointmentsIncluded[] } = data ?? {
    appointmentsIncluded: [],
  };
  // @ts-ignore
  const { patientsIncluded }: { patientsIncluded: PatientsIncluded[] } =
  data ?? {
    appointmentsIncluded: [],
  };

  const pastAppointmentPatientData = await apiServer.get<Patient>(
          `https://medical-schedule-server.onrender.com/api/patients/get-patient/${patientsIncluded[0]?.patient.id}`
        );
        console.log("pastAppointmentPatientData", pastAppointmentPatientData.data.pastAppointmentsIncluded);
  return (
    <section className="w-[99%] py-8 mx-auto h-full flex flex-col items-center justify-start gap-2 text-color bg-white">
      {/* Title */}
      <div className="flex flex-col w-[99%] h-14 items-start justify-center px-2 border-b-[1px] border-b-gray-500">
            <h1 className="text-2xl text-black font-semibold text-start">
              Calendario
            </h1>
            <p className="hidden md:flex text-xs font-light text-gray-600">
              Aquí encontrará los turnos programados para el mes seleccionado
            </p>
          </div>
      {/* top section */}
      <div className="w-[95%] mx-auto flex items-center justify-start gap-2 ">
        <CalendarIcon width={20} height={20} className="text-color" />
        <div className="flex items-center justify-center gap-1">
          <h1 className="text-18-bold ">{appointmentsIncluded?.length}</h1>
          <p className="text-18-bold">
            {appointmentsIncluded?.length > 1 ? `Citas totales` : `Cita total`}
          </p>
        </div>
      </div>
      {/* Calendar section */}
      <div className="w-[98%] h-auto grid grid-cols-[50,50] py-4 min-[768px]:flex min-[768px]:flex-row min-[768px]:mt-10 xl:gap-8 glass-effect-vibrant rounded-lg">
        <div className="w-[100%]">
          <Calendar appointments={appointmentsIncluded} />
        </div>
        {/* Lista de eventos */}
        <div className="w-[100%] mx-auto">
          <AppointmentsList 
          patients={patientsIncluded}
          appointments={appointmentsIncluded}
          pastAppointmentPatientData={pastAppointmentPatientData?.data?.pastAppointmentsIncluded}
          />
        </div>
      </div>
    </section>
  );
};

export default Appointments;
