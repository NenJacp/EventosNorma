import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/admin-dashboard.css'

const initialUsers = [
    { id: 1, name: 'Ana García', email: 'ana@correo.com', role: 'user', joined: '2026-02-01' },
    { id: 2, name: 'Jorge López', email: 'jorge@correo.com', role: 'user', joined: '2026-02-14' },
    { id: 3, name: 'María Pérez', email: 'maria@correo.com', role: 'user', joined: '2026-03-04' },
    { id: 4, name: 'Admin Principal', email: 'admin@eventos.com', role: 'admin', joined: '2026-01-01' },
]

const initialEvents = [
    { id: 101, title: 'DevFest LATAM 2026', date: '2026-03-27', place: 'CDMX', attendees: 342 },
    { id: 102, title: 'Frontend Meetup', date: '2026-04-03', place: 'Guadalajara', attendees: 120 },
    { id: 103, title: 'UX & Diseño en Comunidad', date: '2026-04-15', place: 'Monterrey', attendees: 89 },
]

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [users, setUsers] = useState(initialUsers)
    const [events, setEvents] = useState(initialEvents)
    const [query, setQuery] = useState('')
    const [menuOpen, setMenuOpen] = useState(false)

    const totalAttendees = useMemo(
        () => events.reduce((acc, ev) => acc + (ev.attendees || 0), 0),
        [events]
    )

    const filteredUsers = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return users
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                u.role.toLowerCase().includes(q)
        )
    }, [users, query])

    const filteredEvents = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return events
        return events.filter(
            (e) =>
                e.title.toLowerCase().includes(q) ||
                e.place.toLowerCase().includes(q) ||
                e.date.toLowerCase().includes(q)
        )
    }, [events, query])

    const deleteUser = (id) => {
        const user = users.find((u) => u.id === id)
        if (!user) return
        if (user.role === 'admin') {
            alert('No puedes eliminar un administrador.')
            return
        }
        if (!window.confirm(`¿Eliminar a ${user.name}?`)) return
        setUsers((prev) => prev.filter((u) => u.id !== id))
    }

    const deleteEvent = (id) => {
        const event = events.find((e) => e.id === id)
        if (!event) return
        if (!window.confirm(`¿Eliminar evento "${event.title}"?`)) return
        setEvents((prev) => prev.filter((e) => e.id !== id))
    }

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
                <div className="brand">EVENTOS ADMIN</div>

                <nav className="menu">
                    <button className="menu-item active">Resumen</button>
                    <button className="menu-item">Usuarios</button>
                    <button className="menu-item">Eventos</button>
                </nav>

                <div className="sidebar-footer">
                    <button className="btn danger" onClick={() => navigate('/login')}>
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div className="head-left">
                        <button className="menu-toggle" onClick={() => setMenuOpen((v) => !v)}>
                            ☰
                        </button>
                        <div>
                            <h1>Panel de Administración</h1>
                            <p>Gestión completa de usuarios y eventos</p>
                        </div>
                    </div>

                    <div className="search-wrap">
                        <input
                            type="text"
                            placeholder="Buscar usuarios o eventos..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </header>

                <section className="kpis">
                    <article className="kpi">
                        <span>Usuarios</span>
                        <strong>{users.length}</strong>
                    </article>
                    <article className="kpi">
                        <span>Eventos</span>
                        <strong>{events.length}</strong>
                    </article>
                    <article className="kpi">
                        <span>Asistentes</span>
                        <strong>{totalAttendees}</strong>
                    </article>
                </section>

                <section className="grid">
                    <article className="card">
                        <div className="card-head">
                            <h2>Usuarios registrados</h2>
                            <small>{filteredUsers.length} resultados</small>
                        </div>

                        <div className="table-scroll">
                            <table>
                                <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Registro</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty">Sin resultados</td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <tr key={u.id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="avatar-sm">{u.name.slice(0, 2).toUpperCase()}</div>
                                                    <span>{u.name}</span>
                                                </div>
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`badge ${u.role}`}>{u.role}</span>
                                            </td>
                                            <td>{u.joined}</td>
                                            <td className="td-actions">
                                                <button
                                                    className="icon-btn delete"
                                                    onClick={() => deleteUser(u.id)}
                                                    disabled={u.role === 'admin'}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </article>

                    <article className="card">
                        <div className="card-head">
                            <h2>Eventos publicados</h2>
                            <small>{filteredEvents.length} resultados</small>
                        </div>

                        <div className="table-scroll">
                            <table>
                                <thead>
                                <tr>
                                    <th>Evento</th>
                                    <th>Fecha</th>
                                    <th>Ciudad</th>
                                    <th>Asistentes</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredEvents.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty">Sin resultados</td>
                                    </tr>
                                ) : (
                                    filteredEvents.map((ev) => (
                                        <tr key={ev.id}>
                                            <td className="event-title">{ev.title}</td>
                                            <td>{ev.date}</td>
                                            <td>{ev.place}</td>
                                            <td>{ev.attendees}</td>
                                            <td className="td-actions">
                                                <button className="icon-btn delete" onClick={() => deleteEvent(ev.id)}>
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    )
}