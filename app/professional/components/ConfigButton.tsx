"use client"
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
import Image from "next/image";
import settingIcon from "@/public/assets/icons/settings.svg";
import Link from "next/link";
import { apiServer } from "@/api/api-server";

const ConfigButton = ({id}:any) => {
    const deleteInstitution = async(id:string) => {
        const {data} = await apiServer.delete(`/institutions/${id}`)
        console.log(data)
     }
  return (
    <AlertDialog>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="w-[100%] flex items-center justify-center  bg-transparent ">
                                    <Image
                                      src={settingIcon}
                                      alt="setting-icon"
                                      width={35}
                                      height={35}
                                      className="p-2 rounded-full hover:bg-gray-400/10"
                                    />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-52 mr-1 bg-black/70 ">
                                  <DropdownMenuItem className="w-[90%] mx-auto">
                                    <Link
                                      href="#"
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
                              <AlertDialogOverlay className="bg-transparent backdrop-blur-[2px]"
                              >
                                <AlertDialogContent className="AlertDialogContent gap-5">
                                  <AlertDialogHeader className="w-[100%] gap-5 flex flex-col items-center justify-center">
                                    <AlertDialogTitle className="text-[24px] font-semibold">
                                      Estás seguro de eliminar la institución?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-[18px] font-light ">
                                      Ésta acción no se puede deshacer y
                                      eliminaría toda la información relacionada
                                      a la institución
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-black/15 text-light-200  outline-none">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction className="bg-black/15 text-light-200"
                                    onClick={()=>deleteInstitution(id)}
                                    >
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialogOverlay>
                            </AlertDialog>
  )
}

export default ConfigButton