import axios from 'axios';

const API_URL = 'http://localhost:8081/api/reservas';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

export const getReservas = () => axios.get(API_URL, getAuthHeaders());
export const createReserva = (data: any) => axios.post(API_URL, data, getAuthHeaders());
export const searchReservas = (cidade: string, inicio: string, fim: string) =>
  axios.get(`${API_URL}/buscar?cidade=${cidade}&inicio=${inicio}&fim=${fim}`, getAuthHeaders());
export const getEstatisticas = () => axios.get(`${API_URL}/estatisticas`, getAuthHeaders());
