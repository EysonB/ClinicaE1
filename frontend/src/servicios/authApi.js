import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('medicoId');
};

export const getCurrentUser = () => {
  return {
    id: localStorage.getItem('userId'),
    nombre: localStorage.getItem('userName'),
    email: localStorage.getItem('userEmail'),
    rol: localStorage.getItem('userRole'),
    medicoId: localStorage.getItem('medicoId')
  };
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('userId');
};