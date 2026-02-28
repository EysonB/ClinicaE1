// MedicosList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import API_BASE from "../../config";

export default function MedicosList() {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const obtenerMedicos = () => {
    setLoading(true);
    axios.get(`${API_BASE}/medicos/`)
      .then(res => setMedicos(res.data))
      .catch(() => toast.error("Error al cargar médicos"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { obtenerMedicos(); }, []);

  const borrarMedico = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este médico?")) return;
    try {
      await axios.delete(`${API_BASE}/medicos/${id}/`);
      setMedicos(prev => prev.filter(m => m.id !== id));
      toast.success("Médico eliminado correctamente");
    } catch {
      toast.error("No se pudo eliminar el médico");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🩺 Lista de Médicos</h2>
            <p className="text-gray-600 mt-1">Gestión de médicos del sistema</p>
          </div>
          <div className="flex gap-3">
            <button onClick={obtenerMedicos} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" disabled={loading}>🔄 Actualizar</button>
            <button onClick={() => navigate("/medicos/nuevo")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">➕ Nuevo Médico</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Cargando médicos...</div>
        ) : medicos.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No hay médicos registrados</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">Especialidad</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {medicos.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">Dr. {m.nombre} {m.apellido}</td>
                    <td className="px-6 py-4 text-gray-600">{m.especialidad}</td>
                    <td className="px-6 py-4 text-gray-600">{m.email}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => navigate(`/medicos/editar/${m.id}`)} className="px-3 py-1 bg-green-100 text-green-700 rounded">✏️ Editar</button>
                        <button onClick={() => borrarMedico(m.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded">🗑️ Borrar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}