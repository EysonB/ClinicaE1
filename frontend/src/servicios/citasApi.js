import axios from 'axios';

const API_URL = 'http://localhost:8000/api/citas';

export const getAllCitas = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getCitaById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createCita = async (citaData) => {
  const response = await axios.post(API_URL, citaData);
  return response.data;
};

export const updateCita = async (id, citaData) => {
  const response = await axios.put(`${API_URL}/${id}`, citaData);
  return response.data;
};

export const deleteCita = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
