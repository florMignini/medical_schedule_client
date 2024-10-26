import Image from "next/image";
import Logo from "../../public/assets/medical_schedule-logo.svg";
import Link from "next/link";

const LandingPage = () => {
  return (
    <header className="w-full h-[60px] border-b border-white/15 sticky top-0 backdrop-blur-lg">
      {/* header */}
      <div className="w-[90%] mx-auto py-2 px-5 flex items-center justify-between">
        <div className="w-[50%]">
          <Image
            src={Logo}
            alt="medical-schedule-logo"
            width={150}
            height={150}
          />
        </div>
        <div className="w-[50%] flex items-center justify-end gap-5">
          <Link
            href="/"
            className="border py-2 px-3 rounded-lg font-medium text-sm bg-gradient-to-b from-[#190d2e] to-[#4a208a] border-white/15 shadow-[0px_0px_3px_#8c45ff] text-white"
          >
            Soy Usuario
          </Link>
          <Link
            href="/"
            className="border py-2 px-3 rounded-lg font-medium text-sm bg-gradient-to-b from-[#190d2e] to-[#4a208a] border-white/15 shadow-[0px_0px_3px_#8c45ff] text-white"
          >
            Registrarme
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingPage;
