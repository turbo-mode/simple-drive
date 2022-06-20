import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
  async (config) => config,
  async (error) => Promise.reject(error)
);

api.interceptors.response.use(
  async (response) => response,
  async (error) => Promise.reject(error)
);

export default api;
