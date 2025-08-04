"use client";

import { motion } from "framer-motion";
import StatsCards from "./StatsCards";

type StatsCardsWrapperProps = {
  data: {
    label: string;
    value: number;
  }[];
};

export default function StatsCardsWrapper({ data }: StatsCardsWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <StatsCards data={data} />
    </motion.div>
  );
}
