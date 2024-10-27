import Image from "next/image";
import Logo from "../../public/assets/medical_schedule-logo.svg";
import Link from "next/link";
import Header from "@/app/introducing-medical-schedule/components/Header";
import Hero from "@/app/introducing-medical-schedule/components/Hero";

const LandingPage = () => {
    return (
        <>
            <Header/>
            <Hero/>
        </>
    );
};

export default LandingPage;
