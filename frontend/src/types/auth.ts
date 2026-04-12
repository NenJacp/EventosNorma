export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  token: string;
}

export interface RegisterResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LoginResponse {
  id?: number;
  token?: string;
  message?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export interface VerifyEmailResponse {
  message?: string;
  detail?: string;
  title?: string;
}

export interface LogoutResponse {
  message?: string;
}