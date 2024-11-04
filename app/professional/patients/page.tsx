import Icon from "@/components/ui/icon";
import userImage from "../../../public/assets/icons/users.svg";
import plusImage from "../../../public/assets/icons/plus.svg";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
 // Assuming the interface is located in a file named IPatientsResponse.ts in the interfaces folder
import Image from "next/image";
import MailIcon from "../../../public/assets/icons/email.svg";
import PhoneIcon from "../../../public/assets/icons/phone.svg";
import { apiServer } from "@/api/api-server";
import { cookies } from "next/headers";
import { Patient, PatientsIncluded, ProfessionalInformation } from "@/interfaces";

const PatientsPage = async () => {
 
  const cookieStore = cookies()
  const professionalId = cookieStore.get("professional-id")?.value

  let { data }: { data: ProfessionalInformation } = await apiServer.get(`/professional/get-professional/${professionalId}`);
  // @ts-ignore
  const { patientsIncluded }: { patientsIncluded: PatientsIncluded[] } = data;

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
      {/* Title */}
      <div className="flex w-[90%] h-10 items-start justify-start px-2">
        <h1 className="text-18-bold text-start">Pacientes</h1>
      </div>
      {/* top section */}
      <div className="w-[90%] flex items-center justify-start">
        {/* leftside */}
        <div className="flex items-center justify-start gap-2">
          <Image src={userImage} alt="user-icon-image" height={25} width={25} />
          <div className="flex items-center justify-start gap-1">
            <h1 className="text-18-bold text-dark-500">{patientsIncluded.length}</h1>
            <p className="text-18-bold">
              {patientsIncluded.length < 2 ? `paciente` : `pacientes`}
            </p>
          </div>
        </div>
      </div>

      {/* patients table */}
      <div className="w-[100%] flex flex-col items-center">
                                {
                                    data && data.patientsIncluded?.length! < 1 ? (
                                        <div className="w-[90%] flex items-center justify-center gap-10">
                                            <p>Aún no posee pacientes activos</p>
                                            <Link href="/professional/patient-registration"
                                            className="flex items-center justify-center gap-2.5 p-2 border-[1px] border-gray-600 rounded-full hover:bg-gradient-to-b from-black to-[#807f7f] text-white text-center hover:opacity-50"
                                            >
                                                <p className="text-[16px] font-bold text-gradient">agregar</p>
                                                <Image src={plusImage} alt="plus-icon"
                                                       width={20}
                                                       height={20}
                                                       className="bg-[#807f7f] rounded-full bg-opacity-90"
                                                />
                                            </Link>
                                        </div>
                                    ) : (
                                        <>
                                            {/*header*/}
                                            <div
                                                className="w-[99%] px-3 flex items-center justify-between border-b-[1px] mb-3 border-b-gray-500">
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
                                                {patientsIncluded.map(({patient}: PatientsIncluded) => (
                                                    <Link
                                                        key={patient.id}
                                                        href={`/professional/patients/${patient.id}/info`}
                                                        className="w-[98%] mx-auto px-2 flex justify-between border-b-[1px] border-gray-500 mb-1 hover:scale-[102%] hover:bg-card-hover-100 hover:rounded-lg"
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
                                                                <p className="text-gray-500 text-[14px] font-semibold">
                                                                    {`${patient.firstName} ${patient.lastName}`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="w-[25%] px-1 py-2" key={patient.phone}>
                                                            <div
                                                                className="text-gray-600 text-[14px] font-normal flex gap-1">
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
                                                            <div
                                                                className="text-gray-600 text-[14px] font-normal flex gap-1">
                                                                <Icon
                                                                    src={MailIcon}
                                                                    alt="Mail-Icon"
                                                                    width={20}
                                                                    height={20}
                                                                />
                                                                {patient.email}
                                                            </div>
                                                        </div>
                                                        <div className="max-[650px]:hidden w-[25%] px-1 py-2"
                                                             key={patient.address}>
                                                            <div className="text-gray-600 text-[14px] font-normal">
                                                                {patient.address}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    )
                                }
                            </div>
    </section>
  );
};

export default PatientsPage;
