export interface SessionUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

export function getFullName(user: SessionUser | null) {
  if (!user) return "Usuario";

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return fullName || user.email || "Usuario";
}