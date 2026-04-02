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
    const errorData = await res.json().catch(() => ({}));
    // Soporta detail (RFC) y Detail (System.Text.Json default)
    const errorMessage = errorData.detail || errorData.Detail || 'Error al registrar';
    throw new Error(errorMessage);
  }

  return res.json()
}

export async function getUsers() {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'GET',
    credentials: 'include'
  })

  if (!res.ok) {
    throw new Error('No se pudieron obtener los usuarios')
  }

  return res.json()
}

export async function logout() {
  await fetch(`${API_BASE}/users/logout`, {
    method: 'POST',
    credentials: 'include'
  })
}

function getAuthHeaders() {
  return {
    'Content-Type': 'application/json'
  }
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/users/currentUser`, {
    method: 'GET',
    credentials: 'include'
  })
  if (!res.ok) {
    throw new Error('No se pudo obtener el usuario actual')
  }
  return res.json()
}

export async function getMyEvents(userId, page = 1, pageSize = 10) {
  const res = await fetch(`${API_BASE}/events?CreatedById=${userId}&PageNumber=${page}&PageSize=${pageSize}`, {
    method: 'GET',
    credentials: 'include',
    headers: getAuthHeaders()
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Error al obtener eventos' }))
    throw new Error(error.detail || 'Error al obtener eventos')
  }
  return res.json()
}

export async function createEvent(data) {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Error al crear evento' }))
    throw new Error(error.detail || error.errors?.[0] || 'Error al crear evento')
  }
  return res.json()
}

export async function updateEvent(id, data) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ...data, Id: id })
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Error al actualizar evento' }))
    throw new Error(error.detail || error.errors?.[0] || 'Error al actualizar evento')
  }
  return res.json()
}

export async function deleteEvent(id) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: getAuthHeaders()
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Error al eliminar evento' }))
    throw new Error(error.detail || 'Error al eliminar evento')
  }
  return res.json()
}

export async function getCountries() {
  const res = await fetch(`${API_BASE}/countries`, {
    method: 'GET',
    credentials: 'include'
  })
  if (!res.ok) throw new Error('Error al obtener países')
  return res.json()
}

export async function getCities(stateId) {
  const res = await fetch(`${API_BASE}/cities/state/${stateId}`, {
    method: 'GET',
    credentials: 'include'
  })
  if (!res.ok) throw new Error('Error al obtener ciudades')
  return res.json()
}

export async function getStates(countryId) {
  const res = await fetch(`${API_BASE}/states/country/${countryId}`, {
    method: 'GET',
    credentials: 'include'
  })
  if (!res.ok) throw new Error('Error al obtener estados')
  return res.json()
}

export async function getEventCategories() {
  const res = await fetch(`${API_BASE}/eventcategories`, {
    method: 'GET',
    credentials: 'include'
  })
  if (!res.ok) throw new Error('Error al obtener categorías')
  return res.json()
}

export async function getEventTypes() {
  const res = await fetch(`${API_BASE}/eventtypes`, {
    method: 'GET',
    credentials: 'include'
  })
  if (!res.ok) throw new Error('Error al obtener tipos de evento')
  return res.json()
}

export async function getMySubscriptions(page = 1, pageSize = 10) {
  const res = await fetch(`${API_BASE}/events/me/subscriptions?PageNumber=${page}&PageSize=${pageSize}`, {
    method: 'GET',
    credentials: 'include',
    headers: getAuthHeaders()
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Error al obtener inscripciones' }))
    throw new Error(error.detail || 'Error al obtener inscripciones')
  }
  return res.json()
}
