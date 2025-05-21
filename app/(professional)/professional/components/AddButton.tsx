import Link from "next/link";
import React from "react";
import Plus from "./icons/Plus";

type btnData = {
    text?:string | undefined,
    to: string,
}
const AddButton = ( {text, to} : btnData) => {
  return (
    <Link
      href={to}
      className="transition duration-200 ease-in-out flex items-center justify-center gap-2.5 p-1 border-[1px] border-gray-600 rounded-md bg-gradient-to-b from-black to-[#807f7f] text-white text-center hover:bg-gradient-to-b hover:from-white hover:to-[#222222] hover:text-[#1c1c1c]"
    >
      <p className="text-[12px] md:text-[14px] font-medium">
        {text ? `agregar ${text}` : `agregar`}
      </p>
      <Plus width={15} height={15} />
    </Link>
  );
};

export default AddButton;
