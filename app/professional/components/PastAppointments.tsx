"use client";
import { Patient } from "@/interfaces";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Icon from "@/components/ui/icon";
import calendarIcon from "../../../public/assets/icons/calendar.svg";
import notesIcon from "../../../public/assets/icons/notes.svg";
import fileIcon from "../../../public/assets/icons/fileAttachment.svg";
import dayjs from "dayjs";
const PastAppointments = (patientInfo: Patient) => {
  const [profInfo, setProfInfo] = useState<string | null>(null);
  const {pastAppointmentsIncluded, appointmentsIncluded} = patientInfo!
  useEffect(() => {
    const proffessionalInfo = JSON.parse(
      localStorage.getItem("infoProfSession")!
    );
    if (proffessionalInfo) {
      setProfInfo(proffessionalInfo);
    }
  }, []);
  console.log(appointmentsIncluded[0]?.appointment?.schedule);
  // console.log(profInfo)
  return (
    <section className="w-full h-auto flex flex-col items-center justify-start gap-3">
      <div className="w-[95%] h-auto flex flex-col items-start justify-start bg-dark-400 px-2 py-3 rounded-md">
        {/* title general */}
        <div className="flex items-center justify-start gap-2">
          <div className="h-5 border-x-2 border-white" />
          <h1>Citas Anteriores</h1>
        </div>
        {/* past appointments cards section */}
        <div className="w-[100%] flex items-center justify-start flex-wrap gap-12 pt-5">
          {/* past appointment card */}

          <Sheet>
            <SheetTrigger asChild>
              <button className="w-[250px] h-[100px] bg-dark-400/50 rounded-md px-4 py-3 flex flex-col items-center justify-center gap-2 text-dark-600 shadow-md shadow-dark-600 hover:scale-[1.01] hover:ease-in-out hover:transition-shadow">
                {/* date and hr */}
                <div className="w-[100%] flex flex-row items-center justify-start font-light text-xs gap-2">
                  <Icon
                    src={calendarIcon}
                    alt="calendar-icon"
                    width={20}
                    height={20}
                  />
                  <p>{dayjs(appointmentsIncluded[0]?.appointment?.schedule).format("DD MMMM  YYYY") } <strong className="text-white pl-2">|</strong> </p>
                  <p>{dayjs(appointmentsIncluded[0]?.appointment?.schedule).format("HH:mm A") }</p>
                </div>
                {/* treatment notes */}
                <div className="w-[100%] flex flex-row items-center justify-start font-light text-xs gap-2">
                  <Icon
                    src={notesIcon}
                    alt="notes-icon"
                    width={20}
                    height={20}
                  />
                  <p>{pastAppointmentsIncluded[0]?.pastAppointments.details}</p>
                </div>
                {/* file attachment */}
                <div className="w-[100%] flex flex-row items-center justify-start font-light text-xs gap-2">
                  <Icon
                    src={fileIcon}
                    alt="file-icon"
                    width={20}
                    height={20}
                  />
                  <p>{`Analisis Adjuntos ${pastAppointmentsIncluded[0]?.pastAppointments.patientAttachedFilesUrl === null ? `(0)` : `(pastAppointmentsIncluded[0]?.pastAppointments.patientAttachedFilesUrl?.length)`}`}</p>
                </div>
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {/* aca contenido detallado de la card */}
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  {/* <Button type="submit">Save changes</Button> */}
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};

export default PastAppointments;
