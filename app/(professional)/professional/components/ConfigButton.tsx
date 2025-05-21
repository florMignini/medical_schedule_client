"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiServer } from "@/api/api-server";
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



const ConfigButton = ({ id, component }: any) => {
  const pathname = usePathname();
  const router = useRouter();
  let path = pathname && pathname.split("/")[pathname.split("/").length - 1];
  const [storedValue, setStoredValue ] = useState<any>(null);

  useEffect(() => {
    let data = localStorage.getItem("infoProfSession");
    if (data) {
      setStoredValue(JSON.parse(data));
    }
  }, []);
  

  const deleteComponent = async (id: string) => {
    if(component === "patients"){
      try {
        const res = await apiServer.delete(`/patients/delete/${id}`);
        console.log(res);
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
          <button className="w-[100%] flex items-center justify-center  bg-transparent text-color">
            <Configuration width={20} height={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/70">
          <DropdownMenuItem className="">
            <Link
              href={`/professional/${component}/${id}/update`}
              className="text-[16px] flex items-center justify-start text-white"
            >
              Editar
            </Link>
          </DropdownMenuItem>
          <AlertDialogTrigger>
            <DropdownMenuItem className="w-[90%] mx-auto">
              <button className="text-[16px] flex items-center justify-start text-red-400">
                Eliminar
              </button>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogOverlay className="bg-transparent backdrop-blur-[2px]">
        <AlertDialogContent className="AlertDialogContent gap-5">
          <AlertDialogHeader className="w-[100%] gap-5 flex flex-col items-center justify-center">
            <AlertDialogTitle className="text-[24px] font-semibold">
              {
                component === "institution"
                  ? "¿Estás seguro de eliminar la institución?"
                  : "¿Estás seguro de eliminar el paciente?"
              }
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[18px] font-light ">
              {
                `Ésta acción no se puede deshacer y eliminaría toda la información
              relacionada a${component === "institution" ? " la institución" : "l paciente"}`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-black/15 text-light-200  outline-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-black/15 text-light-200"
              onClick={() => deleteComponent(id)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ConfigButton;
