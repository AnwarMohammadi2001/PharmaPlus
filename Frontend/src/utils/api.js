// utils/api.js
import axios from "axios";
import store from "../app/store"; // or import { store } from ...
import { setAccessToken } from "../features/authSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

// attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// response interceptor to handle 401 -> try refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // queue request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      try {
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          token: refreshToken,
        });
        const { accessToken, refreshToken: newRefresh } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefresh);
        store.dispatch(setAccessToken(accessToken));
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (e) {
        processQueue(e, null);
        // redirect to login or clear storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // optional: window.location.href = "/login";
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
