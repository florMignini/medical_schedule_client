import dynamic from "next/dynamic";
const Header = dynamic(() => import("../components/Header"), { ssr: false });

const LandingClient = dynamic(() => import("../components/LandingClient"), {
  ssr: false,
});

export default function LandingPage() {
  return(
    <div className="flex flex-col min-h-screen">
      <Header />
     <LandingClient />;
    </div>
    );
}
