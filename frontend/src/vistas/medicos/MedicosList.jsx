import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function MedicosList() {
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/medicos/")
      .then((response) => {
        setMedicos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los médicos:", error);
        setLoading(false);
      });
  }, []);

  const eliminarMedico = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este médico?"
    );
    if (!confirmar) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/medicos/${id}/`);
      setMedicos(medicos.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error al eliminar médico:", error);
      alert("No se pudo eliminar el médico");
    }
  };

  if (loading) return <p>Cargando médicos...</p>;

  return (
    <div>
      
      <h2>Lista de Médicos</h2>

        <button onClick={() => navigate("/medicos/nuevo")}>
            Nuevo Médico
        </button>
           <ul>
        {medicos.map((m) => (
          <li key={m.id}>
            {m.nombre} – {m.especialidad}{" "}
            <button onClick={() => navigate(`/medicos/editar/${m.id}`)}>
              Editar
            </button>
            <button onClick={() => eliminarMedico(m.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MedicosList;
