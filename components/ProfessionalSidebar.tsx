"use client";
import Icon from "../components/ui/icon";
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/assets/medical_schedule-logo.svg";
import { ProfessionalSidebarData } from "@/data";
import CloseIcon from "../public/assets/icons/close.svg";
import logOutIcon from "../public/assets/icons/logout.svg";
import arrowRight from "../public/assets/icons/arrowRight.svg";
import onlyLogo from "../public/assets/medical_schedule-transparent.png";
import { toggleSideI } from "@/interfaces";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import { closeSessionServer } from "@/app/actions";

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
    <aside
      className={` ${
        isOpen
          ? "fixed inset-y-0 top-0 left-0 w-64 md:w-[30%] bg-[#47505D] z-50 transform -translate-x-0 "
          : "hidden lg:flex lg:translate-x-0 items-center justify-start flex-col -translate-x-full"
      } transition-transform mb-2 duration-500 ease-in-out  h-screen  `}
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
            <Icon src={CloseIcon} alt="close-icon" width={20} height={20} />
          </button>
        </div>
      )}
      <Link
        href="/professional/dashboard"
        className="w-[90%] pt-5 pl-3 hidden lg:flex items-center justify-start"
        onClick={() => setIsOpen(false)}
      >
        <Image
          src={Logo}
          alt="medical-schedule-logo-icon"
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
              `w-[80%] flex gap-1 justify-start items-center text-color h-8 my-2 px-2 ${
                isOpen
                  ? "justify-center  hover:font-extrabold text-[#929292]"
                  : "pl-1  rounded-xl text-[#839cc7]"
              } ${
                pathname === item.path
                  ? "w-[95%] glass-effect text-black/80"
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
              <Image src={arrowRight} alt={arrowRight} width={18} height={18} />
            )}
          </Link>
        ))}
      </div>
      <div
        className={`w-[90%] ${
          isOpen
            ? "pt-[200px] xl:pt-[400px] text-[#929292]"
            : "pt-[300px] 2xl:pt-[450px] text-[#839cc7]"
        }`}
      >
        <button
          className="h-10 text-base mx-auto flex items-center justify-center gap-2"
          onClick={closeSession}
        >
          <Icon src={logOutIcon} alt="log-out-icon" width={20} height={20} />
          <p className="font-semibold">Cerrar Sesión</p>
        </button>
      </div>
    </aside>
  );
};

export default ProfessionalSidebar;
