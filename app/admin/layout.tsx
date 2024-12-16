import AdminNavbar from "./components/AdminNavbar";

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
      <AdminNavbar/>
      <main className="bg-[#EBEBEB] w-full h-screen">
        {children}
      </main>
    </>
  );
}
