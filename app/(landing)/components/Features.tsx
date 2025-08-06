"use client";

import { motion } from "framer-motion";
import { CalendarCheck, FileText, BellRing } from "lucide-react";

const features = [
  {
    title: "Gestión sencilla de turnos",
    description: "Organizá tus citas médicas de manera rápida y sin complicaciones.",
    icon: CalendarCheck,
    color: "from-[#a1c4fd] to-[#c2e9fb]",
  },
  {
    title: "Seguimiento completo de pacientes",
    description: "Accedé a la información clínica y al historial con un solo click.",
    icon: FileText,
    color: "from-[#fbc2eb] to-[#a6c1ee]",
  },
  {
    title: "Recordatorios automáticos",
    description: "No pierdas nunca más una cita con notificaciones personalizadas.",
    icon: BellRing,
    color: "from-[#fddb92] to-[#d1fdff]",
  },
];

export default function Features() {
  return (
    <section
      className="max-w-screen-xl mx-auto px-6 py-24 sm:py-32"
      aria-label="Características principales"
    >
      <motion.h2
        className="text-4xl font-extrabold text-center mb-16 bg-gradient-to-r from-[#5a8bbd] to-[#3e5f93] text-transparent bg-clip-text"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        ¿Por qué elegir Medical Schedule?
      </motion.h2>

      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
        {features.map(({ title, description, icon: Icon, color }, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.2, ease: "easeOut" }}
          >
            <div
              className={`mb-6 p-4 rounded-full bg-gradient-to-br ${color} shadow-md`}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#3e5f93]">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
