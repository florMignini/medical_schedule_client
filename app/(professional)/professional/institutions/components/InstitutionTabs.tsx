"use client";
import clsx from "clsx";
import { ClipboardList, CalendarClock } from "lucide-react";


type Section = "Detalles de la institución" | "Oficinas/Consultorios";

interface Props {
  current: Section;
  onChange: (section: Section) => void;
}

export function InstitutionTabs({ current, onChange }: Props) {
  const options: { name: Section; icon: JSX.Element }[] = [
      {
        name: "Detalles de la institución",
        icon: <ClipboardList className="w-4 h-4" />,
      },
      {
        name: "Oficinas/Consultorios",
        icon: <CalendarClock className="w-4 h-4" />,
      }
    ];
  return (
   <div className="sticky top-[60px] z-20 bg-white w-full flex items-center justify-start px-3 gap-2 overflow-x-auto py-2 border-b">
         {options.map((item) => (
           <button
             key={item.name}
             onClick={() => onChange(item.name)}
             className={clsx(
               "flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all whitespace-nowrap",
               current === item.name
                 ? "bg-emerald-100 text-emerald-700 font-semibold"
                 : "text-gray-500 hover:bg-gray-100"
             )}
           >
             {item.icon}
             {item.name}
           </button>
         ))}
       </div>
  );
}
