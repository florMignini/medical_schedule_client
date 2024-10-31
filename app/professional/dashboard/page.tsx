import { apiServer } from "@/api/api-server";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import EditIcon from "../../../public/assets/icons/pencil.svg";
import MailIcon from "../../../public/assets/icons/email.svg";
import PhoneIcon from "../../../public/assets/icons/phone.svg";
import User from "../../../public/assets/profile-doctor.jpg";

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
  const { appointmentsIncluded }: { appointmentsIncluded: AppointmentsIncluded[] } = data;

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2">
      <div className="w-[99%] flex h-auto flex-col lg:grid lg:grid-cols-[70%,30%] xl:grid-cols-[70%,30%] gap-1">
        {/* information side */}
        <div className="flex flex-col gap-4">
          {/* Welcome section */}
          <WelcomeSection />
          {/* patient section */}
          <div className="w-[99%] border border-dark-400 rounded-md flex flex-col bg-transparent">
            <p className="p-3 font-bold">Pacientes</p>
            {/* patients table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Dirección</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientsIncluded.map(({ patient }: PatientsIncluded) => (
                  <TableRow key={patient.id}>
                    <TableCell key={patient.identityNumber}>
                      <Link
                        href={`/professional/patients/${patient.id}/info`}
                        className="flex gap-1 items-center justify-start"
                      >
                        <Image
                          src={patient.patientPhotoUrl}
                          alt="patient-profile-photo"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <p className="text-white text-14-medium">
                          {`${patient.firstName} ${patient.lastName}`}
                        </p>
                      </Link>
                    </TableCell>
                    <TableCell key={patient.phone}>
                      <Link
                        href={`/professional/patients/${patient.id}/info`}
                        className="text-white text-14-medium flex gap-1"
                      >
                        <Icon
                          src={PhoneIcon}
                          alt="phone-Icon"
                          width={20}
                          height={20}
                        />
                        {patient.phone}
                      </Link>
                    </TableCell>
                    <TableCell key={patient.email}>
                      <Link
                        href={`/professional/patients/${patient.id}/info`}
                        className="text-white text-14-medium flex gap-1"
                      >
                        <Icon
                          src={MailIcon}
                          alt="Mail-Icon"
                          width={20}
                          height={20}
                        />
                        {patient.email}
                      </Link>
                    </TableCell>
                    <TableCell key={patient.address}>
                      <Link
                        href={`/professional/patients/${patient.id}/info`}
                        className="text-white text-14-medium"
                      >
                        {patient.address}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* institutions section */}
          <div className="w-[99%] border bg-transparent border-dark-400 rounded-md ">
            <p className="p-3 font-bold">Instituciones</p>
          </div>
        </div>
        {/* profile & calendar side */}
        <div className="w-[99%] hidden lg:flex lg:flex-col gap-3 px-2 py-1 bg-dark-400 rounded-md">
          {/* head */}
          <div className="w-[99%] h-10 flex items-center justify-between rounded-lg bg-dark-300 px-2">
            <h1 className="text-18-bold text-left">Mi Perfil</h1>
            <button className="text-16-bold hover:text-light-500 hover:scale-110 hover:font-extrabold">
              <Icon src={EditIcon} alt="edit-icon" width={24} height={24} />
            </button>
          </div>
          <div className="w-[99%] grid grid-cols-[40%,60%] gap-3">
            <div className="w-full h-auto">
              <Image src={User} alt="professional-image" className="" />
            </div>
            <div className="w-[95%] flex flex-col h-12 gap-1">
              <h1 className="text-16-semibold">Dr. Leandro Nahuel Mignini</h1>
              <p className="font-light text-12-regular">Clinica Medica</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalDashboard;
