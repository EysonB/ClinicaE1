import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../servicios/authApi';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginApi(formData.email, formData.password);
      const userData = response.user;
      
      // Guardar en localStorage
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userName', userData.nombre);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userRole', userData.rol);
      
      if (userData.medico_id) {
        localStorage.setItem('medicoId', userData.medico_id);
      }
      
      alert(`Bienvenido ${userData.nombre}`);
      navigate('/');
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            🏥 Sistema Clínico
          </h1>
          <p className="text-gray-600">Inicie sesión para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              placeholder="usuario@clinica.com"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-600 bg-gray-50 p-4 rounded border">
          <p className="font-semibold mb-3 text-gray-800">👤 Usuarios de prueba:</p>
          <div className="space-y-2">
            <div>
              <p className="font-medium">👑 Superadmin:</p>
              <p className="text-xs ml-4">no</p>
            </div>
            <div>
              <p className="font-medium">👩‍⚕️ Enfermera (administrador):</p>
              <p className="text-xs ml-4">rigo@clinica.com / 12345</p>
            </div>
            <div>
              <p className="font-medium">👨‍⚕️ Médico:</p>
              <p className="text-xs ml-4">elian@clinica.com / 12345</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}