import HttpClient from "../config/HttpClient.jsx";

const RiderService = {
  getAllRiders(params = {}) {
    return HttpClient.get("/riders", { params });
  },

  getRiderById(id) {
    return HttpClient.get(`/riders/${id}`);
  },

  createRider(riderData) {
    return HttpClient.post("/riders", riderData);
  },

  updateRider(id, riderData) {
    return HttpClient.put(`/riders/${id}`, riderData);
  },

  deleteRider(id) {
    return HttpClient.delete(`/riders/${id}`);
  },
};

export default RiderService;
