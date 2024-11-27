import HeroBG from "@/public/assets/HeroBG.jpg";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF]">
      <Image src={HeroBG} alt="hero-bg-image" className="opacity-55" />
      <div className="max-w-[540px]">
        <div className="absolute top-16 left-24 max-[490px]:w-[95%] max-[768px]:w-[95%] sm:w-[70%] flex flex-col items-start justify-center">
          <h1 className="absolute left-1 text-3xl xl:left-40 top-0 lg:left-36 xl:top-5 xl:text-5xl lg:text-4xl w-[90%] mx-auto font-semibold bg-gradient-to-b from-black to-[#001E80] text-transparent text-center bg-clip-text">
            Medical Schedule - Proveemos el mejor sistema de administración de
            pacientes
          </h1>
          <p className="absolute top-32 left-32 lg:left-96 lg:top-32 xl:top-56 text-base text-center font-normal lg:font-medium">
            Seguí tus pacientes y actividades facilmente desde donde estés
          </p>
        </div>
      </div>
    </section>
  );
};
export default Hero;
