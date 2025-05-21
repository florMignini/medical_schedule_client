export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="es">
        <body className="bg-white text-gray-900 font-sans">
          {/* Podés agregar <Navbar /> o <Header /> acá si lo necesitás */}
          {children}
          {/* <Footer /> si querés también */}
        </body>
      </html>
    );
  }
  