import axios from "axios";

const API_URL = "http://localhost:5050/api";

export const getTasks = (token) =>
  axios.get(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createTask = (data, token) =>
  axios.post(`${API_URL}/tasks`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateTask = (id, data, token) =>
  axios.put(`${API_URL}/tasks/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteTask = (id, token) =>
  axios.delete(`${API_URL}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
