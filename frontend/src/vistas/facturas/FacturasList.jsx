import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import API_BASE from "../../config";

function FacturasList() {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { obtenerFacturas(); }, []);

  const obtenerFacturas = () => {
    setLoading(true);
    axios.get(`${API_BASE}/facturas/`)
      .then(res => setFacturas(res.data))
      .catch(() => toast.error("Error al cargar facturas"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🧾 Facturas Emitidas</h2>
            <p className="text-gray-600 mt-1">Registro de todas las facturas generadas</p>
          </div>
          <div className="flex gap-3">
            <button onClick={obtenerFacturas} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" disabled={loading}>🔄 Actualizar</button>
            <button onClick={() => navigate("/facturacion/pendientes")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">💰 Cobrar Pendientes</button>
          </div>
        </div>
        {!loading && facturas.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Total de facturas emitidas: <span className="font-semibold text-gray-900">{facturas.length}</span></p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div></div>
        ) : facturas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🧾</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay facturas emitidas</h3>
            <button onClick={() => navigate("/facturacion/pendientes")} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">💰 Ir a Pendientes de Cobro</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">N° Factura</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Método</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facturas.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">{f.numero_factura}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{f.paciente_nombre_completo}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">${f.monto}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {f.metodo_pago === 'efectivo' && '💵 Efectivo'}
                        {f.metodo_pago === 'tarjeta' && '💳 Tarjeta'}
                        {f.metodo_pago === 'transferencia' && '🏦 Transferencia'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(f.fecha_emision).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => navigate(`/facturas/${f.id}`)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">👁️ Ver</button>
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

export default FacturasList;