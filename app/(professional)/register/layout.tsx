import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";



const PlusFont = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
  variable: "--font-plus",
  display: "swap", // Ensure font is loaded asynchronously to avoid FOIT (Flash of Invisible Text)
});

export const metadata: Metadata = {
  title: "Medical Schedule App",
  description: "Patients and activities organizer for medical professionals",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return (
<main className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        {/* Título opcional */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Registro de Profesional</h1>
          <p className="text-sm text-gray-500">Completá tus datos para comenzar</p>
        </div>

        {children}
        <Toaster />
      </div>
    </main>
    );
  }
  