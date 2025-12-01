// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CitasList from "./CitasList";
import CitaForm from "./CitaForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CitasList />} />
        <Route path="/crear" element={<CitaForm />} />
        <Route path="/editar/:id" element={<CitaForm />} />
      </Routes>
    </Router>
  );
}

export default App;

