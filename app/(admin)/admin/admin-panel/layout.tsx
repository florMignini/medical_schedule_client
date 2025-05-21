import AdminNavbar from "../components/AdminNavbar";

const links = [
  { name: "accordion", href: "accordion" },
  { name: "alert", href: "alert" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#EBEBEB] w-full h-screen">
      <AdminNavbar />
      <section className="flex flex-col items-center justify-center mx-auto">
        {children}
      </section>
    </div>
  );
}
