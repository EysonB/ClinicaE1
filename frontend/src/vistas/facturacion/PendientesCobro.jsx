import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import API_BASE from "../../config";

function PendientesCobro() {
  const navigate = useNavigate();
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    obtenerPendientes();
  }, []);

  const obtenerPendientes = () => {
    setLoading(true);
    axios
      .get(`${API_BASE}/atenciones/pendientes/`)
      .then((response) => setPendientes(response.data))
      .catch(() => toast.error("Error al cargar atenciones pendientes"))
      .finally(() => setLoading(false));
  };

  const calcularTotal = () =>
    pendientes.reduce((sum, p) => sum + parseFloat(p.monto), 0).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">💰 Pendientes de Cobro</h2>
            <p className="text-gray-600 mt-1">Atenciones médicas pendientes de pago</p>
          </div>
          <div className="flex gap-3">
            <button onClick={obtenerPendientes} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" disabled={loading}>🔄 Actualizar</button>
            <button onClick={() => navigate("/facturas")} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Ver Facturas Emitidas</button>
          </div>
        </div>
        {!loading && pendientes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Atenciones Pendientes:</p>
                <p className="text-2xl font-bold text-yellow-700">{pendientes.length}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total por Cobrar:</p>
                <p className="text-2xl font-bold text-red-700">${calcularTotal()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Cargando pendientes...</p>
          </div>
        ) : pendientes.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">¡No hay pendientes de cobro!</h3>
            <p className="text-gray-600 mb-6">Todas las atenciones han sido facturadas</p>
            <button onClick={() => navigate("/atenciones")} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Ver Todas las Atenciones</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Médico</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Diagnóstico</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendientes.map((p) => (
                  <tr key={p.id} className="hover:bg-yellow-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.paciente_nombre_completo}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{p.medico_nombre_completo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{p.diagnostico}</td>
                    <td className="px-6 py-4 text-sm font-bold text-red-600">${p.monto}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(p.fecha_atencion).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => navigate(`/atenciones/${p.id}`)} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200">👁️ Ver</button>
                        <button onClick={() => navigate(`/facturas/nueva/${p.id}`)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-semibold">💰 Cobrar</button>
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

export default PendientesCobro;