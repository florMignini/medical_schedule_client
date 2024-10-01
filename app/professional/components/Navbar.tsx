import Image from "next/image";
import Icon from "../../../components/ui/icon";
import Logo from "../../../public/assets/medical_schedule-logo.svg";
import HamburguerMenu from "../../../public/assets/icons/hamburger-sidebar.svg";
import { toggleSideI } from "@/interfaces";
import Link from "next/link";
import Search from "./Search";

const Navbar = ({ isOpen, toggleSidebar }: toggleSideI) => {
  return (
    <nav className="w-full md:w-[99%] h-20 grid grid-cols-[50%,50%] py-3 mx-auto">
      {/* hamburg menu only lg or lower */}
      <button
        className="w-[15%] lg:hidden text-white pl-4 hover:opacity-65 flex"
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

      
        <Search/>
      
    </nav>
  );
};

export default Navbar;
