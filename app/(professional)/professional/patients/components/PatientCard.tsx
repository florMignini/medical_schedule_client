"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Patient } from "@/interfaces";
import { HouseIcon, Mail, Pencil, Phone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { deletePatient } from "../../../../actions/patientAction";
import Link from "next/link";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PatientCardProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onDelete: () => void;
  professionalId?: string;
  isDemo?: boolean;
}

const PatientCard = ({
  patient,
  onEdit,
  onDelete,
  professionalId,
  isDemo = false,
}: PatientCardProps) => {
  return (
    <motion.div
      key={patient.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.98 }}
      className="group relative rounded-2xl px-3 py-4 shadow-md hover:shadow-xl transition-all bg-gradient-to-r from-white/80 to-zinc-100/80 dark:from-zinc-800/80 dark:to-zinc-900/80 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-1 hover:bg-zinc-400"
    >
      {/* Acciones arriba a la derecha */}
      <TooltipProvider>
        <div className="absolute top-0 right-2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  onEdit(patient);
                }}
              >
                <Pencil
                  size={18}
                  className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-white"
                />
              </Button>
            </TooltipTrigger>
          </Tooltip>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 size={18} className="text-red-500 hover:text-red-700" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-zinc-900 border text-zinc-900 dark:text-white shadow-lg rounded-xl p-6">
              <AlertDialogHeader className="font-semibold text-xl">
                ¿Eliminar paciente?
              </AlertDialogHeader>
              <p>Esta acción no se puede deshacer.</p>
              <AlertDialogFooter className="pt-4">
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={async () => {
                    try {
                      const result = await deletePatient({
                        patientId: patient.id,
                        professionalId,
                      });
                      toast({
                        title: "Eliminando paciente...",
                        description: `${result.message} 🎉`,
                        className: "bg-emerald-500 text-black",
                        duration: 3000,
                      });
                      onDelete();
                    } catch (err) {
                      toast({
                        title: "Error",
                        description: `❌ ${(err as Error).message}`,
                        className: "bg-red-500 text-black",
                        duration: 3000,
                      });
                    }
                  }}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TooltipProvider>
      {/* Info principal */}
      <Link
        href={`/professional/patients/${patient.id}`}
        className="flex items-center justify-start gap-4 md:w-[30%] z-10"
      >
        <Image
          src={patient.patientPhotoUrl}
          alt={patient.email || "Foto de paciente"}
          width={48}
          height={48}
          className="rounded-full object-cover border border-zinc-300 shadow-sm"
        />
        <div>
          <p className="text-base font-semibold leading-tight truncate">
            {patient.firstName} {patient.lastName}
            {isDemo && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600">
                Demo
              </span>
            )}
          </p>
          {patient.address && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <HouseIcon size={16} />
              <p className="truncate">{patient.address}</p>
            </div>
          )}
        </div>
      </Link>

      {/* Teléfono y email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 text-sm text-muted-foreground w-full md:w-[50%] md:justify-start md:px-4">
        <div className="flex items-center gap-2">
          <Phone size={16} />
          <span className="truncate">{patient.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={16} />
          <span className="truncate">{patient.email}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientCard;
