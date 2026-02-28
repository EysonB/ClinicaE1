// FacturaDetail.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE from "../../config";

export default function FacturaDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/facturas/${id}/`)
      .then(res => { setFactura(res.data); setLoading(false); })
      .catch(() => { toast.error("Error al cargar la factura"); navigate("/facturas"); });
  }, [id, navigate]);

  if (loading) return <div className="p-8 text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div></div>;
  if (!factura) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex gap-3 print:hidden">
          <button onClick={() => navigate("/facturas")} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">← Volver</button>
          <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">🖨️ Imprimir</button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 print:shadow-none">
          <div className="border-b-2 border-gray-300 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">🏥 Clínica UD</h1>
                <p className="text-gray-600 mt-1">Sistema de Gestión Médica</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Factura N°:</p>
                <p className="text-2xl font-bold text-blue-600">{factura.numero_factura}</p>
                <p className="text-sm text-gray-600 mt-2">Fecha:</p>
                <p className="font-medium">{new Date(factura.fecha_emision).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Datos del Paciente:</h3>
            <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-3">
              <div><span className="text-sm text-gray-600">Nombre:</span><p className="font-medium">{factura.paciente_nombre} {factura.paciente_apellido}</p></div>
              <div><span className="text-sm text-gray-600">Cédula:</span><p className="font-medium">{factura.paciente_cedula}</p></div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Médico Tratante:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-600">Nombre:</span>
              <p className="font-medium">Dr. {factura.medico_nombre} {factura.medico_apellido}</p>
            </div>
          </div>
          <div className="mb-6">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 border-b border-gray-300">Descripción</th>
                  <th className="text-right p-3 border-b border-gray-300">Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b border-gray-200"><p className="font-medium">Consulta Médica</p><p className="text-sm text-gray-600">{factura.diagnostico}</p></td>
                  <td className="text-right p-3 border-b border-gray-200 font-medium">${factura.monto}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t-2 border-gray-300 pt-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-600">Método de Pago:</p>
                <p className="font-semibold">
                  {factura.metodo_pago === 'efectivo' && '💵 Efectivo'}
                  {factura.metodo_pago === 'tarjeta' && '💳 Tarjeta'}
                  {factura.metodo_pago === 'transferencia' && '🏦 Transferencia'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Pagado:</p>
                <p className="text-3xl font-bold text-green-600">${factura.monto}</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-semibold">✓ PAGADO</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media print { body * { visibility: hidden; } .bg-white, .bg-white * { visibility: visible; } .bg-white { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
}