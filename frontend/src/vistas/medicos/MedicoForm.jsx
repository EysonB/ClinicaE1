import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * CONFIGURACIÓN
 */
const BASE_MEDICOS_URL = "http://127.0.0.1:8000/api/medicos/";
const BASE_ATENCIONES_URL = "http://127.0.0.1:8000/api/atenciones/";

export default function FormUnificado({ tipo }) {
  /**
   * tipo = "medico" | "atencion"
   */
  const navigate = useNavigate();
  const { id, citaId } = useParams();

  const userRole = localStorage.getItem("userRole");
  const medicoId = localStorage.getItem("medicoId");

  const esEdicion = Boolean(id);
  const [loading, setLoading] = useState(true);

  /**
   * ESTADOS COMPARTIDOS
   */
  const [formData, setFormData] = useState({});
  const [extraData, setExtraData] = useState(null);

  /**
   * 🔐 VALIDACIÓN DE ROL
   */
  const validarRol = () => {
    if (tipo === "medico" && userRole !== "enfermera") {
      toast.error("No tiene permisos para gestionar médicos");
      navigate("/");
      return false;
    }

    if (tipo === "atencion" && userRole !== "medico") {
      toast.error("Solo médicos pueden crear atenciones");
      navigate("/citas");
      return false;
    }

    return true;
  };

  /**
   * 📥 CARGA DE DATOS
   */
  const cargarDatos = async () => {
    try {
      if (tipo === "medico" && esEdicion) {
        const res = await axios.get(`${BASE_MEDICOS_URL}${id}/`);
        setFormData(res.data);
      }

      if (tipo === "atencion") {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/citas/${citaId}/`
        );

        if (res.data.medico._id !== medicoId) {
          toast.error("No puede atender citas de otro médico");
          navigate("/citas");
          return;
        }

        setExtraData(res.data);
        setFormData({
          cita: citaId,
          diagnostico: "",
          tratamiento: "",
          observaciones: "",
        });
      }
    } catch (error) {
      toast.error("Error al cargar datos");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ⏳ EFECTO PRINCIPAL
   */
  useEffect(() => {
    if (!validarRol()) return;
    cargarDatos();
  }, []);

  /**
   * 📤 SUBMIT
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (tipo === "medico") {
        const request = esEdicion
          ? axios.put(`${BASE_MEDICOS_URL}${id}/`, formData)
          : axios.post(BASE_MEDICOS_URL, formData);

        await request;
        toast.success(
          esEdicion ? "Médico actualizado" : "Médico creado correctamente"
        );
        navigate("/medicos");
      }

      if (tipo === "atencion") {
        const payload = {
          ...formData,
          paciente: extraData.paciente._id,
          medico: extraData.medico._id,
          fecha: new Date(),
        };

        await axios.post(BASE_ATENCIONES_URL, payload);
        toast.success("Atención registrada correctamente");
        navigate("/atenciones");
      }
    } catch (error) {
      toast.error("Error al guardar información");
    }
  };

  /**
   * ⛔ CARGANDO
   */
  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  /**
   * 🧾 UI
   */
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">
        {tipo === "medico"
          ? esEdicion
            ? "Editar Médico"
            : "Nuevo Médico"
          : "Registrar Atención"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block font-medium capitalize">{key}</label>
            <input
              className="w-full border p-2 rounded"
              value={formData[key] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
            />
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
