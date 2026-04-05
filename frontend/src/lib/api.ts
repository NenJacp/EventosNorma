const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let message = "Ocurrió un error en la petición.";

    if (data?.detail) {
      message = data.detail;
    } else if (data?.title) {
      message = data.title;
    } else if (data?.message) {
      message = data.message;
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

  return data;
}