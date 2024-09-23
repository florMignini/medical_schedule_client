import Image from "next/image";
import Icon from "../../../components/ui/icon";
import Logo from "../../../public/assets/medical_schedule-logo.svg";
import HamburguerMenu from "../../../public/assets/icons/hamburger-sidebar.svg";
import { toggleSideI } from "@/interfaces";
import Link from "next/link";

const Navbar = ({ isOpen, toggleSidebar }: toggleSideI) => {
  return (
    <nav className="w-full md:w-[99%] h-20 grid grid-cols-[50%,50%] py-3 mx-auto">
      {/* hamburg menu only lg or lower */}
      <button
        className="lg:hidden text-white pl-4 hover:opacity-65 flex"
        onClick={toggleSidebar}
      >
        <Icon
          src={HamburguerMenu}
          alt="hamburguer-menu-icon"
          width={30}
          height={30}
        />
      </button>
      <Link href="/professional/dashboard" className="hidden lg:flex">
        {/* Logo */}
        <div className="pl-2 flex flex-col items-center justify-center">
          <Image
            src={Logo}
            alt="Medical_Schedule_logo"
            width={180}
            height={180}
          />
        </div>
      </Link>

      <div className="flex flex-col w-[50%] text-white opacity-65">
        <h2 className="text-16-bold">future search section</h2>
      </div>
    </nav>
  );
};

export default Navbar;
