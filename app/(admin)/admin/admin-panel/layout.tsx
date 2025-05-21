import AdminNavbar from "../components/AdminNavbar";
import AdminDashboard from "./page";


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
    <>
      <main className="bg-[#EBEBEB] w-full h-screen">
      <AdminNavbar/>
       {<AdminDashboard
       // eslint-disable-next-line react/no-children-prop
       children={children}
       />}
      </main>
    </>
  );
}
