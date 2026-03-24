import axios from "axios";

export const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
});
