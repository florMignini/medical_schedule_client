'use client'

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const loadingMessages = [
  "Conectando con pacientes",
  "Cargando instituciones médicas",
  "Sincronizando agenda profesional",
  "Actualizando registros clínicos",
];

const BRAND = {
  bg: "bg-white",
  card: "bg-white/80",
  border: "border-slate-200",

  c1: "rgba(45, 212, 191, 1)", // teal
  c2: "rgba(59, 130, 246, 1)", // blue
  c3: "rgba(16, 185, 129, 1)", // emerald

  textPrimary: "text-slate-900",
  textMuted: "text-slate-600",
  textMuted2: "text-slate-500",
};

export default function Loading() {
  const [messageIndex, setMessageIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const secondary = useMemo(
    () => "Estamos preparando tu agenda e información clínica…",
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const ring = `conic-gradient(from 180deg, ${BRAND.c1}, ${BRAND.c2}, ${BRAND.c3}, ${BRAND.c1})`;
  const shimmer = `linear-gradient(90deg, ${BRAND.c1}, ${BRAND.c2}, ${BRAND.c3})`;

  return (
    <section className={`relative flex min-h-screen items-center justify-center overflow-hidden ${BRAND.bg} px-4`}>
      {/* SOFT MEDICAL BACKDROP */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -bottom-48 -left-40 h-[520px] w-[520px] rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[460px] w-[460px] rounded-full bg-blue-200/35 blur-3xl" />
      </div>

      {/* CARD */}
      <div className={`relative w-full max-w-md rounded-3xl border ${BRAND.border} ${BRAND.card} p-8 shadow-xl backdrop-blur-sm`}>
        {/* HEADER BRAND */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* MS logo placeholder */}
            <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white">
              <div
                className="absolute inset-0 rounded-2xl opacity-70"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(45,212,191,.25), rgba(59,130,246,.18), rgba(16,185,129,.22))",
                }}
              />
              <span className="relative text-sm font-bold text-slate-800">
                MS
              </span>
            </div>

            <div className="leading-tight">
              <div className={`text-sm font-semibold ${BRAND.textPrimary}`}>
                Medical Schedule
              </div>
              <div className="text-xs text-slate-500">
                Gestión profesional de salud
              </div>
            </div>
          </div>

          <div className="h-2 w-16 rounded-full bg-slate-100" />
        </div>

        {/* LOADER */}
        <div className="flex items-center justify-center">
          <motion.div
            className="relative h-16 w-16"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 1.15, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full" style={{ background: ring }} />
            <div className="absolute inset-[5px] rounded-full bg-white" />
            <motion.div
              className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-700"
              animate={reduceMotion ? undefined : { scale: [1, 1.25, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* TEXT */}
        <div className="mt-7 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <span className="text-xs font-semibold text-slate-700">
              Cargando
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-500">módulos</span>
          </div>

          <div className="mt-4 min-h-[32px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-lg font-semibold"
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: shimmer }}
                >
                  {loadingMessages[messageIndex]}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <p className={`mt-4 text-sm ${BRAND.textMuted}`}>
            {secondary}
          </p>

          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full w-1/3 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${BRAND.c1}, ${BRAND.c2}, ${BRAND.c3})`,
              }}
              animate={reduceMotion ? undefined : { x: ["-120%", "240%"] }}
              transition={{ duration: 1.55, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="mt-4 text-xs text-slate-400">
            Sincronización segura de datos médicos
          </div>
        </div>
      </div>
    </section>
  );
}
