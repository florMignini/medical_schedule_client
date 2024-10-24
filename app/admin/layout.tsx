import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/assets/medical_schedule-logo.svg";
const links = [
  { name: "accordion", href: "accordion" },
  { name: "alert", href: "alert" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="bg-dark-300 border-b border-white shadow-md shadow-dark-700 h-20 z-30 w-full">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <div className="pl-2 flex flex-col items-center justify-center">
                <Image
                  src={Logo}
                  alt="Medical_Schedule_logo"
                  width={180}
                  height={180}
                />
              </div>
            </div>
        
              {/* Admin Welcome */}
              <div className=" text-white p-2 w-[50%] h-12 flex items-center justify-center">
                <p className="w-[90%] flex flex-row items-center justify-center font-bold text-xl">Welcome Admin</p>
              </div>
          
          </div>
        </div>
      </nav>
      <main className="bg-dark-400 w-full h-auto shadow rounded-lg p-2 sm:p-6 xl:p-8">
        {children}
      </main>
    </>
  );
}
