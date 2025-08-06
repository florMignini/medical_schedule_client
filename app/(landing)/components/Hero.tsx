"use client";

import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import HeroBG from "@/public/assets/HeroBG.png";
import Image from "next/image";


export default function Hero() {
const router = useRouter();
  const { toast } = useToast();

   const handleDemoLogin = async () => {
    try {
      const isDemo = document.cookie.includes("isDemo=true");
      if (isDemo) {
        toast({
          title: "Ya estás en modo demo",
          description: "No es necesario iniciar sesión de nuevo.",
          className: "bg-yellow-500 text-black",
        });
        router.push("/professional/dashboard");
        return;
      }
      const response = await axios.post<{
        access_token: string;
        user: any;
      }>("https://medical-schedule-server-demo.onrender.com/api/auth/demo-login");

      const { access_token, user } = response.data;

      localStorage.setItem("session-token", access_token);
      localStorage.setItem("infoProfSession", JSON.stringify(user));

      Cookies.set("session-token", access_token, {
        path: "/",
        sameSite: "Lax",
      });
      Cookies.set("professional-id", user.id, {
        path: "/",
        sameSite: "Lax",
      });
      Cookies.set("isDemo", "true", {
        path: "/",
        sameSite: "Lax",
      });

      toast({
        title: "Sesión iniciada en modo demo",
        description: "Has accedido correctamente al modo demo.",
        className: "bg-emerald-500 text-black",
      });

      router.push("/professional/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar el modo demo",
        className: "bg-red-500 text-white",
      });
      console.error(error);
    }
  };


  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF]"
      style={{ height: "calc(100vh - 60px)" }}
      aria-label="Hero section"
    >
      {/* Imagen de fondo decorativa */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HeroBG}
          alt="Fondo Medical Schedule"
          fill
          className="object-cover opacity-50 rounded-bl-[40%] rounded-br-[30%] lg:rounded-tr-[25%] lg:rounded-br-[80%]"
          priority
        />
      </div>

      {/* Contenido principal animado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6 sm:px-12 lg:px-24"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          aria-label="Medical Schedule"
          className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold bg-gradient-to-b from-gray-600 to-[#5a8bbd] text-transparent bg-clip-text leading-tight"
        >
          Medical<br />Schedule
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-6 max-w-md text-gray-700 text-base md:text-lg font-medium"
        >
          La plataforma ideal para profesionales de la salud: organizá turnos, pacientes y más.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
          type="button"
          aria-label="Ver demo de Medical Schedule"
          className="mt-10 rounded-xl bg-[#5a8bbd] px-8 py-3 text-white font-semibold shadow-lg transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#5a8bbd]/50"
          onClick={handleDemoLogin}
        >
          Ver demo
        </motion.button>
      </motion.div>
    </section>
  );
}
