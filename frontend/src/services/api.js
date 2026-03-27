const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Error en el servidor' }))
    throw new Error(error.detail || 'Error al iniciar sesión')
  }

  return res.json()
}

export async function register(firstName, lastName, email, password) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, password })
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Error en el servidor' }))
    throw new Error(error.detail || 'Error al registrar')
  }

  return res.json()
}

export async function logout() {
  await fetch(`${API_BASE}/users/logout`, {
    method: 'POST',
    credentials: 'include'
  })
}
