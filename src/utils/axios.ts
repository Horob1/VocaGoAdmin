import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import API_ENDPOINTS from "./ApiEndpoints";
import CONSTANTS from "./constants";
import { getUserToken, logoutUser, refreshToken } from "../stores/useAuthStore";
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  const queue = [...failedQueue];
  failedQueue = [];

  queue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + API_ENDPOINTS.API_PREFIX,
  withCredentials: true,
  headers: {
    "X-Platform": CONSTANTS.AXIOS.XPLATFORM_VALUE,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getUserToken(); // Lấy token từ store
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Thêm token vào headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (typeof token === "string" && originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosInstance.post(
          API_ENDPOINTS.AUTH.REFRESH,
          {}
        );
        const newAccessToken = response.data?.accessToken;

        if (newAccessToken) {
          refreshToken(newAccessToken);
        }

        processQueue(null, newAccessToken);

        if (originalRequest.headers && newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (err) {
        logoutUser();
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
