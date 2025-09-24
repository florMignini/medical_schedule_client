"use client";
import Image from "next/image";
import LogoImage from "../../../public/assets/medical_schedule-transparent.png";
import WelcomeImage from "../../../public/assets/welcome.jpg";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";


export default function ForgotPasswordPage() {
  return (
    <div className="flex w-[100%] h-[100%]">
      {/* Left section */}
      <section className="h-screen w-[100%] my-auto md:w-[50%] text-black/50 px-2">
        <div className="sub-container max-w-[496px]">
          {/* Logo */}
          <Image
            src={LogoImage}
            height={1000}
            width={1000}
            alt="medical_schedule_logo"
            className="mb-12 h-8 w-fit"
          />

          {/* Forgot Password Form */}
          <ForgotPasswordForm />

          {/* Footer */}
          <div className="text-14-regular mt-5 flex flex-col gap-2 xl:text-left">
            <Link href="/login">
              <p>volver al login</p>
            </Link>
            <p>
              © {new Date().getFullYear()} Medical_Schedule{" "}
              <small>a product of </small> CRM Solution. All rights reserved.
            </p>
            <div className="w-[100%] flex gap-2 items-center justify-between">
              <Link
                href="https://github.com/florMignini"
                target="_blank"
                className="flex items-center justify-center gap-2"
              >
                <p>Contact us:</p>
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
        priority
      />
    </div>
  );
}
