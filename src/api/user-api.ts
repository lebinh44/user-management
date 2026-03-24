import axios from "axios";
import { Album, Post, User } from "../features/user/types";

export const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/users");
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: Partial<User>) => {
  const response = await api.post("/users", data);
  return response.data;
};

export const updateUser = async (id: number, data: Partial<User>) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const getUserPosts = async (id: number) => {
  const response = await api.get<Post[]>(`/users/${id}/posts`);
  return response.data;
};

export const getUserAlbums = async (id: number) => {
  const response = await api.get<Album[]>(`/users/${id}/albums`);
  return response.data;
};
