// src/CitasList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./components/BackButton";


const BASE = "http://127.0.0.1:8000/api";

export default function CitasList() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const obtenerCitas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE}/citas/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCitas(data);
    } catch (err) {
      console.error("Error obtenerCitas:", err);
      alert("Error al cargar citas. Revisa consola y Network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCitas();
  }, []);

  const borrarCita = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta cita?")) return;
    try {
      const res = await fetch(`${BASE}/citas/${id}/`, { method: "DELETE" });
      if (res.status === 204 || res.status === 200) {
        setCitas((prev) => prev.filter((c) => c.id !== id));
      } else {
        throw new Error(`delete failed ${res.status}`);
      }
    } catch (err) {
      console.error("Error borrarCita:", err);
      alert("No se pudo borrar. Revisa la consola y Network.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <BackButton />
      <h2>Lista de Citas</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => navigate("/citas/crear")}>Nueva Cita</button>
        <button onClick={() => obtenerCitas()} style={{ marginLeft: 8 }}>
          Refresh
        </button>
      </div>

      {loading ? <p>Cargando...</p> : null}

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Motivo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.length === 0 ? (
            <tr><td colSpan="7">No hay citas</td></tr>
          ) : (
            citas.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.paciente_nombre ?? c.paciente}</td>
                <td>{c.medico_nombre ?? c.medico}</td>
                <td>{c.fecha}</td>
                <td>{c.hora}</td>
                <td>{c.motivo}</td>
                <td>
                  <button onClick={() => navigate(`/citas/${c.id}`)}>
                    Ver
                  </button>
                  <button onClick={() => navigate(`/editar/${c.id}`)}
                    style={{ marginLeft: 6 }}
                    >
                    Editar
                  </button>
                  <button
                    onClick={() => borrarCita(c.id)}
                    style={{ marginLeft: 8, background: "tomato", color: "white" }}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
