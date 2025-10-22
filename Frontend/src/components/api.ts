import axios from "axios";

// hard-set back to Spring Boot
const API_URL = "http://localhost:8080/api";

export const getUsers = () => fetch(`${API_URL}/users`).then(r => r.json());
export const getUserById = (id: number) => fetch(`${API_URL}/users/${id}`).then(r => r.json());
export const createUser = (user: { username: string; level: number }) =>
  fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  }).then(async r => {
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  });
export const updateUser = (user: { id: number; username: string; level: number }) =>
  fetch(`${API_URL}/users`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  }).then(async r => {
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  });
export const deleteUser = (id: number) =>
  fetch(`${API_URL}/users/${id}`, { method: "DELETE" }).then(async r => {
    if (!r.ok) throw new Error(await r.text());
  });

// (skills/projects exports unchanged, same base URL)
