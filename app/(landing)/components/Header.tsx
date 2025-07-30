"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Logo from "@/public/assets/medical_schedule-transparent.png";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
const router = useRouter();
const {toast} = useToast()

const handleDemoLogin = async () => {
  console.log("🔐 Activando modo demo...");

  try {
    const response = await axios.post<{
      access_token: string;
      user: any;
    }>("https://medical-schedule-server-demo.onrender.com/api/auth/demo-login");

    const { access_token, user } = response.data;
    // 👉 Guardar en localStorage
    localStorage.setItem("session-token", access_token);
    localStorage.setItem("user", JSON.stringify(user));

    // 👉 Guardar en cookie (visible en middleware)
    Cookies.set("session-token", access_token, {
      path: "/",
      sameSite: "Lax",
      // opcional: secure: true, si solo sirve para HTTPS
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
                    <button
                    onClick={handleDemoLogin}
                        className="transition duration-200 ease-in-out flex items-center font-semibold justify-center gap-2.5 px-1 py-2   bg-gradient-to-r from-gray-500 to-gray-400 bg-clip-text text-transparent"
                    >
                        Demo access
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header;