"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import dashboardImg from "@/public/assets/productImage.png";

export default function Preview() {
  return (
    <section
      className="w-full bg-[#f4f7ff] py-24 sm:py-32 px-6 sm:px-12"
      aria-label="Vista previa del sistema"
    >
      <div className="max-w-screen-xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">
        {/* Texto */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-[#3e5f93]">
            Visualizá todo desde un solo lugar
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Accedé al panel de control con pacientes, turnos, estadísticas y más, todo en una interfaz moderna, intuitiva y segura.
          </p>
          <p className="text-gray-500 text-base">
            Ideal para profesionales que buscan eficiencia y claridad en su día a día.
          </p>
        </motion.div>

        {/* Imagen */}
        <motion.div
          className="flex-1 w-full max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="overflow-hidden rounded-2xl shadow-2xl border border-gray-200">
            <Image
              src={dashboardImg}
              alt="Vista previa del dashboard de Medical Schedule"
              className="w-full h-auto object-cover"
              placeholder="blur"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
