import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { toast } from "react-toastify";

const BASE_URL = "http://127.0.0.1:8000/api/pacientes/";

export default function PacienteForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // si existe => editar
  const esEdicion = Boolean(id);

  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  // 🔹 Cargar paciente si es edición
  useEffect(() => {
    if (esEdicion) {
      axios
        .get(`${BASE_URL}${id}/`)
        .then(res => {
          const p = res.data;
          setCedula(p.cedula);
          setNombre(p.nombre);
          setApellido(p.apellido);
          setFechaNacimiento(p.fecha_nacimiento);
          setEmail(p.email);
          setTelefono(p.telefono ?? "");
          setDireccion(p.direccion ?? "");
        })
        .catch(() => {
          toast.error("Error al cargar paciente");
          navigate("/pacientes");
        });
    }
  }, [id, esEdicion, navigate]);


  // 🔹 Crear o editar
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      cedula,
      nombre,
      apellido,
      fecha_nacimiento: fechaNacimiento,
      email,
      telefono,
      direccion,
    };

    const request = esEdicion
      ? axios.put(`${BASE_URL}${id}/`, data)
      : axios.post(BASE_URL, data);

    request
      .then(() => {
        toast.success(
          esEdicion ? "Paciente actualizado correctamente" : "Paciente creado correctamente"
        );
        navigate("/pacientes");
      })
      .catch(err => {
        if (err.response?.data?.email) {
          toast.error("Ese email ya está registrado");
        } else {
          toast.error("Error al guardar paciente");
        }
      });
  };

  return (
    <div>
      <BackButton />
      <h2>{esEdicion ? "Editar Paciente" : "Nuevo Paciente"}</h2>

      <form onSubmit={handleSubmit}>
        {/* 👁️ CAMPO ID - SOLO VISIBLE EN EDICIÓN */}
        {esEdicion && (
          <>
            <label>ID (solo lectura)</label>
            <input
              value={id}
              disabled
              style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
            />
          </>
        )}

        <input
          placeholder="Cédula"
          value={cedula}
          onChange={e => setCedula(e.target.value)}
          required
        />

        <input
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />

        <input
          placeholder="Apellido"
          value={apellido}
          onChange={e => setApellido(e.target.value)}
          required
        />

        <label>Fecha de nacimiento</label>
        <input
          type="date"
          value={fechaNacimiento}
          onChange={e => setFechaNacimiento(e.target.value)}
          required
        />

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          placeholder="Teléfono (opcional)"
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
        />

        <textarea
          placeholder="Dirección (opcional)"
          value={direccion}
          onChange={e => setDireccion(e.target.value)}
        />

        <button type="submit">
          {esEdicion ? "Guardar Cambios" : "Crear Paciente"}
        </button>
      </form>
    </div>
  );
}