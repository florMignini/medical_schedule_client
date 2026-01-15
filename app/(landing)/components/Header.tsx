"use client";
import Link from "next/link";
import Image from "next/image";

import Logo from "../../../public/assets/medical_schedule-transparent.png";

const Header = () => {

  return (
    <header className="w-full scroll-mt-20 sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10 shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={Logo}
            alt="Medical Schedule Logo"
            width={120}
            height={40}
            priority
            className="h-auto w-auto max-h-[40px]"
          />
        </Link>

        {/* Buttons */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/professional-invitation"
            className="text-sm font-semibold px-3 py-1 rounded-xl hover:scale-105 transition-transform bg-emerald-500 text-white hover:bg-emerald-200/10 backdrop-blur-md"
          >
            Registrarme
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold px-3 py-1 rounded-xl hover:scale-105 transition-transform bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
          >
            Soy usuario
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
