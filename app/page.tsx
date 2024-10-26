import Image from "next/image";
import LogoImage from "../public/assets/medical_schedule-logo.svg";
import WelcomeImage from "../public/assets/welcome.jpg";
import { FaGithub } from "react-icons/fa";
import ProfessionalLoginForm from "@/components/forms/ProfessionalLoginForm";
import Link from "next/link";
import PasskeyModal from "./professional/components/PasskeyModal";

export default function Home({ searchParams }: any) {
  
  const isAdmin = searchParams?.admin === "true";
  
  return (
    <div className="flex w-[100%] h-[100%]">
      {/* If admin Session */}
      {isAdmin && <PasskeyModal />}
      {/* Left section */}
      <section className="h-screen w-[100%] my-auto md:w-[50%] text-white px-2">
        {/* Logo */}
        <div className="sub-container max-w-[496px]">
          <Image
            src={LogoImage}
            height={1000}
            width={1000}
            alt="medical_schedule_logo"
            className="mb-12 h-8 w-fit"
          />
          {/* login form */}
          <ProfessionalLoginForm />
          {/* Copyright */}
          <div className="text-14-regular mt-5 flex flex-col gap-2 xl:text-left">
            <p>
              © {new Date().getFullYear()} Medical_Schedule <small>a product of </small> CRM Solution. All rights
              reserved.
            </p>
            <div className="w-[100%] flex gap-2 items-center justify-between">
              <Link href="https://github.com/florMignini" target="_blank"
              className="flex items-center justify-center gap-2"
              >
              <p>Contact us:</p>
                <FaGithub className="flex mb-1 h-6 w-fit" />
              </Link>
              <Link className="w-[20%] h-auto flex items-center justify-center px-2 py-1 border-none bg-black/30 rounded-lg "
              href="/?admin=true"
              >
                <p className="text-white font-semibold">Admin</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Right section */}
      <Image
        unoptimized
        src={WelcomeImage}
        height={1000}
        width={1000}
        alt="welcome-page-image"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
