import medicalScheduleLogo from "@/public/assets/medical_schedule-logo.svg";
import Image from "next/image";

const LogoTicker = () => {
  return (
    <section className="max-[490px]:py-5 max-[768px]:py-10  sm:py-12 bg-dark-300/30">
      <div className="container">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <div className="flex flex-none gap-14 ">
            {[
              medicalScheduleLogo,
              medicalScheduleLogo,
              medicalScheduleLogo,
              medicalScheduleLogo,
              medicalScheduleLogo,
              medicalScheduleLogo,
              medicalScheduleLogo,
              medicalScheduleLogo,
              medicalScheduleLogo,
              medicalScheduleLogo,
            ].map((logo) => (
              <Image
                src={logo.src}
                key={logo.src}
                alt="logo-image"
                height={150}
                width={150}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoTicker;
