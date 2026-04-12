export const API_URL = ""; // Use relative paths for Next.js rewrites

const PUBLIC_ENDPOINTS = ["/api/Users/login", "/api/Users/register", "/api/Users/forgot-password", "/api/Users/verify-password-code", "/api/Users/verify-email", "/api/Users/resend-verification", "/api/Users/reset-password", "/api/Users/logout"];

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  
  const session = localStorage.getItem("eventos_user");
  const token = session ? JSON.parse(session)?.token : null;
  
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export class ApiError extends Error {
  status?: number;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;

  constructor(message: string, options?: {
    status?: number;
    title?: string;
    detail?: string;
    errors?: Record<string, string[]>;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = options?.status;
    this.title = options?.title;
    this.detail = options?.detail;
    this.errors = options?.errors;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some(ep => endpoint.includes(ep));
  const authHeader = isPublicEndpoint ? {} : getAuthHeader();

  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...(options?.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let message = "Ocurrió un error en la petición.";

    if (data?.message) {
      message = data.message;
    } else if (data?.detail) {
      message = data.detail;
    } else if (data?.title) {
      message = data.title;
    } else if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0];
      if (firstKey && Array.isArray(data.errors[firstKey])) {
        message = data.errors[firstKey][0];
      }
    }

    throw new ApiError(message, {
      status: data?.status || response.status,
      title: data?.title,
      detail: data?.detail,
      errors: data?.errors,
    });
  }

  if (data && typeof data === "object" && "success" in data) {
    if (data.success && "data" in data) {
      return data.data as T;
    }
    throw new ApiError(data.message || "Error en la petición", {
      status: 400,
      errors: data.errors,
    });
  }

  if (data && typeof data === "object" && "data" in data) {
    return data.data as T;
  }

  return data as T;
}