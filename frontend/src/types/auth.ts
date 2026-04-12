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
  success: boolean;
  message: string | null;
  data: UserSession | null;
  errors: string[] | null;
}

export interface VerifyEmailResponse {
  message?: string;
  detail?: string;
  title?: string;
}

export interface LogoutResponse {
  message?: string;
}

export interface UserSession {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success?: boolean;
  message?: string | null;
  data?: boolean | null;
  errors?: string[] | null;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success?: boolean;
  message?: string | null;
  data?: boolean | null;
  errors?: string[] | null;
}