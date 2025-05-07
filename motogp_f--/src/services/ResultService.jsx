import HttpClient from "../config/HttpClient.jsx";

const ResultService = {
  getAllResults(params = {}) {
    return HttpClient.get("/results", { params });
  },

  getResultById(id) {
    return HttpClient.get(`/results/${id}`);
  },

  createResult(resultData) {
    return HttpClient.post("/results", resultData);
  },

  updateResult(id, resultData) {
    return HttpClient.put(`/results/${id}`, resultData);
  },

  deleteResult(id) {
    return HttpClient.delete(`/results/${id}`);
  },

  // Additional methods to get results by session
  getResultsBySessionId(sessionId) {
    return HttpClient.get(`/results`, { params: { sessionId } });
  },
};

export default ResultService;
