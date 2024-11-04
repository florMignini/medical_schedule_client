import { apiServer } from "@/api/api-server";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import user from "../../../public/assets/icons/users.svg";
import appointments from "../../../public/assets/icons/appointments.svg";
import MailIcon from "../../../public/assets/icons/email.svg";
import PhoneIcon from "../../../public/assets/icons/phone.svg";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AppointmentsIncluded,
  Patient,
  PatientsIncluded,
  ProfessionalInformation,
  ProfessionalPatient,
} from "@/interfaces";
import WelcomeSection from "../components/WelcomeSection";

const ProfessionalDashboard = async () => {
  const cookieStore = cookies();
  const professionalId = cookieStore.get("professional-id")?.value;

  let { data }: { data: ProfessionalInformation } = await apiServer.get(
    `/professional/get-professional/${professionalId}`
  );
  // @ts-ignore
  const { patientsIncluded }: { patientsIncluded: PatientsIncluded[] } = data;
  // @ts-ignore
  const {
    appointmentsIncluded,
  }: { appointmentsIncluded: AppointmentsIncluded[] } = data;
  console.log(data.patientsIncluded);
  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
      <div className="w-[99%] flex h-auto flex-col gap-1">
        {/* information side */}
        <div className="grid grid-rows-[40%,60%] gap-2 my-auto">
          {/*upper section*/}
          <div className="w-[100%] grid grid-cols-[65%,35%]">
            <div>
              <WelcomeSection professional={data} />
            </div>
            {/* total patient and appointments */}
            <div className="flex flex-col items-start justify-start gap-2 my-auto">
              <div className="w-[70%] h-[95px] grid grid-cols-[50%,50%] mx-auto border-[1px] border-gray-600 rounded-lg">
                <div className="w-[90%] h-[90%] flex items-center justify-center">
                  <Image
                    src={user}
                    alt="user-icon"
                    width={10}
                    height={10}
                    className="w-[50%] h-[50%] flex p-2 rounded-full bg-gradient-to-b from-black to-[#807f7f] text-transparent text-center opacity-50"
                  />
                </div>
                <div className="flex flex-col items-center justify-center text-base font-light text-white">
                  <p className="w-[100%] text-start">Pacientes totales</p>
                  <p className="w-[100%] font-bold text-gradient text-lg flex items-start">
                    {data.patientsIncluded?.length}
                  </p>
                </div>
              </div>
              <div className="w-[70%] h-[95px] grid grid-cols-[50%,50%] mx-auto border-[1px] border-gray-600 rounded-lg">
              <div className="w-[90%] h-[90%] flex items-center justify-center">
                  <Image
                    src={appointments}
                    alt="appointments-icon"
                    width={10}
                    height={10}
                    className="w-[50%] h-[50%] flex p-2 rounded-full bg-gradient-to-b from-black to-[#807f7f] text-transparent text-center opacity-50"
                  />
                </div>
                <div className="flex flex-col items-center justify-center text-base font-light text-white">
                  <p className="w-[100%] text-start">Citas totales</p>
                  <p className="w-[100%] font-bold text-gradient text-lg flex items-start">
                    {data.appointmentsIncluded?.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/*down section*/}
          <div className="flex flex-col gap-2 mt-2">
            {/* patient section */}
            <div className="w-[99%] rounded-md flex flex-col bg-card-bg-100">
              <div className="mx-auto mb-5 w-[99%] border-b-[1px]">
                <p className="px-3 py-2 text-gradient font-semibold text-[18px]">
                  Pacientes
                </p>
              </div>
              {/* patients table */}
              <div className="w-[100%] flex-1 flex flex-col items-center justify-center">
                {/*header*/}
                <div className="w-[99%] px-3 flex items-center justify-center border-b-[1px] mb-3 border-b-gray-500">
                  <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start">
                    Nombre Completo
                  </p>
                  <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start">
                    Teléfono
                  </p>
                  <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start">
                    Mail
                  </p>
                  <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start">
                    Dirección
                  </p>
                </div>
                <div className="w-full px-1 gap-2">
                  {patientsIncluded.map(({ patient }: PatientsIncluded) => (
                    <Link
                      key={patient.id}
                      href={`/professional/patients/${patient.id}/info`}
                      className="w-[98%] mx-auto px-2 flex flex-wrap justify-start items-center border-b-[1px] border-gray-500 mb-1"
                    >
                      <div
                        key={patient.identityNumber}
                        className="w-[25%] px-1 py-2"
                      >
                        <div className="flex gap-1 items-center justify-start">
                          <Image
                            src={patient.patientPhotoUrl}
                            alt="patient-profile-photo"
                            width={40}
                            height={40}
                            className="rounded-full bg-gradient-to-b from-black to-[#001E80]"
                          />
                          <p className="text-white text-[14px] font-light">
                            {`${patient.firstName} ${patient.lastName}`}
                          </p>
                        </div>
                      </div>
                      <div className="w-[25%] px-1 py-2" key={patient.phone}>
                        <div className="text-white text-[14px] font-light flex gap-1">
                          <Icon
                            src={PhoneIcon}
                            alt="phone-Icon"
                            width={20}
                            height={20}
                          />
                          {patient.phone}
                        </div>
                      </div>
                      <div className="w-[25%] px-1 py-2" key={patient.email}>
                        <div className="text-white text-[14px] font-light flex gap-1">
                          <Icon
                            src={MailIcon}
                            alt="Mail-Icon"
                            width={20}
                            height={20}
                          />
                          {patient.email}
                        </div>
                      </div>
                      <div className="w-[25%] px-1 py-2" key={patient.address}>
                        <div className="text-white text-[14px] font-light">
                          {patient.address}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* institutions section */}
            <div className="w-[99%] bg-card-bg-100 rounded-md ">
              <p className="px-3 py-2 text-gradient font-semibold text-[18px]">
                Instituciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalDashboard;
