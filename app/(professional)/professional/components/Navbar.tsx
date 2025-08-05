"use client"
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib";
import { ProfessionalInformation, toggleSideI } from "@/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import Search from "./Search";
import { logout } from "./SidebarItems";
type ProfessionalStorageInformation = {
  firstname:string;
  gender:string;
  id:string;
  lastname:string;
  userImage?: string;
};

const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
    />
  </svg>
);

const Navbar = ({ isOpen, setIsOpen }: toggleSideI) => {
  const router = useRouter();
  const pathname = usePathname();
  let path = pathname && pathname.split("/")[pathname.split("/").length - 1];
  const [profInfo, setProfInfo] = useState<ProfessionalStorageInformation | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let data = localStorage.getItem("infoProfSession");
    setProfInfo(data ? JSON.parse(data) : null);
  }, []);

  // Detecta si está en mobile (menos de 768px)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);
  
  return (
   <section className="w-full h-13">
   <nav className="sticky top-0 h-12 z-40 flex items-center justify-end gap-4 md:gap-0 md:justify-between px-4 py-3 backdrop-blur-md bg-[#111111]">
        {/* router back button */}
        {/* Back button - desktop ONLY */}
        {!isMobile && (
            <button
              onClick={() => router.back()}
              aria-label="Volver"
              className="text-white hover:text-gray-300 focus:outline-none flex items-center gap-1"
            >
              <BackIcon />
              Volver
            </button>
          )}

        {/* Dr. Greeting */}
        <div className="text-white text-center font-semibold text-lg select-none">
          <p className="truncate">{`Hola, ${profInfo?.firstname} ${profInfo?.lastname}!`}</p>
        </div>

        {/* right section: Glass + avatar & dropdown mobile only */}
        <div className="flex items-center space-x-4 relative">
          {/* search Glass */}
          <button
            aria-label="Buscar"
            onClick={() => setSearchOpen((open) => !open)}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            <SearchIcon />
          </button>

          {/* Avatar - mobile ONLY */}
          {isMobile && (
            <div className="relative">
              <Image
                width={40}
                height={40}
                src={profInfo?.userImage || "/default-avatar.png"}
                alt="Usuario profile picture"
                onClick={() => setDropdownOpen((open) => !open)}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-white/40 hover:border-white transition"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setDropdownOpen((open) => !open);
                  }
                }}
              />

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.ul
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-[2px] w-56 bg-black/80 bg-opacity-90 backdrop-blur-xl rounded-md shadow-sm font-mono font-semibold shadow-white py-2 text-white text-xs md:text-sm z-50"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <Link
                      href="/professional/profile"
                      className="px-4 py-2 hover:text-gray-300 cursor-pointer"
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                      tabIndex={0}
                    >
                      Información del usuario
                    </Link>
                    <li
                      className="px-4 py-2 hover:text-gray-300 cursor-pointer"
                      onClick={() => {
                        setDropdownOpen(false)
                        logout(setIsOpen);
                      }}
                      role="menuitem"
                      tabIndex={0}
                      
                    >
                      Cerrar
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-[50%] absolute top-14 p-4 md:p-3 right-4 bg-transparent bg-opacity-90 backdrop-blur-xl z-50"
          >
            <Search path={path} />
          </motion.div>
        )}
      </AnimatePresence>
   </section>
  );
};

export default Navbar;
