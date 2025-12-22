import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40 }}>
      <h1>UD Clínica</h1>
      <p>Panel principal</p>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button onClick={() => navigate("/citas")}>Citas</button>
        <button onClick={() => navigate("/pacientes")}>Pacientes</button>
        <button onClick={() => navigate("/medicos")}>Médicos</button>
      </div>
    </div>
  );
}
