import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import Icon from "../../../components/ui/icon";
import Logo from "../../../public/assets/medical_schedule-logo.svg";
import leftArrow from "../../../public/assets/icons/arrowLeft.svg";
import HamburguerMenu from "../../../public/assets/icons/hamburger-sidebar.svg";
import { toggleSideI } from "@/interfaces";
import Link from "next/link";
import Search from "./Search";

const Navbar = ({ isOpen, toggleSidebar }: toggleSideI) => {
const router = useRouter()
    const pathname = usePathname()
    let path = pathname && pathname.split("/")[pathname.split("/").length-1]
  return (
    <nav className="w-full max-[490px]:h-14 max-[768px]:h-20 grid grid-cols-[50%,50%] mx-auto py-5 bg-transparent">
      {/* hamburg menu only lg or lower */}
        <div className="w-full md:hidden max-[490px]:h-14 max-[768px]:h-20 grid grid-cols-[50%,50%] mx-auto bg-dark-400 rounded-lg">
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
        </div>

        <div className="w-[90%] px-5 py-2 flex items-center justify-start gap-2">
            <button
            onClick={()=> router.back()}
            >
                <Image src={leftArrow} alt={leftArrow} width={18} height={18}/>
            </button>
            <p className="font-bold text-sm capitalize">{path}</p>
        </div>
        <div>
            <Search/>
        </div>


    </nav>
  );
};

export default Navbar;
