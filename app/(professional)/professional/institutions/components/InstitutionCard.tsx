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
import { toast } from "@/hooks/use-toast";
import { deleteInstitution } from "../services/institutions";
import { motion } from "framer-motion";
import Image from "next/image";
import { ICreateInstitution } from "@/interfaces";

interface InstitutionCardProps {
  institution: ICreateInstitution; // reemplazá por tu tipo
  onEdit: () => void;
  onDelete: () => void;
  professionalId?: string;
}

export const InstitutionCard = ({
  institution,
  onEdit,
  onDelete,
  professionalId,
}: InstitutionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl bg-white/70 backdrop-blur-sm shadow-md p-6 transition-all hover:shadow-xl hover:scale-[1.02] group border border-zinc-200 space-y-3"
    >
      {/* Imagen de la institución o placeholder */}
      <div className="w-full h-40 relative rounded-xl overflow-hidden bg-zinc-100">
        <Image
          src={institution.institutionImage || "/images/default-institution.jpg"}
          alt={institution.name || "Institución"}
          layout="fill"
          objectFit="cover"
          className="transition-transform opacity-45 duration-300 group-hover:scale-105"
        />
      </div>

      {/* Contenido de la institución */}
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-zinc-800">
          {institution.name}
        </h3>
        <p className="text-sm text-zinc-500">{institution.address}</p>
        {institution.phone && (
          <p className="text-sm text-zinc-500">📞 {institution.phone}</p>
        )}
      </div>

      {/* Acciones */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil size={18} className="text-zinc-500 hover:text-zinc-800" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-glass-effect-vibrant backdrop-blur-lg border text-white border-zinc-200 shadow-lg p-6">
            <AlertDialogHeader className="font-mono text-xl font-bold ">¿Eliminar institución?</AlertDialogHeader>
            <p className="">Esta acción no se puede deshacer.</p>
            <AlertDialogFooter>
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
                      description: "institución eliminada exitosamente 🎉",
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
      </div>
    </motion.div>
  );
};
