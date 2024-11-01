"use client"
import Icon from "../components/ui/icon";
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/assets/medical_schedule-logo.svg";
import {ProfessionalSidebarData} from "@/data";
import CloseIcon from "../public/assets/icons/close.svg";
import logOutIcon from "../public/assets/icons/logout.svg";
import arrowRight from "../public/assets/icons/arrowRight.svg";
import onlyLogo from "../public/assets/onlyIcon.png";
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
                    ? "fixed inset-y-0 left-0 w-64 md:w-[50%] backdrop-blur-lg z-50 text-white transform translate-x-0"
                    : "hidden lg:flex h-[94%] items-center justify-start flex-col -translate-x-full bg-card-bg-100 rounded-lg"
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
                    src={onlyLogo}
                    alt="medical-schedule-logo-icon"
                    height={35}
                    width={35}
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
                            `w-[80%] flex gap-1 justify-start items-center text-white/50 text-xs h-8 my-2 px-2 ${
                                isOpen
                                    ? "justify-center hover:scale-110 hover:font-extrabold"
                                    : "opacity-65 pl-1 hover:bg-card-hover-100 rounded-xl"
                            } ${
                                pathname === item.path ? "bg-card-hover-100/90 rounded-xl text-white" : ""
                            }`
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        <Image
                            src={item.icon.src}
                            alt={item.icon.alt}
                            width={25}
                            height={25}
                            className="pl-2"
                        />
                        <span className="w-[80%] text-center text-sm">{item.label}</span>
                        {
                            pathname === item.path && (
                                <Icon src={arrowRight} alt={arrowRight}
                                      width={18}
                                      height={18}
                                />
                            )
                        }
                    </Link>
                ))}
            </div>
            <button
                className={`w-[90%] text-light-200/50 text-sm mx-auto flex items-center justify-center gap-2 ${
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
                <p className="">Cerrar Sesión</p>
            </button>
        </aside>
    );
};

export default ProfessionalSidebar;
