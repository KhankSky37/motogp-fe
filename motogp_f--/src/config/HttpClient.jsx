import axios from "axios";

const httpClient = axios.create({
  baseURL: "http://localhost:9096/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

export default httpClient;