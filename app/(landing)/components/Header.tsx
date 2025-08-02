"use client";

import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/public/assets/medical_schedule-transparent.png";

const Header = () => {
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
    <header className="w-full sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10 shadow-md">
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
            href="/login"
            className="text-sm font-semibold px-3 py-1 rounded-xl hover:scale-105 transition-transform bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
          >
            Soy usuario
          </Link>
          <button
            onClick={handleDemoLogin}
            className="text-sm font-semibold px-3 py-1 rounded-xl hover:scale-105 transition-transform bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 backdrop-blur-md"
          >
            Demo access
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
