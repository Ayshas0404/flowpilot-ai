/**
 * FlowPilot AI — Central API Service Layer
 * 
 * All API calls go through here. JWT is attached automatically.
 * Change API_BASE_URL to switch between dev and production.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ─── Token Helpers ───────────────────────────────────────────────────────────

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fp_access");
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fp_refresh");
};

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem("fp_access", access);
  localStorage.setItem("fp_refresh", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("fp_access");
  localStorage.removeItem("fp_refresh");
};

// ─── Core Fetch Wrapper ──────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  // Try to refresh token once on 401
  if (res.status === 401 && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request<T>(path, options, false);
    clearTokens();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData?.detail ||
      errorData?.non_field_errors?.[0] ||
      Object.values(errorData)?.[0] ||
      `Request failed (${res.status})`;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }

  // Handle 204 No Content
  if (res.status === 204) return {} as T;

  return res.json();
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem("fp_access", data.access);
    return true;
  } catch {
    return false;
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  created_at: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    request<AuthTokens>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username: email, password }),
    }),

  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) =>
    request<User>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => request<User>("/auth/me/"),

  forgotPassword: (email: string) =>
    request<{ detail: string; uid?: string; token?: string }>("/auth/forgot-password/", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (uid: string, token: string, new_password: string) =>
    request<{ detail: string }>("/auth/reset-password/", {
      method: "POST",
      body: JSON.stringify({ uid, token, new_password }),
    }),
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface Project {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  deadline: string | null;
  created_by: number;
  tasks_count: number;
  completed_tasks: number;
  created_at: string;
  updated_at: string;
}

export type ProjectCreate = Omit<Project, "id" | "created_by" | "tasks_count" | "completed_tasks" | "created_at" | "updated_at">;

export const projectsApi = {
  list: () => request<{ results: Project[]; count: number } | Project[]>("/projects/"),
  get: (id: number) => request<Project>(`/projects/${id}/`),
  create: (data: Partial<ProjectCreate>) =>
    request<Project>("/projects/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<ProjectCreate>) =>
    request<Project>(`/projects/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/projects/${id}/`, { method: "DELETE" }),
};

// ─── Tasks ────────────────────────────────────────────────────────────────────

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  due_date: string | null;
  project: number;
  assigned_to: number | null;
  assigned_to_name: string;
  created_at: string;
}

export type TaskCreate = Omit<Task, "id" | "assigned_to_name" | "created_at">;

export const tasksApi = {
  list: (params?: { project?: number; status?: string }) => {
    const qs = params
      ? "?" + new URLSearchParams(params as Record<string, string>).toString()
      : "";
    return request<{ results: Task[]; count: number } | Task[]>(`/tasks/${qs}`);
  },
  create: (data: Partial<TaskCreate>) =>
    request<Task>("/tasks/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<TaskCreate>) =>
    request<Task>(`/tasks/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/tasks/${id}/`, { method: "DELETE" }),
};

// ─── AI Planner ───────────────────────────────────────────────────────────────

export interface AIHistoryItem {
  id: number;
  prompt: string;
  generated_output: {
    goal: string;
    sprints: { name: string; duration: string; tasks: string[] }[];
    milestones: string[];
    estimated_total_duration: string;
  };
  created_at: string;
}

export const aiApi = {
  generate: (prompt: string) =>
    request<AIHistoryItem>("/ai/generate/", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    }),
  history: () => request<AIHistoryItem[]>("/ai/history/"),
};

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface AnalyticsData {
  total_projects: number;
  active_projects: number;
  total_tasks: number;
  completed_tasks: number;
  completion_rate: number;
  productivity_score: number;
  pie_data: { name: string; value: number; color: string }[];
  productivity_data: { name: string; productivity: number; tickets: number }[];
  velocity_data: { name: string; completed: number; added: number }[];
}

export const analyticsApi = {
  get: () => request<AnalyticsData>("/analytics/"),
};

// ─── Team ─────────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  project: number;
  role: "admin" | "member" | "viewer";
  joined_at: string;
}

export const teamApi = {
  list: () =>
    request<{ results: TeamMember[]; count: number } | TeamMember[]>("/team/members/"),
  invite: (data: { email: string; project: number; role: string }) =>
    request<TeamMember>("/team/members/invite/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ─── Normalise paginated or flat responses ────────────────────────────────────

export function toArray<T>(response: { results: T[]; count: number } | T[]): T[] {
  if (Array.isArray(response)) return response;
  return response.results;
}
