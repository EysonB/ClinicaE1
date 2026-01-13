import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MedicoForm() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post("http://127.0.0.1:8000/api/medicos/", {
      nombre,
      apellido,
      cedula,
      especialidad,
      telefono: Number(telefono),
      email,
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    navigate("/medicos");

  } catch (err) {
    console.error("ERROR BACKEND:", err.response?.data);
    alert(JSON.stringify(err.response?.data, null, 2));
  }
};

  return (
    <div>
      <h2>Nuevo Médico</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} />
        <input placeholder="Cedula" value={cedula} onChange={e => setCedula(e.target.value)} />
        <input placeholder="Especialidad" value={especialidad} onChange={e => setEspecialidad(e.target.value)} />
        <input placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}
