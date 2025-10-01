'use client'

import { motion } from "framer-motion";

export default function LayoutLoading() {
 
  return (
    <motion.section
      className="flex flex-col items-center justify-center min-h-screen text-black font-mono px-4"
      initial={{ backgroundColor: "#ffffff" }}
      animate={{ backgroundColor: ["#ffffff", "#e0e0e0", "#ffffff"] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
     
    </motion.section>
  );
}
