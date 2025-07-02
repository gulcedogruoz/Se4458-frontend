import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5000/api", // Gateway URL'in
});

export default api;
