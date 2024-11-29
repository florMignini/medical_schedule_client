import Header from "@/app/introducing-medical-schedule/components/Header";
import Hero from "@/app/introducing-medical-schedule/components/Hero";
import LogoTicker from "@/app/introducing-medical-schedule/components/LogoTicker";
import ProductShowcase from "./components/ProductShowcase";
import Pricing from "./components/Footer";

const LandingPage = () => {
  return (
    <>
      <Header />
      <Hero />
      <LogoTicker />
      <ProductShowcase />
      <Pricing/>
    </>
  );
};

export default LandingPage;
