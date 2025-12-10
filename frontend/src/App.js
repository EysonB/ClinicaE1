// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CitasList from "./CitasList";
import CitaForm from "./CitaForm";
import MedicosList from "./MedicosList"; 
import PacientesList from "./components/PacientesList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CitasList />} />
        <Route path="/crear" element={<CitaForm />} />
        <Route path="/editar/:id" element={<CitaForm />} />
             {/* NUEVA RUTA */}
        <Route path="/medicos" element={<MedicosList />} />
        <Route path="/pacientes" element={<PacientesList />} /> 
      </Routes>
    </Router>
  );
}


export default App;

