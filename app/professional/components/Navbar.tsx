import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import leftArrow from "../../../public/assets/icons/arrowLeft.svg";
import { toggleSideI } from "@/interfaces";
import Search from "./Search";
import { useLocalStorage } from "@/utils";
import Hamburguer from "./icons/Hamburguer";
import ArrowLeft from "./icons/ArrowLeft";
import SearchIcon from "./icons/SearchIcon";
import { useState } from "react";

import Link from "next/link";
import { closeSessionServer } from "@/app/actions";
import { ProfessionalSidebarData } from "@/data";
import { cn } from "@/lib";

const Navbar = ({ isOpen, setIsOpen }: toggleSideI) => {
  const router = useRouter();
  const pathname = usePathname();
  let path = pathname && pathname.split("/")[pathname.split("/").length - 1];
  const [openResponsiveNav, setOpenResponsiveNav] = useState(false);
  const [openDropdownProfile, setOpenDropdownProfile] = useState(false);
  const [storedValue] = useLocalStorage("infoProfSession");

  return (
    <>
    <nav className="w-full h-16 flex items-center justify-center min-[768px]:h-20 mx-auto py-3 bg-[#F2F3F0] rounded-sm border-b-[1px] border-[#F2F3F0]">
      {/* hamburg menu only lg or lower */}
      <div className="w-[100%] lg:hidden grid grid-cols-[10%,90%] mx-auto bg-transparent rounded-lg">
        {/*left section*/}
        <div className="flex items-center justify-start">
          {/* tablet burguer icon */}
          <button
            className="hidden lg:hidden min-[768px]:flex items-center justify-start text-black font-bold pl-4 hover:opacity-65"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Hamburguer width={25} height={25} />
          </button>
          {/* mobile icon */}
          <div className="w-[100%] flex items-center justify-start pl-3 min-[768px]:hidden">
            <Link href="/professional/dashboard">
              <Image
                src="/assets/onlyIcon.png"
                alt="logo"
                width={100}
                height={50}
              />
            </Link>
          </div>
        </div>

        {/*right section*/}
        <div className="w-[100%] min-[768px]:pr-3 py-2 flex items-center justify-start gap-2">
          <div className="w-[60%] lg:w-[50%] hidden md:flex items-center justify-start">
            {/* route section */}
            <div
              className={`${
                path === "dashboard"
                  ? "hidden md:w-[30%] md:flex items-center justify-start gap-2"
                  : "hidden md:w-[80%] md:flex items-center justify-start gap-2"
              }`}
            >
              <button onClick={() => router.back()}>
                <ArrowLeft color={"#000000"} width={18} height={18} />
              </button>
              <p className="font-bold text-xs">{path.toUpperCase()}</p>
            </div>
            {/* welcome section */}
            <div
              className={` ${
                path === "dashboard"
                  ? "hidden min-[880px]:flex min-[880px]:w-[50%] text-[20px] xl:text-2xl text-center mx-auto text-black text-clip font-medium"
                  : "hidden"
              } `}
            >
              {storedValue?.gender === "M" ? (
                <h2 className="capitalize">
                  Bienvenido, Dr.{" "}
                  <strong className="truncate">{storedValue?.lastname}</strong>
                </h2>
              ) : (
                <h2 className="capitalize">
                  Bienvenida, Dra.{" "}
                  <strong className="truncate">{storedValue?.lastname}</strong>
                </h2>
              )}
            </div>
          </div>
          <div className="hidden mx-auto md:w-[50%] min-[768px]:flex items-center justify-end">
            <Search path={path} />
          </div>
          <div className="w-[90%] h-[50px] min-[768px]:hidden flex gap-2 items-center justify-end">
            <button onClick={() => setOpenResponsiveNav(!openResponsiveNav)}>
              <SearchIcon width={25} height={25} color={"#bfbfbf"} />
            </button>
            <div
              className={`transition-all duration-300${
                openResponsiveNav
                  ? "opacity-100 w-[75%] top-0 flex items-center justify-center"
                  : "opacity-0 w-0"
              } `}
            >
              {openResponsiveNav && <Search path={path} />}
            </div>
            <button
              onClick={() => setOpenDropdownProfile(!openDropdownProfile)}
            >
              <Image
                width={40}
                height={40}
                className="rounded-full"
                src={
                  storedValue?.photo ||
                  "https://avatar.iran.liara.run/public/job/doctor/male"
                }
                alt="profile-picture"
              />
            </button>
            <div className="absolute top-[9.5%] z-50 right-2 w-[150px]">
              {openDropdownProfile && (
                <div className="backdrop-blur-md glass-effect rounded-md">
                  <div className="w-[90%] mx-auto">
                    <Link
                      href={`/professional/profile`}
                      className="text-[14px] flex items-center justify-start text-black"
                      onClick={() => setOpenDropdownProfile(false)}
                    >
                      Perfil
                    </Link>
                  </div>
                  <div className="w-[90%] mx-auto">
                    <button className="text-[14px] flex items-center justify-start text-black"
                    onClick={async() => {
                      setOpenDropdownProfile(false)
                      const res = await closeSessionServer();
                      if (res) {
                        localStorage.removeItem("infoProfSession");
                      }
                    }}

                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-[100%] px-3 py-2 hidden items-center h-full justify-center lg:grid lg:grid-cols-[60%,40%] gap-2">
        <div className="w-[100%] flex items-center justify-start">
          <div className="w-[100%] flex items-center justify-center">
            <div
              className={`${
                path === "dashboard"
                  ? " w-[30%] flex items-center justify-start"
                  : " w-[80%] flex items-center justify-start"
              }`}
            >
              <button onClick={() => router.back()}>
                <ArrowLeft width={18} height={18} color={"#000"} />
              </button>
              <p className="font-bold text-sm">{path.toLocaleUpperCase()}</p>
            </div>
            <div
              className={`${
                path === "dashboard"
                  ? "text-[24px] text-black text-start text-clip font-medium"
                  : "hidden"
              }`}
            >
              {storedValue?.gender === "M" ? (
                <h2 className="capitalize">
                  Bienvenido, Dr.{" "}
                  <strong className="truncate">{storedValue?.lastname}</strong>
                </h2>
              ) : (
                <h2 className="capitalize">
                  Bienvenida, Dra.{" "}
                  <strong className="truncate">{storedValue?.lastname}</strong>
                </h2>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Search path={path} />
        </div>
      </div>
    </nav>
      <div className="w-full min-[768px]:hidden h-10 mb-3 border-b-[1px] border-[#d9d9d8]">
<div className="w-full h-full flex items-center justify-start">
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
                  ? "w-[95%] underline text-black"
                  : ""
              }`
            )}
            onClick={() => setIsOpen(false)}
          >
            <span className="w-[80%] text-center text-sm font-light">
              {item.label}
            </span>
          </Link>
        ))}
</div>
        </div>
    </>
  );
};

export default Navbar;
