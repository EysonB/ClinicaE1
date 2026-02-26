import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/pacientes';

export const getAllPacientes = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

export const getPacienteById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/`);
  return response.data;
};

export const createPaciente = async (pacienteData) => {
  const response = await axios.post(`${API_URL}/`, pacienteData);
  return response.data;
};

export const updatePaciente = async (id, pacienteData) => {
  const response = await axios.put(`${API_URL}/${id}/`, pacienteData);
  return response.data;
};

export const deletePaciente = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}/`);
  return response.data;
};