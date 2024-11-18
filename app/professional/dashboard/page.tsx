import { apiServer } from "@/api/api-server";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import user from "../../../public/assets/icons/users.svg";
import appointments from "../../../public/assets/icons/appointments.svg";
import MailIcon from "../../../public/assets/icons/email.svg";
import PhoneIcon from "../../../public/assets/icons/phone.svg";
import plusImage from "../../../public/assets/icons/plus.svg";
import settingIcon from "@/public/assets/icons/settings.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  AppointmentsIncluded,
  Patient,
  PatientsIncluded,
  ProfessionalInformation,
  ProfessionalPatient,
} from "@/interfaces";
import WelcomeSection from "../components/WelcomeSection";

import ConfigButton from "../components/ConfigButton";
import Phone from "../components/icons/Phone";
import Mail from "../components/icons/Mail";
import AddButton from "../components/AddButton";
import User from "../components/icons/User";
import CheckedCalendar from "../components/icons/CheckedCalendar";

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
  // @ts-ignore
  const {
    institutionsIncluded,
  }: { institutionsIncluded: AppointmentsIncluded[] } = data;

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
      <div className="w-[99%] flex h-auto flex-col gap-1">
        {/* information side */}
        <div className="flex flex-col gap-2 my-auto">
          {/*upper section*/}
          <div className="w-[90%] mx-auto max-[760px]:flex max-[760px]:flex-col max-[760px]:gap-3 grid grid-cols-[65%,35%]">
            <div className="">
              <WelcomeSection professional={data} />
            </div>
            {/* min-[760px]:total patient and appointments */}
            <div className="hidden max-[760px]:w-[95%] max-[760px]:mx-auto  min-[760px]:flex min-[760px]:flex-col items-start justify-start gap-2 my-auto">
              <div className="max-[760px]:w-[50%] w-[90%] h-[95px] grid xl:grid-cols-[30%,70%] grid-cols-[40%,60%] mx-auto shadow-[inset_0px_-2px_3px_rgba(73,73,73,0.2)] rounded-lg bg-white text-black">
                <div className="flex items-center justify-center w-[95%] h-[95%]">
                  <User 
                  width={50}
                  height={50}
                  className="flex items-center justify-center p-2 rounded-full text-gray-400" />
                </div>

                <div className="flex flex-col items-start justify-center text-base font-light ">
                  <p className="w-[100%] text-start font-semibold text-[14px]">
                    Pacientes totales
                  </p>
                  <p className="w-[100%] font-bold text-gradient text-lg flex items-start">
                    {data.patientsIncluded?.length}
                  </p>
                </div>
              </div>
              <div className="max-[760px]:w-[50%] w-[90%] h-[95px] grid xl:grid-cols-[30%,70%] grid-cols-[40%,60%] mx-auto shadow-[inset_0px_-2px_3px_rgba(73,73,73,0.2)] rounded-lg bg-white text-black">
                <div className="flex items-center justify-center w-[95%] h-[95%]">
                  <CheckedCalendar
                    width={50}
                    height={50}
                    className="flex items-center justify-center p-2 rounded-full text-gray-400"
                  />
                </div>
                <div className="flex flex-col items-center justify-center text-base font-light">
                  <p className="w-[100%] text-[14px] text-start font-semibold">
                    Citas totales
                  </p>
                  <p className="w-[100%] font-bold text-gradient text-lg flex items-start">
                    {data.appointmentsIncluded?.length}
                  </p>
                </div>
              </div>
            </div>
            {/* total patient and appointments */}
            <div className="w-[90%] text-gray-400 flex min-[760px]:hidden items-center justify-between mx-auto">
              <div className="flex flex-col items-center justify-start">
                <p className="w-[100%] text-start font-semibold">
                  Pacientes totales
                </p>
                <p className="w-[100%] font-bold text-gradient text-lg flex items-start">
                  {data.patientsIncluded?.length}
                </p>
              </div>
              <div className="h-10 border-x-[1px] border-gray-400" />
              <div className="flex flex-col items-center justify-start">
                <p className="w-[100%] text-start font-semibold">
                  Citas totales
                </p>
                <p className="w-[100%] font-bold text-gradient text-lg flex items-start">
                  {data.appointmentsIncluded?.length}
                </p>
              </div>
            </div>
          </div>

          {/*down section*/}
          <div className="flex flex-col gap-2 mt-2">
            {/* patient section */}
            <div className="w-[99%] py-4 px-3 shadow-[inset_0px_-2px_3px_rgba(73,73,73,0.2)] rounded-md flex flex-col bg-white">
              <div className="mx-auto mb-5 w-[99%] border-b-[1px]">
                <p className="px-3 py-2 text-black font-semibold text-[18px]">
                  Pacientes
                </p>
              </div>
              {/* patients table */}
              <div className="w-[100%] flex flex-col items-center">
                {data && data.patientsIncluded?.length! < 1 ? (
                  <div className="w-[90%] flex items-center justify-center gap-10">
                    <p>Aún no posee pacientes activos</p>
                    <AddButton to="/professional/patient-registration" />
                  </div>
                ) : (
                  <>
                    {/*header*/}
                    <div className="w-[99%] px-3 flex items-center justify-between border-b-[1px] mb-3 border-b-gray-500">
                      <p className="w-[25%] max-[690px]:w-[50%] h-10 text-sm font-medium text-gradient text-start">
                        Nombre Completo
                      </p>
                      <p className="w-[25%] max-[690px]:w-[50%] h-10 text-sm font-medium text-gradient text-start">
                        Teléfono
                      </p>
                      <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start max-[690px]:hidden">
                        Mail
                      </p>
                      <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start max-[690px]:hidden">
                        Dirección
                      </p>
                    </div>
                    <div className="w-full px-1 gap-2">
                      {patientsIncluded.map(({ patient }: PatientsIncluded) => (
                        <div
                          className="w-[100%] flex items-center justify-center"
                          key={patient.id}
                        >
                          <Link
                            href={`/professional/patients/${patient.id}/info`}
                            className="w-[85%] md:w-[98%] mx-auto px-2 flex items-center justify-between border-b-[1px] border-gray-500 mb-1 hover:scale-[102%] hover:bg-card-hover-100 hover:rounded-lg text-gray-600  hover:text-white"
                          >
                            <div
                              key={patient.identityNumber}
                              className="w-[25%] max-[690px]:w-[50%] px-1 py-2"
                            >
                              <div className="flex gap-1 items-center justify-start">
                                <Image
                                  src={patient.patientPhotoUrl}
                                  alt="patient-profile-photo"
                                  width={40}
                                  height={40}
                                  className="rounded-full bg-gradient-to-b from-black to-[#001E80]"
                                />
                                <p className="text-[14px] font-semibold truncate">
                                  {`${patient.firstName} ${patient.lastName}`}
                                </p>
                              </div>
                            </div>
                            <div
                              className="w-[25%] max-[690px]:w-[50%] px-1 py-2"
                              key={patient.phone}
                            >
                              <div className="text-[14px] font-normal flex gap-1">
                                <Phone width={20} height={20} />
                                <p className="truncate">{patient.phone}</p>
                              </div>
                            </div>
                            <div
                              className="max-[690px]:hidden w-[25%] px-1 py-2"
                              key={patient.email}
                            >
                              <div className="text-[14px] font-normal flex gap-1">
                                <Mail width={20} height={20} />
                                <p className="truncate">{patient.email}</p>
                              </div>
                            </div>
                            <div
                              className="max-[690px]:hidden w-[25%] px-1 py-2"
                              key={patient.address}
                            >
                              <div className="text-[14px] font-normal">
                                {patient.address}
                              </div>
                            </div>
                          </Link>
                          <div className="w-[15%] md:w-[10%] flex items-center justify-center">
                            <ConfigButton
                              id={patient.id}
                              component={"patients"}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* institutions section */}
            <div className="w-[99%] py-4 px-3 shadow-[inset_0px_-2px_3px_rgba(73,73,73,0.2)] rounded-md flex flex-col bg-white">
              <div className="mx-auto mb-5 w-[99%] border-b-[1px]">
                <p className="px-3 py-2 text-black font-semibold text-[18px]">
                  Instituciones
                </p>
              </div>
              {/* institutions table */}
              <div className="w-[100%] flex flex-col items-center">
                {data && data.institutionsIncluded?.length! < 1 ? (
                  <div className="w-[90%] flex items-center justify-center gap-10">
                    <p>Aún no posee instituciones activas</p>
                    <AddButton to="/professional/institution-registration" />
                  </div>
                ) : (
                  <>
                    {/*header*/}
                    <div className="w-[99%] px-3 flex items-center justify-between border-b-[1px] mb-3 border-b-gray-500">
                      <p className="w-[25%] max-[690px]:w-[50%] h-10 text-sm font-medium text-gradient text-start">
                        institucion
                      </p>
                      <p className="w-[25%] max-[690px]:w-[50%] h-10 text-sm font-medium text-gradient text-start">
                        Teléfono
                      </p>
                      <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start max-[690px]:hidden">
                        Mail
                      </p>
                      <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start max-[690px]:hidden">
                        Dirección
                      </p>
                    </div>
                    <div className="w-full px-1 gap-2">
                      {institutionsIncluded.map(({ institution }: any) => (
                        <div
                          className="w-[100%] flex items-center justify-center"
                          key={institution.id}
                        >
                          <Link
                            href={`/professional/patients/${institution.id}/info`}
                            className="w-[85%] md:w-[98%] mx-auto px-2 flex justify-between border-b-[1px] border-gray-500 mb-1 hover:scale-[102%] hover:bg-card-hover-100 hover:rounded-lg text-gray-600  hover:text-white"
                          >
                            <div
                              key={institution.id}
                              className="w-[25%] max-[690px]:w-[50%] px-1 py-2"
                            >
                              <div className="flex gap-1 items-center justify-start">
                                <Image
                                  src={institution.institutionImage}
                                  alt="patient-profile-photo"
                                  width={40}
                                  height={40}
                                  className="rounded-full bg-gradient-to-b from-black to-[#001E80]"
                                />
                                <p className="text-[14px] font-semibold truncate">
                                  {`${institution.name}`}
                                </p>
                              </div>
                            </div>
                            <div
                              className="w-[25%] max-[690px]:w-[50%] px-1 py-2"
                              key={institution.phone}
                            >
                              <div className="text-[14px] font-normal flex gap-1">
                                <Phone width={20} height={20} />
                                <p className="truncate">{institution.phone}</p>
                              </div>
                            </div>
                            <div
                              className="w-[25%] max-[690px]:hidden px-1 py-2"
                              key={institution.email}
                            >
                              <div className="text-[14px] font-normal flex  gap-1">
                                <Mail width={20} height={20} />
                                <p className="truncate">{institution.email}</p>
                              </div>
                            </div>
                            <div
                              className="max-[690px]:hidden w-[25%] px-1 py-2"
                              key={institution.address}
                            >
                              <div className="text-[14px] font-normal">
                                {institution.address}
                              </div>
                            </div>
                          </Link>
                          <div className="w-[15%] md:w-[10%] flex items-center justify-center">
                            <ConfigButton
                              id={institution.id}
                              component={"institutions"}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalDashboard;
