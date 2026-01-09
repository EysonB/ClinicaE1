// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import CitasList from "./CitasList";
import CitaForm from "./CitaForm";
import MedicosList from "./MedicosList"; 
import PacientesList from "./components/PacientesList";
import CitaDetail from "./CitaDetail";
import PacienteForm from "./components/PacienteForm";
import MedicoForm from "./MedicoForm";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* CITAS */}
        <Route path="/citas" element={<CitasList />} />
        <Route path="/citas/crear" element={<CitaForm />} />
        <Route path="/citas/editar/:id" element={<CitaForm />} />
        <Route path="/citas/:id" element={<CitaDetail />} />

        {/* MEDICOS */}
        <Route path="/medicos" element={<MedicosList />} />
        <Route path="/medicos/nuevo" element={<MedicoForm />} />

        {/* PACIENTES */}
        <Route path="/pacientes" element={<PacientesList />} />
        <Route path="/pacientes/crear" element={<PacienteForm />} />

      </Routes>
    </Router>
  );
}


export default App;

