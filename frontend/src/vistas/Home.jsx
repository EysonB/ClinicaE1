import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "📅 Citas",
      description: "Gestionar citas médicas",
      path: "/citas",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "👥 Pacientes",
      description: "Administrar pacientes",
      path: "/pacientes",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "🩺 Médicos",
      description: "Gestionar médicos",
      path: "/medicos",
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🏥 UD Clínica
        </h1>
        <p className="text-lg text-gray-600">
          Sistema de Gestión Médica - Panel Principal
        </p>
      </div>

      {/* Módulos en tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div
            key={module.path}
            onClick={() => navigate(module.path)}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 overflow-hidden"
          >
            {/* Color top bar */}
            <div className={`h-2 ${module.color.split(' ')[0]}`}></div>
            
            {/* Contenido */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {module.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {module.description}
              </p>
              <button
                className={`w-full py-2 px-4 text-white rounded-lg ${module.color} transition-colors`}
              >
                Acceder →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de bienvenida/info adicional */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Bienvenido al sistema
            </h3>
            <p className="text-gray-600">
              Selecciona un módulo para comenzar a gestionar citas, pacientes o médicos.
              Todos los cambios se guardan automáticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}