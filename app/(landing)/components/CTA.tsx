"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section
      className="w-full bg-gradient-to-br from-[#5a8bbd] to-[#3e5f93] py-20 px-6 sm:px-12"
      aria-label="Call to action"
    >
      <motion.div
        className="max-w-screen-xl mx-auto text-center text-white flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold">
          ¿Listo para transformar tu forma de trabajar?
        </h2>
        <p className="text-white/80 max-w-xl text-lg">
          Sumate a los profesionales que ya están usando Medical Schedule para
          organizar su día a día con eficiencia.
        </p>
        <button
          className="mt-4 bg-white text-[#3e5f93] hover:text-white hover:bg-[#2c4374] transition-colors font-semibold px-8 py-3 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-white/40"
          aria-label="Probar Medical Schedule"
        >
          Probar ahora
        </button>
      </motion.div>
    </section>
  );
}
