import httpClient from "../config/HttpClient.jsx";
import { API } from "../constants/Endpoints.jsx";

const SessionService = {
  getAllSessions: (params = {}) => {
    // Convert date objects to ISO strings for API compatibility
    const formattedParams = { ...params };

    if (formattedParams.dateFrom && formattedParams.dateFrom._isAMomentObject) {
      formattedParams.dateFrom = formattedParams.dateFrom.toISOString();
    }

    if (formattedParams.dateTo && formattedParams.dateTo._isAMomentObject) {
      formattedParams.dateTo = formattedParams.dateTo.toISOString();
    }

    return httpClient.get(API.SESSIONS, { params: formattedParams });
  },

  getSessionById: (id) => {
    return httpClient.get(`${API.SESSIONS}/${id}`);
  },

  createSession: (sessionDto) => {
    return httpClient.post(API.SESSIONS, sessionDto);
  },

  updateSession: (id, sessionDto) => {
    return httpClient.put(`${API.SESSIONS}/${id}`, sessionDto);
  },

  deleteSession: (id) => {
    return httpClient.delete(`${API.SESSIONS}/${id}`);
  },
};

export default SessionService;
