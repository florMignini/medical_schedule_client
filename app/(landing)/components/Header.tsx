import Image from "next/image";
import Logo from "@/public/assets/medical_schedule-transparent.png";
import Link from "next/link";

const Header = () => {
    return (
        <header className="w-full h-[60px] border-b border-white/15 sticky z-40 top-0 backdrop-blur-lg">
            {/* header */}
            <div className="w-[90%] mx-auto py-2 px-1 sm:px-5 flex items-center justify-between">
                <div className="w-[50%] flex">
                    <Image
                        src={Logo}
                        alt="medical-schedule-logo"
                        width={150}
                        height={150}
                    />
                    
                </div>
                <div className="w-[100%] sm:w-[50%] flex items-center justify-end gap-5">
                    <Link
                        href="/login"
                        className="transition duration-200 ease-in-out flex items-center font-semibold justify-center gap-2.5 px-1 py-2   bg-gradient-to-r from-gray-500 to-gray-400 bg-clip-text text-transparent"
                    >
                        Soy usuario
                    </Link>
                    <Link
                        href="/admin"
                        className="transition duration-200 ease-in-out flex items-center font-semibold justify-center gap-2.5 px-1 py-2   bg-gradient-to-r from-gray-500 to-gray-400 bg-clip-text text-transparent"
                    >
                        Registrarme
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header;