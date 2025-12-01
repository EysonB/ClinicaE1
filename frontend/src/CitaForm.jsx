import React, { useState, useEffect } from "react";
import axios from "axios";

const CitaForm = ({ onCitaCreada }) => {
  const [paciente, setPaciente] = useState("");
  const [medico, setMedico] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  const [pacientesList, setPacientesList] = useState([]);
  const [medicosList, setMedicosList] = useState([]);

  // 🔵 1. Cargar pacientes y médicos cuando el componente monta
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/pacientes/")
      .then(res => setPacientesList(res.data))
      .catch(err => console.error("Error cargando pacientes:", err));

    axios.get("http://127.0.0.1:8000/api/medicos/")
      .then(res => setMedicosList(res.data))
      .catch(err => console.error("Error cargando médicos:", err));
  }, []);

  // 🔵 2. Enviar la cita
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://127.0.0.1:8000/api/citas/", {
      paciente,
      medico,
      fecha,
      hora,
      motivo,
    })
    .then((res) => {
      onCitaCreada(res.data);
    })
    .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nueva Cita</h2>

      {/* PACIENTE */}
      <label>Paciente</label>
      <select value={paciente} onChange={e => setPaciente(e.target.value)}>
        <option value="">Seleccione un paciente</option>
        {pacientesList.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      {/* MEDICO */}
      <label>Médico</label>
      <select value={medico} onChange={e => setMedico(e.target.value)}>
        <option value="">Seleccione un médico</option>
        {medicosList.map(m => (
          <option key={m.id} value={m.id}>{m.nombre}</option>
        ))}
      </select>

      {/* FECHA */}
      <label>Fecha</label>
      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />

      {/* HORA */}
      <label>Hora</label>
      <input type="time" value={hora} onChange={e => setHora(e.target.value)} />

      {/* MOTIVO */}
      <label>Motivo</label>
      <input type="text" value={motivo} onChange={e => setMotivo(e.target.value)} />

      <button type="submit">Crear Cita</button>
    </form>
  );
};

export default CitaForm;
