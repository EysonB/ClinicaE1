import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function FacturaForm() {
  const navigate = useNavigate();
  const { atencionId } = useParams(); // ID de la atención a facturar

  const [atencion, setAtencion] = useState(null);
  const [metodoPago, setMetodoPago] = useState("");
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    // Cargar datos de la atención
    axios
      .get(`http://127.0.0.1:8000/api/atenciones/${atencionId}/`)
      .then(res => {
        if (res.data.estado_pago === 'pagado') {
          toast.error("Esta atención ya está pagada");
          navigate("/facturacion/pendientes");
          return;
        }
        setAtencion(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error al cargar la atención");
        navigate("/facturacion/pendientes");
      });
  }, [atencionId, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!metodoPago) {
      toast.error("Debe seleccionar un método de pago");
      return;
    }

    setProcesando(true);

    const data = {
      atencion: parseInt(atencionId),
      metodo_pago: metodoPago,
      // NO necesitas monto, el backend lo toma solo
    };

    axios
      .post("http://127.0.0.1:8000/api/facturas/", data)
      .then((response) => {
        toast.success(`Factura ${response.data.numero_factura} generada correctamente`);
        navigate(`/facturas/${response.data.id}`);
      })
      .catch(err => {
        console.error(err);
        if (err.response?.data?.atencion) {
          toast.error("Esta atención ya tiene una factura");
        } else {
          toast.error("Error al generar la factura");
        }
        setProcesando(false);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            💰 Generar Factura
          </h2>
          
          {/* Información de la Atención */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-900 mb-3">Información de la Atención:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Paciente:</span>
                <p className="font-medium text-gray-900">
                  {atencion?.paciente_nombre} {atencion?.paciente_apellido}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Cédula:</span>
                <p className="font-medium text-gray-900">{atencion?.paciente_cedula}</p>
              </div>
              <div>
                <span className="text-gray-600">Médico:</span>
                <p className="font-medium text-gray-900">
                  Dr. {atencion?.medico_nombre} {atencion?.medico_apellido}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Especialidad:</span>
                <p className="font-medium text-gray-900">{atencion?.medico_especialidad}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Diagnóstico:</span>
                <p className="font-medium text-gray-900">{atencion?.diagnostico}</p>
              </div>
            </div>
          </div>

          {/* Monto Total */}
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Monto Total a Cobrar:</p>
            <p className="text-4xl font-bold text-green-600">${atencion?.monto}</p>
          </div>
        </div>

        {/* Formulario de Pago */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          
          <h3 className="text-lg font-bold text-gray-800 mb-4">Método de Pago</h3>

          {/* Opciones de Pago */}
          <div className="space-y-3 mb-6">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="metodo_pago"
                value="efectivo"
                checked={metodoPago === "efectivo"}
                onChange={e => setMetodoPago(e.target.value)}
                className="w-5 h-5 text-blue-600"
              />
              <div className="ml-3 flex items-center gap-2">
                <span className="text-2xl">💵</span>
                <div>
                  <p className="font-semibold text-gray-900">Efectivo</p>
                  <p className="text-xs text-gray-500">Pago en efectivo</p>
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="metodo_pago"
                value="tarjeta"
                checked={metodoPago === "tarjeta"}
                onChange={e => setMetodoPago(e.target.value)}
                className="w-5 h-5 text-blue-600"
              />
              <div className="ml-3 flex items-center gap-2">
                <span className="text-2xl">💳</span>
                <div>
                  <p className="font-semibold text-gray-900">Tarjeta</p>
                  <p className="text-xs text-gray-500">Débito o crédito</p>
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="metodo_pago"
                value="transferencia"
                checked={metodoPago === "transferencia"}
                onChange={e => setMetodoPago(e.target.value)}
                className="w-5 h-5 text-blue-600"
              />
              <div className="ml-3 flex items-center gap-2">
                <span className="text-2xl">🏦</span>
                <div>
                  <p className="font-semibold text-gray-900">Transferencia</p>
                  <p className="text-xs text-gray-500">Transferencia bancaria</p>
                </div>
              </div>
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/facturacion/pendientes")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={procesando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={procesando}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {procesando ? "Generando..." : "✅ Generar Factura"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}