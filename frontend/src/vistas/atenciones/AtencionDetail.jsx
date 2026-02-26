import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function AtencionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [atencion, setAtencion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/atenciones/${id}/`)
      .then(res => {
        setAtencion(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error al cargar la atención");
        navigate("/atenciones");
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!atencion) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                🩺 Detalle de Atención Médica
              </h2>
              <p className="text-gray-600 mt-1">Atención #{atencion.id}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              atencion.estado_pago === 'pagado' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {atencion.estado_pago === 'pagado' ? '✓ Pagado' : '⏳ Pendiente de Pago'}
            </span>
          </div>
        </div>

        {/* Información del Paciente */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">👤 Información del Paciente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Nombre:</span>
              <p className="font-medium text-gray-900">{atencion.paciente_nombre} {atencion.paciente_apellido}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Cédula:</span>
              <p className="font-medium text-gray-900">{atencion.paciente_cedula}</p>
            </div>
          </div>
        </div>

        {/* Información del Médico */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">👨‍⚕️ Información del Médico</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Nombre:</span>
              <p className="font-medium text-gray-900">Dr. {atencion.medico_nombre} {atencion.medico_apellido}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Especialidad:</span>
              <p className="font-medium text-gray-900">{atencion.medico_especialidad}</p>
            </div>
          </div>
        </div>

        {/* Información de la Cita */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📅 Datos de la Cita</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-600">Fecha:</span>
              <p className="font-medium text-gray-900">{atencion.cita_fecha}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Hora:</span>
              <p className="font-medium text-gray-900">{atencion.cita_hora}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Fecha de Atención:</span>
              <p className="font-medium text-gray-900">
                {new Date(atencion.fecha_atencion).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Diagnóstico y Tratamiento */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Diagnóstico y Tratamiento</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnóstico:</label>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-900 whitespace-pre-wrap">{atencion.diagnostico}</p>
            </div>
          </div>

          {atencion.tratamiento && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tratamiento:</label>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-900 whitespace-pre-wrap">{atencion.tratamiento}</p>
              </div>
            </div>
          )}

          {atencion.observaciones && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Observaciones:</label>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-900 whitespace-pre-wrap">{atencion.observaciones}</p>
              </div>
            </div>
          )}
        </div>

        {/* Información de Pago */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💰 Información de Pago</h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-600">Monto de la consulta:</span>
              <p className="text-3xl font-bold text-indigo-600">${atencion.monto}</p>
            </div>
            {atencion.tiene_factura && (
              <button
                onClick={() => navigate(`/facturas/${atencion.id}`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Ver Factura
              </button>
            )}
            {!atencion.tiene_factura && atencion.estado_pago === 'pendiente' && (
              <button
                onClick={() => navigate(`/facturas/nueva/${atencion.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generar Factura
              </button>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/atenciones")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Volver a Atenciones
          </button>
        </div>
      </div>
    </div>
  );
}