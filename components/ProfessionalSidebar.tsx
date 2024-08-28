import Image from "next/image";
import Link from "next/link";
import Icon from "../components/ui/icon";
import { ProfessionalSidebarData } from "../data/ProfessionalSidebarData";
import Logo from "../public/assets/medical_schedule-logo.svg";
const ProfessionalSidebar = () => {

  return (
    <aside className="sidebar flex items-center justify-start flex-col">
      {/* Logo */}
      <div className="w-full flex flex-col items-center justify-start h-36 opacity-65">
        <Image
          src={Logo}
          alt="Medical_Schedule_logo"
          width={40}
          height={40}
        />
        <p className="text-12-semibold text-white">Medical Schedule</p>
      </div>
      <div className="w-full flex flex-col items-center justify-center mx-auto gap-2">
        {ProfessionalSidebarData.map((item, index) => (
          <Link
            href={item.path}
            key={index}
            className="h-12 w-full flex gap-2 pl-2 items-center text-light-200 opacity-65 hover:bg-dark-500 rounded-lg"
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
