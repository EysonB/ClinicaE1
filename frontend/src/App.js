import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

// USUARIOS
import UsuariosList from "./vistas/usuarios/UsuariosList";
import UsuarioForm from "./vistas/usuarios/UsuarioForm";

// 🔐 Verificar autenticación
const isAuthenticated = () => !!localStorage.getItem("userId");
const getRole = () => localStorage.getItem("userRole");

// 🛡️ Ruta protegida por autenticación y rol
const ProtectedRoute = ({ children, roles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(getRole())) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// 🏗️ Layout protegido
const ProtectedLayout = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Layout />;
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>

        {/* 🟢 PÚBLICA */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 PROTEGIDAS */}
        <Route element={<ProtectedLayout />}>

          {/* HOME - todos los roles */}
          <Route path="/" element={<Home />} />

          {/* MÉDICOS - superadmin y enfermera */}
          <Route path="/medicos" element={
            <ProtectedRoute roles={["superadmin", "enfermera"]}>
              <MedicosList />
            </ProtectedRoute>
          } />
          <Route path="/medicos/nuevo" element={
            <ProtectedRoute roles={["superadmin", "enfermera"]}>
              <MedicoForm />
            </ProtectedRoute>
          } />
          <Route path="/medicos/editar/:id" element={
            <ProtectedRoute roles={["superadmin", "enfermera"]}>
              <MedicoForm />
            </ProtectedRoute>
          } />

          {/* PACIENTES - superadmin y enfermera */}
          <Route path="/pacientes" element={
            <ProtectedRoute roles={["superadmin", "enfermera"]}>
              <PacienteList />
            </ProtectedRoute>
          } />
          <Route path="/pacientes/crear" element={
            <ProtectedRoute roles={["superadmin", "enfermera"]}>
              <PacienteForm />
            </ProtectedRoute>
          } />
          <Route path="/pacientes/editar/:id" element={
            <ProtectedRoute roles={["superadmin", "enfermera"]}>
              <PacienteForm />
            </ProtectedRoute>
          } />

          {/* CITAS - todos los roles */}
          <Route path="/citas" element={
            <ProtectedRoute roles={["superadmin", "enfermera", "medico"]}>
              <CitasList />
            </ProtectedRoute>
          } />
          <Route path="/citas/nueva" element={
            <ProtectedRoute roles={["superadmin", "enfermera"]}>
              <CitaForm />
            </ProtectedRoute>
          } />
          <Route path="/citas/editar/:id" element={
            <ProtectedRoute roles={["superadmin", "enfermera"]}>
              <CitaForm />
            </ProtectedRoute>
          } />
          <Route path="/citas/:id" element={
            <ProtectedRoute roles={["superadmin", "enfermera", "medico"]}>
              <CitaDetail />
            </ProtectedRoute>
          } />

          {/* ATENCIONES - todos los roles */}
          <Route path="/atenciones" element={
            <ProtectedRoute roles={["superadmin", "enfermera", "medico"]}>
              <AtencionesList />
            </ProtectedRoute>
          } />
          <Route path="/atenciones/nueva/:citaId" element={
            <ProtectedRoute roles={["superadmin", "medico"]}>
              <AtencionForm />
            </ProtectedRoute>
          } />
          <Route path="/atenciones/:id" element={
            <ProtectedRoute roles={["superadmin", "enfermera", "medico"]}>
              <AtencionDetail />
            </ProtectedRoute>
          } />

          {/* FACTURAS - superadmin y enfermera */}
          <Route path="/facturas" element={
            <ProtectedRoute roles={["superadmin", "enfermera"]}>
              <FacturasList />
            </ProtectedRoute>
          } />
          <Route path="/facturas/nueva/:atencionId" element={
            <ProtectedRoute roles={["superadmin", "enfermera"]}>
              <FacturaForm />
            </ProtectedRoute>
          } />
          <Route path="/facturas/:id" element={
            <ProtectedRoute roles={["superadmin", "enfermera"]}>
              <FacturaDetail />
            </ProtectedRoute>
          } />

          {/* FACTURACIÓN - superadmin y enfermera */}
          <Route path="/facturacion/pendientes" element={
            <ProtectedRoute roles={["superadmin", "enfermera"]}>
              <PendientesCobro />
            </ProtectedRoute>
          } />

          {/* USUARIOS - solo superadmin */}
          <Route path="/usuarios" element={
            <ProtectedRoute roles={["superadmin"]}>
              <UsuariosList />
            </ProtectedRoute>
          } />
          <Route path="/usuarios/nuevo" element={
            <ProtectedRoute roles={["superadmin"]}>
              <UsuarioForm />
            </ProtectedRoute>
          } />
          <Route path="/usuarios/editar/:id" element={
            <ProtectedRoute roles={["superadmin"]}>
              <UsuarioForm />
            </ProtectedRoute>
          } />

        </Route>

        {/* 🚨 CUALQUIER OTRA RUTA */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;