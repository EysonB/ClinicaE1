import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function PacientesList() {
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/pacientes/")
      .then((response) => {
        setPacientes(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar pacientes:", error);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Lista de Pacientes</h2>
          {/* 🔴 AQUÍ VA EL navigate */}
        <button onClick={() => navigate("/pacientes/crear")}>
        Nuevo Paciente
        </button>
      {pacientes.length === 0 ? (
        <p>No hay pacientes registrados.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.apellido}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PacientesList;
