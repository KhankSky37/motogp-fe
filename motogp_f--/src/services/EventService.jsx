import httpClient from "../config/HttpClient.jsx";
import { API } from "../constants/Endpoints.jsx";

const EventService = {
  getAllEvents: (params) => {
    return httpClient.get(API.EVENTS, { params });
  },

  getEventById: (id) => {
    return httpClient.get(`${API.EVENTS}/${id}`);
  },

  createEvent: (eventDto) => {
    return httpClient.post(API.EVENTS, eventDto);
  },

  updateEvent: (id, eventDto) => {
    return httpClient.put(`${API.EVENTS}/${id}`, eventDto);
  },

  deleteEvent: (id) => {
    return httpClient.delete(`${API.EVENTS}/${id}`);
  },
};

export default EventService;
