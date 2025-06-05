import Image from "next/image";
import onlyIcon from "../../../public/assets/onlyIcon.png";
import Link from "next/link";
// icons imports
import LinkedIn from "@/app/(professional)/professional/components/icons/LinkedIn";
import NewTwitter from "@/app/(professional)/professional/components/icons/NewTwitter";
import Instagram from "@/app/(professional)/professional/components/icons/Instagram";
import GithubIcon from "@/app/(professional)/professional/components/icons/Github";
const Footer = () => {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-5 text-center">
      <div className="container">
        <div className="relative inline-flex before:w-full before:top-2 before:bottom-0 before:blur before:content-[''] before:bg-gradient-to-r before:from-gray-700 before:via-gray-500 before:to-gray-900 before:absolute" >
        <Image src={onlyIcon} alt="img-icon" height={25} 
        className="relative"
        />
        </div>
        <div className="flex justify-center gap-6 mt-6">
          <Link href="https://twitter.com/mariflor_la" target="_blank" rel="noopener noreferrer">
          <NewTwitter color="#ffffff" width={20} height={20}/>
          </Link>
          <Link href="https://www.instagram.com/laflorineta" target="_blank" rel="noopener noreferrer">
          <Instagram color="#ffffff" width={20} height={20}/>
          </Link>
          <Link href="https://www.linkedin.com/in/florencia-mignini/" target="_blank" rel="noopener noreferrer">
          <LinkedIn color="#ffffff" width={20} height={20}/>
          </Link>
          <Link href="https://github.com/florMignini" target="_blank" rel="noopener noreferrer">
          <GithubIcon color="#ffffff" width={20} height={20}/>
          </Link>
        </div>
        <p className="mt-6">
          © {new Date().getFullYear()} Medical_Schedule{" "}
          <small>a product of </small> CRM Solution. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
