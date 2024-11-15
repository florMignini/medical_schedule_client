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
          <div className="w-[90%] mx-auto max-[780px]:flex max-[780px]:flex-col max-[780px]:gap-3 grid grid-cols-[65%,35%]">
            <div className="">
              <WelcomeSection professional={data} />
            </div>
            {/* total patient and appointments */}
            <div className="max-[780px]:w-[95%] max-[780px]:mx-auto max-[780px]:flex-row flex flex-col items-start justify-start gap-2 my-auto">
              <div className="max-[780px]:w-[50%] w-[90%] h-[95px] grid xl:grid-cols-[30%,70%] grid-cols-[40%,60%] mx-auto shadow-[inset_0_-2px_10px_rgba(231,232,231,0.6)] rounded-lg bg-white text-black">
                <div className="w-[90%] h-[90%] flex items-center justify-center">
                  <Image
                    src={user}
                    alt="user-icon"
                    width={10}
                    height={10}
                    className="w-[50%] h-[50%] flex p-2 rounded-full bg-gradient-to-b from-black to-[#807f7f] text-transparent text-center opacity-50"
                  />
                </div>
                <div className="flex flex-col items-center justify-center text-base font-light ">
                  <p className="w-[100%] text-start font-semibold">Pacientes totales</p>
                  <p className="w-[100%] font-bold text-gradient text-lg flex items-start">
                    {data.patientsIncluded?.length}
                  </p>
                </div>
              </div>
              <div className="max-[780px]:w-[50%] w-[90%] h-[95px] grid xl:grid-cols-[30%,70%] grid-cols-[40%,60%] mx-auto shadow-[inset_0_-2px_10px_rgba(231,232,231,0.6)] rounded-lg bg-white text-black">
                <div className="w-[90%] h-[90%] flex items-center justify-center">
                  <Image
                    src={appointments}
                    alt="appointments-icon"
                    width={10}
                    height={10}
                    className="w-[50%] h-[50%] flex p-2 rounded-full bg-gradient-to-b from-black to-[#807f7f] text-transparent text-center opacity-50"
                  />
                </div>
                <div className="flex flex-col items-center justify-center text-base font-light">
                  <p className="w-[100%] text-start font-semibold">Citas totales</p>
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
            <div className="w-[99%] py-4 px-3 shadow-[inset_0_-2px_4px_rgba(231,232,231,0.6)] rounded-md flex flex-col bg-white">
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
                    <Link
                      href="/professional/patient-registration"
                      className="flex items-center justify-center gap-2.5 p-2 border-[1px] border-gray-600 rounded-full hover:bg-gradient-to-b from-black to-[#807f7f] text-white text-center"
                    >
                      <p className="text-[16px] font-bold text-gradient hover:text-white">
                        agregar
                      </p>
                      <Image
                        src={plusImage}
                        alt="plus-icon"
                        width={20}
                        height={20}
                        className="bg-[#807f7f] rounded-full bg-opacity-90"
                      />
                    </Link>
                  </div>
                ) : (
                  <>
                    {/*header*/}
                    <div className="w-[99%] px-3 flex items-center justify-between border-b-[1px] mb-3 border-b-gray-500">
                      <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start">
                        Nombre Completo
                      </p>
                      <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start">
                        Teléfono
                      </p>
                      <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start">
                        Mail
                      </p>
                      <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start max-[650px]:hidden">
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
                            className="w-[90%] mx-auto px-2 flex items-center justify-between border-b-[1px] border-gray-500 mb-1 hover:scale-[102%] hover:bg-card-hover-100 hover:rounded-lg"
                          >
                            <div
                              key={patient.identificationNumber}
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
                                <p className="text-gray-500 text-[14px] font-semibold">
                                  {`${patient.firstName} ${patient.lastName}`}
                                </p>
                              </div>
                            </div>
                            <div
                              className="w-[25%] px-1 py-2"
                              key={patient.phone}
                            >
                              <div className="text-gray-600 text-[14px] font-normal flex gap-1">
                                <Icon
                                  src={PhoneIcon}
                                  alt="phone-Icon"
                                  width={20}
                                  height={20}
                                />
                                {patient.phone}
                              </div>
                            </div>
                            <div
                              className="w-[25%] px-1 py-2"
                              key={patient.email}
                            >
                              <div className="text-gray-600 text-[14px] font-normal flex gap-1">
                                <Icon
                                  src={MailIcon}
                                  alt="Mail-Icon"
                                  width={20}
                                  height={20}
                                />
                                {patient.email}
                              </div>
                            </div>
                            <div
                              className="max-[650px]:hidden w-[25%] px-1 py-2"
                              key={patient.address}
                            >
                              <div className="text-gray-600 text-[14px] font-normal">
                                {patient.address}
                              </div>
                            </div>
                          </Link>
                          <div className="w-[10%] flex items-center justify-center">
                          <ConfigButton id={patient.id} component={"patients"}     />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* institutions section */}
            <div className="w-[99%] py-4 px-3 shadow-[inset_0_-2px_4px_rgba(231,232,231,0.6)] rounded-md flex flex-col bg-white">
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
                    <Link
                      href="/professional/institution-registration"
                      className="flex items-center justify-center gap-2.5 p-2 border-[1px] border-gray-600 rounded-full hover:bg-gradient-to-b from-black to-[#807f7f] text-white text-center"
                    >
                      <p className="text-[16px] font-bold text-gradient hover:text-white">
                        agregar
                      </p>
                      <Image
                        src={plusImage}
                        alt="plus-icon"
                        width={20}
                        height={20}
                        className="bg-[#807f7f] rounded-full bg-opacity-90"
                      />
                    </Link>
                  </div>
                ) : (
                  <>
                    {/*header*/}
                    <div className="w-[99%] px-3 flex items-center justify-between border-b-[1px] mb-3 border-b-gray-500">
                      <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start">
                        institucion
                      </p>
                      <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start">
                        Teléfono
                      </p>
                      <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start">
                        Mail
                      </p>
                      <p className="w-[25%] h-10 text-sm font-medium text-gradient text-start max-[650px]:hidden">
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
                            className="w-[98%] mx-auto px-2 flex justify-between border-b-[1px] border-gray-500 mb-1 hover:scale-[102%] hover:bg-card-hover-100 hover:rounded-lg"
                          >
                            <div
                              key={institution.id}
                              className="w-[25%] px-1 py-2"
                            >
                              <div className="flex gap-1 items-center justify-start">
                                <Image
                                  src={institution.institutionImage}
                                  alt="patient-profile-photo"
                                  width={40}
                                  height={40}
                                  className="rounded-full bg-gradient-to-b from-black to-[#001E80]"
                                />
                                <p className="text-gray-500 text-[14px] font-semibold">
                                  {`${institution.name}`}
                                </p>
                              </div>
                            </div>
                            <div
                              className="w-[25%] px-1 py-2"
                              key={institution.phone}
                            >
                              <div className="text-gray-600 text-[14px] font-normal flex gap-1">
                                <Icon
                                  src={PhoneIcon}
                                  alt="phone-Icon"
                                  width={20}
                                  height={20}
                                />
                                {institution.phone}
                              </div>
                            </div>
                            <div
                              className="w-[25%] px-1 py-2"
                              key={institution.email}
                            >
                              <div className="text-gray-600 text-[14px] font-normal flex gap-1">
                                <Icon
                                  src={MailIcon}
                                  alt="Mail-Icon"
                                  width={20}
                                  height={20}
                                />
                                {institution.email}
                              </div>
                            </div>
                            <div
                              className="max-[650px]:hidden w-[25%] px-1 py-2"
                              key={institution.address}
                            >
                              <div className="text-gray-600 text-[14px] font-normal">
                                {institution.address}
                              </div>
                            </div>
                          </Link>
                          <div className="w-[10%] flex items-center justify-center">
                            <ConfigButton id={institution.id} component={"institutions"}/>
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
