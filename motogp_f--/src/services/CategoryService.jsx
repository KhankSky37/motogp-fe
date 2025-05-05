import httpClient from "../config/HttpClient.jsx";
import { API } from "../constants/Endpoints.jsx";

const CategoryService = {
  getAllCategories: (params = {}) => {
    return httpClient.get(API.CATEGORIES, { params });
  },

  getCategoryById: (id) => {
    return httpClient.get(`${API.CATEGORIES}/${id}`);
  },

  createCategory: (categoryDto) => {
    return httpClient.post(API.CATEGORIES, categoryDto);
  },

  updateCategory: (id, categoryDto) => {
    return httpClient.put(`${API.CATEGORIES}/${id}`, categoryDto);
  },

  deleteCategory: (id) => {
    return httpClient.delete(`${API.CATEGORIES}/${id}`);
  },
};

export default CategoryService;
