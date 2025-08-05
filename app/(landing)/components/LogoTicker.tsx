"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import medicalScheduleLogo from "@/public/assets/medical_schedule-transparent.png";

const logos = Array.from({ length: 10 }).map((_, i) => ({
  id: `logo-${i}`,
  src: medicalScheduleLogo.src,
}));

export default function LogoTicker() {
  return (
    <section className="py-6 sm:py-10 bg-dark-300/30 w-full overflow-hidden">
      <div className="relative w-full">
        {/* Gradient overlay (masking effect) */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[rgba(16,16,16,0.2)] via-transparent to-[rgba(16,16,16,0.1)]" />

        {/* Scrolling container */}
        <motion.div
          className="flex gap-10 w-max animate-scroll px-4"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {/* Duplicamos el array para efecto infinito */}
          {[...logos, ...logos].map((logo, index) => (
            <motion.div
              key={logo.id + index}
              className="flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={logo.src}
                alt={`Logo ${index + 1}`}
                width={120}
                height={120}
                className="opacity-90 hover:opacity-100 transition duration-300"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
