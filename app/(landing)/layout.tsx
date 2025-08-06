"use client"; // Porque usamos dynamic import y hooks en Header/Footer

import dynamic from "next/dynamic";

const Header = dynamic(() => import("./components/Header"), { ssr: false });
// const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
