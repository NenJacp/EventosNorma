import { Link, useNavigate } from 'react-router-dom'
import '../styles/perfil.css'

const user = {
    name: 'Ana García',
}

const registeredEvents = [
    {
        id: 1,
        day: '27',
        mon: 'Mar',
        title: 'DevFest LATAM 2026',
        place: 'CDMX',
    },
    {
        id: 2,
        day: '03',
        mon: 'Abr',
        title: 'Frontend Meetup',
        place: 'Guadalajara',
    },
    {
        id: 3,
        day: '15',
        mon: 'Abr',
        title: 'UX & Diseño en Comunidad',
        place: 'Monterrey',
    },
]

export default function Perfil() {
    const navigate = useNavigate()

    return (
        <div className="profile-app">
            {/* TOPBAR */}
            <header className="profile-topbar">
                <div className="profile-topbar-brand">Eventos</div>

                <div className="profile-topbar-center">
                    <div className="profile-topbar-greeting">MI PERFIL</div>
                    <div className="profile-topbar-sub">Información de usuario y eventos registrados</div>
                </div>

                <div className="profile-topbar-right">
                    <button className="btn-new" onClick={() => navigate('/dashboard')}>
                        Volver al dashboard
                    </button>
                    <div className="avatar">AG</div>
                </div>
            </header>

            {/* SIDEBAR */}
            <aside className="profile-sidebar">
                <Link to="/dashboard" className="nav-item">
                    <span>Inicio</span>
                </Link>

                <Link to="/perfil" className="nav-item active">
                    <span>Perfil</span>
                </Link>

                <div className="nav-item" onClick={() => navigate('/login')}>
                    <span>Cerrar sesión</span>
                </div>
            </aside>

            {/* MAIN */}
            <main className="profile-main">
                <div className="profile-grid">
                    {/* CARD USUARIO */}
                    <section className="panel">
                        <div className="panel-title">Datos del usuario</div>

                        <div className="user-card">
                            <div className="user-avatar-lg">AG</div>
                            <div>
                                <p className="user-label">Nombre</p>
                                <h2 className="user-name">{user.name}</h2>
                            </div>
                        </div>
                    </section>

                    {/* CARD EVENTOS */}
                    <section className="panel">
                        <div className="panel-title">Eventos registrados</div>

                        <div className="events-list">
                            {registeredEvents.map((ev) => (
                                <article className="ev-row" key={ev.id}>
                                    <div className="ev-date-box">
                                        <div className="ev-day">{ev.day}</div>
                                        <div className="ev-mon">{ev.mon}</div>
                                    </div>

                                    <div className="ev-info">
                                        <h3 className="ev-name">{ev.title}</h3>
                                        <p className="ev-loc">{ev.place}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}