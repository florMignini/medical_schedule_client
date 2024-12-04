import Header from "@/app/introducing-medical-schedule/components/Header";
import Hero from "@/app/introducing-medical-schedule/components/Hero";
import LogoTicker from "@/app/introducing-medical-schedule/components/LogoTicker";
import ProductShowcase from "./components/ProductShowcase";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";
import axios from "axios";


const LandingPage = async() => {
 

  return (
    <>
      <Header />
      <Hero />
      <LogoTicker />
      <ProductShowcase />
      <Testimonials/>
      <Footer/>
    </>
  );
};

export default LandingPage;
