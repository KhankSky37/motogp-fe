import axios from "axios";
// import AuthService from "../services/AuthService.jsx"; // Sẽ cần cho refresh token nâng cao

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Thêm token vào header Authorization
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("motogp_token");
    if (token) {
      // Các endpoints không cần gửi token
      const noAuthEndpoints = [
        "/auth/token",
        "/auth/refresh",
        "/auth/introspect", // Introspect có thể cần token, tùy vào logic backend của bạn
        "/users/register",
        "/users/forgot-password",
        "/users/reset-password",
      ];

      // Kiểm tra xem URL của request có nằm trong danh sách noAuthEndpoints không
      // Lưu ý: config.url có thể là URL đầy đủ hoặc chỉ là path.
      // Cần đảm bảo logic kiểm tra này chính xác.
      const requestPath = config.url.replace(config.baseURL, "");
      const isAuthEndpoint = noAuthEndpoints.some(endpoint => requestPath.startsWith(endpoint));

      if (!isAuthEndpoint) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Xử lý lỗi 401 cơ bản)
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 và không phải là request refresh token ban đầu
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu đã thử lại
      console.warn("Token expired or invalid (401). Attempting to handle...");

      // Tạm thời: Logout và chuyển hướng về login
      // Logic refresh token sẽ phức tạp hơn và cần AuthService.refreshToken
      // Ví dụ:
      // try {
      //   const oldToken = localStorage.getItem("motogp_token");
      //   if (oldToken) {
      //     const response = await AuthService.refreshToken(oldToken); // Giả sử AuthService đã import
      //     const newToken = response.data;
      //     localStorage.setItem("motogp_token", newToken);
      //     axios.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
      //     originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
      //     return httpClient(originalRequest);
      //   }
      // } catch (refreshError) {
      //   console.error("Token refresh failed:", refreshError);
      //   // Xử lý lỗi refresh token, ví dụ logout
      // }

      // Xử lý đơn giản: logout
      localStorage.removeItem("motogp_token");
      // Sử dụng window.location để đảm bảo reload hoàn toàn và state được reset
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error); // Quan trọng: reject error sau khi xử lý
    }
    return Promise.reject(error);
  }
);

export default httpClient;