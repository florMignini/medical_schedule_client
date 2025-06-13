import { apiServer } from "@/api/api-server";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import {
  AppointmentsIncluded,
  PatientsIncluded,
  ProfessionalInformation,
} from "@/interfaces";
import WelcomeSection from "../components/WelcomeSection";

import ConfigButton from "../components/ConfigButton";
import Phone from "../components/icons/Phone";
import Mail from "../components/icons/Mail";
import AddButton from "../components/AddButton";

import PatientsByAge from "../components/charts/PatientsByAge";
import Categorization from "../components/charts/Categorization";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import PatientRegistrationForm from "@/components/forms/PatientRegisterForm";
import PatientsTable from "../components/PatientsTable";



const ProfessionalDashboard = async () => {
  const cookieStore = cookies();
  const professionalId = cookieStore.get("professional-id")?.value;

  // categorization data
  let { data }: { data: ProfessionalInformation } = await apiServer.get(
    `/professional/get-professional/${professionalId}`
  );

  // @ts-ignore
  const { patientsIncluded }: { patientsIncluded: PatientsIncluded[] } = data;

  // categorization data
  // @ts-ignore
  const {
    appointmentsIncluded,
  }: { appointmentsIncluded: AppointmentsIncluded[] } = data;
  // @ts-ignore
  const { followsUpIncluded }: { followsUpIncluded: any[] } = data;

  // @ts-ignore
  const {
    institutionsIncluded,
  }: { institutionsIncluded: AppointmentsIncluded[] } = data;


  return (
    <section className="w-full z-40 h-auto flex-1 min-[768px]:grid min-[768px]:grid-cols-[60%,40%] lg:grid-cols-[70%,30%] p-1 overflow-y-auto glass-effect">
      <Dialog>
        {/*left section*/}
      <div className="w-full h-auto lg:flex lg:flex-col gap-2 mx-auto items-center justify-start">
        {/* charts section */}
        <div className="w-[100%] mx-auto py-4 px-3 glass-effect-vibrant flex items-center justify-center flex-col xl:grid xl:grid-cols-[60%,40%] text-color gap-1 ">
          <PatientsByAge 
          patients={patientsIncluded}     
          />
          <Categorization
          appointments={appointmentsIncluded.length}
          followsUp={followsUpIncluded.length}
          />
        </div>
        {/* patient section */}
       <PatientsTable
       component={"dashboard"}
          patients={patientsIncluded}
        />

        {/* institutions section */}
        <div className="w-full flex flex-col glass-effect-vibrant mt-2">
          <div className="mx-auto mb-5 w-[99%] border-b-[1px] border-gray-900">
            <p className="px-3 text-gray-900 py-2 font-semibold text-[18px]">
              Instituciones
            </p>
          </div>
          {/* institutions table */}
          <div className="w-[100%] flex flex-col items-center">
            {data && data.institutionsIncluded?.length! < 1 ? (
              <div className="w-[90%] py-1 flex items-center justify-center gap-10">
                <p>Aún no posee instituciones activas</p>
                <AddButton to="/professional/institution-registration" />
              </div>
            ) : (
              <>
                {/*header*/}
                <div className="w-[99%] px-3 flex items-center justify-between border-b-[1px] mb-3 border-b-gray-700 text-gray-900">
                  <p className="w-[25%] max-[690px]:w-[50%] h-10 text-sm font-medium text-start">
                    institución
                  </p>
                  <p className="w-[25%] max-[690px]:w-[50%] h-10 text-sm font-medium text-start">
                    Teléfono
                  </p>
                  <p className="w-[25%] h-10 text-sm font-medium text-start max-[690px]:hidden">
                    Mail
                  </p>
                  <p className="w-[25%] h-10 text-sm font-medium text-start max-[690px]:hidden">
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
                        href={`/professional/institutions/${institution.id}/detail`}
                        className="w-[85%] md:w-[98%] mx-auto px-2 flex items-center justify-between border-b-[1px] hover:transition-shadow border-[#cccccc] rounded-md border-[1px] mb-1 hover:shadow-lg hover:shadow-[#cccccc] text-gray-700"
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
      {/* professional profile section */}
      <div className="hidden min-[768px]:flex">
        <WelcomeSection professional={data} />
      </div>
      {/* add patient modal */}
      <DialogContent className="w-[90%] lg:w-[70%] lg:max-w-[60%] h-[90%] bg-white flex flex-col items-start justify-start  bg-opacity-90 p-2 rounded-lg shadow-md gap-5">
          <ScrollArea className="h-[98%] w-[99%]">
            <PatientRegistrationForm />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProfessionalDashboard;
