"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Configuration from "./icons/Configuration";

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

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { apiServer } from "@/api/api-server";

type Props = {
  id: string;
  component: string;
  isDemo?: boolean;
  onEdit?: () => void;
};

const ConfigButton = ({ id, component, isDemo, onEdit }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [storedValue, setStoredValue] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const data = localStorage.getItem("infoProfSession");
    if (data) {
      setStoredValue(JSON.parse(data));
    }
  }, []);

  const deleteComponent = async (id: string) => {
    if (component === "patients") {
      if (isDemo) {
        toast({
          title: "Modo demo",
          description: "No se puede eliminar pacientes en modo demo.",
          className: "bg-red-500 text-white",
        });
        return;
      }

      try {
        const res = await apiServer.delete(`/patients/delete/${id}`);
        if (res.status === 200) {
          router.push(`/professional/patients/${storedValue?.id}`);
        }
      } catch (error: any) {
        console.log(error.response);
      }
    }
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-center bg-transparent text-color"
          >
            <Configuration width={20} height={20} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-black/70">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault(); // evita que se cierre el menú
              onEdit?.();
            }}
          >
            Editar
          </DropdownMenuItem>

          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-red-400">
              Eliminar
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogOverlay className="bg-transparent backdrop-blur-[2px]">
        <AlertDialogContent className="AlertDialogContent gap-5">
          <AlertDialogHeader className="flex flex-col items-center justify-center gap-5">
            <AlertDialogTitle className="text-xl font-semibold text-center">
              {component === "institution"
                ? "¿Estás seguro de eliminar la institución?"
                : "¿Estás seguro de eliminar el paciente?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-md text-center">
              {`Ésta acción no se puede deshacer y eliminaría toda la información relacionada a${
                component === "institution" ? " la institución" : " el paciente"
              }.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-black/15 text-light-200 outline-none">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-black/15 text-light-200"
              onClick={() => deleteComponent(id)}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ConfigButton;
