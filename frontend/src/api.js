import axios from "axios";

const api = axios.create({
  baseURL: "https://vm-sim-backend.onrender.com",
});

export const simulateMemory = (data) => api.post("/simulate", data);
