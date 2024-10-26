import Icon from "@/components/ui/icon"
import { cookies } from "next/headers";
import { apiServer } from "@/api/api-server";
import { AppointmentsIncluded, ProfessionalInformation } from "@/interfaces";
import calendar from "../../../public/assets/icons/appointments.svg"
import Link from "next/link";
import Calendar from "../components/Calendar";

const Appointments = async() => {
    const cookieStore = cookies();
  const professionalId = cookieStore.get("professional-id")?.value;

  let { data }: { data: ProfessionalInformation } = await apiServer.get(
    `/professional/get-professional/${professionalId}`
  );
//   const { patientsIncluded }: { patientsIncluded: PatientsIncluded[] } = data;
  const { appointmentsIncluded }: { appointmentsIncluded: AppointmentsIncluded[] } = data ?? { appointmentsIncluded: [] };
  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
         {/* Title */}
      <div className="flex w-[90%] h-10 items-start justify-start px-2">
        <h1 className="text-18-bold text-start">Reservaciones</h1>
      </div>
      {/* top section */}
      <div className="w-[90%] flex items-center justify-start gap-2">
       <Icon
       src={calendar}
       alt="calendar-icon"
       width={25}
       height={25}
       />
       <div className="flex items-center justify-center gap-1">
        <h1 className="text-18-bold text-dark-500">{appointmentsIncluded.length}</h1>
        <p className="text-18-bold">{appointmentsIncluded.length >1 ? `Citas totales` : `Cita total`}</p>
       </div>
      </div>
      {/* Calendar section */}
      <div className="w-full py-4">
      <Calendar
      appointments={appointmentsIncluded}
      />
      </div>
    </section>
  )
}

export default Appointments