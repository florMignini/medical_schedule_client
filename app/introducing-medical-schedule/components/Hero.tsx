import HeroBG from "@/public/assets/HeroBG.jpg"

const Hero = () => {
    return(
        <section className="max-[490px]:h-[492px] max-[768px]:h-[600px] sm:h-screen w-full relative top-1/2 flex items-center" style={{
            backgroundImage: `url(${HeroBG.src})`,
            backgroundRepeat:"no-repeat",
            backgroundPosition: "center",
            backgroundAttachment:"unset",
            backgroundSize:"cover"
        }}>
            <div className="w-[80%] sm:w-[90%] max-[490px]:min-h-[calc(100vh-150px)] max-[768px]:min-h-[calc(100vh-220px)] sm:min-h-[calc(100vh-220px)] flex items-start justify-center">
                <h1 className=" max-[490px]:text-[1rem] max-[768px]:text-[1.5rem] max-[768px]:ml-7 sm:text-4xl sm:mx-auto font-extrabold text-[#4a208a]/80 text-center italic stroke-1">Providing Best Medical Schedule Management System</h1>
            </div>
        </section>
    )
}
export default Hero;