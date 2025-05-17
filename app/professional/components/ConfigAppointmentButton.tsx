"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { apiServer } from "@/api/api-server";
import { usePathname, useRouter } from "next/navigation";
import EditIcon from "./icons/EditIcon";
import { Dialog } from "@/components/ui/dialog";

import { useState } from "react";
import RescheduleAppointmentForm from "@/components/forms/RescheduleAppointmentForm";
import { useToast } from "@/hooks/use-toast";

const ConfigAppointmentButton = ({ id, component, appointment }: any) => {

  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  let path = pathname && pathname.split("/")[pathname.split("/").length - 1];
  const { toast } = useToast();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteAppointment = async (idOrAppointment: string | any) => {
    try {
      const appointmentId = typeof idOrAppointment === 'string' ? idOrAppointment : idOrAppointment._id;
      
      const { data } = await apiServer.delete(
        `https://medical-schedule-server.onrender.com/api/appointment/delete-appointment/${appointmentId}`
      );
      if (data) {
        toast({
          title: "Eliminando turno...",
          description: "El turno ha sido eliminado correctamente",
          className: "bg-red-500 text-black",
          duration: 5000,
        });
        router.push(`/professional/appointments`);
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting appointment", error);
      setDeleteError(`No se pudo eliminar el turno`);
    }
  };

  setTimeout(() => {
    setDeleteError(null);
  }, 5000);

  return (
    <Dialog>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-[40%] flex items-center justify-center bg-transparent gap-2 text-gray-400">
              <EditIcon width={20} height={20} />
              <p className="text-xs">Editar</p>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="backdrop-blur-lg bg-black/30 min-w-[170px] flex flex-col items-center justify-center rounded-lg shadow-md">
            <AlertDialogTrigger>
              <DropdownMenuItem className="w-[90%]">
                <button
                  className="text-sm flex items-center justify-start text-white"
                  onClick={() => setStatus("reschedule")}
                >
                  Reprogramar turno
                </button>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogTrigger>
              <DropdownMenuItem className="w-full mx-auto">
                <button
                  className="text-sm flex items-center justify-start text-red-400"
                  onClick={() => setStatus("delete")}
                >
                  Cancelar turno
                </button>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogOverlay className="bg-transparent backdrop-blur-[2px]">
          {status && (
            <AlertDialogContent className="bg-white/15 backdrop-blur-[5px] gap-5">
              <AlertDialogHeader className="w-[100%] gap-5 flex flex-col items-center justify-center">
                <AlertDialogTitle className="text-[24px] text-white font-semibold">
                  {status === "reschedule"
                    ? "Reprogramar turno"
                    : "Cancelar turno"}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[18px] font-light ">
                  {status === "reschedule" ? (
                    <RescheduleAppointmentForm 
                    appointment={appointment}
                    id={appointment.appointment.id || id} />
                  ) : (
                    <h2 className="text-red-500 font-bold">Ésta acción no se puede deshacer y eliminaría toda la
                      información relacionada al turno</h2>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              {status === "delete" ? (
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-black/15 text-light-200  outline-none">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-black/15 text-light-200"
                    onClick={() => deleteAppointment(appointment.appointment.id || id)}
                  >
                    Continuar
                  </AlertDialogAction>
                </AlertDialogFooter>
              ) : (
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-black/15 text-light-200  outline-none">
                    Cancelar
                  </AlertDialogCancel>
                </AlertDialogFooter>
              )}
            </AlertDialogContent>
          )}
        </AlertDialogOverlay>
      </AlertDialog>
    </Dialog>
  );
};

export default ConfigAppointmentButton;
