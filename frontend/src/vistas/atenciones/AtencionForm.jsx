import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE from "../../config";

export default function AtencionForm() {
  const navigate = useNavigate();
  const { citaId } = useParams();

  const [cita, setCita] = useState(null);
  const [diagnostico, setDiagnostico] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [monto, setMonto] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/citas/${citaId}/`)
      .then(res => {
        setCita(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error al cargar la cita");
        navigate("/citas");
      });
  }, [citaId, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!monto || parseFloat(monto) <= 0) {
      toast.error("Debe ingresar un monto válido");
      return;
    }

    const data = {
      cita: parseInt(citaId),
      diagnostico,
      tratamiento,
      observaciones,
      monto: parseFloat(monto),
    };

    axios
      .post(`${API_BASE}/atenciones/`, data)
      .then(() => {
        toast.success("Atención registrada correctamente");
        navigate("/atenciones");
      })
      .catch(err => {
        console.error(err.response?.data);
        if (err.response?.data?.cita) {
          toast.error("Esta cita ya tiene una atención registrada");
        } else {
          toast.error("Error al registrar la atención");
        }
      });
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🩺 Registrar Atención Médica</h2>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-900 mb-2">Información de la Cita:</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-600">Paciente:</span><p className="font-medium">{cita?.paciente_nombre}</p></div>
              <div><span className="text-gray-600">Médico:</span><p className="font-medium">{cita?.medico_nombre}</p></div>
              <div><span className="text-gray-600">Fecha:</span><p className="font-medium">{cita?.fecha}</p></div>
              <div><span className="text-gray-600">Hora:</span><p className="font-medium">{cita?.hora}</p></div>
              {cita?.motivo && (
                <div className="col-span-2"><span className="text-gray-600">Motivo:</span><p className="font-medium">{cita.motivo}</p></div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnóstico <span className="text-red-500">*</span></label>
            <textarea placeholder="Describa el diagnóstico" value={diagnostico} onChange={e => setDiagnostico(e.target.value)} required rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tratamiento</label>
            <textarea placeholder="Medicamentos, terapias..." value={tratamiento} onChange={e => setTratamiento(e.target.value)} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Observaciones</label>
            <textarea placeholder="Notas adicionales..." value={observaciones} onChange={e => setObservaciones(e.target.value)} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Costo de la Consulta <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 text-lg">$</span>
              <input type="number" step="0.01" min="0" placeholder="0.00" value={monto} onChange={e => setMonto(e.target.value)} required className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => navigate("/citas")} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">✅ Registrar Atención</button>
          </div>
        </form>
      </div>
    </div>
  );
}