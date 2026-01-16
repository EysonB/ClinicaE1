import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
        toast.error("Error al cargar pacientes");
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este paciente?")) {
      return;
    }

    axios.delete(`http://127.0.0.1:8000/api/pacientes/${id}/`)
      .then(() => {
        toast.success("Paciente eliminado correctamente");
        // Actualizar la lista sin recargar
        setPacientes(pacientes.filter(p => p.id !== id));
      })
      .catch((error) => {
        console.error("Error al eliminar paciente:", error);
        toast.error("Error al eliminar el paciente");
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Lista de Pacientes</h2>
      <button onClick={() => navigate("/pacientes/crear")}>
        Nuevo Paciente
      </button>
      
      {pacientes.length === 0 ? (
        <p>No hay pacientes registrados.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Fecha Nacimiento</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr key={p.id}>
                <td>{p.cedula}</td>
                <td>{p.nombre}</td>
                <td>{p.apellido}</td>
                <td>{p.email}</td>
                <td>{p.telefono || "N/A"}</td>
                <td>{p.fecha_nacimiento || "N/A"}</td>
                <td>{p.direccion || "N/A"}</td>
                <td>
                  <button onClick={() => navigate(`/pacientes/editar/${p.id}`)}>
                    Editar
                  </button>
                  {" "}
                  <button onClick={() => handleDelete(p.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PacientesList;