import HttpClient from "../config/HttpClient.jsx";

const ManufacturerService = {
  getAllManufacturers(params = {}) {
    return HttpClient.get("/manufacturers", { params });
  },

  getManufacturerById(id) {
    return HttpClient.get(`/manufacturers/${id}`);
  },

  createManufacturer(manufacturerData) {
    return HttpClient.post("/manufacturers", manufacturerData);
  },

  updateManufacturer(id, manufacturerData) {
    return HttpClient.put(`/manufacturers/${id}`, manufacturerData);
  },

  deleteManufacturer(id) {
    return HttpClient.delete(`/manufacturers/${id}`);
  },
};

export default ManufacturerService;
