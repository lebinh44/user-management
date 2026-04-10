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

export const createUser = async (data: Partial<User>): Promise<User> => {
  const response = await api.post("/users", data);
  return response.data;
};

export const updateUser = async (
  id: number,
  data: Partial<User>
): Promise<User> => {
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

export const getUserPostsPaginated = async (
  id: number,
  page: number,
  limit: number
): Promise<Post[]> => {
  const response = await api.get<Post[]>(`/users/${id}/posts`, {
    params: { _page: page, _limit: limit },
  });
  return response.data;
};

export const getUserAlbumsPaginated = async (
  id: number,
  page: number,
  limit: number
): Promise<Album[]> => {
  const response = await api.get<Album[]>(`/users/${id}/albums`, {
    params: { _page: page, _limit: limit },
  });
  return response.data;
};
