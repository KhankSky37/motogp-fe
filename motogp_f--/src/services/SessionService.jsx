import HttpClient from "../config/HttpClient.jsx";

const SessionService = {
  getAllSessions(params = {}) {
    return HttpClient.get("/sessions", { params });
  },

  getSessionById(id) {
    return HttpClient.get(`/sessions/${id}`);
  },

  createSession(sessionData) {
    return HttpClient.post("/sessions", sessionData);
  },

  updateSession(id, sessionData) {
    return HttpClient.put(`/sessions/${id}`, sessionData);
  },

  deleteSession(id) {
    return HttpClient.delete(`/sessions/${id}`);
  },
};

export default SessionService;
