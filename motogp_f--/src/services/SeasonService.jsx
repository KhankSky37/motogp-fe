import httpClient from "../config/HttpClient.jsx";
import { API } from "../constants/Endpoints.jsx";

const SeasonService = {
  getAllSeasons: (params) => {
    return httpClient.get(API.SEASONS, {params});
  },

  getSeasonById: (id) => {
    return httpClient.get(`${API.SEASONS}/${id}`);
  },

  createSeason: (seasonDto) => {
    return httpClient.post(API.SEASONS, seasonDto);
  },

  updateSeason: (id, seasonDto) => {
    return httpClient.put(`${API.SEASONS}/${id}`, seasonDto);
  },

  deleteSeason: (id) => {
    return httpClient.delete(`${API.SEASONS}/${id}`);
  },
};

export default SeasonService;