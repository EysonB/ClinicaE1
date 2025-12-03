import React, { useEffect, useState } from "react";
import axios from "axios";

function MedicosList() {
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

  if (loading) return <p>Cargando médicos...</p>;

  return (
    <div>
      <h2>Lista de Médicos</h2>
      <ul>
        {medicos.map((m) => (
          <li key={m.id}>
            {m.nombre} – {m.especialidad}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MedicosList;
