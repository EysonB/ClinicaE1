import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import API_BASE from "../../config";

export default function MedicoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;

  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    especialidad: "",
    email: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (esEdicion) {
      setLoading(true);
      axios.get(`${API_BASE}/medicos/${id}/`)
        .then(res => setFormData(res.data))
        .catch(() => { toast.error("Error al cargar médico"); navigate("/medicos"); })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (esEdicion) {
        await axios.put(`${API_BASE}/medicos/${id}/`, formData);
        toast.success("Médico actualizado correctamente");
      } else {
        await axios.post(`${API_BASE}/medicos/`, formData);
        toast.success("Médico creado correctamente");
      }
      navigate("/medicos");
    } catch (err) {
      toast.error("Error al guardar médico");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {esEdicion ? "✏️ Editar Médico" : "➕ Nuevo Médico"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cédula <span className="text-red-500">*</span></label>
            <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre <span className="text-red-500">*</span></label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Apellido <span className="text-red-500">*</span></label>
              <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Especialidad <span className="text-red-500">*</span></label>
            <input type="text" name="especialidad" value={formData.especialidad} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={() => navigate("/medicos")} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50" disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? "Guardando..." : esEdicion ? "💾 Actualizar" : "✅ Crear Médico"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}