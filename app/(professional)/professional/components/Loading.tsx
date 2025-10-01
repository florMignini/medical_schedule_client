'use client'

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

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
    <section className="flex flex-col items-center justify-center min-h-screen bg-white text-black font-mono px-4">
      {/* Logo spinning */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
      >
        <LoaderCircle className="w-10 h-10 animate-spin" />
      </motion.div>

      {/* Loading Message */}
      <div className="text-lg tracking-wide flex items-center mt-8 gap-2">
        <span>{loadingMessages[messageIndex]}</span>
        <motion.div
          className="flex space-x-1"
          variants={dotsVariants}
          animate="animate"
        >
          <motion.span className="w-1 h-1 bg-black rounded-full" />
          <motion.span className="w-1 h-1 bg-black rounded-full" />
          <motion.span className="w-1 h-1 bg-black rounded-full" />
        </motion.div>
      </div>

      {/* Secondary info */}
      <p className="mt-4 text-base font-mono">
        Por favor, espera mientras cargamos tu información profesional...
      </p>
    </section>
  );
}
