'use client'

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../../public/assets/onlyIcon.png";

const loadingMessages = [
  "Conectando con pacientes",
  "Cargando instituciones médicas",
  "Sincronizando agenda profesional",
  "Actualizando registros clínicos",
];

const dotsVariants = {
  animate: {
    opacity: [0.3, 1, 0.3],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
      staggerChildren: 0.2,
    },
  },
};

export default function Loading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] text-white font-mono px-4">
      {/* Logo spinning */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
      >
        <Image
          src={logo}
          alt="Medical Schedule logo"
          width={100}
          height={100}
          priority
          className="drop-shadow-[0_0_20px_rgba(0,255,100,0.5)]"
        />
      </motion.div>

      {/* Loading Message */}
      <div className="mt-8 text-green-400 text-lg tracking-wide flex items-center gap-2">
        <span>{loadingMessages[messageIndex]}</span>
        <motion.div
          className="flex space-x-1"
          variants={dotsVariants}
          animate="animate"
        >
          <motion.span className="w-1 h-1 bg-green-400 rounded-full" />
          <motion.span className="w-1 h-1 bg-green-400 rounded-full" />
          <motion.span className="w-1 h-1 bg-green-400 rounded-full" />
        </motion.div>
      </div>

      {/* Secondary info */}
      <p className="mt-4 text-xs text-white/40">
        Por favor, espera mientras cargamos tu información profesional...
      </p>
    </section>
  );
}
