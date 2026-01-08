import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE = "http://127.0.0.1:8000/api";

export default function CitaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cita, setCita] = useState(null);

  useEffect(() => {
    fetch(`${BASE}/citas/${id}/`)
      .then(res => res.json())
      .then(data => setCita(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!cita) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)}>⬅ Volver</button>

      <h2>Detalle de Cita #{cita.id}</h2>

      <p><strong>Paciente:</strong> {cita.paciente_nombre}</p>
      <p><strong>Médico:</strong> {cita.medico_nombre}</p>
      <p><strong>Fecha:</strong> {cita.fecha}</p>
      <p><strong>Hora:</strong> {cita.hora}</p>
      <p><strong>Motivo:</strong> {cita.motivo}</p>
      <p><strong>Estado:</strong> {cita.estado}</p>

      <button onClick={() => navigate(`/citas/editar/${cita.id}`)}>
        Editar
      </button>
    </div>
  );
}
