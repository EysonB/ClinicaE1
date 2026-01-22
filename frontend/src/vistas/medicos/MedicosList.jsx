import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MedicosList() {
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    obtenerMedicos();
  }, []);

  const obtenerMedicos = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/medicos/")
      .then((response) => {
        setMedicos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los médicos:", error);
        toast.error("Error al cargar médicos");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const eliminarMedico = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este médico?")) {
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/medicos/${id}/`);
      setMedicos(medicos.filter((m) => m.id !== id));
      toast.success("Médico eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar médico:", error);
      toast.error("No se pudo eliminar el médico");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🩺 Lista de Médicos</h2>
            <p className="text-gray-600 mt-1">
              Administra el personal médico de la clínica
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => obtenerMedicos()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              🔄 Actualizar
            </button>
            <button
              onClick={() => navigate("/medicos/nuevo")}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              ➕ Nuevo Médico
            </button>
          </div>
        </div>

        {/* Contador de médicos */}
        {!loading && medicos.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total de médicos registrados: <span className="font-semibold text-gray-900">{medicos.length}</span>
            </p>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Cargando médicos...</p>
          </div>
        ) : medicos.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🩺</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay médicos registrados
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza agregando el primer médico al sistema
            </p>
            <button
              onClick={() => navigate("/medicos/nuevo")}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              ➕ Crear Primer Médico
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nombre Completo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Especialidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medicos.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">
                            Dr.
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {m.nombre} {m.apellido}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {m.especialidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{m.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {m.telefono || <span className="text-gray-400">N/A</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/medicos/editar/${m.id}`)}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                          title="Editar médico"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => eliminarMedico(m.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          title="Eliminar médico"
                        >
                          🗑️ Eliminar
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

export default MedicosList;