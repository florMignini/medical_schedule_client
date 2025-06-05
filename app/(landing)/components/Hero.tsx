import HeroBG from "@/public/assets/HeroBG.png";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="w-full py-[58px] sm:py-[42px] lg:py-16 bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF]">
      <div className="h-full flex items-center justify-left gap-2 max-[800px]:flex-col">
        <Image
          src={HeroBG}
          alt="hero-bg-image"
          className="w-[100%] min-[800px]:w-[60%] opacity-55 h-[100%] max-[800px]:h-[450px] min-[801px]:rounded-br-[80%] rounded-r-sm min-[801px]:rounded-tr-[25%] max-[800px]:rounded-br-[30%] max-[800px]:rounded-bl-[70%]"
        />
        <div className="max-w-[540px] h-full flex items-center">
          <div className="flex flex-col items-center px-3 sm:px-0 justify-center mx-auto gap-5">
            <div className="w-full flex flex-col items-center justify-start max-[430px]:text-lg text-2xl md:text-6xl xl:text-7xl font-semibold bg-gradient-to-b from-gray-600 to-[#5a8bbd] text-transparent text-start bg-clip-text">
              <h1 className="w-full text-4xl sm:text-5xl md:text-7xl">
                Medical
              </h1>
              <h1 className="w-full text-4xl sm:text-5xl md:text-7xl">
                Schedule
              </h1>
            </div>
            <p className="w-[90%] text-gray-500 text-sm md:text-base text-center font-medium lg:font-medium">
              Proveemos el mejor sistema de administración de pacientes - Seguí
              tus pacientes y actividades fácilmente desde donde estés
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
