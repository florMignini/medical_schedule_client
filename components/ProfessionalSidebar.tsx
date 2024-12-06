"use client"
import Icon from "../components/ui/icon";
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/assets/medical_schedule-logo.svg";
import {ProfessionalSidebarData} from "@/data";
import CloseIcon from "../public/assets/icons/close.svg";
import logOutIcon from "../public/assets/icons/logout.svg";
import arrowRight from "../public/assets/icons/arrowRight.svg";
import onlyLogo from "../public/assets/medical_schedule-transparent.png";
import {toggleSideI} from "@/interfaces";
import {usePathname} from "next/navigation";
import {cn} from "@/lib";
import {closeSessionServer} from "@/app/actions";

const ProfessionalSidebar = ({
                                 isOpen,
                                 toggleSidebar,
                                 setIsOpen,
                             }: toggleSideI) => {

    const closeSession = async (): Promise<void> => {
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
                    ? "fixed inset-y-0 left-0 w-64 md:w-[30%] backdrop-blur-lg bg-gray-600/40 z-50 transform translate-x-0"
                    : "hidden lg:flex items-center justify-start flex-col -translate-x-full"
            } transition-transform mb-2 duration-500 ease-in-out lg:translate-x-0 h-screen bg-transparent`}
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
                            height={160}
                            width={160}
                        />
                    </Link>
                    <button className="flex items-start justify-start" onClick={toggleSidebar}>
                        <Icon src={CloseIcon} alt="close-icon" width={20} height={20}/>
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
                    height={150}
                    width={150}
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
                            `w-[80%] flex gap-1 justify-start items-center text-white text-xs h-8 my-2 px-2 ${
                                isOpen
                                    ? "justify-center hover:scale-105 hover:font-extrabold"
                                    : "pl-1 hover:scale-105 rounded-xl"
                            } ${
                                pathname === item.path ? "w-[95%] glass-effect" : ""
                            }`
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        <Image
                            src={item.icon.src}
                            alt={item.icon.alt}
                            width={28}
                            height={28}
                            className="pl-2"
                        />
                        <span className="w-[80%] text-center text-base font-medium text-white">{item.label}</span>
                        {
                            pathname === item.path && (
                                <Image src={arrowRight} alt={arrowRight}
                                      width={18}
                                      height={18}
                                />
                            )
                        }
                    </Link>
                ))}
            </div>
            <button
                className={`w-[90%] text-[#3c3aaf] text-sm mx-auto flex items-center justify-center gap-2 ${
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
                <p className="font-semibold text-white">Cerrar Sesión</p>
            </button>
        </aside>
    );
};

export default ProfessionalSidebar;
