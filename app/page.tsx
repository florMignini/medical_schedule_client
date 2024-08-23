import Image from "next/image";
import Logo from "../public/assets/medical_schedule-logo.svg"

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
          src={Logo}
          height={1000}
          width={1000}
          alt="medical_schedule_logo"
          className="mb-12 h-10 w-fit"
          />
          
        </div>
      </section>
    </div>
  );
}
