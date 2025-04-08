"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "../public/assets/medical_schedule-logo.svg";
import { ProfessionalSidebarData } from "@/app/professional/data";

import { toggleSideI } from "@/interfaces";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import { closeSessionServer } from "@/app/actions";
import ArrowRight from "@/app/professional/components/icons/ArrowRight";
import Logout from "@/app/professional/components/icons/Logout";
import CloseIcon from "@/app/professional/components/icons/CloseIcon";

const ProfessionalSidebar = ({
  isOpen,
  toggleSidebar,
  setIsOpen,
}: toggleSideI) => {
  const closeSession = async (): Promise<void> => {
    const res = await closeSessionServer();
    if (res) {
      localStorage.removeItem("infoProfSession");
    }
  };

  const pathname = usePathname();
  return (
    <div className="relative">
      <aside
      className={` ${
        isOpen
          ? "inset-y-0 top-0 w-64 rounded-r-xl md:w-[35%] bg-[#121133] z-50 transform transition-transform duration-1000 ease-in-out translate-x-0"
          : "hidden lg:block w-[20%] mx-auto"
      } h-screen mb-2  items-center fixed justify-start flex-col`}
    >
      {isOpen && (
        // logo
        <div className="w-full pt-2 px-5 flex items-center justify-between">
          <Link
            href="/professional/dashboard"
            className="p-2 flex flex-col items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <Image
              src={Logo}
              alt="medical-schedule-logo"
              height={170}
              width={170}
            />
          </Link>
          <button
            className="flex items-start justify-start"
            onClick={() => setIsOpen(false)}
          >
            <CloseIcon width={25} height={25} color="#ffffff" />
          </button>
        </div>
      )}
      <Link
        href="/professional/dashboard"
        className="w-[90%] pl-[10%] pt-5 hidden lg:block items-center justify-center "
        onClick={() => setIsOpen(false)}
      >
        <Image
          src={Logo}
          alt="medical_schedule-logo-icon"
          height={180}
          width={180}
        />
      </Link>
      {/* links */}
      <div
        className={`w-full pt-[20%] flex flex-col items-center justify-center mx-auto ${
          isOpen ? "py-16" : ""
        }`}
      >
        {ProfessionalSidebarData.map((item, index) => (
          <Link
            href={item.path}
            key={index}
            className={cn(
              `w-[90%] flex justify-center items-center text-color h-10 my-2 mx-auto ${
                isOpen
                  ? "justify-center hover:text-white rounded-xl"
                  : "rounded-xl pl-0 text-gray-400 hover:text-white"
              } ${
                pathname === item.path
                  ? "text-white bg-[#5D58FD]"  
                  : ""
              }`
            )}
            onClick={() => setIsOpen(false)}
          >
            <item.component
            width={25}
            height={25}
            color={`${pathname === item.path ? "#ffffff" : "#6b7280"}`}
            className=""
            />
            <span className="w-[80%] text-center text-base md:text-lg font-normal">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
      <div
        className={`w-[90%] ${
          isOpen
            ? "pt-[200px] xl:pt-[400px] text-[#929292]"
            : "pt-[270px] 2xl:pt-[450px] text-gray-400"
        }`}
      >
        <button
          className="text-base mx-auto flex items-center justify-center gap-2"
          onClick={closeSession}
        >
          <Logout width={25} height={25} color="#d1d1d3"/>
          <p className="font-normal text-gray-300 hover:text-white">Cerrar Sesión</p>
        </button>
      </div>
    </aside>
    </div>
  );
};

export default ProfessionalSidebar;
