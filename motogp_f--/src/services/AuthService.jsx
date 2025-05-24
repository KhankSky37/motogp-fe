// filepath: src/services/AuthService.jsx
import httpClient from "../config/HttpClient.jsx";
import { API } from "../constants/Endpoints.jsx"; // Đảm bảo API.AUTH được định nghĩa, ví dụ: AUTH: "/auth"

const AuthService = {
  login: (authenticationRequest) => {
    // authenticationRequest nên có cấu trúc { email, password }
    // để khớp với AuthenticationDto của backend
    return httpClient.post(`${API.AUTH}/token`, authenticationRequest);
  },

  logout: (token) => {
    // Backend mong đợi InvalidatedTokenDto, ví dụ: { token: "your_jwt_token" }
    // Hoặc nếu backend chỉ cần token string trong body, điều chỉnh cho phù hợp
    return httpClient.post(`${API.AUTH}/logout`, { token });
  },

  introspectToken: (token) => {
    // Backend mong đợi token string trong body request
    return httpClient.post(`${API.AUTH}/introspect`, token, {
      headers: { 'Content-Type': 'text/plain' } // Hoặc 'application/json' nếu backend nhận JSON
    });
  },

  refreshToken: (token) => {
    // Backend mong đợi token như một request parameter
    return httpClient.post(`${API.AUTH}/refresh?token=${encodeURIComponent(token)}`);
  },
};

export default AuthService;