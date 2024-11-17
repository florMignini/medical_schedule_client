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
      href="/professional/institution-registration"
      className="flex items-center justify-center gap-2.5 p-2 border-[1px] border-gray-600 rounded-full bg-gradient-to-b from-black to-[#807f7f] text-white text-center hover:bg-gradient-to-b hover:from-white hover:to-[#222222]"
    >
      <p className="text-[14px] font-medium">
        {text ? `agregar ${text}` : `agregar`}
      </p>
      <Plus width={20} height={20} />
    </Link>
  );
};

export default AddButton;
