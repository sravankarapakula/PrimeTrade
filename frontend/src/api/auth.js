import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true
});

export const loginUser = async (data) => {
  return API.post("/users/login", data);
};

export const registerUser = async (data) => {
  return API.post("/users/register", data);
};
