import Icon from "../components/ui/icon";
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/assets/medical_schedule-logo.svg";
import { ProfessionalSidebarData } from "../data/ProfessionalSidebarData";
import CloseIcon from "../public/assets/icons/close.svg";
import { toggleSideI } from "@/interfaces";

const ProfessionalSidebar = ({
  isOpen,
  toggleSidebar,
  setIsOpen,
}: toggleSideI) => {
  return (
    <aside
      className={` ${
        isOpen
          ? "fixed inset-y-0 left-0 w-64 md:w-[50%] backdrop-blur-lg text-white transform translate-x-0"
          : "hidden lg:flex sidebar items-center justify-start flex-col -translate-x-full"
      } transition-transform duration-500 ease-in-out lg:translate-x-0`}
    >
      {isOpen && (
        <div className="w-full pt-2 px-5 flex items-center justify-between">
          <Link
            href="/professional/dashboard"
            className="flex flex-col items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <Image
              src={Logo}
              alt="medical-schedule-logo"
              height={40}
              width={40}
            />
            <p className="text-[10px]">medical schedule</p>
          </Link>
          <button className="flex" onClick={toggleSidebar}>
            <Icon src={CloseIcon} alt="close-icon" width={30} height={30} />
          </button>
        </div>
      )}
      <div
        className={`w-full flex flex-col items-center justify-center mx-auto gap-2 ${
          isOpen ? "py-16" : ""
        }`}
      >
        {ProfessionalSidebarData.map((item, index) => (
          <Link
            href={item.path}
            key={index}
            className={`w-[85%] flex gap-2 items-center text-light-200 h-12 ${
              isOpen
                ? "justify-center hover:scale-110 hover:font-extrabold"
                : "opacity-65 hover:bg-dark-500 rounded-lg pl-2"
            }`}
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
    </aside>
  );
};

export default ProfessionalSidebar;
