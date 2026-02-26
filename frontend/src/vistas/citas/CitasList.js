import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BASE = "http://127.0.0.1:8000/api";

export default function CitasList() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");
  const medicoId = localStorage.getItem("medicoId");

  const obtenerCitas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE}/citas/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();

      // Filtrar si es médico (superadmin ve todo)
      if (userRole === "medico") {
        data = data.filter(
          (c) =>
            String(c.medico) === String(medicoId)
        );
      }

      setCitas(data);
    } catch (err) {
      console.error("Error obtenerCitas:", err);
      toast.error("Error al cargar citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCitas();
  }, []);

  const borrarCita = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta cita?")) return;
    try {
      const res = await fetch(`${BASE}/citas/${id}/`, { method: "DELETE" });
      if (res.status === 204 || res.status === 200) {
        setCitas((prev) => prev.filter((c) => c.id !== id));
        toast.success("Cita eliminada correctamente");
      } else {
        throw new Error(`delete failed ${res.status}`);
      }
    } catch (err) {
      console.error("Error borrarCita:", err);
      toast.error("No se pudo eliminar la cita");
    }
  };

  // Helper para verificar permisos
  const puedeCrearEditar = userRole === "enfermera" || userRole === "superadmin";
  const puedeAtender = userRole === "medico" || userRole === "superadmin";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              📅 {userRole === "medico" ? "Mis Citas" : "Lista de Citas"}
            </h2>
            <p className="text-gray-600 mt-1">
              {userRole === "medico"
                ? "Citas asignadas a usted"
                : "Gestión de todas las citas médicas"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={obtenerCitas}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              disabled={loading}
            >
              🔄 Actualizar
            </button>

            {/* ➕ ENFERMERA Y SUPERADMIN PUEDEN CREAR */}
            {puedeCrearEditar && (
              <button
                onClick={() => navigate("/citas/nueva")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ➕ Nueva Cita
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Cargando citas...</div>
        ) : citas.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No hay citas registradas
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Paciente</th>
                  <th className="px-6 py-3 text-left">Médico</th>
                  <th className="px-6 py-3 text-left">Fecha</th>
                  <th className="px-6 py-3 text-left">Hora</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {citas.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{c.paciente_nombre ?? c.paciente}</td>
                    <td className="px-6 py-4">{c.medico_nombre ?? c.medico}</td>
                    <td className="px-6 py-4">{c.fecha}</td>
                    <td className="px-6 py-4">{c.hora}</td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">

                        {/* 👁️ TODOS VEN */}
                        <button
                          onClick={() => navigate(`/citas/${c.id}`)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
                        >
                          👁️ Ver
                        </button>

                        {/* ✏️ ENFERMERA Y SUPERADMIN EDITAN */}
                        {puedeCrearEditar && (
                          <button
                            onClick={() => navigate(`/citas/editar/${c.id}`)}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded"
                          >
                            ✏️ Editar
                          </button>
                        )}

                        {/* 🩺 MÉDICO Y SUPERADMIN ATIENDEN (solo si está agendada) */}
                        {puedeAtender && c.estado === "pendiente" && (
                          <button
                            onClick={() => navigate(`/atenciones/nueva/${c.id}`)}
                            className="px-3 py-1 bg-green-600 text-white rounded"
                          >
                            🩺 Atender
                          </button>
                        )}

                        {/* 🗑️ ENFERMERA Y SUPERADMIN BORRAN */}
                        {puedeCrearEditar && (
                          <button
                            onClick={() => borrarCita(c.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded"
                          >
                            🗑️ Borrar
                          </button>
                        )}

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