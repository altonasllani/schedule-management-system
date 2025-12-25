import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: false,
});

// ➜ ACCESS TOKEN AUTOMATIK
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ➜ HANDLE 401 + REFRESH TOKEN (opsionale, por gati)
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    return Promise.reject(error);
  }
);

export default http;
