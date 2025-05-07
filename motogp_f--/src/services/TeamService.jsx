import HttpClient from "../config/HttpClient.jsx";

const TeamService = {
  getAllTeams(params = {}) {
    return HttpClient.get("/teams", { params });
  },

  getTeamById(id) {
    return HttpClient.get(`/teams/${id}`);
  },

  createTeam(teamData) {
    return HttpClient.post("/teams", teamData);
  },

  updateTeam(id, teamData) {
    return HttpClient.put(`/teams/${id}`, teamData);
  },

  deleteTeam(id) {
    return HttpClient.delete(`/teams/${id}`);
  },
};

export default TeamService;
