import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const BASE = "http://127.0.0.1:8000/api";

export default function UsuarioForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;

  const [medicos, setMedicos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "enfermera",
    medico_id: "",
    activo: true,
  });
  const [loading, setLoading] = useState(false);

  // Cargar médicos disponibles
  useEffect(() => {
    axios.get(`${BASE}/medicos/`).then((res) => setMedicos(res.data));
  }, []);

  // Si es edición, cargar datos del usuario
  useEffect(() => {
    if (esEdicion) {
      axios.get(`${BASE}/usuarios/${id}/`).then((res) => {
        const u = res.data;
        setFormData({
          nombre: u.nombre,
          email: u.email,
          password: "",
          rol: u.rol,
          medico_id: u.medico_id ?? "",
          activo: u.activo,
        });
      }).catch(() => {
        toast.error("Error al cargar usuario");
        navigate("/usuarios");
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // Si cambia el rol y no es médico, limpiar medico_id
      ...(name === "rol" && value !== "medico" ? { medico_id: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      nombre: formData.nombre,
      email: formData.email,
      rol: formData.rol,
      activo: formData.activo,
      ...(formData.password ? { password: formData.password } : {}),
      ...(formData.rol === "medico" ? { medico_id: formData.medico_id } : { medico_id: null }),
    };

    try {
      if (esEdicion) {
        await axios.put(`${BASE}/usuarios/${id}/`, payload);
        toast.success("Usuario actualizado correctamente");
      } else {
        await axios.post(`${BASE}/usuarios/`, payload);
        toast.success("Usuario creado correctamente");
      }
      navigate("/usuarios");
    } catch (err) {
      const msg = err.response?.data?.error || "Error al guardar usuario";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {esEdicion ? "✏️ Editar Usuario" : "➕ Nuevo Usuario"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Dr. Juan Pérez"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="usuario@clinica.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contraseña {esEdicion && <span className="text-gray-400 font-normal">(dejar vacío para no cambiar)</span>}
              {!esEdicion && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!esEdicion}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Rol <span className="text-red-500">*</span>
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="superadmin">👑 Superadmin</option>
              <option value="enfermera">🗂️ Administrador</option>
              <option value="medico">👨‍⚕️ Médico</option>
            </select>
          </div>

          {/* Médico vinculado (solo si rol es médico) */}
          {formData.rol === "medico" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Médico vinculado <span className="text-red-500">*</span>
              </label>
              <select
                name="medico_id"
                value={formData.medico_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar médico...</option>
                {medicos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} {m.apellido} - {m.especialidad}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Estado activo (solo en edición) */}
          {esEdicion && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="activo"
                id="activo"
                checked={formData.activo}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <label htmlFor="activo" className="text-sm font-semibold text-gray-700">
                Usuario activo
              </label>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate("/usuarios")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Guardando..." : esEdicion ? "💾 Actualizar" : "✅ Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}