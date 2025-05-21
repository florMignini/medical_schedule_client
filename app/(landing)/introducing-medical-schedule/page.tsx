import Header from "@/app/(landing)/components/Header";
import Hero from "@/app/(landing)/components/Hero";
import LogoTicker from "@/app/(landing)/components/LogoTicker";
import ProductShowcase from "../components/ProductShowcase";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";



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
