const TOKEN_KEY = "taskflow_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);

async function request(path, { method = "GET", body, params } = {}) {
  const qs = params
    ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString()
    : "";
  const res = await fetch(`/api${path}${qs}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body }),
  login: (body) => request("/auth/login", { method: "POST", body }),
  me: () => request("/auth/me"),
  listTasks: (params) => request("/tasks", { params }),
  stats: () => request("/tasks/stats"),
  createTask: (body) => request("/tasks", { method: "POST", body }),
  updateTask: (id, body) => request(`/tasks/${id}`, { method: "PUT", body }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
