import { useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Icon from "../../../components/ui/icon";
import Logo from "../../../public/assets/medical_schedule-logo.svg";
import leftArrow from "../../../public/assets/icons/arrowLeft.svg";
import HamburguerMenu from "../../../public/assets/icons/hamburger-sidebar.svg";
import { toggleSideI } from "@/interfaces";
import Link from "next/link";
import Search from "./Search";

type professionalType = {
  firstname: string;
  id: string;
  lastname: string;
};
const Navbar = ({ isOpen, toggleSidebar }: toggleSideI) => {
  const [professional, setprofessional] = useState<professionalType>();
  const router = useRouter();
  const pathname = usePathname();
  let path = pathname && pathname.split("/")[pathname.split("/").length - 1];

  useMemo(() => {
    // get professional data
    const profData = localStorage.getItem("infoProfSession");
    if (profData) {
      setprofessional(JSON.parse(profData));
    }
  }, []);
  return (
    <nav className="w-full flex items-center justify-center h-24 mx-auto py-5 bg-transparent">
      {/* hamburg menu only lg or lower */}
      <div className="w-[100%] lg:hidden grid grid-cols-[10%,90%] mx-auto bg-transparent rounded-lg">
        {/*left section*/}
        <div className="flex items-center justify-start">
          <button
            className="lg:hidden flex items-center justify-start text-white pl-4 hover:opacity-65"
            onClick={toggleSidebar}
          >
            <Icon
              src={HamburguerMenu}
              alt="hamburguer-menu-icon"
              width={30}
              height={30}
            />
          </button>
        </div>

        {/*right section*/}
        <div className="w-[100%] px-5 py-2 flex items-center justify-start gap-2">
          <div className="w-[60%] lg:w-[50%] flex items-center justify-start">
            {/* route section */}
            <div className="hidden md:w-[30%] md:flex items-center justify-start gap-2">
              <button onClick={() => router.back()}>
                <Image src={leftArrow} alt={leftArrow} width={18} height={18} />
              </button>
              <p className="font-bold text-sm capitalize">{path}</p>
            </div>
            {/* welcome section */}
            <div className="w-[80%] md:w-[50%] text-[20px] xl:text-2xl text-start text-gradient text-clip font-medium">
              <h2 className="capitalize">
                Bienvenid@, Dr. <strong>{professional?.lastname}</strong>
              </h2>
            </div>
          </div>
          <div className="w-[40%] lg:w-[50%] flex items-center justify-end">
            <Search />
          </div>
        </div>
      </div>

      <div className="w-[90%] px-5 py-2 hidden lg:grid lg:grid-cols-[60%,40%] gap-2">
        <div className="w-[100%] flex items-center justify-start">
          <div className="w-[100%] flex items-center justify-center">
            <div className=" w-[30%] flex items-center justify-start">
              <button onClick={() => router.back()}>
                <Image src={leftArrow} alt={leftArrow} width={18} height={18} />
              </button>
              <p className="font-bold text-sm capitalize">{path}</p>
            </div>
            <h2 className="w-[50%] text-[20px] capitalize text-gradient">
              Bienvenid@, Dr. <strong>{professional?.lastname}</strong>
            </h2>
          </div>
        </div>
        <div>
          <Search />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
