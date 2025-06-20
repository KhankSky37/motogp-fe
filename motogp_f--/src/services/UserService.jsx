import httpClient from "../config/HttpClient.jsx";
import {API} from "../constants/Endpoints.jsx";

const UserService = {
  register: (userData) => {
    return httpClient.post(`${API.USERS}/register`, userData);
  },

  getAllUsers: (params) => {
    return httpClient.get(API.USERS, {params});
  },

  getUserById: (id) => {
    return httpClient.get(`${API.USERS}/${id}`);
  },

  createUser: (userDto) => {
    return httpClient.post(API.USERS, userDto);
  },

  updateUser: (id, userDto) => {
    return httpClient.put(`${API.USERS}/${id}`, userDto);
  },

  deleteUser: (id) => {
    return httpClient.delete(`${API.USERS}/${id}`);
  },
  changePassword: (id, passwordDto) => {
    return httpClient.put(`${API.USERS}/change-password/${id}`, passwordDto);
  },
  forgotPassword: (forgotPasswordRequestDto) => {
    return httpClient.post(`${API.USERS}/forgot-password`, forgotPasswordRequestDto);
  },

  resetPassword: (resetPasswordRequestDto) => {
    return httpClient.post(`${API.USERS}/reset-password`, resetPasswordRequestDto);
  },
};

export default UserService;