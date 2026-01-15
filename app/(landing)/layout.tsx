"use client";

// import dynamic from "next/dynamic";

// const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
