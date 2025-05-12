import httpClient from "../config/HttpClient.jsx";
import { API } from "../constants/Endpoints.jsx";

const ContractService = {
  getAllContracts: (params = {}) => {
    return httpClient.get(API.CONTRACTS, { params });
  },

  getContractById: (id) => {
    return httpClient.get(`${API.CONTRACTS}/${id}`);
  },

  createContract: (contractDto) => {
    return httpClient.post(API.CONTRACTS, contractDto);
  },

  updateContract: (id, contractDto) => {
    return httpClient.put(`${API.CONTRACTS}/${id}`, contractDto);
  },

  deleteContract: (id) => {
    return httpClient.delete(`${API.CONTRACTS}/${id}`);
  },
};

export default ContractService;