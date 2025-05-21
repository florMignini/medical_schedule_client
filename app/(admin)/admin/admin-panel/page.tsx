import AdminNavbar from "../components/AdminNavbar";



const AdminDashboard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  
  return (
    <section className="w-full flex flex-col items-center justify-center mx-auto">
      <main className="bg-[#EBEBEB] w-full h-screen">
        {children}
      </main>
    </section>
  );
};

export default AdminDashboard;
