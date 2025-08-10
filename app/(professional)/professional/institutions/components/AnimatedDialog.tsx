"use client";

import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // opcional
import { ReactNode } from "react";

interface AnimatedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function AnimatedDialog({
  open,
  onOpenChange,
  children,
}: AnimatedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <DialogContent
          className={cn(
            "bg-white/50 glass-effect-vibrant backdrop-blur-lg w-full lg:w-[80%] max-w-[1500px] max-h-[90vh] overflow-auto p-0 rounded-2xl z-50"
          )}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="p-6"
          >
            {children}
          </motion.div>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
