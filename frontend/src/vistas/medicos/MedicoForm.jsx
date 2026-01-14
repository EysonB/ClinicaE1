import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";



export default function MedicoForm() {
  const navigate = useNavigate();

  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
  if (esEdicion) {
    axios
      .get(`http://127.0.0.1:8000/api/medicos/${id}/`)
      .then((res) => {
        setNombre(res.data.nombre);
        setApellido(res.data.apellido);
        setCedula(res.data.cedula);
        setEspecialidad(res.data.especialidad);
        setTelefono(res.data.telefono);
        setEmail(res.data.email);
      })
      .catch((err) => {
        console.error("Error cargando médico:", err);
      });
  }
}, [id]);


  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = {
    nombre,
    apellido,
    cedula,
    especialidad,
    telefono: Number(telefono),
    email,
  };

  try {
    if (esEdicion) {
      await axios.put(
        `http://127.0.0.1:8000/api/medicos/${id}/`,
        data
      );
    } else {
      await axios.post(
        "http://127.0.0.1:8000/api/medicos/",
        data
      );
    }

    navigate("/medicos");
  } catch (err) {
    console.error("ERROR BACKEND:", err.response?.data);
    alert(JSON.stringify(err.response?.data, null, 2));
  }
};


  return (
    <div>
      
      <h2>{esEdicion ? "Editar Médico" : "Nuevo Médico"}</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} />
        <input placeholder="Cedula" value={cedula} onChange={e => setCedula(e.target.value)} />
        <input placeholder="Especialidad" value={especialidad} onChange={e => setEspecialidad(e.target.value)} />
        <input placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">
          {esEdicion ? "Guardar Cambios" : "Guardar"}
        </button>

      </form>
    </div>
  );
}
