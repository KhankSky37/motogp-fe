import httpClient from "../config/HttpClient.jsx";
import { API } from "../constants/Endpoints.jsx";

const UserService = {
  getAllUsers: (params) => {
    return httpClient.get(API.USERS, { params });
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
};

export default UserService;