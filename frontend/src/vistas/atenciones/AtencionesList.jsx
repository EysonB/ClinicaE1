import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const BASE = "http://127.0.0.1:8000/api";

export default function AtencionesList() {
  const [atenciones, setAtenciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  const puedeEliminar = userRole === "superadmin";

  const obtenerAtenciones = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE}/atenciones/`);
      let data = res.data;

      // Filtrar si es médico (superadmin ve todo)
      if (userRole === "medico") {
        const medicoId = localStorage.getItem("medicoId");
        data = data.filter((a) => String(a.medico) === String(medicoId));
      }

      setAtenciones(data);
    } catch (err) {
      console.error("Error obtenerAtenciones:", err);
      toast.error("Error al cargar atenciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerAtenciones();
  }, []);

  const borrarAtencion = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta atención?")) return;
    try {
      await axios.delete(`${BASE}/atenciones/${id}/`);
      setAtenciones((prev) => prev.filter((a) => a.id !== id));
      toast.success("Atención eliminada correctamente");
    } catch (err) {
      const msg = err.response?.data?.error || "No se pudo eliminar la atención";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              🩺 {userRole === "medico" ? "Mis Atenciones" : "Lista de Atenciones"}
            </h2>
            <p className="text-gray-600 mt-1">
              {userRole === "medico"
                ? "Atenciones registradas por usted"
                : "Todas las atenciones médicas registradas"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={obtenerAtenciones}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              disabled={loading}
            >
              🔄 Actualizar
            </button>
            {/* Para crear atención hay que ir desde una cita */}
            <button
              onClick={() => navigate("/citas")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              📅 Ir a Citas
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Cargando atenciones...</div>
        ) : atenciones.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <div className="text-6xl mb-4">🩺</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay atenciones registradas
            </h3>
            <p className="text-gray-600 mb-4">
              Para registrar una atención, ve a Citas y haz clic en "Atender"
            </p>
            <button
              onClick={() => navigate("/citas")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              📅 Ir a Citas
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Paciente</th>
                  <th className="px-6 py-3 text-left">Médico</th>
                  <th className="px-6 py-3 text-left">Diagnóstico</th>
                  <th className="px-6 py-3 text-left">Monto</th>
                  <th className="px-6 py-3 text-left">Estado Pago</th>
                  <th className="px-6 py-3 text-left">Fecha</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {atenciones.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{a.paciente_nombre_completo}</td>
                    <td className="px-6 py-4">{a.medico_nombre_completo}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{a.diagnostico}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">${a.monto}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        a.estado_pago === "pagado"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {a.estado_pago === "pagado" ? "✅ Pagado" : "⏳ Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(a.fecha_atencion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/atenciones/${a.id}`)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
                        >
                          👁️ Ver
                        </button>
                        {a.estado_pago === "pendiente" && (
                          <button
                            onClick={() => navigate(`/facturas/nueva/${a.id}`)}
                            className="px-3 py-1 bg-green-600 text-white rounded"
                          >
                            💰 Cobrar
                          </button>
                        )}
                        {puedeEliminar && (
                          <button
                            onClick={() => borrarAtencion(a.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded"
                          >
                            🗑️ Borrar
                          </button>
                        )}
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