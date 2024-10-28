import HeroBG from "@/public/assets/HeroBG.jpg"

const Hero = () => {
    return(
        <section className="z-20 max-[490px]:h-[492px] max-[768px]:h-[600px] sm:h-screen w-full relative top-1/2 flex items-center" style={{
            backgroundImage: `url(${HeroBG.src})`,
            backgroundRepeat:"no-repeat",
            backgroundPosition: "center",
            backgroundAttachment:"unset",
            backgroundSize:"cover",
            opacity:"80%"
        }}>
            <div className="relative max-[490px]:w-[95%] max-[768px]:w-[90%] h-full sm:w-[70%] flex flex-col items-start justify-center">
                <h1 className="absolute h-auto py-2 px-1 top-8 sm:top-12 max-[490px]:text-[20px] max-[768px]:text-[30px] max-[490px]:ml-0 max-[768px]:ml-7 sm:text-5xl sm:mx-auto font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent text-center sm:text-end bg-clip-text sm:leading-normal">Medical Schedule - Proveemos el mejor sistema de administración de pacientes</h1>
                <p className="text-center font-light max-[490px]:top-[10rem] max-[768px]:top-[12rem] sm:top-[15rem] h-auto py-2 absolute max-[490px]:text-[14px] max-[768px]:text-[16px] sm:text-xl text-[#010D3E] tracking-tight left-[30%]">
                    Seguí tus pacientes y actividades facilmente desde donde estés
                </p>
            </div>
        </section>
    )
}
export default Hero;