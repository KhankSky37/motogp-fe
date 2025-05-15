import httpClient from "../config/HttpClient.jsx";
import { API } from "../constants/Endpoints.jsx";

const CircuitService = {
  getAllCircuits: (params) => {
    // Process the params to handle the country to locationCountry conversion
    const adjustedParams = { ...params };
    if (adjustedParams.country) {
      adjustedParams.locationCountry = adjustedParams.country;
      delete adjustedParams.country;
    }

    return httpClient.get(API.CIRCUITS, { params: adjustedParams });
  },

  getCircuitById: (id) => {
    return httpClient.get(`${API.CIRCUITS}/${id}`);
  },

  createCircuit: (circuitDto, imageFile) => {
    const formData = new FormData();
    // Append circuit data as a JSON string blob part
    formData.append(
      "circuit",
      new Blob([JSON.stringify(circuitDto)], { type: "application/json" })
    );
    // Append the image file part
    if (imageFile) {
      formData.append("image", imageFile);
    }

    return httpClient.post(API.CIRCUITS, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateCircuit: (id, circuitDto, imageFile = null) => {
    console.log("CircuitService.updateCircuit - imageFile:", imageFile);
    console.log("imageFile type:", typeof imageFile);

    const formData = new FormData();
    formData.append(
      "circuit",
      new Blob([JSON.stringify(circuitDto)], { type: "application/json" })
    );

    // Chỉ thêm image vào formData nếu là File object hợp lệ
    if (imageFile && imageFile instanceof File) {
      console.log(
        "Appending valid image file:",
        imageFile.name,
        imageFile.type,
        imageFile.size
      );
      formData.append("image", imageFile);
    } else {
      console.log("No new image file to upload");
    }

    return httpClient.put(`${API.CIRCUITS}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteCircuit: (id) => {
    return httpClient.delete(`${API.CIRCUITS}/${id}`);
  },
};

export default CircuitService;
