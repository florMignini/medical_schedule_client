"use client"
import Icon from "../components/ui/icon";
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/assets/medical_schedule-logo.svg";
import { ProfessionalSidebarData } from "../data/ProfessionalSidebarData";
import CloseIcon from "../public/assets/icons/close.svg";
import logOutIcon from "../public/assets/icons/logout.svg";
import { toggleSideI } from "@/interfaces";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import { closeSessionServer } from "@/app/actions";

const ProfessionalSidebar = ({
  isOpen,
  toggleSidebar,
  setIsOpen,
}: toggleSideI) => {

  const closeSession = async(): Promise<void> => {
    const res = await closeSessionServer()
    if (res) {
      localStorage.removeItem("infoProfSession")
    }
  }
  
  const pathname = usePathname()
  return (
    <aside
      className={` ${
        isOpen
          ? "fixed inset-y-0 left-0 w-64 md:w-[50%] backdrop-blur-lg z-50 text-white transform translate-x-0"
          : "hidden lg:flex h-[94%] items-center justify-start flex-col -translate-x-full bg-dark-400 rounded-lg"
      } transition-transform mb-2 duration-500 ease-in-out lg:translate-x-0 h-screen`}
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
              height={180}
              width={180}
            />
          </Link>
          <button className="flex items-center justify-center" onClick={toggleSidebar}>
            <Icon src={CloseIcon} alt="close-icon" width={20} height={20} />
          </button>
        </div>
      )}
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
              `w-[90%] flex gap-1 justify-start items-center mx-auto text-light-200 h-12 ${
              isOpen
                ? "justify-center hover:scale-110 hover:font-extrabold"
                : "opacity-65 pl-1 hover:bg-dark-500 rounded-lg"
            } ${
            pathname === item.path ? "bg-white/40 rounded-lg" : ""
            }`
            
            )}
            onClick={() => setIsOpen(false)}
          >
            <Icon
              src={item.icon.src}
              alt={item.icon.alt}
              width={30}
              height={30}
            />
            <span className="text-16-regular">{item.label}</span>
          </Link>
        ))}
      </div>
      <button
      className={`w-[90%] mx-auto flex items-center justify-center gap-2 ${
        isOpen ? "pt-[400px]" : "pt-[450px]"
      }`}
      onClick={closeSession}
      >
        <Icon
        src={logOutIcon}
        alt="log-out-icon"
        width={20}
        height={20}
        />
        <p className="text-16-regular">Cerrar Sesión</p>
      </button>
    </aside>
  );
};

export default ProfessionalSidebar;
