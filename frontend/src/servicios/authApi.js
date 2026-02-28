import axios from 'axios';
import API_BASE from '../config';

export const login = async (email, password) => {
  const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('medicoId');
};

export const getCurrentUser = () => ({
  id: localStorage.getItem('userId'),
  nombre: localStorage.getItem('userName'),
  email: localStorage.getItem('userEmail'),
  rol: localStorage.getItem('userRole'),
  medicoId: localStorage.getItem('medicoId'),
});

export const isAuthenticated = () => !!localStorage.getItem('userId');