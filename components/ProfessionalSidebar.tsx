"use client";
import Icon from "../components/ui/icon";
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/assets/medical_schedule-transparent.png";
import { ProfessionalSidebarData } from "@/data";

import logOutIcon from "../public/assets/icons/logout.svg";
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
          ? "inset-y-0 top-0 w-64 rounded-r-xl md:w-[35%] bg-[#F2F3F0] z-50 transform transition-transform duration-300 ease-in-out"
          : "hidden lg:block w-[20%] mx-auto"
      } h-screen mb-2  items-center fixed justify-start flex-col`}
    >
      {isOpen && (
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
            <CloseIcon width={25} height={25} color="#000000" />
          </button>
        </div>
      )}
      <Link
        href="/professional/dashboard"
        className="w-[90%] pl-[10%] pt-5 hidden lg:block items-center justify-center"
        onClick={() => setIsOpen(false)}
      >
        <Image
          src={Logo}
          alt="medical_schedule-logo-icon"
          height={180}
          width={180}
        />
      </Link>
      <div
        className={`w-full pt-[20%] flex flex-col items-center justify-between mx-auto gap-2 ${
          isOpen ? "py-16" : ""
        }`}
      >
        {ProfessionalSidebarData.map((item, index) => (
          <Link
            href={item.path}
            key={index}
            className={cn(
              `w-[80%] flex gap-1 justify-start items-center text-color h-10 my-2 px-2 mx-auto ${
                isOpen
                  ? "justify-center  hover:font-extrabold text-[#929292]"
                  : "pl-1 rounded-xl text-black/40"
              } ${
                pathname === item.path
                  ? "w-[95%] text-black"  
                  : ""
              }`
            )}
            onClick={() => setIsOpen(false)}
          >
            <Image
              src={item.icon.src}
              alt={item.icon.alt}
              width={32}
              height={32}
              className="pl-2"
            />
            <span className="w-[80%] text-center text-xl font-light">
              {item.label}
            </span>
            {pathname === item.path && (
              <ArrowRight
              width={20}
              height={20}
              color="#000000"
              />
            )}
          </Link>
        ))}
      </div>
      <div
        className={`w-[90%] ${
          isOpen
            ? "pt-[200px] xl:pt-[400px] text-[#929292]"
            : "pt-[300px] 2xl:pt-[450px] text-black/40"
        }`}
      >
        <button
          className="h-10 text-base mx-auto flex items-center justify-center gap-2"
          onClick={closeSession}
        >
          <Logout width={25} height={25} color="#000000"/>
          <p className="font-semibold">Cerrar Sesión</p>
        </button>
      </div>
    </aside>
    </div>
  );
};

export default ProfessionalSidebar;
