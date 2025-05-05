import httpClient from "../config/HttpClient.jsx";
import { API } from "../constants/Endpoints.jsx";

const CircuitService = {
  getAllCircuits: (params) => {
    return httpClient.get(API.CIRCUITS, { params });
  },

  getCircuitById: (id) => {
    return httpClient.get(`${API.CIRCUITS}/${id}`);
  },

  createCircuit: (circuitDto) => {
    return httpClient.post(API.CIRCUITS, circuitDto);
  },

  updateCircuit: (id, circuitDto) => {
    return httpClient.put(`${API.CIRCUITS}/${id}`, circuitDto);
  },

  deleteCircuit: (id) => {
    return httpClient.delete(`${API.CIRCUITS}/${id}`);
  },
};

export default CircuitService;
