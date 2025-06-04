import Image from "next/image";
import onlyIcon from "../../../public/assets/onlyIcon.png";
import Link from "next/link";
// icons imports
import XIcon from "../../../public/assets/icons/newTwitter.svg";
import InstaIcon from "../../../public/assets/icons/instagram.svg";
import LinkedInIcon from "../../../public/assets/icons/linkedin.svg";
import GithubIcon from "../../../public/assets/icons/github.svg";
const Footer = () => {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-5 text-center">
      <div className="container">
        <div className="relative inline-flex before:w-full before:top-2 before:bottom-0 before:blur before:content-[''] before:bg-gradient-to-r before:from-gray-700 before:via-gray-500 before:to-gray-900 before:absolute" >
        <Image src={onlyIcon} alt="img-icon" height={25} 
        className="relative"
        />
        </div>
        <nav className="flex flex-col md:flex-row md:justify-center gap-3 mt-6">
          <Link href="#" >About</Link>
          <Link href="#" >Features</Link>
          <Link href="#" >Testimonials</Link>
        </nav>
        <div className="flex justify-center gap-6 mt-6">
          <Link href="https://twitter.com/mariflor_la" target="_blank" rel="noopener noreferrer">
          <Image src={XIcon} alt="social-media-icon" />
          </Link>
          <Link href="https://www.instagram.com/laflorineta" target="_blank" rel="noopener noreferrer">
          <Image src={InstaIcon} alt="social-media-icon" />
          </Link>
          <Link href="https://www.linkedin.com/in/florencia-mignini/" target="_blank" rel="noopener noreferrer">
          <Image src={LinkedInIcon} alt="social-media-icon" />
          </Link>
          <Link href="https://github.com/florMignini">
          <Image src={GithubIcon} alt="social-media-icon" />
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
