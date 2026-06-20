const BASE = import.meta.env.VITE_API_URL || '/api'

export function getToken() { return localStorage.getItem('em_token') }
export function getUser()  {
  try { return JSON.parse(localStorage.getItem('em_user')) } catch { return null }
}
export function saveSession(data) {
  localStorage.setItem('em_token', data.token)
  localStorage.setItem('em_user', JSON.stringify(data))
}
export function clearSession() {
  localStorage.removeItem('em_token')
  localStorage.removeItem('em_user')
}

export async function api(path, options = {}) {
  const token = getToken()
  let res
  try {
    res = await fetch(BASE + path, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    })
  } catch (networkErr) {
    throw new Error('Could not connect to the server. Please try again later.')
  }

  if (!res.ok) {
    if (res.status === 502 || res.status === 503 || res.status === 504) {
      throw new Error('Server error. Please try again later.')
    }
    if (res.status === 401) throw new Error('Invalid email or password')
    if (res.status === 403) throw new Error('You do not have permission to do that')
    if (res.status === 404) throw new Error('Not found')
    if (res.status === 409) throw new Error('Already registered for this event')
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || body.message || `Request failed (${res.status})`)
  }
  if (res.status === 204) return null
  return res.json()
}

// ── Auth ────────────────────────────────────────────────────────────
export const authApi = {
  login:    (d) => api('/auth/login',    { method: 'POST', body: JSON.stringify(d) }),
  register: (d) => api('/auth/register', { method: 'POST', body: JSON.stringify(d) }),
  logout:   ()  => api('/auth/logout',   { method: 'POST' }),
}

// ── Events ──────────────────────────────────────────────────────────
export const eventApi = {
  list:         (search) => api(`/events${search ? `?search=${encodeURIComponent(search)}&size=30` : '?size=30&sort=startDateTime'}`),
  get:          (id)     => api(`/events/${id}`),
  dashboard:    ()       => api('/events/dashboard'),
  mine:         ()       => api('/events/my?size=30'),
  create:       (d)      => api('/events',              { method: 'POST',  body: JSON.stringify(d) }),
  update:       (id, d)  => api(`/events/${id}`,        { method: 'PUT',   body: JSON.stringify(d) }),
  publish:      (id)     => api(`/events/${id}/publish`,{ method: 'PATCH' }),
  cancel:       (id)     => api(`/events/${id}/cancel`, { method: 'PATCH' }),
  delete:       (id)     => api(`/events/${id}`,        { method: 'DELETE' }),
  addSession:   (id, d)  => api(`/events/${id}/sessions`,{ method: 'POST', body: JSON.stringify(d) }),
  registrations:(id)     => api(`/events/${id}/registrations?size=100`),
  stats:        (id)     => api(`/events/${id}/stats`),
}

// ── Registrations ───────────────────────────────────────────────────
export const regApi = {
  register: (eventId, notes) => api(`/registrations/events/${eventId}`, {
    method: 'POST', body: JSON.stringify({ notes })
  }),
  cancel:  (eventId) => api(`/registrations/events/${eventId}`, { method: 'DELETE' }),
  checkIn: (code)    => api('/registrations/checkin', {
    method: 'POST', body: JSON.stringify({ ticketCode: code })
  }),
  mine: () => api('/registrations/mine?size=50'),
}
