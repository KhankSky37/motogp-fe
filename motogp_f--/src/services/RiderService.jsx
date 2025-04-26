import httpClient from "../config/HttpClient.jsx";
import { API } from "../constants/Endpoints.jsx";

const RiderService = {
  getAllRiders: (params) => {
    return httpClient.get(API.RIDERS, {params});
  },

  getRiderById: (id) => {
    return httpClient.get(`${API.RIDERS}/${id}`);
  },

  createRider: (riderDto, photoFile) => {
    const formData = new FormData();
    // Append rider data as a JSON string blob part, matching the backend @RequestPart("rider")
    formData.append('rider', new Blob([JSON.stringify(riderDto)], { type: 'application/json' }));
    // Append the photo file part, matching the backend @RequestPart("photo")
    formData.append('photo', photoFile);

    return httpClient.post(API.RIDERS, formData, {
      headers: {
        // Override default Content-Type for multipart/form-data
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateRider: (id, riderDto) => {
    return httpClient.put(`${API.RIDERS}/${id}`, riderDto);
    // If photo update is needed and backend supports it:
    // const formData = new FormData();
    // formData.append('rider', new Blob([JSON.stringify(riderDto)], { type: 'application/json' }));
    // if (photoFile) { // Assuming photoFile is passed if it needs update
    //   formData.append('photo', photoFile);
    // }
    // return httpClient.put(`${API.RIDERS}/${id}`, formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' },
    // });
  },

  deleteRider: (id) => {
    return httpClient.delete(`${API.RIDERS}/${id}`);
  },
};

export default RiderService;