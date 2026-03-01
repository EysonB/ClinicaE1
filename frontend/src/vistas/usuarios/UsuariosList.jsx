import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import API_BASE from "../../config";
const BASE = API_BASE;

const ROL_LABELS = {
  superadmin: "👑 Superadmin",
  enfermera: "🗂️ Administrador",
  medico: "👨‍⚕️ Médico",
};

const generarPassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [passwordModal, setPasswordModal] = useState(null);
  const navigate = useNavigate();

  const obtenerUsuarios = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE}/usuarios/`);
      setUsuarios(res.data);
    } catch (err) {
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const desactivarUsuario = async (id, nombre) => {
    if (!window.confirm(`¿Desactivar al usuario ${nombre}?`)) return;
    try {
      await axios.delete(`${BASE}/usuarios/${id}/`);
      toast.success("Usuario desactivado correctamente");
      obtenerUsuarios();
    } catch (err) {
      toast.error("Error al desactivar usuario");
    }
  };

  const resetearPassword = async (usuario) => {
    const nuevaPassword = generarPassword();
    try {
      await axios.put(`${BASE}/usuarios/${usuario.id}/`, {
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo,
        password: nuevaPassword,
        ...(usuario.rol === "medico" ? { medico_id: usuario.medico_id } : { medico_id: null }),
      });
      setPasswordModal({ nombre: usuario.nombre, password: nuevaPassword });
    } catch (err) {
      toast.error("Error al resetear contraseña");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">👥 Gestión de Usuarios</h2>
            <p className="text-gray-600 mt-1">Administrar usuarios del sistema</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={obtenerUsuarios}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              disabled={loading}
            >
              🔄 Actualizar
            </button>
            <button
              onClick={() => navigate("/usuarios/nuevo")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ➕ Nuevo Usuario
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Cargando usuarios...</div>
        ) : usuarios.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No hay usuarios registrados</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Rol</th>
                  <th className="px-6 py-3 text-left">Médico Vinculado</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{u.nombre}</td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4">{ROL_LABELS[u.rol] ?? u.rol}</td>
                    <td className="px-6 py-4 text-gray-600">{u.medico_nombre ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {u.activo ? "✅ Activo" : "❌ Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/usuarios/editar/${u.id}`)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => resetearPassword(u)}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                        >
                          🔑 Resetear
                        </button>
                        {u.activo && (
                          <button
                            onClick={() => desactivarUsuario(u.id, u.nombre)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            🚫 Desactivar
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

      {/* Modal contraseña generada */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">🔑 Contraseña Reseteada</h3>
            <p className="text-gray-600 mb-4">
              Nueva contraseña para <span className="font-semibold">{passwordModal.nombre}</span>:
            </p>
            <div className="bg-gray-100 rounded-lg p-4 text-center mb-4">
              <p className="text-2xl font-mono font-bold text-blue-600 tracking-widest">
                {passwordModal.password}
              </p>
            </div>
            <p className="text-sm text-red-600 mb-4">
              ⚠️ Anota esta contraseña, no se volverá a mostrar.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(passwordModal.password);
                  toast.success("Contraseña copiada al portapapeles");
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                📋 Copiar
              </button>
              <button
                onClick={() => setPasswordModal(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ✅ Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}