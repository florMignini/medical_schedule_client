"use client";

import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#3e5f93] text-white py-12 px-6 sm:px-12">
      <div className="max-w-screen-xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 items-start">
        {/* Branding */}
        <div>
          <h3 className="text-2xl font-bold mb-2">Medical Schedule</h3>
          <p className="text-sm text-white/70">
            Organización médica simple, segura y eficiente.
          </p>
        </div>
        {/* Enlaces útiles */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Enlaces</h4>
          <ul className="space-y-1 text-white/80 text-sm">
            <li><Link href="#hero">Inicio</Link></li>
            <li><Link href="#features">Características</Link></li>
            <li><Link href="#preview">Vista previa</Link></li>
            <li><Link href="#contacto">Contacto</Link></li>
          </ul>
        </div>

        {/* Redes o contacto */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Conectá con nosotros</h4>
          <div className="flex gap-4 mt-2">
            <a
              href="https://github.com/florMignini"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-white/90 transition"
            >
              <Github />
            </a>
            <a
              href="https://www.linkedin.com/in/florencia-mignini/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white/90 transition"
            >
              <Linkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Línea final */}
      <div className="mt-12 border-t border-white/20 pt-6 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Medical Schedule · Hecho con 💙 por Florencia Mignini
      </div>
    </footer>
  );
}
