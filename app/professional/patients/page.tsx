import Icon from "@/components/ui/icon";
import userImage from "../components/icons/User";
import plusImage from "../../../public/assets/icons/plus.svg";
import settingIcon from "@/public/assets/icons/settings.svg"
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Assuming the interface is located in a file named IPatientsResponse.ts in the interfaces folder
import Image from "next/image";
import MailIcon from "../../../public/assets/icons/email.svg";
import PhoneIcon from "../../../public/assets/icons/phone.svg";
import { apiServer } from "@/api/api-server";
import { cookies } from "next/headers";
import {
  Patient,
  PatientsIncluded,
  ProfessionalInformation,
} from "@/interfaces";
import ConfigButton from "../components/ConfigButton";
import AddButton from "../components/AddButton";
import Mail from "../components/icons/Mail";
import Phone from "../components/icons/Phone";
import User from "../components/icons/User";

const PatientsPage = async () => {
  const cookieStore = cookies();
  const professionalId = cookieStore.get("professional-id")?.value;

  let { data }: { data: ProfessionalInformation } = await apiServer.get(
    `/professional/get-professional/${professionalId}`
  );
  // @ts-ignore
  const { patientsIncluded }: { patientsIncluded: PatientsIncluded[] } = data;

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
      {/* Title */}
      <div className="flex w-[90%] h-10 items-start justify-start px-2">
        <h1 className="text-18-bold text-start">Pacientes</h1>
      </div>
      {/* top section */}
      <div className="w-[90%] flex items-center justify-between my-5">
        {/* leftside */}
        <div className="w-[50%] text-black flex items-center justify-start gap-2">
          <User height={25} width={25} />
          <div className="text-[14px] font-semibold md:text-18-bold flex items-center justify-start gap-1 ">
            <h1 className="">
              {patientsIncluded.length}
            </h1>
            <p className="">
              {patientsIncluded.length < 2 ? `paciente` : `pacientes`}
            </p>
          </div>
        </div>
        {/* rightside */}
        <div className="w-[50%] flex items-center justify-end">
        <AddButton
            text="paciente"
            to="/professional/patient-registration"
            />
        </div>
      </div>

      {/* patients table */}
      <div className="w-[95%] py-4 px-3 glass-effect flex flex-col">
        {data && data.patientsIncluded?.length! < 1 ? (
          <div className="w-[90%] flex font-semibold items-center justify-center gap-10">
            <p>Aún no posee pacientes activos</p>
          </div>
        ) : (
          <>
            {/*header*/}
            <div className="w-[99%] px-3 flex items-center justify-between border-b-[1px] mb-3 border-b-gray-500">
              <p className="w-[25%] max-[690px]:w-[50%] h-10 text-sm font-medium text-black text-start">
                Nombre Completo
              </p>
              <p className="sm:w-[25%] hidden md:flex max-[690px]:w-[50%] h-10 text-sm font-medium text-black text-start">
                Teléfono
              </p>
              <p className="w-[25%] h-10 text-sm font-medium text-black text-start max-[690px]:hidden">
                Mail
              </p>
              <p className="w-[25%] h-10 text-sm font-medium text-black text-start max-[690px]:hidden">
                Dirección
              </p>
            </div>
            <div className="w-full px-1 gap-2">
              {patientsIncluded.map(({ patient }: PatientsIncluded) => (
                <div className="w-[100%] flex items-center justify-center"
                key={patient.id}
                >
                  <Link
                  href={`/professional/patients/${patient.id}/info`}
                  className="w-[80%] sm:w-[98%] mx-auto px-2 flex items-center justify-between border-b-[1px] border-gray-500 mb-1 hover:scale-[102%] hover:bg-card-hover-100 hover:rounded-lg text-gray-700  hover:text-white"
                >
                  <div
                    key={patient.identityNumber}
                    className=" max-[690px]:w-[100%] px-1 py-2 flex items-center justify-start"
                  >
                    <div className="flex gap-1 items-center justify-start">
                      <Image
                        src={patient.patientPhotoUrl}
                        alt="patient-profile-photo"
                        width={40}
                        height={40}
                        className="rounded-full bg-gradient-to-b from-black to-[#001E80]"
                      />
                      <p className="text-[14px] font-semibold">
                        {`${patient.firstName} ${patient.lastName}`}
                      </p>
                    </div>
                  </div>
                  <div
                    className="hidden max-[690px]:w-[50%] px-1 py-2 sm:flex items-center justify-start"
                    key={patient.phone}
                  >
                    <div className="text-[14px] font-normal flex gap-1">
                      <Phone
                        width={20}
                        height={20}
                      />
                      <p className="truncate">{patient.phone}</p>
                    </div>
                  </div>
                  <div
                    className="max-[690px]:hidden w-[25%] px-1 py-2 flex items-center justify-start"
                    key={patient.email}
                  >
                    <div className="text-[14px] font-normal flex gap-1">
                      <Mail
                        width={20}
                        height={20}
                      />
                      <p className="truncate">{patient.email}</p>
                    </div>
                  </div>
                  <div
                    className="max-[690px]:hidden w-[25%] px-1 py-2 flex items-center justify-start"
                    key={patient.address}
                  >
                    <div className="text-[14px] font-normal">
                      {patient.address}
                    </div>
                  </div>
                </Link>
                <div className="w-[20%] sm:w-[10%] flex items-center justify-center">
                            <ConfigButton id={patient.id} component={"patients"}/>
                          </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PatientsPage;
