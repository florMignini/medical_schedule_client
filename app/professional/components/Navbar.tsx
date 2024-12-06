import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Icon from "../../../components/ui/icon";
import Logo from "../../../public/assets/medical_schedule-logo.svg";
import leftArrow from "../../../public/assets/icons/arrowLeft.svg";
import HamburguerMenu from "../../../public/assets/icons/hamburger-sidebar.svg";
import { toggleSideI } from "@/interfaces";
import Link from "next/link";
import Search from "./Search";
import { useLocalStorage } from "@/utils";
import Hamburguer from "./icons/Hamburguer";

const Navbar = ({ isOpen, toggleSidebar }: toggleSideI) => {

  const router = useRouter();
  const pathname = usePathname();
  let path = pathname && pathname.split("/")[pathname.split("/").length - 1];

  const [storedValue] = useLocalStorage("infoProfSession")

  return (
    <nav className="w-full flex items-center justify-center h-24 mx-auto py-5 bg-transparent">
      {/* hamburg menu only lg or lower */}
      <div className="w-[100%] lg:hidden grid grid-cols-[10%,90%] mx-auto bg-transparent rounded-lg">
        {/*left section*/}
        <div className="flex items-center justify-start">
          <button
            className="lg:hidden flex items-center justify-start text-black font-bold pl-4 hover:opacity-65"
            onClick={toggleSidebar}
          >
            <Hamburguer
              width={25}
              height={25}
            />
          </button>
        </div>

        {/*right section*/}
        <div className="w-[100%] px-5 py-2 flex items-center justify-start gap-2">
          <div className="w-[60%] lg:w-[50%] hidden md:flex items-center justify-start">
            {/* route section */}
            <div className={`${
              path === "dashboard"
               ? "hidden md:w-[30%] md:flex items-center justify-start gap-2"
                : "hidden md:w-[80%] md:flex items-center justify-start gap-2"
            }`}>
              <button onClick={() => router.back()}>
                <Image src={leftArrow} alt={leftArrow} width={18} height={18} />
              </button>
              <p className="font-bold text-sm capitalize">{path}</p>
            </div>
            {/* welcome section */}
            <div
              className={` ${
                path === "dashboard"
                  ? "hidden min-[880px]:flex min-[880px]:w-[50%] text-[20px] xl:text-2xl text-start text-black text-clip font-medium"
                  : "hidden"} `}
            >
              {storedValue?.gender === "M" ? (
                <h2 className="capitalize">
                  Bienvenido, Dr. <strong className="truncate">{storedValue?.lastname}</strong>
                </h2>
              ) : (
                <h2 className="capitalize">
                  Bienvenida, Dra. <strong className="truncate">{storedValue?.lastname}</strong>
                </h2>
              )}
            </div>
          </div>
          <div className="w-[90%] mx-auto md:w-[50%] flex items-center justify-end">
            <Search path={path} />
          </div>
        </div>
      </div>

      <div className="w-[100%] px-3 py-2 hidden lg:grid lg:grid-cols-[60%,40%] gap-2">
        <div className="w-[100%] flex items-center justify-start">
          <div className="w-[100%] flex items-center justify-center">
            <div className={`${
              path === "dashboard"
               ? " w-[30%] flex items-center justify-start"
                : " w-[80%] flex items-center justify-start"
            }`}>
              <button onClick={() => router.back()}>
                <Image
                  src={leftArrow}
                  alt="left-arrow"
                  width={18}
                  height={18}
                />
              </button>
              <p className="font-bold text-sm capitalize">{path}</p>
            </div>
            <div className={`${
              path === "dashboard"
               ? "text-[24px] text-black text-start text-clip font-medium"
                : "hidden"
            }`}>
              {storedValue?.gender === "M" ? (
                <h2 className="capitalize">
                  Bienvenido, Dr. <strong className="truncate">{storedValue?.lastname}</strong>
                </h2>
              ) : (
                <h2 className="capitalize">
                  Bienvenida, Dra. <strong className="truncate">{storedValue?.lastname}</strong>
                </h2>
              )}
            </div>
          </div>
        </div>
        <div>
          <Search path={path} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
