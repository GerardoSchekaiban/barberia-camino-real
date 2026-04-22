import axios from "axios";
import { getToken, clearSession } from "./auth";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Inyectar JWT en cada request
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si el servidor responde 401, limpiar sesión y redirigir al login
api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      clearSession();
      window.location.href = "/panel/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────
export const login = (data) =>
  api.post("/auth/login", data).then(r => r.data);

// ── Appointments ──────────────────────────────
export const getAppointments = (params) =>
  api.get("/appointments", { params }).then(r => r.data);

export const createAppointment = (data) =>
  api.post("/appointments", data).then(r => r.data);

export const updateAppointment = (id, data) =>
  api.put(`/appointments/${id}`, data).then(r => r.data);

export const deleteAppointment = (id) =>
  api.delete(`/appointments/${id}`).then(r => r.data);

// ── Barbers ───────────────────────────────────
export const getBarbers = () =>
  api.get("/barbers").then(r => r.data);

export const createBarber = (data) =>
  api.post("/barbers", data).then(r => r.data);

export const updateBarber = (id, data) =>
  api.put(`/barbers/${id}`, data).then(r => r.data);

export const getBarberSchedule = (id) =>
  api.get(`/barbers/${id}/schedule`).then(r => r.data);

export const updateBarberSchedule = (id, schedule) =>
  api.put(`/barbers/${id}/schedule`, schedule).then(r => r.data);
