import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UsuariosList from "./vistas/usuarios/UsuariosList";
import UsuarioForm from "./vistas/usuarios/UsuarioForm";


import Layout from "./components/Layout";
import Login from "./vistas/auth/Login";

// HOME
import Home from "./vistas/Home";

// MEDICOS
import MedicosList from "./vistas/medicos/MedicosList";
import MedicoForm from "./vistas/medicos/MedicoForm";

// PACIENTES
import PacienteList from "./vistas/pacientes/PacientesList";
import PacienteForm from "./vistas/pacientes/PacienteForm";

// CITAS
import CitaForm from "./vistas/citas/CitaForm";
import CitasList from "./vistas/citas/CitasList";
import CitaDetail from "./vistas/citas/CitaDetail";

// ATENCIONES
import AtencionesList from "./vistas/atenciones/AtencionesList";
import AtencionForm from "./vistas/atenciones/AtencionForm";
import AtencionDetail from "./vistas/atenciones/AtencionDetail";

// FACTURAS
import FacturasList from "./vistas/facturas/FacturasList";
import FacturaForm from "./vistas/facturas/FacturaForm";
import FacturaDetail from "./vistas/facturas/FacturaDetail";

// FACTURACIÓN
import PendientesCobro from "./vistas/facturacion/PendientesCobro";

// 🔐 FUERA del componente App
const isAuthenticated = () => {
  return !!localStorage.getItem("userId");
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />

          <Route path="/medicos" element={<MedicosList />} />
          <Route path="/medicos/nuevo" element={<MedicoForm />} />
          <Route path="/medicos/editar/:id" element={<MedicoForm />} />

          <Route path="/pacientes" element={<PacienteList />} />
          <Route path="/pacientes/crear" element={<PacienteForm />} />
          <Route path="/pacientes/editar/:id" element={<PacienteForm />} />

          <Route path="/citas" element={<CitasList />} />
          <Route path="/citas/nueva" element={<CitaForm />} />
          <Route path="/citas/editar/:id" element={<CitaForm />} />
          <Route path="/citas/:id" element={<CitaDetail />} />

          <Route path="/atenciones" element={<AtencionesList />} />
          <Route path="/atenciones/nueva/:citaId" element={<AtencionForm />} />
          <Route path="/atenciones/:id" element={<AtencionDetail />} />

          <Route path="/facturas" element={<FacturasList />} />
          <Route path="/facturas/nueva/:atencionId" element={<FacturaForm />} />
          <Route path="/facturas/:id" element={<FacturaDetail />} />

          <Route path="/facturacion/pendientes" element={<PendientesCobro />} />

          <Route path="/usuarios" element={<UsuariosList />} />
          <Route path="/usuarios/nuevo" element={<UsuarioForm />} />
          <Route path="/usuarios/editar/:id" element={<UsuarioForm />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;