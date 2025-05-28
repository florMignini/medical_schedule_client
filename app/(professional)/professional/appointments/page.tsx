import { cookies } from "next/headers";
import { apiServer } from "@/api/api-server";
import {
  AppointmentsIncluded,
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

  return (
    <section className="w-full h-full flex flex-col items-center justify-center gap-2 text-color">
      {/* Title */}
      <div className="flex w-[90%] h-10 min-[768px]:mt-6 items-center justify-start px-2">
        <h1 className="text-18-bold text-start">Reservaciones</h1>
      </div>
      {/* top section */}
      <div className="w-[90%] flex items-center justify-start gap-2 ">
        <CalendarIcon width={20} height={20} className="text-color" />
        <div className="flex items-center justify-center gap-1">
          <h1 className="text-18-bold ">{appointmentsIncluded?.length}</h1>
          <p className="text-18-bold">
            {appointmentsIncluded?.length > 1 ? `Citas totales` : `Cita total`}
          </p>
        </div>
      </div>
      {/* Calendar section */}
      <div className="w-[98%] grid grid-cols-[50,50] h-auto py-4 min-[768px]:flex min-[768px]:flex-row min-[768px]:mt-10 xl:gap-8 bg-slate-50 border-[1px] border-gray-200 rounded-lg">
        <div className="w-[100%]">
          <Calendar appointments={appointmentsIncluded} />
        </div>
        {/* Lista de eventos */}
        <div className="w-[100%] mx-auto">
          <AppointmentsList 
          patients={patientsIncluded}
          appointments={appointmentsIncluded} />
        </div>
      </div>
    </section>
  );
};

export default Appointments;
