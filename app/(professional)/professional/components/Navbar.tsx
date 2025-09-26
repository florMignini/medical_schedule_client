"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../../public/assets/medical_schedule-logo.svg"
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Search from "./Search";
import { logout } from "./SidebarItems";
import { toggleSideI } from "@/interfaces";
import { Menu, X } from "lucide-react";

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
  </svg>
);

const Navbar = ({ isOpen, setIsOpen, isDemo = false }: toggleSideI) => {
  const router = useRouter();
  const pathname = usePathname();
  const path = pathname?.split("/").pop() || "";
  const [profInfo, setProfInfo] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const data = localStorage.getItem("infoProfSession");
    setProfInfo(data ? JSON.parse(data) : null);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "Pacientes", href: "/professional/patients" },
    { name: "Instituciones", href: "/professional/institutions" },
    { name: "Agenda", href: "/professional/appointments" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav
        className={`flex items-center justify-between px-4 py-3 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-lg bg-[#111111]/95 shadow-lg"
            : "backdrop-blur-md bg-[#111111]/70"
        }`}
      >
        {/* Logo */}
        <Link href="/professional/dashboard" className="flex items-center">
          <Image src={Logo} width={150} height={40} alt="Logo Empresa" className="object-contain" />
        </Link>

        {/* Desktop nav */}
        {!isMobile && (
          <div className="flex-1 flex justify-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-light text-gray-200 transition-colors ${
                  path === item.href.split("/").pop()
                    ? "border-gray-200 border-b"
                    : "text-gray-200 hover:border-b-[1px] hover:border-gray-200"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center space-x-4 relative">
          <button aria-label="Buscar" onClick={() => setSearchOpen((open) => !open)} className="text-white hover:text-gray-300 focus:outline-none">
            <SearchIcon />
          </button>

          {/* Avatar / Menu */}
          {isMobile ? (
            <button aria-label="Menú" onClick={() => setMenuOpen(!menuOpen)} className="text-white hover:text-gray-300 focus:outline-none">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          ) : (
            <Image
              width={40}
              height={40}
              src={profInfo?.userImage || "/default-avatar.png"}
              alt="Usuario profile picture"
              onClick={() => setDropdownOpen((open) => !open)}
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-white/40 hover:border-white transition"
            />
          )}

          {/* Dropdown desktop */}
          <AnimatePresence>
            {dropdownOpen && !isMobile && (
              <motion.ul
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-[130px] w-64 bg-black/90 backdrop-blur-xl rounded-md shadow-sm font-mono font-semibold p-2 text-white text-xs md:text-sm z-50"
              >
                <Link
                  href="/professional/profile"
                  className="px-4 py-2 hover:text-gray-300 cursor-pointer"
                  onClick={() => setDropdownOpen(false)}
                >
                  Información del usuario
                </Link>
                <li
                  className="px-4 py-2 hover:text-gray-300 cursor-pointer"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout(setIsOpen);
                  }}
                >
                  Cerrar sesión
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-[95%] md:w-[50%] absolute top-14 right-1 md:right-4 bg-black/70 backdrop-blur-md z-50 rounded-xl p-3 shadow-lg"
          >
            <Search path={path} isDemo={isDemo} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#111111]/95 shadow-lg border-t border-gray-800"
          >
            <div className="space-y-2 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                    path === item.href.split("/").pop()
                      ? "text-blue-400 bg-gray-800"
                      : "text-gray-200 hover:bg-gray-800 hover:text-blue-400"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout(setIsOpen);
                }}
                className="block w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-500 font-medium transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
