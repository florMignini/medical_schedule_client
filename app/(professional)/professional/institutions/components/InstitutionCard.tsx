"use client";

import { Pencil, Trash2 } from "lucide-react";
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { deleteInstitution } from "../services/institutions";
import { motion } from "framer-motion";
import Image from "next/image";
import { ICreateInstitution } from "@/interfaces";
import Link from "next/link";

interface InstitutionCardProps {
  institution: ICreateInstitution;
  onEdit: () => void;
  onDelete: () => void;
  professionalId?: string;
  isDemo?: boolean;
}

export const InstitutionCard = ({
  institution,
  onEdit,
  onDelete,
  professionalId,
  isDemo = false,
}: InstitutionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl bg-white/70 dark:bg-zinc-800/80 backdrop-blur-sm shadow-md p-3 transition-all hover:shadow-xl hover:scale-[1.02] group border border-zinc-200 dark:border-zinc-700"
    >
      {/* Acciones arriba a la derecha */}
      <AlertDialog>
        <TooltipProvider>
          <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onEdit}>
                  <Pencil
                    size={18}
                    className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-white"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white rounded px-2 py-1 text-xs">
                Editar institución
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2
                      size={18}
                      className="text-red-500 hover:text-red-700"
                    />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white rounded px-2 py-1 text-xs">
                Eliminar institución
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </AlertDialog>

      {/* Imagen */}
      <div className="relative w-full h-[300px] rounded-2xl overflow-hidden shadow-lg bg-gray-200">
        <Image
          src={institution.institutionImage}
          alt={`${institution.name} imagen`}
          width={800}
          height={600}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          priority
        />

        {/* Gradiente encima de la imagen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Título encima de todo */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white truncate drop-shadow-md">
            {institution.name || "Sin nombre"}
          </h1>
        </div>
      </div>

      {/* Contenido */}
      <Link
        className="mt-1 space-y-1"
        href={`/professional/institutions/${institution.id}`}
      >
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-white truncate">
          {institution.name || "Sin nombre"}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
          {institution.address || "Sin dirección"}
        </p>
        {institution.phone && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
            📞 {institution.phone}
          </p>
        )}
      </Link>

      {/* Confirmación de borrado */}
      <AlertDialog>
        <AlertDialogContent className="bg-white dark:bg-zinc-900 border text-zinc-900 dark:text-white shadow-lg rounded-xl p-6">
          <AlertDialogHeader className="font-mono text-xl font-bold">
            ¿Eliminar institución?
          </AlertDialogHeader>
          <p>Esta acción no se puede deshacer.</p>
          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={async () => {
                try {
                  const ids = {
                    institutionId: institution.id,
                    professionalId,
                  };
                  await deleteInstitution(ids);
                  toast({
                    title: "Eliminando institución...",
                    description: "Institución eliminada exitosamente 🎉",
                    className: "bg-emerald-500 text-black",
                    duration: 3000,
                  });
                  onDelete();
                } catch (err) {
                  toast({
                    title: "Eliminando institución...",
                    description: "Error al eliminar institución",
                    className: "bg-red-500 text-black",
                    duration: 3000,
                  });
                  console.error(err);
                }
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};
