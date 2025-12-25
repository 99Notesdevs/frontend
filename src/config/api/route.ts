import { env } from "@/config/env";

const BASE_URL = env.API;

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string, options: RequestInit = {}) =>
    request<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, body?: unknown, options: RequestInit = {}) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  put: <T>(endpoint: string, body?: unknown, options: RequestInit = {}) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T>(endpoint: string, body?: unknown, options: RequestInit = {}) =>
    request<T>(endpoint, {
      method: "DELETE",
      body: body ? JSON.stringify(body) : "",
      ...options,
    }),
};
