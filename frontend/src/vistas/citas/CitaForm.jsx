import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";

const CitaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [paciente, setPaciente] = useState(null);
  const [medico, setMedico] = useState(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  const [pacientesList, setPacientesList] = useState([]);
  const [medicosList, setMedicosList] = useState([]);

  // 🔵 Cargar pacientes y médicos
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/pacientes/")
      .then(res => {
        const options = res.data.map(p => ({
          value: p.id,
          label: `${p.nombre} ${p.apellido} - ${p.cedula}`
        }));
        setPacientesList(options);
      })
      .catch(err => console.error("Error cargando pacientes:", err));

    axios.get("http://127.0.0.1:8000/api/medicos/")
      .then(res => {
        const options = res.data.map(m => ({
          value: m.id,
          label: `Dr. ${m.nombre} ${m.apellido} - ${m.especialidad}`
        }));
        setMedicosList(options);
      })
      .catch(err => console.error("Error cargando médicos:", err));
  }, []);

  // 🔵 Cargar datos si es edición
  useEffect(() => {
    if (esEdicion) {
      axios.get(`http://127.0.0.1:8000/api/citas/${id}/`)
        .then(res => {
          const cita = res.data;
          setFecha(cita.fecha);
          setHora(cita.hora);
          setMotivo(cita.motivo);
          
          setPaciente({ value: cita.paciente, label: "Cargando..." });
          setMedico({ value: cita.medico, label: "Cargando..." });
        })
        .catch(() => {
          toast.error("Error al cargar la cita");
          navigate("/citas");
        });
    }
  }, [esEdicion, id, navigate]);

  // 🔵 Enviar la cita
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!paciente || !medico) {
      toast.error("Debe seleccionar paciente y médico");
      return;
    }

    const data = {
      paciente: paciente.value,
      medico: medico.value,
      fecha,
      hora,
      motivo,
    };

    const request = esEdicion
      ? axios.put(`http://127.0.0.1:8000/api/citas/${id}/`, data)
      : axios.post("http://127.0.0.1:8000/api/citas/", data);

    request
      .then(() => {
        toast.success(esEdicion ? "Cita actualizada correctamente" : "Cita creada correctamente");
        navigate("/citas");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error al guardar la cita");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {esEdicion ? "✏️ Editar Cita" : "➕ Nueva Cita"}
          </h2>
          <p className="text-gray-600 mt-1">
            {esEdicion ? "Modifica los datos de la cita" : "Complete el formulario para agendar una cita"}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          
          {/* Paciente */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Paciente <span className="text-red-500">*</span>
            </label>
            <Select
              value={paciente}
              onChange={setPaciente}
              options={pacientesList}
              placeholder="Buscar paciente por nombre o cédula..."
              isClearable
              isSearchable
              noOptionsMessage={() => "No se encontraron pacientes"}
              className="text-sm"
            />
          </div>

          {/* Médico */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Médico <span className="text-red-500">*</span>
            </label>
            <Select
              value={medico}
              onChange={setMedico}
              options={medicosList}
              placeholder="Buscar médico por nombre o especialidad..."
              isClearable
              isSearchable
              noOptionsMessage={() => "No se encontraron médicos"}
              className="text-sm"
            />
          </div>

          {/* Fecha y Hora en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                value={fecha} 
                onChange={e => setFecha(e.target.value)} 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Hora */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hora <span className="text-red-500">*</span>
              </label>
              <input 
                type="time" 
                value={hora} 
                onChange={e => setHora(e.target.value)} 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Motivo */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Motivo de la consulta
            </label>
            <textarea
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              placeholder="Describe el motivo de la consulta..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/citas")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {esEdicion ? "💾 Guardar Cambios" : "✅ Crear Cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CitaForm;