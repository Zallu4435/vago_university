import axios from "axios";
import { logout } from "../../presentation/redux/authSlice";
import store from "../../presentation/redux/store";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

httpClient.interceptors.request.use(
  (config) => {
    const publicEndpoints = ["/auth/login", "/auth/register", "/auth/refresh"];
    if (!publicEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
      const token = store.getState().auth.token;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await httpClient.post("/auth/refresh");
        const newToken = response.data.token;
        store.dispatch({ type: "auth/setToken", payload: newToken });
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        window.location.href = "/register";
        return Promise.reject(refreshError);
      }
    }

    if (
      error.response?.status === 404 &&
      error.config.url?.includes("/admission/applications/user")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
      import("react-hot-toast").then((toast) => {
        toast.default.error("A server error occurred. Please try again later.");
      });
    }

    return Promise.reject(error);
  }
);

export default httpClient;
