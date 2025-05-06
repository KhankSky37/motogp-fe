import httpClient from "../config/HttpClient.jsx";
import { API } from "../constants/Endpoints.jsx";

const ManufacturerService = {
  getAllManufacturers: (params) => {
    // Process the params to handle the country to locationCountry conversion
    const adjustedParams = { ...params };
    if (adjustedParams.country) {
      adjustedParams.locationCountry = adjustedParams.country;
      delete adjustedParams.country;
    }

    return httpClient.get(API.MANUFACTURERS, {
      params: adjustedParams,
      // Add error handling
      validateStatus: (status) => status < 500,
    });
  },

  getManufacturerById: (id) => {
    return httpClient.get(`${API.MANUFACTURERS}/${id}`, {
      // Add error handling
      validateStatus: (status) => status < 500,
    });
  },

  createManufacturer: (manufacturerDto) => {
    // Chuẩn bị dữ liệu - chuyển đổi country thành locationCountry
    const adjustedData = {
      ...manufacturerDto,
      locationCountry: manufacturerDto.country,
    };
    delete adjustedData.country; // Xóa trường country vì backend không sử dụng

    return httpClient.post(API.MANUFACTURERS, adjustedData, {
      headers: {
        "Content-Type": "application/json",
      },
      // Add error handling
      validateStatus: (status) => status < 500,
    });
  },

  updateManufacturer: (id, manufacturerDto) => {
    // Chuẩn bị dữ liệu - chuyển đổi country thành locationCountry
    const adjustedData = {
      ...manufacturerDto,
      locationCountry: manufacturerDto.country,
    };
    delete adjustedData.country; // Xóa trường country vì backend không sử dụng

    return httpClient.put(`${API.MANUFACTURERS}/${id}`, adjustedData, {
      headers: {
        "Content-Type": "application/json",
      },
      // Add error handling
      validateStatus: (status) => status < 500,
    });
  },

  deleteManufacturer: (id) => {
    return httpClient.delete(`${API.MANUFACTURERS}/${id}`, {
      // Add error handling
      validateStatus: (status) => status < 500,
    });
  },
};

export default ManufacturerService;
