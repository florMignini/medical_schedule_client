import Image from "next/image";
import Icon from "../../../components/ui/icon";
import Logo from "../../../public/assets/medical_schedule-logo.svg";
import HamburguerMenu from "../../../public/assets/icons/hamburger-sidebar.svg";
import CloseMenu from "../../../public/assets/icons/close.svg";
const Navbar = () => {
  return (
    <nav className="w-full grid grid-cols-[50%,50%] h-20 py-3">
      {/* Logo */}

      {/* hamburg menu only lg or lower */}
      <button className="lg:hidden text-white hover:opacity-65 flex">
        <Icon
          src={HamburguerMenu}
          alt="hamburguer-menu-icon"
          width={30}
          height={30}
        />
        <Icon src={CloseMenu} alt="close-menu-icon" width={30} height={30} />
      </button>
      <button className="hidden lg:flex ">
        <div className="flex flex-col items-center justify-center">
        <Image src={Logo} alt="Medical_Schedule_logo" width={40} height={40} />
        <p className="text-12-semibold text-white">Medical Schedule</p>
        </div>
      </button>

      <div className="flex flex-col w-[50%] text-white opacity-65">
        <h2 className="text-18-bold">Bienvenido</h2>
        <p className="text-12-regular opacity-20">
          Hola, Leandro bienvenido de vuelta.
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
