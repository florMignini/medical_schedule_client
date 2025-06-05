"use client"
import {motion} from "framer-motion"
import { firstColumn, secondColumn, thirdColumn } from "../data/testimonials";
import TestimonialsColumn from "./TestimonialsColumn";

const Testimonials = () => {

  return (
    <section className="bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF] py-16 ">
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
          Desde su intuitivo diseño hasta sus poderosas caracteristicas,
          nuestra aplicación se ha transformado en una herramienta esencial para
          nuestros usuarios
        </p>
       <div className="h-[500px] flex justify-center [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] overflow-y-hidden gap-6 mt-10">
       <TestimonialsColumn testimonials={firstColumn}/>
       <TestimonialsColumn testimonials={secondColumn} className="hidden md:block"/>
       <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block"/>
       </div>
      </div>
    </section>
  );
};

export default Testimonials;
