import Image from "next/image";
import LogoImage from "../public/assets/medical_schedule-logo.svg";
import WelcomeImage from "../public/assets/welcome.jpg";
import { FaGithub } from "react-icons/fa";
import ProfessionalLoginForm from "@/components/forms/ProfessionalLoginForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      {/* Left section */}
      <section className="remove-scrollbar container my-auto text-white">
        {/* Logo */}
        <div className="sub-container max-w-[496px]">
          <Image
            src={LogoImage}
            height={1000}
            width={1000}
            alt="medical_schedule_logo"
            className="mb-12 h-10 w-fit"
          />
          {/* login form */}
          <ProfessionalLoginForm />
          {/* Copyright */}
          <div className="text-14-regular mt-10 flex flex-col gap-2 xl:text-left">
            <p>
              © {new Date().getFullYear()} Medical_Schedule. All rights
              reserved.
            </p>
            <div className="flex gap-2 items-center justify-start">
              <p>Contact us:</p>
              <Link href="https://github.com/florMignini" target="_blank">
                <FaGithub className="flex mb-1 h-6 w-fit" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Right section */}
      <Image
      src={WelcomeImage}
      height={1000}
      width={1000}
      alt="welcome-page-image"
      className="side-img max-w-[50%]"
      />
    </div>
  );
}
