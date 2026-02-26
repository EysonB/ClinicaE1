import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/medicos';

export const getAllMedicos = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

export const getMedicoById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/`);
  return response.data;
};

export const createMedico = async (medicoData) => {
  const response = await axios.post(`${API_URL}/`, medicoData);
  return response.data;
};

export const updateMedico = async (id, medicoData) => {
  const response = await axios.put(`${API_URL}/${id}/`, medicoData);
  return response.data;
};

export const deleteMedico = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}/`);
  return response.data;
};