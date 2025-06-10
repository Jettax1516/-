import axios from "axios";
import { ACCES_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCES_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getClients = async () => {
  try {
    const response = await api.get("api/clients/");
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

export const createClient = async (clientData) => {
  try {
    const response = await api.post("/api/clients/", {
      ...clientData,
      check_out_date: clientData.check_out_date || null, // Обработка пустой даты
    });
    return response.data;
  } catch (error) {
    console.error("Create error:", error.response?.data);
    throw error;
  }
};

export const updateClient = async (id, clientData) => {
  try {
    const response = await api.put(`/api/clients/${id}/`, {
      ...clientData,
      check_out_date: clientData.check_out_date || null,
    });
    return response.data;
  } catch (error) {
    console.error("Update error:", error.response?.data);
    throw error;
  }
};

export const deleteClient = async (id) => {
  const response = await api.delete(`/api/clients/delete/${id}/`);
  return response.data;
};

export const getRooms = async () => {
  const response = await api.get("/api/rooms/");
  return response.data;
};

export const createDocument = async (documentData) => {
  const response = await api.post("api/documents/", documentData);
  return response.data;
};

export const getClientDocuments = async (clientId) => {
  const response = await api.get(`api/documents/?client=${clientId}`);
  return response.data;
};

export default api;
