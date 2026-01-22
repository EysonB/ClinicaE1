import { Outlet } from "react-router-dom";
import NavButtons from "./NavButtons"; // o BackButton

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegación fija arriba */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <NavButtons />
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}