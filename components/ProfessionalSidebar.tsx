import Icon from "../components/ui/icon";
import Link from "next/link";
import { ProfessionalSidebarData } from "../data/ProfessionalSidebarData";
import { toggleSideI } from "@/interfaces";

const ProfessionalSidebar = ({ isOpen }: toggleSideI) => {
  return (
    <aside
      className={` ${
        isOpen
          ? "fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform translate-x-0"
          : "hidden lg:flex sidebar items-center justify-start flex-col -translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0`}
    >
      <div className="w-full flex flex-col items-center justify-center mx-auto gap-2">
        {ProfessionalSidebarData.map((item, index) => (
          <Link
            href={item.path}
            key={index}
            className="h-12 w-full flex gap-2 items-center text-light-200 opacity-65 hover:bg-dark-500 rounded-lg"
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
