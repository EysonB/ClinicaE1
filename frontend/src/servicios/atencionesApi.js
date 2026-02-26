import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/atenciones';

export const getAllAtenciones = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

export const getAtencionById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/`);
  return response.data;
};

export const createAtencion = async (atencionData) => {
  const response = await axios.post(`${API_URL}/`, atencionData);
  return response.data;
};

export const updateAtencion = async (id, atencionData) => {
  const response = await axios.put(`${API_URL}/${id}/`, atencionData);
  return response.data;
};

export const deleteAtencion = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}/`);
  return response.data;
};

// Obtener atenciones pendientes de facturación
export const getAtencionesPendientes = async () => {
  const response = await axios.get(`${API_URL}/pendientes/`);
  return response.data;
};

// Obtener atenciones de un paciente específico
export const getAtencionesByPaciente = async (pacienteId) => {
  const response = await axios.get(`${API_URL}/paciente/${pacienteId}/`);
  return response.data;
};

// Obtener atenciones de un médico específico
export const getAtencionesByMedico = async (medicoId) => {
  const response = await axios.get(`${API_URL}/medico/${medicoId}/`);
  return response.data;
};