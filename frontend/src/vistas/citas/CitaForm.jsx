import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE from "../../config";

export default function CitaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id;

  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [formData, setFormData] = useState({
    paciente: "",
    medico: "",
    fecha: "",
    hora: "",
    motivo: "",
    estado: "pendiente",
  });

  useEffect(() => {
    axios.get(`${API_BASE}/pacientes/`).then(res => setPacientes(res.data));
    axios.get(`${API_BASE}/medicos/`).then(res => setMedicos(res.data));

    if (esEdicion) {
      axios.get(`${API_BASE}/citas/${id}/`).then(res => {
        const c = res.data;
        setFormData({
          paciente: c.paciente,
          medico: c.medico,
          fecha: c.fecha,
          hora: c.hora,
          motivo: c.motivo,
          estado: c.estado,
        });
      }).catch(() => {
        toast.error("Error al cargar la cita");
        navigate("/citas");
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = esEdicion
      ? axios.put(`${API_BASE}/citas/${id}/`, formData)
      : axios.post(`${API_BASE}/citas/`, formData);

    request
      .then(() => {
        toast.success(esEdicion ? "Cita actualizada" : "Cita creada correctamente");
        navigate("/citas");
      })
      .catch(err => {
        console.error(err.response?.data);
        toast.error("Error al guardar la cita");
      });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {esEdicion ? "✏️ Editar Cita" : "➕ Nueva Cita"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Paciente <span className="text-red-500">*</span></label>
            <select name="paciente" value={formData.paciente} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar paciente...</option>
              {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Médico <span className="text-red-500">*</span></label>
            <select name="medico" value={formData.medico} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar médico...</option>
              {medicos.map(m => <option key={m.id} value={m.id}>Dr. {m.nombre} {m.apellido} - {m.especialidad}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha <span className="text-red-500">*</span></label>
              <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hora <span className="text-red-500">*</span></label>
              <input type="time" name="hora" value={formData.hora} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Motivo <span className="text-red-500">*</span></label>
            <textarea name="motivo" value={formData.motivo} onChange={handleChange} required rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          {esEdicion && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
              <select name="estado" value={formData.estado} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="pendiente">Pendiente</option>
                <option value="atendida">Atendida</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={() => navigate("/citas")} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {esEdicion ? "💾 Actualizar" : "✅ Crear Cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}