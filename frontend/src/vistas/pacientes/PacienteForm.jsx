import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";


import API_BASE from "../../config";
const BASE_URL = `${API_BASE}/pacientes/`;

export default function PacienteForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  // 🔹 Cargar paciente si es edición
  useEffect(() => {
    if (esEdicion) {
      axios
        .get(`${BASE_URL}${id}/`)
        .then(res => {
          const p = res.data;
          setCedula(p.cedula);
          setNombre(p.nombre);
          setApellido(p.apellido);
          
          // Separar fecha_nacimiento en día, mes, año
          if (p.fecha_nacimiento) {
            const [anioVal, mesVal, diaVal] = p.fecha_nacimiento.split('-');
            setAnio(anioVal);
            setMes(mesVal);
            setDia(diaVal);
          }
          
          setEmail(p.email);
          setTelefono(p.telefono ?? "");
          setDireccion(p.direccion ?? "");
        })
        .catch(() => {
          toast.error("Error al cargar paciente");
          navigate("/pacientes");
        });
    }
  }, [id, esEdicion, navigate]);

  // 🔹 Validación de teléfono (solo números, máximo 10)
  const handleTelefonoChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Solo números
    if (value.length <= 10) {
      setTelefono(value);
    }
  };

  // 🔹 Crear o editar
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación adicional del teléfono
    if (telefono.length !== 10) {
      toast.error("El teléfono debe tener exactamente 10 dígitos");
      return;
    }

    // Validar que todos los campos de fecha estén completos
    if (!dia || !mes || !anio) {
      toast.error("Debe completar la fecha de nacimiento");
      return;
    }

    // Construir fecha en formato YYYY-MM-DD
    const fechaNacimiento = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

    const data = {
      cedula,
      nombre,
      apellido,
      fecha_nacimiento: fechaNacimiento,
      email,
      telefono,
      direccion,
    };

    const request = esEdicion
      ? axios.put(`${BASE_URL}${id}/`, data)
      : axios.post(BASE_URL, data);

    request
      .then(() => {
        toast.success(
          esEdicion ? "Paciente actualizado correctamente" : "Paciente creado correctamente"
        );
        navigate("/pacientes");
      })
      .catch(err => {
        if (err.response?.data?.email) {
          toast.error("Ese email ya está registrado");
        } else if (err.response?.data?.telefono) {
          toast.error("Ese teléfono ya está registrado");
        } else if (err.response?.data?.cedula) {
          toast.error("Esa cédula ya está registrada");
        } else {
          toast.error("Error al guardar paciente");
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {esEdicion ? "✏️ Editar Paciente" : "➕ Nuevo Paciente"}
          </h2>
          <p className="text-gray-600 mt-1">
            {esEdicion ? "Modifica los datos del paciente" : "Complete el formulario para registrar un nuevo paciente"}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          
          {/* ID - Solo visible en edición */}
          {esEdicion && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ID (solo lectura)
              </label>
              <input
                value={id}
                disabled
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed text-gray-500"
              />
            </div>
          )}

          {/* Cédula */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cédula <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ingrese la cédula"
              value={cedula}
              onChange={e => setCedula(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Nombre y Apellido en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={e => setApellido(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Teléfono - VALIDADO */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="0987654321"
              value={telefono}
              onChange={handleTelefonoChange}
              required
              maxLength={10}
              pattern="\d{10}"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Solo números, exactamente 10 dígitos {telefono.length > 0 && `(${telefono.length}/10)`}
            </p>
          </div>

          {/* Fecha de Nacimiento */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha de Nacimiento <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Día */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Día</label>
                <select
                  value={dia}
                  onChange={e => setDia(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Día</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Mes */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Mes</label>
                <select
                  value={mes}
                  onChange={e => setMes(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Mes</option>
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
              </div>

              {/* Año */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Año</label>
                <select
                  value={anio}
                  onChange={e => setAnio(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Año</option>
                  {Array.from({ length: 105 }, (_, i) => 2024 - i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dirección
            </label>
            <textarea
              placeholder="Dirección completa (opcional)"
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/pacientes")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {esEdicion ? "💾 Guardar Cambios" : "✅ Crear Paciente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}