import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* TODAS LAS RUTAS USAN EL LAYOUT */}
        <Route element={<Layout />}>
          
          <Route path="/" element={<Home />} />

          {/* MEDICOS */}
          <Route path="/medicos" element={<MedicosList />} />
          <Route path="/medicos/nuevo" element={<MedicoForm />} />
          <Route path="/medicos/editar/:id" element={<MedicoForm />} />

          {/* PACIENTES */}
          <Route path="/pacientes" element={<PacienteList />} />
          <Route path="/pacientes/nuevo" element={<PacienteForm />} />
          <Route path="/pacientes/editar/:id" element={<PacienteForm />} />

          {/* CITAS */}
          <Route path="/citas" element={<CitasList />} />
          <Route path="/citas/nueva" element={<CitaForm />} />
          <Route path="/citas/editar/:id" element={<CitaForm />} />
          <Route path="/citas/:id" element={<CitaDetail />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
