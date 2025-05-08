import httpClient from "../config/HttpClient.jsx";
import { API } from "../constants/Endpoints.jsx";

const TeamService = {
  getAllTeams: (params = {}) => {
    // Process the params to handle parameter conversions
    const adjustedParams = { ...params };

    // Handle keyword parameter to map to name for team search
    if (adjustedParams.keyword) {
      adjustedParams.name = adjustedParams.keyword;
      delete adjustedParams.keyword;
    }

    return httpClient.get(API.TEAMS, { params: adjustedParams });
  },

  getTeamById: (id) => {
    return httpClient.get(`${API.TEAMS}/${id}`);
  },

  createTeam: (teamDto, logoFile = null) => {
    const formData = new FormData();
    formData.append(
      "team",
      new Blob([JSON.stringify(teamDto)], { type: "application/json" })
    );
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    return httpClient.post(API.TEAMS, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateTeam: (id, teamDto, logoFile = null) => {
    const formData = new FormData();
    formData.append(
      "team",
      new Blob([JSON.stringify(teamDto)], { type: "application/json" })
    );
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    return httpClient.put(`${API.TEAMS}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteTeam: (id) => {
    return httpClient.delete(`${API.TEAMS}/${id}`);
  },
};

export default TeamService;
