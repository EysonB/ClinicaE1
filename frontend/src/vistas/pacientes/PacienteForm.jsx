import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";


export default function PacienteForm() {
  const navigate = useNavigate();

  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://127.0.0.1:8000/api/pacientes/", {
      cedula,
      nombre,
      apellido,
      fecha_nacimiento: fechaNacimiento,
      email,
      telefono,
      direccion,
    })
    .then(() => navigate("/pacientes"))
    .catch(err => {
      console.error(err.response?.data || err);
      alert("Error al crear paciente");
    });
  };

  return (
    <div>
      <BackButton />
      <h2>Nuevo Paciente</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Cédula" value={cedula} onChange={e => setCedula(e.target.value)} />
        <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} />

        <label>Fecha de nacimiento</label>
        <input type="date" value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)} />

        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Teléfono (opcional)" value={telefono} onChange={e => setTelefono(e.target.value)} />
        <textarea placeholder="Dirección (opcional)" value={direccion} onChange={e => setDireccion(e.target.value)} />

        <button type="submit">Crear Paciente</button>
      </form>
    </div>
  );
}

