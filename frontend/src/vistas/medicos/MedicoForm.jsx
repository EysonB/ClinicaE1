import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { toast } from "react-toastify";

const BASE_URL = "http://127.0.0.1:8000/api/medicos/";

export default function MedicoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [cedula, setCedula] = useState("");

  useEffect(() => {
    if (esEdicion) {
      axios
        .get(`${BASE_URL}${id}/`)
        .then(res => {
          setNombre(res.data.nombre);
          setEspecialidad(res.data.especialidad);
          setCedula(res.data.cedula);
        })
        .catch(() => {
          toast.error("Error al cargar médico");
          navigate("/medicos");
        });
    }
  }, [id, esEdicion, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = { nombre, especialidad, cedula };

    const request = esEdicion
      ? axios.put(`${BASE_URL}${id}/`, data)
      : axios.post(BASE_URL, data);

    request
      .then(() => {
        toast.success(
          esEdicion ? "Médico actualizado" : "Médico creado"
        );
        navigate("/medicos");
      })
      .catch(() => {
        toast.error("Error al guardar médico");
      });
  };

  return (
    <div>
      <BackButton />
      <h2>{esEdicion ? "Editar Médico" : "Nuevo Médico"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Cédula"
          value={cedula}
          onChange={e => setCedula(e.target.value)}
        />
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <input
          placeholder="Especialidad"
          value={especialidad}
          onChange={e => setEspecialidad(e.target.value)}
        />

        <button type="submit">
          {esEdicion ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
}
