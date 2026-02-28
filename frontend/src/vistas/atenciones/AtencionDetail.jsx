import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE from "../../config";

export default function AtencionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [atencion, setAtencion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/atenciones/${id}/`)
      .then((res) => {
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
          <p className="mt-4 text-gray-600">Cargando atención...</p>
        </div>
      </div>
    );
  }

  if (!atencion) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-800">🩺 Detalle de Atención</h2>
          <div className="flex gap-2">
            {atencion.estado_pago === "pendiente" && (
              <button
                onClick={() => navigate(`/facturas/nueva/${atencion.id}`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                💰 Cobrar
              </button>
            )}
            <button
              onClick={() => navigate("/atenciones")}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Información del Paciente</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Nombre:</span>
            <p className="font-medium">{atencion.paciente_nombre} {atencion.paciente_apellido}</p>
          </div>
          <div>
            <span className="text-gray-500">Cédula:</span>
            <p className="font-medium">{atencion.paciente_cedula}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Información Médica</h3>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="text-gray-500">Médico:</span>
            <p className="font-medium">Dr. {atencion.medico_nombre} {atencion.medico_apellido}</p>
          </div>
          <div>
            <span className="text-gray-500">Especialidad:</span>
            <p className="font-medium">{atencion.medico_especialidad}</p>
          </div>
          <div>
            <span className="text-gray-500">Fecha:</span>
            <p className="font-medium">{new Date(atencion.fecha_atencion).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-gray-500">Estado Pago:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              atencion.estado_pago === "pagado"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {atencion.estado_pago === "pagado" ? "✅ Pagado" : "⏳ Pendiente"}
            </span>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-500">Diagnóstico:</span>
            <p className="font-medium mt-1">{atencion.diagnostico}</p>
          </div>
          {atencion.tratamiento && (
            <div>
              <span className="text-gray-500">Tratamiento:</span>
              <p className="font-medium mt-1">{atencion.tratamiento}</p>
            </div>
          )}
          {atencion.observaciones && (
            <div>
              <span className="text-gray-500">Observaciones:</span>
              <p className="font-medium mt-1">{atencion.observaciones}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Monto:</span>
          <span className="text-2xl font-bold text-gray-800">${atencion.monto}</span>
        </div>
      </div>
    </div>
  );
}