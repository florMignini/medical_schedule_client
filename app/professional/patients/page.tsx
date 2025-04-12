import Link from "next/link";

// Assuming the interface is located in a file named IPatientsResponse.ts in the interfaces folder
import Image from "next/image";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import PatientRegisterForm from "@/components/forms/PatientRegisterForm";

const PatientsPage = async () => {
  const cookieStore = cookies();
  const professionalId = cookieStore.get("professional-id")?.value;

  let { data }: { data: ProfessionalInformation } = await apiServer.get(
    `/professional/get-professional/${professionalId}`
  );
  // @ts-ignore
  const { patientsIncluded }: { patientsIncluded: PatientsIncluded[] } = data;

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2 text-color">
      <Dialog>
        {/* Title */}
        <div className="flex flex-col w-[95%] h-14 items-start justify-center px-2 border-b-[1px] border-b-gray-500">
          <h1 className="text-2xl text-black font-semibold text-start">
            Pacientes
          </h1>
          <p className="hidden md:flex text-xs font-light text-gray-600">
            Aquí encontrara la lista de pacientes que se hallan en su cartera
          </p>
        </div>
        {/* top section */}
        <div className="w-[90%] flex items-center justify-between my-5">
          {/* leftside */}
          <div className="w-[50%] flex items-center justify-start gap-2">
            <User height={25} width={25} />
            <div className="flex flex-col items-start justify-center">
              <p className="text-xs font-light text-gray-600">
                Actualmente posee:{" "}
              </p>
              <div className="text-[14px] font-semibold md:text-18-bold flex items-center justify-start gap-1 ">
                <h1 className="">{patientsIncluded.length}</h1>
                <p className="">
                  {patientsIncluded.length < 2 ? `paciente` : `pacientes`}
                </p>
              </div>
            </div>
          </div>
          {/* rightside */}
          <div className="w-[50%] flex items-center justify-end">
            {/* <AddButton
            text="paciente"
            to="/professional/patient-registration"
            /> */}
            <DialogTrigger asChild>
              <button className="transition duration-200 ease-in-out flex items-center justify-center gap-2.5 p-1 border-[1px] border-gray-600 rounded-md bg-gradient-to-b from-black to-[#807f7f] text-white text-center hover:bg-gradient-to-b hover:from-white hover:to-[#222222] hover:text-[#1c1c1c]">
                <p className="text-[12px] md:text-[14px] font-medium">
                  Agregar Paciente
                </p>
                <Plus width={15} height={15} />
              </button>
            </DialogTrigger>
          </div>
        </div>
        {/* add patient modal */}
        <DialogContent className="w-[90%] max-w-none lg:w-[70%] lg:max-w-[60%] h-[90%] bg-white flex flex-col items-start justify-start  bg-opacity-90 p-2 rounded-lg shadow-md gap-5">
          <ScrollArea className="h-[98%] w-[99%]">
            <PatientRegisterForm />
          </ScrollArea>
        </DialogContent>
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
                  <div
                    className="w-[100%] flex items-center justify-center"
                    key={patient.id}
                  >
                    <Link
                      href={`/professional/patients/${patient.id}/info`}
                      className="w-[85%] md:w-[98%] mx-auto px-2 flex items-center justify-between border-b-[1px] hover:transition-shadow border-[#cccccc] rounded-md border-[1px] mb-1 hover:shadow-lg hover:shadow-[#cccccc] text-gray-700"
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
                        className="hidden max-[690px]:w-[50%] px-1 py-2 sm:flex items-center justify-start truncate"
                        key={patient.phone}
                      >
                        <div className="text-[14px] font-normal flex gap-1">
                          <Phone width={20} height={20} />
                          <p className="">{patient.phone}</p>
                        </div>
                      </div>
                      <div
                        className="max-[690px]:hidden w-[25%] px-1 py-2 flex items-center justify-start"
                        key={patient.email}
                      >
                        <div className="text-[14px] font-normal flex gap-1 truncate">
                          <Mail width={20} height={20} />
                          <p className="">{patient.email}</p>
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
                      <ConfigButton id={patient.id} component={"patients"} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Dialog>
    </section>
  );
};

export default PatientsPage;
