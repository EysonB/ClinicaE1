import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = "http://127.0.0.1:8000/api/medicos/";

export default function MedicoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [especialidadOtra, setEspecialidadOtra] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    if (esEdicion) {
      axios
        .get(`${BASE_URL}${id}/`)
        .then(res => {
          const m = res.data;
          setCedula(m.cedula);
          setNombre(m.nombre);
          setApellido(m.apellido || "");
          
          // Detectar si la especialidad está en la lista predefinida
          const especialidadesPredefinidas = [
            "Cardiología", "Dermatología", "Pediatría", "Ginecología",
            "Traumatología", "Neurología", "Oftalmología", "Psiquiatría",
            "Medicina General", "Odontología"
          ];
          
          if (especialidadesPredefinidas.includes(m.especialidad)) {
            setEspecialidad(m.especialidad);
          } else {
            setEspecialidad("Otra");
            setEspecialidadOtra(m.especialidad);
          }
          
          setEmail(m.email || "");
          setTelefono(m.telefono || "");
        })
        .catch(() => {
          toast.error("Error al cargar médico");
          navigate("/medicos");
        });
    }
  }, [id, esEdicion, navigate]);

  // Validación de teléfono (solo números, máximo 10)
  const handleTelefonoChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setTelefono(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar teléfono si se ingresó
    if (telefono && telefono.length !== 10) {
      toast.error("El teléfono debe tener exactamente 10 dígitos");
      return;
    }

    // Validar especialidad "Otra"
    if (especialidad === "Otra" && !especialidadOtra.trim()) {
      toast.error("Debe especificar la especialidad");
      return;
    }

    // Usar especialidadOtra si seleccionó "Otra", sino la del select
    const especialidadFinal = especialidad === "Otra" ? especialidadOtra : especialidad;

    const data = {
      cedula,
      nombre,
      apellido,
      especialidad: especialidadFinal,
      email,
      telefono,
    };

    const request = esEdicion
      ? axios.put(`${BASE_URL}${id}/`, data)
      : axios.post(BASE_URL, data);

    request
      .then(() => {
        toast.success(
          esEdicion ? "Médico actualizado correctamente" : "Médico creado correctamente"
        );
        navigate("/medicos");
      })
      .catch(err => {
        if (err.response?.data?.email) {
          toast.error("Ese email ya está registrado");
        } else if (err.response?.data?.cedula) {
          toast.error("Esa cédula ya está registrada");
        } else if (err.response?.data?.telefono) {
          toast.error("Ese teléfono ya está registrado");
        } else {
          toast.error("Error al guardar médico");
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {esEdicion ? "✏️ Editar Médico" : "➕ Nuevo Médico"}
          </h2>
          <p className="text-gray-600 mt-1">
            {esEdicion ? "Modifica los datos del médico" : "Complete el formulario para registrar un nuevo médico"}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Especialidad */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Especialidad <span className="text-red-500">*</span>
            </label>
            <select
              value={especialidad}
              onChange={e => {
                setEspecialidad(e.target.value);
                if (e.target.value !== "Otra") {
                  setEspecialidadOtra("");
                }
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Seleccione una especialidad</option>
              <option value="Cardiología">Cardiología</option>
              <option value="Dermatología">Dermatología</option>
              <option value="Pediatría">Pediatría</option>
              <option value="Ginecología">Ginecología</option>
              <option value="Traumatología">Traumatología</option>
              <option value="Neurología">Neurología</option>
              <option value="Oftalmología">Oftalmología</option>
              <option value="Psiquiatría">Psiquiatría</option>
              <option value="Medicina General">Medicina General</option>
              <option value="Odontología">Odontología</option>
              <option value="Otra">Otra (especificar)</option>
            </select>

            {/* Campo adicional cuando selecciona "Otra" */}
            {especialidad === "Otra" && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Especifique la especialidad"
                  value={especialidadOtra}
                  onChange={e => setEspecialidadOtra(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50"
                />
                <p className="mt-1 text-xs text-purple-600">
                  💡 Escriba la especialidad que no está en la lista
                </p>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Teléfono */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              placeholder="0987654321"
              value={telefono}
              onChange={handleTelefonoChange}
              maxLength={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {telefono.length > 0 && telefono.length < 10 && (
              <p className="mt-1 text-xs text-gray-500">
                Solo números, exactamente 10 dígitos ({telefono.length}/10)
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/medicos")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {esEdicion ? "💾 Guardar Cambios" : "✅ Crear Médico"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}