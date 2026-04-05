export interface SessionUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  token?: string;
}

const USER_KEY = "eventos_user";

export function saveSession(user: SessionUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getSession(): SessionUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
}

export function getFullName(user: SessionUser | null) {
  if (!user) return "Usuario";

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return fullName || user.email || "Usuario";
}