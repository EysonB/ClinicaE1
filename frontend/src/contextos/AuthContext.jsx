import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, logout as logoutApi, getCurrentUser } from '../servicios/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario desde localStorage al iniciar
    const currentUser = getCurrentUser();
    if (currentUser.id) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginApi(email, password);
      const userData = response.user;
      
      // Guardar en localStorage
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userName', userData.nombre);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userRole', userData.rol);
      
      if (userData.medico_id) {
        localStorage.setItem('medicoId', userData.medico_id);
      }
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};