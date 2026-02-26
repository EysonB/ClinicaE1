import axios from 'axios';

const API_URL = 'http://localhost:8000/api/especialidades';

export const getAllEspecialidades = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getEspecialidadById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createEspecialidad = async (especialidadData) => {
  const response = await axios.post(API_URL, especialidadData);
  return response.data;
};

export const updateEspecialidad = async (id, especialidadData) => {
  const response = await axios.put(`${API_URL}/${id}`, especialidadData);
  return response.data;
};

export const deleteEspecialidad = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};