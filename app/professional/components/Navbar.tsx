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
    <nav className="w-full flex items-center justify-center h-16 mx-auto py-5 bg-transparent">
      {/* hamburg menu only lg or lower */}
        <div
            className="w-[100%] lg:hidden grid grid-cols-[10%,90%] mx-auto bg-transparent rounded-lg">
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

            {/*<Link href="/professional/dashboard" className="hidden lg:flex">*/}
            {/*    /!* Logo *!/*/}
            {/*    <div className="pl-2 flex flex-col items-center justify-center">*/}
            {/*        <Image*/}
            {/*            src={Logo}*/}
            {/*            alt="Medical_Schedule_logo"*/}
            {/*            width={180}*/}
            {/*            height={180}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</Link>*/}
            <div className="w-[90%] px-5 py-2 flex items-center justify-start gap-2">
                <button
                    onClick={() => router.back()}
                >
                    <Image src={leftArrow} alt={leftArrow} width={18} height={18}/>
                </button>
                <p className="font-bold text-sm capitalize">{path}</p>
                <Search/>
            </div>


        </div>

        <div className="w-[90%] px-5 py-2 hidden lg:flex items-center justify-start gap-2">
            <button
                onClick={() => router.back()}
            >
                <Image src={leftArrow} alt={leftArrow} width={18} height={18}/>
            </button>
            <p className="font-bold text-sm capitalize">{path}</p>
            <Search/>
        </div>




    </nav>
  );
};

export default Navbar;
