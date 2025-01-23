import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Icon from "@/components/ui/icon";

import { apiServer } from "@/api/api-server";
import { ProfessionalInformation } from "@/interfaces";
import Phone from "@/app/professional/components/icons/Phone";
import Mail from "@/app/professional/components/icons/Mail";
import User from "@/app/professional/components/icons/User";
import AddButton from "@/app/professional/components/AddButton";
import ConfigButton from "@/app/professional/components/ConfigButton";
import IsActiveLink from "@/app/professional/components/icons/IsActiveLink";

const page = async () => {
  let { data } = await apiServer.get(`/professional/get-all-professionals`);
  return (
    <section className="w-full h-screen flex flex-col items-center justify-start gap-2 text-color">
      {/* Title */}
      <div className="flex w-[90%] h-10 items-end justify-start px-2">
        <h1 className="text-18-bold text-start">Professionals</h1>
      </div>
      {/* top section */}
      <div className="w-[90%] flex items-center justify-between my-5">
        {/* leftside */}
        <div className="w-[50%] flex items-center justify-start gap-2">
          <User height={25} width={25} />
          <div className="text-[14px] font-semibold md:text-18-bold flex items-center justify-start gap-1 ">
            <h1 className="">{data.length}</h1>
            <p className="">
              {data.length < 2 ? `professional` : `professionals`}
            </p>
          </div>
        </div>
        {/* rightside */}
        <div className="w-[50%] flex items-center justify-end">
          <AddButton
            text="Professional"
            to="/admin/professional-registration"
          />
        </div>
      </div>
      {/* professionals table */}
      <div className="w-[95%] py-4 px-3 glass-effect flex flex-col">
        {data && data.length < 1 ? (
          <div className="w-[90%] flex font-semibold items-center justify-center gap-10">
            <p>Aún no posee pacientes activos</p>
          </div>
        ) : (
          <>
            {/*header*/}
            <div className="w-[99%] h-10 px-3 flex items-center justify-between border-b-[1px] mb-3 border-b-gray-500">
              <p className="w-[30%] max-[690px]:w-[50%] text-sm font-medium text-black text-start">
                Nombre Completo
              </p>
              <p className="sm:w-[30%] hidden md:flex max-[690px]:w-[50%] text-sm font-medium text-black text-start">
                Teléfono
              </p>
              <p className="w-[30%] text-sm font-medium text-black text-start max-[690px]:hidden">
                Mail
              </p>
              <p className="w-[15%] text-sm font-medium text-black text-start max-[690px]:hidden">
                Is Active?
              </p>
            </div>
            <div className="w-full px-1 gap-2">
              {data.map((professional: ProfessionalInformation) => (
                <div
                  className="w-[100%] flex items-center justify-center"
                  key={professional.id}
                >
                  <Link
                    href={`#`}
                    className="w-[85%] h-10 md:w-[98%] mx-auto px-2 flex items-center justify-between border-b-[1px] hover:transition-shadow border-[#cccccc] rounded-md border-[1px] mb-1 hover:shadow-lg hover:shadow-[#cccccc] text-gray-700"
                  >
                    <div className=" max-[690px]:w-[100%] w-[30%] px-1 py-2 flex items-center justify-start gap-2">
                      <Image
                        src={professional.userImage !== null ? professional.userImage :
                        professional.gender === "M" ? `https://avatar.iran.liara.run/public/job/doctor/male` : `https://avatar.iran.liara.run/public/job/doctor/female`
                        }
                        alt="patient-profile-photo"
                        width={20}
                        height={20}
                        className="rounded-full size-7"
                      />
                      <p className="text-[14px] font-semibold truncate">
                        {`${professional.firstName} ${professional.lastName}`}
                      </p>
                    </div>
                    <div className="hidden max-[690px]:w-[50%] w-[30%] px-1 py-2 sm:flex items-center justify-start">
                      <div className="text-[14px] font-normal flex gap-1">
                        <Phone width={20} height={20} />
                        <p className="truncate">{professional.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="max-[690px]:hidden w-[30%] px-1 py-2 flex items-center justify-start">
                      <div className="text-[14px] font-normal flex gap-1">
                        <Mail width={20} height={20} />
                        <p className="truncate">{professional.email}</p>
                      </div>
                    </div>
                    <div className="max-[690px]:hidden w-[10%] px-1 py-2 flex items-center justify-center">
                      <div className="text-[14px] font-normal">
                        {professional.isActive ? (
                          <IsActiveLink
                            width={20}
                            height={20}
                            className="text-emerald-700"
                          />
                        ) : (
                          <IsActiveLink
                            width={20}
                            height={20}
                            className="text-red-800"
                          />
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="w-[20%] sm:w-[10%] flex items-center justify-center">
                    <ConfigButton
                      id={professional.id}
                      component={"professional"}
                    />
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

export default page;
