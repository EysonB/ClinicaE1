import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/facturas';

export const getAllFacturas = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

export const getFacturaById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/`);
  return response.data;
};

export const createFactura = async (facturaData) => {
  const response = await axios.post(`${API_URL}/`, facturaData);
  return response.data;
};

export const deleteFactura = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}/`);
  return response.data;
};

// Obtener facturas de un paciente
export const getFacturasByPaciente = async (pacienteId) => {
  const response = await axios.get(`${API_URL}/paciente/${pacienteId}/`);
  return response.data;
};

// Obtener facturas por rango de fechas
export const getFacturasByFechas = async (fechaInicio, fechaFin) => {
  const response = await axios.get(`${API_URL}/fechas/`, {
    params: { inicio: fechaInicio, fin: fechaFin }
  });
  return response.data;
};

// Obtener estadísticas de facturación
export const getEstadisticasFacturacion = async () => {
  const response = await axios.get(`${API_URL}/estadisticas/`);
  return response.data;
};