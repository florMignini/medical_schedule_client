import axios from "axios";
import React from "react";
import { firstColumn } from "../data/testimonials";
import Image from "next/image";

const Testimonials = async() => {
  
  return (
    <section className="w-full bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF] py-24">
      <div className="container">
        <div className="w-full flex items-center mx-auto justify-center">
        <h1 className="text-center text-sm font-bold tracking-tighter px-2 py-1 rounded-xl bg-slate-400 border-gray-500 border-[1px] bg-opacity-20 text-gray-500">
          Testimonios
        </h1>
        </div>

        <h2 className="w-full flex items-center mx-auto justify-center text-5xl sm:text-6xl  xl:text-7xl font-bold bg-gradient-to-b from-gray-600 to-[#5a8bbd] text-transparent text-center bg-clip-text mt-5">
          Lo que dicen nuestros clientes
        </h2>

        <p className="w-[70%] mx-auto text-center text-sm leading-[20px] tracking-tight text-gray-500 py-5">
          Desde su intuitivo disenio hasta sus poderosas caracteristicas,
          nuestra aplicacion se ha transformado en una herramienta esencial para
          nuestros usuarios
        </p>
        <div>
            {firstColumn.map(({text, imgSrc, name, specialty})=> (
                <div className="bg-white max-w-xs w-full rounded-3xl shadow-[0_7px_14px_#EAEAEA] mx-auto px-2 py-3 border-[#222222]/10 h-auto mt-2"
                key={name}
                >
                    <p className="text-gray-400 text-[15px] ml-1 font-light">{text}</p>
                    <div className="flex items-center gap-2 mt-5">
                        <Image
                        src={imgSrc}
                        alt="user-image"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full"
                        />
                        <div className="flex flex-col">
                            <p className="ml-1 font-semibold">{name}</p>
                            <p className="text-gray-400 ml-1 font-light">{specialty}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
