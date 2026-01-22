import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BASE = "http://127.0.0.1:8000/api";

export default function CitasList() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const obtenerCitas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE}/citas/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCitas(data);
    } catch (err) {
      console.error("Error obtenerCitas:", err);
      toast.error("Error al cargar citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCitas();
  }, []);

  const borrarCita = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta cita?")) return;
    try {
      const res = await fetch(`${BASE}/citas/${id}/`, { method: "DELETE" });
      if (res.status === 204 || res.status === 200) {
        setCitas((prev) => prev.filter((c) => c.id !== id));
        toast.success("Cita eliminada correctamente");
      } else {
        throw new Error(`delete failed ${res.status}`);
      }
    } catch (err) {
      console.error("Error borrarCita:", err);
      toast.error("No se pudo eliminar la cita");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📅 Lista de Citas</h2>
            <p className="text-gray-600 mt-1">
              Gestiona todas las citas médicas
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => obtenerCitas()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              🔄 Actualizar
            </button>
            <button
              onClick={() => navigate("/citas/nueva")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ Nueva Cita
            </button>
          </div>
        </div>
        
        {/* Contador de citas */}
        {!loading && citas.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total de citas registradas: <span className="font-semibold text-gray-900">{citas.length}</span>
            </p>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Cargando citas...</p>
          </div>
        ) : citas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay citas registradas
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza creando tu primera cita médica
            </p>
            <button
              onClick={() => navigate("/citas/nueva")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ Crear Primera Cita
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Médico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Motivo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {citas.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {c.paciente_nombre ?? c.paciente}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {c.medico_nombre ?? c.medico}
                      </div>
                      {c.medico_especialidad && (
                        <div className="text-xs text-gray-500">
                          {c.medico_especialidad}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{c.fecha}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{c.hora}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {c.motivo || "Sin motivo especificado"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/citas/${c.id}`)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          title="Ver detalles"
                        >
                          👁️ Ver
                        </button>
                        <button
                          onClick={() => navigate(`/citas/editar/${c.id}`)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          title="Editar cita"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => borrarCita(c.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          title="Eliminar cita"
                        >
                          🗑️ Borrar
                        </button>
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