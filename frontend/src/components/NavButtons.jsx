import { Link, useNavigate } from "react-router-dom";
import { logout } from "../servicios/authApi";

export default function NavButtons() {
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    if (window.confirm("¿Desea cerrar sesión?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg mb-4">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* IZQUIERDA */}
        <div className="flex gap-5 items-center">
          <Link to="/" className="text-xl font-bold">
            🏥 Sistema Clínico
          </Link>

          {userRole === "superadmin" && (
            <>
              <Link to="/pacientes">Pacientes</Link>
              <Link to="/medicos">Médicos</Link>
              <Link to="/citas">Citas</Link>
              <Link to="/atenciones">Atenciones</Link>
              <Link to="/facturacion/pendientes">Pendientes</Link>
              <Link to="/facturas">Facturas</Link>
              <Link to="/usuarios">👥 Usuarios</Link>
            </>
          )}

          {userRole === "enfermera" && (
            <>
              <Link to="/pacientes">Pacientes</Link>
              <Link to="/medicos">Médicos</Link>
              <Link to="/citas">Citas</Link>
              <Link to="/atenciones">Atenciones</Link>
            </>
          )}

          {userRole === "medico" && (
            <>
              <Link to="/citas">Mis Citas</Link>
              <Link to="/atenciones">Mis Atenciones</Link>
            </>
          )}
        </div>

        {/* DERECHA */}
        <div className="flex gap-4 items-center">
          <span className="text-sm">
            {userName} {userRole === "superadmin" && "👑"}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
