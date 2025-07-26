import { motion } from "framer-motion";
import Image from "next/image";
import { Patient } from "@/interfaces";
import Link from "next/link";
import { Mail, Pencil, Phone, Trash2 } from "lucide-react";
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
interface PatientCardProps {
  patient: Patient;
  onEdit: () => void;
  onDelete: () => void;
  professionalId?: string;
}

const PatientCard = ({
  patient,
  onEdit,
  onDelete,
  professionalId,
}: PatientCardProps) => {
  return (
    <motion.div
      key={patient.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="group flex items-center justify-between rounded-md border p-2 hover:shadow-md transition-shadow"
    >
      <Link
        href={`/professional/patients/${patient.id}/info`}
        className="flex items-center justify-center gap-2 w-full"
      >
        <Image
          src={patient.patientPhotoUrl}
          alt={patient.email || "Foto de paciente"}
          objectFit="cover"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        {/* patient content */}
        <div className="flex-1 flex items-center gap-2 justify-center sm:justify-start">
          <p className="text-sm font-medium truncate">{`${patient.firstName} ${patient.lastName}`}</p>
          <div className="text-xs text-muted-foreground flex gap-3">
            <div
              className="md:w-[33%] max-[690px]:w-[50%] px-1 py-2"
              key={patient.phone}
            >
              <div className="text-[14px] font-normal flex gap-1 items-center justify-end">
                <Phone width={20} height={20} />
                <p className="truncate">{patient.phone}</p>
              </div>
            </div>
            <div
              className="max-[690px]:hidden md:w-[33%] px-1 py-2"
              key={patient.email}
            >
              <div className="text-[14px] font-normal flex gap-1 items-center justify-end">
                <Mail width={20} height={20} />
                <p className="truncate">{patient.email}</p>
              </div>
            </div>
            <div
              className="max-[690px]:hidden md:w-[33%] px-1 py-2"
              key={patient.address}
            >
              <div className="text-[14px] font-normal">{patient.address}</div>
            </div>
          </div>
        </div>
      </Link>
      {/* Acciones */}
      <div className="absolute p-1 top-[15%] right-1 items-center justify-center flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
            <AlertDialogHeader className="font-mono text-xl font-bold ">¿Eliminar paciente?</AlertDialogHeader>
            <p className="">Esta acción no se puede deshacer.</p>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={async () => {
                  try {
                    const ids = {
                      institutionId: patient.id,
                      professionalId,
                    };
                    // await deleteInstitution(ids);
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

export default PatientCard;
