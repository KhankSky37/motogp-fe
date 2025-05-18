import httpClient from "../config/HttpClient.jsx";
import {API} from "../constants/Endpoints.jsx";

const StandingService = {
  getStandings: (seasonYear, categoryId, type) => {
    return httpClient.get(`${API.STANDINGS}`, {
      params: {seasonYear, categoryId, type},
    });
  },

};

export default StandingService;