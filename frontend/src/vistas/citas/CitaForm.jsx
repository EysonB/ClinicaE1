import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";



const CitaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // si existe, es edición
  const esEdicion = Boolean(id);
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

  const data = {
    paciente,
    medico,
    fecha,
    hora,
    motivo,
  };

  const request = esEdicion
    ? axios.put(`http://127.0.0.1:8000/api/citas/${id}/`, data)
    : axios.post("http://127.0.0.1:8000/api/citas/", data);

  request
    .then(() => {
      navigate("/citas"); // 🔴 VUELVE A LA LISTA
    })
    .catch((err) => {
      console.error(err);
      alert("Error al guardar la cita");
    });
};

  return (
    <div>
      
    <form onSubmit={handleSubmit}>
      <h2>{esEdicion ? "Editar Cita" : "Nueva Cita"}</h2>

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

      <button type="submit">
        {esEdicion ? "Actualizar Cita" : "Crear Cita"}
      </button>
    </form>
    </div>
  );
};

export default CitaForm;
